// hooks/useNotes.ts
import { createDataHook } from './createDataHook';
import { db } from '../database/db';
import type { Note } from '../type/NoteType';

const dataHook = createDataHook<Note>('notes', db.notes);

/**
 * Hook to manage notes with CRUD operations
 * Maintains backward compatibility with old API while using the generic factory
 */
export const useNotes = () => {
  const { items, create, update, remove, getById } = dataHook();

  return {
    notes: items,
    createNote: create,
    updateNote: update,
    deleteNote: remove,
    getNote: getById,
  };
};