'use client'

import { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import { NewAppointmentModal } from './NewAppointmentModal.component'

export function BasicCalendar () {
  // Estado para el modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Cita de Ejemplo',
      start: new Date().toISOString().split('T')[0] + 'T10:00:00',
      end: new Date().toISOString().split('T')[0] + 'T11:00:00',
      backgroundColor: '#3b82f6',
      borderColor: '#3b82f6'
    },
    {
      id: '2',
      title: 'Consulta Programada',
      start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T14:00:00',
      end: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T15:30:00',
      backgroundColor: '#10b981',
      borderColor: '#10b981'
    },
    {
      id: '3',
      title: 'Revisión Médica',
      start: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T22:00:00',
      end: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T23:00:00',
      backgroundColor: '#8b5cf6',
      borderColor: '#8b5cf6'
    },
    {
      id: '4',
      title: 'Consulta de Seguimiento',
      start: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T16:00:00',
      end: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T17:30:00',
      backgroundColor: '#f59e0b',
      borderColor: '#f59e0b'
    }
  ])

  // Usar eventos del estado
  const sampleEvents = events

  const handleDateClick = (arg: { dateStr: string }) => {
    console.log('Fecha clickeada:', arg.dateStr)
    setSelectedDate(arg.dateStr)
    setIsModalOpen(true)
  }

  const handleEventClick = (arg: { event: { title: string } }) => {
    console.log('Evento clickeado:', arg.event.title)
    // Aquí podrías abrir un modal para editar la cita
  }

  // Función para crear nueva cita
  const handleCreateAppointment = (appointmentData: {
    cliente: string
    servicio: string
    barbero: string
    horaInicio: string
    estado: string
    fecha: string
  }) => {
    const newEvent = {
      id: (events.length + 1).toString(),
      title: `Cita - Cliente ${appointmentData.cliente}`,
      start: `${appointmentData.fecha}T${appointmentData.horaInicio}:00`,
      end: `${appointmentData.fecha}T${appointmentData.horaInicio}:00`, // Por ahora misma hora, se calculará después
      backgroundColor: appointmentData.estado === 'confirmada' ? '#10b981' : '#3b82f6',
      borderColor: appointmentData.estado === 'confirmada' ? '#10b981' : '#3b82f6'
    }

    setEvents(prev => [...prev, newEvent])
    console.log('Nueva cita creada:', appointmentData)
  }

  // Filtrar y ordenar próximas citas (eventos futuros)
  const upcomingAppointments = sampleEvents
    .filter(event => new Date(event.start) >= new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5) // Mostrar máximo 5 próximas citas

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
              <div className="calendar-container [&_.fc-toolbar-title]:text-xl [&_.fc-toolbar-title]:font-semibold [&_.fc-button]:bg-blue-500 [&_.fc-button]:border-blue-500 [&_.fc-button:hover]:bg-blue-600 [&_.fc-button:hover]:border-blue-600">
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                  }}
                  events={sampleEvents}
                  dateClick={handleDateClick}
                  eventClick={handleEventClick}
                  editable={true}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={true}
                  weekends={true}
                  height="auto"
                  locale="es"
                />
              </div>
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
              {upcomingAppointments.length > 0
                ? (
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleEventClick({ event: { title: appointment.title } })}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-900 mb-1">
                            {appointment.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
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
    </div>
  )
}
