import { useState, useCallback } from "react";
import { db } from "../database/db";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";

type BackupData = {
  _meta: { version: string; exportedAt: string };
  people: unknown[];
  places: unknown[];
  notes: unknown[];
  journals: unknown[];
};

export const useDexieBackup = () => {
  // ✅ Hooks called at the top level — not inside callbacks
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const exportBackup = useCallback(async () => {
    if (!user?.id) {
      showError("You must be logged in to export data.");
      return;
    }

    setLoading(true);
    try {
      const exportData: BackupData = {
        _meta: {
          version: "1.0.0",
          exportedAt: new Date().toISOString(),
        },
        people:   await db.people.where("userId").equals(user.id).toArray(),
        places:   await db.places.where("userId").equals(user.id).toArray(),
        notes:    await db.notes.where("userId").equals(user.id).toArray(),
        journals: await db.journal.where("userId").equals(user.id).toArray(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });

      const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `chronovah-backup-${timestamp}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      success("Backup exported successfully.");
    } catch (err) {
      console.error("Export failed:", err);
      showError("Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const importBackup = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!user?.id) {
        showError("You must be logged in to import data.");
        return;
      }

      const file = e.target.files?.[0];
      if (!file) return;

      setLoading(true);
      setImportError(null);

      try {
        // Parse JSON
        let data: BackupData;
        try {
          const text = await file.text();
          data = JSON.parse(text);
        } catch {
          showError("Invalid file — could not parse JSON.");
          return;
        }

        // Validate shape
        const people   = Array.isArray(data?.people)   ? data.people   : [];
        const places   = Array.isArray(data?.places)   ? data.places   : [];
        const notes    = Array.isArray(data?.notes)    ? data.notes    : [];
        // Support both "journals" (export key) and "journal" (legacy)
        const journals = Array.isArray(data?.journals)
          ? data.journals
          : Array.isArray((data as any)?.journal)
          ? (data as any).journal
          : [];

        const totalRecords = people.length + places.length + notes.length + journals.length;
        if (totalRecords === 0) {
          showError("The backup file contains no data.");
          return;
        }

        // Clear existing user data
        await Promise.all([
          db.people.where("userId").equals(user.id).delete(),
          db.places.where("userId").equals(user.id).delete(),
          db.notes.where("userId").equals(user.id).delete(),
          db.journal.where("userId").equals(user.id).delete(),
        ]);

        // Stamp userId on every record and bulk-put (handles duplicates gracefully)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const stamp = (arr: unknown[]) => arr.map((r: any) => ({ ...r, userId: user.id }));

        await db.people.bulkPut(stamp(people) as any);
        await db.places.bulkPut(stamp(places) as any);
        await db.notes.bulkPut(stamp(notes) as any);
        await db.journal.bulkPut(stamp(journals) as any);

        success(`Imported ${totalRecords} records successfully.`);
      } catch (err) {
        console.error("Import failed:", err);
        showError("Import failed. The file may be corrupted or incompatible.");
        setImportError("Import failed. See console for details.");
      } finally {
        // Reset the file input so the same file can be re-selected
        if (e.target) e.target.value = "";
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user?.id]
  );

  return { exportBackup, importBackup, loading, importError };
};
