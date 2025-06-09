import ShiftManagementContainer from '@/app/dashboard/user-management/components/ShiftManagementContainer.component'
import { getQueryClient } from '@/app/providers/GetQueryClient'
import { getLocationsCatalog } from '@/modules/location/application/actions/location.action'
import { QUERY_KEYS_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Suspense } from 'react'
import { FilterSede } from '@/app/dashboard/service-management/components/FilterSede.component'

export default async function ShiftManagementPage (props: {
  searchParams?: Promise<{
    locationFilter?: string;
  }>;
}) {
  const searchParams = await props.searchParams
  const locationFilter = searchParams?.locationFilter || '0'

  const queryClient = getQueryClient()
  queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS_LOCATION_MANAGEMENT.LMGetLocationCatalog],
    queryFn: () => getLocationsCatalog()
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-app-quaternary mb-2">Gestionar turnos</h1>
        </div>
        <Suspense key={locationFilter} fallback={<span>Cargando...</span>}>
              <FilterSede />
        </Suspense>

      </div>

      {/* Contenedor que maneja la selección de semana y la tabla */}
      <ShiftManagementContainer />
    </HydrationBoundary>
  )
}
