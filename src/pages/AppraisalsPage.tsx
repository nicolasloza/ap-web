import { Box, Container, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import ContactInfoBlock from "../components/company/ContactInfoBlock";
import InquiryForm from "../components/forms/InquiryForm";
import { FONT_MONO } from "../theme/tokens";

export default function AppraisalsPage() {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "70vh", py: { xs: 3, sm: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack spacing={{ xs: 3, md: 5 }}>

          {/* Header */}
          <Box>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1.5 }}>
              <Divider sx={{ width: 24, borderBottomWidth: 2, borderColor: "primary.main" }} />
              <Typography sx={{ fontFamily: FONT_MONO, fontSize: 12, letterSpacing: "0.1em", color: "primary.main" }}>
                VALUACIONES
              </Typography>
            </Stack>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: "2rem", sm: "2.5rem" } }}>
              Tasaciones
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
              Conocé el valor de tu propiedad con el respaldo de más de 50 años de experiencia en el mercado inmobiliario de Buenos Aires.
            </Typography>
          </Box>

          <Divider />

          {/* Contenido en dos columnas */}
          <Grid container spacing={{ xs: 4, md: 6 }} sx={{ alignItems: "flex-start" }}>

            {/* Columna izquierda — Descripción + contacto */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={3}>
                <Stack spacing={1.5}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    ¿Cómo funciona?
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
                    Completá el formulario con tus datos y la dirección de la propiedad a tasar. Un tasador de nuestra inmobiliaria se pondrá en contacto con vos y te asesorará sin compromiso.
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
                    Realizamos tasaciones de departamentos, casas, PH, locales, oficinas y terrenos en toda la Ciudad de Buenos Aires.
                  </Typography>
                </Stack>

                <Divider />

                <ContactInfoBlock compact />
              </Stack>
            </Grid>

            {/* Columna derecha — Formulario */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2.5 }}>
                  Solicitá tu tasación
                </Typography>
                <InquiryForm
                  mode="appraisal"
                  submitLabel="Solicitar tasación"
                  successMessage="Solicitud enviada. Te contactaremos a la brevedad."
                />
              </Paper>
            </Grid>

          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
