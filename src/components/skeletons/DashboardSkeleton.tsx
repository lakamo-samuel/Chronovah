// Skeleton for the Dashboard page — mirrors DashStat + RecentActivities + Section layout
import { Skeleton } from './SkeletonBase';

function StatCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-card border border-default shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-7 w-10 mt-1" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
    </div>
  );
}

function ActivityRowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-1">
      <Skeleton className="h-4 w-4 rounded-full flex-shrink-0" />
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-3 w-16 ml-auto" />
    </div>
  );
}

function SectionCardSkeleton() {
  return (
    <div className="bg-card border border-default p-4 rounded-xl shadow-sm w-full">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="p-6 mt-15 mb-15 space-y-8" aria-busy="true" aria-label="Loading dashboard">
      {/* DashHeader placeholder */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* DashStat — 4 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Recent Activity */}
      <div>
        <Skeleton className="h-5 w-36 mb-3" />
        <div className="bg-card border border-default rounded-xl p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <ActivityRowSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Recent sections — Notes, People, Places, Journals */}
      {['Recent Notes', 'Recent People', 'Recent Places', 'Recent Journals'].map((title) => (
        <div key={title} className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-4 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SectionCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
