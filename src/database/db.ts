// database/db.ts
import Dexie, { type Table } from "dexie";
import type { Note } from "../type/NoteType";
import type { JournalEntry } from "../type/JournalType";
import type { Person } from "../type/PeopleType";
import type { Place } from "../type/PlaceType";

export interface SyncOperation {
  id?: string;
  userId: string;
  table: 'notes' | 'journal' | 'people' | 'places';
  operation: 'create' | 'update' | 'delete';
  recordId: string;
  data?: any;
  createdAt: string;
  retryCount: number;
}

class ChronovahDB extends Dexie {
  notes!: Table<Note, string>;
  journal!: Table<JournalEntry, string>;
  people!: Table<Person, string>;
  places!: Table<Place, string>;
  syncQueue!: Table<SyncOperation, string>;

  constructor() {
    super("ChronovahDB");

    this.version(1).stores({
      notes:
        "id, userId, title, isPinned, isFavorite, color, createdAt, updatedAt, *tags",
      journal: "id, userId, mood, isFavorite, createdAt, updatedAt, *tags",
      people:
        "id, userId, name, relation, birthday, email, company, isFavorite, createdAt, updatedAt, *tags",
      places:
        "id, userId, name, country, type, visitedDate, isFavorite, createdAt, updatedAt, *tags",
      syncQueue: "id, userId, table, operation, recordId, createdAt, retryCount"
    });
  }
}

export const db = new ChronovahDB();
export default db;