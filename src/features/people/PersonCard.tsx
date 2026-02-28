// pages/People/PersonCard.tsx
import { motion } from "framer-motion";
import {
  Heart,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Edit2,
  Trash2,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

import { db } from "../../Database/peopleDB";
import type { Person } from "../../type/PeopleType";

interface PersonCardProps {
  person: Person;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}

export default function PersonCard({
  person,
  onEdit,
  onDelete,
  onClick,
}: PersonCardProps) {
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await db.people.update(person.id!, {
      isFavorite: !person.isFavorite,
      updatedAt: new Date().toISOString(),
    });
  };

  //   const formatDate = (dateString?: string) => {
  //     if (!dateString) return "";
  //     const date = new Date(dateString);
  //     return date.toLocaleDateString("en-US", {
  //       month: "short",
  //       day: "numeric",
  //     });
  //   };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const hasSocialMedia =
    person.socialMedia && Object.values(person.socialMedia).some(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="bg-card rounded-xl border border-default overflow-hidden hover:shadow-hard transition-all cursor-pointer group flex flex-col h-full"
    >
      {/* Image/Initials Section */}
      <div className="relative h-32 bg-gradient-to-br from-primary-500/20 to-secondary-500/20">
        {person.image ? (
          <img
            src={person.image}
            alt={person.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary-500 text-white flex items-center justify-center text-2xl font-bold">
              {getInitials(person.name)}
            </div>
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={toggleFavorite}
          className={`absolute top-2 right-2 p-1.5 rounded-full transition-all ${
            person.isFavorite
              ? "text-red-500 bg-red-500/20"
              : "text-muted bg-black/40 opacity-0 group-hover:opacity-100"
          }`}
        >
          <Heart size={14} fill={person.isFavorite ? "currentColor" : "none"} />
        </button>

        {/* Relation badge */}
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
          {person.relation}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex-1">
        <h3 className="font-semibold text-primary text-sm mb-1 line-clamp-1">
          {person.name}
        </h3>

        {person.nickname && (
          <p className="text-xs text-muted mb-2">"{person.nickname}"</p>
        )}

        {/* Contact icons */}
        <div className="flex items-center gap-2 mb-2">
          {person.email && <Mail size={12} className="text-muted" />}
          {person.phone && <Phone size={12} className="text-muted" />}
          {person.birthday && <Calendar size={12} className="text-muted" />}
          {person.company && <Briefcase size={12} className="text-muted" />}
          {hasSocialMedia && (
            <div className="flex items-center gap-1">
              {person.socialMedia?.twitter && (
                <Twitter size={10} className="text-muted" />
              )}
              {person.socialMedia?.instagram && (
                <Instagram size={10} className="text-muted" />
              )}
              {person.socialMedia?.linkedin && (
                <Linkedin size={10} className="text-muted" />
              )}
            </div>
          )}
        </div>

        {/* Description preview */}
        {person.description && (
          <p className="text-xs text-muted line-clamp-2">
            {person.description}
          </p>
        )}

        {/* Tags */}
        {person.tags && person.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {person.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-default text-muted px-1.5 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-1 p-2 border-t border-default bg-default/50">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1.5 hover:bg-card rounded-lg transition-colors flex items-center gap-1 text-xs text-muted hover:text-primary-500"
        >
          <Edit2 size={12} />
          <span>Edit</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 hover:bg-card rounded-lg transition-colors flex items-center gap-1 text-xs text-muted hover:text-red-500"
        >
          <Trash2 size={12} />
          <span>Delete</span>
        </button>
      </div>
    </motion.div>
  );
}
