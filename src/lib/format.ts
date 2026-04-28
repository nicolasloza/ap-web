import type { Currency, Operation } from "../types/property";

export function formatOperation(o: Operation): string {
  return o === "sale" ? "Venta" : "Alquiler";
}

export function formatPrice(amount: string, currency: Currency): string {
  const n = Number(amount);
  if (Number.isNaN(n)) return amount;
  if (currency === "USD") {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "USD" }).format(
      n
    );
  }
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(
    n
  );
}
