import { Card, Container, Grid, Skeleton, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { PROPERTY_TYPE_OPTIONS } from "../features/constants/propertyTypes";
import PropertySearchBar from "../features/home/components/PropertySearchBar";
import ActivePropertyFiltersBar from "../features/properties/components/ActivePropertyFiltersBar";
import PropertyListCard from "../features/properties/components/PropertyListCard";
import { usePropertyListData } from "../features/properties/hooks/usePropertyListData";
import { usePropertyListQueryState } from "../features/properties/hooks/usePropertyListQueryState";
import { sortProperties } from "../features/properties/utils/sortProperties";

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
    sort,
    propertyTypeLabel,
    hasAnyFilter,
    searchTerm,
    selectedPropertyType,
    selectedOperation,
    setSearchTerm,
    setSelectedPropertyType,
    setSelectedOperation,
    onSearchSubmit,
    onSortChange,
    clearFilters,
  } = usePropertyListQueryState();
  const { items, loading, error } = usePropertyListData({
    query,
    propertyType,
    operationFromQuery,
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
    <Container maxWidth="lg" sx={{ py: { xs: 2.5, sm: 3 } }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: "1.7rem", sm: "2rem" } }}>
        Propiedades
      </Typography>
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
      />
      <ActivePropertyFiltersBar
        hasAnyFilter={hasAnyFilter}
        query={query}
        propertyType={propertyType}
        propertyTypeLabel={propertyTypeLabel}
        operationFromQuery={operationFromQuery}
        itemsLength={items.length}
        loading={loading}
        onClearFilters={clearFilters}
      />

      {loading ? (
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
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
      ) : (
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          {sortedItems.map((property) => (
            <Grid key={property.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <PropertyListCard property={property} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
