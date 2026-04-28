import { useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PROPERTY_TYPE_LABELS } from "../../constants/propertyTypes";
import type { Operation } from "../../../types/property";
import { parseSortOption, type SortOption } from "../utils/sortProperties";

export function usePropertyListQueryState() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const query = params.get("q")?.trim() ?? "";
  const propertyType = params.get("type")?.trim() ?? "";
  const operationValue = params.get("operation")?.trim() ?? "";
  const operationFromQuery: Operation | undefined =
    operationValue === "sale" || operationValue === "rent" ? operationValue : undefined;
  const sort = parseSortOption(params.get("sort"));
  const propertyTypeLabel = PROPERTY_TYPE_LABELS[propertyType] ?? propertyType;
  const hasAnyFilter = Boolean(query || propertyType || operationFromQuery);
  const [searchTerm, setSearchTerm] = useState(query);
  const [selectedPropertyType, setSelectedPropertyType] = useState(propertyType);
  const [selectedOperation, setSelectedOperation] = useState<"" | Operation>(operationFromQuery ?? "");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearchTerm(query);
      setSelectedPropertyType(propertyType);
      setSelectedOperation(operationFromQuery ?? "");
    }, 0);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [operationFromQuery, propertyType, query]);

  const onSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextParams = new URLSearchParams();
    const nextQuery = searchTerm.trim();
    const nextPropertyType = selectedPropertyType.trim();
    if (nextQuery) {
      nextParams.set("q", nextQuery);
    }
    if (nextPropertyType) {
      nextParams.set("type", nextPropertyType);
    }
    if (selectedOperation) {
      nextParams.set("operation", selectedOperation);
    }
    if (sort !== "title_asc") {
      nextParams.set("sort", sort);
    }
    navigate(nextParams.toString() ? `/propiedades?${nextParams.toString()}` : "/propiedades");
  };

  const onSortChange = (value: SortOption) => {
    const nextParams = new URLSearchParams(search);
    if (value === "title_asc") {
      nextParams.delete("sort");
    } else {
      nextParams.set("sort", value);
    }
    navigate(nextParams.toString() ? `/propiedades?${nextParams.toString()}` : "/propiedades");
  };

  const clearFilters = () => navigate("/propiedades");

  return {
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
  };
}
