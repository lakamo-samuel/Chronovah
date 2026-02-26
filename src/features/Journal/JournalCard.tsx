// pages/Journal/JournalCard.tsx
import { motion } from "framer-motion";
import {
  
  Heart,
  
  Edit2,
  Trash2,
  Cloud,
  MapPin,
  Image as ImageIcon,
} from "lucide-react";
import { db } from "../../Database/journalDB";
import type { JournalEntry } from "../../type/JournalType";

const moods: Record<string, { emoji: string; color: string; bgColor: string }> =
  {
    Happy: { emoji: "😄", color: "text-green-500", bgColor: "bg-green-500/10" },
    Good: { emoji: "😊", color: "text-blue-500", bgColor: "bg-blue-500/10" },
    Neutral: {
      emoji: "😐",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    Sad: { emoji: "😞", color: "text-orange-500", bgColor: "bg-orange-500/10" },
    Terrible: { emoji: "😭", color: "text-red-500", bgColor: "bg-red-500/10" },
  };

interface JournalCardProps {
  entry: JournalEntry;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}

export default function JournalCard({
  entry,
  onEdit,
  onDelete,
  onClick,
}: JournalCardProps) {
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await db.journal.update(entry.id!, {
      isFavorite: !entry.isFavorite,
      updatedAt: new Date().toISOString(),
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const mood = moods[entry.mood] || moods.Neutral;

  // Strip markdown for preview
  const getPlainTextPreview = (content: string, maxLength: number = 100) => {
    const plainText = content
      .replace(/[#*`_~[\]()]/g, "")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return plainText.length > maxLength
      ? plainText.substring(0, maxLength) + "..."
      : plainText;
  };

  const preview = getPlainTextPreview(entry.note);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="bg-card rounded-xl border border-default overflow-hidden hover:shadow-hard transition-all cursor-pointer group flex flex-col h-full"
    >
      {/* Content */}
      <div className="p-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-2xl ${mood.color}`}>{mood.emoji}</span>
            <span className="text-xs text-muted bg-default px-2 py-1 rounded-full">
              {formatDate(entry.createdAt)}
            </span>
          </div>

          <button
            onClick={toggleFavorite}
            className={`p-1.5 rounded-lg transition-colors ${
              entry.isFavorite
                ? "text-red-500"
                : "text-muted opacity-0 group-hover:opacity-100"
            }`}
          >
            <Heart
              size={16}
              fill={entry.isFavorite ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Content preview */}
        <p className="text-sm text-muted mb-4 line-clamp-3">
          {preview || <span className="italic opacity-50">No content...</span>}
        </p>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted mb-3">
          {entry.weather && (
            <span className="flex items-center gap-1 bg-default px-2 py-1 rounded-full">
              <Cloud size={10} />
              {entry.weather}
            </span>
          )}
          {entry.location && (
            <span className="flex items-center gap-1 bg-default px-2 py-1 rounded-full">
              <MapPin size={10} />
              <span className="max-w-[100px] truncate">{entry.location}</span>
            </span>
          )}
          {entry.images && entry.images.length > 0 && (
            <span className="flex items-center gap-1 bg-default px-2 py-1 rounded-full">
              <ImageIcon size={10} />
              {entry.images.length}
            </span>
          )}
        </div>

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {entry.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-default text-muted px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons - Always at bottom */}
      <div className="flex items-center justify-end gap-1 p-3 border-t border-default bg-default/50">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-2 hover:bg-card rounded-lg transition-colors flex items-center gap-1 text-xs text-muted hover:text-primary-500"
          title="Edit"
        >
          <Edit2 size={14} />
          <span className="sm:inline">Edit</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 hover:bg-card rounded-lg transition-colors flex items-center gap-1 text-xs text-muted hover:text-red-500"
          title="Delete"
        >
          <Trash2 size={14} />
          <span className="sm:inline">Delete</span>
        </button>
      </div>
    </motion.div>
  );
}
