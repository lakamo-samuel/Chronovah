import Dexie, { type Table } from "dexie";

export interface Place {
  id?: number;
  name: string;
  location: string;
  description: string;
  category?: string;
  image?: string; // base64 image URL
  createdAt: string;
}

const db = new Dexie("PlacesDatabase") as Dexie & {
  places: Table<Place, number>;
};

db.version(1).stores({
  places: "++id, name, location, category, createdAt",
});

export { db };
