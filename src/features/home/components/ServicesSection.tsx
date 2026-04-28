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
                <Typography component="h2" variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                    Servicios inmobiliarios
                </Typography>
                <Grid container spacing={2}>
                    {items.map((item) => (
                        <Grid key={item.title} size={{ xs: 12, md: 3 }}>
                            <Paper variant="outlined" sx={{ p: 2.5, height: "100%" }}>
                                <Stack spacing={1.25}>
                                    <item.Icon color="primary" />
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
