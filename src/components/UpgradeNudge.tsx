import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Zap } from 'lucide-react';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useAuth } from '../hooks/useAuth';
import { db } from '../database/db';
import { useLiveQuery } from 'dexie-react-hooks';

const UpgradeNudge: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isProActive } = useSubscriptionStore();
  const [dismissed, setDismissed] = useState(false);

  // Get real counts from Dexie
  const journalCount = useLiveQuery(
    async () => (user ? (await db.journal.where('userId').equals(user.id).count()) : 0),
    [user?.id]
  ) ?? 0;

  const peopleCount = useLiveQuery(
    async () => (user ? (await db.people.where('userId').equals(user.id).count()) : 0),
    [user?.id]
  ) ?? 0;

  const placesCount = useLiveQuery(
    async () => (user ? (await db.places.where('userId').equals(user.id).count()) : 0),
    [user?.id]
  ) ?? 0;

  // Check if dismissed in this session
  useEffect(() => {
    const isDismissed = sessionStorage.getItem(`upgrade-nudge-dismissed-${user?.id}`) === 'true';
    setDismissed(isDismissed);
  }, [user?.id]);

  // Free limits
  const limits = { journal: 20, people: 12, places: 15 };
  const isJournalLocked = journalCount > limits.journal;
  const isPeopleLocked = peopleCount > limits.people;
  const isPlacesLocked = placesCount > limits.places;
  const anyLocked = isJournalLocked || isPeopleLocked || isPlacesLocked;

  // Don't show if pro, dismissed, or no content over limits
  if (isProActive || dismissed || !anyLocked) {
    return null;
  }

  const handleDismiss = () => {
    sessionStorage.setItem(`upgrade-nudge-dismissed-${user?.id}`, 'true');
    setDismissed(true);
  };

  // Build message showing what's over limit
  const overLimitItems = [];
  if (isJournalLocked) overLimitItems.push(`${journalCount - limits.journal} extra journal ${journalCount - limits.journal === 1 ? 'entry' : 'entries'}`);
  if (isPeopleLocked) overLimitItems.push(`${peopleCount - limits.people} extra ${peopleCount - limits.people === 1 ? 'person' : 'people'}`);
  if (isPlacesLocked) overLimitItems.push(`${placesCount - limits.places} extra ${placesCount - limits.places === 1 ? 'place' : 'places'}`);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 p-4 md:p-6 border-t-2"
      style={{
        backgroundColor: 'var(--color-card)',
        borderColor: 'var(--color-primary)',
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Content */}
        <div className="flex-1 flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'var(--color-bg)', border: '2px solid var(--color-primary)' }}
          >
            <Zap className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
          </div>

          <div className="flex-1">
            <p className="font-bold" style={{ color: 'var(--color-text)' }}>
              You've reached your free limit
            </p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              {overLimitItems.join(', ')} waiting to unlock. Upgrade to Pro for unlimited.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => navigate('/upgrade')}
            className="px-4 py-2 bg-primary-600 text-white font-bold rounded-lg hover:shadow-lg transition-all whitespace-nowrap text-sm"
          >
            Upgrade Now
          </button>

          <button
            onClick={handleDismiss}
            className="p-2 hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeNudge;
