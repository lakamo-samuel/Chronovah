// types/JournalType.ts
export interface JournalEntry {
  id?: number;
  mood: MoodType;
  note: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  weather?: WeatherType;
  location?: string;
  images?: string[];
}

export type MoodType = "Happy" | "Good" | "Neutral" | "Sad" | "Terrible";

export interface MoodOption {
  emoji: string;
  label: MoodType;
  color: string;
  bgColor: string;
}

export type WeatherType =
  | "Sunny"
  | "Cloudy"
  | "Rainy"
  | "Stormy"
  | "Snowy"
  | "Windy";

export interface JournalStats {
  totalEntries: number;
  favoriteEntries: number;
  currentStreak: number;
  longestStreak: number;
  moodCounts: Record<MoodType, number>;
}
