'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosClientApi } from '@/config/axiosClientApi'
import { useGoogleTokens } from '@/hooks/use-google-tokens'

// Tipos para las notificaciones
export type NotificationStatusResponse = {
  success: boolean
  workflow_id: string
  is_active: boolean
  status: 'active' | 'inactive'
  workflow_name: string
  last_updated: string
  created_at: string
}

export type NotificationManageResponse = {
  success: boolean
  message: string
  workflow_id: string
  status: 'active' | 'inactive'
  action: 'activate' | 'deactivate'
}

// Tipos para las ubicaciones de notificación
export type NotificationLocation = {
  location_id: number
  location_name: string
  is_notification_active: boolean
  notification_location_id: number | null
}

export type NotificationLocationToggleRequest = {
  locationId: number
  isActive: boolean
}

export type NotificationLocationToggleResponse = {
  notification_location_id: number
  location_id: number
  is_active: boolean
  action_performed: 'CREATED' | 'UPDATED'
}

// Query Keys
export const NOTIFICATION_QUERY_KEYS = {
  status: ['notifications', 'status'] as const,
  locations: ['notifications', 'locations'] as const
}

/**
 * Hook para obtener el estado de las notificaciones N8N
 */
export const useNotificationStatus = () => {
  const { hasTokens } = useGoogleTokens()

  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.status,
    queryFn: async (): Promise<NotificationStatusResponse> => {
      const response = await axiosClientApi.get('/api/v2/notifications/n8n/status')
      return response.data
    },
    enabled: hasTokens,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 15, // 15 minutos
    refetchInterval: 1000 * 60 * 2 // Refetch cada 2 minutos
  })
}

/**
 * Hook para activar/desactivar las notificaciones
 */
export const useToggleNotificationStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (activate: boolean): Promise<NotificationManageResponse> => {
      const response = await axiosClientApi.post('/api/v2/notifications/n8n/manage', {
        activate
      })
      return response.data
    },
    onSuccess: () => {
      // Invalidar la query del estado para refrescar los datos
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.status
      })
    }
  })
}

/**
 * Hook para obtener las ubicaciones de notificación
 */
export const useNotificationLocations = () => {
  const { hasTokens } = useGoogleTokens()

  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.locations,
    queryFn: async (): Promise<NotificationLocation[]> => {
      const response = await axiosClientApi.get('/api/v2/notifications/locations')
      return response.data
    },
    enabled: hasTokens,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 15 // 15 minutos
  })
}

/**
 * Hook para activar/desactivar notificaciones por ubicación
 */
export const useToggleNotificationLocation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ locationId, isActive }: NotificationLocationToggleRequest): Promise<NotificationLocationToggleResponse> => {
      const response = await axiosClientApi.post('/api/v2/notifications/locations', {
        location_id: locationId,
        is_active: isActive
      })
      return response.data
    },
    onSuccess: () => {
      // Invalidar la query de ubicaciones para refrescar los datos
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.locations
      })
    }
  })
}
