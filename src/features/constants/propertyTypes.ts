export type PropertyTypeOption = {
  value: string;
  label: string;
};

export const PROPERTY_TYPE_OPTIONS: readonly PropertyTypeOption[] = [
  { value: "Departamento", label: "Departamentos" },
  { value: "Casa", label: "Casas" },
  { value: "Terreno", label: "Terrenos" },
  { value: "Local", label: "Locales" },
  { value: "PH", label: "PH" },
  { value: "Oficina", label: "Oficinas" },
];

export const PROPERTY_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  PROPERTY_TYPE_OPTIONS.map((item) => [item.value, item.label])
);