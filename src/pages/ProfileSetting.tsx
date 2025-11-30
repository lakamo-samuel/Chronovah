import {  useEffect } from "react";

import { useUser } from "../hooks/useUser";

import { ProfileEditor } from "../features/profileSetting/ProfileEdition";
import { useDetailsSettings } from "../services/SettingApiCall";
import PersonalInfo from "../features/profileSetting/PersonalInfo";
import PasswordSetting from "../features/profileSetting/PasswordSetting";
import GoBackLink from "../ui/GoBackLink";
import DangerZone from "../features/settings/DangerZone";

function ProfileSetting() {
  const [user] = useUser();

  const { info } = user;
  const { profileImg, setProfileImg } = useDetailsSettings();

  useEffect(() => {
    setProfileImg(info.profileImg);
  }, [setProfileImg, info.profileImg]);
  const handleDeleteAccount = () => {
  console.log("accountDeleted");
}
  return (
    <div className="w-full space-y-8 max-w-2xl mx-auto mt-5 px-4 py-10 mb-10">
      <div className="flex flex-col gap-2 mb-7">
        <div>
          <GoBackLink />
        </div>

        <div className="text-2xl font-semibold  -mt-4">Profile Setting</div>
      </div>
      <ProfileEditor setProfileImg={setProfileImg} profileImg={profileImg} />

      <PersonalInfo />

      <PasswordSetting />
      <DangerZone onClick={handleDeleteAccount}>Delete Account</DangerZone>
    </div>
  );
}
export default ProfileSetting;
