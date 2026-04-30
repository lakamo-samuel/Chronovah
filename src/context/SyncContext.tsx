// context/SyncContext.tsx
import { useEffect, useState, type ReactNode } from 'react';
import { syncManager, type SyncStatus } from '../lib/sync';
import { SyncContext } from '../hooks/useSyncStatus';

export const SyncProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<SyncStatus>('synced');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  useEffect(() => {
    const updateStatus = () => {
      setStatus(syncManager.getStatus());
      const synced = syncManager.getLastSyncedAt();
      if (synced) setLastSyncedAt(synced);
    };

    // Update status periodically
    const interval = setInterval(updateStatus, 1000);

    // Listen for online/offline
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  return (
    <SyncContext.Provider value={{ status, lastSyncedAt }}>
      {children}
    </SyncContext.Provider>
  );
};
