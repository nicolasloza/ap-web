import { formatOperation } from "./format";
import type { Property } from "../types/property";

export function getPropertyThumb(property: Property): string | undefined {
  return property.images[0]?.url;
}

export function parseNumericValue(value: string | null): number | null {
  if (!value) return null;
  const normalized = value.replace(/\./g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isNaN(parsed) ? null : parsed;
}

export function parsePriceValue(value: string): number {
  const normalized = value.replace(/\./g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function formatSurface(property: Property): string {
  const numericSurface =
    parseNumericValue(property.totalM2) ?? parseNumericValue(property.coveredM2);
  if (numericSurface === null || numericSurface <= 0) {
    return "Superficie s/d";
  }
  const hasDecimals = Math.abs(numericSurface % 1) > 0;
  return `${new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: hasDecimals ? 1 : 0,
    maximumFractionDigits: 1,
  }).format(numericSurface)} m²`;
}

export function buildContextLine(property: Property): string {
  const location = [property.neighborhood, property.city].filter(Boolean).join(", ");
  const operationLabel = formatOperation(property.operation);
  return `${property.type} en ${operationLabel}${location ? ` en ${location}` : ""}`;
}

export function buildImageAlt(property: Property): string {
  const location = [property.neighborhood, property.city].filter(Boolean).join(", ");
  return location
    ? `${property.type} en ${location}`
    : `${property.type} en venta o alquiler`;
}

export function buildReferenceCode(property: Property): string {
  const compactId = property.id.replace(/[^a-zA-Z0-9]/g, "").slice(-7).toUpperCase();
  return `REF${compactId || property.id.slice(-6).toUpperCase()}`;
}
