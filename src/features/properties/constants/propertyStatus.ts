import type { PropertyStatus } from "../../../types/property";

export const STATUS_CHIP_CONFIG: Record<PropertyStatus, { label: string; color: string }> = {
  available: { label: "Disponible", color: "#e4b61a" },
  reserved: { label: "Reservada", color: "#d1c5ad" },
  sold: { label: "Vendida", color: "#ffb4ab" },
  rented: { label: "Alquilada", color: "#ffb4ab" },
};
