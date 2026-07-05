import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { Box, Container, Divider, Grid, Link, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import { BRAND, CONTACT_INFO } from "../../features/company/constants/contactInfo";
import { FONT_MONO } from "../../theme/tokens";

const NAV_LINKS = [
  { label: "Propiedades", to: "/propiedades" },
  { label: "Tasaciones", to: "/tasaciones" },
  { label: "Contacto", to: "/contacto" },
];

const SERVICE_LINKS = [
  { label: "Compra y venta", to: "/propiedades?operation=sale" },
  { label: "Alquileres", to: "/propiedades?operation=rent" },
  { label: "Tasaciones", to: "/tasaciones" },
  { label: "Hoteles", to: "/contacto" },
  { label: "Campos", to: "/contacto" },
];

function ColumnHeading({ children }: { children: ReactNode }) {
  return (
    <Typography
      sx={{
        fontFamily: FONT_MONO,
        fontSize: 12,
        letterSpacing: "0.1em",
        opacity: 0.6,
        borderLeft: 2,
        borderColor: "primary.main",
        pl: 1,
        mb: 1.75,
      }}
    >
      {children}
    </Typography>
  );
}

export default function MainFooter() {
  return (
    <Box
      component="footer"
      sx={{ bgcolor: "secondary.dark", color: "secondary.contrastText", pt: { xs: 5, sm: 6 }, pb: 3 }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 5 }}>

          {/* Columna 1 — Marca y contacto */}
          <Grid size={{ xs: 12, sm: 12, md: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main", mb: 0.5 }}>
              {BRAND.name}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.6, mb: 2, fontSize: "0.78rem", letterSpacing: 1, textTransform: "uppercase" }}>
              {BRAND.tagline}
            </Typography>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
                <LocationOnOutlinedIcon sx={{ fontSize: 18, color: "primary.main", mt: "2px" }} />
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.85 }}>
                    {CONTACT_INFO.addressLine1}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.65, fontSize: "0.82rem" }}>
                    {CONTACT_INFO.addressLine2}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <PhoneOutlinedIcon sx={{ fontSize: 18, color: "primary.main" }} />
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  {CONTACT_INFO.phones.join(" / ")}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <EmailOutlinedIcon sx={{ fontSize: 18, color: "primary.main" }} />
                <Link
                  href={`mailto:${CONTACT_INFO.email}`}
                  color="inherit"
                  underline="hover"
                  variant="body2"
                  sx={{ opacity: 0.85 }}
                >
                  {CONTACT_INFO.email}
                </Link>
              </Stack>
            </Stack>
          </Grid>

          {/* Columna 2 — Navegación */}
          <Grid size={{ xs: 6, sm: 4, md: 4 }}>
            <ColumnHeading>Navegación</ColumnHeading>
            <Stack spacing={1}>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  component={RouterLink}
                  to={link.to}
                  color="inherit"
                  underline="hover"
                  variant="body2"
                  sx={{ opacity: 0.85, "&:hover": { opacity: 1 } }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Columna 3 — Servicios */}
          <Grid size={{ xs: 6, sm: 4, md: 4 }}>
            <ColumnHeading>Servicios</ColumnHeading>
            <Stack spacing={1}>
              {SERVICE_LINKS.map((link) => (
                <Link
                  key={link.label}
                  component={RouterLink}
                  to={link.to}
                  color="inherit"
                  underline="hover"
                  variant="body2"
                  sx={{ opacity: 0.85, "&:hover": { opacity: 1 } }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

        </Grid>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mt: { xs: 4, sm: 5 }, mb: 2.5 }} />

        <Typography variant="body2" sx={{ opacity: 0.45, textAlign: { xs: "left", sm: "center" }, fontSize: "0.78rem" }}>
          © {new Date().getFullYear()} {BRAND.name} {BRAND.tagline}. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
}
