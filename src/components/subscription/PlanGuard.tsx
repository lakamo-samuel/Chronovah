import React, { ReactNode } from 'react';
import { useSubscriptionStore } from '../store/subscriptionStore';
import LockedSection from './subscription/LockedSection';

interface PlanGuardProps {
  section: 'journal' | 'people' | 'places';
  children: ReactNode;
}

const PlanGuard: React.FC<PlanGuardProps> = ({ section, children }) => {
  const { isProActive } = useSubscriptionStore();

  if (!isProActive) {
    return <LockedSection section={section} />;
  }

  return <>{children}</>;
};

export default PlanGuard;
