import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import ContactInfoBlock from "../components/company/ContactInfoBlock";
import InquiryForm from "../components/forms/InquiryForm";

export default function AppraisalsPage() {
    return (
        <Container maxWidth="lg" sx={{ py: { xs: 2.5, sm: 4, md: 6 } }}>
            <Box sx={{ bgcolor: "#f3f3f3", borderRadius: 1, p: { xs: 2.5, md: 5 } }}>
                <Grid container spacing={{ xs: 4, md: 6 }} sx={{ alignItems: "stretch" }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={3} sx={{ maxWidth: 430 }}>
                            <Typography
                                component="h1"
                                sx={{ fontSize: { xs: "2rem", md: "2.25rem" }, lineHeight: 1.1, fontWeight: 800, color: "primary.dark" }}
                            >
                                Tasaciones
                            </Typography>

                            <Typography sx={{ color: "text.primary", fontSize: { xs: "1.05rem", md: "1.2rem" }, lineHeight: 1.35 }}>
                                ¿Querés vender o alquilar tu propiedad? Aquí podrás contactarte con nosotros para conocer el valor de la misma.
                            </Typography>
                            <Typography sx={{ color: "text.primary", fontSize: { xs: "1.05rem", md: "1.2rem" }, lineHeight: 1.35 }}>
                                Completá tus datos y describí las características de tu propiedad. Un tasador de Armando Pepe se pondrá en
                                contacto con vos, y te asesorará en tu consulta.
                            </Typography>

                            <Box>
                                <ContactInfoBlock compact />
                            </Box>
                        </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ p: { xs: 0, md: 1 }, maxWidth: 460, ml: { md: "auto" } }}>
                            <InquiryForm
                                mode="appraisal"
                                submitLabel="Enviar"
                                successMessage="Solicitud de tasación enviada. Te contactaremos a la brevedad."
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}