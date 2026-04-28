import React, { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { db } from '../../database/db';
import { useLiveQuery } from 'dexie-react-hooks';
import LockedSection from '../LockedSection';

interface PlanGuardProps {
  section: 'journal' | 'people' | 'places';
  children: ReactNode;
}

const PlanGuard: React.FC<PlanGuardProps> = ({ section, children }) => {
  const { user } = useAuth();
  const { isProActive } = useSubscriptionStore();

  // Free limits
  const limits = { journal: 20, people: 12, places: 15 };

  // Get count based on section
  const count = useLiveQuery(async () => {
    if (!user) return 0;
    if (section === 'journal') {
      return await db.journal.where('userId').equals(user.id).count();
    } else if (section === 'people') {
      return await db.people.where('userId').equals(user.id).count();
    } else if (section === 'places') {
      return await db.places.where('userId').equals(user.id).count();
    }
    return 0;
  }, [user?.id, section]) ?? 0;

  // Check if user has exceeded free limit
  const isOverLimit = count > limits[section];

  // Show lock screen if free AND over limit
  if (!isProActive && isOverLimit) {
    return <LockedSection section={section} />;
  }

  return <>{children}</>;
};

export default PlanGuard;
