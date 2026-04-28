import { useEffect, useState } from "react";
import { fetchPropertyList } from "../../../api/client";
import type { Property } from "../../../types/property";

export function useFeaturedProperties() {
    const [featured, setFeatured] = useState<Property[]>([]);
    const [loadingFeatured, setLoadingFeatured] = useState(true);
    const [featuredError, setFeaturedError] = useState<string | null>(null);

    useEffect(() => {
        let done = false;
        (async () => {
            setLoadingFeatured(true);
            setFeaturedError(null);
            try {
                const res = await fetchPropertyList(1, 6);
                if (!done) {
                    setFeatured(res.data.slice(0, 6));
                }
            } catch (e) {
                if (!done) {
                    setFeaturedError(e instanceof Error ? e.message : "No se pudieron cargar destacadas.");
                }
            } finally {
                if (!done) {
                    setLoadingFeatured(false);
                }
            }
        })();
        return () => {
            done = true;
        };
    }, []);

    return { featured, loadingFeatured, featuredError };
}
