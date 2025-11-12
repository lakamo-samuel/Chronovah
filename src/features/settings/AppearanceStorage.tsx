import { useDarkMode } from "../../hooks/useDarkMode";
import { Database, Moon, Sun } from "lucide-react";

import { useStorage } from "../../hooks/useStorage";
import  ProgressInput  from "./ProgressInput";

export default function AppearanceStorage() {
  const { toggleDarkMode, isDarkMode } = useDarkMode();
  const { storageUsed,usedValue,max } = useStorage();
  return (
    <div className="bg-white dark:bg-[#0B1120] mb-4 rounded-2xl p-5 shadow space-y-4">
      <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-100">
        Appearance & Storage
      </h2>

      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-300">
          Theme: {isDarkMode ? "Dark" : "Light"}
        </span>
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1E293B] text-gray-800 dark:text-gray-100 border border-blue-500 rounded-2xl focus:ring-2 focus:ring-blue-500"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          Toggle Theme
        </button>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <Database size={16} />
          <span>Storage Used</span>
        </div>
        <span>{storageUsed}</span>
          </div>
          <div>
              <ProgressInput min={0} max={max} value={usedValue} onChange={() => {}} />
          </div>
    </div>
  );
}


