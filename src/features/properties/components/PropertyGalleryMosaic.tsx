import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { FONT_MONO } from "../../../theme/tokens";
import type { PropertyImage } from "../../../types/property";

type PropertyGalleryMosaicProps = {
  images: readonly PropertyImage[];
  alt: string;
  onImageClick: (index: number) => void;
};

type TileProps = {
  image: PropertyImage;
  index: number;
  alt: string;
  aspectRatio: string;
  onClick: (index: number) => void;
  badge?: ReactNode;
};

function Tile({ image, index, alt, aspectRatio, onClick, badge }: TileProps) {
  return (
    <Box
      onClick={() => onClick(index)}
      sx={{
        position: "relative",
        aspectRatio,
        overflow: "hidden",
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        cursor: "pointer",
        "&:hover img": { transform: "scale(1.04)" },
        "&:hover .gallery-tile-overlay": { opacity: 1 },
      }}
    >
      <Box
        component="img"
        src={image.url}
        alt={`${alt} — foto ${index + 1}`}
        sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
      />
      <Box
        className="gallery-tile-overlay"
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(19, 19, 19, 0.55)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0,
          transition: "opacity 0.2s ease",
        }}
      >
        {badge}
      </Box>
    </Box>
  );
}

export default function PropertyGalleryMosaic({ images, alt, onImageClick }: PropertyGalleryMosaicProps) {
  if (images.length === 0) return null;

  return (
    <Box sx={{ mb: { xs: 3, md: 5 } }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1.5 }}>
        <Box sx={{ width: 24, height: 2, bgcolor: "primary.main" }} />
        <Typography sx={{ fontFamily: FONT_MONO, fontSize: 12, letterSpacing: "0.1em", color: "primary.main" }}>
          GALERÍA
        </Typography>
      </Stack>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2.5 }}>
        Imágenes de la propiedad
      </Typography>

      {images.length === 1 ? (
        <Tile image={images[0]} index={0} alt={alt} aspectRatio="16 / 9" onClick={onImageClick} />
      ) : images.length < 4 ? (
        <Grid container spacing={1.5}>
          {images.map((image, i) => (
            <Grid key={image.id} size={{ xs: 12, sm: 12 / images.length }}>
              <Tile image={image} index={i} alt={alt} aspectRatio="1 / 1" onClick={onImageClick} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={1.5}>
              <Tile image={images[0]} index={0} alt={alt} aspectRatio="16 / 9" onClick={onImageClick} />
              <Grid container spacing={1.5}>
                <Grid size={6}>
                  <Tile image={images[1]} index={1} alt={alt} aspectRatio="1 / 1" onClick={onImageClick} />
                </Grid>
                <Grid size={6}>
                  <Tile image={images[2]} index={2} alt={alt} aspectRatio="1 / 1" onClick={onImageClick} />
                </Grid>
              </Grid>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Tile
              image={images[3]}
              index={3}
              alt={alt}
              aspectRatio="3 / 4"
              onClick={onImageClick}
              badge={
                images.length > 4 ? (
                  <Typography sx={{ fontFamily: FONT_MONO, fontWeight: 700, color: "primary.main", fontSize: 22 }}>
                    +{images.length - 4}
                  </Typography>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ fontFamily: FONT_MONO, fontSize: 12, letterSpacing: "0.06em" }}
                  >
                    Ver galería completa
                  </Button>
                )
              }
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
