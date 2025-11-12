import { Trash2 } from "lucide-react";
import { db as peopleDB } from "../../Database/peopleDB";
import { db as placeDB } from "../../Database/placesDB";
import { db as journalDB } from "../../Database/journalDB";
import { db as noteDB } from "../../Database/db";
function DangerZone() {
      const handleClearAll = async () => {
        if (!confirm("This will remove ALL data permanently. Continue?"))
          return;
        await Promise.all([
          peopleDB.people.clear(),
          placeDB.places?.clear(),
          noteDB.notes?.clear(),
          journalDB.journal?.clear(),
        ]);
        alert("All data cleared successfully.");
      };

  return (
    <div className="bg-red-50 dark:bg-red-950 border rounded-2xl p-5 shadow space-y-3">
      <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        This will permanently delete all your app data. Proceed with caution.
      </p>
      <button
        onClick={handleClearAll}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition"
      >
        <Trash2 size={16} /> Clear All Data
      </button>
    </div>
  );
}

export default DangerZone;