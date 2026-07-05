import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Box, Card, CardActionArea, CardContent, CardMedia, Chip, Divider, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { formatOperation, formatPrice } from "../../../lib/format";
import { buildImageAlt, formatSurface, getPropertyThumb } from "../../../lib/propertyDisplay";
import { FONT_MONO } from "../../../theme/tokens";
import type { Property } from "../../../types/property";

type PropertyListCardProps = {
  property: Property;
};

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.25} sx={{ minWidth: 0 }}>
      <Typography
        sx={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.08em", color: "text.secondary" }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 700 }} noWrap>
        {value}
      </Typography>
    </Stack>
  );
}

export default function PropertyListCard({ property }: PropertyListCardProps) {
  const thumb = getPropertyThumb(property);
  const surfaceLabel = formatSurface(property);
  const priceLabel = formatPrice(property.price, property.currency);

  return (
    <Card variant="outlined" sx={{ height: "100%", borderColor: "divider" }}>
      <CardActionArea component={RouterLink} to={`/propiedades/${property.id}`} sx={{ height: "100%", display: "block" }}>
        <Box sx={{ position: "relative" }}>
          {thumb ? (
            <CardMedia
              component="img"
              height="220"
              image={thumb}
              alt={buildImageAlt(property)}
              sx={{ objectFit: "cover", height: { xs: 190, sm: 220 } }}
            />
          ) : (
            <Box sx={{ height: { xs: 190, sm: 220 }, bgcolor: "background.default" }} role="img" aria-label="Sin imagen" />
          )}
          <Chip
            label={formatOperation(property.operation)}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontFamily: FONT_MONO,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              height: 24,
            }}
          />
        </Box>
        <CardContent sx={{ px: 2, py: 1.75, "&:last-child": { pb: 1.75 } }}>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", mb: 0.5, color: "text.secondary" }}>
            <LocationOnOutlinedIcon sx={{ fontSize: 15 }} />
            <Typography variant="caption" noWrap>
              {property.neighborhood}, {property.city}
            </Typography>
          </Stack>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 700,
              lineHeight: 1.25,
              mb: 1.5,
              display: "-webkit-box",
              overflow: "hidden",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              minHeight: "2.5em",
            }}
          >
            {property.title || `${property.neighborhood}, ${property.city}`}
          </Typography>

          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem sx={{ borderColor: "divider" }} />}
            spacing={2}
            sx={{ py: 1.5, mb: 1.5, borderTop: 1, borderBottom: 1, borderColor: "divider" }}
          >
            <SpecItem label="AREA" value={surfaceLabel} />
            {property.rooms > 0 ? <SpecItem label="AMB." value={String(property.rooms)} /> : null}
          </Stack>

          <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
            {priceLabel}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
