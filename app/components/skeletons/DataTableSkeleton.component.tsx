import { Skeleton } from '@/components/ui/skeleton'

interface TableSkeletonProps {
  columnCount: number;
  rowCount?: number;
}

export function DataTableSkeleton ({ columnCount, rowCount = 5 }: TableSkeletonProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            {Array.from({ length: columnCount }).map((_, colIndex) => (
              <th key={colIndex} className="px-4 py-2">
                <Skeleton className="h-6 w-full" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-t">
              {Array.from({ length: columnCount }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-2">
                  <Skeleton className="h-6 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
