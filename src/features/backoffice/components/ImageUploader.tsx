import { Box, Button, Card, CardMedia, Chip, IconButton, Stack, Typography } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteIcon from "@mui/icons-material/Delete";
import type { ImageEntry } from "./PropertyForm";

type ImageUploaderProps = {
  images: ImageEntry[];
  onFilesSelected: (files: FileList) => void;
  onRemoveImage: (index: number) => void;
  onMoveImage: (from: number, to: number) => void;
  disabled: boolean;
  maxImages: number;
};

export function ImageUploader({
  images,
  onFilesSelected,
  onRemoveImage,
  onMoveImage,
  disabled,
  maxImages,
}: ImageUploaderProps) {
  return (
    <Stack spacing={1.5}>
      <Button component="label" variant="outlined" disabled={disabled || images.length >= maxImages}>
        Agregar imágenes (JPG/PNG)
        <input
          hidden
          multiple
          type="file"
          accept="image/jpeg,image/png"
          onChange={(event) => {
            if (event.target.files && event.target.files.length > 0) {
              onFilesSelected(event.target.files);
              event.target.value = "";
            }
          }}
        />
      </Button>
      <Typography variant="caption" color="text.secondary">
        {images.length}/{maxImages} imágenes · se suben a Cloudinary recién al guardar
      </Typography>

      <Stack spacing={1}>
        {images.map((image, index) => (
          <Card
            key={image.status === "uploaded" ? `${image.publicId}-${index}` : image.previewUrl}
            variant="outlined"
            sx={{ p: 1 }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <CardMedia
                component="img"
                image={image.status === "uploaded" ? image.url : image.previewUrl}
                alt={`Imagen ${index + 1}`}
                sx={{ width: 96, height: 72 }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" noWrap>
                  {image.status === "uploaded" ? image.publicId || "Sin publicId" : image.file.name}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Typography variant="caption" color="text.secondary">
                    Orden: {index + 1}
                  </Typography>
                  {image.status === "pending" ? (
                    <Chip label="Pendiente de subir" size="small" color="warning" variant="outlined" />
                  ) : null}
                </Stack>
              </Box>
              <IconButton
                size="small"
                aria-label="Mover arriba"
                disabled={disabled || index === 0}
                onClick={() => onMoveImage(index, index - 1)}
              >
                <ArrowUpwardIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                aria-label="Mover abajo"
                disabled={disabled || index === images.length - 1}
                onClick={() => onMoveImage(index, index + 1)}
              >
                <ArrowDownwardIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" aria-label="Eliminar imagen" disabled={disabled} onClick={() => onRemoveImage(index)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
