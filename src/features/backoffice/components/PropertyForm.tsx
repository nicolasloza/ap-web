import { Alert, Button, Divider, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState, type FormEvent } from "react";
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
  images: PropertyImageInput[];
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
    images: property.images.map((image, index) => ({
      url: image.url,
      publicId: image.publicId ?? "",
      sortOrder: index,
      width: image.width,
      height: image.height,
      format: image.format,
      bytes: image.bytes,
    })),
  };
}

function withSortOrder(images: PropertyImageInput[]) {
  return images.map((image, index) => ({ ...image, sortOrder: index }));
}

export function PropertyForm({ selectedProperty, onSaved, onCancelEdit }: PropertyFormProps) {
  const [state, setState] = useState<FormState>(() => toFormState(selectedProperty));
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeOption[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
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

  async function handleUpload(files: FileList) {
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

    setUploading(true);
    try {
      const uploadedImages: PropertyImageInput[] = [];
      for (const file of pending) {
        const uploaded = await uploadPropertyImage(file);
        uploadedImages.push({
          url: uploaded.secureUrl,
          publicId: uploaded.publicId,
          sortOrder: 0,
          width: uploaded.width,
          height: uploaded.height,
          format: uploaded.format,
          bytes: uploaded.bytes,
        });
      }
      setState((prev) => ({ ...prev, images: withSortOrder([...prev.images, ...uploadedImages]) }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "No se pudo subir la imagen");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (state.images.length < 1) {
      setError("Debes cargar al menos una imagen.");
      return;
    }
    if (state.images.some((image) => !image.publicId.trim())) {
      setError("Hay imágenes sin publicId. Reemplazalas por imágenes subidas a Cloudinary.");
      return;
    }

    const rooms = Number(state.rooms);
    if (!Number.isInteger(rooms) || rooms < 0) {
      setError("El campo ambientes debe ser un entero válido.");
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
      images: withSortOrder(state.images),
    };

    setSaving(true);
    try {
      const response = selectedProperty
        ? await updateProperty(selectedProperty.id, payload)
        : await createProperty(payload);
      onSaved(response.data);
      setSuccess(selectedProperty ? "Propiedad actualizada correctamente." : "Propiedad creada correctamente.");
      if (!selectedProperty) {
        setState(toFormState(null));
      }
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
        uploading={uploading}
        maxImages={MAX_IMAGES}
        onFilesSelected={handleUpload}
        onRemoveImage={(index) =>
          setState((prev) => ({
            ...prev,
            images: withSortOrder(prev.images.filter((_image, imageIndex) => imageIndex !== index)),
          }))
        }
        onMoveImage={(from, to) =>
          setState((prev) => {
            const images = prev.images.slice();
            const [moved] = images.splice(from, 1);
            images.splice(to, 0, moved);
            return { ...prev, images: withSortOrder(images) };
          })
        }
      />

      <Stack direction="row" spacing={1.5}>
        <Button type="submit" variant="contained" disabled={saving || uploading}>
          {saving ? "Guardando..." : isEditing ? "Actualizar propiedad" : "Crear propiedad"}
        </Button>
        {isEditing ? (
          <Button type="button" variant="outlined" onClick={onCancelEdit} disabled={saving || uploading}>
            Cancelar edición
          </Button>
        ) : null}
      </Stack>
    </Stack>
  );
}
