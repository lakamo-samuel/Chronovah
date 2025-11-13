import CommonPageHeader from "../../components/CommonPageHeader";

function DashHeader() {
  return (
    <div>
      <CommonPageHeader heading="Dashboard" />
      <p className="text-gray-600 dark:text-gray-400 text-sm -mt-5">
        Overview of your saved memories and progress
      </p>
    </div>
  );
}

export default DashHeader;