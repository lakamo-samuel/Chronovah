// lib/sync.ts
import { protectedAxios } from '../../axios';
import { db, type SyncOperation } from '../database/db';
import type { Note } from '../type/NoteType';
import type { JournalEntry } from '../type/JournalType';
import type { Person } from '../type/PeopleType';
import type { Place } from '../type/PlaceType';
import { newId } from './helpers';

export type SyncStatus = 'syncing' | 'synced' | 'offline';

class SyncManager {
  private isOnline = navigator.onLine;
  private syncInProgress = false;

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Queue an operation for sync
  async queueOperation(
    userId: string,
    table: SyncOperation['table'],
    operation: SyncOperation['operation'],
    recordId: string,
    data?: any
  ): Promise<void> {
    const syncOp: SyncOperation = {
      id: newId(),
      userId,
      table,
      operation,
      recordId,
      data,
      createdAt: new Date().toISOString(),
      retryCount: 0,
    };

    await db.syncQueue.add(syncOp);

    // Try to sync immediately if online
    if (this.isOnline && !this.syncInProgress) {
      this.processSyncQueue();
    }
  }

  // Process the sync queue
  private async processSyncQueue(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) return;

    this.syncInProgress = true;

    try {
      const pendingOps = await db.syncQueue.orderBy('createdAt').toArray();

      for (const op of pendingOps) {
        try {
          await this.syncOperation(op);
          await db.syncQueue.delete(op.id!);
        } catch (error) {
          console.warn('Sync operation failed, will retry:', op, error);
          // Increment retry count
          await db.syncQueue.update(op.id!, { retryCount: op.retryCount + 1 });
          // If too many retries, remove it
          if (op.retryCount >= 5) {
            await db.syncQueue.delete(op.id!);
          }
        }
      }
    } catch (error) {
      console.error('Sync queue processing failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Sync a single operation
  private async syncOperation(op: SyncOperation): Promise<void> {
    const endpoint = `/${op.table}`;

    try {
      switch (op.operation) {
        case 'create':
          await protectedAxios.post(endpoint, op.data);
          break;
        case 'update':
          await protectedAxios.put(`${endpoint}/${op.recordId}`, op.data);
          break;
        case 'delete':
          await protectedAxios.delete(`${endpoint}/${op.recordId}`);
          break;
      }
    } catch (error) {
      // Backend not ready, silently fail
      console.log(`Backend sync for ${op.table} ${op.operation} failed (expected if backend not ready):`, error);
      throw error; // Re-throw to mark as failed
    }
  }

  // Pull all user data from server on login
  async pullUserData(userId: string): Promise<void> {
    if (!this.isOnline) return;

    try {
      // Pull notes
      try {
        const notesResponse = await protectedAxios.get('/notes');
        const serverNotes: Note[] = notesResponse.data;
        await db.notes.where('userId').equals(userId).delete(); // Clear local
        await db.notes.bulkAdd(serverNotes);
      } catch (error) {
        console.log('Failed to pull notes (backend not ready):', error);
      }

      // Pull journal
      try {
        const journalResponse = await protectedAxios.get('/journal');
        const serverEntries: JournalEntry[] = journalResponse.data;
        await db.journal.where('userId').equals(userId).delete();
        await db.journal.bulkAdd(serverEntries);
      } catch (error) {
        console.log('Failed to pull journal (backend not ready):', error);
      }

      // Pull people
      try {
        const peopleResponse = await protectedAxios.get('/people');
        const serverPeople: Person[] = peopleResponse.data;
        await db.people.where('userId').equals(userId).delete();
        await db.people.bulkAdd(serverPeople);
      } catch (error) {
        console.log('Failed to pull people (backend not ready):', error);
      }

      // Pull places
      try {
        const placesResponse = await protectedAxios.get('/places');
        const serverPlaces: Place[] = placesResponse.data;
        await db.places.where('userId').equals(userId).delete();
        await db.places.bulkAdd(serverPlaces);
      } catch (error) {
        console.log('Failed to pull places (backend not ready):', error);
      }
    } catch (error) {
      console.error('Failed to pull user data:', error);
    }
  }

  // Clear all user data on logout
  async clearUserData(userId: string): Promise<void> {
    await db.notes.where('userId').equals(userId).delete();
    await db.journal.where('userId').equals(userId).delete();
    await db.people.where('userId').equals(userId).delete();
    await db.places.where('userId').equals(userId).delete();
    await db.syncQueue.where('userId').equals(userId).delete();
  }

  getStatus(): SyncStatus {
    if (!this.isOnline) return 'offline';
    if (this.syncInProgress) return 'syncing';
    return 'synced';
  }
}

export const syncManager = new SyncManager();