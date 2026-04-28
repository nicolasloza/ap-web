import { Container, Grid, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import PageLoadingCenter from "../components/feedback/PageLoadingCenter";
import { PROPERTY_TYPE_OPTIONS } from "../features/constants/propertyTypes";
import PropertySearchBar from "../features/home/components/PropertySearchBar";
import ActivePropertyFiltersBar from "../features/properties/components/ActivePropertyFiltersBar";
import PropertyListCard from "../features/properties/components/PropertyListCard";
import PropertyListSortField from "../features/properties/components/PropertyListSortField";
import { usePropertyListData } from "../features/properties/hooks/usePropertyListData";
import { usePropertyListQueryState } from "../features/properties/hooks/usePropertyListQueryState";
import { sortProperties } from "../features/properties/utils/sortProperties";

// Página de listado: sincroniza filtros con URL, carga datos y renderiza cards de propiedades.
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

  if (loading) {
    return <PageLoadingCenter ariaLabel="Cargando" />;
  }

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

  if (items.length === 0 && !hasAnyFilter) {
    return (
      <Container>
        <Typography color="text.secondary">No hay propiedades. Ejecutá el seed en el API.</Typography>
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
        onSubmit={onSearchSubmit}
      />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ mt: 1.5, mb: 2, alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between" }}
      >
        <PropertyListSortField sort={sort} onSortChange={onSortChange} />
      </Stack>
      <ActivePropertyFiltersBar
        hasAnyFilter={hasAnyFilter}
        query={query}
        propertyType={propertyType}
        propertyTypeLabel={propertyTypeLabel}
        operationFromQuery={operationFromQuery}
        itemsLength={items.length}
        onClearFilters={clearFilters}
      />

      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
        {sortedItems.map((property) => (
          <Grid key={property.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <PropertyListCard property={property} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
