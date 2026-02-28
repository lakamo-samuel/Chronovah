// pages/People/index.tsx
import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Grid3X3, List, X, Users, Filter } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { db } from "../../Database/peopleDB";
import type { Person } from "../../type/PeopleType";
import PersonEditor from "./PersonEditor";
import PersonCard from "./PersonCard";
import PeopleStats from "./PeopleStats";

export default function PeopleList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedRelation, setSelectedRelation] = useState<string | "all">(
    "all",
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableRelations, setAvailableRelations] = useState<string[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Partial<Person> | null>(
    null,
  );
  const [showFilters, setShowFilters] = useState(false);

  const people = useLiveQuery(() => db.people.orderBy("name").toArray(), []);

  // Extract unique tags and relations
  useEffect(() => {
    if (people) {
      const tags = new Set<string>();
      const relations = new Set<string>();
      people.forEach((person) => {
        person.tags?.forEach((tag: string) => tags.add(tag));
        relations.add(person.relation);
      });
      setAvailableTags(Array.from(tags));
      setAvailableRelations(Array.from(relations));
    }
  }, [people]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!people)
      return {
        totalPeople: 0,
        favoritePeople: 0,
        uniqueRelations: 0,
        recentAdded: 0,
        contactMethods: { email: 0, phone: 0, social: 0 },
      };

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return {
      totalPeople: people.length,
      favoritePeople: people.filter((p) => p.isFavorite).length,
      uniqueRelations: new Set(people.map((p) => p.relation)).size,
      recentAdded: people.filter((p) => new Date(p.createdAt) > oneWeekAgo)
        .length,
      contactMethods: {
        email: people.filter((p) => p.email).length,
        phone: people.filter((p) => p.phone).length,
        social: people.filter(
          (p) => p.socialMedia && Object.values(p.socialMedia).some(Boolean),
        ).length,
      },
    };
  }, [people]);

  // Filter people
  const filteredPeople = useMemo(() => {
    if (!people) return [];

    let filtered = [...people];

    // Search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.nickname?.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower) ||
          p.email?.toLowerCase().includes(searchLower) ||
          p.company?.toLowerCase().includes(searchLower) ||
          p.tags?.some((tag: string) =>
            tag.toLowerCase().includes(searchLower),
          ),
      );
    }

    // Relation filter
    if (selectedRelation !== "all") {
      filtered = filtered.filter((p) => p.relation === selectedRelation);
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((p) =>
        selectedTags.every((tag) => p.tags?.includes(tag)),
      );
    }

    // Sort by name
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    return filtered;
  }, [people, debouncedSearch, selectedRelation, selectedTags]);

  const handleAddPerson = () => {
    setEditingPerson(null);
    setShowEditor(true);
  };

  const handleEditPerson = (person: Person) => {
    setEditingPerson(person);
    setShowEditor(true);
  };

  const handleSavePerson = async (personData: Partial<Person>) => {
    const now = new Date().toISOString();

    if (editingPerson?.id) {
      // Update existing
      await db.people.update(editingPerson.id, {
        ...personData,
        updatedAt: now,
      });
    } else {
      // Add new
      const newPerson: Omit<Person, "id"> = {
        name: personData.name!,
        nickname: personData.nickname,
        description: personData.description || "",
        image: personData.image,
        images: personData.images,
        relation: personData.relation || "Friend",
        birthday: personData.birthday,
        email: personData.email,
        phone: personData.phone,
        address: personData.address,
        website: personData.website,
        company: personData.company,
        jobTitle: personData.jobTitle,
        notes: personData.notes,
        tags: personData.tags || [],
        isFavorite: personData.isFavorite || false,
        createdAt: now,
        updatedAt: now,
        socialMedia: personData.socialMedia,
      };
      await db.people.add(newPerson as Person);
    }

    setShowEditor(false);
    setEditingPerson(null);
  };

  const handleDeletePerson = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this person?")) {
      await db.people.delete(id);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setSelectedRelation("all");
    setSelectedTags([]);
  };

  const hasActiveFilters =
    searchTerm || selectedRelation !== "all" || selectedTags.length > 0;

  return (
    <div className="min-h-screen bg-default px-3 pb-24 pt-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-primary">People</h1>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg border transition-colors ${
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
              onClick={handleAddPerson}
              className="flex items-center gap-1 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors text-sm"
            >
              <Plus size={16} />
              <span>Add</span>
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        {stats && <PeopleStats stats={stats} />}

        {/* Editor Modal */}
        <AnimatePresence>
          {showEditor && (
            <PersonEditor
              person={editingPerson}
              onSave={handleSavePerson}
              onClose={() => {
                setShowEditor(false);
                setEditingPerson(null);
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
              <div className="bg-card border border-default rounded-lg p-3 my-4 space-y-3">
                {/* Relation filter */}
                {availableRelations.length > 0 && (
                  <div>
                    <label className="text-xs font-medium text-muted mb-1.5 block">
                      Relation
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => setSelectedRelation("all")}
                        className={`px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                          selectedRelation === "all"
                            ? "bg-primary-500 text-white"
                            : "bg-default text-muted hover:text-primary"
                        }`}
                      >
                        All
                      </button>
                      {availableRelations.map((relation) => (
                        <button
                          key={relation}
                          onClick={() => setSelectedRelation(relation)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                            selectedRelation === relation
                              ? "bg-primary-500 text-white"
                              : "bg-default text-muted hover:text-primary"
                          }`}
                        >
                          {relation}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags filter */}
                {availableTags.length > 0 && (
                  <div>
                    <label className="text-xs font-medium text-muted mb-1.5 block">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-1.5">
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
                          className={`px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
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
                    className="text-xs text-primary-500 hover:text-primary-600"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and view controls */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              size={16}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search people..."
              className="w-full pl-9 pr-8 py-2.5 bg-card border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-muted">
              {filteredPeople.length}{" "}
              {filteredPeople.length === 1 ? "person" : "people"}
            </div>

            <div className="flex items-center gap-1 bg-card rounded-lg p-1 border border-default">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary-500 text-white"
                    : "text-muted hover:text-primary"
                }`}
                aria-label="Grid view"
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-primary-500 text-white"
                    : "text-muted hover:text-primary"
                }`}
                aria-label="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* People grid/list */}
        {!people ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500" />
          </div>
        ) : filteredPeople.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Users size={40} className="mx-auto text-muted opacity-30 mb-3" />
            <h3 className="text-base font-semibold text-primary mb-1">
              {hasActiveFilters ? "No people found" : "No people yet"}
            </h3>
            <p className="text-xs text-muted max-w-xs mx-auto mb-4">
              {hasActiveFilters
                ? "Try adjusting your filters"
                : "Start adding the people in your life"}
            </p>
            {!hasActiveFilters && (
              <button
                onClick={handleAddPerson}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors text-sm"
              >
                Add First Person
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={
              viewMode === "grid" ? "grid grid-cols-1 gap-3" : "space-y-2"
            }
          >
            <AnimatePresence>
              {filteredPeople.map((person) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  onEdit={() => handleEditPerson(person)}
                  onDelete={() => handleDeletePerson(person.id!)}
                  onClick={() => navigate(`/people/${person.id}`)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
