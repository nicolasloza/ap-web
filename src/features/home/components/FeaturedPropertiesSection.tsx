import { Box, Button, Card, CardContent, Container, Skeleton, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import PageErrorState from "../../../components/feedback/PageErrorState";
import FeaturedPropertiesCarousel from "./FeaturedPropertiesCarousel";
import type { Property } from "../../../types/property";

type FeaturedPropertiesSectionProps = {
    items: Property[];
    loading: boolean;
    error: string | null;
};

function FeaturedCardSkeleton() {
    return (
        <Card variant="outlined">
            <Skeleton variant="rectangular" height={180} sx={{ display: "block" }} />
            <CardContent>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Skeleton variant="rounded" width={60} height={22} />
                    <Skeleton variant="rounded" width={80} height={22} />
                </Stack>
                <Skeleton width="80%" height={28} sx={{ mb: 0.5 }} />
                <Skeleton width="60%" height={20} />
                <Skeleton width="45%" height={24} sx={{ mt: 1 }} />
            </CardContent>
        </Card>
    );
}

export default function FeaturedPropertiesSection({ items, loading, error }: FeaturedPropertiesSectionProps) {
    return (
        <Container component="section" maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1, sm: 0 }}
                sx={{ mb: 2, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "baseline" } }}
            >
                <Typography component="h2" variant="h4" sx={{ fontWeight: 700, fontSize: { xs: "1.6rem", sm: "2rem" } }}>
                    Propiedades <Box component="span" sx={{ color: "primary.main" }}>destacadas</Box>
                </Typography>
                <Button component={RouterLink} to="/propiedades">
                    Ver todas
                </Button>
            </Stack>

            {loading ? (
                <Box sx={{ display: "flex" }}>
                    {[0, 1, 2].map((i) => (
                        <Box key={i} sx={{ flex: { xs: "0 0 100%", sm: "0 0 50%", md: "0 0 33.3333%" }, px: 1 }}>
                            <FeaturedCardSkeleton />
                        </Box>
                    ))}
                </Box>
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
