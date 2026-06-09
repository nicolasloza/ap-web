import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Link,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import BedOutlinedIcon from "@mui/icons-material/BedOutlined";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PageErrorState from "../components/feedback/PageErrorState";
import { fetchPropertyById } from "../api/client";
import { formatOperation, formatPrice } from "../lib/format";
import { BRAND } from "../features/company/constants/contactInfo";

function PropertyDetailSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2.5, sm: 3 } }}>
      <Skeleton width={220} height={24} sx={{ mb: 2 }} />
      <Stack direction="row" spacing={1} sx={{ mb: 2.5 }}>
        <Skeleton variant="rounded" width={80} height={28} />
        <Skeleton variant="rounded" width={100} height={28} />
      </Stack>
      <Grid container spacing={{ xs: 3, md: 5 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Skeleton variant="rectangular" width="100%" height={380} sx={{ borderRadius: 1, mb: 1 }} />
          <Stack direction="row" spacing={1}>
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} variant="rectangular" width={80} height={60} sx={{ borderRadius: 0.75 }} />
            ))}
          </Stack>
          <Skeleton width="60%" height={32} sx={{ mt: 3 }} />
          <Skeleton width="100%" height={20} />
          <Skeleton width="100%" height={20} />
          <Skeleton width="75%" height={20} />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Skeleton width="85%" height={36} sx={{ mb: 0.5 }} />
          <Skeleton width="55%" height={48} sx={{ mb: 2.5 }} />
          <Divider sx={{ mb: 2 }} />
          {[1, 2, 3, 4].map((n) => (
            <Stack key={n} direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.5 }}>
              <Skeleton variant="circular" width={20} height={20} />
              <Skeleton width="70%" height={20} />
            </Stack>
          ))}
          <Divider sx={{ mb: 2.5 }} />
          <Skeleton width="60%" height={20} sx={{ mb: 1.5 }} />
          <Skeleton variant="rectangular" width="100%" height={44} sx={{ borderRadius: 1 }} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedImg, setSelectedImg] = useState(0);

  const { data: p, isLoading, error } = useQuery({
    queryKey: ["property", id],
    queryFn: () => fetchPropertyById(id!).then((r) => r.data),
    enabled: Boolean(id),
    retry: (_, err) => !(err instanceof Error && err.message === "not_found"),
  });

  useEffect(() => {
    if (p?.title) {
      document.title = `${p.title} | ${BRAND.name}`;
    }
    return () => {
      document.title = `${BRAND.name} — ${BRAND.tagline}`;
    };
  }, [p?.title]);

  if (isLoading) return <PropertyDetailSkeleton />;

  if (error instanceof Error && error.message === "not_found") {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error" gutterBottom>
          Propiedad no encontrada
        </Typography>
        <Button component={RouterLink} to="/propiedades" startIcon={<ArrowBackIcon />}>
          Volver al listado
        </Button>
      </Container>
    );
  }

  if (error || !p) {
    return (
      <Container sx={{ py: 4 }}>
        <PageErrorState message={error instanceof Error ? error.message : "No se pudo cargar"} />
        <Button component={RouterLink} to="/propiedades" startIcon={<ArrowBackIcon />} sx={{ mt: 1 }}>
          Volver al listado
        </Button>
      </Container>
    );
  }

  const specs = [
    { icon: <LocationOnOutlinedIcon fontSize="small" />, label: `${p.neighborhood}, ${p.city}` },
    { icon: <BedOutlinedIcon fontSize="small" />, label: `${p.rooms} ambiente${p.rooms !== 1 ? "s" : ""}` },
    { icon: <SquareFootIcon fontSize="small" />, label: `${p.coveredM2} m² cubiertos` },
    ...(p.totalM2 ? [{ icon: <SquareFootIcon fontSize="small" />, label: `${p.totalM2} m² totales` }] : []),
    { icon: <HomeOutlinedIcon fontSize="small" />, label: p.type },
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "70vh", py: { xs: 2.5, sm: 3 } }}>
    <Container maxWidth="lg">
      <Breadcrumbs sx={{ mb: 2 }} separator="›">
        <Link component={RouterLink} to="/propiedades" color="inherit" underline="hover">
          Propiedades
        </Link>
        <Typography color="text.primary" noWrap sx={{ maxWidth: { xs: 180, sm: 400 } }}>
          {p.title}
        </Typography>
      </Breadcrumbs>

      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", mb: 2.5 }}>
        <Chip label={formatOperation(p.operation)} color="primary" />
        <Chip label={p.type} variant="outlined" />
      </Stack>

      <Grid container spacing={{ xs: 3, md: 5 }} sx={{ alignItems: "flex-start" }}>

        {/* Columna izquierda — Galería + Descripción */}
        <Grid size={{ xs: 12, md: 7 }}>
          {p.images.length > 0 ? (
            <>
              <Box
                component="img"
                src={p.images[selectedImg]?.url}
                alt={p.title}
                sx={{
                  width: "100%",
                  height: { xs: 240, sm: 360, md: 420 },
                  objectFit: "cover",
                  borderRadius: 1,
                  display: "block",
                  mb: 1,
                }}
              />
              {p.images.length > 1 && (
                <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                  {p.images.map((img, i) => (
                    <Box
                      key={img.id}
                      component="img"
                      src={img.url}
                      alt={`Foto ${i + 1}`}
                      onClick={() => setSelectedImg(i)}
                      sx={{
                        width: 80,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 0.75,
                        cursor: "pointer",
                        border: "2px solid",
                        borderColor: selectedImg === i ? "primary.main" : "transparent",
                        opacity: selectedImg === i ? 1 : 0.6,
                        transition: "opacity 0.15s, border-color 0.15s",
                        "&:hover": { opacity: 1 },
                      }}
                    />
                  ))}
                </Stack>
              )}
            </>
          ) : (
            <Box
              sx={{
                width: "100%",
                height: { xs: 240, sm: 360 },
                bgcolor: "grey.100",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography color="text.disabled">Sin imágenes disponibles</Typography>
            </Box>
          )}

          <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
            Descripción
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line", lineHeight: 1.8, color: "text.secondary" }}>
            {p.description}
          </Typography>
        </Grid>

        {/* Columna derecha — Info sticky + CTA */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={2} sx={{ position: { md: "sticky" }, top: { md: 88 }, p: { xs: 2.5, sm: 3 }, borderRadius: 2 }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700, lineHeight: 1.3, mb: 0.5 }}>
              {p.title}
            </Typography>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 800, mb: 2.5 }}>
              {formatPrice(p.price, p.currency)}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Stack spacing={1.75} sx={{ mb: 3 }}>
              {specs.map((spec, i) => (
                <Stack key={i} direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                  <Box sx={{ color: "primary.main", display: "flex", flexShrink: 0 }}>{spec.icon}</Box>
                  <Typography variant="body2">{spec.label}</Typography>
                </Stack>
              ))}
            </Stack>

            <Divider sx={{ mb: 2.5 }} />

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              ¿Te interesa esta propiedad?
            </Typography>
            <Button
              component={RouterLink}
              to="/contacto"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<EmailIcon />}
              fullWidth
            >
              Consultar propiedad
            </Button>
          </Paper>
        </Grid>

      </Grid>
    </Container>
    </Box>
  );
}
