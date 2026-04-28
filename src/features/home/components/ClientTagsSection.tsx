import { Chip, Container, Stack, Typography } from "@mui/material";

type ClientTagsSectionProps = {
    tags: readonly string[];
};

export default function ClientTagsSection({ tags }: ClientTagsSectionProps) {
    return (
        <Container component="section" maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
            <Typography component="h2" variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Principales clientes
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2.5 }}>
                Mas de cinco decadas acompanando a personas, empresas e inversores.
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                {tags.map((tag) => (
                    <Chip key={tag} label={tag} variant="outlined" />
                ))}
            </Stack>
        </Container>
    );
}
