// Database/db.ts
import Dexie, { type Table } from "dexie";
import type { Note } from "../type/NoteType";

const db = new Dexie("NoteDB") as Dexie & {
  notes: Table<Note, number>;
};

db.version(2).stores({
  notes: `
    ++id, 
    title, 
    createdAt, 
    updatedAt, 
    isPinned,
    isFavorite,
    color,
    *tags
  `,
});

export { db };
