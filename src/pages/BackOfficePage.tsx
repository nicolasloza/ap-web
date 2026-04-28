import { Box, Typography } from "@mui/material";

export default function BackOfficePage() {
  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 900 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: "1.4rem", sm: "1.6rem" } }} component="h1">
        Back office
      </Typography>
      <Typography color="text.secondary">
        Panel de administración. Próximamente podrás gestionar propiedades y contenido desde aquí.
      </Typography>
    </Box>
  );
}
