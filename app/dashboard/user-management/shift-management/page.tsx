import ShiftManagementContainer from '@/app/dashboard/user-management/components/ShiftManagementContainer.component'
import { getQueryClient } from '@/app/providers/GetQueryClient'
import { getLocationsCatalog, getLocationById } from '@/modules/location/application/actions/location.action'
import { getUserLocationEvents } from '@/modules/user-location/application/user-location-action'
import { QUERY_KEYS_LOCATION_MANAGEMENT, QUERY_KEYS_USER_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Suspense } from 'react'
import { FilterSede } from '@/app/dashboard/service-management/components/FilterSede.component'
import { format, addDays, startOfWeek } from 'date-fns'

export default async function ShiftManagementPage (props: {
  searchParams?: Promise<{
    locationFilter?: string;
  }>;
}) {
  const searchParams = await props.searchParams
  const queryClient = getQueryClient()

  // Calcular fechas para la semana actual
  const start = startOfWeek(new Date(), { weekStartsOn: 1 })
  const startDate = format(start, 'yyyy-MM-dd')
  const endDate = format(addDays(start, 6), 'yyyy-MM-dd')

  // Prefetch datos de ubicaciones primero
  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS_LOCATION_MANAGEMENT.LMGetLocationCatalog],
    queryFn: () => getLocationsCatalog()
  })

  // Obtener las ubicaciones para determinar un locationFilter válido
  const locations = await getLocationsCatalog()
  const locationFilter = searchParams?.locationFilter || (locations.length > 0 ? locations[0].id.toString() : null)

  // Solo hacer prefetch si hay un locationFilter válido
  if (locationFilter) {
    // Verificar que la ubicación existe en la lista de ubicaciones disponibles
    const locationExists = locations.some(location => location.id.toString() === locationFilter)

    if (locationExists) {
      // Prefetch eventos de usuarios para la sede seleccionada
      queryClient.prefetchQuery({
        queryKey: [QUERY_KEYS_USER_LOCATION_MANAGEMENT.ULMGetUserLocationEvents, locationFilter, startDate, endDate],
        queryFn: () => getUserLocationEvents({ sedeId: locationFilter, startDate, endDate })
      })

      // Prefetch información de la sede
      queryClient.prefetchQuery({
        queryKey: [QUERY_KEYS_LOCATION_MANAGEMENT.LMGetLocation, locationFilter],
        queryFn: () => getLocationById(locationFilter)
      })
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-app-quaternary mb-2">Gestionar turnos</h1>
        </div>
        <Suspense
          key={locationFilter}
          fallback={
            <div className="flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              <p className="text-base text-muted-foreground font-semibold shrink-0">Sede</p>
              <div className="w-full sm:w-[180px] lg:w-[200px] h-9 bg-muted rounded-md animate-pulse" />
            </div>
          }
        >
          <FilterSede />
        </Suspense>
      </div>

      {/* Contenedor que maneja la selección de semana y la tabla */}
      <ShiftManagementContainer />
    </HydrationBoundary>
  )
}
//
