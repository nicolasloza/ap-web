import { useQuery } from "@tanstack/react-query";
import { fetchNeighborhoods } from "../../../api/client";

export function useNeighborhoods() {
  const { data: neighborhoods = [] } = useQuery({
    queryKey: ["neighborhoods"],
    queryFn: () => fetchNeighborhoods().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  return { neighborhoods };
}
