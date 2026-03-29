// hooks/usePeople.ts
import { useLiveQuery } from 'dexie-react-hooks';
import { useAuth } from './useAuth';
import { db } from '../database/db';
import { syncManager } from '../lib/sync';
import { newId, now } from '../lib/helpers';
import type { Person } from '../type/PeopleType';

export const usePeople = () => {
  const { user } = useAuth();

  const people = useLiveQuery(
    () => {
      if (!user?.id) return [];
      return db.people.where('userId').equals(user.id).toArray();
    },
    [user?.id]
  );

  const createPerson = async (personData: Omit<Person, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Person> => {
    if (!user?.id) throw new Error('User not authenticated');

    const person: Person = {
      ...personData,
      id: newId(),
      userId: user.id,
      createdAt: now(),
      updatedAt: now(),
    };

    await db.people.add(person);
    syncManager.queueOperation(user.id, 'people', 'create', person.id, person);
    return person;
  };

  const updatePerson = async (id: string, updates: Partial<Omit<Person, 'id' | 'userId' | 'createdAt'>>): Promise<void> => {
    if (!user?.id) throw new Error('User not authenticated');

    const updateData = {
      ...updates,
      updatedAt: now(),
    };

    await db.people.update(id, updateData);
    syncManager.queueOperation(user.id, 'people', 'update', id, updateData);
  };

  const deletePerson = async (id: string): Promise<void> => {
    if (!user?.id) throw new Error('User not authenticated');

    await db.people.delete(id);
    syncManager.queueOperation(user.id, 'people', 'delete', id);
  };

  const getPerson = async (id: string): Promise<Person | undefined> => {
    if (!user?.id) return undefined;
    return db.people.where('id').equals(id).and(person => person.userId === user.id).first();
  };

  return {
    people: people || [],
    createPerson,
    updatePerson,
    deletePerson,
    getPerson,
  };
};