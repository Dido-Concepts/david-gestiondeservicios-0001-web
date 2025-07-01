import Calendar from '@/app/dashboard/calendar-management/components/Calendar.component'
import { getQueryClient } from '@/app/providers/GetQueryClient'
import { getLocationsCatalog } from '@/modules/location/application/actions/location.action'
import { QUERY_KEYS_CALENDAR_MANAGEMENT, QUERY_KEYS_LOCATION_MANAGEMENT, QUERY_KEYS_CUSTOMER_MANAGEMENT, QUERY_KEYS_SERVICE_MANAGEMENT, QUERY_KEYS_MAINTABLE_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import ComboboxPopoverLocation from './components/ComboboxPopoverLocation.component'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { Suspense } from 'react'
import { CalendarSkeleton, mockCalendarAPI } from './components/index'
import { getActiveCustomersForCalendar, getActiveServicesForCalendar, getCalendarStatusOptions } from './components/CalendarAPI.service'

export default async function Page (props: {
  searchParams?: Promise<{
    locationFilter?: string;
  }>;
}) {
  const searchParams = await props.searchParams
  const locationFilter = searchParams?.locationFilter || '0'
  const queryClient = getQueryClient()

  // 1. Prefetch ubicaciones (para el ComboboxPopoverLocation)
  queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS_LOCATION_MANAGEMENT.LMGetLocationCatalog],
    queryFn: () => getLocationsCatalog()
  })

  // 2. Prefetch eventos del calendario
  queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS_CALENDAR_MANAGEMENT.CMListCalendar, locationFilter],
    queryFn: () => mockCalendarAPI.getEvents(locationFilter)
  })

  // 3. Prefetch customers activos para el modal de citas
  queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS_CUSTOMER_MANAGEMENT.CMActiveCustomers],
    queryFn: () => getActiveCustomersForCalendar()
  })

  // 4. Prefetch opciones de estado del calendario
  queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS_MAINTABLE_MANAGEMENT.CMCalendarStatusOptions],
    queryFn: () => getCalendarStatusOptions()
  })

  // Solo hacer prefetch de servicios y barberos si hay una ubicación seleccionada
  if (locationFilter && locationFilter !== '0') {
    // 5. Prefetch servicios por ubicación
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS_SERVICE_MANAGEMENT.CMActiveServices, locationFilter],
      queryFn: () => getActiveServicesForCalendar(locationFilter)
    })

    // 6. Prefetch barberos por ubicación
    queryClient.prefetchQuery({
      queryKey: ['barbers', locationFilter],
      queryFn: () => mockCalendarAPI.getBarbers(locationFilter)
    })
  }

  const shouldShowCalendar = locationFilter && locationFilter !== '0'

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="container mx-auto p-0 space-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Gestión de Calendario</h1>
          <ComboboxPopoverLocation />
        </div>

        {shouldShowCalendar
          ? (
          <Suspense key={locationFilter} fallback={<CalendarSkeleton />}>
            <Calendar locationFilter={locationFilter} />
          </Suspense>
            )
          : (
          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-yellow-500" />
              </div>
              <CardTitle className="text-xl">Selecciona una ubicación</CardTitle>
              <CardDescription className="text-base">
                Para ver el calendario de citas, primero debes seleccionar una ubicación desde el selector de arriba.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Una vez seleccionada la ubicación, podrás gestionar las citas y eventos del calendario.
              </p>
            </CardContent>
          </Card>
            )}
      </main>
    </HydrationBoundary>
  )
}
