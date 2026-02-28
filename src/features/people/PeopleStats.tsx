// pages/People/PeopleStats.tsx
import { motion } from "framer-motion";
import { Users, Heart, Tag, Mail, Phone, Globe } from "lucide-react";
import type { PeopleStats } from "../../type/PeopleType";

interface PeopleStatsProps {
  stats: PeopleStats;
}

export default function PeopleStats({ stats }: PeopleStatsProps) {
  const statItems = [
    {
      label: "People",
      value: stats.totalPeople,
      icon: Users,
      color: "primary",
    },
    { label: "Fav", value: stats.favoritePeople, icon: Heart, color: "red" },
    {
      label: "Relations",
      value: stats.uniqueRelations,
      icon: Tag,
      color: "green",
    },
    {
      label: "Email",
      value: stats.contactMethods.email,
      icon: Mail,
      color: "blue",
    },
    {
      label: "Phone",
      value: stats.contactMethods.phone,
      icon: Phone,
      color: "orange",
    },
    {
      label: "Social",
      value: stats.contactMethods.social,
      icon: Globe,
      color: "purple",
    },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card border border-default rounded-lg p-2"
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-1 rounded-lg bg-${stat.color}-500/10 mb-1`}>
                <Icon size={14} className={`text-${stat.color}-500`} />
              </div>
              <p className="text-xs font-semibold text-primary">{stat.value}</p>
              <p className="text-[10px] text-muted mt-0.5">{stat.label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
