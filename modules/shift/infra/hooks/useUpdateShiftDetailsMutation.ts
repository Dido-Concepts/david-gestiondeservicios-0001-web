import { useMutation } from '@tanstack/react-query'
import { updateShiftDetails } from '@/modules/shift/application/actions/shift.action'
import { UpdateShiftDetailsRequest } from '@/modules/shift/domain/models/shift.model'

export interface UpdateShiftDetailsParams {
  id: number
  details: UpdateShiftDetailsRequest
}

export function useUpdateShiftDetailsMutation () {
  return useMutation({
    mutationFn: async ({ id, details }: UpdateShiftDetailsParams) => {
      return await updateShiftDetails(id, details)
    }
  })
}
