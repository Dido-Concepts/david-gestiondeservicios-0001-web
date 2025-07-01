'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { DateSelectArg } from '@fullcalendar/core'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSuspenseQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import {
  CalendarEvent,
  mockCalendarAPI,
  User,
  Service,
  Barber,
  StatusOption,
  getActiveCustomersForCalendar,
  getActiveServicesForCalendar,
  getCalendarStatusOptions
} from './CalendarAPI.service'
import { QUERY_KEYS_CUSTOMER_MANAGEMENT, QUERY_KEYS_SERVICE_MANAGEMENT, QUERY_KEYS_MAINTABLE_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { Calendar, Check, ChevronsUpDown, Trash2, User as UserIcon, Scissors, Users, Clock, Plus } from 'lucide-react'

// ============================
// ESQUEMA DE VALIDACIÓN
// ============================
const eventSchema = z.object({
  startTime: z.string().min(1, 'La hora de inicio es requerida'),
  clientId: z.string().min(1, 'Debe seleccionar un cliente'),
  serviceId: z.string().min(1, 'Debe seleccionar un servicio'),
  barberId: z.string().min(1, 'Debe seleccionar un barbero'),
  status: z.string().min(1, 'Debe seleccionar un estado')
})

type EventFormData = z.infer<typeof eventSchema>

// ============================
// HOOKS
// ============================
const useUsers = () => {
  return useSuspenseQuery<User[]>({
    queryKey: [QUERY_KEYS_CUSTOMER_MANAGEMENT.CMActiveCustomers],
    queryFn: () => getActiveCustomersForCalendar()
  })
}

const useServices = (locationId: string) => {
  return useSuspenseQuery<Service[]>({
    queryKey: [QUERY_KEYS_SERVICE_MANAGEMENT.CMActiveServices, locationId],
    queryFn: () => getActiveServicesForCalendar(locationId)
  })
}

const useBarbers = (locationId: string) => {
  return useSuspenseQuery<Barber[]>({
    queryKey: ['barbers', locationId],
    queryFn: () => mockCalendarAPI.getBarbers(locationId)
  })
}

const useStatusOptions = () => {
  return useSuspenseQuery<StatusOption[]>({
    queryKey: [QUERY_KEYS_MAINTABLE_MANAGEMENT.CMCalendarStatusOptions],
    queryFn: () => getCalendarStatusOptions()
  })
}

// ============================
// UTILIDADES PARA PERÚ
// ============================
const getPeruDate = (): Date => {
  const now = new Date()
  // Crear fecha ajustada a la zona horaria de Perú (UTC-5)
  return new Date(now.toLocaleString('en-US', { timeZone: 'America/Lima' }))
}

const generateTitle = (service: Service | null): string => {
  return service?.name || 'Nueva cita'
}

const combineDateTime = (dateStr: string, timeStr: string): string => {
  // Crear fecha base usando fecha seleccionada
  const [year, month, day] = dateStr.split('T')[0].split('-')
  const [hours, minutes] = timeStr.split(':')

  // Crear fecha en zona horaria de Perú
  const date = new Date()
  date.setFullYear(parseInt(year), parseInt(month) - 1, parseInt(day))
  date.setHours(parseInt(hours), parseInt(minutes), 0, 0)

  return date.toISOString()
}

const calculateEndTime = (startTime: string, durationMinutes: number): string => {
  const [hours, minutes] = startTime.split(':')
  const startMinutes = parseInt(hours) * 60 + parseInt(minutes)
  const endMinutes = startMinutes + durationMinutes

  const endHours = Math.floor(endMinutes / 60)
  const endMins = endMinutes % 60

  return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`
}

const extractTimeFromDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  // Ajustar a zona horaria de Perú
  const peruDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Lima' }))
  return peruDate.toTimeString().slice(0, 5) // HH:MM format
}

// ============================
// INTERFACES
// ============================
interface CreateEventModalProps {
  isOpen: boolean
  selectedDate: DateSelectArg | null
  onClose: () => void
  onCreate: (eventData: Omit<CalendarEvent, 'id'>) => void
  onUpdate?: (id: string, eventData: Partial<CalendarEvent>) => void
  onDelete?: (id: string) => void
  locationFilter: string
  editingEvent?: CalendarEvent | null
  mode?: 'create' | 'edit'
}

// ============================
// COMPONENTE SELECTOR DE USUARIO
// ============================
const UserSelector: React.FC<{
  value: string
  onChange: (value: string) => void
  users: User[]
}> = ({ value, onChange, users }) => {
  const [open, setOpen] = useState(false)
  const selectedUser = users.find(user => user.id === value)
  const router = useRouter()

  const handleAddClient = () => {
    setOpen(false)
    router.push('/dashboard/customer-management')
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedUser
            ? (
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span>{selectedUser.name}</span>
            </div>
              )
            : (
                'Seleccionar cliente...'
              )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        side="bottom"
        align="start"
        sideOffset={4}
        avoidCollisions={true}
        collisionPadding={10}
      >
        <Command>
          <CommandInput placeholder="Buscar cliente..." />
          <CommandList>
            <CommandEmpty>No se encontraron clientes.</CommandEmpty>
            <CommandGroup>
              {/* Botón para agregar nuevo cliente */}
              <CommandItem
                onSelect={handleAddClient}
                className="border-b border-gray-200 bg-blue-50 hover:bg-blue-100"
              >
                <Plus className="mr-2 h-4 w-4 text-blue-600" />
                <div className="flex flex-col">
                  <span className="font-medium text-blue-600">Agregar nuevo cliente</span>
                  <span className="text-xs text-blue-500">Ir a gestión de clientes</span>
                </div>
              </CommandItem>

              {/* Lista de clientes existentes */}
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.name}
                  onSelect={() => {
                    onChange(user.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === user.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// ============================
// COMPONENTE SELECTOR DE SERVICIOS
// ============================
const ServiceSelector: React.FC<{
  value: string
  onChange: (value: string) => void
  services: Service[]
}> = ({ value, onChange, services }) => {
  const [open, setOpen] = useState(false)
  const selectedService = services.find(service => service.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedService
            ? (
            <div className="flex items-center gap-2">
              <Scissors className="h-4 w-4" />
              <span>{selectedService.name}</span>
            </div>
              )
            : (
                'Seleccionar servicio...'
              )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        side="bottom"
        align="start"
        sideOffset={4}
        avoidCollisions={true}
        collisionPadding={10}
      >
        <Command>
          <CommandInput placeholder="Buscar servicio..." />
          <CommandList>
            <CommandEmpty>No se encontraron servicios.</CommandEmpty>
            <CommandGroup>
              {services.map((service) => (
                <CommandItem
                  key={service.id}
                  value={service.name}
                  onSelect={() => {
                    onChange(service.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === service.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <div className="flex flex-col flex-1">
                    <span className="font-medium">{service.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {service.category} • {service.duration}min • ${service.price}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// ============================
// COMPONENTE SELECTOR DE BARBEROS
// ============================
const BarberSelector: React.FC<{
  value: string
  onChange: (value: string) => void
  barbers: Barber[]
}> = ({ value, onChange, barbers }) => {
  const [open, setOpen] = useState(false)
  const selectedBarber = barbers.find(barber => barber.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedBarber
            ? (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{selectedBarber.name}</span>
            </div>
              )
            : (
                'Seleccionar barbero...'
              )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        side="bottom"
        align="start"
        sideOffset={4}
        avoidCollisions={true}
        collisionPadding={10}
      >
        <Command>
          <CommandInput placeholder="Buscar barbero..." />
          <CommandList>
            <CommandEmpty>No se encontraron barberos.</CommandEmpty>
            <CommandGroup>
              {barbers.map((barber) => (
                <CommandItem
                  key={barber.id}
                  value={barber.name}
                  onSelect={() => {
                    onChange(barber.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === barber.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <div className="flex flex-col flex-1">
                    <span className="font-medium">{barber.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {barber.specialties.join(', ')}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// ============================
// COMPONENTE PRINCIPAL
// ============================
export const CreateEventModal: React.FC<CreateEventModalProps> = React.memo(({
  isOpen,
  selectedDate,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
  locationFilter,
  editingEvent,
  mode = 'create'
}) => {
  const { data: users = [] } = useUsers()
  const { data: services = [] } = useServices(locationFilter)
  const { data: barbers = [] } = useBarbers(locationFilter)
  const { data: statusOptions = [] } = useStatusOptions()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      startTime: '',
      clientId: '',
      serviceId: '',
      barberId: '',
      status: ''
    }
  })

  // Estado para el modal de confirmación de eliminación
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  // ============================
  // EFECTOS
  // ============================
  useEffect(() => {
    if (isOpen) {
      // Limpiar estado de confirmación de eliminación al abrir el modal
      setShowDeleteConfirmation(false)

      if (mode === 'edit' && editingEvent) {
        // Cargar datos del evento para editar
        const clientId = users.find(u => u.name === editingEvent.client)?.id || ''
        const serviceId = services.find(s => s.name === editingEvent.service)?.id || ''
        const barberId = barbers.find(b => b.name === editingEvent.barber)?.id || ''

        reset({
          startTime: extractTimeFromDate(editingEvent.start),
          clientId,
          serviceId,
          barberId,
          status: editingEvent.status
        })
      } else if (mode === 'create' && selectedDate) {
        // Configurar horario por defecto para crear (usar hora actual de Perú)
        const peruNow = getPeruDate()
        const currentHour = peruNow.getHours()
        const defaultStartTime = `${currentHour.toString().padStart(2, '0')}:00`

        reset({
          startTime: defaultStartTime,
          clientId: '',
          serviceId: '',
          barberId: '',
          status: ''
        })
      }
    }
  }, [isOpen, mode, editingEvent, selectedDate, reset, users, services, barbers])

  // ============================
  // HANDLERS
  // ============================
  const onSubmit = useCallback(async (data: EventFormData) => {
    try {
      const selectedUser = users.find(u => u.id === data.clientId)
      const selectedService = services.find(s => s.id === data.serviceId)
      const selectedBarber = barbers.find(b => b.id === data.barberId)

      if (!selectedUser || !selectedService || !selectedBarber) {
        throw new Error('Faltan datos requeridos')
      }

      // Generar título automáticamente basado en el servicio
      const title = generateTitle(selectedService)

      // Calcular hora de fin automáticamente basada en la duración del servicio
      const endTime = calculateEndTime(data.startTime, selectedService.duration)

      // Combinar fecha seleccionada con las horas
      let startDateTime: string
      let endDateTime: string

      if (selectedDate) {
        // Corregir la fecha para evitar el día anterior
        const selectedDateStr = selectedDate.startStr
        const baseDate = selectedDateStr.includes('T') ? selectedDateStr.split('T')[0] : selectedDateStr
        startDateTime = combineDateTime(baseDate, data.startTime)
        endDateTime = combineDateTime(baseDate, endTime)
      } else if (editingEvent) {
        const baseDate = editingEvent.start.split('T')[0]
        startDateTime = combineDateTime(baseDate, data.startTime)
        endDateTime = combineDateTime(baseDate, endTime)
      } else {
        // Usar fecha actual de Perú si no hay fecha seleccionada
        const peruNow = getPeruDate()
        const todayStr = peruNow.toISOString().split('T')[0]
        startDateTime = combineDateTime(todayStr, data.startTime)
        endDateTime = combineDateTime(todayStr, endTime)
      }

      const eventData = {
        title,
        start: startDateTime,
        end: endDateTime,
        allDay: false,
        locationId: locationFilter,
        client: selectedUser.name,
        service: selectedService.name,
        barber: selectedBarber.name,
        status: data.status || '1' // Default: Reservada
      }

      console.log('📋 Datos del evento a guardar:', eventData)

      if (mode === 'edit' && editingEvent && onUpdate) {
        await onUpdate(editingEvent.id, eventData)
      } else {
        await onCreate(eventData)
      }

      onClose()
    } catch (error) {
      console.error('❌ Error guardando evento:', error)
    }
  }, [users, services, barbers, selectedDate, editingEvent, locationFilter, mode, onUpdate, onCreate, onClose])

  const handleDelete = useCallback(async () => {
    if (editingEvent && onDelete) {
      try {
        await onDelete(editingEvent.id)
        setShowDeleteConfirmation(false)
        onClose()
      } catch (error) {
        console.error('❌ Error eliminando evento:', error)
      }
    }
  }, [editingEvent, onDelete, onClose])

  const handleDeleteClick = useCallback(() => {
    setShowDeleteConfirmation(true)
  }, [])

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirmation(false)
  }, [])

  // ============================
  // RENDER
  // ============================
  const getDisplayDate = () => {
    if (selectedDate) {
      const dateStr = selectedDate.startStr.includes('T') ? selectedDate.startStr.split('T')[0] : selectedDate.startStr
      return format(new Date(dateStr + 'T12:00:00'), 'PPP', { locale: es })
    }
    if (editingEvent) {
      return format(new Date(editingEvent.start), 'PPP', { locale: es })
    }
    return ''
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
                {showDeleteConfirmation
                  ? (
            // Modal de confirmación de eliminación
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                  <Trash2 className="h-5 w-5" />
                  Confirmar Eliminación
                </DialogTitle>
                <DialogDescription>
                  ¿Estás seguro que deseas eliminar esta cita?
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">
                    <strong>Cliente:</strong> {editingEvent?.client}
                  </p>
                  <p className="text-sm text-red-800">
                    <strong>Servicio:</strong> {editingEvent?.service}
                  </p>
                  <p className="text-sm text-red-800">
                    <strong>Fecha:</strong> {editingEvent && format(new Date(editingEvent.start), 'PPP', { locale: es })}
                  </p>
                  <p className="text-sm text-red-800">
                    <strong>Hora:</strong> {editingEvent && format(new Date(editingEvent.start), 'HH:mm', { locale: es })}
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Esta acción no se puede deshacer.
                </p>
              </div>

              <DialogFooter className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelDelete}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Eliminando...' : 'Eliminar Cita'}
                </Button>
              </DialogFooter>
            </>
                    )
                  : (
            // Modal normal de crear/editar
            <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {mode === 'edit' ? 'Editar Cita' : 'Nueva Cita'}
              </DialogTitle>
              <DialogDescription>
                {getDisplayDate()}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Cliente */}
          <div className="space-y-2">
            <Label>Cliente *</Label>
            <Controller
              name="clientId"
              control={control}
              render={({ field }) => (
                <UserSelector
                  value={field.value}
                  onChange={field.onChange}
                  users={users}
                />
              )}
            />
            {errors.clientId && (
              <p className="text-sm text-red-500">{errors.clientId.message}</p>
            )}
          </div>

          {/* Servicio */}
          <div className="space-y-2">
            <Label>Servicio *</Label>
            <Controller
              name="serviceId"
              control={control}
              render={({ field }) => (
                <ServiceSelector
                  value={field.value}
                  onChange={field.onChange}
                  services={services}
                />
              )}
            />
            {errors.serviceId && (
              <p className="text-sm text-red-500">{errors.serviceId.message}</p>
            )}
          </div>

          {/* Barbero */}
          <div className="space-y-2">
            <Label>Barbero *</Label>
            <Controller
              name="barberId"
              control={control}
              render={({ field }) => (
                <BarberSelector
                  value={field.value}
                  onChange={field.onChange}
                  barbers={barbers}
                />
              )}
            />
            {errors.barberId && (
              <p className="text-sm text-red-500">{errors.barberId.message}</p>
            )}
          </div>

          {/* Hora de inicio */}
          <div className="space-y-2">
            <Label htmlFor="startTime" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Hora inicio *
            </Label>
            <Controller
              name="startTime"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="startTime"
                  type="time"
                  className={errors.startTime ? 'border-red-500' : ''}
                />
              )}
            />
            {errors.startTime && (
              <p className="text-sm text-red-500">{errors.startTime.message}</p>
            )}
            <p className="text-xs text-gray-500">
              ⏱️ La hora de fin se calculará automáticamente según la duración del servicio
            </p>
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <Label>Estado *</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Seleccionar Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.id} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>
        </form>

                    <DialogFooter className="flex gap-2">
              {mode === 'edit' && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteClick}
                  disabled={isSubmitting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Guardando...'
                  : mode === 'edit'
                    ? 'Actualizar'
                    : 'Crear Cita'
                }
              </Button>
            </DialogFooter>
          </>
                    )}
      </DialogContent>
    </Dialog>
  )
})

CreateEventModal.displayName = 'CreateEventModal'
