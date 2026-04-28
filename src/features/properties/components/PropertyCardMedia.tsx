import { Box, CardMedia } from "@mui/material";
import { buildImageAlt, getPropertyThumb } from "../../../lib/propertyDisplay";
import type { Property } from "../../../types/property";

type PropertyCardMediaProps = {
  property: Property;
  height: number;
};

export default function PropertyCardMedia({ property, height }: PropertyCardMediaProps) {
  const thumb = getPropertyThumb(property);

  if (!thumb) {
    return <Box sx={{ height, bgcolor: "action.hover" }} role="img" aria-label="Sin imagen" />;
  }

  return (
    <CardMedia
      component="img"
      height={height}
      image={thumb}
      alt={buildImageAlt(property)}
      sx={{ objectFit: "cover" }}
    />
  );
}
