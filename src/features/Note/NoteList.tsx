// pages/Notes/index.tsx
import { useState, useMemo, useEffect } from "react";
import { db } from "../Database/db";
import {
  Plus,
  Search,
  Grid3X3,
  List,
  Pin,
  Filter,
  X,
  Calendar,
  Tag,
  SortDesc,
  Sparkles,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import type { Note, NoteColor } from "../types/NoteType";
import { motion, AnimatePresence } from "framer-motion";
import CommonPageHeader from "../components/CommonPageHeader";
import NoteCard from "../components/NoteCard";
import { useNavigate } from "react-router-dom";
import NoteStats from "../components/NoteStats";

type SortOption = "updated" | "created" | "title" | "wordCount";
type FilterOption = "all" | "pinned" | "favorites" | "recent";

export default function Notes() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("updated");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [selectedColor, setSelectedColor] = useState<NoteColor | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const notes = useLiveQuery(
    () => db.notes.orderBy("isPinned").reverse().toArray(),
    [],
  );

  // Extract all unique tags from notes
  useEffect(() => {
    if (notes) {
      const tags = new Set<string>();
      notes.forEach((note) => note.tags?.forEach((tag) => tags.add(tag)));
      setAvailableTags(Array.from(tags));
    }
  }, [notes]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!notes) return null;
    return {
      totalNotes: notes.length,
      pinnedNotes: notes.filter((n) => n.isPinned).length,
      favoriteNotes: notes.filter((n) => n.isFavorite).length,
      totalWords: notes.reduce(
        (acc, note) =>
          acc + (note.wordCount || note.content.split(/\s+/).length),
        0,
      ),
    };
  }, [notes]);

  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    if (!notes) return [];

    let filtered = [...notes];

    // Apply search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchLower) ||
          note.content.toLowerCase().includes(searchLower) ||
          note.tags?.some((tag) => tag.toLowerCase().includes(searchLower)),
      );
    }

    // Apply filter by type
    switch (filterBy) {
      case "pinned":
        filtered = filtered.filter((n) => n.isPinned);
        break;
      case "favorites":
        filtered = filtered.filter((n) => n.isFavorite);
        break;
      case "recent":
        filtered = filtered.filter((n) => {
          const daysAgo =
            (Date.now() - new Date(n.updatedAt).getTime()) /
            (1000 * 60 * 60 * 24);
          return daysAgo <= 7;
        });
        break;
    }

    // Apply color filter
    if (selectedColor !== "all") {
      filtered = filtered.filter((n) => n.color === selectedColor);
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter((note) =>
        selectedTags.every((tag) => note.tags?.includes(tag)),
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      // Pinned notes always on top
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      switch (sortBy) {
        case "updated":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case "created":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        case "wordCount":
          return (b.wordCount || 0) - (a.wordCount || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [notes, debouncedSearch, filterBy, sortBy, selectedColor, selectedTags]);

  const handleCreateNote = async () => {
    const now = new Date().toISOString();
    const newNote: Note = {
      title: "",
      content: "",
      createdAt: now,
      updatedAt: now,
      isPinned: false,
      isFavorite: false,
      tags: [],
      wordCount: 0,
      readTime: 0,
    };

    const id = await db.notes.add(newNote);
    navigate(`/notes/${id}`);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setFilterBy("all");
    setSelectedColor("all");
    setSelectedTags([]);
  };

  const hasActiveFilters =
    searchTerm ||
    filterBy !== "all" ||
    selectedColor !== "all" ||
    selectedTags.length > 0;

  return (
    <div className="min-h-screen bg-default pt-20 pb-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <CommonPageHeader isSetting={false} heading="Notes" />

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateNote}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors shadow-soft hover:shadow-medium sm:w-auto w-full"
          >
            <Plus size={18} />
            <span>New Note</span>
          </motion.button>
        </div>

        {/* Stats Cards */}
        {stats && <NoteStats stats={stats} />}

        {/* Search and filters bar */}
        <div className="mt-6 space-y-3">
          {/* Search row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                size={18}
              />
              <input
                type="text"
                placeholder="Search notes by title, content, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-card border border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-xl border transition-colors flex items-center gap-2 ${
                  showFilters || hasActiveFilters
                    ? "bg-primary-500 text-white border-primary-500"
                    : "bg-card border-default text-muted hover:text-primary"
                }`}
              >
                <Filter size={18} />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <span className="bg-white text-primary-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedTags.length +
                      (filterBy !== "all" ? 1 : 0) +
                      (selectedColor !== "all" ? 1 : 0)}
                  </span>
                )}
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 bg-card border border-default rounded-xl text-muted focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none cursor-pointer"
              >
                <option value="updated">Last updated</option>
                <option value="created">Date created</option>
                <option value="title">Title</option>
                <option value="wordCount">Word count</option>
              </select>

              <div className="flex items-center gap-1 bg-card rounded-lg p-1 border border-default">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-primary-500 text-white"
                      : "text-muted hover:text-primary-500"
                  }`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-primary-500 text-white"
                      : "text-muted hover:text-primary-500"
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Expanded filters panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-card border border-default rounded-xl p-4 space-y-4">
                  {/* Quick filters */}
                  <div>
                    <label className="text-xs font-medium text-muted uppercase tracking-wider mb-2 block">
                      Quick Filters
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "all", label: "All notes", icon: BookOpen },
                        { value: "pinned", label: "Pinned", icon: Pin },
                        {
                          value: "favorites",
                          label: "Favorites",
                          icon: Sparkles,
                        },
                        {
                          value: "recent",
                          label: "Last 7 days",
                          icon: Calendar,
                        },
                      ].map((filter) => {
                        const Icon = filter.icon;
                        return (
                          <button
                            key={filter.value}
                            onClick={() =>
                              setFilterBy(filter.value as FilterOption)
                            }
                            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-colors ${
                              filterBy === filter.value
                                ? "bg-primary-500 text-white"
                                : "bg-default text-muted hover:text-primary"
                            }`}
                          >
                            <Icon size={14} />
                            <span>{filter.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Color filters */}
                  <div>
                    <label className="text-xs font-medium text-muted uppercase tracking-wider mb-2 block">
                      Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "all",
                        "default",
                        "red",
                        "orange",
                        "yellow",
                        "green",
                        "blue",
                        "purple",
                        "pink",
                      ].map((color) => (
                        <button
                          key={color}
                          onClick={() =>
                            setSelectedColor(color as NoteColor | "all")
                          }
                          className={`w-8 h-8 rounded-full transition-all ${
                            color === "all"
                              ? "bg-card border border-default text-muted flex items-center justify-center"
                              : `bg-${color}-500`
                          } ${selectedColor === color ? "ring-2 ring-primary-500 ring-offset-2" : ""}`}
                        >
                          {color === "all" && <Filter size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tag filters */}
                  {availableTags.length > 0 && (
                    <div>
                      <label className="text-xs font-medium text-muted uppercase tracking-wider mb-2 block">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {availableTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-colors ${
                              selectedTags.includes(tag)
                                ? "bg-primary-500 text-white"
                                : "bg-default text-muted hover:text-primary"
                            }`}
                          >
                            <Tag size={14} />
                            <span>{tag}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clear filters button */}
                  {hasActiveFilters && (
                    <div className="pt-2 border-t border-default">
                      <button
                        onClick={clearFilters}
                        className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
                      >
                        <X size={14} />
                        <span>Clear all filters</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results count */}
        <div className="mt-4 flex items-center justify-between text-sm text-muted">
          <span>{filteredNotes.length} notes found</span>
          {hasActiveFilters && (
            <span className="flex items-center gap-1">
              <SortDesc size={14} />
              <span className="capitalize">Sorted by {sortBy}</span>
            </span>
          )}
        </div>

        {/* Notes grid/list */}
        {!filteredNotes ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
          </div>
        ) : filteredNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="relative">
              <BookOpen size={64} className="mx-auto text-muted opacity-30" />
              <Search
                size={32}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-muted"
              />
            </div>
            <h3 className="text-lg font-semibold text-primary mt-6 mb-2">
              No notes found
            </h3>
            <p className="text-muted max-w-md mx-auto">
              {hasActiveFilters
                ? "Try adjusting your filters or search terms"
                : "Create your first note to get started"}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-primary-500 hover:text-primary-600 text-sm"
              >
                Clear all filters
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-6 ${
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-3"
            }`}
          >
            <AnimatePresence>
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  viewMode={viewMode}
                  onClick={() => navigate(`/notes/${note.id}`)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
