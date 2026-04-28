import { useEffect, useState } from "react";
import { fetchPropertyList } from "../../../api/client";
import type { Operation, Property } from "../../../types/property";

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
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let done = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchPropertyList(1, 20, {
          q: query || undefined,
          type: propertyType || undefined,
          operation: operationFromQuery,
        });
        if (!done) setItems(res.data);
      } catch (e) {
        if (!done) setError(e instanceof Error ? e.message : "Error al cargar");
      } finally {
        if (!done) setLoading(false);
      }
    })();
    return () => {
      done = true;
    };
  }, [operationFromQuery, propertyType, query]);

  return { items, loading, error };
}
