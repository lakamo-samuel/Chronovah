import { createContext, useContext } from "react";
import type { SyncStatus } from "../lib/sync";
interface SyncContextType {
  status: SyncStatus;
}

export const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const useSyncStatus = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error("useSyncStatus must be used within SyncProvider");
  }
  return context;
};
