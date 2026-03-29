// hooks/useJournal.ts
import { useLiveQuery } from 'dexie-react-hooks';
import { useAuth } from './useAuth';
import { db } from '../database/db';
import { syncManager } from '../lib/sync';
import { newId, now } from '../lib/helpers';
import type { JournalEntry } from '../type/JournalType';

export const useJournal = () => {
  const { user } = useAuth();

  const entries = useLiveQuery(
    () => {
      if (!user?.id) return [];
      return db.journal.where('userId').equals(user.id).toArray();
    },
    [user?.id]
  );

  const createEntry = async (entryData: Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    if (!user?.id) throw new Error('User not authenticated');

    const entry: JournalEntry = {
      ...entryData,
      id: newId(),
      userId: user.id,
      createdAt: now(),
      updatedAt: now(),
    };

    await db.journal.add(entry);
    syncManager.queueOperation(user.id, 'journal', 'create', entry.id, entry);
  };

  const updateEntry = async (id: string, updates: Partial<Omit<JournalEntry, 'id' | 'userId' | 'createdAt'>>): Promise<void> => {
    if (!user?.id) throw new Error('User not authenticated');

    const updateData = {
      ...updates,
      updatedAt: now(),
    };

    await db.journal.update(id, updateData);
    syncManager.queueOperation(user.id, 'journal', 'update', id, updateData);
  };

  const deleteEntry = async (id: string): Promise<void> => {
    if (!user?.id) throw new Error('User not authenticated');

    await db.journal.delete(id);
    syncManager.queueOperation(user.id, 'journal', 'delete', id);
  };

  const getEntry = async (id: string): Promise<JournalEntry | undefined> => {
    if (!user?.id) return undefined;
    return db.journal.where('id').equals(id).and(entry => entry.userId === user.id).first();
  };

  return {
    entries: entries || [],
    createEntry,
    updateEntry,
    deleteEntry,
    getEntry,
  };
};