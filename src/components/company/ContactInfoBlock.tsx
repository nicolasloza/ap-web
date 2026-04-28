import PhoneIcon from "@mui/icons-material/Phone";
import { Paper, Stack, Typography } from "@mui/material";
import {
  CONTACT_INFO,
  FORMATTED_PHONES,
  FORMATTED_PHONES_INTERNATIONAL,
} from "../../features/company/constants/contactInfo";

type ContactInfoBlockProps = {
  compact?: boolean;
};

export default function ContactInfoBlock({ compact = false }: ContactInfoBlockProps) {
  if (compact) {
    return (
      <Stack spacing={0.75}>
        <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.1, mb: 1.25 }}>
          Casa Central
        </Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
          <PhoneIcon sx={{ color: "#17b5ff", fontSize: 18 }} />
          <Typography sx={{ fontSize: "1rem" }}>{FORMATTED_PHONES}</Typography>
        </Stack>
      </Stack>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 } }}>
      <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
        {CONTACT_INFO.officeName}
      </Typography>
      <Stack spacing={0.5}>
        <Typography>{CONTACT_INFO.addressLine1}</Typography>
        <Typography>{CONTACT_INFO.addressLine2}</Typography>
        <Typography>Tel.: {FORMATTED_PHONES_INTERNATIONAL}</Typography>
        <Typography>{CONTACT_INFO.email}</Typography>
      </Stack>
    </Paper>
  );
}
