import type { SortOption } from "../utils/sortProperties";

export type SortMenuOption = {
  value: SortOption;
  label: string;
};

export const SORT_MENU_OPTIONS: readonly SortMenuOption[] = [
  { value: "title_asc", label: "Nombre: A a Z" },
  { value: "title_desc", label: "Nombre: Z a A" },
  { value: "price_desc", label: "Precio: Mayor a menor" },
  { value: "price_asc", label: "Precio: Menor a mayor" },
];
