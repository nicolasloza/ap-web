import { useEffect } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import PageLoadingCenter from "../components/feedback/PageLoadingCenter";
import PageErrorState from "../components/feedback/PageErrorState";
import { fetchPropertyById } from "../api/client";
import { formatOperation, formatPrice } from "../lib/format";

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: p, isLoading, error } = useQuery({
    queryKey: ["property", id],
    queryFn: () => fetchPropertyById(id!).then((r) => r.data),
    enabled: Boolean(id),
    retry: (_, err) => !(err instanceof Error && err.message === "not_found"),
  });

  useEffect(() => {
    if (p?.title) {
      document.title = `${p.title} | Armando Pepe`;
    }
    return () => {
      document.title = "Armando Pepe — Inmobiliaria";
    };
  }, [p?.title]);

  if (isLoading) {
    return <PageLoadingCenter ariaLabel="Cargando" />;
  }

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

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2.5, sm: 3 }, minHeight: "70vh" }}>
      <Breadcrumbs sx={{ mb: 2 }} separator="›">
        <Link component={RouterLink} to="/propiedades" color="inherit" underline="hover">
          Propiedades
        </Link>
        <Typography color="text.primary" noWrap sx={{ maxWidth: { xs: 180, sm: 340 } }}>
          {p.title}
        </Typography>
      </Breadcrumbs>

      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", mb: 1.5 }}>
        <Chip label={formatOperation(p.operation)} color="primary" />
        <Chip label={p.type} variant="outlined" />
        <Chip label={`${p.rooms} amb.`} variant="outlined" size="small" />
      </Stack>

      <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: "1.6rem", sm: "2rem" } }}>
        {p.title}
      </Typography>
      <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: "bold", fontSize: { xs: "1.4rem", sm: "1.7rem" } }}>
        {formatPrice(p.price, p.currency)}
      </Typography>
      <Typography color="text.secondary" gutterBottom>
        {p.neighborhood}, {p.city} · {p.coveredM2} m² cub.
        {p.totalM2 ? ` · ${p.totalM2} m² tot.` : null}
      </Typography>

      {p.images.length > 0 && (
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", my: 2.5 }}>
          {p.images.map((img) => (
            <Box
              key={img.id}
              component="img"
              src={img.url}
              alt={`${p.title} — imagen`}
              sx={{
                maxWidth: { xs: "100%", sm: 280 },
                width: { xs: "100%", sm: 280 },
                height: { xs: 210, sm: 200 },
                objectFit: "cover",
                borderRadius: 1,
              }}
            />
          ))}
        </Stack>
      )}

      <Typography variant="body1" component="div" sx={{ whiteSpace: "pre-line", lineHeight: 1.75 }}>
        {p.description}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ alignItems: { sm: "center" } }}>
        <Typography variant="body2" color="text.secondary">
          ¿Te interesa esta propiedad?
        </Typography>
        <Button
          component={RouterLink}
          to="/contacto"
          variant="contained"
          color="primary"
          startIcon={<EmailIcon />}
        >
          Consultar propiedad
        </Button>
      </Stack>
    </Container>
  );
}
