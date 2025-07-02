import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateDayOffDetails } from '@/modules/days-off/application/days-off.action'
import { UpdateDaysOffDetailsRequest } from '@/modules/days-off/domain/models/days-off.model'
import { QUERY_KEYS_USER_LOCATION_MANAGEMENT, QUERY_KEYS_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'

interface UseUpdateDayOffDetailsOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const useUpdateDayOffDetails = (options?: UseUpdateDayOffDetailsOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ dayOffId, details }: { dayOffId: number; details: UpdateDaysOffDetailsRequest }) =>
      updateDayOffDetails(dayOffId, details),
    onSuccess: () => {
      // Invalidar queries para refrescar la tabla
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

      options?.onSuccess?.()
    },
    onError: (error: Error) => {
      options?.onError?.(error)
    }
  })
}
