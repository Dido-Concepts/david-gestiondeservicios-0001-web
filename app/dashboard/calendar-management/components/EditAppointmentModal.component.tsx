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
import { Calendar, Clock, Edit, Trash2 } from 'lucide-react'
import { useCustomers } from '../../hook/client/useCustomerQueries'
import { useServices } from '../../hook/client/useServiceQueries'
import { useStaff } from '../../hook/client/useStaffQueries'
import { useStatus } from '../../hook/client/useStatusQueries'
import { useUpdateAppointment, useDeleteAppointment, UpdateAppointmentRequest, AppointmentResponseModel } from '../../hook/client/useAppointmentQueries'
import { useToast } from '@/hooks/use-toast'
import { handleAppointmentCreationError } from '../utils/apiErrorHandler'

interface EditAppointmentData {
  cliente: string
  servicio: string
  barbero: string
  horaInicio: string
  estado: string
  fecha: string
}

interface EditAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  appointment?: AppointmentResponseModel | null
  onUpdateAppointment?: (appointment: EditAppointmentData) => void
}

export function EditAppointmentModal ({
  isOpen,
  onClose,
  appointment,
  onUpdateAppointment
}: EditAppointmentModalProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const idLocation = searchParams.get('idLocation') || ''
  const { toast } = useToast()

  // Hook para actualizar citas
  const updateAppointmentMutation = useUpdateAppointment()

  // Hook para eliminar citas
  const deleteAppointmentMutation = useDeleteAppointment()

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

  const [formData, setFormData] = useState<EditAppointmentData>({
    cliente: '',
    servicio: '',
    barbero: '',
    horaInicio: '09:00',
    estado: '5',
    fecha: new Date().toISOString().split('T')[0]
  })

  // Estado para el modal de confirmación de eliminación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Función para poblar el formulario con los datos de la cita
  const populateFormWithAppointment = useCallback(() => {
    if (appointment) {
      // Extraer fecha y hora del start_datetime
      const startDate = new Date(appointment.start_datetime)
      // Usar métodos locales para evitar desfase de zona horaria
      const year = startDate.getFullYear()
      const month = String(startDate.getMonth() + 1).padStart(2, '0')
      const day = String(startDate.getDate()).padStart(2, '0')
      const fecha = `${year}-${month}-${day}`
      const horaInicio = startDate.toTimeString().substring(0, 5) // HH:MM format

      setFormData({
        cliente: appointment.customer_id.toString(),
        servicio: appointment.service_id.toString(),
        barbero: appointment.user_id.toString(),
        horaInicio,
        estado: appointment.status_id.toString(),
        fecha
      })
    }
  }, [appointment])

  // Limpiar y poblar datos cuando se abre el modal con una cita
  useEffect(() => {
    if (isOpen && appointment) {
      populateFormWithAppointment()
    }
  }, [isOpen, appointment, populateFormWithAppointment])

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
    if (!appointment) {
      toast({
        title: 'Error',
        description: 'No se encontró la información de la cita a actualizar',
        variant: 'destructive'
      })
      return
    }

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
    const appointmentData: UpdateAppointmentRequest = {
      customer_id: parseInt(formData.cliente),
      end_datetime: endDatetime,
      location_id: parseInt(idLocation),
      service_id: parseInt(formData.servicio),
      start_datetime: startDatetime,
      status_maintable_id: parseInt(formData.estado),
      user_id: parseInt(formData.barbero)
    }

    try {
      await updateAppointmentMutation.mutateAsync({
        appointmentId: appointment.appointment_id,
        appointmentData
      })

      toast({
        title: 'Cita actualizada exitosamente',
        description: `La cita ha sido reprogramada para el ${formatSelectedDate(formData.fecha)} a las ${formData.horaInicio}`,
        variant: 'default'
      })

      onUpdateAppointment?.(formData)
      onClose()
    } catch (error) {
      console.error('Error al actualizar la cita:', error)

      const errorInfo = handleAppointmentCreationError(error)

      toast({
        title: errorInfo.title,
        description: errorInfo.description,
        variant: 'destructive'
      })
    }
  }

  const handleDeleteAppointment = () => {
    if (!appointment) {
      toast({
        title: 'Error',
        description: 'No se encontró la información de la cita a eliminar',
        variant: 'destructive'
      })
      return
    }

    // Mostrar modal de confirmación
    setShowDeleteConfirm(true)
  }

  const confirmDeleteAppointment = async () => {
    if (!appointment) return

    try {
      await deleteAppointmentMutation.mutateAsync(appointment.appointment_id)

      toast({
        title: 'Cita eliminada exitosamente',
        description: `La cita de ${appointment.customer_name} ha sido eliminada`,
        variant: 'default'
      })

      setShowDeleteConfirm(false)
      onClose()
    } catch (error) {
      console.error('Error al eliminar la cita:', error)

      toast({
        title: 'Error al eliminar la cita',
        description: 'No se pudo eliminar la cita. Inténtalo de nuevo.',
        variant: 'destructive'
      })

      setShowDeleteConfirm(false)
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

  // Obtener el nombre del cliente actual para mostrar en el título
  const currentCustomerName = appointment?.customer_name || 'Cliente'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto p-4 sm:p-6" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
            Editar Cita
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Modifica los campos para actualizar la cita de {currentCustomerName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 py-2 sm:py-4">
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
                    <Edit className="h-4 w-4" />
                    Gestionar clientes
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
                    <Edit className="h-4 w-4" />
                    Gestionar servicios
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

          {/* Fecha */}
          <div className="space-y-2">
            <Label htmlFor="fecha" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Fecha *
            </Label>
            <Input
              id="fecha"
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
              className="w-full"
            />
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
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0 pt-3 sm:pt-4">
          {/* Botón de eliminar */}
          <Button
            variant="destructive"
            onClick={handleDeleteAppointment}
            disabled={updateAppointmentMutation.isPending || deleteAppointmentMutation.isPending}
            className="flex items-center justify-center gap-2 w-full sm:w-auto order-last sm:order-first"
          >
            <Trash2 className="h-4 w-4" />
            {deleteAppointmentMutation.isPending ? 'Eliminando...' : 'Eliminar'}
          </Button>

          {/* Botones de acción */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
            <Button variant="outline" onClick={onClose} disabled={updateAppointmentMutation.isPending || deleteAppointmentMutation.isPending} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={updateAppointmentMutation.isPending || deleteAppointmentMutation.isPending}
              className="w-full sm:w-auto"
            >
              {updateAppointmentMutation.isPending ? 'Actualizando...' : 'Actualizar Cita'}
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Modal de confirmación de eliminación */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="w-[95vw] max-w-[400px] p-4 sm:p-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="flex items-center gap-2 text-red-600 text-base sm:text-lg">
              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
              Confirmar Eliminación
            </DialogTitle>
            <DialogDescription className="pt-2 text-xs sm:text-sm">
              ¿Estás seguro de que deseas eliminar la cita de{' '}
              <span className="font-semibold">{appointment?.customer_name}</span>?
              <br />
              <br />
              <span className="text-xs sm:text-sm text-gray-600">
                Esta acción no se puede deshacer.
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleteAppointmentMutation.isPending}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteAppointment}
              disabled={deleteAppointmentMutation.isPending}
              className="flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4" />
              {deleteAppointmentMutation.isPending ? 'Eliminando...' : 'Eliminar Cita'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
