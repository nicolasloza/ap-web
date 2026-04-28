import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import ContactInfoBlock from "../components/company/ContactInfoBlock";
import InquiryForm from "../components/forms/InquiryForm";

export default function ContactPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 2.5, sm: 3 } }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, fontSize: { xs: "1.7rem", sm: "2rem" } }} gutterBottom>
            Contacto
          </Typography>
          <Typography color="text.secondary">
            Completá el formulario y nos pondremos en contacto con vos.
          </Typography>
        </Box>

        <ContactInfoBlock />

        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 } }}>
          <InquiryForm mode="contact" />
        </Paper>
      </Stack>
    </Container>
  );
}
