import { Button, Container, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import PageErrorState from "../../../components/feedback/PageErrorState";
import PageLoadingCenter from "../../../components/feedback/PageLoadingCenter";
import FeaturedPropertiesCarousel from "./FeaturedPropertiesCarousel";
import type { Property } from "../../../types/property";

type FeaturedPropertiesSectionProps = {
    items: Property[];
    loading: boolean;
    error: string | null;
};

export default function FeaturedPropertiesSection({ items, loading, error }: FeaturedPropertiesSectionProps) {
    return (
        <Container component="section" maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1, sm: 0 }}
                sx={{ mb: 2, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "baseline" } }}
            >
                <Typography component="h2" variant="h4" sx={{ fontWeight: 700, fontSize: { xs: "1.6rem", sm: "2rem" } }}>
                    Propiedades destacadas
                </Typography>
                <Button component={RouterLink} to="/propiedades">
                    Ver todas
                </Button>
            </Stack>

            {loading ? (
                <PageLoadingCenter ariaLabel="Cargando propiedades destacadas" py={6} />
            ) : null}

            {error ? (
                <Stack sx={{ mb: 2 }}>
                    <PageErrorState message={error} />
                </Stack>
            ) : null}

            {!loading && !error ? <FeaturedPropertiesCarousel items={items} autoplay /> : null}
        </Container>
    );
}
