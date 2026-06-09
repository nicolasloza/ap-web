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
          <Grid container spacing={1.2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Nombre"
                placeholder="Nombre"
                {...register("firstName")}
                error={Boolean(errors.firstName)}
                helperText={errors.firstName?.message}
                required
                fullWidth
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Apellido"
                placeholder="Apellido"
                {...register("lastName")}
                error={Boolean(errors.lastName)}
                helperText={errors.lastName?.message}
                required
                fullWidth
                size="small"
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
          label={isAppraisal ? "E-mail" : "Email"}
          placeholder={isAppraisal ? "E-mail" : undefined}
          type="email"
          {...register("email")}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          required
          fullWidth
          size={isAppraisal ? "small" : "medium"}
        />
        <TextField
          label={isAppraisal ? "Teléfono" : "Número de contacto"}
          placeholder={isAppraisal ? "Teléfono" : undefined}
          {...register("phone")}
          error={Boolean(errors.phone)}
          helperText={errors.phone?.message}
          required
          fullWidth
          size={isAppraisal ? "small" : "medium"}
        />
        <TextField
          label={isAppraisal ? "Comentario" : "Mensaje"}
          placeholder={isAppraisal ? "Comentario" : undefined}
          {...register("message")}
          error={Boolean(errors.message)}
          helperText={errors.message?.message}
          required
          fullWidth
          multiline
          minRows={isAppraisal ? 4 : 5}
          size={isAppraisal ? "small" : "medium"}
        />

        <Box sx={{ display: "flex", justifyContent: isAppraisal ? "center" : "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={
              isAppraisal
                ? {
                    borderRadius: 999,
                    px: 5,
                    py: 0.8,
                    textTransform: "none",
                    fontWeight: 700,
                    bgcolor: "error.main",
                    "&:hover": { bgcolor: "error.dark" },
                  }
                : { minHeight: 42, width: { xs: "100%", sm: "auto" } }
            }
          >
            {isSubmitting ? "Enviando..." : submitLabel}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
