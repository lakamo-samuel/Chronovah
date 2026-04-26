// types/JournalType.ts
import type { BaseRecord, BaseStats, SelectOption } from "./BaseType";

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

export interface JournalStats extends BaseStats {
  currentStreak: number;
  longestStreak: number;
  moodCounts: Record<MoodType, number>;
}
