export type PriceRangeOption = {
  value: string;
  label: string;
  minPrice?: number;
  maxPrice?: number;
};

export const PRICE_RANGE_OPTIONS: readonly PriceRangeOption[] = [
  { value: "", label: "Cualquier precio" },
  { value: "0-150000", label: "Hasta US$ 150.000", maxPrice: 150_000 },
  { value: "150000-300000", label: "US$ 150.000 - 300.000", minPrice: 150_000, maxPrice: 300_000 },
  { value: "300000-500000", label: "US$ 300.000 - 500.000", minPrice: 300_000, maxPrice: 500_000 },
  { value: "500000-", label: "Más de US$ 500.000", minPrice: 500_000 },
];
