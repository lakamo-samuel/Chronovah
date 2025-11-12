import { useState, useCallback } from "react";
import { db as peopleDB } from "../Database/peopleDB";
import { db as placeDB } from "../Database/placesDB";
import { db as journalDB } from "../Database/journalDB";
import { db as noteDB } from "../Database/db";

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
    try {
      const exportData: BackupData = {
        _meta: { version: "1.0.0", exportedAt: new Date().toISOString() },
        people: await (peopleDB?.people?.toArray?.() ?? []),
        places: await (placeDB?.places?.toArray?.() ?? []),
        notes: await (noteDB?.notes?.toArray?.() ?? []),
        journals: await (journalDB?.journal?.toArray?.() ?? []),
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
      try {
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

        await Promise.all([
          peopleDB.people.clear(),
          placeDB.places?.clear(),
          noteDB.notes?.clear(),
          journalDB.journal?.clear(),
        ]);

        await peopleDB.people.bulkAdd(people);
        if (placeDB.places) await placeDB.places.bulkAdd(places);
        if (noteDB.notes) await noteDB.notes.bulkAdd(notes);
        if (journalDB.journal) await journalDB.journal.bulkAdd(journals);

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
