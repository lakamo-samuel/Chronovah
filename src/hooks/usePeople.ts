// hooks/usePeople.ts
import { createDataHook } from './createDataHook';
import { db } from '../database/db';
import type { Person } from '../type/PeopleType';

const dataHook = createDataHook<Person>('people', db.people, [
  'description',
  'notes',
  'email',
  'phone',
  'address',
]);

/**
 * Hook to manage people with CRUD operations
 * Maintains backward compatibility with old API while using the generic factory
 */
export const usePeople = () => {
  const { items, create, update, remove, getById } = dataHook();

  return {
    people: items,
    createPerson: create,
    updatePerson: update,
    deletePerson: remove,
    getPerson: getById,
  };
};