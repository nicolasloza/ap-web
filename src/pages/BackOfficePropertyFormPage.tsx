import { Alert, Box, Breadcrumbs, Link, Skeleton, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import BackOfficeLayout from "../components/layout/BackOfficeLayout";
import { fetchAdminPropertyById } from "../api/client";
import { PropertyForm } from "../features/backoffice/components/PropertyForm";

export default function BackOfficePropertyFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const { data: property, isLoading, error } = useQuery({
    queryKey: ["property", "admin", id],
    queryFn: () => fetchAdminPropertyById(id!).then((r) => r.data),
    enabled: isEditing,
  });

  function goToList() {
    navigate("/admin/propiedades");
  }

  return (
    <BackOfficeLayout>
      <Box sx={{ p: { xs: 2.5, sm: 4 }, maxWidth: 1200, mx: "auto" }}>
        <Breadcrumbs separator="›" sx={{ mb: 1.5 }}>
          <Link component={RouterLink} to="/admin/propiedades" color="inherit" underline="hover">
            Propiedades
          </Link>
          <Typography color="text.primary">{isEditing ? "Editar" : "Nueva"}</Typography>
        </Breadcrumbs>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 3 }}>
          {isEditing ? "Editar Propiedad" : "Agregar Propiedad"}
        </Typography>

        {isEditing && isLoading ? (
          <Skeleton variant="rounded" height={480} />
        ) : isEditing && error ? (
          <Alert severity="error">
            {error instanceof Error && error.message === "not_found"
              ? "Propiedad no encontrada."
              : "No se pudo cargar la propiedad."}
          </Alert>
        ) : (
          <PropertyForm selectedProperty={property ?? null} onSaved={goToList} onCancel={goToList} />
        )}
      </Box>
    </BackOfficeLayout>
  );
}
