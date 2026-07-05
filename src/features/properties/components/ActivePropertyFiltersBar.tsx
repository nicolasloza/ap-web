import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import type { Operation } from "../../../types/property";
import type { PriceRangeOption } from "../constants/priceRanges";

type ActivePropertyFiltersBarProps = {
  hasAnyFilter: boolean;
  query: string;
  propertyType: string;
  propertyTypeLabel: string;
  operationFromQuery: Operation | undefined;
  neighborhood: string;
  minRooms: number | undefined;
  priceRange: PriceRangeOption | undefined;
  itemsLength: number;
  loading: boolean;
  onClearFilters: () => void;
  onClearFilter: (key: "q" | "type" | "operation" | "neighborhood" | "minRooms" | "priceRange") => void;
};

export default function ActivePropertyFiltersBar({
  hasAnyFilter,
  query,
  propertyType,
  propertyTypeLabel,
  operationFromQuery,
  neighborhood,
  minRooms,
  priceRange,
  itemsLength,
  loading,
  onClearFilters,
  onClearFilter,
}: ActivePropertyFiltersBarProps) {
  if (!hasAnyFilter) return null;

  const filterCount = [
    query,
    propertyType,
    operationFromQuery,
    neighborhood,
    minRooms,
    priceRange?.value,
  ].filter(Boolean).length;
  const showCount = !loading && itemsLength > 0;

  return (
    <Box sx={{ position: "relative", display: "flex", alignItems: "center", mt: 2, mb: 2.5, minHeight: 32 }}>
      {/* Izquierda: chips */}
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center" }}>
        {query && (
          <Chip label={`"${query}"`} size="small" onDelete={() => onClearFilter("q")} />
        )}
        {propertyType && (
          <Chip label={propertyTypeLabel} size="small" onDelete={() => onClearFilter("type")} />
        )}
        {operationFromQuery && (
          <Chip
            label={operationFromQuery === "sale" ? "Venta" : "Alquiler"}
            size="small"
            onDelete={() => onClearFilter("operation")}
          />
        )}
        {neighborhood && (
          <Chip label={neighborhood} size="small" onDelete={() => onClearFilter("neighborhood")} />
        )}
        {minRooms && (
          <Chip label={`${minRooms}+ ambientes`} size="small" onDelete={() => onClearFilter("minRooms")} />
        )}
        {priceRange?.value && (
          <Chip label={priceRange.label} size="small" onDelete={() => onClearFilter("priceRange")} />
        )}
      </Stack>

      {/* Centro: conteo (solo cuando hay resultados) */}
      {showCount && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {itemsLength} propiedad{itemsLength !== 1 ? "es" : ""}
        </Typography>
      )}

      {/* Derecha: limpiar todo (solo con más de un filtro) */}
      {filterCount > 1 && (
        <Button
          size="small"
          variant="text"
          onClick={onClearFilters}
          sx={{ ml: "auto", color: "text.secondary", fontSize: "0.8rem", flexShrink: 0 }}
        >
          Limpiar todo
        </Button>
      )}
    </Box>
  );
}
