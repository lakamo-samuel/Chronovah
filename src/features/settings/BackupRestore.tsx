import { useDexieBackup } from "../../hooks/useDexieBackUp";

function BackupRestore() {
  const { exportBackup, importBackup, loading } = useDexieBackup();

  return (
    <div className="bg-default rounded-2xl p-4 sm:p-5 lg:p-6 shadow space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold text-primary">
        Backup & Restore
      </h2>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          onClick={exportBackup}
          className="flex-1 bg-primary hover:bg-primary-hover text-white px-3 sm:px-4 py-2.5 rounded-xl transition disabled:opacity-50"
          disabled={loading}
        >
          Export
        </button>

        <label className="flex-1 bg-primary hover:bg-primary-hover text-white px-3 sm:px-4 py-2.5 rounded-xl cursor-pointer transition text-center">
          Import
          <input
            type="file"
            accept=".json"
            className="hidden"
            onChange={importBackup}
            disabled={loading}
          />
        </label>
      </div>

      <p className="text-xs sm:text-sm text-muted">
        Export creates a file backup of your People, Notes, Places, and Journals.
      </p>
    </div>
  );
}

export default BackupRestore;
