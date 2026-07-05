import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { Box, Dialog, IconButton, Typography } from "@mui/material";
import { FONT_MONO } from "../../../theme/tokens";
import type { PropertyImage } from "../../../types/property";

type PropertyImageLightboxProps = {
  images: readonly PropertyImage[];
  open: boolean;
  initialIndex: number;
  onClose: () => void;
  alt: string;
};

export default function PropertyImageLightbox({ images, open, initialIndex, onClose, alt }: PropertyImageLightboxProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ startIndex: initialIndex });
  const [, setRevision] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setRevision((r) => r + 1);
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (open && emblaApi) {
      emblaApi.scrollTo(initialIndex, true);
    }
  }, [open, emblaApi, initialIndex]);

  const selectedIndex = emblaApi?.selectedScrollSnap() ?? initialIndex;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      slotProps={{ paper: { sx: { bgcolor: "rgba(10, 10, 10, 0.97)" } } }}
    >
      <IconButton
        aria-label="Cerrar galería"
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 2,
          color: "common.white",
          bgcolor: "rgba(0, 0, 0, 0.4)",
          "&:hover": { bgcolor: "rgba(0, 0, 0, 0.6)" },
        }}
      >
        <CloseRoundedIcon />
      </IconButton>

      <Box sx={{ position: "relative", height: "100%", display: "flex", alignItems: "center" }}>
        <Box ref={emblaRef} sx={{ overflow: "hidden", width: "100%" }}>
          <Box sx={{ display: "flex" }}>
            {images.map((img, i) => (
              <Box
                key={img.id}
                sx={{
                  flex: "0 0 100%",
                  minWidth: 0,
                  height: "100vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  px: { xs: 2, sm: 6 },
                }}
              >
                <Box
                  component="img"
                  src={img.url}
                  alt={`${alt} — foto ${i + 1}`}
                  sx={{ maxWidth: "100%", maxHeight: "85vh", objectFit: "contain" }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {images.length > 1 ? (
          <>
            <IconButton
              aria-label="Foto anterior"
              onClick={() => emblaApi?.scrollPrev()}
              sx={{
                position: "absolute",
                left: { xs: 8, sm: 24 },
                color: "common.white",
                bgcolor: "rgba(0, 0, 0, 0.4)",
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.6)" },
              }}
            >
              <ArrowBackIosNewRoundedIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="Foto siguiente"
              onClick={() => emblaApi?.scrollNext()}
              sx={{
                position: "absolute",
                right: { xs: 8, sm: 24 },
                color: "common.white",
                bgcolor: "rgba(0, 0, 0, 0.4)",
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.6)" },
              }}
            >
              <ArrowForwardIosRoundedIcon fontSize="small" />
            </IconButton>
            <Typography
              sx={{
                position: "absolute",
                bottom: 24,
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: FONT_MONO,
                fontSize: 13,
                letterSpacing: "0.08em",
                color: "primary.main",
              }}
            >
              {String(selectedIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </Typography>
          </>
        ) : null}
      </Box>
    </Dialog>
  );
}
