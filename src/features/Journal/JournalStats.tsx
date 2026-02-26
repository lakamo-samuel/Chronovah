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
      value: stats.currentStreak,
      icon: Flame,
      color: "orange",
      suffix: "d",
    },
    {
      label: "Longest",
      value: stats.longestStreak,
      icon: Calendar,
      color: "green",
      suffix: "d",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-1.5 sm:gap-2 md:gap-3">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-default rounded-lg p-2 sm:p-3 hover:shadow-medium transition-all"
          >
            <div className="flex flex-col items-center text-center gap-1">
              <div className={`p-1.5 rounded-lg bg-${stat.color}-500/10`}>
                <Icon size={14} className={`text-${stat.color}-500`} />
              </div>
              <div className="min-w-0 w-full">
                <p className="text-[10px] sm:text-xs text-muted truncate">
                  {stat.label}
                </p>
                <p className="text-xs sm:text-sm md:text-base font-semibold text-primary truncate">
                  {stat.value}
                  {stat.suffix && (
                    <span className="text-[10px] sm:text-xs ml-0.5">
                      {stat.suffix}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
