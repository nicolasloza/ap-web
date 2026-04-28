export type Operation = "sale" | "rent";
export type Currency = "ARS" | "USD";

export interface PropertyImage {
  id: string;
  url: string;
  sortOrder: number;
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
