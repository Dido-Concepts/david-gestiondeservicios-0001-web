import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createShift, updateShift, updateShiftDetails, deleteShift, cancelShift } from '@/modules/shift/application/actions/shift.action'
import { CreateShiftRequest, UpdateShiftRequest, UpdateShiftDetailsRequest, ShiftModel } from '@/modules/shift/domain/models/shift.model'
import { QUERY_KEYS_USER_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { useToast } from '@/hooks/use-toast'

export const useCreateShiftMutation = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (shift: CreateShiftRequest) => createShift(shift),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS_USER_LOCATION_MANAGEMENT.ULMGetUserLocationEvents]
      })
      toast({
        title: 'Éxito',
        description: 'Turno creado correctamente'
      })
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error al crear turno',
        description: error.message || 'No se pudo crear el turno'
      })
    }
  })
}

export const useUpdateShiftMutation = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, shift }: { id: number; shift: UpdateShiftRequest }) => updateShift(id, shift),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS_USER_LOCATION_MANAGEMENT.ULMGetUserLocationEvents]
      })
      toast({
        title: 'Éxito',
        description: 'Turno actualizado correctamente'
      })
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error al actualizar turno',
        description: error.message || 'No se pudo actualizar el turno'
      })
    }
  })
}

export const useUpdateShiftDetailsMutation = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, details }: { id: number; details: UpdateShiftDetailsRequest }) => updateShiftDetails(id, details),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS_USER_LOCATION_MANAGEMENT.ULMGetUserLocationEvents]
      })
      toast({
        title: 'Éxito',
        description: 'Detalles del turno actualizados correctamente'
      })
    },
    onError: (error: Error) => {
      let title = 'Error al actualizar turno'
      let description = error.message || 'No se pudo actualizar el turno'

      if (error.message.includes('se superpone con otro turno')) {
        title = '⚠️ Conflicto de horarios'
        description = error.message
      } else if (error.message.includes('Conflicto de horarios')) {
        title = '⚠️ Conflicto de horarios'
        description = error.message
      } else if (error.message.includes('no fue encontrado')) {
        title = 'Turno no encontrado'
        description = 'El turno que intentas editar no existe o fue eliminado'
      } else if (error.message.includes('Error interno del servidor')) {
        title = 'Error del servidor'
        description = 'Hubo un problema en el servidor. Inténtalo de nuevo más tarde.'
      }

      toast({
        variant: 'destructive',
        title,
        description
      })
    }
  })
}

export const useDeleteShiftMutation = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (id: number) => deleteShift(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS_USER_LOCATION_MANAGEMENT.ULMGetUserLocationEvents]
      })
      toast({
        title: 'Éxito',
        description: 'Turno eliminado correctamente'
      })
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error al eliminar turno',
        description: error.message || 'No se pudo eliminar el turno'
      })
    }
  })
}

export const useCancelShiftMutation = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation<ShiftModel, Error, number>({
    mutationFn: async (shiftId: number) => {
      return await cancelShift({ shift_id: shiftId })
    },
    onError: (error) => {
      console.error('Error anulando turno:', error)
      return toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Error desconocido al anular el turno'
      })
    },
    onSuccess: (data) => {
      // Invalidar múltiples queries relacionadas para asegurar actualización
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS_USER_LOCATION_MANAGEMENT.ULMGetUserLocationEvents]
      })

      // Forzar refetch inmediato para mejor UX
      queryClient.refetchQueries({
        queryKey: [QUERY_KEYS_USER_LOCATION_MANAGEMENT.ULMGetUserLocationEvents]
      })

      // Mostrar mensaje de éxito
      toast({
        title: 'Turno anulado',
        description: 'El turno ha sido anulado exitosamente'
      })

      console.log('Turno anulado exitosamente:', data)
    }
  })
}
