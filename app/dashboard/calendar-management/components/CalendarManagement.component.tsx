'use client'

import React, { useState, useEffect } from 'react'
import {
  formatDate,
  DateSelectArg,
  EventClickArg,
  EventApi
} from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

const Calendar: React.FC = () => {
  // ESTADOS DEL COMPONENTE
  // Lista de eventos actualmente en el calendario
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([])
  // Estado para controlar si el modal para agregar eventos está abierto
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  // Título del nuevo evento que el usuario desea agregar.
  const [newEventTitle, setNewEventTitle] = useState<string>('')
  // Fecha seleccionada para agregar un evento.
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null)

  useEffect(() => {
    // Cargar eventos desde el almacenamiento local cuando se monta el componente
    if (typeof window !== 'undefined') {
      const savedEvents = localStorage.getItem('events')
      if (savedEvents) {
        setCurrentEvents(JSON.parse(savedEvents))
      }
    }
  }, [])

  useEffect(() => {
    // Guardar eventos en el almacenamiento local siempre que cambien
    if (typeof window !== 'undefined') {
      localStorage.setItem('events', JSON.stringify(currentEvents))
    }
  }, [currentEvents])

  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected)
    setIsDialogOpen(true)
  }

  const handleEventClick = (selected: EventClickArg) => {
    // Solicitar confirmación al usuario antes de eliminar un evento
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar la cita "${selected.event.title}"?`
      )
    ) {
      selected.event.remove()
    }
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setNewEventTitle('')
  }

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (newEventTitle && selectedDate) {
      const calendarApi = selectedDate.view.calendar // Obtener la instancia de API del calendario
      calendarApi.unselect() // Deseleccionar el rango de fechas

      const newEvent = {
        id: `${selectedDate.start.toISOString()}-${newEventTitle}`,
        title: newEventTitle,
        start: selectedDate.start,
        end: selectedDate.end,
        allDay: selectedDate.allDay
      }

      calendarApi.addEvent(newEvent)
      handleCloseDialog()
    }
  }

  return (
    <div>
      <div className="flex w-full px-3 justify-start items-start gap-8">
        <div className="w-3/12">
          <div className="py-10 text-2xl font-bold px-5">
            Citas del calendario
          </div>
          <ul className="space-y-4">
            {currentEvents.length <= 0 && (
              <div className="italic text-center text-gray-400">
                No hay citas presentes
              </div>
            )}

            {currentEvents.length > 0 &&
              currentEvents.map((event: EventApi) => (
                <li
                  className="border border-gray-200 shadow px-4 py-2 rounded-md text-blue-800"
                  key={event.id}
                >
                  {event.title}
                  <br />
                  <label className="text-slate-950">
                    {formatDate(event.start!, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}{' '}
                    {/* Formato de fecha de inicio del evento */}
                  </label>
                </li>
              ))}
          </ul>
        </div>

        <div className="w-9/12 mt-8">
          <FullCalendar
            height={'85vh'}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // Initialize calendar with required plugins.
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }} // Establecer las opciones de la barra de herramientas del encabezado
            initialView="dayGridMonth" // Initial view mode of the calendar.
            editable={true} // Allow events to be edited.
            selectable={true} // Allow dates to be selectable.
            selectMirror={true} // Mirror selections visually.
            dayMaxEvents={true} // Limit the number of events displayed per day.
            select={handleDateClick} // Handle date selection to create new events.
            eventClick={handleEventClick} // Handle clicking on events (e.g., to delete them).
            eventsSet={(events) => setCurrentEvents(events)} // Update state with current events whenever they change.
            initialEvents={
              typeof window !== 'undefined'
                ? JSON.parse(localStorage.getItem('events') || '[]')
                : []
            } // Initial events loaded from local storage.
          />
        </div>
      </div>

      {/* Dialog for adding new events */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir cita</DialogTitle>
          </DialogHeader>
          <form className="space-x-5 mb-4" onSubmit={handleAddEvent}>
            <input
              type="text"
              placeholder="Event Title"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)} // Update new event title as the user types.
              required
              className="border border-gray-200 p-3 rounded-md text-lg"
            />
            <button
              className="bg-green-500 text-white p-3 mt-5 rounded-md"
              type="submit"
            >
              Guardar
            </button>{' '}
            {/* Button to submit new event */}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Calendar // Export the Calendar component for use in other parts of the application.
