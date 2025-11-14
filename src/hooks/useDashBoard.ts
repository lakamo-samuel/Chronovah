import { createContext, useContext, type JSX } from "react";
import type { ActivityItem } from "../type/DashboardType";

interface ActivityCardItem {
  id: number | string;
  title: string;
  createdAt: string;
}
interface DashboardContextType {
  stats: {
    title: string;
    value: number;
    icon: JSX.Element;
    bg: string;
  }[];
  activities: ActivityItem[];
  recentNotes: ActivityCardItem[];
  recentPeople: ActivityCardItem[];
  recentPlaces: ActivityCardItem[];
  recentJournals: ActivityCardItem[];
}

export const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined)
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  return context;
}