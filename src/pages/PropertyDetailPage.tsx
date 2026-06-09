import { Link as RouterLink, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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

  if (isLoading) {
    return <PageLoadingCenter ariaLabel="Cargando" />;
  }

  if (error instanceof Error && error.message === "not_found") {
    return (
      <Container>
        <Typography color="error" gutterBottom>
          Propiedad no encontrada
        </Typography>
        <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />}>
          Volver al listado
        </Button>
      </Container>
    );
  }

  if (error || !p) {
    return (
      <Container>
        <PageErrorState message={error instanceof Error ? error.message : "No se pudo cargar"} />
        <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />} sx={{ mt: 1 }}>
          Volver al listado
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 2.5 } }}>
      <Breadcrumbs sx={{ mb: 2 }} separator="›">
        <Link component={RouterLink} to="/" color="inherit" underline="hover">
          Propiedades
        </Link>
        <Typography color="text.primary">Detalle</Typography>
      </Breadcrumbs>

      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", mb: 1 }}>
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
        {p.neighborhood}, {p.city} · {p.coveredM2} m² cub.{" "}
        {p.totalM2 ? `· ${p.totalM2} m² tot.` : null}
      </Typography>

      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", my: 2 }}>
        {p.images.map((img) => (
          <Box
            key={img.id}
            component="img"
            src={img.url}
            alt=""
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

      <Typography variant="body1" component="div" sx={{ whiteSpace: "pre-line" }}>
        {p.description}
      </Typography>
    </Container>
  );
}
