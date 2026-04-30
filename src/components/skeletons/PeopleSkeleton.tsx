// Skeleton for the People page — mirrors PeopleStats + PersonCard layout
import { Skeleton } from './SkeletonBase';

function PeopleStatSkeleton() {
  return (
    <div className="bg-card border border-default rounded-xl p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-lg flex-shrink-0" />
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-10" />
        </div>
      </div>
    </div>
  );
}

function PersonCardSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="bg-card rounded-xl border border-default overflow-hidden flex items-center gap-3 p-3">
        <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
        <div className="flex-1 min-w-0 space-y-1.5">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
          <div className="flex gap-2 pt-0.5">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-3 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full flex-shrink-0" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-default overflow-hidden flex flex-col h-full">
      {/* Image area — matches new h-48 PersonCard */}
      <Skeleton className="h-48 w-full rounded-none" />
      {/* Content */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="flex gap-1">
          <Skeleton className="h-5 w-10 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-default">
          <div className="flex gap-2">
            <Skeleton className="h-7 w-7 rounded-lg" />
            <Skeleton className="h-7 w-7 rounded-lg" />
          </div>
          <div className="flex gap-1">
            <Skeleton className="h-7 w-7 rounded-lg" />
            <Skeleton className="h-7 w-7 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface PeopleSkeletonProps {
  viewMode?: 'grid' | 'list';
  count?: number;
}

export default function PeopleSkeleton({ viewMode = 'grid', count = 8 }: PeopleSkeletonProps) {
  return (
    <div aria-busy="true" aria-label="Loading people">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <PeopleStatSkeleton key={i} />
        ))}
      </div>

      {/* Search + view controls */}
      <div className="flex flex-col gap-2 mb-4">
        <Skeleton className="h-10 w-full rounded-lg" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-9 w-20 rounded-lg" />
        </div>
      </div>

      {/* Cards */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            : 'space-y-2'
        }
      >
        {Array.from({ length: count }).map((_, i) => (
          <PersonCardSkeleton key={i} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
}
