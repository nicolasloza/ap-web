import { useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { Box, IconButton, Stack } from "@mui/material";
import FeaturedPropertySlideCard from "../../features/home/components/FeaturedPropertySlideCard";
import type { Property } from "../../types/property";

// Carrusel de destacadas: controla Embla/autoplay y renderiza cada slide de propiedad.
export type FeaturedPropertiesCarouselProps = {
  items: Property[];
  autoplay?: boolean;
  autoplayIntervalMs?: number;
};

export default function FeaturedPropertiesCarousel({
  items,
  autoplay = false,
  autoplayIntervalMs = 4500,
}: FeaturedPropertiesCarouselProps) {
  const loop = items.length > 3;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop,
    dragFree: false,
    slidesToScroll: 1,
  });
  const [, setRevision] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    const onChange = () => {
      setRevision((prev) => prev + 1);
    };
    emblaApi.on("select", onChange);
    emblaApi.on("reInit", onChange);
    return () => {
      emblaApi.off("select", onChange);
      emblaApi.off("reInit", onChange);
    };
  }, [emblaApi]);

  const scrollSnaps = emblaApi?.scrollSnapList() ?? [];
  const selectedIndex = emblaApi?.selectedScrollSnap() ?? 0;
  const canPrev = emblaApi?.canScrollPrev() ?? false;
  const canNext = emblaApi?.canScrollNext() ?? false;
  const canShowControls = useMemo(() => scrollSnaps.length > 1, [scrollSnaps.length]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();
  const scrollTo = (index: number) => emblaApi?.scrollTo(index);

  useEffect(() => {
    if (!autoplay || !emblaApi || !canShowControls || isPaused) {
      return;
    }
    const intervalId = window.setInterval(() => {
      emblaApi.scrollNext();
    }, autoplayIntervalMs);
    return () => {
      window.clearInterval(intervalId);
    };
  }, [autoplay, autoplayIntervalMs, canShowControls, emblaApi, isPaused]);

  return (
    <Stack spacing={2}>
      <Box
        sx={{ position: "relative" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}
      >
        <Box ref={emblaRef} sx={{ overflow: "hidden" }}>
          <Box sx={{ display: "flex" }}>
            {items.map((p) => {
              return (
                <Box
                  key={p.id}
                  sx={{
                    minWidth: 0,
                    flex: { xs: "0 0 100%", sm: "0 0 50%", md: "0 0 33.3333%" },
                    px: 1,
                  }}
                >
                  <FeaturedPropertySlideCard property={p} />
                </Box>
              );
            })}
          </Box>
        </Box>

        {canShowControls ? (
          <>
            <IconButton
              aria-label="Anterior propiedad destacada"
              onClick={scrollPrev}
              disabled={!canPrev}
              sx={{
                position: "absolute",
                left: { xs: 8, sm: -12 },
                top: "42%",
                zIndex: 1,
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
                "&:hover": { bgcolor: "action.hover" },
                display: { xs: "none", sm: "inline-flex" },
              }}
            >
              <ArrowBackIosNewRoundedIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="Siguiente propiedad destacada"
              onClick={scrollNext}
              disabled={!canNext}
              sx={{
                position: "absolute",
                right: { xs: 8, sm: -12 },
                top: "42%",
                zIndex: 1,
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
                "&:hover": { bgcolor: "action.hover" },
                display: { xs: "none", sm: "inline-flex" },
              }}
            >
              <ArrowForwardIosRoundedIcon fontSize="small" />
            </IconButton>
          </>
        ) : null}
      </Box>

      {canShowControls ? (
        <Stack direction="row" spacing={1} sx={{ justifyContent: "center" }} aria-label="Paginación destacadas">
          {scrollSnaps.map((_, index) => (
            <Box
              key={`dot-${index}`}
              component="button"
              type="button"
              onClick={() => scrollTo(index)}
              aria-label={`Ir a slide ${index + 1}`}
              sx={{
                width: 10,
                height: 10,
                p: 0,
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                bgcolor: selectedIndex === index ? "primary.main" : "action.selected",
              }}
            />
          ))}
        </Stack>
      ) : null}
    </Stack>
  );
}
