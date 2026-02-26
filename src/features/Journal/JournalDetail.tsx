// pages/Journal/JournalDetail.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Heart,
  Tag,
  Edit2,
  Trash2,
  Cloud,
  MapPin,
  Image as ImageIcon,
  Clock,
  Share2,
  Copy,
  BookOpen,
} from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../Database/journalDB";
import type { JournalEntry } from "../../type/JournalType";
import JournalEditor from "./JournalEditor";

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

export default function JournalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const entryId = Number(id);

  const [showEditor, setShowEditor] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const entry = useLiveQuery(() => db.journal.get(entryId), [entryId]);

  const toggleFavorite = async () => {
    if (entry?.id) {
      await db.journal.update(entry.id, {
        isFavorite: !entry.isFavorite,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleDelete = async () => {
    if (entry?.id) {
      await db.journal.delete(entry.id);
      navigate("/journal");
    }
  };

  const handleSaveEntry = async (entryData: Partial<JournalEntry>) => {
    if (entry?.id) {
      await db.journal.update(entry.id, {
        ...entryData,
        updatedAt: new Date().toISOString(),
      });
    }
    setShowEditor(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!entry) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className=" text-center py-20">
          <BookOpen size={48} className="mx-auto text-muted mb-4" />
          <h2 className="text-xl font-semibold text-primary mb-2">
            Entry not found
          </h2>
          <button
            onClick={() => navigate("/journal")}
            className="text-primary-500 hover:text-primary-600"
          >
            Back to journal
          </button>
        </div>
      </div>
    );
  }

  const mood = moods[entry.mood] || moods.Neutral;

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className=" px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/journal")}
            className="p-2 hover:bg-card rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-muted" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-lg transition-colors ${
                entry.isFavorite
                  ? "text-red-500 bg-red-500/10"
                  : "text-muted hover:text-red-500"
              }`}
            >
              <Heart
                size={18}
                fill={entry.isFavorite ? "currentColor" : "none"}
              />
            </button>
            <button
              onClick={() => setShowEditor(true)}
              className="p-2 text-muted hover:text-primary-500 rounded-lg transition-colors"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2 text-muted hover:text-primary-500 rounded-lg transition-colors relative"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-muted hover:text-red-500 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Mood Banner */}
        <div
          className={`${mood.bgColor} rounded-xl p-6 mb-6 border border-default`}
        >
          <div className="flex items-center gap-4">
            <span className="text-6xl">{mood.emoji}</span>
            <div>
              <h1 className={`text-2xl font-bold ${mood.color} mb-1`}>
                Feeling {entry.mood}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(entry.createdAt)}
                </span>
                {entry.updatedAt !== entry.createdAt && (
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    Edited
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Journal Entry */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-card border border-default rounded-xl p-6">
              <h2 className="text-lg font-semibold text-primary mb-4">Entry</h2>
              <p className="text-muted leading-relaxed whitespace-pre-wrap">
                {entry.note}
              </p>
            </div>

            {/* Images */}
            {entry.images && entry.images.length > 0 && (
              <div className="bg-card border border-default rounded-xl p-6">
                <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                  <ImageIcon size={18} />
                  Photos ({entry.images.length})
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {entry.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Journal ${index + 1}`}
                      className="aspect-square object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Metadata */}
          <div className="space-y-6">
            {/* Weather & Location */}
            {(entry.weather || entry.location) && (
              <div className="bg-card border border-default rounded-xl p-6">
                <h2 className="text-lg font-semibold text-primary mb-4">
                  Details
                </h2>
                <div className="space-y-3">
                  {entry.weather && (
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <Cloud size={16} />
                      <span>{entry.weather}</span>
                    </div>
                  )}
                  {entry.location && (
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <MapPin size={16} />
                      <span>{entry.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {entry.tags && entry.tags.length > 0 && (
              <div className="bg-card border border-default rounded-xl p-6">
                <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                  <Tag size={16} />
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-default text-muted rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Menu */}
      <AnimatePresence>
        {showShareMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-16 right-4 bg-card border border-default rounded-xl shadow-hard overflow-hidden z-50"
          >
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setShowShareMenu(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-default transition-colors"
            >
              <Copy size={14} />
              <span>Copy link</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditor && (
          <JournalEditor
            entry={entry}
            onSave={handleSaveEntry}
            onClose={() => setShowEditor(false)}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-xl border border-default p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold text-primary mb-2">
                Delete Entry
              </h3>
              <p className="text-muted mb-6">
                Are you sure you want to delete this journal entry? This action
                cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-muted hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
