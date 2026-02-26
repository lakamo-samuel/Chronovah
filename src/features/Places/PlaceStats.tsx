// pages/Places/PlaceStats.tsx
import { motion } from "framer-motion";
import { MapPin, Globe, Heart, Tag } from "lucide-react";
import type { PlaceStats } from "../../type/PlaceType";

interface PlaceStatsProps {
  stats: PlaceStats;
}

export default function PlaceStats({ stats }: PlaceStatsProps) {
  const statCards = [
    {
      label: "Total Places",
      value: stats.totalPlaces,
      icon: MapPin,
      color: "primary",
    },
    {
      label: "Countries Visited",
      value: stats.visitedCountries,
      icon: Globe,
      color: "accent-blue",
    },
    {
      label: "Favorites",
      value: stats.favoritePlaces,
      icon: Heart,
      color: "accent-red",
    },
    {
      label: "Place Types",
      value: Object.keys(stats.typesCount).length,
      icon: Tag,
      color: "accent-green",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-default rounded-xl p-4 hover:shadow-medium transition-all"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-${stat.color}/10 rounded-lg`}>
                <Icon size={18} className={`text-${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted">{stat.label}</p>
                <p className="text-xl font-semibold text-primary">
                  {stat.value}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
