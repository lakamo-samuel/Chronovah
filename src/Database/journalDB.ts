// Database/journalDB.ts
import Dexie, { type Table } from "dexie";
import type { JournalEntry } from "../type/JournalType";

const db = new Dexie("ChronovahDB") as Dexie & {
  journal: Table<JournalEntry, number>;
};

db.version(2).stores({
  journal: `
    ++id, 
    mood,
    createdAt, 
    updatedAt, 
    isFavorite,
    *tags
  `,
});

export { db };
