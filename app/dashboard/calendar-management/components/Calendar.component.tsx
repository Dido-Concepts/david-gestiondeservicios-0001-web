'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { DateSelectArg, EventClickArg } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS_CALENDAR_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import {
  CalendarHeader,
  CalendarEventsList,
  CreateEventModal,
  mockCalendarAPI,
  type CalendarEvent
} from './index'

// ============================
// HOOKS
// ============================
const useCalendarEvents = (locationId: string) => {
  return useSuspenseQuery<CalendarEvent[]>({
    queryKey: [QUERY_KEYS_CALENDAR_MANAGEMENT.CMListCalendar, locationId],
    queryFn: () => mockCalendarAPI.getEvents(locationId)
  })
}

const useCreateEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: mockCalendarAPI.createEvent,
    onSuccess: (newEvent) => {
      console.log('🔄 Invalidando queries después de crear evento')

      // Invalida todas las queries del calendario para asegurar consistencia
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS_CALENDAR_MANAGEMENT.CMListCalendar]
      })

      // Invalida específicamente la ubicación del nuevo evento
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS_CALENDAR_MANAGEMENT.CMListCalendar, newEvent.locationId]
      })
    },
    onError: (error) => {
      console.error('❌ Error en mutación de crear evento:', error)
    }
  })
}

const useUpdateEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, event }: { id: string; event: Partial<CalendarEvent> }) =>
      mockCalendarAPI.updateEvent(id, event),
    onSuccess: () => {
      console.log('🔄 Invalidando queries después de actualizar evento')

      // Invalida todas las queries del calendario para asegurar consistencia
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS_CALENDAR_MANAGEMENT.CMListCalendar]
      })

      console.log('✅ Evento actualizado, cache invalidado')
    },
    onError: (error) => {
      console.error('❌ Error en mutación de actualizar evento:', error)
    }
  })
}

const useDeleteEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: mockCalendarAPI.deleteEvent,
    onSuccess: () => {
      console.log('🔄 Invalidando queries después de eliminar evento')

      // Invalida todas las queries del calendario para asegurar consistencia
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS_CALENDAR_MANAGEMENT.CMListCalendar]
      })
    },
    onError: (error) => {
      console.error('❌ Error en mutación de eliminar evento:', error)
    }
  })
}

// ============================
// CONSTANTES
// ============================
const statusColors: Record<string, string> = {
  1: '#3B82F6', // Reservada - Azul
  2: '#10B981', // Confirmada - Verde
  3: '#6B7280', // Finalizado - Gris
  4: '#EF4444' // Cancelar - Rojo
} as const

// ============================
// COMPONENTE PRINCIPAL
// ============================
interface CalendarProps {
  locationFilter: string
}

const Calendar: React.FC<CalendarProps> = ({ locationFilter }) => {
  // ============================
  // ESTADO Y QUERIES
  // ============================
  const { data: events = [] } = useCalendarEvents(locationFilter)
  const createEventMutation = useCreateEvent()
  const updateEventMutation = useUpdateEvent()
  const deleteEventMutation = useDeleteEvent()

  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

  // ============================
  // TRANSFORMACIÓN DE EVENTOS
  // ============================
  const fullCalendarEvents = useMemo(() => {
    return events
      .filter((event: CalendarEvent) => event.status !== '4') // No mostrar eventos cancelados
      .map((event: CalendarEvent) => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
        backgroundColor: statusColors[event.status],
        borderColor: statusColors[event.status],
        extendedProps: {
          client: event.client,
          service: event.service,
          barber: event.barber,
          status: event.status,
          locationId: event.locationId
        }
      }))
  }, [events])

  // ============================
  // HANDLERS OPTIMIZADOS
  // ============================
  const handleDateClick = useCallback((selected: DateSelectArg) => {
    setSelectedDate(selected)
    setEditingEvent(null)
    setModalMode('create')
    setIsCreateModalOpen(true)
  }, [])

  const handleEventClick = useCallback((selected: EventClickArg) => {
    const eventData = events.find((e: CalendarEvent) => e.id === selected.event.id)
    if (eventData) {
      setEditingEvent(eventData)
      setSelectedDate(null)
      setModalMode('edit')
      setIsCreateModalOpen(true)
    }
  }, [events])

  const handleEventClickFromList = useCallback((eventData: CalendarEvent) => {
    setEditingEvent(eventData)
    setSelectedDate(null)
    setModalMode('edit')
    setIsCreateModalOpen(true)
  }, [])

  const handleCreateEvent = useCallback(async (eventData: Omit<CalendarEvent, 'id'>) => {
    try {
      await createEventMutation.mutateAsync(eventData)
      setIsCreateModalOpen(false)
      setSelectedDate(null)
    } catch (error) {
      console.error('❌ Error creando evento:', error)
    }
  }, [createEventMutation])

  const handleUpdateEvent = useCallback(async (id: string, eventData: Partial<CalendarEvent>) => {
    try {
      await updateEventMutation.mutateAsync({ id, event: eventData })
      setIsCreateModalOpen(false)
      setEditingEvent(null)
    } catch (error) {
      console.error('❌ Error actualizando evento:', error)
    }
  }, [updateEventMutation])

  const handleDeleteEvent = useCallback(async (id: string) => {
    try {
      await deleteEventMutation.mutateAsync(id)
      setIsCreateModalOpen(false)
      setEditingEvent(null)
    } catch (error) {
      console.error('❌ Error eliminando evento:', error)
    }
  }, [deleteEventMutation])

  const handleCloseModal = useCallback(() => {
    setIsCreateModalOpen(false)
    setSelectedDate(null)
    setEditingEvent(null)
  }, [])

  // ============================
  // RENDER PRINCIPAL
  // ============================
  return (
    <div className="space-y-6">
      <CalendarHeader locationFilter={locationFilter} eventCount={events.length} />

      <div className="flex flex-col md:flex-row gap-6">
        <CalendarEventsList
          events={events}
          onEventClick={handleEventClickFromList}
        />

        {/* Calendario FullCalendar */}
        <div className="flex-1 w-full md:w-3/4">
          <FullCalendar
            height="75dvh"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView="dayGridMonth"
            locale={esLocale}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={fullCalendarEvents}
            select={handleDateClick}
            eventClick={handleEventClick}
            eventContent={(eventInfo) => (
              <div className="p-1">
                <div className="font-medium text-xs">{eventInfo.event.title}</div>
                <div className="text-xs opacity-75">
                  👤 {eventInfo.event.extendedProps.client}
                </div>
              </div>
            )}
          />
        </div>
      </div>

      <CreateEventModal
        isOpen={isCreateModalOpen}
        selectedDate={selectedDate}
        onClose={handleCloseModal}
        onCreate={handleCreateEvent}
        onUpdate={handleUpdateEvent}
        onDelete={handleDeleteEvent}
        locationFilter={locationFilter}
        editingEvent={editingEvent}
        mode={modalMode}
      />
    </div>
  )
}

export default Calendar
