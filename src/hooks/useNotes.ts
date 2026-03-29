// hooks/useNotes.ts
import { useLiveQuery } from 'dexie-react-hooks';
import { useAuth } from './useAuth';
import { db } from '../database/db';
import { syncManager } from '../lib/sync';
import { newId, now } from '../lib/helpers';
import type { Note } from '../type/NoteType';

export const useNotes = () => {
  const { user } = useAuth();

  const notes = useLiveQuery(
    () => {
      if (!user?.id) return [];
      return db.notes.where('userId').equals(user.id).toArray();
    },
    [user?.id]
  );

  const createNote = async (noteData: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
    if (!user?.id) throw new Error('User not authenticated');

    const note: Note = {
      ...noteData,
      id: newId(),
      userId: user.id,
      createdAt: now(),
      updatedAt: now(),
    };

    await db.notes.add(note);
    syncManager.queueOperation(user.id, 'notes', 'create', note.id, note);
    return note;
  };

  const updateNote = async (id: string, updates: Partial<Omit<Note, 'id' | 'userId' | 'createdAt'>>): Promise<void> => {
    if (!user?.id) throw new Error('User not authenticated');

    const updateData = {
      ...updates,
      updatedAt: now(),
    };

    await db.notes.update(id, updateData);
    syncManager.queueOperation(user.id, 'notes', 'update', id, updateData);
  };

  const deleteNote = async (id: string): Promise<void> => {
    if (!user?.id) throw new Error('User not authenticated');

    await db.notes.delete(id);
    syncManager.queueOperation(user.id, 'notes', 'delete', id);
  };

  const getNote = async (id: string): Promise<Note | undefined> => {
    if (!user?.id) return undefined;
    return db.notes.where('id').equals(id).and(note => note.userId === user.id).first();
  };

  return {
    notes: notes || [],
    createNote,
    updateNote,
    deleteNote,
    getNote,
  };
};