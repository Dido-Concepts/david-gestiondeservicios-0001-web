import React, { useMemo } from 'react'
import { CalendarEvent, getCalendarStatusOptions, type StatusOption } from './CalendarAPI.service'
import { format, isAfter, isToday, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { useSuspenseQuery } from '@tanstack/react-query'
import { QUERY_KEYS_MAINTABLE_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'

// ============================
// HOOKS
// ============================
const useStatusOptions = () => {
  return useSuspenseQuery<StatusOption[]>({
    queryKey: [QUERY_KEYS_MAINTABLE_MANAGEMENT.CMCalendarStatusOptions],
    queryFn: () => getCalendarStatusOptions()
  })
}

// ============================
// PROPS INTERFACE
// ============================
interface CalendarEventsListProps {
  events: CalendarEvent[]
  onEventClick?: (event: CalendarEvent) => void
}

// ============================
// COMPONENTE LISTA DE EVENTOS
// ============================
export const CalendarEventsList: React.FC<CalendarEventsListProps> = React.memo(({ events, onEventClick }) => {
  // Obtener opciones de estado del calendario
  const { data: statusOptions = [] } = useStatusOptions()

  // Función helper para obtener el nombre del estado
  const getStatusLabel = (statusValue: string): string => {
    const statusOption = statusOptions.find(option => option.value === statusValue)
    return statusOption?.label || statusValue.charAt(0).toUpperCase() + statusValue.slice(1)
  }
  // ============================
  // FILTRADO Y ORDENADO DE EVENTOS
  // ============================
  const upcomingEvents = useMemo(() => {
    const today = startOfDay(new Date())

    return events
      .filter(event => {
        // Filtrar solo eventos de hoy en adelante y que no estén cancelados
        const eventDate = new Date(event.start)
        return (isToday(eventDate) || isAfter(eventDate, today)) && event.status !== '4' // No mostrar cancelados
      })
      .sort((a, b) => {
        // Ordenar por fecha y hora
        return new Date(a.start).getTime() - new Date(b.start).getTime()
      })
  }, [events])

  // ============================
  // RENDER DEL COMPONENTE
  // ============================
  return (
    <div className="w-full md:w-1/4 space-y-4">
      <h3 className="font-semibold text-gray-700">📋 Próximas citas</h3>
      <div className="space-y-2 h-[75dvh] overflow-y-auto">
        {upcomingEvents.length === 0
          ? (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-gray-400 text-sm">📭 No hay citas próximas</div>
          </div>
            )
          : (
              upcomingEvents.map(event => (
            <div
              key={event.id}
              className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors space-y-2"
              onClick={() => onEventClick?.(event)}
            >
              {/* Fecha y hora */}
              <div className="text-xs text-gray-500 font-medium">
                📅 {format(new Date(event.start), 'dd/MM/yyyy - HH:mm', { locale: es })}
              </div>

              {/* Título del servicio */}
              <div className="font-medium text-sm text-gray-800">{event.title}</div>

              {/* Cliente */}
              <div className="text-xs text-gray-600">
                👤 <span className="font-medium">Cliente:</span> {event.client}
              </div>

              {/* Servicio */}
              {event.service && (
                <div className="text-xs text-gray-600">
                  ✂️ <span className="font-medium">Servicio:</span> {event.service}
                </div>
              )}

              {/* Barbero */}
              {event.barber && (
                <div className="text-xs text-gray-600">
                  💇 <span className="font-medium">Barbero:</span> {event.barber}
                </div>
              )}

              {/* Estado */}
              <div className="flex justify-start">
                <span className={`text-xs px-2 py-1 rounded-full font-medium
                  ${event.status === '2' // Confirmada
                    ? 'bg-green-100 text-green-800'
                    : event.status === '1' // Reservada
                    ? 'bg-blue-100 text-blue-800'
                    : event.status === '3' // Finalizado
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-red-100 text-red-800'}`}>
                  {getStatusLabel(event.status)}
                </span>
              </div>
            </div>
              ))
            )}
      </div>
    </div>
  )
})

CalendarEventsList.displayName = 'CalendarEventsList'
