// pages/Journal/index.tsx
import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Grid3X3, List, X, BookOpen, Filter } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { db } from "../../Database/journalDB";
import JournalStats from "./JournalStats";
import CommonPageHeader from "../../components/CommonPageHeader";
import type { JournalEntry, MoodType } from "../../type/JournalType";
import JournalEditor from "./JournalEditor";
import JournalCard from "./JournalCard";

export default function JournalList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedMood, setSelectedMood] = useState<MoodType | "all">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingEntry, setEditingEntry] =
    useState<Partial<JournalEntry> | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const entries = useLiveQuery(
    () => db.journal.orderBy("createdAt").reverse().toArray(),
    [],
  );

  // Extract unique tags
  useEffect(() => {
    if (entries) {
      const tags = new Set<string>();
      entries.forEach((entry) => entry.tags?.forEach((tag) => tags.add(tag)));
      setAvailableTags(Array.from(tags));
    }
  }, [entries]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!entries)
      return {
        totalEntries: 0,
        favoriteEntries: 0,
        currentStreak: 0,
        longestStreak: 0,
        moodCounts: {} as Record<MoodType, number>,
      };

    let currentStreak = 0;
    let longestStreak = 0;
    let streak = 0;
    let lastDate: Date | null = null;

    // Sort entries by date for streak calculation
    const sortedEntries = [...entries].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    sortedEntries.forEach((entry) => {
      const entryDate = new Date(entry.createdAt);
      entryDate.setHours(0, 0, 0, 0);

      if (lastDate) {
        const dayDiff =
          (entryDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
        if (dayDiff === 1) {
          streak++;
        } else if (dayDiff > 1) {
          streak = 1;
        }
      } else {
        streak = 1;
      }

      longestStreak = Math.max(longestStreak, streak);
      lastDate = entryDate;
    });

    // Check if today has an entry for current streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const hasToday = entries.some((e) => {
      const entryDate = new Date(e.createdAt);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });
    currentStreak = hasToday ? streak : 0;

    const moodCounts = entries.reduce(
      (acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        return acc;
      },
      {} as Record<MoodType, number>,
    );

    return {
      totalEntries: entries.length,
      favoriteEntries: entries.filter((e) => e.isFavorite).length,
      currentStreak,
      longestStreak,
      moodCounts,
    };
  }, [entries]);

  // Filter entries
  const filteredEntries = useMemo(() => {
    if (!entries) return [];

    let filtered = [...entries];

    // Search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.note.toLowerCase().includes(searchLower) ||
          e.tags?.some((tag) => tag.toLowerCase().includes(searchLower)),
      );
    }

    // Mood filter
    if (selectedMood !== "all") {
      filtered = filtered.filter((e) => e.mood === selectedMood);
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((e) =>
        selectedTags.every((tag) => e.tags?.includes(tag)),
      );
    }

    return filtered;
  }, [entries, debouncedSearch, selectedMood, selectedTags]);

  const handleAddEntry = () => {
    setEditingEntry(null);
    setShowEditor(true);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setShowEditor(true);
  };

  const handleSaveEntry = async (entryData: Partial<JournalEntry>) => {
    const now = new Date().toISOString();

    if (editingEntry?.id) {
      // Update existing
      await db.journal.update(editingEntry.id, {
        ...entryData,
        updatedAt: now,
      });
    } else {
      // Add new
      const newEntry: Omit<JournalEntry, "id"> = {
        mood: entryData.mood!,
        note: entryData.note!,
        tags: entryData.tags || [],
        createdAt: now,
        updatedAt: now,
        isFavorite: entryData.isFavorite || false,
        weather: entryData.weather,
        location: entryData.location,
        images: entryData.images,
      };
      await db.journal.add(newEntry as JournalEntry);
    }

    setShowEditor(false);
    setEditingEntry(null);
  };

  const handleDeleteEntry = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      await db.journal.delete(id);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setSelectedMood("all");
    setSelectedTags([]);
  };

  const hasActiveFilters =
    searchTerm || selectedMood !== "all" || selectedTags.length > 0;

  return (
    <div className="min-h-screen bg-default pt-16 sm:pt-20 pb-24 px-3 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 mb-4 sm:mb-6">
          <CommonPageHeader isSetting={false} heading="Journal" />

          <div className="flex items-center gap-2 self-end xs:self-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-lg border transition-colors ${
                showFilters || hasActiveFilters
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-card border-default text-muted hover:text-primary"
              }`}
              aria-label="Toggle filters"
            >
              <Filter size={18} />
            </button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddEntry}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
            >
              <Plus size={18} />
              <span className="whitespace-nowrap">New Entry</span>
            </motion.button>
          </div>
        </div>

        {/* Stats - Scrollable on mobile if needed */}
        {stats && (
          <div className="overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
            <div className="min-w-max sm:min-w-0">
              <JournalStats stats={stats} />
            </div>
          </div>
        )}

        {/* Editor Modal */}
        <AnimatePresence>
          {showEditor && (
            <JournalEditor
              entry={editingEntry}
              onSave={handleSaveEntry}
              onClose={() => {
                setShowEditor(false);
                setEditingEntry(null);
              }}
            />
          )}
        </AnimatePresence>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-card border border-default rounded-xl p-4 mt-4 space-y-4">
                {/* Mood filter */}
                <div>
                  <label className="text-xs font-medium text-muted mb-2 block">
                    Mood
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedMood("all")}
                      className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors ${
                        selectedMood === "all"
                          ? "bg-primary-500 text-white"
                          : "bg-default text-muted hover:text-primary"
                      }`}
                    >
                      All
                    </button>
                    {["Happy", "Good", "Neutral", "Sad", "Terrible"].map(
                      (mood) => (
                        <button
                          key={mood}
                          onClick={() => setSelectedMood(mood as MoodType)}
                          className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors ${
                            selectedMood === mood
                              ? "bg-primary-500 text-white"
                              : "bg-default text-muted hover:text-primary"
                          }`}
                        >
                          {mood}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* Tags filter */}
                {availableTags.length > 0 && (
                  <div>
                    <label className="text-xs font-medium text-muted mb-2 block">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() =>
                            setSelectedTags((prev) =>
                              prev.includes(tag)
                                ? prev.filter((t) => t !== tag)
                                : [...prev, tag],
                            )
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors ${
                            selectedTags.includes(tag)
                              ? "bg-primary-500 text-white"
                              : "bg-default text-muted hover:text-primary"
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-500 hover:text-primary-600"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and view controls */}
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              size={18}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search journal entries..."
              className="w-full pl-10 pr-10 py-3 bg-card border border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary text-sm sm:text-base"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="flex items-center gap-1 bg-card rounded-lg p-1 border border-default">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary-500 text-white"
                    : "text-muted hover:text-primary"
                }`}
                aria-label="Grid view"
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-primary-500 text-white"
                    : "text-muted hover:text-primary"
                }`}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-3 text-xs sm:text-sm text-muted">
          {filteredEntries.length}{" "}
          {filteredEntries.length === 1 ? "entry" : "entries"} found
        </div>

        {/* Entries grid/list */}
        {!entries ? (
          <div className="flex justify-center items-center h-48 sm:h-64">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary-500" />
          </div>
        ) : filteredEntries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 sm:py-20"
          >
            <BookOpen
              size={48}
              className="mx-auto text-muted opacity-30 sm:hidden"
            />
            <BookOpen
              size={64}
              className="mx-auto text-muted opacity-30 hidden sm:block"
            />
            <h3 className="text-base sm:text-lg font-semibold text-primary mt-4 sm:mt-6 mb-2">
              {hasActiveFilters ? "No entries found" : "No journal entries yet"}
            </h3>
            <p className="text-xs sm:text-sm text-muted max-w-xs sm:max-w-md mx-auto mb-4 sm:mb-6 px-4">
              {hasActiveFilters
                ? "Try adjusting your filters"
                : "Start documenting your thoughts and feelings"}
            </p>
            {!hasActiveFilters && (
              <button
                onClick={handleAddEntry}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
              >
                Write Your First Entry
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-4 sm:mt-6 ${
              viewMode === "grid"
                ? "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
                : "space-y-3"
            }`}
          >
            <AnimatePresence>
              {filteredEntries.map((entry) => (
                <JournalCard
                  key={entry.id}
                  entry={entry}
                  onEdit={() => handleEditEntry(entry)}
                  onDelete={() => handleDeleteEntry(entry.id!)}
                  onClick={() => navigate(`/journal/${entry.id}`)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
