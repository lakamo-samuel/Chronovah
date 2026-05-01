import { DashboardContext } from "../hooks/useDashBoard";
import type { DarkModeProviderProps } from "../type/DarkModeContextType";
import { NotebookPen, MapPin, Users, BookOpen } from "lucide-react";
import { db } from "../database/db";
import { useEffect, useState } from "react";
import type { ActivityItem } from "../type/DashboardType";
import { liveQuery } from "dexie";
import type { Note } from "../type/NoteType";
import type { JournalEntry } from "../type/JournalType";
import type { Place } from "../type/PlaceType";
import type { Person } from "../type/PeopleType";
import { useAuth } from "../hooks/useAuth";

interface ActivityCardItem {
  id: number | string;
  item: string,
  title: string;
  createdAt: string;
}

type DashboardSnapshot = {
  counts: {
    people: number;
    places: number;
    notes: number;
    journals: number;
  };
  activities: ActivityItem[];
  recentPeople: Person[];
  recentPlaces: Place[];
  recentNotes: Note[];
  recentJournals: JournalEntry[];
};

export function DashboardProvider({ children }: DarkModeProviderProps) {
  const { user } = useAuth();

  const [recentNotes, setRecentNotes] = useState<ActivityCardItem[]>([]);
  const [recentPeople, setRecentPeople] = useState<ActivityCardItem[]>([]);
  const [recentPlaces, setRecentPlaces] = useState<ActivityCardItem[]>([]);
  const [recentJournals, setRecentJournals] = useState<ActivityCardItem[]>([]);

  const [counts, setCounts] = useState({
    people: 0,
    places: 0,
    notes: 0,
    journals: 0,
  });

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  // True once the first liveQuery result has arrived
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Reset to loading state when user changes so stale data is never shown
    setIsReady(false);
    setActivities([]);
    setRecentNotes([]);
    setRecentPeople([]);
    setRecentPlaces([]);
    setRecentJournals([]);
    setCounts({ people: 0, places: 0, notes: 0, journals: 0 });

    // No user logged in — nothing to query
    if (!user?.id) {
      setIsReady(true);
      return;
    }

    const userId = user.id;

    // Define the observable using Dexie liveQuery — all queries filtered by userId
    const observable = liveQuery<DashboardSnapshot>(() => {
      // Counts — only this user's records
      const peopleCount   = db.people.where("userId").equals(userId).count();
      const placesCount   = db.places.where("userId").equals(userId).count();
      const notesCount    = db.notes.where("userId").equals(userId).count();
      const journalsCount = db.journal.where("userId").equals(userId).count();

      // Recent items — filter by userId then sort by createdAt descending
      const recentPeopleP = db.people
        .where("userId").equals(userId)
        .reverse()
        .sortBy("createdAt")
        .then((arr) => arr.slice(0, 3));

      const recentPlacesP = db.places
        .where("userId").equals(userId)
        .reverse()
        .sortBy("createdAt")
        .then((arr) => arr.slice(0, 3));

      const recentNotesP = db.notes
        .where("userId").equals(userId)
        .reverse()
        .sortBy("createdAt")
        .then((arr) => arr.slice(0, 3));

      const recentJournalsP = db.journal
        .where("userId").equals(userId)
        .reverse()
        .sortBy("createdAt")
        .then((arr) => arr.slice(0, 3));

      return Promise.all([
        peopleCount,
        placesCount,
        notesCount,
        journalsCount,
        recentPeopleP,
        recentPlacesP,
        recentNotesP,
        recentJournalsP,
      ]).then(
        ([
          pCount,
          plCount,
          nCount,
          jCount,
          recentPeople,
          recentPlaces,
          recentNotes,
          recentJournals,
        ]) => {
          const combined: ActivityItem[] = [
            ...(recentPeople ?? []).map(
              (p): ActivityItem => ({
                id: String(p.id),
                type: "people",
                title: p.name ?? "Unknown",
                createdAt: p.createdAt,
              })
            ),
            ...(recentPlaces ?? []).map(
              (p): ActivityItem => ({
                id: String(p.id),
                type: "places",
                title: p.name ?? "Unknown",
                createdAt: p.createdAt,
              })
            ),
            ...(recentNotes ?? []).map(
              (n): ActivityItem => ({
                id: String(n.id),
                type: "notes",
                title: n.title ?? "Untitled",
                createdAt: n.createdAt,
              })
            ),
            ...(recentJournals ?? []).map(
              (j): ActivityItem => ({
                id: String(j.id),
                type: "journals",
                title: j.mood ?? "No mood",
                createdAt: j.createdAt,
              })
            ),
          ].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          return {
            counts: {
              people: pCount,
              places: plCount,
              notes: nCount,
              journals: jCount,
            },
            activities: combined.slice(0, 6),
            recentPeople,
            recentPlaces,
            recentNotes,
            recentJournals,
          } as DashboardSnapshot;
        }
      );
    });

    const subscription = observable.subscribe({
      next: (snapshot) => {
        setCounts(snapshot.counts);
        setActivities(snapshot.activities);
        setRecentJournals(
          snapshot.recentJournals.map((j) => ({
            id: String(j.id),
            item: "journals",
            title: j.mood ?? "No mood",
            createdAt: j.createdAt,
          }))
        );
        setRecentNotes(
          snapshot.recentNotes.map((n) => ({
            id: String(n.id),
            item: "notes",
            title: n.title ?? "Untitled",
            createdAt: n.createdAt,
          }))
        );
        setRecentPeople(
          snapshot.recentPeople.map((p) => ({
            id: String(p.id),
            item: "people",
            title: p.name ?? "Unknown",
            createdAt: p.createdAt,
          }))
        );
        setRecentPlaces(
          snapshot.recentPlaces.map((p) => ({
            id: String(p.id),
            item: "places",
            title: p.name ?? "Unknown",
            createdAt: p.createdAt,
          }))
        );
        setIsReady(true);
      },
      error: (err) => {
        console.error("Live query error:", err);
        setIsReady(true);
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]); // re-run whenever the logged-in user changes

  const stats = [
    {
      title: "People",
      value: counts.people,
      icon: <Users className="w-5 h-5 text-green-600 dark:text-green-400" />,
      bg: "bg-green-500/10",
    },
    {
      title: "Places",
      value: counts.places,
      icon: <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      bg: "bg-blue-500/10",
    },
    {
      title: "Notes",
      value: counts.notes,
      icon: <NotebookPen className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
      bg: "bg-yellow-500/10",
    },
    {
      title: "Journals",
      value: counts.journals,
      icon: <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <DashboardContext.Provider value={{ stats, activities, recentNotes, recentPeople, recentPlaces, recentJournals, isReady }}>
      {children}
    </DashboardContext.Provider>
  );
}  