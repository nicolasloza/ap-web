import HotelOutlinedIcon from "@mui/icons-material/HotelOutlined";
import StraightenRoundedIcon from "@mui/icons-material/StraightenRounded";
import { Box, Card, CardActionArea, CardContent, CardMedia, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { formatPrice } from "../../../lib/format";
import {
  buildContextLine,
  buildImageAlt,
  formatSurface,
  getPropertyThumb,
} from "../../../lib/propertyDisplay";
import type { Property } from "../../../types/property";

type PropertyListCardProps = {
  property: Property;
};

export default function PropertyListCard({ property }: PropertyListCardProps) {
  const thumb = getPropertyThumb(property);
  const contextLine = buildContextLine(property);
  const surfaceLabel = formatSurface(property);
  const priceLabel = formatPrice(property.price, property.currency);

  return (
    <Card
      variant="outlined"
      sx={{ height: "100%", borderColor: "divider", boxShadow: "0 1px 2px rgba(0, 0, 0, 0.06)" }}
    >
      <CardActionArea component={RouterLink} to={`/propiedades/${property.id}`}>
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
            <Box sx={{ height: { xs: 190, sm: 220 }, bgcolor: "action.hover" }} role="img" aria-label="Sin imagen" />
          )}
          <Stack
            direction="row"
            spacing={1.25}
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              px: 1.25,
              py: 0.75,
              color: "common.white",
              bgcolor: "rgba(35, 35, 35, 0.7)",
              alignItems: "center",
            }}
          >
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", minWidth: 0 }}>
              <StraightenRoundedIcon sx={{ fontSize: 17 }} />
              <Typography variant="caption" sx={{ fontWeight: 600 }} noWrap>
                {surfaceLabel}
              </Typography>
            </Stack>
            {property.rooms > 0 ? (
              <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", minWidth: 0 }}>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  -
                </Typography>
                <HotelOutlinedIcon sx={{ fontSize: 17 }} />
                <Typography variant="caption" sx={{ fontWeight: 600 }} noWrap>
                  {property.rooms} amb.
                </Typography>
              </Stack>
            ) : null}
          </Stack>
        </Box>
        <CardContent sx={{ px: 1.5, py: 1.25, "&:last-child": { pb: 1.25 } }}>
          <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 0.25 }}>
            {contextLine}
          </Typography>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 700,
              lineHeight: 1.25,
              mb: 1.25,
              display: "-webkit-box",
              overflow: "hidden",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              minHeight: "2.5em",
            }}
          >
            {property.title || `${property.neighborhood}, ${property.city}`}
          </Typography>
          <Stack direction="row" sx={{ alignItems: "baseline", justifyContent: "space-between", gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {priceLabel}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
