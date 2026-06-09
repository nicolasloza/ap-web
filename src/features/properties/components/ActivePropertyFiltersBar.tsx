import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import type { Operation } from "../../../types/property";

type ActivePropertyFiltersBarProps = {
  hasAnyFilter: boolean;
  query: string;
  propertyType: string;
  propertyTypeLabel: string;
  operationFromQuery: Operation | undefined;
  itemsLength: number;
  loading: boolean;
  onClearFilters: () => void;
  onClearFilter: (key: "q" | "type" | "operation") => void;
};

export default function ActivePropertyFiltersBar({
  hasAnyFilter,
  query,
  propertyType,
  propertyTypeLabel,
  operationFromQuery,
  itemsLength,
  loading,
  onClearFilters,
  onClearFilter,
}: ActivePropertyFiltersBarProps) {
  if (!hasAnyFilter) return null;

  const filterCount = [query, propertyType, operationFromQuery].filter(Boolean).length;
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
