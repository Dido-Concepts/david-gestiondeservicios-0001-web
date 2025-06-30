import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteDayOff } from '@/modules/days-off/application/days-off.action'
import { QUERY_KEYS_USER_LOCATION_MANAGEMENT, QUERY_KEYS_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'

export function useDeleteDayOffMutation () {
  const queryClient = useQueryClient()

  return useMutation<string, Error, number>({
    mutationFn: async (dayOffId: number) => {
      return await deleteDayOff(dayOffId)
    },
    onError: (error) => {
      console.error('Error eliminando día libre:', error)
      if (error instanceof Error) {
        alert(`Error al eliminar el día libre: ${error.message}`)
      } else {
        alert('Error desconocido al eliminar el día libre')
      }
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

      console.log('Día libre eliminado exitosamente:', data)
    }
  })
}
