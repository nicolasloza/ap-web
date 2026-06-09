export type Operation = "sale" | "rent";
export type Currency = "ARS" | "USD";

export interface PropertyImage {
  id: string;
  url: string;
  publicId: string | null;
  sortOrder: number;
  width: number | null;
  height: number | null;
  format: string | null;
  bytes: number | null;
}

export interface Property {
  id: string;
  operation: Operation;
  type: string;
  title: string;
  description: string;
  price: string;
  currency: Currency;
  neighborhood: string;
  city: string;
  rooms: number;
  coveredM2: string;
  totalM2: string | null;
  createdAt: string;
  updatedAt: string;
  images: PropertyImage[];
}

export interface PropertyListResponse {
  data: Property[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PropertyDetailResponse {
  data: Property;
}

export interface UploadedPropertyImage {
  secureUrl: string;
  publicId: string;
  format: string | null;
  width: number | null;
  height: number | null;
  bytes: number | null;
}

export interface PropertyImageInput {
  url: string;
  publicId: string;
  sortOrder: number;
  width?: number | null;
  height?: number | null;
  format?: string | null;
  bytes?: number | null;
}

export interface PropertyInput {
  operation: Operation;
  type: string;
  title: string;
  description: string;
  price: string;
  currency: Currency;
  neighborhood: string;
  city: string;
  rooms: number;
  coveredM2: string;
  totalM2: string | null;
  images: PropertyImageInput[];
}

export interface AdminUser {
  id: string;
  username: string;
  isAdmin: boolean;
  active: boolean;
  createdAt: string;
}

export interface AdminUserListResponse {
  data: AdminUser[];
}

export interface AdminUserDetailResponse {
  data: AdminUser;
}

export interface PropertyTypeOption {
  id: string;
  name: string;
}

export interface PropertyTypeListResponse {
  data: PropertyTypeOption[];
}

export interface NeighborhoodOption {
  id: string;
  name: string;
  commune: number;
}

export interface NeighborhoodListResponse {
  data: NeighborhoodOption[];
}
