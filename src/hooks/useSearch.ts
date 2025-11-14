import { createContext, useContext } from "react";
interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  openSearch: boolean;
  setOpenSearch: (open: boolean) => void;
}
export const SearchContext = createContext<SearchContextType | undefined>(
  undefined
);
export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined)
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  return context;
}
