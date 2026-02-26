// Database/placesDB.ts
import Dexie, { type Table } from "dexie";
import type { Place } from "../type/PlaceType";

const db = new Dexie("ChronovahDB") as Dexie & {
  places: Table<Place, number>;
};

db.version(2).stores({
  places: `
    ++id, 
    name,
    country,
    type,
    visitedDate,
    createdAt,
    updatedAt,
    isFavorite,
    *tags
  `,
});

export { db };
export type { Place };
