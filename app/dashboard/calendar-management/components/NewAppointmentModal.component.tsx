'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar, Clock, Plus } from 'lucide-react'
import { useCustomers } from '../../hook/client/useCustomerQueries'
import { useServices } from '../../hook/client/useServiceQueries'
import { useStaff } from '../../hook/client/useStaffQueries'
import { useStatus } from '../../hook/client/useStatusQueries'
import { useCreateAppointment, CreateAppointmentRequest } from '../../hook/client/useAppointmentQueries'
import { useToast } from '@/hooks/use-toast'
import { handleAppointmentCreationError } from '../utils/apiErrorHandler'

interface NewAppointmentData {
  cliente: string
  servicio: string
  barbero: string
  horaInicio: string
  estado: string
  fecha: string
}

interface NewAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate?: string
  onCreateAppointment: (appointment: NewAppointmentData) => void
}

export function NewAppointmentModal ({
  isOpen,
  onClose,
  selectedDate,
  onCreateAppointment
}: NewAppointmentModalProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const idLocation = searchParams.get('idLocation') || ''
  const { toast } = useToast()

  // Hook para crear citas
  const createAppointmentMutation = useCreateAppointment()

  // Hook para obtener clientes - solo se ejecuta cuando el modal está abierto
  const { data: customersData, isLoading: isLoadingCustomers, error: customersError } = useCustomers({
    pageIndex: 1,
    pageSize: 100,
    orderBy: 'id',
    sortBy: 'ASC',
    fields: 'name_customer',
    filters: { status_customer: 'active' },
    enabled: isOpen
  })

  // Hook para obtener servicios - solo se ejecuta cuando el modal está abierto y hay idLocation
  const { data: servicesData, isLoading: isLoadingServices, error: servicesError } = useServices({
    location_id: idLocation,
    pageIndex: 1,
    pageSize: 100,
    orderBy: 'service_name',
    sortBy: 'ASC',
    enabled: isOpen && Boolean(idLocation) && idLocation !== ''
  })

  // Hook para obtener staff/barberos - solo se ejecuta cuando el modal está abierto y hay idLocation
  const { data: staffData, isLoading: isLoadingStaff, error: staffError } = useStaff({
    location_id: idLocation,
    role_id: 9, // Siempre 9 para barberos
    pageIndex: 1,
    pageSize: 100,
    orderBy: 'id',
    sortBy: 'ASC',
    enabled: isOpen && Boolean(idLocation) && idLocation !== ''
  })

  // Hook para obtener estados de citas - solo se ejecuta cuando el modal está abierto
  const { data: statusData, isLoading: isLoadingStatus, error: statusError } = useStatus({
    table_name: 'StatusCitaCalendario',
    pageIndex: 1,
    pageSize: 100,
    orderBy: 'item_order',
    sortBy: 'ASC',
    enabled: isOpen
  })

  const [formData, setFormData] = useState<NewAppointmentData>({
    cliente: '',
    servicio: '',
    barbero: '',
    horaInicio: '09:00',
    estado: '5', // Valor por defecto "5" que corresponde a "Reservada" (maintable_id)
    fecha: selectedDate || new Date().toISOString().split('T')[0]
  })

  // Limpiar datos cuando se abre el modal
  const resetFormData = useCallback(() => {
    setFormData({
      cliente: '',
      servicio: '',
      barbero: '',
      horaInicio: '09:00',
      estado: '5', // Valor por defecto "5" que corresponde a "Reservada" (maintable_id)
      fecha: selectedDate || new Date().toISOString().split('T')[0]
    })
  }, [selectedDate])

  // Ejecutar reset cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      resetFormData()
    }
  }, [isOpen, resetFormData])

  // Función helper para calcular start_datetime y end_datetime
  const calculateAppointmentDateTimes = (
    fecha: string,
    horaInicio: string,
    serviceDurationMinutes: number
  ) => {
    // Crear fecha de inicio
    const startDateTime = new Date(`${fecha}T${horaInicio}:00`)

    // Calcular fecha de fin sumando la duración del servicio
    const endDateTime = new Date(startDateTime.getTime() + serviceDurationMinutes * 60000)

    // Formatear en formato ISO string
    const formatToISO = (date: Date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
    }

    return {
      startDatetime: formatToISO(startDateTime),
      endDatetime: formatToISO(endDateTime)
    }
  }

  const handleSubmit = async () => {
    // Validar que todos los campos estén completos
    if (!formData.cliente || !formData.servicio || !formData.barbero) {
      toast({
        title: 'Error de validación',
        description: 'Por favor completa todos los campos obligatorios',
        variant: 'destructive'
      })
      return
    }

    // Obtener duración del servicio seleccionado
    const selectedService = servicesData?.data?.find(
      service => service.service_id.toString() === formData.servicio
    )

    if (!selectedService?.duration_minutes) {
      toast({
        title: 'Error',
        description: 'No se pudo obtener la duración del servicio seleccionado',
        variant: 'destructive'
      })
      return
    }

    // Calcular las fechas de inicio y fin
    const { startDatetime, endDatetime } = calculateAppointmentDateTimes(
      formData.fecha,
      formData.horaInicio,
      selectedService.duration_minutes
    )

    // Preparar datos para la API
    const appointmentData: CreateAppointmentRequest = {
      customer_id: parseInt(formData.cliente),
      end_datetime: endDatetime,
      location_id: parseInt(idLocation),
      service_id: parseInt(formData.servicio),
      start_datetime: startDatetime,
      status_maintable_id: parseInt(formData.estado),
      user_id: parseInt(formData.barbero)
    }

    try {
      await createAppointmentMutation.mutateAsync(appointmentData)

      toast({
        title: 'Cita creada exitosamente',
        description: `La cita ha sido programada para el ${formatSelectedDate(formData.fecha)} a las ${formData.horaInicio}`,
        variant: 'default'
      })

      onCreateAppointment(formData)
      onClose()
    } catch (error) {
      console.error('Error al crear la cita:', error)

      const errorInfo = handleAppointmentCreationError(error)

      toast({
        title: errorInfo.title,
        description: errorInfo.description,
        variant: 'destructive'
      })
    }
  }

  const formatSelectedDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Nueva Cita
          </DialogTitle>
          <DialogDescription>
            Completa los campos para crear una nueva cita en la fecha {formatSelectedDate(formData.fecha)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Cliente */}
          <div className="space-y-2">
            <Label htmlFor="cliente">Cliente *</Label>
            <Select
              value={formData.cliente}
              onValueChange={(value) => setFormData(prev => ({ ...prev, cliente: value }))}
              disabled={isLoadingCustomers}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  isLoadingCustomers
                    ? 'Cargando clientes...'
                    : customersError
                      ? 'Error al cargar clientes'
                      : 'Seleccionar cliente...'
                } />
              </SelectTrigger>
              <SelectContent>
                {customersData?.data?.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id.toString()}>
                    {cliente.name_customer || `Cliente ${cliente.id}`}
                  </SelectItem>
                ))}
                {customersData?.data?.length === 0 && (
                  <div className="px-2 py-1 text-sm text-gray-500">
                    No hay clientes disponibles
                  </div>
                )}
                <div className="px-2 py-1 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => {
                      router.push('/dashboard/customer-management')
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Crear nuevo cliente
                  </Button>
                </div>
              </SelectContent>
            </Select>
            {customersError && (
              <p className="text-xs text-red-500">
                Error al cargar los clientes. Inténtalo de nuevo.
              </p>
            )}
          </div>

          {/* Servicio */}
          <div className="space-y-2">
            <Label htmlFor="servicio">Servicio *</Label>
            <Select
              value={formData.servicio}
              onValueChange={(value) => setFormData(prev => ({ ...prev, servicio: value }))}
              disabled={isLoadingServices}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  isLoadingServices
                    ? 'Cargando servicios...'
                    : servicesError
                      ? 'Error al cargar servicios'
                      : !idLocation
                          ? 'Seleccione ubicación primero'
                          : 'Seleccionar servicio...'
                } />
              </SelectTrigger>
              <SelectContent>
                {servicesData?.data?.map((servicio) => (
                  <SelectItem key={servicio.service_id} value={servicio.service_id.toString()}>
                    {servicio.service_name || `Servicio ${servicio.service_id}`}
                    {servicio.duration_minutes && ` (${servicio.duration_minutes} min)`}
                    {servicio.price && ` - S/ ${servicio.price}`}
                  </SelectItem>
                ))}
                {servicesData?.data?.length === 0 && (
                  <div className="px-2 py-1 text-sm text-gray-500">
                    No hay servicios disponibles para esta ubicación
                  </div>
                )}
                <div className="px-2 py-1 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => {
                      router.push(`/dashboard/service-management?locationFilter=${idLocation}`)
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Crear nuevo servicio
                  </Button>
                </div>
              </SelectContent>
            </Select>
            {servicesError && (
              <p className="text-xs text-red-500">
                Error al cargar los servicios. Inténtalo de nuevo.
              </p>
            )}
            {!idLocation && (
              <p className="text-xs text-yellow-600">
                Para ver los servicios, asegúrate de que la URL contenga el parámetro idLocation.
              </p>
            )}
          </div>

          {/* Barbero */}
          <div className="space-y-2">
            <Label htmlFor="barbero">Barbero *</Label>
            <Select
              value={formData.barbero}
              onValueChange={(value) => setFormData(prev => ({ ...prev, barbero: value }))}
              disabled={isLoadingStaff}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  isLoadingStaff
                    ? 'Cargando barberos...'
                    : staffError
                      ? 'Error al cargar barberos'
                      : !idLocation
                          ? 'Seleccione ubicación primero'
                          : 'Seleccionar barbero...'
                } />
              </SelectTrigger>
              <SelectContent>
                {staffData?.data?.map((barbero) => (
                  <SelectItem key={barbero.id} value={barbero.id.toString()}>
                    {barbero.user_name || `Barbero ${barbero.id}`}
                  </SelectItem>
                ))}
                {staffData?.data?.length === 0 && (
                  <div className="px-2 py-1 text-sm text-gray-500">
                    No hay barberos disponibles para esta ubicación
                  </div>
                )}
              </SelectContent>
            </Select>
            {staffError && (
              <p className="text-xs text-red-500">
                Error al cargar los barberos. Inténtalo de nuevo.
              </p>
            )}
            {!idLocation && (
              <p className="text-xs text-yellow-600">
                Para ver los barberos, asegúrate de que la URL contenga el parámetro idLocation.
              </p>
            )}
          </div>

          {/* Hora inicio */}
          <div className="space-y-2">
            <Label htmlFor="hora-inicio" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Hora inicio *
            </Label>
            <Input
              id="hora-inicio"
              type="time"
              value={formData.horaInicio}
              onChange={(e) => setFormData(prev => ({ ...prev, horaInicio: e.target.value }))}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              La hora de fin se calculará automáticamente según la duración del servicio
            </p>
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <Label htmlFor="estado">Estado *</Label>
            <Select
              value={formData.estado}
              onValueChange={(value) => setFormData(prev => ({ ...prev, estado: value }))}
              disabled={isLoadingStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  isLoadingStatus
                    ? 'Cargando estados...'
                    : statusError
                      ? 'Error al cargar estados'
                      : 'Seleccionar estado...'
                } />
              </SelectTrigger>
              <SelectContent>
                {statusData?.data?.map((estado) => (
                  <SelectItem key={estado.maintable_id} value={estado.maintable_id.toString()}>
                    {estado.item_text}
                  </SelectItem>
                ))}
                {statusData?.data?.length === 0 && (
                  <div className="px-2 py-1 text-sm text-gray-500">
                    No hay estados disponibles
                  </div>
                )}
              </SelectContent>
            </Select>
            {statusError && (
              <p className="text-xs text-red-500">
                Error al cargar los estados. Inténtalo de nuevo.
              </p>
            )}
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose} disabled={createAppointmentMutation.isPending}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createAppointmentMutation.isPending}
          >
            {createAppointmentMutation.isPending ? 'Creando...' : 'Crear Cita'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
