import { Box, Card, Container, Divider, Grid, Skeleton, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { PROPERTY_TYPE_OPTIONS } from "../features/constants/propertyTypes";
import PropertySearchBar from "../features/home/components/PropertySearchBar";
import ActivePropertyFiltersBar from "../features/properties/components/ActivePropertyFiltersBar";
import PropertyListCard from "../features/properties/components/PropertyListCard";
import PropertyListPagination from "../features/properties/components/PropertyListPagination";
import { usePropertyListData } from "../features/properties/hooks/usePropertyListData";
import { usePropertyListQueryState } from "../features/properties/hooks/usePropertyListQueryState";
import { useNeighborhoods } from "../features/properties/hooks/useNeighborhoods";
import { sortProperties } from "../features/properties/utils/sortProperties";
import { FONT_MONO } from "../theme/tokens";

function PropertyCardSkeleton() {
  return (
    <Card variant="outlined" sx={{ height: "100%", borderColor: "divider" }}>
      <Skeleton variant="rectangular" height={220} sx={{ display: "block" }} />
      <Stack spacing={1} sx={{ px: 1.5, pt: 1.25, pb: 1.5 }}>
        <Skeleton width="60%" height={18} />
        <Skeleton width="90%" height={22} />
        <Skeleton width="50%" height={22} />
        <Skeleton width="45%" height={26} sx={{ mt: 0.5 }} />
      </Stack>
    </Card>
  );
}

export default function PropertyListPage() {
  const {
    query,
    propertyType,
    operationFromQuery,
    neighborhood,
    minRooms,
    priceRange,
    sort,
    page,
    propertyTypeLabel,
    hasAnyFilter,
    searchTerm,
    selectedPropertyType,
    selectedOperation,
    selectedNeighborhood,
    selectedMinRooms,
    selectedPriceRange,
    setSearchTerm,
    setSelectedPropertyType,
    setSelectedOperation,
    setSelectedNeighborhood,
    setSelectedMinRooms,
    setSelectedPriceRange,
    onSearchSubmit,
    onSortChange,
    onPageChange,
    clearFilters,
    clearFilter,
  } = usePropertyListQueryState();
  const { neighborhoods } = useNeighborhoods();
  const { items, total, totalPages, loading, error } = usePropertyListData({
    query,
    propertyType,
    operationFromQuery,
    neighborhood,
    minRooms,
    priceRange,
    page,
  });

  const sortedItems = useMemo(() => {
    return sortProperties(items, sort);
  }, [items, sort]);

  if (error) {
    return (
      <Container>
        <Typography color="error" role="alert">
          {error}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Comprobá que la API esté en marcha y que `VITE_API_BASE_URL` en `.env` apunte a
          `http://localhost:3000/api` (mismo `PORT` que en el backend).
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1.5 }}>
        <Divider sx={{ width: 24, borderBottomWidth: 2, borderColor: "primary.main" }} />
        <Typography
          sx={{ fontFamily: FONT_MONO, fontSize: 12, letterSpacing: "0.1em", color: "primary.main" }}
        >
          PROPIEDADES {new Date().getFullYear()}
        </Typography>
      </Stack>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontSize: { xs: "2rem", sm: "2.75rem" } }}>
        Propiedades
      </Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 640, mb: 3 }}>
        Una selección curada de propiedades y oportunidades de inversión en las zonas más
        exclusivas. Precisión en la selección, excelencia en la ejecución.
      </Typography>
      <Box sx={{ mb: 3 }}>
        <PropertySearchBar
          searchTerm={searchTerm}
          propertyType={selectedPropertyType}
          operation={selectedOperation}
          propertyTypeOptions={PROPERTY_TYPE_OPTIONS}
          onSearchTermChange={setSearchTerm}
          onPropertyTypeChange={setSelectedPropertyType}
          onOperationChange={setSelectedOperation}
          sort={sort}
          onSortChange={onSortChange}
          onSubmit={onSearchSubmit}
          neighborhoods={neighborhoods}
          selectedNeighborhood={selectedNeighborhood}
          onNeighborhoodChange={setSelectedNeighborhood}
          selectedPriceRange={selectedPriceRange}
          onPriceRangeChange={setSelectedPriceRange}
          selectedMinRooms={selectedMinRooms}
          onMinRoomsChange={setSelectedMinRooms}
        />
      </Box>
      <ActivePropertyFiltersBar
        hasAnyFilter={hasAnyFilter}
        query={query}
        propertyType={propertyType}
        propertyTypeLabel={propertyTypeLabel}
        operationFromQuery={operationFromQuery}
        neighborhood={neighborhood}
        minRooms={minRooms}
        priceRange={priceRange}
        itemsLength={total}
        loading={loading}
        onClearFilters={clearFilters}
        onClearFilter={clearFilter}
      />

      {loading ? (
        <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mt: hasAnyFilter ? 0 : 2 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <PropertyCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : items.length === 0 && !hasAnyFilter ? (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          No hay propiedades. Ejecutá el seed en el API.
        </Typography>
      ) : items.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 4, textAlign: "center" }}>
          No encontramos propiedades con ese criterio. Probá otra búsqueda.
        </Typography>
      ) : (
        <>
          <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mt: hasAnyFilter ? 0 : 2 }}>
            {sortedItems.map((property) => (
              <Grid key={property.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <PropertyListCard property={property} />
              </Grid>
            ))}
          </Grid>
          <PropertyListPagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
        </>
      )}
    </Container>
  );
}
