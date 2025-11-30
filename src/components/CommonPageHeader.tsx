import { UserPen } from "lucide-react";
import SettingLinkBtn from "../ui/SettingLinkBtn";

type Heading = {
  heading: string,
  isSetting: boolean,
}

function CommonPageHeader({ heading,isSetting = false, }: Heading) {
     const todaysDate = new Date().toLocaleDateString(undefined, {
       weekday: "long",
       year: "numeric",
       month: "short",
       day: "numeric",
     });
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        {heading}
      </h2>
      {!isSetting ? <span className="text-sm text-gray-500 dark:text-gray-400">
        {todaysDate}
      </span> : <SettingLinkBtn to="profile" icon={<UserPen/>} >ProfileSetting</SettingLinkBtn>}
      
    </div>
  );
}

export default CommonPageHeader;