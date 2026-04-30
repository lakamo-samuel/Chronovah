/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useToast } from "../../hooks/useToast";
import { syncManager } from "../../lib/sync";
import { useAuth } from "../../hooks/useAuth";

type TableName = "people" | "places" | "notes" | "journals";

type Props = {
  name: string;
  data: any[];
  dbMap: Record<TableName, any>;
};

function IndividualData({ name, data, dbMap }: Props) {
  const { success, error } = useToast();
  const { user } = useAuth();

  const [selectedId, setSelectedId] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const tableKey = name.toLowerCase() as TableName;
  // Map display name to sync table name (journals → journal)
  const syncTable = tableKey === "journals" ? "journal" : tableKey;

  const handleDeleteClick = () => {
    if (!selectedId) {
      error("Please select an item first.");
      return;
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedId || !user?.id) return;
    setIsLoading(true);
    try {
      const targetTable = dbMap[tableKey];
      // Delete from Dexie first — useLiveQuery updates the UI instantly
      await targetTable.delete(selectedId);
      // Queue backend sync in background
      syncManager.queueOperation(user.id, syncTable as any, "delete", selectedId);
      success(`${name.slice(0, -1)} deleted successfully`);
      setSelectedId("");
    } catch {
      error(`Failed to delete ${name.slice(0, -1).toLowerCase()}`);
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  const confirmClearTable = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const targetTable = dbMap[tableKey];
      // Get all IDs before clearing so we can queue sync ops
      const allItems: any[] = await targetTable
        .where("userId")
        .equals(user.id)
        .toArray();
      // Delete from Dexie first — UI updates instantly
      await targetTable.where("userId").equals(user.id).delete();
      // Queue each delete for backend sync
      for (const item of allItems) {
        syncManager.queueOperation(user.id, syncTable as any, "delete", item.id);
      }
      success(`All ${name.toLowerCase()} cleared successfully`);
    } catch {
      error(`Failed to clear ${name.toLowerCase()}`);
    } finally {
      setIsLoading(false);
      setShowClearModal(false);
    }
  };

  return (
    <div className="bg-default rounded-2xl p-4 sm:p-5 lg:p-6 shadow space-y-3">
      <h2 className="text-base sm:text-lg font-semibold text-primary">{name}</h2>
      <p className="text-xs sm:text-sm text-muted">Total: {data.length}</p>

      <select
        className="w-full bg-card text-primary border border-default focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded-xl p-2 text-sm transition"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        <option value="">Select one to delete</option>
        {data.map((item: any) => (
          <option key={item.id} value={item.id}>
            {item.title ?? item.name ?? item.mood ?? `#${item.id}`}
          </option>
        ))}
      </select>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm pt-2">
        <button
          onClick={handleDeleteClick}
          className="px-3 py-1.5 text-accent-red hover:underline cursor-pointer whitespace-nowrap"
        >
          Delete Selected
        </button>
        <button
          onClick={() => setShowClearModal(true)}
          className="px-3 py-1.5 text-accent-red hover:underline cursor-pointer whitespace-nowrap"
        >
          Clear All
        </button>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Item"
        message={`Are you sure you want to delete this ${name.slice(0, -1).toLowerCase()}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={isLoading}
      />

      <ConfirmationModal
        isOpen={showClearModal}
        title="Clear All Data"
        message={`Are you sure you want to clear all ${name.toLowerCase()}? This action cannot be undone.`}
        confirmText="Clear All"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={confirmClearTable}
        onCancel={() => setShowClearModal(false)}
        isLoading={isLoading}
      />
    </div>
  );
}

export default IndividualData;
