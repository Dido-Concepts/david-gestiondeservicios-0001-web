import { getQueryClient } from '@/app/providers/GetQueryClient'
import { toast } from '@/hooks/use-toast'
import {
  createService,
  updateService
} from '@/modules/service/application/actions/service.action'
import { ServiceModel } from '@/modules/service/domain/models/service.model'
import { QUERY_KEYS_SERVICE_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { formServiceManagementSchema } from '@/modules/service/infra/hooks/useFormServiceManagement'

type ServiceResponse = {
  serviceName: string;
  messageResponse: string;
};

export function useServiceFormMutation (
  service: ServiceModel | null,
  toggleModal: () => void
) {
  return useMutation<
    ServiceResponse,
    Error,
    z.infer<typeof formServiceManagementSchema>
  >({
    mutationFn: async (data) => {
      if (service) {
        const res = await updateService({
          service_id: service.id,
          service_name: data.service_name,
          description: data.description || '',
          category_id: data.category_id,
          price: data.price,
          duration: data.duration_minutes || 0
        })

        return { serviceName: data.service_name, messageResponse: res }
      } else {
        const res = await createService({
          service_name: data.service_name,
          description: data.description || '',
          category_id: data.category_id,
          price: data.price,
          duration: data.duration_minutes || 0
        })

        return { serviceName: data.service_name, messageResponse: res }
      }
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update'
      })
    },
    onSuccess: (data) => {
      const queryClient = getQueryClient()
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS_SERVICE_MANAGEMENT.SMListServices] })
      toast({
        title: service ? 'Servicio actualizado' : 'Servicio creado',
        description: `Servicio ${data.serviceName} ${
          service ? 'actualizado' : 'creado'
        }`
      })
      toggleModal()
    }
  })
}
