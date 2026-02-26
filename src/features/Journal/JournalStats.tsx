// pages/Journal/JournalStats.tsx
import { motion } from "framer-motion";
import { BookOpen, Heart, Calendar, Flame } from "lucide-react";
import type { JournalStats } from "../../type/JournalType";

interface JournalStatsProps {
  stats: JournalStats;
}

export default function JournalStats({ stats }: JournalStatsProps) {
  const statCards = [
    {
      label: "Total",
      value: stats.totalEntries,
      icon: BookOpen,
      color: "primary",
    },
    {
      label: "Favorites",
      value: stats.favoriteEntries,
      icon: Heart,
      color: "red",
    },
    {
      label: "Current",
      value: `${stats.currentStreak}d`,
      icon: Flame,
      color: "orange",
    },
    {
      label: "Longest",
      value: `${stats.longestStreak}d`,
      icon: Calendar,
      color: "green",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-default rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-medium transition-all"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className={`p-1.5 sm:p-2 bg-${stat.color}-500/10 rounded-lg`}
              >
                <Icon size={16} className={`text-${stat.color}-500`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted truncate">{stat.label}</p>
                <p className="text-base sm:text-xl font-semibold text-primary truncate">
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
