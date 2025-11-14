import { useState,type ReactNode } from "react";
import { SearchContext } from "../hooks/useSearch";




export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
    const [openSearch, setOpenSearch] = useState(false);
  return <SearchContext.Provider value={{query,setQuery,openSearch,setOpenSearch}}>{children}</SearchContext.Provider>;
}
