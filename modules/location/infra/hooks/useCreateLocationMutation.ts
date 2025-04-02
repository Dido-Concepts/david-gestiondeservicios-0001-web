import { useMutation } from '@tanstack/react-query'
import { createLocation } from '../../application/actions/location.action'

export type LocationCreateResponse = {
    name: string;
    idLocation: number;
}

export function useCreateLocationMutation () {
  const { mutate, isPending } = useMutation<LocationCreateResponse, Error, FormData>({
    mutationFn: async (formData) => {
      const idLocationCreate = await createLocation(formData)
      return { name: formData.get('nameLocation') as string, idLocation: idLocationCreate }
    }
  })
  return { mutate, isPending }
}
