import { DataTableSkeleton } from '@/app/components'
import { AddButtonAndModalLocation } from '@/app/dashboard/location-management/components/AddButtonAndModalLocation.component'
import { getQueryClient } from '@/app/providers/GetQueryClient'
import { getLocations } from '@/modules/location/application/actions/location.action'
import { QUERY_KEYS_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'
import { ListLocations } from './components/ListLocations.component'

export default async function SedesManagementPage (props: {
  searchParams?: Promise<{
    pageIndex?: string;
    pageSize?: string;
  }>;
}) {
  const searchParams = await props.searchParams
  const pageIndex = Number(searchParams?.pageIndex) || 1
  const pageSize = Number(searchParams?.pageSize) || 10

  const queryClient = getQueryClient()
  queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS_LOCATION_MANAGEMENT.LMListLocations, pageIndex, pageSize],
    queryFn: () => getLocations({ pageIndex, pageSize })
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-app-quaternary mb-2">
              Gestionar sedes
            </h1>
            <p className="text-app-primary">
              Gestiona la información y las preferencias de las sedes de tu
              negocio
            </p>
          </div>
          <div className="flex space-x-2">
            <AddButtonAndModalLocation />
          </div>
        </div>

        {/* Location Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Suspense key={pageIndex + pageSize} fallback={<DataTableSkeleton columnCount={6} />}>
            <ListLocations pageIndex={pageIndex} pageSize={pageSize} />
          </Suspense>

        </div>
      </main>
    </HydrationBoundary>
  )
}
