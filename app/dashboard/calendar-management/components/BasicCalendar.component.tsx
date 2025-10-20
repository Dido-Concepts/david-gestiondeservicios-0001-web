'use client'

import { useState, useRef, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventDropArg } from '@fullcalendar/core'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import { NewAppointmentModal } from './NewAppointmentModal.component'
import { EditAppointmentModal } from './EditAppointmentModal.component'
import { CalendarSkeleton } from './CalendarSkeleton.component'
import { UpcomingAppointmentsSkeleton } from './UpcomingAppointmentsSkeleton.component'
import { useAppointments, appointmentToCalendarEvent, AppointmentResponseModel, useUpdateAppointment } from '../../hook/client/useAppointmentQueries'
import { useToast } from '@/hooks/use-toast'
import { handleApiError } from '../utils/apiErrorHandler'

export function BasicCalendar () {
  // Obtener idLocation de los parámetros de la URL
  const searchParams = useSearchParams()
  const idLocation = searchParams.get('idLocation') || ''
  const { toast } = useToast()

  // Hook para actualizar citas (para drag and drop)
  const updateAppointmentMutation = useUpdateAppointment()

  // Estado para el modal de nueva cita
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')

  // Estado para el modal de edición de cita
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentResponseModel | null>(null)

  // Estado para el feedback de drag and drop
  const [isDragging, setIsDragging] = useState(false)

  // Estado para fechas de vista del calendario
  const [viewDates, setViewDates] = useState<{
    start_date?: string
    end_date?: string
  }>({})

  // Referencia al calendario para acceder a su API
  const calendarRef = useRef<FullCalendar>(null)

  // Hook para obtener citas de la API
  const appointmentsQuery = useAppointments({
    location_id: idLocation,
    start_date: viewDates.start_date,
    end_date: viewDates.end_date,
    enabled: Boolean(idLocation) && Boolean(viewDates.start_date && viewDates.end_date)
  })

  // Convertir citas de la API a eventos del calendario
  const calendarEvents = useMemo(() => {
    if (!appointmentsQuery.data?.data) return []

    return appointmentsQuery.data.data.map(appointment =>
      appointmentToCalendarEvent(appointment)
    )
  }, [appointmentsQuery.data])

  // Función para actualizar las fechas de vista cuando cambie la vista del calendario
  const handleViewChange = (dateInfo: { start: Date; end: Date; view: { type: string } }) => {
    const startDate = new Date(dateInfo.start.getFullYear(), dateInfo.start.getMonth(), dateInfo.start.getDate(), 0, 0, 0)
    const endDate = new Date(dateInfo.end.getFullYear(), dateInfo.end.getMonth(), dateInfo.end.getDate() - 1, 23, 59, 59)

    const startDateStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')} 00:00:00`
    const endDateStr = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')} 23:59:59`

    setViewDates({
      start_date: startDateStr,
      end_date: endDateStr
    })
  }

  const handleDateClick = (arg: { dateStr: string }) => {
    setSelectedDate(arg.dateStr)
    setIsModalOpen(true)
  }

  const handleEventClick = (arg?: { event?: { extendedProps?: { appointment_id?: number } } }) => {
    if (!arg?.event?.extendedProps?.appointment_id) {
      // Si no se proporciona un evento específico, no hacer nada
      return
    }

    // Obtener el appointment_id del evento
    const appointmentId = arg.event.extendedProps.appointment_id

    // Buscar la cita completa en los datos
    const appointment = appointmentsQuery.data?.data?.find(
      apt => apt.appointment_id === appointmentId
    )

    if (appointment) {
      setSelectedAppointment(appointment)
      setIsEditModalOpen(true)
    }
  }

  // Función específica para manejar clics en citas desde la lista de próximas citas
  const handleAppointmentClick = (appointmentId: number) => {
    const appointment = appointmentsQuery.data?.data?.find(
      apt => apt.appointment_id === appointmentId
    )

    if (appointment) {
      setSelectedAppointment(appointment)
      setIsEditModalOpen(true)
    }
  }

  const handleCreateAppointment = (appointmentData: {
    cliente: string
    servicio: string
    barbero: string
    horaInicio: string
    estado: string
    fecha: string
  }) => {
    // La creación de la cita ahora se maneja completamente en el modal
    // Esta función se mantiene por compatibilidad pero ya no es necesaria
    console.log('Datos de la cita recibidos:', appointmentData)
  }

  const handleUpdateAppointment = (appointmentData: {
    cliente: string
    servicio: string
    barbero: string
    horaInicio: string
    estado: string
    fecha: string
  }) => {
    // La actualización de la cita ahora se maneja completamente en el modal
    console.log('Datos de la cita actualizada:', appointmentData)
  }

  // Función para manejar el inicio del arrastre
  const handleEventDragStart = () => {
    setIsDragging(true)
  }

  // Función para manejar el fin del arrastre (exitoso o no)
  const handleEventDragStop = () => {
    setIsDragging(false)
  }

  // Función para manejar el arrastrar y soltar de eventos
  const handleEventDrop = async (dropInfo: EventDropArg) => {
    const appointmentId = dropInfo.event.extendedProps.appointment_id

    // Buscar la cita original en los datos
    const originalAppointment = appointmentsQuery.data?.data?.find(
      apt => apt.appointment_id === appointmentId
    )

    if (!originalAppointment) {
      toast({
        title: 'Error',
        description: 'No se encontró la información de la cita',
        variant: 'destructive'
      })
      return
    }

    try {
      // Mostrar toast de carga personalizado con animación naranja
      toast({
        title: '🔄 Reprogramando cita...',
        description: 'Actualizando la fecha y hora de la cita',
        duration: 2500,
        variant: 'default',
        style: { background: 'linear-gradient(to right, #ffedd5, #fff7ed)', color: '#9a3412' }
      })

      // Obtener las nuevas fechas directamente del evento después del drop
      const newStart = new Date(dropInfo.event.start!)
      const newEnd = new Date(dropInfo.event.end!)

      // Formatear las fechas para la API
      const formatToISO = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
      }

      // Preparar los datos para la actualización
      const updateData = {
        customer_id: originalAppointment.customer_id,
        end_datetime: formatToISO(newEnd),
        location_id: originalAppointment.location_id,
        service_id: originalAppointment.service_id,
        start_datetime: formatToISO(newStart),
        status_maintable_id: originalAppointment.status_id,
        user_id: originalAppointment.user_id
      }

      // Actualizar la cita usando el hook
      await updateAppointmentMutation.mutateAsync({
        appointmentId,
        appointmentData: updateData
      })

      // Mostrar mensaje de éxito
      toast({
        title: '✅ Cita reprogramada',
        description: `La cita de ${originalAppointment.customer_name} ha sido movida exitosamente`,
        duration: 3000
      })
    } catch (error) {
      console.error('Error al mover la cita:', error)

      // Revertir el movimiento visual si hay error
      dropInfo.revert()

      // Usar el apiErrorHandler para obtener el mensaje de error apropiado
      const errorInfo = handleApiError(error)
      toast({
        title: errorInfo.title,
        description: errorInfo.description,
        duration: 4000,
        variant: 'destructive'
      })
    }
  }

  // Filtrar y ordenar próximas citas (eventos futuros)
  const upcomingAppointments = calendarEvents
    .filter(event => new Date(event.start) >= new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="w-full space-y-4">

      {/* Layout de dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna del calendario */}
        <div className="lg:col-span-2">
          <Card className="w-full">
            <CardContent className="p-6">
              {appointmentsQuery.isLoading && !viewDates.start_date
                ? (
                <CalendarSkeleton />
                  )
                : (
                <div className={`calendar-container [&_.fc-toolbar-title]:text-xl [&_.fc-toolbar-title]:font-semibold [&_.fc-button]:bg-blue-500 [&_.fc-button]:border-blue-500 [&_.fc-button:hover]:bg-blue-600 [&_.fc-button:hover]:border-blue-600 ${isDragging ? 'cursor-grabbing' : ''}`}>
                  <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                      left: 'prev,next today',
                      center: 'title',
                      right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    buttonText={{
                      today: 'Hoy',
                      month: 'Mes',
                      week: 'Semana',
                      day: 'Día'
                    }}
                    events={calendarEvents}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    eventDrop={handleEventDrop}
                    eventDragStart={handleEventDragStart}
                    eventDragStop={handleEventDragStop}
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    height="auto"
                    locale="es"
                    datesSet={handleViewChange}
                  />
                </div>
                  )}
            </CardContent>
          </Card>
        </div>

        {/* Columna de próximas citas */}
        <div className="lg:col-span-1">
          <Card className="w-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Próximas Citas</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {appointmentsQuery.isLoading
                ? (
                <UpcomingAppointmentsSkeleton />
                  )
                : appointmentsQuery.error
                  ? (
                <div className="text-center py-8 text-red-500">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Error al cargar las citas</p>
                </div>
                    )
                  : upcomingAppointments.length > 0
                    ? (
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleAppointmentClick(appointment.extendedProps.appointment_id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-900 mb-1">
                            {appointment.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                            <span>{formatDate(appointment.start)}</span>
                            <span>•</span>
                            <span>{formatTime(appointment.start)}</span>
                            {appointment.end && (
                              <>
                                <span>-</span>
                                <span>{formatTime(appointment.end)}</span>
                              </>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            Barbero: {appointment.extendedProps.user_name}
                          </div>
                        </div>
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                          style={{ backgroundColor: appointment.backgroundColor }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                      )
                    : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No hay citas próximas</p>
                </div>
                      )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal para crear nueva cita */}
      <NewAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        onCreateAppointment={handleCreateAppointment}
      />

      {/* Modal para editar cita */}
      <EditAppointmentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedAppointment(null)
        }}
        appointment={selectedAppointment}
        onUpdateAppointment={handleUpdateAppointment}
      />
    </div>
  )
}
