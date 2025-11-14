import { Search, X } from "lucide-react";
import { useSearch } from "../hooks/useSearch";
interface SearchProps {
  onClose: () => void;
}

function SearchInput({ onClose }: SearchProps) {
  const { query, setQuery } = useSearch();
  return (
    <>
      <div className="flex items-center relative  sm:hidden rounded-xl px-4 py-3 dark:border-white/10">
        <Search
          size={18}
          className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anything..."
          className="w-full bg-gray-100 dark:bg-[#1E293B] text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100"
        />
        <X onClick={onClose} className="w-5 h-5 absolute right-6 text-gray-400 cursor-pointer" />
      </div>
    </>
  );
}

export default SearchInput;
