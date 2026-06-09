import { Box, Button, Card, CardMedia, IconButton, Stack, Typography } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteIcon from "@mui/icons-material/Delete";
import type { PropertyImageInput } from "../../../types/property";

type ImageUploaderProps = {
  images: PropertyImageInput[];
  onFilesSelected: (files: FileList) => void;
  onRemoveImage: (index: number) => void;
  onMoveImage: (from: number, to: number) => void;
  uploading: boolean;
  maxImages: number;
};

export function ImageUploader({
  images,
  onFilesSelected,
  onRemoveImage,
  onMoveImage,
  uploading,
  maxImages,
}: ImageUploaderProps) {
  return (
    <Stack spacing={1.5}>
      <Button component="label" variant="outlined" disabled={uploading || images.length >= maxImages}>
        {uploading ? "Subiendo..." : "Agregar imágenes (JPG/PNG)"}
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
        {images.length}/{maxImages} imágenes
      </Typography>

      <Stack spacing={1}>
        {images.map((image, index) => (
          <Card key={`${image.publicId}-${index}`} variant="outlined" sx={{ p: 1 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <CardMedia component="img" image={image.url} alt={`Imagen ${index + 1}`} sx={{ width: 96, height: 72 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" noWrap>
                  {image.publicId || "Sin publicId"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Orden: {index + 1}
                </Typography>
              </Box>
              <IconButton
                size="small"
                aria-label="Mover arriba"
                disabled={index === 0}
                onClick={() => onMoveImage(index, index - 1)}
              >
                <ArrowUpwardIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                aria-label="Mover abajo"
                disabled={index === images.length - 1}
                onClick={() => onMoveImage(index, index + 1)}
              >
                <ArrowDownwardIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" aria-label="Eliminar imagen" onClick={() => onRemoveImage(index)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
