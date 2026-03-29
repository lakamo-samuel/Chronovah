import { useState, useCallback } from "react";
import { db } from "../database/db";
import { useAuth } from "./useAuth";

type BackupData = {
  _meta: { version: string; exportedAt: string };
  people: unknown[];
  places: unknown[];
  notes: unknown[];
  journals: unknown[];
};

export const useDexieBackup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportBackup = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { user } = useAuth();
    try {
      if (!user?.id) {
        setError("User not authenticated");
        return;
      }

      const exportData: BackupData = {
        _meta: { version: "1.0.0", exportedAt: new Date().toISOString() },
        people: await db.people.where("userId").equals(user.id).toArray(),
        places: await db.places.where("userId").equals(user.id).toArray(),
        notes: await db.notes.where("userId").equals(user.id).toArray(),
        journals: await db.journal.where("userId").equals(user.id).toArray(),
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "app_backup.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Export failed. See console for details.");
    } finally {
      setLoading(false);
    }
  }, []);

  const importBackup = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoading(true);
      setError(null);
      const { user } = useAuth();
      try {
        if (!user?.id) {
          setError("User not authenticated");
          return;
        }

        const file = e.target.files?.[0];
        if (!file) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let data: any;
        try {
          const text = await file.text();
          data = JSON.parse(text);
        } catch {
          alert("Invalid JSON file.");
          return;
        }

        if (!confirm("Importing will overwrite your data. Continue?")) return;

        const people = Array.isArray(data?.people) ? data.people : [];
        const places = Array.isArray(data?.places) ? data.places : [];
        const notes = Array.isArray(data?.notes) ? data.notes : [];
        const journals = Array.isArray(data?.journals)
          ? data.journals
          : Array.isArray(data?.journal)
          ? data.journal
          : [];

        // Clear existing user data for these tables
        await Promise.all([
          db.people.where("userId").equals(user.id).delete(),
          db.places.where("userId").equals(user.id).delete(),
          db.notes.where("userId").equals(user.id).delete(),
          db.journal.where("userId").equals(user.id).delete(),
        ]);

        // Add userId to imported data and bulk add
        await db.people.bulkAdd(people.map((p: any) => ({ ...p, userId: user.id })));
        await db.places.bulkAdd(places.map((p: any) => ({ ...p, userId: user.id })));
        await db.notes.bulkAdd(notes.map((n: any) => ({ ...n, userId: user.id })));
        await db.journal.bulkAdd(journals.map((j: any) => ({ ...j, userId: user.id })));

        alert("Data imported successfully!");
      } catch (err) {
        console.error("Import failed:", err);
        alert("Import failed. See console for details.");
      } finally {
        if (e.target) e.target.value = "";
        setLoading(false);
      }
    },
    []
  );

  return { exportBackup, importBackup, loading, error };
};
