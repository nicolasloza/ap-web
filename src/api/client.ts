import type {
  AdminUserDetailResponse,
  AdminUserListResponse,
  NeighborhoodListResponse,
  PropertyDetailResponse,
  PropertyInput,
  PropertyListResponse,
  PropertyTypeListResponse,
  UploadedPropertyImage,
} from "../types/property";
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

export async function fetchPropertyTypes(): Promise<PropertyTypeListResponse> {
  const r = await fetch(`${baseUrl()}/properties/types`);
  if (!r.ok) {
    const text = await r.text();
    throw new Error(text || r.statusText);
  }
  return r.json() as Promise<PropertyTypeListResponse>;
}

export async function fetchNeighborhoods(): Promise<NeighborhoodListResponse> {
  const r = await fetch(`${baseUrl()}/properties/neighborhoods`);
  if (!r.ok) {
    const text = await r.text();
    throw new Error(text || r.statusText);
  }
  return r.json() as Promise<NeighborhoodListResponse>;
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

export async function uploadPropertyImage(file: File): Promise<UploadedPropertyImage> {
  const body = new FormData();
  body.append("file", file);

  const r = await fetch(`${baseUrl()}/admin/uploads/property-image`, {
    method: "POST",
    body,
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(text || r.statusText);
  }
  return r.json() as Promise<UploadedPropertyImage>;
}

export async function createProperty(payload: PropertyInput): Promise<PropertyDetailResponse> {
  const r = await fetch(`${baseUrl()}/admin/properties`, {
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
  return r.json() as Promise<PropertyDetailResponse>;
}

export async function updateProperty(id: string, payload: PropertyInput): Promise<PropertyDetailResponse> {
  const r = await fetch(`${baseUrl()}/admin/properties/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(text || r.statusText);
  }
  return r.json() as Promise<PropertyDetailResponse>;
}

export async function deleteProperty(id: string): Promise<void> {
  const r = await fetch(`${baseUrl()}/admin/properties/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(text || r.statusText);
  }
}

export type AdminUserInput = {
  username: string;
  password: string;
  isAdmin?: boolean;
  active?: boolean;
};

export type AdminUserUpdateInput = {
  username?: string;
  password?: string;
  isAdmin?: boolean;
  active?: boolean;
};

export async function fetchAdminUsers(includeInactive = true): Promise<AdminUserListResponse> {
  const u = new URL("admin/users", `${baseUrl()}/`);
  u.searchParams.set("includeInactive", String(includeInactive));
  const r = await fetch(u.toString());
  if (!r.ok) {
    const text = await r.text();
    throw new Error(text || r.statusText);
  }
  return r.json() as Promise<AdminUserListResponse>;
}

export async function createAdminUser(payload: AdminUserInput): Promise<AdminUserDetailResponse> {
  const r = await fetch(`${baseUrl()}/admin/users`, {
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
  return r.json() as Promise<AdminUserDetailResponse>;
}

export async function updateAdminUser(id: string, payload: AdminUserUpdateInput): Promise<AdminUserDetailResponse> {
  const r = await fetch(`${baseUrl()}/admin/users/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(text || r.statusText);
  }
  return r.json() as Promise<AdminUserDetailResponse>;
}

export async function deleteAdminUser(id: string): Promise<void> {
  const r = await fetch(`${baseUrl()}/admin/users/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(text || r.statusText);
  }
}
