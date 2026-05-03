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

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  username?: string;
  bio?: string;
  favoriteQuote?: string;
  updatedAt: string;
}

class ChronovahDB extends Dexie {
  notes!: Table<Note, string>;
  journal!: Table<JournalEntry, string>;
  people!: Table<Person, string>;
  places!: Table<Place, string>;
  syncQueue!: Table<SyncOperation, string>;
  userProfile!: Table<UserProfile, string>;

  constructor() {
    super("ChronovahDB");

    // v1 — original schema
    this.version(1).stores({
      notes:    "id, userId, title, isPinned, isFavorite, color, createdAt, updatedAt, *tags",
      journal:  "id, userId, mood, isFavorite, createdAt, updatedAt, *tags",
      people:   "id, userId, name, relation, birthday, email, company, isFavorite, createdAt, updatedAt, *tags",
      places:   "id, userId, name, country, type, visitedDate, isFavorite, createdAt, updatedAt, *tags",
      syncQueue:"id, userId, table, operation, recordId, createdAt, retryCount",
    });

    // v2 — added userProfile table
    this.version(2).stores({
      notes:    "id, userId, title, isPinned, isFavorite, color, createdAt, updatedAt, *tags",
      journal:  "id, userId, mood, isFavorite, createdAt, updatedAt, *tags",
      people:   "id, userId, name, relation, birthday, email, company, isFavorite, createdAt, updatedAt, *tags",
      places:   "id, userId, name, country, type, visitedDate, isFavorite, createdAt, updatedAt, *tags",
      syncQueue:"id, userId, table, operation, recordId, createdAt, retryCount",
      userProfile: "id, email, updatedAt",
    });

    // v3 — same schema, forces upgrade on clients with broken v2/v3 state
    // Drops and recreates all stores to fix any primary key corruption
    this.version(4).stores({
      notes:    "id, userId, title, isPinned, isFavorite, color, createdAt, updatedAt, *tags",
      journal:  "id, userId, mood, isFavorite, createdAt, updatedAt, *tags",
      people:   "id, userId, name, relation, birthday, email, company, isFavorite, createdAt, updatedAt, *tags",
      places:   "id, userId, name, country, type, visitedDate, isFavorite, createdAt, updatedAt, *tags",
      syncQueue:"id, userId, table, operation, recordId, createdAt, retryCount",
      userProfile: "id, email, updatedAt",
    }).upgrade(async (tx) => {
      // Clear all data on upgrade — it will be re-synced from the server
      await tx.table("notes").clear();
      await tx.table("journal").clear();
      await tx.table("people").clear();
      await tx.table("places").clear();
      await tx.table("syncQueue").clear();
      // userProfile may not exist yet on some clients — ignore errors
      try { await tx.table("userProfile").clear(); } catch (_) {}
    });
  }
}

export const db = new ChronovahDB();
export default db;
