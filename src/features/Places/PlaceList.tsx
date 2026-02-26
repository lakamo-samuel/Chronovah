// pages/Places/index.tsx
import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  Grid3X3,
  List,
  X,
  Map,
  Filter,
  
} from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { AnimatePresence, motion } from "framer-motion";
import { db } from "../../Database/placesDB";
import CommonPageHeader from "../../components/CommonPageHeader";
import PlaceEditor from "./PlaceEditor";
import PlaceStats from "./PlaceStats";
import PlaceCard from "./PlaceCard";
import type { Place, PlaceType } from "../../type/PlaceType";

type SortOption = "name" | "country" | "visitedDate" | "createdAt";

export default function Places() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("createdAt");
  const [selectedType, setSelectedType] = useState<PlaceType | "all">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Partial<Place> | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all places
  const places = useLiveQuery(() => db.places.toArray(), []);

  // Extract unique tags from places
  useEffect(() => {
    if (places) {
      const tags = new Set<string>();
      places.forEach((place) => place.tags?.forEach((tag) => tags.add(tag)));
      setAvailableTags(Array.from(tags));
    }
  }, [places]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!places || places.length === 0) {
      return {
        totalPlaces: 0,
        visitedCountries: 0,
        favoritePlaces: 0,
        typesCount: {},
      };
    }

    const countries = new Set(places.map((p) => p.country));
    const typesCount: Record<string, number> = {};
    places.forEach((p) => {
      typesCount[p.type] = (typesCount[p.type] || 0) + 1;
    });

    return {
      totalPlaces: places.length,
      visitedCountries: countries.size,
      favoritePlaces: places.filter((p) => p.isFavorite).length,
      typesCount,
    };
  }, [places]);

  // Filter and sort places
  const filteredPlaces = useMemo(() => {
    if (!places) return [];

    let filtered = [...places];

    // Search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.country.toLowerCase().includes(searchLower) ||
          p.location?.toLowerCase().includes(searchLower) ||
          p.notes?.toLowerCase().includes(searchLower) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(searchLower)),
      );
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((p) => p.type === selectedType);
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((p) =>
        selectedTags.every((tag) => p.tags?.includes(tag)),
      );
    }

    // Sort
    filtered.sort((a, b) => {
      // Favorites first
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;

      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "country":
          return a.country.localeCompare(b.country);
        case "visitedDate":
          return (b.visitedDate || "").localeCompare(a.visitedDate || "");
        case "createdAt":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [places, debouncedSearch, selectedType, selectedTags, sortBy]);

  const handleAddPlace = () => {
    setEditingPlace(null);
    setShowEditor(true);
  };

  const handleEditPlace = (place: Place) => {
    setEditingPlace(place);
    setShowEditor(true);
  };

  const handleSavePlace = async (placeData: Partial<Place>) => {
    const now = new Date().toISOString();

    if (editingPlace?.id) {
      // Update existing place
      await db.places.update(editingPlace.id, {
        ...placeData,
        updatedAt: now,
      });
    } else {
      // Add new place
      const newPlace: Omit<Place, "id"> = {
        name: placeData.name || "",
        country: placeData.country || "",
        location: placeData.location,
        type: placeData.type || "City",
        notes: placeData.notes,
        images: placeData.images || [],
        visitedDate: placeData.visitedDate,
        createdAt: now,
        updatedAt: now,
        isFavorite: false,
        tags: placeData.tags || [],
        rating: placeData.rating,
        cost: placeData.cost,
        currency: placeData.currency,
        website: placeData.website,
        phone: placeData.phone,
        openingHours: placeData.openingHours,
      };
      await db.places.add(newPlace as Place);
    }

    setShowEditor(false);
    setEditingPlace(null);
  };

  const handleDeletePlace = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this place?")) {
      await db.places.delete(id);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setSelectedType("all");
    setSelectedTags([]);
  };

  const hasActiveFilters =
    searchTerm || selectedType !== "all" || selectedTags.length > 0;

  return (
    <div className="min-h-screen  pt-20 pb-24 px-4 sm:px-6">
      <div className="">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <CommonPageHeader isSetting={false} heading="Places" />

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg border transition-colors ${
                showFilters || hasActiveFilters
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-card border-default text-muted hover:text-primary"
              }`}
            >
              <Filter size={18} />
            </button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddPlace}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
            >
              <Plus size={18} />
              <span>Add Place</span>
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        {stats && <PlaceStats stats={stats} />}

        {/* Editor Modal */}
        <AnimatePresence>
          {showEditor && (
            <PlaceEditor
              place={editingPlace}
              onSave={handleSavePlace}
              onClose={() => {
                setShowEditor(false);
                setEditingPlace(null);
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
                {/* Type filter */}
                <div>
                  <label className="text-xs font-medium text-muted mb-2 block">
                    Place Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedType("all")}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        selectedType === "all"
                          ? "bg-primary-500 text-white"
                          : "bg-default text-muted hover:text-primary"
                      }`}
                    >
                      All
                    </button>
                    {[
                      "City",
                      "Landmark",
                      "Restaurant",
                      "Cafe",
                      "Beach",
                      "Mountain",
                      "Museum",
                    ].map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type as PlaceType)}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          selectedType === type
                            ? "bg-primary-500 text-white"
                            : "bg-default text-muted hover:text-primary"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
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
                          className={`px-3 py-1 rounded-lg text-sm ${
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
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              size={18}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search places by name, country, or tags..."
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
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 bg-card border border-default rounded-xl text-muted focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <option value="createdAt">Recently added</option>
              <option value="name">Name</option>
              <option value="country">Country</option>
              <option value="visitedDate">Visited date</option>
            </select>

            <div className="flex items-center gap-1 bg-card rounded-lg p-1 border border-default">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary-500 text-white"
                    : "text-muted hover:text-primary"
                }`}
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
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-muted">
          {filteredPlaces.length}{" "}
          {filteredPlaces.length === 1 ? "place" : "places"} found
        </div>

        {/* Places grid/list */}
        {!places ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
          </div>
        ) : filteredPlaces.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Map size={64} className="mx-auto text-muted opacity-30" />
            <h3 className="text-lg font-semibold text-primary mt-6 mb-2">
              {hasActiveFilters ? "No places found" : "No places yet"}
            </h3>
            <p className="text-muted max-w-md mx-auto mb-6">
              {hasActiveFilters
                ? "Try adjusting your filters"
                : "Start adding the places you've visited"}
            </p>
            {!hasActiveFilters && (
              <button
                onClick={handleAddPlace}
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
              >
                Add Your First Place
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
              {filteredPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onEdit={() => handleEditPlace(place)}
                  onDelete={() => handleDeletePlace(place.id!)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
