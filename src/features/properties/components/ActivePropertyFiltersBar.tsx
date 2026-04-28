import { Button, Chip, Paper, Stack, Typography } from "@mui/material";
import type { Operation } from "../../../types/property";

type ActivePropertyFiltersBarProps = {
  hasAnyFilter: boolean;
  query: string;
  propertyType: string;
  propertyTypeLabel: string;
  operationFromQuery: Operation | undefined;
  itemsLength: number;
  onClearFilters: () => void;
};

export default function ActivePropertyFiltersBar({
  hasAnyFilter,
  query,
  propertyType,
  propertyTypeLabel,
  operationFromQuery,
  itemsLength,
  onClearFilters,
}: ActivePropertyFiltersBarProps) {
  return (
    <>
      {hasAnyFilter ? (
        <Paper variant="outlined" sx={{ px: { xs: 1.5, sm: 2 }, py: 1.25, mb: 2, bgcolor: "background.paper" }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" } }}
          >
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
              {query ? <Chip size="small" label={`Busqueda: ${query}`} variant="outlined" /> : null}
              {propertyType ? <Chip size="small" label={`Tipo: ${propertyTypeLabel}`} variant="outlined" /> : null}
              {operationFromQuery ? (
                <Chip
                  size="small"
                  label={`Operacion: ${operationFromQuery === "sale" ? "Venta" : "Alquiler"}`}
                  color="primary"
                />
              ) : null}
            </Stack>
            <Button size="small" onClick={onClearFilters} sx={{ width: { xs: "100%", sm: "auto" } }}>
              Limpiar filtros
            </Button>
          </Stack>
        </Paper>
      ) : null}

      {hasAnyFilter && itemsLength === 0 ? (
        <Paper variant="outlined" sx={{ px: 2, py: 1.5, mb: 2, bgcolor: "action.hover" }}>
          <Typography color="text.secondary">
            No encontramos propiedades con ese criterio. Proba otra busqueda.
          </Typography>
        </Paper>
      ) : null}
    </>
  );
}
