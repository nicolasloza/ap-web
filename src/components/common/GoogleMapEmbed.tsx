import { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import { FONT_MONO } from "../../theme/tokens";

type ResponsiveHeight = number | { xs?: number; sm?: number; md?: number };

type GoogleMapEmbedProps = {
  /** Dirección completa a buscar (calle, barrio, ciudad, país). */
  address: string;
  height?: ResponsiveHeight;
  title?: string;
};

// Embed "clásico" de Google Maps (maps.google.com/maps?q=...&output=embed):
// no requiere API key ni cuenta de facturación, a diferencia de la Maps Embed API.
export default function GoogleMapEmbed({
  address,
  height = { xs: 220, sm: 300, md: 400 },
  title,
}: GoogleMapEmbedProps) {
  const [debouncedAddress, setDebouncedAddress] = useState(address);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedAddress(address), 600);
    return () => window.clearTimeout(timeoutId);
  }, [address]);

  const trimmed = debouncedAddress.trim();

  return (
    <Box sx={{ width: "100%", height, borderRadius: 1, overflow: "hidden", border: 1, borderColor: "divider" }}>
      {trimmed ? (
        <Box
          component="iframe"
          key={trimmed}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          title={title ?? `Mapa de ${trimmed}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          sx={{ width: "100%", height: "100%", border: 0, display: "block" }}
        />
      ) : (
        <Stack
          sx={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center", bgcolor: "background.default" }}
          spacing={0.5}
        >
          <PlaceRoundedIcon sx={{ color: "primary.main", fontSize: 32 }} />
          <Typography sx={{ fontFamily: FONT_MONO, fontSize: 12, color: "text.secondary" }}>
            Completá la dirección para ver el mapa
          </Typography>
        </Stack>
      )}
    </Box>
  );
}
