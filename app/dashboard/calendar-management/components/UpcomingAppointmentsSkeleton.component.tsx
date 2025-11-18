import { Skeleton } from '@/components/ui/skeleton'

export const UpcomingAppointmentsSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="p-3 rounded-lg border border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-1" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-1" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
          <Skeleton className="w-3 h-3 rounded-full flex-shrink-0 mt-1" />
        </div>
      </div>
    ))}
  </div>
)
