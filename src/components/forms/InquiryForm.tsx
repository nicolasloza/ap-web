import { Alert, Box, Button, Grid, Stack, TextField } from "@mui/material";
import type { InquiryFormProps } from "./inquiryForm/inquiryFormTypes";
import { useInquiryForm } from "./inquiryForm/useInquiryForm";

export default function InquiryForm({
  mode,
  submitLabel = "Enviar",
  successMessage = "Consulta enviada. Te contactaremos a la brevedad.",
}: InquiryFormProps) {
  const {
    register,
    errors,
    isSubmitting,
    success,
    submitError,
    isAppraisal,
    onSubmit,
  } = useInquiryForm({ mode, successMessage });

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Stack spacing={2}>
        {success ? <Alert severity="success">{success}</Alert> : null}
        {submitError ? <Alert severity="error">{submitError}</Alert> : null}

        {isAppraisal ? (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Nombre"
                {...register("firstName")}
                error={Boolean(errors.firstName)}
                helperText={errors.firstName?.message}
                required
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Apellido"
                {...register("lastName")}
                error={Boolean(errors.lastName)}
                helperText={errors.lastName?.message}
                required
                fullWidth
              />
            </Grid>
          </Grid>
        ) : (
          <TextField
            label="Nombre y apellido"
            {...register("fullName")}
            error={Boolean(errors.fullName)}
            helperText={errors.fullName?.message}
            required
            fullWidth
          />
        )}

        <TextField
          label="Email"
          type="email"
          {...register("email")}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          required
          fullWidth
        />
        <TextField
          label="Teléfono"
          {...register("phone")}
          error={Boolean(errors.phone)}
          helperText={errors.phone?.message}
          required
          fullWidth
        />

        {isAppraisal && (
          <TextField
            label="Dirección de la propiedad"
            {...register("propertyAddress")}
            error={Boolean(errors.propertyAddress)}
            helperText={errors.propertyAddress?.message}
            required
            fullWidth
          />
        )}

        <TextField
          label="Mensaje"
          {...register("message")}
          error={Boolean(errors.message)}
          helperText={errors.message?.message}
          required
          fullWidth
          multiline
          minRows={4}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ minHeight: 42, width: { xs: "100%", sm: "auto" }, px: 4 }}
          >
            {isSubmitting ? "Enviando..." : submitLabel}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
