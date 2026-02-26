// types/NoteType.ts
export interface Note {
  id?: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  isFavorite: boolean;
  tags: string[];
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

export interface NoteStats {
  totalNotes: number;
  pinnedNotes: number;
  favoriteNotes: number;
  totalWords: number;
}
