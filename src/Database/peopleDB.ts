// Database/peopleDB.ts
import Dexie, { type Table } from "dexie";
import type { Person } from "../type/PeopleType";

const db = new Dexie("ChronovahDB") as Dexie & {
  people: Table<Person, number>;
};

db.version(2).stores({
  people: `
    ++id, 
    name,
    relation,
    birthday,
    email,
    company,
    createdAt,
    updatedAt,
    isFavorite,
    *tags
  `,
});

export { db };
export type { Person };
