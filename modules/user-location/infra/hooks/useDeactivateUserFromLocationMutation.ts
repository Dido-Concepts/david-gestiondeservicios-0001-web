import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactivateUserFromLocation } from '@/modules/user-location/application/user-location-action'
import { QUERY_KEYS_USER_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'

export interface DeactivateUserFromLocationParams {
  sedeId: number
  userId: number
}

export function useDeactivateUserFromLocationMutation(sedeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: DeactivateUserFromLocationParams) => {
      return await deactivateUserFromLocation(params)
    },
    onSuccess: () => {
      // Invalidar queries específicas para esa sede para refrescar los datos
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS_USER_LOCATION_MANAGEMENT.ULMGetUserLocationEvents, sedeId]
      })
    }
  })
} 