import { useEffect, useState, type SubmitEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PROPERTY_TYPE_LABELS } from "../../constants/propertyTypes";
import type { Operation } from "../../../types/property";
import { PRICE_RANGE_OPTIONS } from "../constants/priceRanges";
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
  const neighborhood = params.get("neighborhood")?.trim() ?? "";
  const minRoomsParam = Number.parseInt(params.get("minRooms") ?? "", 10);
  const minRooms = Number.isFinite(minRoomsParam) && minRoomsParam > 0 ? minRoomsParam : undefined;
  const priceRangeValue = params.get("priceRange")?.trim() ?? "";
  const priceRange = PRICE_RANGE_OPTIONS.find((option) => option.value === priceRangeValue);
  const sort = parseSortOption(params.get("sort"));
  const pageParam = Number.parseInt(params.get("page") ?? "1", 10);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const propertyTypeLabel = PROPERTY_TYPE_LABELS[propertyType] ?? propertyType;
  const hasAnyFilter = Boolean(
    query || propertyType || operationFromQuery || neighborhood || minRooms || priceRange?.value
  );
  const [searchTerm, setSearchTerm] = useState(query);
  const [selectedPropertyType, setSelectedPropertyType] = useState(propertyType);
  const [selectedOperation, setSelectedOperation] = useState<"" | Operation>(operationFromQuery ?? "");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(neighborhood);
  const [selectedMinRooms, setSelectedMinRooms] = useState<number | undefined>(minRooms);
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRangeValue);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearchTerm(query);
      setSelectedPropertyType(propertyType);
      setSelectedOperation(operationFromQuery ?? "");
      setSelectedNeighborhood(neighborhood);
      setSelectedMinRooms(minRooms);
      setSelectedPriceRange(priceRangeValue);
    }, 0);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [operationFromQuery, propertyType, query, neighborhood, minRooms, priceRangeValue]);

  const onSearchSubmit = (event: SubmitEvent<HTMLFormElement>) => {
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
    if (selectedNeighborhood) {
      nextParams.set("neighborhood", selectedNeighborhood);
    }
    if (selectedMinRooms) {
      nextParams.set("minRooms", String(selectedMinRooms));
    }
    if (selectedPriceRange) {
      nextParams.set("priceRange", selectedPriceRange);
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
    nextParams.delete("page");
    navigate(nextParams.toString() ? `/propiedades?${nextParams.toString()}` : "/propiedades");
  };

  const onPageChange = (nextPage: number) => {
    const nextParams = new URLSearchParams(search);
    if (nextPage > 1) {
      nextParams.set("page", String(nextPage));
    } else {
      nextParams.delete("page");
    }
    navigate(nextParams.toString() ? `/propiedades?${nextParams.toString()}` : "/propiedades");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => navigate("/propiedades");

  const clearFilter = (key: "q" | "type" | "operation" | "neighborhood" | "minRooms" | "priceRange") => {
    const nextParams = new URLSearchParams(search);
    nextParams.delete(key);
    nextParams.delete("page");
    navigate(nextParams.toString() ? `/propiedades?${nextParams.toString()}` : "/propiedades");
  };

  return {
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
  };
}
