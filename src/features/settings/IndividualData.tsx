/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

type TableName = "people" | "places" | "notes" | "journals";
type Props = {
  name: string,
  data: any[],
  dbMap: Record<TableName, any> 
}
function IndividualData({ name, data,dbMap }:Props) {

   const [selected, setSelected] = useState<
     Record<TableName, string | number | "">
   >({
     people: "", 
     places: "",
     notes: "",
     journals: "",
   });
  
    const handleDelete = async (table: TableName, id: string | number) => {
      if (!id) return alert("Please select an item first.");
      if (!confirm("Delete this item permanently?")) return;

      const targetTable = dbMap[table];
      await targetTable.delete(id as string | number);
  };
  

    const handleClearTable = async (table: TableName) => {
      if (!confirm(`Clear all ${table}? This cannot be undone.`)) return;
      const targetTable = dbMap[table];
      await targetTable.clear();
    };
  return (
         <div
          className="bg-white dark:bg-[#0B1120] rounded-2xl p-5 shadow space-y-3"
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total: {data.length}
          </p>

          <select
            className="w-full bg-white dark:bg-[#1E293B] text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 rounded-xl p-2 transition"
            onChange={(e) =>
              setSelected((prev) => ({
                ...prev,
                [name.toLowerCase() as TableName]: e.target.value,
              }))
            }
          >
            <option value="">Select one to delete</option>
            {data.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.title ?? item.name ?? `#${item.id}`}
              </option>
            ))}
          </select>

          <div className="flex gap-4 text-sm pt-2">
            <button
          onClick={() => {
            handleDelete(
              name.toLowerCase() as TableName,
              selected[name.toLowerCase() as TableName]);
             
              }
                
                
              }
              className="text-red-500 dark:text-red-600 hover:underline cursor-pointer"
            >
              Delete Selected
            </button>
            <button
              onClick={() => handleClearTable(name.toLowerCase() as TableName)}
              className="text-red-500 dark:text-red-600 hover:underline cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </div>
  );
}

export default IndividualData;