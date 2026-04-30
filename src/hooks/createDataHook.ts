/**
 * Generic hook factory for CRUD operations on any data type
 * Eliminates duplication across useNotes, useJournal, usePeople, usePlaces hooks
 * 
 * Usage:
 *   export const useNotes = createDataHook('notes', db.notes);
 *   export const useJournal = createDataHook('journal', db.journal);
 */
import { useLiveQuery } from 'dexie-react-hooks';
import { useAuth } from './useAuth';
import { syncManager } from '../lib/sync';
import { newId, now } from '../lib/helpers';
import type { BaseRecord } from '../type/BaseType';
import type { Table, UpdateSpec } from 'dexie';

type TableName = 'notes' | 'journal' | 'people' | 'places';

/**
 * Create a generic CRUD hook for a data table
 * @param table - Name of the table
 * @param dbTable - Dexie table reference
 * @returns Hook that provides CRUD operations
 */
export function createDataHook<T extends BaseRecord>(
  table: TableName,
  dbTable: Table<T, string>,
) {
  return function useDataHook() {
    const { user } = useAuth();

    // Get all records for user (live query updates on changes)
    // Returns undefined until the first query resolves — consumers use this
    // to distinguish "not yet loaded" (show skeleton) from "empty" (show empty state)
    const items = useLiveQuery(
      () => {
        if (!user?.id) return [];
        return dbTable.where('userId').equals(user.id).toArray();
      },
      [user?.id]
    );

    /**
     * Create a new record
     */
    const create = async (data: Omit<T, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<T> => {
      if (!user?.id) throw new Error('User not authenticated');

      const record: T = {
        ...data,
        id: newId(),
        userId: user.id,
        createdAt: now(),
        updatedAt: now(),
      } as T;

      await dbTable.add(record);
      syncManager.queueOperation(user.id, table, 'create', record.id, record);
      return record;
    };

    /**
     * Update an existing record
     */
    const update = async (
      id: string,
      updates: Partial<Omit<T, 'id' | 'userId' | 'createdAt'>>
    ): Promise<void> => {
      if (!user?.id) throw new Error('User not authenticated');

      const updateData: UpdateSpec<T> = {
        ...updates,
        updatedAt: now(),
      } as UpdateSpec<T>;

      await dbTable.update(id, updateData);
      syncManager.queueOperation(user.id, table, 'update', id, updateData);
    };

    /**
     * Delete a record
     */
    const remove = async (id: string): Promise<void> => {
      if (!user?.id) throw new Error('User not authenticated');

      await dbTable.delete(id);
      syncManager.queueOperation(user.id, table, 'delete', id);
    };

    /**
     * Get a single record by id
     */
    const getById = async (id: string): Promise<T | undefined> => {
      if (!user?.id) return undefined;
      return dbTable.where('id').equals(id).and((record: T) => record.userId === user.id).first();
    };

    return {
      // Preserve undefined so consumers can distinguish "not yet loaded" from "empty"
      items,
      create,
      update,
      remove,
      getById,
    };
  };
}
