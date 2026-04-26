// hooks/usePlaces.ts
import { createDataHook } from './createDataHook';
import { db } from '../database/db';
import type { Place } from '../type/PlaceType';

const dataHook = createDataHook<Place>('places', db.places, ['notes']);

/**
 * Hook to manage places with CRUD operations
 * Maintains backward compatibility with old API while using the generic factory
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