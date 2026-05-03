// hooks/usePeople.ts
import { createDataHook } from './createDataHook';
import { db } from '../database/db';
import type { Person } from '../type/PeopleType';

const dataHook = createDataHook<Person>('people', db.people);

/**
 * Hook to manage people with CRUD operations.
 * `people` is undefined until IndexedDB resolves (use for skeleton detection).
 */
export const usePeople = () => {
  const { items, isLoading, create, update, remove, getById } = dataHook();

  return {
    people: items,
    isLoading,
    createPerson: create,
    updatePerson: update,
    deletePerson: remove,
    getPerson: getById,
  };
};
