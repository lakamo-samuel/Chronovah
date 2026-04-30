// Shared base types for all data models
// Eliminates duplication of common fields across Note, JournalEntry, Person, Place types

/**
 * Base record interface that all app records extend from
 * Contains all the common fields like id, userId, timestamps, isFavorite, tags
 */
export interface BaseRecord {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  tags: string[];
}

/**
 * Stats interface pattern used for count statistics
 */
export interface BaseStats {
  total: number;
  favorites: number;
}

/**
 * Common options for entity types (mood, weather, etc.)
 */
export interface SelectOption {
  emoji?: string;
  label: string;
  color?: string;
  bgColor?: string;
}
