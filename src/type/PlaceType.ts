import type { BaseRecord, BaseStats } from "./BaseType";

export interface Place extends BaseRecord {
  name: string;
  country: string;
  location?: string;
  type: PlaceType;
  notes?: string;
  images: string[];
  visitedDate?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  rating?: number;
  cost?: number;
  currency?: string;
  website?: string;
  phone?: string;
  openingHours?: string;
}

export type PlaceType =
  | "City"
  | "Village"
  | "Landmark"
  | "Restaurant"
  | "Cafe"
  | "School"
  | "Park"
  | "Beach"
  | "Mountain"
  | "Museum"
  | "Hotel"
  | "Other";

export interface PlaceStats extends BaseStats {
  visitedCountries: number;
  typesCount: Record<string, number>;
}





