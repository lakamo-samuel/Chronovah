import DangerZone from "../features/settings/DangerZone";
import IndividualDataManagement from "../features/settings/IndividualDataManagement";
import CommonPageHeader from "../components/CommonPageHeader";
import AppearanceStorage from "../features/settings/AppearanceStorage";
import BackupRestore from "../features/settings/BackupRestore";
import ConfirmationModal from "../components/ConfirmationModal";
import { useToast } from "../hooks/useToast";
import { useState } from "react";
import { db } from "../database/db";
import { useAuth } from "../hooks/useAuth";

/**
 * Render the settings page with sections for appearance, backup/restore, individual data management, and a danger-zone control to clear all user data.
 *
 * The component opens a confirmation modal when the user requests to clear data. When confirmed, it deletes all records scoped to the authenticated user (people, places, notes, journal) and shows success or error toasts; it also manages modal visibility and loading state during the operation.
 *
 * @returns The Settings page React element.
 */
export default function Settings() {
  const { success, error } = useToast();
  const { user } = useAuth();
  const [showClearModal, setShowClearModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleClearAll = async () => {
    setShowClearModal(true);
  };

  const confirmClearAll = async () => {
    if (!user?.id) {
      error("User not authenticated");
      return;
    }

    setIsClearing(true);
    try {
      await Promise.all([
        db.people.where("userId").equals(user.id).delete(),
        db.places.where("userId").equals(user.id).delete(),
        db.notes.where("userId").equals(user.id).delete(),
        db.journal.where("userId").equals(user.id).delete(),
      ]);
      success("All data cleared successfully.");
    } catch (err) {
      error("Failed to clear data. Please try again.");
    } finally {
      setIsClearing(false);
      setShowClearModal(false);
    }
  };
  return (
    <div className="p-6 space-y-8  my-20">
      <CommonPageHeader heading="Setting" isSetting={true} />
      <AppearanceStorage />
      <BackupRestore />

      <IndividualDataManagement />
      <DangerZone onClick={handleClearAll}>Clear all data</DangerZone>

      <ConfirmationModal
        isOpen={showClearModal}
        title="Clear All Data"
        message="This will remove ALL data permanently. This action cannot be undone. Continue?"
        confirmText="Clear All Data"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={confirmClearAll}
        onCancel={() => setShowClearModal(false)}
        isLoading={isClearing}
      />
    </div>
  );
}
