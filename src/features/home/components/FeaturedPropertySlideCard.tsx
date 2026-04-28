import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { formatOperation, formatPrice } from "../../../lib/format";
import PropertyCardMedia from "../../properties/components/PropertyCardMedia";
import type { Property } from "../../../types/property";

type FeaturedPropertySlideCardProps = {
  property: Property;
};

export default function FeaturedPropertySlideCard({
  property,
}: FeaturedPropertySlideCardProps) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardActionArea component={RouterLink} to={`/propiedades/${property.id}`}>
        <PropertyCardMedia property={property} height={180} />
        <CardContent>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", mb: 0.5 }}>
            <Chip size="small" label={formatOperation(property.operation)} color="primary" />
            <Chip size="small" label={property.type} variant="outlined" />
          </Stack>
          <Typography variant="h6" component="h3" gutterBottom>
            {property.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              overflow: "hidden",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              minHeight: "2.7em",
            }}
          >
            {property.neighborhood}, {property.city}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
            {formatPrice(property.price, property.currency)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
