// types/PlaceType.ts
export interface Place {
  id?: number;
  name: string;
  country: string;
  location?: string;
  type: PlaceType;
  notes?: string;
  images: string[]; // Support multiple images
  visitedDate?: string;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
  tags: string[];
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

export interface PlaceStats {
  totalPlaces: number;
  visitedCountries: number;
  favoritePlaces: number;
  typesCount: Record<string, number>;
}
