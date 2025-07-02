import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteDayOff } from '@/modules/days-off/application/days-off.action'
import { QUERY_KEYS_USER_LOCATION_MANAGEMENT, QUERY_KEYS_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { useToast } from '@/hooks/use-toast'

export function useDeleteDayOffMutation () {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation<string, Error, number>({
    mutationFn: async (dayOffId: number) => {
      return await deleteDayOff(dayOffId)
    },
    onError: (error) => {
      console.error('Error eliminando día libre:', error)
      return toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Error desconocido al eliminar el día libre'
      })
    },
    onSuccess: (data) => {
      // Invalidar múltiples queries relacionadas para asegurar actualización
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS_USER_LOCATION_MANAGEMENT.ULMGetUserLocationEvents]
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS_LOCATION_MANAGEMENT.LMGetLocation]
      })

      // Forzar refetch inmediato para mejor UX
      queryClient.refetchQueries({
        queryKey: [QUERY_KEYS_USER_LOCATION_MANAGEMENT.ULMGetUserLocationEvents]
      })

      // Mostrar mensaje de éxito
      toast({
        title: 'Día libre eliminado',
        description: 'El día libre ha sido eliminado exitosamente'
      })

      console.log('Día libre eliminado exitosamente:', data)
    }
  })
}
