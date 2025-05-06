import { getQueryClient } from '@/app/providers/GetQueryClient'
import { toast } from '@/hooks/use-toast'
import { CustomerModel } from '@/modules/customer/domain/models/customer.model'
import { formCustomerManagementSchema } from './useFormCustomerManagement'
import { QUERY_KEYS_CUSTOMER_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { createCustomer, updateDetailsCustomer } from '@/modules/customer/application/actions/customer.action'

type CustomerResponse = {
  nameCustomer: string;
  messageResponse: string | number;
}

export function useCustomerFormMutation (customer: CustomerModel | null, toggleModal: () => void) {
  return useMutation<CustomerResponse, Error, z.infer<typeof formCustomerManagementSchema>>({
    mutationFn: async (data) => {
      if (customer) {
        const res = await updateDetailsCustomer({
          id: String(customer.id),
          name_customer: data.name_customer,
          email_customer: data.email_customer || '',
          phone_customer: data.phone_customer || '',
          birthdate_customer: data.birthdate_customer || new Date().toISOString()
        })

        return { nameCustomer: data.name_customer, messageResponse: res }
      } else {
        const res = await createCustomer({
          name_customer: data.name_customer,
          email_customer: data.email_customer,
          phone_customer: data.phone_customer,
          birthdate_customer: data.birthdate_customer,
          status_customer: data.status_customer
        })

        return { nameCustomer: data.name_customer, messageResponse: res }
      }
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Error al procesar la operación'
      })
    },
    onSuccess: (data) => {
      const queryClient = getQueryClient()
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS_CUSTOMER_MANAGEMENT.LMListCustomers] })
      toast({
        title: customer ? 'Cliente actualizado' : 'Cliente creado',
        description: `Cliente ${data.nameCustomer} ${customer ? 'actualizado' : 'creado'} exitosamente`
      })
      toggleModal()
    }
  })
}
