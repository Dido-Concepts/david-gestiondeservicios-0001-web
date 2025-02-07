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

  // Eventos actuales en el calendario.
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([])
  // Estado para el dialog de agregar eventos.
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  // Título del nuevo evento a agregar.
  const [newEventTitle, setNewEventTitle] = useState<string>('')
  // Fecha seleccionada para agregar un evento.
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null)

  // Estados para el diálogo de edición
  // Evento seleccionado para editar.
  const [selectedEventForEditing, setSelectedEventForEditing] = useState<EventApi | null>(null)
  // Título del evento en edición.
  const [editEventTitle, setEditEventTitle] = useState<string>('')
  // Estado para controlar si se muestra el diálogo de edición.
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)

  // Cargar eventos desde el localStorage al montar el componente.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEvents = localStorage.getItem('events')
      if (savedEvents) {
        setCurrentEvents(JSON.parse(savedEvents))
      }
    }
  }, [])

  // Guardar eventos en localStorage cada vez que currentEvents cambie.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('events', JSON.stringify(currentEvents))
    }
  }, [currentEvents])

  // Manejador para agregar un nuevo evento.
  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected)
    setIsDialogOpen(true)
  }

  // Manejador para editar un evento al hacer clic.
  const handleEventClick = (selected: EventClickArg) => {
    // En vez de eliminar, abrimos el dialog de edición.
    setSelectedEventForEditing(selected.event)
    setEditEventTitle(selected.event.title)
    setIsEditDialogOpen(true)
  }

  // Función para cerrar el diálogo de agregar evento.
  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setNewEventTitle('')
  }

  // Función para cerrar el diálogo de edición.
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false)
    setSelectedEventForEditing(null)
    setEditEventTitle('')
  }

  // Manejador para agregar un evento nuevo.
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (newEventTitle && selectedDate) {
      const calendarApi = selectedDate.view.calendar
      calendarApi.unselect() // Deselecciona el rango

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

  // Manejador para guardar los cambios en la edición del evento.
  const handleEditEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedEventForEditing) {
      // Actualizamos la propiedad 'title' del evento.
      selectedEventForEditing.setProp('title', editEventTitle)
      // Si fuera necesario, se pueden actualizar otras propiedades.
      handleCloseEditDialog()
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
                    })}
                  </label>
                </li>
              ))}
          </ul>
        </div>

        <div className="w-9/12 mt-8">
          <FullCalendar
            height={'85vh'}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            locale={esLocale}
            select={handleDateClick}
            eventClick={handleEventClick}
            eventsSet={(events) => setCurrentEvents(events)}
            initialEvents={
              typeof window !== 'undefined'
                ? JSON.parse(localStorage.getItem('events') || '[]')
                : []
            }
          />
        </div>
      </div>

      {/* Dialog para agregar un nuevo evento */}
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
                  <input type="checkbox" id="barbero1" className="mr-2" />
                  <label htmlFor="barbero1">David</label>
                </div>
                <div>
                  <input type="checkbox" id="barbero2" className="mr-2" />
                  <label htmlFor="barbero2">Julio</label>
                </div>
                <div>
                  <input type="checkbox" id="barbero3" className="mr-2" />
                  <label htmlFor="barbero3">Pedro</label>
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
                onChange={(e) => setNewEventTitle(e.target.value)}
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

      {/* Dialog para editar un evento existente */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar cita</DialogTitle>
          </DialogHeader>
          <form className="space-x-5 mb-4 gap-2" onSubmit={handleEditEvent}>
            {/* Aquí puedes incluir otros campos si fuera necesario (cliente, servicios, barbero) */}
            {/* En este ejemplo, únicamente editaremos la descripción (title) */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Editar descripción
              </label>
              <input
                type="text"
                placeholder="Nueva descripción de la cita"
                value={editEventTitle}
                onChange={(e) => setEditEventTitle(e.target.value)}
                required
                className="border border-gray-200 p-3 rounded-md text-lg"
              />
            </div>

            {/* Botones para cancelar y guardar la edición */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                className="bg-gray-300 text-gray-700 p-3 rounded-md"
                onClick={handleCloseEditDialog}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-app-quaternary text-white p-3 rounded-md"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Calendar
