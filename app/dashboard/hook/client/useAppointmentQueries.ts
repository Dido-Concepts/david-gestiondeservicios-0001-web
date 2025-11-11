'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosClientApi } from '@/config/axiosClientApi'
import { useGoogleTokens } from '@/hooks/use-google-tokens'
import { PaginatedItemsViewModel } from '@/modules/share/domain/models/paginate/paginated-items-view.model'

// Modelos de respuesta para las citas
export interface AppointmentResponseModel {
  appointment_id: number
  start_datetime: string
  end_datetime: string
  location_id: number
  location_name: string
  user_id: number
  user_name: string
  service_id: number
  service_name: string
  service_price: string
  service_duration: number
  customer_id: number
  customer_name: string
  customer_phone: string
  status_id: number
  status_name: string
  insert_date: string
  update_date: string
}

// Query Keys
export const APPOINTMENT_QUERY_KEYS = {
  appointments: ['calendar', 'appointments'] as const
}

// Modelo para crear una nueva cita
export interface CreateAppointmentRequest {
  customer_id: number
  end_datetime: string
  location_id: number
  service_id: number
  start_datetime: string
  status_maintable_id: number
  user_id: number
}

// Modelo de respuesta al crear una cita
export interface CreateAppointmentResponse {
  appointment_id: number
}

// Modelo para actualizar una cita existente
export interface UpdateAppointmentRequest {
  customer_id: number
  end_datetime: string
  location_id: number
  service_id: number
  start_datetime: string
  status_maintable_id: number
  user_id: number
}

// Modelo de respuesta al actualizar una cita
export interface UpdateAppointmentResponse {
  appointment_id: number
}

// Modelo de respuesta al eliminar una cita
export interface DeleteAppointmentResponse {
  appointment_id: number
}

/**
 * Hook para obtener las citas del calendario usando la API v2
 */
export const useAppointments = (
  appointmentParams: {
    location_id: string
    start_date?: string
    end_date?: string
    pageIndex?: number
    pageSize?: number
    orderBy?: string
    sortBy?: 'ASC' | 'DESC'
    enabled?: boolean
  }
) => {
  const { hasTokens } = useGoogleTokens()

  // Aplicar valores por defecto
  const params = {
    location_id: appointmentParams.location_id || '',
    start_date: appointmentParams.start_date,
    end_date: appointmentParams.end_date,
    pageIndex: appointmentParams.pageIndex ?? 1,
    pageSize: appointmentParams.pageSize ?? 100,
    orderBy: appointmentParams.orderBy ?? 'start_datetime',
    sortBy: appointmentParams.sortBy ?? 'ASC',
    enabled: appointmentParams.enabled ?? true
  }

  return useQuery({
    queryKey: [...APPOINTMENT_QUERY_KEYS.appointments, params],
    queryFn: async (): Promise<PaginatedItemsViewModel<AppointmentResponseModel>> => {
      // Construir filtros
      const filters: Record<string, string | number> = {
        location_id: parseInt(params.location_id)
      }

      if (params.start_date) {
        filters.start_date = params.start_date
      }

      if (params.end_date) {
        filters.end_date = params.end_date
      }

      const response = await axiosClientApi.get('/api/v2/appointments', {
        params: {
          page_index: params.pageIndex,
          page_size: params.pageSize,
          order_by: params.orderBy,
          sort_by: params.sortBy,
          filters: JSON.stringify(filters)
        }
      })
      return response.data
    },
    enabled: hasTokens && params.enabled && Boolean(params.location_id),
    staleTime: 1000 * 60 * 5, // 5 minutos para citas (cambian más frecuentemente)
    gcTime: 1000 * 60 * 30 // 30 minutos
  })
}

/**
 * Función helper para convertir citas de la API a eventos de FullCalendar
 */
export const appointmentToCalendarEvent = (appointment: AppointmentResponseModel) => {
  // Mapear colores basados en el estado
  const getColorByStatus = (statusName: string) => {
    switch (statusName.toLowerCase()) {
      case 'confirmada':
        return '#10b981' // verde
      case 'reservada':
        return '#3b82f6' // azul
      case 'cancelada':
        return '#ef4444' // rojo
      case 'completada':
        return '#8b5cf6' // púrpura
      default:
        return '#f59e0b' // amarillo
    }
  }

  const backgroundColor = getColorByStatus(appointment.status_name)

  return {
    id: appointment.appointment_id.toString(),
    title: `${appointment.user_name} - ${appointment.service_name}`,
    start: appointment.start_datetime,
    end: appointment.end_datetime,
    backgroundColor,
    borderColor: backgroundColor,
    extendedProps: {
      appointment_id: appointment.appointment_id,
      customer_name: appointment.customer_name,
      customer_phone: appointment.customer_phone,
      service_name: appointment.service_name,
      service_price: appointment.service_price,
      service_duration: appointment.service_duration,
      user_name: appointment.user_name,
      status_name: appointment.status_name,
      location_name: appointment.location_name
    }
  }
}

/**
 * Hook para crear una nueva cita
 */
export const useCreateAppointment = () => {
  const { hasTokens } = useGoogleTokens()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (appointmentData: CreateAppointmentRequest): Promise<CreateAppointmentResponse> => {
      if (!hasTokens) {
        throw new Error('No se encontraron tokens de autenticación')
      }
      const response = await axiosClientApi.post('/api/v2/appointments', appointmentData)
      return response.data
    },
    onSuccess: () => {
      // Invalidar todas las queries de appointments para refrescar los datos
      queryClient.invalidateQueries({
        queryKey: APPOINTMENT_QUERY_KEYS.appointments
      })
    }
  })
}

/**
 * Hook para actualizar una cita existente
 */
export const useUpdateAppointment = () => {
  const { hasTokens } = useGoogleTokens()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      appointmentId,
      appointmentData
    }: {
      appointmentId: number
      appointmentData: UpdateAppointmentRequest
    }): Promise<UpdateAppointmentResponse> => {
      if (!hasTokens) {
        throw new Error('No se encontraron tokens de autenticación')
      }
      const response = await axiosClientApi.put(`/api/v2/appointments/${appointmentId}`, appointmentData)
      return response.data
    },
    onSuccess: () => {
      // Invalidar todas las queries de appointments para refrescar los datos
      queryClient.invalidateQueries({
        queryKey: APPOINTMENT_QUERY_KEYS.appointments
      })
    }
  })
}

/**
 * Hook para eliminar una cita existente
 */
export const useDeleteAppointment = () => {
  const { hasTokens } = useGoogleTokens()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (appointmentId: number): Promise<DeleteAppointmentResponse> => {
      if (!hasTokens) {
        throw new Error('No se encontraron tokens de autenticación')
      }
      const response = await axiosClientApi.delete(`/api/v2/appointments/${appointmentId}`)
      return response.data
    },
    onSuccess: () => {
      // Invalidar todas las queries de appointments para refrescar los datos
      queryClient.invalidateQueries({
        queryKey: APPOINTMENT_QUERY_KEYS.appointments
      })
    }
  })
}
