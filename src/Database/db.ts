import Dexie, {  type Table } from "dexie";
import type { Note } from "../type/NoteType";

const db = new Dexie("NoteDB") as Dexie & {
  notes: Table <Note, number>;
};

db.version(1).stores({
  notes: "++id, title, createdAt, updatedAt, pinned",
});

export { db };
