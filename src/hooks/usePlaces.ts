// hooks/usePlaces.ts
import { createDataHook } from './createDataHook';
import { db } from '../database/db';
import type { Place } from '../type/PlaceType';

const dataHook = createDataHook<Place>('places', db.places);

/**
 * Hook to manage places with CRUD operations.
 * `places` is undefined until IndexedDB resolves (use for skeleton detection).
 */
export const usePlaces = () => {
  const { items, create, update, remove, getById } = dataHook();

  return {
    places: items,
    createPlace: create,
    updatePlace: update,
    deletePlace: remove,
    getPlace: getById,
  };
};
