import { Search } from "lucide-react";
import { useSearch } from "../hooks/useSearch";

function DesktopSearchInput() {
    const { query, setQuery, setOpenSearch } = useSearch();
  return (
    <div className="relative hidden sm:block w-[250px] md:w-[350px]">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={query}
              onChange={(e) => { setQuery(e.target.value); setOpenSearch(true); }}
        placeholder="Search anything..."
        className="w-full bg-gray-100 dark:bg-[#1E293B] text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100"
      />
    </div>
  );
}

export default DesktopSearchInput;