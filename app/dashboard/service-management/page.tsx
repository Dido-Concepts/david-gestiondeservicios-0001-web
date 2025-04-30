import DynamicTable from '@/app/components/list/DynamicList.component'
import AddButtonService from '@/app/dashboard/service-management/components/AddButtonService.component'
import { getQueryClient } from '@/app/providers/GetQueryClient'
import { getLocationsCatalog } from '@/modules/location/application/actions/location.action'
import { getCategories } from '@/modules/service/application/actions/category.action'
import { QUERY_KEYS_LOCATION_MANAGEMENT, QUERY_KEYS_SERVICE_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { FilterSede } from '@/app/dashboard/service-management/components/FilterSede.component'
import { Suspense } from 'react'
import { DataTableSkeleton } from '@/app/components'
import { ModalCategoryFrom } from '@/app/dashboard/service-management/components/ModalCategoryFrom.component'

export default async function Page (props: {
  searchParams?: Promise<{
    locationFilter?: string;
  }>;
}) {
  const searchParams = await props.searchParams
  const locationFilter = searchParams?.locationFilter || '0'

  const queryClient = getQueryClient()
  queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS_SERVICE_MANAGEMENT.SMListServices, locationFilter],
    queryFn: () => getCategories({ location: locationFilter })
  })

  queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS_LOCATION_MANAGEMENT.LMGetLocationCatalog],
    queryFn: () => getLocationsCatalog()
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>

      <main className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-app-quaternary mb-2">
              Gestionar categorías y servicios
            </h1>
            <p className="text-app-primary">
              Añade, edita o elimina las categorías y los servicios de su negocio
            </p>
          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 px-8">
          <div className="flex space-x-2">
            <Suspense key={locationFilter} fallback={<span>Cargando...</span>}>
              <FilterSede />
            </Suspense>

          </div>
          <div className="flex space-x-2">

            <AddButtonService />

          </div>
        </div>
        <Suspense key={locationFilter} fallback={<DataTableSkeleton columnCount={6} />}>
          <DynamicTable locationFilter={locationFilter} />
        </Suspense>
      </main>

      <ModalCategoryFrom />

    </HydrationBoundary>
  )
}
