// Skeleton for the Notes page — mirrors NoteStats + NoteCard (grid) layout
import { Skeleton } from './SkeletonBase';

function NoteStatSkeleton() {
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

function NoteCardSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-default">
        <div className="w-1 h-12 rounded-r-full skeleton flex-shrink-0" />
        <div className="flex-1 min-w-0 pl-3 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <div className="flex gap-3 pt-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-7 w-7 rounded-lg" />
          <Skeleton className="h-7 w-7 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-default p-5 space-y-3">
      <div className="flex items-start justify-between pl-4">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-1 ml-2">
          <Skeleton className="h-7 w-7 rounded-lg" />
          <Skeleton className="h-7 w-7 rounded-lg" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-4/6" />
      <Skeleton className="h-3 w-3/6" />
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}

interface NotesSkeletonProps {
  viewMode?: 'grid' | 'list';
  count?: number;
}

export default function NotesSkeleton({ viewMode = 'grid', count = 8 }: NotesSkeletonProps) {
  return (
    <div aria-busy="true" aria-label="Loading notes">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <NoteStatSkeleton key={i} />
        ))}
      </div>

      {/* Search bar placeholder */}
      <div className="mt-6 flex gap-3">
        <Skeleton className="h-12 flex-1 rounded-xl" />
        <Skeleton className="h-12 w-20 rounded-lg" />
        <Skeleton className="h-12 w-32 rounded-xl" />
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
          <NoteCardSkeleton key={i} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
}
