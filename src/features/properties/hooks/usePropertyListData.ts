import { useQuery } from "@tanstack/react-query";
import { fetchPropertyList } from "../../../api/client";
import type { Operation } from "../../../types/property";
import type { PriceRangeOption } from "../constants/priceRanges";

const PAGE_SIZE = 9;

type UsePropertyListDataParams = {
  query: string;
  propertyType: string;
  operationFromQuery: Operation | undefined;
  neighborhood: string;
  minRooms: number | undefined;
  priceRange: PriceRangeOption | undefined;
  page: number;
};

export function usePropertyListData({
  query,
  propertyType,
  operationFromQuery,
  neighborhood,
  minRooms,
  priceRange,
  page,
}: UsePropertyListDataParams) {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: [
      "properties",
      { query, propertyType, operationFromQuery, neighborhood, minRooms, priceRange: priceRange?.value, page },
    ],
    queryFn: () =>
      fetchPropertyList(page, PAGE_SIZE, {
        q: query || undefined,
        type: propertyType || undefined,
        operation: operationFromQuery,
        neighborhood: neighborhood || undefined,
        minRooms,
        minPrice: priceRange?.minPrice,
        maxPrice: priceRange?.maxPrice,
      }),
  });

  return {
    items: data?.data ?? [],
    totalPages: data?.totalPages ?? 1,
    total: data?.total ?? 0,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}
