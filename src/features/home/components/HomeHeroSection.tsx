import { Box, Container, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ReactNode } from "react";

type HomeHeroSectionProps = {
    children: ReactNode;
    backgroundImageUrl: string;
};

export default function HomeHeroSection({ children, backgroundImageUrl }: HomeHeroSectionProps) {
    return (
        <Box
            component="section"
            sx={{
                position: "relative",
                minHeight: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 72px)" },
                color: "secondary.contrastText",
                display: "flex",
                alignItems: "center",
                backgroundImage: (theme) =>
                    `linear-gradient(to bottom, transparent 0%, ${alpha(theme.palette.background.default, 0.6)} 60%, ${theme.palette.background.default} 100%), url(${backgroundImageUrl})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                py: { xs: 5, sm: 6, md: 8 },
            }}
        >
            <Container maxWidth="lg" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Stack spacing={{ xs: 2, sm: 3 }} sx={{ width: "100%" }}>
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            sx={{
                                width: "100%",
                                maxWidth: 980,
                                fontSize: { xs: "2.1rem", sm: "2.9rem", md: "3.6rem", lg: "4rem" },
                                lineHeight: { xs: 1.08, sm: 1.1 },
                                fontWeight: 800,
                                textTransform: "uppercase",
                                textAlign: "center",
                                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                            }}
                        >
                            Más de 50 años
                            <br />
                            de <span style={{ color: "#e4b61a" }}>excelencia inmobiliaria</span>
                        </Typography>
                        <Typography
                            sx={{
                                width: "100%",
                                fontWeight: 600,
                                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.4rem" },
                                textAlign: "center",
                            }}
                        >
                            Trayectoria. Experiencia. Prestigio.
                        </Typography>
                    </Box>
                    {children}
                </Stack>
            </Container>
        </Box>
    );
}
