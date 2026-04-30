// types/JournalType.ts
import type { BaseRecord, SelectOption } from "./BaseType";

export interface JournalEntry extends BaseRecord {
  mood: MoodType;
  note: string;
  weather?: WeatherType;
  location?: string;
  images?: string[];
}

export type MoodType = "Happy" | "Good" | "Neutral" | "Sad" | "Terrible";

export type WeatherType =
  | "Sunny"
  | "Cloudy"
  | "Rainy"
  | "Stormy"
  | "Snowy"
  | "Windy";

export interface MoodOption extends SelectOption {
  label: MoodType;
}

export interface JournalStats {
  totalEntries: number;
  favoriteEntries: number;
  currentStreak: number;
  longestStreak: number;
  moodCounts: Record<MoodType, number>;
}
