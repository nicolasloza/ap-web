export type Operation = "sale" | "rent";
export type Currency = "ARS" | "USD";
export type PropertyStatus = "available" | "reserved" | "sold" | "rented";

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
  address: string;
  description: string;
  price: string;
  currency: Currency;
  neighborhood: string;
  city: string;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  coveredM2: string;
  totalM2: string | null;
  published: boolean;
  active: boolean;
  status: PropertyStatus;
  isReserved: boolean;
  isSold: boolean;
  isRented: boolean;
  amenities: string[];
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
  address: string;
  description: string;
  price: string;
  currency: Currency;
  neighborhood: string;
  city: string;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  coveredM2: string;
  totalM2: string | null;
  published: boolean;
  active: boolean;
  status: PropertyStatus;
  amenities: string[];
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

export interface AmenityOption {
  id: string;
  name: string;
}

export interface AmenityListResponse {
  data: AmenityOption[];
}
