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

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-xl shadow-sm p-5 md:p-6 flex justify-between flex-col sm:flex-row items-start sm:items-center gap-4 border border-default"
      aria-label="Dashboard header"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center text-base font-bold flex-shrink-0 shadow-sm">
          {initials}
        </div>

        {/* Text */}
        <div>
          <h2 className="text-lg font-semibold text-primary leading-snug">
            {greeting()}, {name || "there"}
          </h2>
          <p className="text-sm text-muted mt-0.5">{email}</p>
        </div>
      </div>

      <SettingLinkBtn to="/settings" icon={<Settings2 size={16} />}>
        Settings
      </SettingLinkBtn>
    </motion.section>
  );
}

export default DashHeader;
