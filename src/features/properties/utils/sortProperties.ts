import { parsePriceValue } from "../../../lib/propertyDisplay";
import type { Property } from "../../../types/property";

export type SortOption =
  | "title_asc"
  | "title_desc"
  | "price_desc"
  | "price_asc";

export function parseSortOption(raw: string | null): SortOption {
  if (raw === "title_desc" || raw === "price_desc" || raw === "price_asc") {
    return raw;
  }
  return "title_asc";
}

export function sortProperties(items: Property[], sort: SortOption): Property[] {
  const sorted = [...items];
  switch (sort) {
    case "title_desc":
      sorted.sort((a, b) => b.title.localeCompare(a.title, "es", { sensitivity: "base" }));
      break;
    case "price_desc":
      sorted.sort((a, b) => parsePriceValue(b.price) - parsePriceValue(a.price));
      break;
    case "price_asc":
      sorted.sort((a, b) => parsePriceValue(a.price) - parsePriceValue(b.price));
      break;
    default:
      sorted.sort((a, b) => a.title.localeCompare(b.title, "es", { sensitivity: "base" }));
  }
  return sorted;
}
