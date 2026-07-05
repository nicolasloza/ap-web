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
import BedOutlinedIcon from "@mui/icons-material/BedOutlined";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PageErrorState from "../components/feedback/PageErrorState";
import InquiryForm from "../components/forms/InquiryForm";
import PropertyGalleryMosaic from "../features/properties/components/PropertyGalleryMosaic";
import PropertyImageLightbox from "../features/properties/components/PropertyImageLightbox";
import PropertyListCard from "../features/properties/components/PropertyListCard";
import { fetchPropertyById, fetchPropertyList } from "../api/client";
import { STATUS_CHIP_CONFIG } from "../features/properties/constants/propertyStatus";
import { formatOperation, formatPrice } from "../lib/format";
import { buildReferenceCode, formatSurface } from "../lib/propertyDisplay";
import { BRAND } from "../features/company/constants/contactInfo";
import { FONT_MONO } from "../theme/tokens";

function PropertyDetailSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2.5, sm: 3 } }}>
      <Skeleton width={220} height={24} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={420} sx={{ borderRadius: 1, mb: 3 }} />
      <Grid container spacing={{ xs: 3, md: 5 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Skeleton width="60%" height={32} />
          <Skeleton width="100%" height={20} />
          <Skeleton width="100%" height={20} />
          <Skeleton width="75%" height={20} />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Skeleton variant="rectangular" width="100%" height={320} sx={{ borderRadius: 1 }} />
        </Grid>
      </Grid>
    </Container>
  );
}

function SpecItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Stack spacing={0.5} sx={{ alignItems: { xs: "flex-start", sm: "center" }, minWidth: 0 }}>
      <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", color: "primary.main" }}>
        {icon}
        <Typography
          sx={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.08em", color: "text.secondary" }}
        >
          {label}
        </Typography>
      </Stack>
      <Typography sx={{ fontWeight: 700 }} noWrap>
        {value}
      </Typography>
    </Stack>
  );
}

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: p, isLoading, error } = useQuery({
    queryKey: ["property", id],
    queryFn: () => fetchPropertyById(id!).then((r) => r.data),
    enabled: Boolean(id),
    retry: (_, err) => !(err instanceof Error && err.message === "not_found"),
  });

  const { data: similar = [] } = useQuery({
    queryKey: ["property", id, "similar", p?.type],
    queryFn: () =>
      fetchPropertyList(1, 4, { type: p!.type }).then((r) =>
        r.data.filter((item) => item.id !== p!.id).slice(0, 3)
      ),
    enabled: Boolean(p),
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
    { icon: <SquareFootIcon sx={{ fontSize: 16 }} />, label: "AREA TOTAL", value: formatSurface(p) },
    { icon: <BedOutlinedIcon sx={{ fontSize: 16 }} />, label: "AMBIENTES", value: `${p.rooms}` },
    { icon: <HomeOutlinedIcon sx={{ fontSize: 16 }} />, label: "TIPO", value: p.type },
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "70vh" }}>
      {/* Hero */}
      <Box sx={{ position: "relative" }}>
        {p.images.length > 0 ? (
          <Box
            component="img"
            src={p.images[0]?.url}
            alt={p.title}
            sx={{
              width: "100%",
              height: { xs: 320, sm: 440, md: 520 },
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <Box sx={{ width: "100%", height: { xs: 320, sm: 440, md: 520 }, bgcolor: "background.paper" }} />
        )}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(19,19,19,0) 40%, rgba(19,19,19,0.92) 100%)",
          }}
        />
        <Container maxWidth="lg" sx={{ position: "absolute", left: 0, right: 0, bottom: 0, pb: 3 }}>
          <Breadcrumbs sx={{ mb: 1.5 }} separator="›">
            <Link component={RouterLink} to="/propiedades" color="inherit" underline="hover">
              Propiedades
            </Link>
            <Typography color="text.primary" noWrap sx={{ maxWidth: { xs: 180, sm: 400 } }}>
              {p.title}
            </Typography>
          </Breadcrumbs>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", mb: 1.5 }}>
            <Chip label={formatOperation(p.operation)} color="primary" size="small" />
            <Chip label={p.type} variant="outlined" size="small" />
            {p.status !== "available" ? (
              <Chip
                label={STATUS_CHIP_CONFIG[p.status].label}
                size="small"
                sx={{
                  fontWeight: 700,
                  textTransform: "uppercase",
                  bgcolor: `${STATUS_CHIP_CONFIG[p.status].color}1a`,
                  color: STATUS_CHIP_CONFIG[p.status].color,
                  border: 1,
                  borderColor: STATUS_CHIP_CONFIG[p.status].color,
                }}
              />
            ) : null}
          </Stack>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
            {p.title}
          </Typography>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", color: "text.secondary", mb: 1 }}>
            <LocationOnOutlinedIcon sx={{ fontSize: 17 }} />
            <Typography>{p.neighborhood}, {p.city}</Typography>
          </Stack>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>
            {formatPrice(p.price, p.currency)}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
        {/* Specs strip */}
        <Paper
          variant="outlined"
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2,
            mb: { xs: 3, md: 5 },
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 2.5, sm: 4 },
            justifyContent: { xs: "flex-start", sm: "space-around" },
          }}
        >
          {specs.map((spec) => (
            <SpecItem key={spec.label} {...spec} />
          ))}
          <SpecItem
            icon={<span style={{ fontSize: 14 }}>#</span>}
            label="REFERENCIA"
            value={buildReferenceCode(p)}
          />
        </Paper>

        <PropertyGalleryMosaic images={p.images} alt={p.title} onImageClick={setLightboxIndex} />

        <Grid container spacing={{ xs: 3, md: 5 }} sx={{ alignItems: "flex-start" }}>
          {/* Columna izquierda — Descripción */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Descripción
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-line", lineHeight: 1.8, color: "text.secondary" }}>
              {p.description}
            </Typography>
          </Grid>

          {/* Columna derecha — Formulario de consulta */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper variant="outlined" sx={{ position: { md: "sticky" }, top: { md: 88 }, p: { xs: 2.5, sm: 3 } }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                Consulta privada
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                Coordiná una visita o pedí más información sobre esta propiedad.
              </Typography>
              <InquiryForm
                mode="contact"
                submitLabel="Enviar consulta"
                successMessage="Consulta enviada. Te contactaremos a la brevedad."
              />
            </Paper>
          </Grid>
        </Grid>

        {/* Propiedades similares */}
        {similar.length > 0 ? (
          <Box sx={{ mt: { xs: 5, md: 7 } }}>
            <Divider sx={{ mb: { xs: 3, md: 4 } }} />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "baseline", mb: 2.5 }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Propiedades similares
              </Typography>
              <Button component={RouterLink} to="/propiedades">
                Ver todas
              </Button>
            </Stack>
            <Grid container spacing={{ xs: 1.5, sm: 2 }}>
              {similar.map((item) => (
                <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <PropertyListCard property={item} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : null}
      </Container>

      <PropertyImageLightbox
        images={p.images}
        open={lightboxIndex !== null}
        initialIndex={lightboxIndex ?? 0}
        onClose={() => setLightboxIndex(null)}
        alt={p.title}
      />
    </Box>
  );
}
