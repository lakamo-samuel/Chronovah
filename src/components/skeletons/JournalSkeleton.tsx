// Skeleton for the Journal page — mirrors JournalStats + JournalCard layout
import { Skeleton } from './SkeletonBase';

function JournalStatSkeleton() {
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

function JournalCardSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="bg-card rounded-xl border border-default overflow-hidden flex flex-col">
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
        <div className="flex justify-end gap-2 p-3 border-t border-default">
          <Skeleton className="h-8 w-16 rounded-lg" />
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-default overflow-hidden flex flex-col h-full">
      <div className="p-4 sm:p-5 flex-1 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="flex gap-1.5 mt-2">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
      <div className="flex justify-end gap-2 p-3 sm:p-4 border-t border-default">
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  );
}

interface JournalSkeletonProps {
  viewMode?: 'grid' | 'list';
  count?: number;
}

export default function JournalSkeleton({ viewMode = 'grid', count = 8 }: JournalSkeletonProps) {
  return (
    <div aria-busy="true" aria-label="Loading journal entries">
      {/* Stats */}
      <div className="overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 min-w-max sm:min-w-0">
          {Array.from({ length: 4 }).map((_, i) => (
            <JournalStatSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Search + view controls */}
      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-12 flex-1 rounded-xl" />
        <Skeleton className="h-12 w-24 rounded-lg self-end sm:self-auto" />
      </div>

      {/* Results count */}
      <Skeleton className="h-3 w-24 mt-3" />

      {/* Cards */}
      <div
        className={`mt-4 sm:mt-6 ${
          viewMode === 'grid'
            ? 'grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'
            : 'space-y-3'
        }`}
      >
        {Array.from({ length: count }).map((_, i) => (
          <JournalCardSkeleton key={i} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
}
