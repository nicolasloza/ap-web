import { Box, Container, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import ContactInfoBlock from "../components/company/ContactInfoBlock";
import InquiryForm from "../components/forms/InquiryForm";
import { FONT_MONO } from "../theme/tokens";

export default function ContactPage() {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "70vh", py: { xs: 3, sm: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack spacing={{ xs: 3, md: 5 }}>

          {/* Header */}
          <Box>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1.5 }}>
              <Divider sx={{ width: 24, borderBottomWidth: 2, borderColor: "primary.main" }} />
              <Typography sx={{ fontFamily: FONT_MONO, fontSize: 12, letterSpacing: "0.1em", color: "primary.main" }}>
                CONTACTO
              </Typography>
            </Stack>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: "2rem", sm: "2.5rem" } }}>
              Hablemos
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
              ¿Tenés alguna consulta? Completá el formulario y nuestro equipo se pondrá en contacto con vos.
            </Typography>
          </Box>

          <Divider />

          {/* Contenido en dos columnas */}
          <Grid container spacing={{ xs: 4, md: 6 }} sx={{ alignItems: "flex-start" }}>

            {/* Columna izquierda — Info de contacto */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={3}>
                <Stack spacing={1.5}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Estamos para ayudarte
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
                    Podés comunicarte con nosotros por teléfono, email o visitarnos en nuestra sede central de lunes a viernes de 9 a 18 hs.
                  </Typography>
                </Stack>

                <Divider />

                <ContactInfoBlock />
              </Stack>
            </Grid>

            {/* Columna derecha — Formulario */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2.5 }}>
                  Envianos un mensaje
                </Typography>
                <InquiryForm
                  mode="contact"
                  submitLabel="Enviar mensaje"
                  successMessage="Mensaje enviado. Te contactaremos a la brevedad."
                />
              </Paper>
            </Grid>

          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
