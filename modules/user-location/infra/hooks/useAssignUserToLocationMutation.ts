import { useMutation, useQueryClient } from '@tanstack/react-query'
import { assignUserToLocation } from '@/modules/user-location/application/user-location-action'
import { QUERY_KEYS_USER_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'

export interface AssignUserToLocationParams {
  sedeId: number
  userId: number
}

export function useAssignUserToLocationMutation (sedeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: AssignUserToLocationParams) => {
      return await assignUserToLocation(params)
    },
    onSuccess: () => {
      // Invalidar queries específicas para esa sede para refrescar los datos
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS_USER_LOCATION_MANAGEMENT.ULMGetUserLocationEvents, sedeId]
      })
    }
  })
}
