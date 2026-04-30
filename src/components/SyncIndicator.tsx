// components/SyncIndicator.tsx
import { useSyncStatus } from '../hooks/useSyncStatus';

function formatLastSynced(date: Date | null): string {
  if (!date) return '';
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins === 1) return '1 min ago';
  if (diffMins < 60) return `${diffMins} mins ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return '1 hr ago';
  return `${diffHours} hrs ago`;
}

export default function SyncIndicator() {
  const { status, lastSyncedAt } = useSyncStatus();

  if (status === 'synced' && !lastSyncedAt) return null;

  const config = {
    offline: {
      dot: 'bg-amber-400',
      text: 'Working offline',
      pulse: false,
    },
    syncing: {
      dot: 'bg-primary-500',
      text: 'Syncing…',
      pulse: true,
    },
    synced: {
      dot: 'bg-green-500',
      text: lastSyncedAt ? `Synced ${formatLastSynced(lastSyncedAt)}` : 'All changes saved',
      pulse: false,
    },
    error: {
      dot: 'bg-red-500',
      text: 'Sync failed. Retrying…',
      pulse: true,
    },
  } as const;

  const { dot, text, pulse } = config[status];

  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs text-muted select-none"
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot} ${
          pulse ? 'animate-[sync-pulse_1.4s_ease-in-out_infinite]' : ''
        }`}
      />
      <span className="hidden sm:inline whitespace-nowrap">{text}</span>
    </div>
  );
}
