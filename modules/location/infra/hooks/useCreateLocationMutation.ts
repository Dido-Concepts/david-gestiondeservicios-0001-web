import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { formLocationManagementSchema } from './useFormLocationManagement'
import { createLocation } from '../../application/actions/location.action'
import { toast } from '@/hooks/use-toast'
import { getQueryClient } from '@/app/providers/GetQueryClient'
import { QUERY_KEYS_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'

type LocationCreateResponse = {
    name: string;
}

export function useCreateLocationMutation () {
  return useMutation<LocationCreateResponse, Error, z.infer<typeof formLocationManagementSchema>>({
    mutationFn: async (data) => {
      const createLocationData = {
        nameLocation: data.nameLocation,
        phoneLocation: data.phoneLocation,
        addressLocation: data.addressLocation,
        reviewLocation: data.reviewLocation,
        imgLocation: data.imgLocation,
        schedule: data.schedule
      }

      await createLocation(createLocationData)

      return { name: data.nameLocation }
    },
    onError: (error) => {
      console.log(error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update'
      })
    },
    onSuccess: (data) => {
      const queryClient = getQueryClient()
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS_LOCATION_MANAGEMENT.LMListLocations] })
      toast({
        title: 'Sede creada',
        description: `Ubicación ${data.name} creada`
      })
    }
  })
}
