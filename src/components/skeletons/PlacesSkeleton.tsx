// Skeleton for the Places page — mirrors PlaceStats + PlaceCard layout
import { Skeleton } from './SkeletonBase';

function PlaceStatSkeleton() {
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

function PlaceCardSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="bg-card rounded-xl border border-default overflow-hidden flex gap-4">
        <Skeleton className="h-24 w-24 rounded-none flex-shrink-0" />
        <div className="flex-1 p-3 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-default overflow-hidden">
      {/* Image area */}
      <Skeleton className="h-48 w-full rounded-none" />
      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <Skeleton className="h-5 w-3/4 mb-1" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="flex gap-1">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
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

interface PlacesSkeletonProps {
  viewMode?: 'grid' | 'list';
  count?: number;
}

export default function PlacesSkeleton({ viewMode = 'grid', count = 8 }: PlacesSkeletonProps) {
  return (
    <div aria-busy="true" aria-label="Loading places">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <PlaceStatSkeleton key={i} />
        ))}
      </div>

      {/* Search + controls */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-12 flex-1 rounded-xl" />
        <div className="flex gap-2">
          <Skeleton className="h-12 w-36 rounded-xl" />
          <Skeleton className="h-12 w-20 rounded-lg" />
        </div>
      </div>

      {/* Results count */}
      <Skeleton className="h-3 w-24 mt-4" />

      {/* Cards */}
      <div
        className={`mt-6 ${
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            : 'space-y-3'
        }`}
      >
        {Array.from({ length: count }).map((_, i) => (
          <PlaceCardSkeleton key={i} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
}
