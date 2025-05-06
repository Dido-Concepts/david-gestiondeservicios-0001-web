import { useMutation } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { getQueryClient } from '@/app/providers/GetQueryClient'
import { createCustomer, updateDetailsCustomer } from '@/modules/customer/application/actions/customer.action'
import { QUERY_KEYS_CUSTOMER_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { z } from 'zod'
import { customerFormSchema } from '@/modules/customer/infra/hooks/useFormCustomerManagement'

// Definir tipos para las respuestas
type CustomerResponse = {
  id: number;
  name_customer: string;
}

export function useCustomerFormMutation (
  customer: { id: number } | null,
  toggleModal: () => void
) {
  return useMutation<CustomerResponse, Error, z.infer<typeof customerFormSchema>>({
    mutationFn: async (data) => {
      if (customer) {
        // Crear FormData para edición
        const formData = new FormData()
        formData.append('id', customer.id.toString()) // Ahora es 'id', no 'customer_id'
        formData.append('name_customer', data.name_customer)

        // Siempre incluir todos los campos
        formData.append('email_customer', data.email_customer || '')
        formData.append('phone_customer', data.phone_customer || '')
        formData.append('birthdate_customer', data.birthdate_customer || '')

        const result = await updateDetailsCustomer(formData)

        return {
          id: typeof result === 'number' ? result : customer.id,
          name_customer: data.name_customer
        }
      } else {
        // Crear FormData para creación
        const formData = new FormData()
        formData.append('name_customer', data.name_customer)

        // Siempre incluir todos los campos
        formData.append('email_customer', data.email_customer || '')
        formData.append('phone_customer', data.phone_customer || '')
        formData.append('birthdate_customer', data.birthdate_customer || '')
        // Añadir estado por defecto
        formData.append('status_customer', 'active')

        const result = await createCustomer(formData)

        return {
          id: typeof result === 'number' ? result : 0,
          name_customer: data.name_customer
        }
      }
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Error al procesar la solicitud'
      })
    },
    onSuccess: (data) => {
      const queryClient = getQueryClient()
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS_CUSTOMER_MANAGEMENT.LMListCustomers]
      })
      toast({
        title: customer ? 'Cliente actualizado' : 'Cliente creado',
        description: `Cliente "${data.name_customer}" ${customer ? 'actualizado' : 'creado'} exitosamente`
      })
      toggleModal()
    }
  })
}
