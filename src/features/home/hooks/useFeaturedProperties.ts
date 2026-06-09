import { useQuery } from "@tanstack/react-query";
import { fetchPropertyList } from "../../../api/client";

export function useFeaturedProperties() {
  const { data: featured = [], isLoading: loadingFeatured, error } = useQuery({
    queryKey: ["properties", "featured"],
    queryFn: () => fetchPropertyList(1, 6).then((r) => r.data.slice(0, 6)),
  });

  return {
    featured,
    loadingFeatured,
    featuredError: error instanceof Error ? error.message : null,
  };
}
