import { Box, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import type { ElementType } from "react";

type ServiceItem = {
    title: string;
    description: string;
    Icon: ElementType;
};

type ServicesSectionProps = {
    items: readonly ServiceItem[];
};

export default function ServicesSection({ items }: ServicesSectionProps) {
    return (
        <Box component="section" sx={{ bgcolor: "background.default", py: { xs: 5, md: 7 } }}>
            <Container maxWidth="lg">
                <Stack spacing={1} sx={{ alignItems: "center", textAlign: "center", mb: 4 }}>
                    <Typography component="h2" variant="h4" sx={{ fontWeight: 700 }}>
                        Nuestros <Box component="span" sx={{ color: "primary.main" }}>Servicios</Box>
                    </Typography>
                    <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
                        Soluciones integrales diseñadas para inversores y propietarios que buscan la
                        máxima rentabilidad y seguridad.
                    </Typography>
                </Stack>
                <Grid container spacing={2}>
                    {items.map((item) => (
                        <Grid key={item.title} size={{ xs: 12, md: 3 }}>
                            <Paper variant="outlined" sx={{ p: 2.5, height: "100%" }}>
                                <Stack spacing={1.5}>
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: 1,
                                            bgcolor: "rgba(228, 182, 26, 0.12)",
                                            border: "1px solid rgba(228, 182, 26, 0.3)",
                                        }}
                                    >
                                        <item.Icon color="primary" fontSize="small" />
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {item.title}
                                    </Typography>
                                    <Typography color="text.secondary">{item.description}</Typography>
                                </Stack>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
