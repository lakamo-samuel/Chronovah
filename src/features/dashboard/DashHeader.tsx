import { motion } from "framer-motion";

import { Settings2 } from "lucide-react";

import SettingLinkBtn from "../../ui/SettingLinkBtn";
import { useAuth } from "../../hooks/useAuth";

function DashHeader() {
  const { user } = useAuth();
  const { email, name } = user || {};

  const initials = (name || "User")
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-[#0B1120] rounded-xl shadow-sm p-6 md:p-8 flex justify-between flex-col md:flex-row items-center gap-6 border border-gray-100 dark:border-gray-950"
      aria-label="Dashboard Header"
    >
      <div className=" flex flex-col md:flex-row items-center gap-6 ">
        <div className="relative">
          {/* {profileImg ? (
            <img
              src={profileImg}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border shadow-sm"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full bg-linear-to-tr from-blue-600 to-blue-500 text-white 
            flex items-center justify-center text-xl font-bold shadow-sm"
            >
              {initials}
            </div>
          )} */}

          <div
            className="w-16 h-16 rounded-full bg-linear-to-tr from-blue-600 to-blue-500 text-white 
            flex items-center justify-center text-xl font-bold shadow-sm"
          >
            {initials}
          </div>
        </div>

        {/* Text Block */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Welcome back, {name || "User"} 👋
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {email || "No email on file."}
          </p>

          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
            Here’s your dashboard summary for today.
          </p>
        </div>
      </div>
      <div>
        <SettingLinkBtn to="/settings" icon={<Settings2 size={18} />}>
          Manage Account
        </SettingLinkBtn>
      </div>
    </motion.section>
  );
}

export default DashHeader;
