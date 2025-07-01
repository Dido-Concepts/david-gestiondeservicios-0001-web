import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createShift, updateShift, deleteShift } from '@/modules/shift/application/actions/shift.action'
import { CreateShiftRequest, UpdateShiftRequest } from '@/modules/shift/domain/models/shift.model'
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
        title: 'Error',
        description: `Error al crear el turno: ${error.message}`
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
        title: 'Error',
        description: `Error al actualizar el turno: ${error.message}`
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
        title: 'Error',
        description: `Error al eliminar el turno: ${error.message}`
      })
    }
  })
}
