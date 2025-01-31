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
import esLocale from '@fullcalendar/core/locales/es'
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
            locale={esLocale} // Set the calendar to Spanish.
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
          <form className="space-x-5 mb-4 gap-2" onSubmit={handleAddEvent}>
            {/* Seleccionar cliente */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Seleccionar cliente
              </label>
              <select className="border border-gray-200 p-3 rounded-md w-full">
                <option value="">Sin cita</option>
                <option value="cliente1">Cliente 1</option>
                <option value="cliente2">Cliente 2</option>
                <option value="añadir">Añadir cliente</option>
              </select>
            </div>

            {/* Seleccionar servicios */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Seleccionar servicios
              </label>
              <div className="space-y-2">
                <div>
                  <input type="checkbox" id="servicio1" className="mr-2" />
                  <label htmlFor="servicio1">Servicio 1</label>
                </div>
                <div>
                  <input type="checkbox" id="servicio2" className="mr-2" />
                  <label htmlFor="servicio2">Servicio 2</label>
                </div>
                <div>
                  <input type="checkbox" id="servicio3" className="mr-2" />
                  <label htmlFor="servicio3">Servicio 3</label>
                </div>
              </div>
            </div>

            {/* Seleccionar barbero */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Seleccionar barbero
              </label>
              <div className="space-y-2">
                <div>
                  <input type="checkbox" id="servicio1" className="mr-2" />
                  <label htmlFor="servicio1">David</label>
                </div>
                <div>
                  <input type="checkbox" id="servicio2" className="mr-2" />
                  <label htmlFor="servicio2">Julio</label>
                </div>
                <div>
                  <input type="checkbox" id="servicio3" className="mr-2" />
                  <label htmlFor="servicio3">Pedro</label>
                </div>
              </div>
            </div>

            {/* Agregar descripción */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Agregar descripción
              </label>
              <input
                type="text"
                placeholder="Descripción de la cita"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)} // Actualice el título del nuevo evento a medida que el usuario escribe.
                required
                className="border border-gray-200 p-3 rounded-md text-lg"
              />
            </div>

            {/* Botones para cancelar y guardar */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                className="bg-gray-300 text-gray-700 p-3 rounded-md"
                onClick={handleCloseDialog}
              >
                Cancelar
              </button>

              {/* Button to submit new event */}
              <button
                type="submit"
                className="bg-app-quaternary text-white p-3 rounded-md"
              >
                Guardar
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Calendar // Export the Calendar component for use in other parts of the application.
//
