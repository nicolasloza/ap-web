import { Box, Button, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { FONT_MONO } from "../../../theme/tokens";
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
      <Button component="label" variant="outlined" fullWidth disabled={disabled || images.length >= maxImages}>
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
      <Typography sx={{ fontFamily: FONT_MONO, fontSize: 11, color: "text.secondary" }}>
        {images.length}/{maxImages} imágenes · se suben recién al guardar
      </Typography>

      {images.length > 0 ? (
        <Grid container spacing={1}>
          {images.map((image, index) => (
            <Grid key={image.status === "uploaded" ? `${image.publicId}-${index}` : image.previewUrl} size={6}>
              <Box
                sx={{
                  position: "relative",
                  aspectRatio: "4 / 3",
                  borderRadius: 0.75,
                  overflow: "hidden",
                  border: 1,
                  borderColor: "divider",
                  bgcolor: "background.default",
                }}
              >
                <Box
                  component="img"
                  src={image.status === "uploaded" ? image.url : image.previewUrl}
                  alt={`Imagen ${index + 1}`}
                  sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <Typography
                  sx={{
                    position: "absolute",
                    top: 4,
                    left: 4,
                    px: 0.75,
                    py: 0.125,
                    borderRadius: 0.5,
                    bgcolor: "rgba(19, 19, 19, 0.75)",
                    color: "primary.main",
                    fontFamily: FONT_MONO,
                    fontSize: 10,
                  }}
                >
                  {index + 1}
                </Typography>
                <IconButton
                  size="small"
                  aria-label="Eliminar imagen"
                  disabled={disabled}
                  onClick={() => onRemoveImage(index)}
                  sx={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    p: 0.375,
                    bgcolor: "rgba(19, 19, 19, 0.75)",
                    "&:hover": { bgcolor: "rgba(19, 19, 19, 0.9)" },
                  }}
                >
                  <CloseRoundedIcon sx={{ fontSize: 14, color: "common.white" }} />
                </IconButton>
                <Stack
                  direction="row"
                  sx={{
                    position: "absolute",
                    bottom: 2,
                    right: 2,
                  }}
                >
                  <Tooltip title="Mover antes">
                    <span>
                      <IconButton
                        size="small"
                        aria-label="Mover antes"
                        disabled={disabled || index === 0}
                        onClick={() => onMoveImage(index, index - 1)}
                        sx={{ p: 0.375, bgcolor: "rgba(19, 19, 19, 0.75)", "&:hover": { bgcolor: "rgba(19, 19, 19, 0.9)" } }}
                      >
                        <ArrowBackRoundedIcon sx={{ fontSize: 14, color: "common.white" }} />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Mover después">
                    <span>
                      <IconButton
                        size="small"
                        aria-label="Mover después"
                        disabled={disabled || index === images.length - 1}
                        onClick={() => onMoveImage(index, index + 1)}
                        sx={{ p: 0.375, bgcolor: "rgba(19, 19, 19, 0.75)", "&:hover": { bgcolor: "rgba(19, 19, 19, 0.9)" } }}
                      >
                        <ArrowForwardRoundedIcon sx={{ fontSize: 14, color: "common.white" }} />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : null}
    </Stack>
  );
}
