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
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const mood = moods[entry.mood] || moods.Neutral;

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
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-card rounded-xl border border-default overflow-hidden hover:shadow-hard transition-all cursor-pointer touch-manipulation h-full flex flex-col"
    >
      <div className="p-4 sm:p-5 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-2xl sm:text-3xl ${mood.color}`}>
              {mood.emoji}
            </span>
            <span className="text-xs sm:text-sm text-muted bg-default px-2 py-1 rounded-full">
              {formatDate(entry.createdAt)}
            </span>
          </div>

          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-lg transition-colors touch-manipulation ${
              entry.isFavorite
                ? "text-red-500"
                : "text-muted opacity-70 hover:opacity-100"
            }`}
          >
            <Heart
              size={18}
              fill={entry.isFavorite ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Content preview */}
        <p className="text-sm sm:text-base text-muted mb-4 line-clamp-3">
          {preview || <span className="italic opacity-50">No content...</span>}
        </p>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted mb-3">
          {entry.weather && (
            <span className="flex items-center gap-1 bg-default px-2 py-1 rounded-full">
              <Cloud size={12} />
              <span className="max-w-[80px] truncate">{entry.weather}</span>
            </span>
          )}
          {entry.location && (
            <span className="flex items-center gap-1 bg-default px-2 py-1 rounded-full">
              <MapPin size={12} />
              <span className="max-w-[100px] truncate">{entry.location}</span>
            </span>
          )}
          {entry.images && entry.images.length > 0 && (
            <span className="flex items-center gap-1 bg-default px-2 py-1 rounded-full">
              <ImageIcon size={12} />
              {entry.images.length}
            </span>
          )}
        </div>

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {entry.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs sm:text-sm bg-default text-muted px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
            {entry.tags.length > 3 && (
              <span className="text-xs sm:text-sm bg-default text-muted px-2 py-1 rounded-full">
                +{entry.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 p-3 sm:p-4 border-t border-default bg-default/50">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-2 hover:bg-card rounded-lg transition-colors flex items-center gap-1.5 text-xs sm:text-sm text-muted hover:text-primary-500 touch-manipulation"
        >
          <Edit2 size={16} />
          <span>Edit</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 hover:bg-card rounded-lg transition-colors flex items-center gap-1.5 text-xs sm:text-sm text-muted hover:text-red-500 touch-manipulation"
        >
          <Trash2 size={16} />
          <span>Delete</span>
        </button>
      </div>
    </motion.div>
  );
}
