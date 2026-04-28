import { Box, Container, Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function MainFooter() {
    return (
        <Box
            component="footer"
            sx={{ borderTop: 1, borderColor: "divider", bgcolor: "secondary.dark", color: "secondary.contrastText", py: { xs: 2.5, sm: 3 } }}
        >
            <Container maxWidth="lg">
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={1.5}
                    sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" } }}
                >
                    <Typography variant="body2" sx={{ pr: 1 }}>
                        © {new Date().getFullYear()} Armando Pepe Inmobiliaria
                    </Typography>
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{ flexWrap: "wrap", rowGap: 0.75, width: "100%" }}
                        aria-label="Navegación del pie de página"
                    >
                        <Link component={RouterLink} to="/propiedades" color="inherit" underline="hover">
                            Propiedades
                        </Link>
                        <Link component={RouterLink} to="/tasaciones" color="inherit" underline="hover">
                            Tasaciones
                        </Link>
                        <Link component={RouterLink} to="/contacto" color="inherit" underline="hover">
                            Contacto
                        </Link>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}
