// hooks/useNotes.ts
import { createDataHook } from './createDataHook';
import { db } from '../database/db';
import type { Note } from '../type/NoteType';

const dataHook = createDataHook<Note>('notes', db.notes);

/**
 * Hook to manage notes with CRUD operations.
 * `notes` is undefined until IndexedDB resolves (use for skeleton detection).
 */
export const useNotes = () => {
  const { items, isLoading, create, update, remove, getById } = dataHook();

  return {
    notes: items,
    isLoading,
    createNote: create,
    updateNote: update,
    deleteNote: remove,
    getNote: getById,
  };
};
