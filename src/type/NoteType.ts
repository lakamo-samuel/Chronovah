// types/NoteType.ts
import type { BaseRecord, BaseStats } from "./BaseType";

export interface Note extends BaseRecord {
  title: string;
  content: string;
  isPinned?: boolean;
  color?: NoteColor;
  attachments?: Attachment[];
  wordCount?: number;
  readTime?: number;
}

export type NoteColor =
  | "default"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink";

export interface Attachment {
  id: string;
  type: "image" | "file" | "link";
  url: string;
  name: string;
  size?: number;
}

export interface NoteStats extends BaseStats {
  totalNotes: number;
  favoriteNotes: number;
  pinnedNotes: number;
  totalWords: number;
}
