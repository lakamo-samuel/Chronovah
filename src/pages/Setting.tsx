import DangerZone from "../features/settings/DangerZone";
import IndividualDataManagement from "../features/settings/IndividualDataManagement";
import CommonPageHeader from "../components/CommonPageHeader";
import AppearanceStorage from "../features/settings/AppearanceStorage";
import BackupRestore from "../features/settings/BackupRestore";

export default function Settings() {
  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto my-20">
      <CommonPageHeader heading="Setting" />
      <AppearanceStorage />
      <BackupRestore />
      <IndividualDataManagement />
      <DangerZone />
    </div>
  );
}
