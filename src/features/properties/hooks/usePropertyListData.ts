import { useQuery } from "@tanstack/react-query";
import { fetchPropertyList } from "../../../api/client";
import type { Operation } from "../../../types/property";

type UsePropertyListDataParams = {
  query: string;
  propertyType: string;
  operationFromQuery: Operation | undefined;
};

export function usePropertyListData({
  query,
  propertyType,
  operationFromQuery,
}: UsePropertyListDataParams) {
  const { data: items = [], isLoading: loading, error } = useQuery({
    queryKey: ["properties", { query, propertyType, operationFromQuery }],
    queryFn: () =>
      fetchPropertyList(1, 20, {
        q: query || undefined,
        type: propertyType || undefined,
        operation: operationFromQuery,
      }).then((r) => r.data),
  });

  return {
    items,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}
