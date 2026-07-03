import { Alert, Button, Divider, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { createProperty, fetchNeighborhoods, fetchPropertyTypes, updateProperty, uploadPropertyImage } from "../../../api/client";
import type { Currency, NeighborhoodOption, Operation, Property, PropertyImageInput, PropertyTypeOption } from "../../../types/property";
import { ImageUploader } from "./ImageUploader";

const MAX_IMAGES = 15;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png"]);

type PropertyFormProps = {
  selectedProperty: Property | null;
  onSaved: (property: Property) => void;
  onCancelEdit: () => void;
};

// Una imagen ya persistida (viene del backend, con publicId real) o un archivo
// elegido en el form que todavía no se subió a Cloudinary (recién se sube al guardar).
export type ImageEntry =
  | { status: "uploaded"; url: string; publicId: string; width: number | null; height: number | null; format: string | null; bytes: number | null }
  | { status: "pending"; file: File; previewUrl: string };

type FormState = {
  operation: Operation;
  type: string;
  title: string;
  description: string;
  price: string;
  currency: Currency;
  neighborhood: string;
  city: string;
  rooms: string;
  coveredM2: string;
  totalM2: string;
  images: ImageEntry[];
};

function toFormState(property: Property | null): FormState {
  if (!property) {
    return {
      operation: "sale",
      type: "",
      title: "",
      description: "",
      price: "",
      currency: "USD",
      neighborhood: "",
      city: "CABA",
      rooms: "",
      coveredM2: "",
      totalM2: "",
      images: [],
    };
  }

  return {
    operation: property.operation,
    type: property.type,
    title: property.title,
    description: property.description,
    price: property.price,
    currency: property.currency,
    neighborhood: property.neighborhood,
    city: "CABA",
    rooms: String(property.rooms),
    coveredM2: property.coveredM2,
    totalM2: property.totalM2 ?? "",
    images: property.images.map((image) => ({
      status: "uploaded" as const,
      url: image.url,
      publicId: image.publicId ?? "",
      width: image.width,
      height: image.height,
      format: image.format,
      bytes: image.bytes,
    })),
  };
}

function revokePendingPreviews(images: ImageEntry[]) {
  for (const image of images) {
    if (image.status === "pending") {
      URL.revokeObjectURL(image.previewUrl);
    }
  }
}

async function resolveImages(images: ImageEntry[]): Promise<PropertyImageInput[]> {
  const resolved: PropertyImageInput[] = [];
  for (const image of images) {
    if (image.status === "uploaded") {
      resolved.push({
        url: image.url,
        publicId: image.publicId,
        sortOrder: 0,
        width: image.width,
        height: image.height,
        format: image.format,
        bytes: image.bytes,
      });
      continue;
    }
    const uploaded = await uploadPropertyImage(image.file);
    resolved.push({
      url: uploaded.secureUrl,
      publicId: uploaded.publicId,
      sortOrder: 0,
      width: uploaded.width,
      height: uploaded.height,
      format: uploaded.format,
      bytes: uploaded.bytes,
    });
  }
  return resolved.map((image, index) => ({ ...image, sortOrder: index }));
}

export function PropertyForm({ selectedProperty, onSaved, onCancelEdit }: PropertyFormProps) {
  const [state, setState] = useState<FormState>(() => toFormState(selectedProperty));
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeOption[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const imagesRef = useRef<ImageEntry[]>(state.images);

  useEffect(() => {
    imagesRef.current = state.images;
  }, [state.images]);

  // Los previews de imágenes pendientes son object URLs locales: hay que liberarlos
  // al desmontar o al cambiar de propiedad para no perder la memoria de esos blobs.
  useEffect(() => {
    return () => revokePendingPreviews(imagesRef.current);
  }, []);

  useEffect(() => {
    revokePendingPreviews(imagesRef.current);
    setState(toFormState(selectedProperty));
    setError(null);
    setSuccess(null);
  }, [selectedProperty]);

  useEffect(() => {
    let isMounted = true;

    async function loadPropertyTypes() {
      setLoadingTypes(true);
      try {
        const response = await fetchPropertyTypes();
        if (!isMounted) {
          return;
        }
        setPropertyTypes(response.data);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }
        setError(loadError instanceof Error ? loadError.message : "No se pudo cargar el catálogo de tipos");
      } finally {
        if (isMounted) {
          setLoadingTypes(false);
        }
      }
    }

    void loadPropertyTypes();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadNeighborhoods() {
      setLoadingNeighborhoods(true);
      try {
        const response = await fetchNeighborhoods();
        if (!isMounted) {
          return;
        }
        setNeighborhoods(response.data);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }
        setError(loadError instanceof Error ? loadError.message : "No se pudo cargar el catálogo de barrios");
      } finally {
        if (isMounted) {
          setLoadingNeighborhoods(false);
        }
      }
    }

    void loadNeighborhoods();

    return () => {
      isMounted = false;
    };
  }, []);

  const isEditing = Boolean(selectedProperty);
  const headerText = useMemo(
    () => (isEditing ? `Editando: ${selectedProperty?.title ?? ""}` : "Nueva propiedad"),
    [isEditing, selectedProperty]
  );

  function handleFilesSelected(files: FileList) {
    setError(null);
    setSuccess(null);

    const pending = Array.from(files);
    if (state.images.length + pending.length > MAX_IMAGES) {
      setError(`Solo podés cargar hasta ${MAX_IMAGES} imágenes por propiedad.`);
      return;
    }

    for (const file of pending) {
      if (!ALLOWED_MIME_TYPES.has(file.type)) {
        setError(`Formato inválido para ${file.name}. Solo JPG y PNG.`);
        return;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setError(`El archivo ${file.name} excede el límite de 8MB.`);
        return;
      }
    }

    // No se sube nada a Cloudinary todavía: solo se guarda un preview local.
    // La subida real ocurre recién en handleSubmit, al confirmar el guardado.
    const newEntries: ImageEntry[] = pending.map((file) => ({
      status: "pending",
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setState((prev) => ({ ...prev, images: [...prev.images, ...newEntries] }));
  }

  function handleRemoveImage(index: number) {
    setState((prev) => {
      const target = prev.images[index];
      if (target.status === "pending") {
        URL.revokeObjectURL(target.previewUrl);
      }
      return { ...prev, images: prev.images.filter((_image, imageIndex) => imageIndex !== index) };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (state.images.length < 1) {
      setError("Debes cargar al menos una imagen.");
      return;
    }

    const rooms = Number(state.rooms);
    if (!Number.isInteger(rooms) || rooms < 0) {
      setError("El campo ambientes debe ser un entero válido.");
      return;
    }

    setSaving(true);

    let images: PropertyImageInput[];
    try {
      images = await resolveImages(state.images);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "No se pudo subir una imagen");
      setSaving(false);
      return;
    }

    const payload = {
      operation: state.operation,
      type: state.type.trim(),
      title: state.title.trim(),
      description: state.description.trim(),
      price: state.price.trim(),
      currency: state.currency,
      neighborhood: state.neighborhood.trim(),
      city: "CABA",
      rooms,
      coveredM2: state.coveredM2.trim(),
      totalM2: state.totalM2.trim() ? state.totalM2.trim() : null,
      images,
    };

    try {
      const response = selectedProperty
        ? await updateProperty(selectedProperty.id, payload)
        : await createProperty(payload);
      onSaved(response.data);
      setSuccess(selectedProperty ? "Propiedad actualizada correctamente." : "Propiedad creada correctamente.");
      revokePendingPreviews(state.images);
      setState(selectedProperty ? toFormState(response.data) : toFormState(null));
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "No se pudo guardar la propiedad");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Stack component="form" spacing={2} onSubmit={handleSubmit}>
      <Typography variant="h6">{headerText}</Typography>
      {error ? <Alert severity="error">{error}</Alert> : null}
      {success ? <Alert severity="success">{success}</Alert> : null}

      <TextField
        select
        label="Operación"
        value={state.operation}
        onChange={(event) => setState((prev) => ({ ...prev, operation: event.target.value as Operation }))}
      >
        <MenuItem value="sale">Venta</MenuItem>
        <MenuItem value="rent">Alquiler</MenuItem>
      </TextField>
      <TextField
        select
        label="Tipo"
        value={state.type}
        onChange={(event) => setState((prev) => ({ ...prev, type: event.target.value }))}
        required
        disabled={loadingTypes}
        helperText={loadingTypes ? "Cargando tipos..." : undefined}
      >
        {propertyTypes.map((propertyType) => (
          <MenuItem key={propertyType.id} value={propertyType.name}>
            {propertyType.name}
          </MenuItem>
        ))}
        {state.type && !propertyTypes.some((propertyType) => propertyType.name === state.type) ? (
          <MenuItem value={state.type}>{state.type}</MenuItem>
        ) : null}
      </TextField>
      <TextField label="Título" value={state.title} onChange={(event) => setState((prev) => ({ ...prev, title: event.target.value }))} required />
      <TextField
        label="Descripción"
        multiline
        minRows={3}
        value={state.description}
        onChange={(event) => setState((prev) => ({ ...prev, description: event.target.value }))}
        required
      />
      <TextField label="Precio" value={state.price} onChange={(event) => setState((prev) => ({ ...prev, price: event.target.value }))} required />
      <TextField
        select
        label="Moneda"
        value={state.currency}
        onChange={(event) => setState((prev) => ({ ...prev, currency: event.target.value as Currency }))}
      >
        <MenuItem value="USD">USD</MenuItem>
        <MenuItem value="ARS">ARS</MenuItem>
      </TextField>
      <TextField
        select
        label="Barrio"
        value={state.neighborhood}
        onChange={(event) => setState((prev) => ({ ...prev, neighborhood: event.target.value }))}
        required
        disabled={loadingNeighborhoods}
        helperText={loadingNeighborhoods ? "Cargando barrios..." : undefined}
      >
        {neighborhoods.map((neighborhood) => (
          <MenuItem key={neighborhood.id} value={neighborhood.name}>
            {neighborhood.name}
          </MenuItem>
        ))}
        {state.neighborhood && !neighborhoods.some((neighborhood) => neighborhood.name === state.neighborhood) ? (
          <MenuItem value={state.neighborhood}>{state.neighborhood}</MenuItem>
        ) : null}
      </TextField>
      <TextField label="Ciudad" value="CABA" required disabled />
      <TextField
        label="Ambientes"
        type="number"
        value={state.rooms}
        onChange={(event) => setState((prev) => ({ ...prev, rooms: event.target.value }))}
        required
      />
      <TextField
        label="M2 cubiertos"
        value={state.coveredM2}
        onChange={(event) => setState((prev) => ({ ...prev, coveredM2: event.target.value }))}
        required
      />
      <TextField label="M2 totales (opcional)" value={state.totalM2} onChange={(event) => setState((prev) => ({ ...prev, totalM2: event.target.value }))} />

      <Divider />
      <Typography variant="subtitle1">Imágenes</Typography>
      <ImageUploader
        images={state.images}
        disabled={saving}
        maxImages={MAX_IMAGES}
        onFilesSelected={handleFilesSelected}
        onRemoveImage={handleRemoveImage}
        onMoveImage={(from, to) =>
          setState((prev) => {
            const images = prev.images.slice();
            const [moved] = images.splice(from, 1);
            images.splice(to, 0, moved);
            return { ...prev, images };
          })
        }
      />

      <Stack direction="row" spacing={1.5}>
        <Button type="submit" variant="contained" disabled={saving}>
          {saving ? "Guardando..." : isEditing ? "Actualizar propiedad" : "Crear propiedad"}
        </Button>
        {isEditing ? (
          <Button type="button" variant="outlined" onClick={onCancelEdit} disabled={saving}>
            Cancelar edición
          </Button>
        ) : null}
      </Stack>
    </Stack>
  );
}
