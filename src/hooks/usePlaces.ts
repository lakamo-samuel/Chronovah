// hooks/usePlaces.ts
import { useLiveQuery } from 'dexie-react-hooks';
import { useAuth } from './useAuth';
import { db } from '../database/db';
import { syncManager } from '../lib/sync';
import { newId, now } from '../lib/helpers';
import type { Place } from '../type/PlaceType';

export const usePlaces = () => {
  const { user } = useAuth();

  const places = useLiveQuery(
    () => {
      if (!user?.id) return [];
      return db.places.where('userId').equals(user.id).toArray();
    },
    [user?.id]
  );

  const createPlace = async (placeData: Omit<Place, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Place> => {
    if (!user?.id) throw new Error('User not authenticated');

    const place: Place = {
      ...placeData,
      id: newId(),
      userId: user.id,
      createdAt: now(),
      updatedAt: now(),
    };

    await db.places.add(place);
    syncManager.queueOperation(user.id, 'places', 'create', place.id, place);
    return place;
  };

  const updatePlace = async (id: string, updates: Partial<Omit<Place, 'id' | 'userId' | 'createdAt'>>): Promise<void> => {
    if (!user?.id) throw new Error('User not authenticated');

    const updateData = {
      ...updates,
      updatedAt: now(),
    };

    await db.places.update(id, updateData);
    syncManager.queueOperation(user.id, 'places', 'update', id, updateData);
  };

  const deletePlace = async (id: string): Promise<void> => {
    if (!user?.id) throw new Error('User not authenticated');

    await db.places.delete(id);
    syncManager.queueOperation(user.id, 'places', 'delete', id);
  };

  const getPlace = async (id: string): Promise<Place | undefined> => {
    if (!user?.id) return undefined;
    return db.places.where('id').equals(id).and(place => place.userId === user.id).first();
  };

  return {
    places: places || [],
    createPlace,
    updatePlace,
    deletePlace,
    getPlace,
  };
};