import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
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
import type { Property } from "../types/property";
import { formatOperation, formatPrice } from "../lib/format";

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [p, setP] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("missing");
      setLoading(false);
      return;
    }
    let done = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchPropertyById(id);
        if (!done) setP(res.data);
      } catch (e) {
        if (e instanceof Error && e.message === "not_found") {
          if (!done) setError("not_found");
        } else {
          if (!done) setError(e instanceof Error ? e.message : "Error");
        }
        if (!done) setP(null);
      } finally {
        if (!done) setLoading(false);
      }
    })();
    return () => {
      done = true;
    };
  }, [id]);

  if (loading) {
    return <PageLoadingCenter ariaLabel="Cargando" />;
  }

  if (error === "not_found" || !p) {
    return (
      <Container>
        <Typography color="error" gutterBottom>
          {error === "not_found" ? "Propiedad no encontrada" : "No se pudo cargar"}
        </Typography>
        <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />}>
          Volver al listado
        </Button>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <PageErrorState message={error} />
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
