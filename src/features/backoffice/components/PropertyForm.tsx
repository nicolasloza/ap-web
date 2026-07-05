import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import HouseSidingOutlinedIcon from "@mui/icons-material/HouseSidingOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import GoogleMapEmbed from "../../../components/common/GoogleMapEmbed";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  createProperty,
  fetchAmenities,
  fetchNeighborhoods,
  fetchPropertyTypes,
  updateProperty,
  uploadPropertyImage,
} from "../../../api/client";
import type {
  AmenityOption,
  Currency,
  NeighborhoodOption,
  Operation,
  Property,
  PropertyImageInput,
  PropertyStatus,
  PropertyTypeOption,
} from "../../../types/property";
import { FONT_MONO } from "../../../theme/tokens";
import { ImageUploader } from "./ImageUploader";

const MAX_IMAGES = 15;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png"]);

type PropertyFormProps = {
  selectedProperty: Property | null;
  onSaved: (property: Property) => void;
  onCancel: () => void;
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
  address: string;
  description: string;
  price: string;
  currency: Currency;
  neighborhood: string;
  city: string;
  rooms: string;
  bedrooms: string;
  bathrooms: string;
  coveredM2: string;
  totalM2: string;
  status: PropertyStatus;
  active: boolean;
  amenities: string[];
  images: ImageEntry[];
};

const STATUS_OPTIONS_BY_OPERATION: Record<Operation, readonly { value: PropertyStatus; label: string }[]> = {
  sale: [
    { value: "available", label: "Disponible" },
    { value: "reserved", label: "Reservada" },
    { value: "sold", label: "Vendida" },
  ],
  rent: [
    { value: "available", label: "Disponible" },
    { value: "rented", label: "Alquilada" },
  ],
};

function toFormState(property: Property | null): FormState {
  if (!property) {
    return {
      operation: "sale",
      type: "",
      title: "",
      address: "",
      description: "",
      price: "",
      currency: "USD",
      neighborhood: "",
      city: "CABA",
      rooms: "",
      bedrooms: "",
      bathrooms: "",
      coveredM2: "",
      totalM2: "",
      status: "available",
      active: true,
      amenities: [],
      images: [],
    };
  }

  return {
    operation: property.operation,
    type: property.type,
    title: property.title,
    address: property.address,
    description: property.description,
    price: property.price,
    currency: property.currency,
    neighborhood: property.neighborhood,
    city: "CABA",
    rooms: String(property.rooms),
    bedrooms: String(property.bedrooms),
    bathrooms: String(property.bathrooms),
    coveredM2: property.coveredM2,
    totalM2: property.totalM2 ?? "",
    status: property.status,
    active: property.active,
    amenities: property.amenities,
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

function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2.5, color: "primary.main" }}>
      {icon}
      <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
        {title}
      </Typography>
    </Stack>
  );
}

