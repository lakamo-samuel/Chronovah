/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useToast } from "../../hooks/useToast";

type TableName = "people" | "places" | "notes" | "journals";
type Props = {
  name: string;
  data: any[];
  dbMap: Record<TableName, any>;
};
function IndividualData({ name, data, dbMap }: Props) {
  const { success, error } = useToast();
  const [selected, setSelected] = useState<
    Record<TableName, string | number | "">
  >({
    people: "",
    places: "",
    notes: "",
    journals: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id: string | number) => {
    if (!id) {
      error("Please select an item first.");
      return;
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    const id = selected[name.toLowerCase() as TableName];
    if (!id) return;

    setIsLoading(true);
    try {
      const targetTable = dbMap[name.toLowerCase() as TableName];
      await targetTable.delete(Number(id));
      success(`${name.slice(0, -1)} deleted successfully`);
      setSelected((prev) => ({
        ...prev,
        [name.toLowerCase() as TableName]: "",
      }));
    } catch (err) {
      error(`Failed to delete ${name.slice(0, -1).toLowerCase()}`);
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleClearTable = async () => {
    setShowClearModal(true);
  };

  const confirmClearTable = async () => {
    setIsLoading(true);
    try {
      const targetTable = dbMap[name.toLowerCase() as TableName];
      await targetTable.clear();
      success(`All ${name.toLowerCase()} cleared successfully`);
    } catch (err) {
      error(`Failed to clear ${name.toLowerCase()}`);
    } finally {
      setIsLoading(false);
      setShowClearModal(false);
    }
  };
  return (
    <div className="bg-default rounded-2xl p-4 sm:p-5 lg:p-6 shadow space-y-3">
      <h2 className="text-base sm:text-lg font-semibold text-primary">
        {name}
      </h2>
      <p className="text-xs sm:text-sm text-muted">
        Total: {data.length}
      </p>

      <select
        className="w-full bg-card text-primary focus:ring-2 focus:ring-primary rounded-xl p-2 text-sm transition"
        onChange={(e) =>
          setSelected((prev) => ({
            ...prev,
            [name.toLowerCase() as TableName]: e.target.value,
          }))
        }
      >
        <option value="">Select one to delete</option>
        {data.map((item: any) => (
          <option key={item.id} value={item.id}>
            {item.title ?? item.name ?? `#${item.id}`}
          </option>
        ))}
      </select>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm pt-2">
        <button
          onClick={() => handleDelete(selected[name.toLowerCase() as TableName])}
          className="px-3 py-1.5 text-red-500 dark:text-red-600 hover:underline cursor-pointer whitespace-nowrap"
        >
          Delete Selected
        </button>
        <button
          onClick={() => handleClearTable()}
          className="px-3 py-1.5 text-red-500 dark:text-red-600 hover:underline cursor-pointer whitespace-nowrap"
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
