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
  // ============================
  // ESTADOS GENERALES
  // ============================
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null)

  // Estados para el diálogo de agregar cita
  const [newEventTitle, setNewEventTitle] = useState<string>('')
  const [newEventClient, setNewEventClient] = useState<string>('')
  const [newEventServices, setNewEventServices] = useState<string[]>([])
  const [newEventBarbers, setNewEventBarbers] = useState<string[]>([])
  const [newEventStatus, setNewEventStatus] = useState<string>('reservada') // Nuevo estado

  // Estados para el diálogo de editar cita
  const [selectedEventForEditing, setSelectedEventForEditing] = useState<EventApi | null>(null)
  const [editEventTitle, setEditEventTitle] = useState<string>('')
  const [editEventClient, setEditEventClient] = useState<string>('')
  const [editEventServices, setEditEventServices] = useState<string[]>([])
  const [editEventBarbers, setEditEventBarbers] = useState<string[]>([])
  const [editEventStatus, setEditEventStatus] = useState<string>('reservada') // Nuevo estado
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)

  // ============================
  // CARGA Y ALMACENAMIENTO
  // ============================
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEvents = localStorage.getItem('events')
      if (savedEvents) {
        setCurrentEvents(JSON.parse(savedEvents))
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('events', JSON.stringify(currentEvents))
    }
  }, [currentEvents])

  // ============================
  // MANEJADORES DE EVENTOS
  // ============================

  // --- Agregar evento ---
  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected)
    setIsDialogOpen(true)
  }

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (newEventTitle && selectedDate) {
      const calendarApi = selectedDate.view.calendar
      calendarApi.unselect()

      const newEvent = {
        id: `${selectedDate.start.toISOString()}-${newEventTitle}`,
        title: newEventTitle,
        start: selectedDate.start,
        end: selectedDate.end,
        allDay: selectedDate.allDay,
        // Datos adicionales en extendedProps:
        extendedProps: {
          client: newEventClient,
          services: newEventServices,
          barbers: newEventBarbers,
          status: newEventStatus
        }
      }

      calendarApi.addEvent(newEvent)
      handleCloseDialog()
    }
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setNewEventTitle('')
    setNewEventClient('')
    setNewEventServices([])
    setNewEventBarbers([])
    setNewEventStatus('reservada')
  }

  // --- Editar evento ---
  const handleEventClick = (selected: EventClickArg) => {
    const event = selected.event
    setSelectedEventForEditing(event)
    setEditEventTitle(event.title)
    const ext = event.extendedProps
    setEditEventClient(ext.client || '')
    setEditEventServices(ext.services || [])
    setEditEventBarbers(ext.barbers || [])
    setEditEventStatus(ext.status || 'reservada')
    setIsEditDialogOpen(true)
  }

  const handleEditEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedEventForEditing) {
      // Actualizar el título (descripción)
      selectedEventForEditing.setProp('title', editEventTitle)
      // Actualizar cada propiedad extendida individualmente
      selectedEventForEditing.setExtendedProp('client', editEventClient)
      selectedEventForEditing.setExtendedProp('services', editEventServices)
      selectedEventForEditing.setExtendedProp('barbers', editEventBarbers)
      selectedEventForEditing.setExtendedProp('status', editEventStatus)
      handleCloseEditDialog()
    }
  }

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false)
    setSelectedEventForEditing(null)
    setEditEventTitle('')
    setEditEventClient('')
    setEditEventServices([])
    setEditEventBarbers([])
    setEditEventStatus('reservada')
  }

  // ============================
  // MANEJADORES PARA CHECKBOXES
  // ============================
  const handleNewServiceChange = (e: React.ChangeEvent<HTMLInputElement>, service: string) => {
    if (e.target.checked) {
      setNewEventServices((prev) => [...prev, service])
    } else {
      setNewEventServices((prev) => prev.filter((s) => s !== service))
    }
  }

  const handleNewBarberChange = (e: React.ChangeEvent<HTMLInputElement>, barber: string) => {
    if (e.target.checked) {
      setNewEventBarbers((prev) => [...prev, barber])
    } else {
      setNewEventBarbers((prev) => prev.filter((b) => b !== barber))
    }
  }

  const handleEditServiceChange = (e: React.ChangeEvent<HTMLInputElement>, service: string) => {
    if (e.target.checked) {
      setEditEventServices((prev) => [...prev, service])
    } else {
      setEditEventServices((prev) => prev.filter((s) => s !== service))
    }
  }

  const handleEditBarberChange = (e: React.ChangeEvent<HTMLInputElement>, barber: string) => {
    if (e.target.checked) {
      setEditEventBarbers((prev) => [...prev, barber])
    } else {
      setEditEventBarbers((prev) => prev.filter((b) => b !== barber))
    }
  }

  // ============================
  // RENDERIZADO DEL COMPONENTE
  // ============================
  return (
    <div>
      <div className="flex w-full px-3 justify-start items-start gap-8">
        {/* Lista de citas */}
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

        {/* Calendario */}
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

      {/* Dialog para agregar cita */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir cita</DialogTitle>
          </DialogHeader>
          <form className="space-y-5 mb-4" onSubmit={handleAddEvent}>
            {/* Seleccionar cliente */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Seleccionar cliente
              </label>
              <select
                value={newEventClient}
                onChange={(e) => setNewEventClient(e.target.value)}
                className="border border-gray-200 p-3 rounded-md w-full"
              >
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
                  <input
                    type="checkbox"
                    id="servicio1"
                    checked={newEventServices.includes('Servicio 1')}
                    onChange={(e) => handleNewServiceChange(e, 'Servicio 1')}
                    className="mr-2"
                  />
                  <label htmlFor="servicio1">Servicio 1</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="servicio2"
                    checked={newEventServices.includes('Servicio 2')}
                    onChange={(e) => handleNewServiceChange(e, 'Servicio 2')}
                    className="mr-2"
                  />
                  <label htmlFor="servicio2">Servicio 2</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="servicio3"
                    checked={newEventServices.includes('Servicio 3')}
                    onChange={(e) => handleNewServiceChange(e, 'Servicio 3')}
                    className="mr-2"
                  />
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
                  <input
                    type="checkbox"
                    id="barbero1"
                    checked={newEventBarbers.includes('David')}
                    onChange={(e) => handleNewBarberChange(e, 'David')}
                    className="mr-2"
                  />
                  <label htmlFor="barbero1">David</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="barbero2"
                    checked={newEventBarbers.includes('Julio')}
                    onChange={(e) => handleNewBarberChange(e, 'Julio')}
                    className="mr-2"
                  />
                  <label htmlFor="barbero2">Julio</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="barbero3"
                    checked={newEventBarbers.includes('Pedro')}
                    onChange={(e) => handleNewBarberChange(e, 'Pedro')}
                    className="mr-2"
                  />
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
                className="border border-gray-200 p-3 rounded-md text-lg w-full"
              />
            </div>

            {/* Seleccionar estado de la cita */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Seleccionar estado
              </label>
              <select
                value={newEventStatus}
                onChange={(e) => setNewEventStatus(e.target.value)}
                className="border border-gray-200 p-3 rounded-md w-full"
              >
                <option value="reservada">reservada</option>
                <option value="confirmada">confirmada</option>
                <option value="finalizado">finalizado</option>
                <option value="cancelar">cancelar</option>
              </select>
            </div>

            {/* Botones */}
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

      {/* Dialog para editar cita */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar cita</DialogTitle>
          </DialogHeader>
          <form className="space-y-5 mb-4" onSubmit={handleEditEvent}>
            {/* Seleccionar cliente */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Seleccionar cliente
              </label>
              <select
                value={editEventClient}
                onChange={(e) => setEditEventClient(e.target.value)}
                className="border border-gray-200 p-3 rounded-md w-full"
              >
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
                  <input
                    type="checkbox"
                    id="edit-servicio1"
                    checked={editEventServices.includes('Servicio 1')}
                    onChange={(e) => handleEditServiceChange(e, 'Servicio 1')}
                    className="mr-2"
                  />
                  <label htmlFor="edit-servicio1">Servicio 1</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="edit-servicio2"
                    checked={editEventServices.includes('Servicio 2')}
                    onChange={(e) => handleEditServiceChange(e, 'Servicio 2')}
                    className="mr-2"
                  />
                  <label htmlFor="edit-servicio2">Servicio 2</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="edit-servicio3"
                    checked={editEventServices.includes('Servicio 3')}
                    onChange={(e) => handleEditServiceChange(e, 'Servicio 3')}
                    className="mr-2"
                  />
                  <label htmlFor="edit-servicio3">Servicio 3</label>
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
                  <input
                    type="checkbox"
                    id="edit-barbero1"
                    checked={editEventBarbers.includes('David')}
                    onChange={(e) => handleEditBarberChange(e, 'David')}
                    className="mr-2"
                  />
                  <label htmlFor="edit-barbero1">David</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="edit-barbero2"
                    checked={editEventBarbers.includes('Julio')}
                    onChange={(e) => handleEditBarberChange(e, 'Julio')}
                    className="mr-2"
                  />
                  <label htmlFor="edit-barbero2">Julio</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="edit-barbero3"
                    checked={editEventBarbers.includes('Pedro')}
                    onChange={(e) => handleEditBarberChange(e, 'Pedro')}
                    className="mr-2"
                  />
                  <label htmlFor="edit-barbero3">Pedro</label>
                </div>
              </div>
            </div>

            {/* Editar descripción */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Editar descripción
              </label>
              <input
                type="text"
                placeholder="Descripción de la cita"
                value={editEventTitle}
                onChange={(e) => setEditEventTitle(e.target.value)}
                required
                className="border border-gray-200 p-3 rounded-md text-lg w-full"
              />
            </div>

            {/* Seleccionar estado de la cita */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Seleccionar estado
              </label>
              <select
                value={editEventStatus}
                onChange={(e) => setEditEventStatus(e.target.value)}
                className="border border-gray-200 p-3 rounded-md w-full"
              >
                <option value="reservada">reservada</option>
                <option value="confirmada">confirmada</option>
                <option value="finalizado">finalizado</option>
                <option value="cancelar">cancelar</option>
              </select>
            </div>

            {/* Botones */}
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
//
export default Calendar
