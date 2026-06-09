import { Alert, Box, Button, Card, CardActions, CardContent, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProperty, fetchPropertyList } from "../api/client";
import { PropertyForm } from "../features/backoffice/components/PropertyForm";
import type { Property } from "../types/property";

export default function BackOfficePropertiesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { data: properties = [], isLoading: loading, error: loadError } = useQuery({
    queryKey: ["properties", "admin"],
    queryFn: () => fetchPropertyList(1, 50).then((r) => r.data),
  });

  const { mutate: handleDelete, error: deleteError } = useMutation({
    mutationFn: (id: string) => deleteProperty(id),
    onSuccess: (_, id) => {
      if (selectedProperty?.id === id) setSelectedProperty(null);
      setMessage("Propiedad eliminada correctamente.");
      void queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  function handleSaved(property: Property) {
    setMessage(`Propiedad guardada: ${property.title}`);
    setSelectedProperty(null);
    void queryClient.invalidateQueries({ queryKey: ["properties"] });
  }

  const error = loadError instanceof Error
    ? loadError.message
    : deleteError instanceof Error
    ? deleteError.message
    : null;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: "1.4rem", sm: "1.6rem" } }} component="h1">
            Back office · Propiedades
          </Typography>
          <Typography color="text.secondary">Gestión de propiedades con imágenes alojadas en Cloudinary.</Typography>
        </Box>
        <Button variant="outlined" onClick={() => navigate("/admin")}>
          Volver
        </Button>
      </Stack>

      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      {message ? <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert> : null}

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 7 }}>
          <PropertyForm selectedProperty={selectedProperty} onSaved={handleSaved} onCancelEdit={() => setSelectedProperty(null)} />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Propiedades existentes
          </Typography>
          {loading ? (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <CircularProgress size={20} />
              <Typography variant="body2">Cargando propiedades...</Typography>
            </Stack>
          ) : (
            <Stack spacing={1.5}>
              {properties.map((property) => (
                <Card key={property.id} variant={selectedProperty?.id === property.id ? "elevation" : "outlined"}>
                  <CardContent sx={{ pb: 1 }}>
                    <Typography variant="subtitle1">{property.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {property.type} · {property.operation === "sale" ? "Venta" : "Alquiler"} · {property.images.length} imágenes
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => setSelectedProperty(property)}>
                      Editar
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDelete(property.id)}>
                      Eliminar
                    </Button>
                  </CardActions>
                </Card>
              ))}
              {properties.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Todavía no hay propiedades cargadas.
                </Typography>
              ) : null}
            </Stack>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
