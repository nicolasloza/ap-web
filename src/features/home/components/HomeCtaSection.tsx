import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function HomeCtaSection() {
    return (
        <Box component="section" sx={{ bgcolor: "secondary.main", color: "secondary.contrastText", py: { xs: 5, md: 6 } }}>
            <Container maxWidth="lg">
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" } }}
                >
                    <Box>
                        <Typography component="h2" variant="h4" sx={{ fontWeight: 700 }}>
                            Necesitas una tasacion profesional?
                        </Typography>
                        <Typography sx={{ mt: 1, opacity: 0.92 }}>
                            Solicita una valuacion y recibi asesoramiento personalizado de nuestro equipo.
                        </Typography>
                    </Box>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                        <Button component={RouterLink} to="/tasaciones" variant="contained" color="primary">
                            Pedir tasacion
                        </Button>
                        <Button component={RouterLink} to="/contacto" variant="outlined" color="inherit">
                            Contactar ahora
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}
