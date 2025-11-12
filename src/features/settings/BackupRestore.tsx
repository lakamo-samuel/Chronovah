import { useDexieBackup } from "../../hooks/useDexieBackUp";

function BackupRestore() {
  const { exportBackup, importBackup, loading } = useDexieBackup();

  return (
    <div className="bg-white dark:bg-[#0B1120] rounded-2xl p-5 shadow space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-100">
        Backup & Restore
      </h2>

      <div className="flex gap-3">
        <button
          onClick={exportBackup}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
          disabled={loading}
        >
          Export Backup
        </button>

        <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl cursor-pointer transition">
          Import Backup
          <input
            type="file"
            accept=".json"
            className="hidden"
            onChange={importBackup}
            disabled={loading}
          />
        </label>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Export creates a file backup of your People, Notes, Places, and
        Journals.
      </p>
    </div>
  );
}

export default BackupRestore;