function FieldLabel({ children }: { children: string }) {
  return (
    <Typography sx={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.08em", color: "text.secondary", mb: 0.5 }}>
      {children}
    </Typography>
  );
}

export function PropertyForm({ selectedProperty, onSaved, onCancel }: PropertyFormProps) {
  const [state, setState] = useState<FormState>(() => toFormState(selectedProperty));
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeOption[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodOption[]>([]);
  const [amenityOptions, setAmenityOptions] = useState<AmenityOption[]>([]);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const imagesRef = useRef<ImageEntry[]>(state.images);

  useEffect(() => {
    imagesRef.current = state.images;
  }, [state.images]);

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
    void fetchPropertyTypes().then((r) => {
      if (isMounted) setPropertyTypes(r.data);
    }).catch(() => {});
    void fetchNeighborhoods().then((r) => {
      if (isMounted) setNeighborhoods(r.data);
    }).catch(() => {});
    void fetchAmenities().then((r) => {
      if (isMounted) setAmenityOptions(r.data);
    }).catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const isEditing = Boolean(selectedProperty);

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

  function toggleAmenity(name: string) {
    setState((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(name)
        ? prev.amenities.filter((a) => a !== name)
        : [...prev.amenities, name],
    }));
  }

  async function submit(published: boolean) {
    setError(null);
    setSuccess(null);

    if (state.images.length < 1) {
      setError("Debes cargar al menos una imagen.");
      return;
    }

    const rooms = Number(state.rooms);
    const bedrooms = Number(state.bedrooms || 0);
    const bathrooms = Number(state.bathrooms || 0);
    if (!Number.isInteger(rooms) || rooms < 0) {
      setError("El campo ambientes debe ser un entero válido.");
      return;
    }

    setSaving(published ? "publish" : "draft");

    let images: PropertyImageInput[];
    try {
      images = await resolveImages(state.images);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "No se pudo subir una imagen");
      setSaving(null);
      return;
    }

    const payload = {
      operation: state.operation,
      type: state.type.trim(),
      title: state.title.trim(),
      address: state.address.trim(),
      description: state.description.trim(),
      price: state.price.trim(),
      currency: state.currency,
      neighborhood: state.neighborhood.trim(),
      city: "CABA",
      rooms,
      bedrooms,
      bathrooms,
      coveredM2: state.coveredM2.trim(),
      totalM2: state.totalM2.trim() ? state.totalM2.trim() : null,
      published,
      active: state.active,
      status: state.status,
      amenities: state.amenities,
      images,
    };

    try {
      const response = selectedProperty
        ? await updateProperty(selectedProperty.id, payload)
        : await createProperty(payload);
      onSaved(response.data);
      setSuccess(published ? "Propiedad publicada correctamente." : "Borrador guardado correctamente.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "No se pudo guardar la propiedad");
    } finally {
      setSaving(null);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submit(true);
  }

  const missingFields = useMemo(() => {
    const missing: string[] = [];
    if (!state.title.trim()) missing.push("Título de la propiedad");
    if (!state.type.trim()) missing.push("Tipo de propiedad");
    if (!state.price.trim()) missing.push("Precio");
    if (!state.description.trim()) missing.push("Descripción");
    if (!state.address.trim()) missing.push("Dirección");
    if (!state.neighborhood.trim()) missing.push("Barrio");
    if (!state.rooms.trim() || Number(state.rooms) < 0) missing.push("Ambientes");
    if (!state.coveredM2.trim()) missing.push("M2 cubiertos");
    if (state.images.length < 1) missing.push("Al menos una imagen");
    return missing;
  }, [state]);

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      {success ? <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert> : null}

      <Grid container spacing={3}>
        {/* Columna principal */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 } }}>
              <SectionHeading icon={<InfoOutlinedIcon />} title="Información General" />
              <Stack spacing={2}>
                <Box>
                  <FieldLabel>Título de la propiedad</FieldLabel>
                  <TextField
                    value={state.title}
                    onChange={(e) => setState((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Ej: Departamento Moderno en Recoleta"
                    fullWidth
                    required
                  />
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FieldLabel>Tipo de operación</FieldLabel>
                    <TextField
                      select
                      fullWidth
                      value={state.operation}
                      onChange={(e) => {
                        const operation = e.target.value as Operation;
                        setState((prev) => ({
                          ...prev,
                          operation,
                          status: STATUS_OPTIONS_BY_OPERATION[operation].some((o) => o.value === prev.status)
                            ? prev.status
                            : "available",
                        }));
                      }}
                    >
                      <MenuItem value="sale">Venta</MenuItem>
                      <MenuItem value="rent">Alquiler</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 8 }}>
                    <FieldLabel>Precio</FieldLabel>
                    <Stack direction="row" spacing={1}>
                      <TextField
                        select
                        value={state.currency}
                        onChange={(e) => setState((prev) => ({ ...prev, currency: e.target.value as Currency }))}
                        sx={{ width: 100 }}
                      >
                        <MenuItem value="USD">USD</MenuItem>
                        <MenuItem value="ARS">ARS</MenuItem>
                      </TextField>
                      <TextField
                        value={state.price}
                        onChange={(e) => setState((prev) => ({ ...prev, price: e.target.value }))}
                        placeholder="0.00"
                        fullWidth
                        required
                      />
                    </Stack>
                  </Grid>
                </Grid>
                <Box>
                  <FieldLabel>Tipo de propiedad</FieldLabel>
                  <TextField
                    select
                    fullWidth
                    value={state.type}
                    onChange={(e) => setState((prev) => ({ ...prev, type: e.target.value }))}
                    required
                  >
                    {propertyTypes.map((propertyType) => (
                      <MenuItem key={propertyType.id} value={propertyType.name}>
                        {propertyType.name}
                      </MenuItem>
                    ))}
                    {state.type && !propertyTypes.some((t) => t.name === state.type) ? (
                      <MenuItem value={state.type}>{state.type}</MenuItem>
                    ) : null}
                  </TextField>
                </Box>
                <Box>
                  <FieldLabel>Descripción</FieldLabel>
                  <TextField
                    value={state.description}
                    onChange={(e) => setState((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describí los detalles principales de la propiedad..."
                    multiline
                    minRows={4}
                    fullWidth
                    required
                  />
                </Box>
                <Box>
                  <FieldLabel>Estado comercial</FieldLabel>
                  <ToggleButtonGroup
                    value={state.status}
                    exclusive
                    onChange={(_e, value: PropertyStatus | null) => {
                      if (value) setState((prev) => ({ ...prev, status: value }));
                    }}
                    sx={{ width: "100%" }}
                  >
                    {STATUS_OPTIONS_BY_OPERATION[state.operation].map((option) => (
                      <ToggleButton key={option.value} value={option.value} sx={{ flex: 1, fontFamily: FONT_MONO, fontSize: 12 }}>
                        {option.label}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Box>
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 } }}>
              <SectionHeading icon={<LocationOnOutlinedIcon />} title="Ubicación" />
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 8 }}>
                    <FieldLabel>Dirección</FieldLabel>
                    <TextField
                      value={state.address}
                      onChange={(e) => setState((prev) => ({ ...prev, address: e.target.value }))}
                      placeholder="Ej: Av. Corrientes 1000"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FieldLabel>Ciudad</FieldLabel>
                    <TextField value="CABA" fullWidth disabled />
                  </Grid>
                </Grid>
                <Box>
                  <FieldLabel>Barrio</FieldLabel>
                  <TextField
                    select
                    fullWidth
                    value={state.neighborhood}
                    onChange={(e) => setState((prev) => ({ ...prev, neighborhood: e.target.value }))}
                    required
                  >
                    {neighborhoods.map((n) => (
                      <MenuItem key={n.id} value={n.name}>
                        {n.name}
                      </MenuItem>
                    ))}
                    {state.neighborhood && !neighborhoods.some((n) => n.name === state.neighborhood) ? (
                      <MenuItem value={state.neighborhood}>{state.neighborhood}</MenuItem>
                    ) : null}
                  </TextField>
                </Box>

                <GoogleMapEmbed
                  address={[state.address, state.neighborhood, "CABA, Argentina"].filter(Boolean).join(", ")}
                  height={{ xs: 200, sm: 240 }}
                />
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 } }}>
              <SectionHeading icon={<HouseSidingOutlinedIcon />} title="Características" />
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <FieldLabel>Ambientes</FieldLabel>
                  <TextField
                    type="number"
                    value={state.rooms}
                    onChange={(e) => setState((prev) => ({ ...prev, rooms: e.target.value }))}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <FieldLabel>Dormitorios</FieldLabel>
                  <TextField
                    type="number"
                    value={state.bedrooms}
                    onChange={(e) => setState((prev) => ({ ...prev, bedrooms: e.target.value }))}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <FieldLabel>Baños</FieldLabel>
                  <TextField
                    type="number"
                    value={state.bathrooms}
                    onChange={(e) => setState((prev) => ({ ...prev, bathrooms: e.target.value }))}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <FieldLabel>Sup. total m²</FieldLabel>
                  <TextField
                    value={state.totalM2}
                    onChange={(e) => setState((prev) => ({ ...prev, totalM2: e.target.value }))}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FieldLabel>M2 cubiertos</FieldLabel>
                  <TextField
                    value={state.coveredM2}
                    onChange={(e) => setState((prev) => ({ ...prev, coveredM2: e.target.value }))}
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>

              <FieldLabel>Comodidades y amenities</FieldLabel>
              <Grid container>
                {amenityOptions.map((amenity) => (
                  <Grid key={amenity.id} size={{ xs: 6, sm: 4 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.amenities.includes(amenity.name)}
                          onChange={() => toggleAmenity(amenity.name)}
                        />
                      }
                      label={amenity.name}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Stack>
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3} sx={{ position: { md: "sticky" }, top: { md: 24 } }}>
            <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 } }}>
              <SectionHeading icon={<PhotoCameraOutlinedIcon />} title="Multimedia" />
              <ImageUploader
                images={state.images}
                disabled={saving !== null}
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
            </Paper>

            <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Typography sx={{ fontFamily: FONT_MONO, fontSize: 12, letterSpacing: "0.08em", color: "primary.main", mb: 1 }}>
                {isEditing && selectedProperty?.published ? "PUBLICADA" : "BORRADOR"}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2.5 }}>
                {isEditing
                  ? "Guardá los cambios o publicá esta propiedad en el sitio."
                  : "Guardá como borrador para revisión, o publicala directamente en el sitio."}
              </Typography>
              <Stack spacing={1.25}>
                <Tooltip
                  title={
                    missingFields.length > 0 ? (
                      <>
                        Faltan completar: {missingFields.join(", ")}
                      </>
                    ) : (
                      ""
                    )
                  }
                >
                  <span>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={saving !== null || missingFields.length > 0}
                      sx={{ fontFamily: FONT_MONO, fontSize: 13, letterSpacing: "0.06em" }}
                    >
                      {saving === "publish" ? "Publicando..." : "Publicar"}
                    </Button>
                  </span>
                </Tooltip>
                <Button
                  type="button"
                  variant="outlined"
                  disabled={saving !== null}
                  onClick={() => void submit(false)}
                >
                  {saving === "draft" ? "Guardando..." : "Guardar como borrador"}
                </Button>
                <Divider sx={{ my: 0.5 }} />
                <Button type="button" variant="text" color="inherit" onClick={onCancel} disabled={saving !== null}>
                  Cancelar
                </Button>
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 } }}>
              <FormControlLabel
                sx={{ ml: 0, width: "100%", justifyContent: "space-between" }}
                labelPlacement="start"
                control={
                  <Switch
                    checked={state.active}
                    onChange={(e) => setState((prev) => ({ ...prev, active: e.target.checked }))}
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>Publicada</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Habilita o deshabilita la visibilidad de esta propiedad en el sitio.
                    </Typography>
                  </Box>
                }
              />
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
