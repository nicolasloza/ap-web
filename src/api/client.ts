import type { PropertyDetailResponse, PropertyListResponse } from "../types/property";
import type { Operation } from "../types/property";

export type ContactMessagePayload = {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  source: "contact" | "appraisal";
};

export type PropertyListFilters = {
  q?: string;
  type?: string;
  operation?: Operation;
};

function baseUrl() {
  const b = import.meta.env.VITE_API_BASE_URL;
  if (!b) {
    throw new Error("Falta VITE_API_BASE_URL en .env (ver .env.example)");
  }
  return b.replace(/\/$/, "");
}

export async function fetchPropertyList(
  page = 1,
  pageSize = 12,
  filters: PropertyListFilters = {}
): Promise<PropertyListResponse> {
  const u = new URL("properties", `${baseUrl()}/`);
  u.searchParams.set("page", String(page));
  u.searchParams.set("pageSize", String(pageSize));
  if (filters.q?.trim()) {
    u.searchParams.set("q", filters.q.trim());
  }
  if (filters.type?.trim()) {
    u.searchParams.set("type", filters.type.trim());
  }
  if (filters.operation) {
    u.searchParams.set("operation", filters.operation);
  }
  const r = await fetch(u.toString());
  if (!r.ok) {
    const text = await r.text();
    throw new Error(text || r.statusText);
  }
  return r.json() as Promise<PropertyListResponse>;
}

export async function fetchPropertyById(id: string): Promise<PropertyDetailResponse> {
  const r = await fetch(`${baseUrl()}/properties/${encodeURIComponent(id)}`);
  if (r.status === 404) {
    throw new Error("not_found");
  }
  if (!r.ok) {
    const text = await r.text();
    throw new Error(text || r.statusText);
  }
  return r.json() as Promise<PropertyDetailResponse>;
}

export async function sendContactMessage(payload: ContactMessagePayload): Promise<void> {
  const r = await fetch(`${baseUrl()}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(text || r.statusText);
  }
}
