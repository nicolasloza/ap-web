import { ArrowForward } from "@mui/icons-material";
import { Box, Card, CardActionArea, CardContent, Grid, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BackOfficeLayout from "../components/layout/BackOfficeLayout";

export default function BackOfficePage() {
  const navigate = useNavigate();

  return (
    <BackOfficeLayout>
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: "1.4rem", sm: "1.6rem" } }} component="h1">
        Back office
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Seleccioná el módulo que querés administrar.
      </Typography>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardActionArea onClick={() => navigate("/admin/propiedades")}>
              <CardContent sx={{ py: 4 }}>
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                      Propiedades
                    </Typography>
                    <Typography color="text.secondary">Formulario y listado de propiedades</Typography>
                  </Box>
                  <ArrowForward />
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardActionArea onClick={() => navigate("/admin/usuarios")}>
              <CardContent sx={{ py: 4 }}>
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                      Usuarios
                    </Typography>
                    <Typography color="text.secondary">ABM de usuarios del back office</Typography>
                  </Box>
                  <ArrowForward />
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
    </BackOfficeLayout>
  );
}
