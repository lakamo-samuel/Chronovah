// hooks/useJournal.ts
import { createDataHook } from './createDataHook';
import { db } from '../database/db';
import type { JournalEntry } from '../type/JournalType';

const dataHook = createDataHook<JournalEntry>('journal', db.journal);

/**
 * Hook to manage journal entries with CRUD operations.
 * `entries` is undefined until IndexedDB resolves (use for skeleton detection).
 */
export const useJournal = () => {
  const { items, create, update, remove, getById } = dataHook();

  return {
    entries: items,
    createEntry: create,
    updateEntry: update,
    deleteEntry: remove,
    getEntry: getById,
  };
};
