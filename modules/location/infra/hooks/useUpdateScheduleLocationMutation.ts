import { useMutation } from '@tanstack/react-query'
import { updateScheduleLocation } from '@/modules/location/application/actions/location.action'
import { z } from 'zod'
import { formUpdateScheduleSchema } from './useFormLocationManagement'

export type LocationUpdateScheduleResponse = {

    message: string;
}

export function useUpdateScheduleLocationMutation (idLocation: string) {
  const { mutate, isPending } = useMutation<LocationUpdateScheduleResponse, Error, z.infer<typeof formUpdateScheduleSchema>>({
    mutationFn: async (data) => {
      const messageApi = await updateScheduleLocation({ idLocation, schedule: data.schedule })
      return { message: messageApi }
    }
  })
  return { mutate, isPending }
}
