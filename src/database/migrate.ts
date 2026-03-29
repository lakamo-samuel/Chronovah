// database/migrate.ts
import Dexie from "dexie";
import { db } from "./db";
import { newId } from "../lib/helpers";
import type { Note } from "../type/NoteType";
import type { JournalEntry } from "../type/JournalType";
import type { Person } from "../type/PeopleType";
import type { Place } from "../type/PlaceType";

interface LegacyNote extends Omit<Note, 'id' | 'userId'> {
  id: number;
}

interface LegacyJournalEntry extends Omit<JournalEntry, 'id' | 'userId'> {
  id: number;
}

interface LegacyPerson extends Omit<Person, 'id' | 'userId'> {
  id: number;
}

interface LegacyPlace extends Omit<Place, 'id' | 'userId'> {
  id: number;
}

export const migrateLegacyDatabases = async (userId: string): Promise<void> => {
  try {
    // Check if old databases exist
    const oldNoteDB = new Dexie("NoteDB");
    oldNoteDB.version(2).stores({
      notes: "++id, title, createdAt, updatedAt, isPinned, isFavorite, color, *tags"
    });

    const oldJournalDB = new Dexie("ChronovahDB");
    oldJournalDB.version(2).stores({
      journal: "++id, mood, createdAt, updatedAt, isFavorite, *tags"
    });

    const oldPeopleDB = new Dexie("ChronovahDB");
    oldPeopleDB.version(2).stores({
      people: "++id, name, relation, birthday, email, company, createdAt, updatedAt, isFavorite, *tags"
    });

    const oldPlacesDB = new Dexie("ChronovahDB");
    oldPlacesDB.version(2).stores({
      places: "++id, name, country, type, visitedDate, createdAt, updatedAt, isFavorite, *tags"
    });

    // Migrate notes
    try {
      const legacyNotes = await oldNoteDB.table('notes').toArray() as LegacyNote[];
      if (legacyNotes.length > 0) {
        const migratedNotes: Note[] = legacyNotes.map(note => ({
          ...note,
          id: newId(),
          userId,
        }));
        await db.notes.bulkAdd(migratedNotes);
        console.log(`Migrated ${legacyNotes.length} notes`);
      }
    } catch (error) {
      console.log("No legacy notes to migrate or migration failed:", error);
    }

    // Migrate journal entries
    try {
      const legacyEntries = await oldJournalDB.table('journal').toArray() as LegacyJournalEntry[];
      if (legacyEntries.length > 0) {
        const migratedEntries: JournalEntry[] = legacyEntries.map(entry => ({
          ...entry,
          id: newId(),
          userId,
        }));
        await db.journal.bulkAdd(migratedEntries);
        console.log(`Migrated ${legacyEntries.length} journal entries`);
      }
    } catch (error) {
      console.log("No legacy journal entries to migrate or migration failed:", error);
    }

    // Migrate people
    try {
      const legacyPeople = await oldPeopleDB.table('people').toArray() as LegacyPerson[];
      if (legacyPeople.length > 0) {
        const migratedPeople: Person[] = legacyPeople.map(person => ({
          ...person,
          id: newId(),
          userId,
        }));
        await db.people.bulkAdd(migratedPeople);
        console.log(`Migrated ${legacyPeople.length} people`);
      }
    } catch (error) {
      console.log("No legacy people to migrate or migration failed:", error);
    }

    // Migrate places
    try {
      const legacyPlaces = await oldPlacesDB.table('places').toArray() as LegacyPlace[];
      if (legacyPlaces.length > 0) {
        const migratedPlaces: Place[] = legacyPlaces.map(place => ({
          ...place,
          id: newId(),
          userId,
        }));
        await db.places.bulkAdd(migratedPlaces);
        console.log(`Migrated ${legacyPlaces.length} places`);
      }
    } catch (error) {
      console.log("No legacy places to migrate or migration failed:", error);
    }

    // Delete old databases
    try {
      await oldNoteDB.delete();
      console.log("Deleted old NoteDB");
    } catch (error) {
      console.log("Failed to delete NoteDB:", error);
    }

    try {
      await oldJournalDB.delete();
      console.log("Deleted old ChronovahDB (journal)");
    } catch (error) {
      console.log("Failed to delete ChronovahDB (journal):", error);
    }

    try {
      await oldPeopleDB.delete();
      console.log("Deleted old ChronovahDB (people)");
    } catch (error) {
      console.log("Failed to delete ChronovahDB (people):", error);
    }

    try {
      await oldPlacesDB.delete();
      console.log("Deleted old ChronovahDB (places)");
    } catch (error) {
      console.log("Failed to delete ChronovahDB (places):", error);
    }

  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
};