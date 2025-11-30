import { Trash2 } from "lucide-react";

import type { ReactNode } from "react";
interface Prop{
  onClick: () => void;
  children: ReactNode,

}
function DangerZone({onClick,children}: Prop) {
     

  return (
    <div className="bg-red-50 dark:bg-red-950 dark:border rounded-2xl p-5 shadow space-y-3">
      <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        This action in irrevesible. Please proceed with caution.
      </p>

      <div className="flex justify-end">
        <button
          onClick={onClick}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl flex items-center gap-2 transition"
        >
          <Trash2 size={16} /> {children}
        </button>
      </div>
    </div>
  );
}

export default DangerZone;