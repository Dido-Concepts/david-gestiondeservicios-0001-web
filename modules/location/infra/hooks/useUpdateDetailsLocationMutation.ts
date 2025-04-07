import { useMutation } from '@tanstack/react-query'
import { updateDetailsLocation } from '@/modules/location/application/actions/location.action'

export type LocationUpdateDatailsResponse = {
    name: string;
    message: string;
}

export function useUpdateDetailsLocationMutation () {
  const { mutate, isPending } = useMutation<LocationUpdateDatailsResponse, Error, FormData>({
    mutationFn: async (formData) => {
      const messageApi = await updateDetailsLocation(formData)
      return { name: formData.get('nameLocation') as string, message: messageApi }
    }
  })
  return { mutate, isPending }
}
