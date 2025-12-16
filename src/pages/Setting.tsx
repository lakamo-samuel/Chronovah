import { db as peopleDB } from "../Database/peopleDB";
import { db as placeDB } from "../Database/placesDB";
import { db as journalDB } from "../Database/journalDB";
import { db as noteDB } from "../Database/db";
import DangerZone from "../features/settings/DangerZone";
import IndividualDataManagement from "../features/settings/IndividualDataManagement";
import CommonPageHeader from "../components/CommonPageHeader";
import AppearanceStorage from "../features/settings/AppearanceStorage";
import BackupRestore from "../features/settings/BackupRestore";

export default function Settings() {
  const handleClearAll = async () => {
    if (!confirm("This will remove ALL data permanently. Continue?")) return;
    await Promise.all([
      peopleDB.people.clear(),
      placeDB.places?.clear(),
      noteDB.notes?.clear(),
      journalDB.journal?.clear(),
    ]);
    alert("All data cleared successfully.");
  };
  return (
    <div className="p-6 space-y-8  my-20">
      <CommonPageHeader heading="Setting" isSetting={true} />
      <AppearanceStorage />
      <BackupRestore />

      <IndividualDataManagement />
      <DangerZone onClick={handleClearAll}>Clear all data</DangerZone>
    </div>
  );
}
