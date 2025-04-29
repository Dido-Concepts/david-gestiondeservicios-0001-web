// modules/customer/infra/hooks/useCreateCustomerMutation.ts

import { useMutation } from '@tanstack/react-query'
import { createCustomer } from '@/modules/customer/application/actions/customer.action'

// Definimos un tipo para los datos que espera la función de mutación,
// aunque la acción espera FormData, la lógica de creación de FormData
// estará aquí para mantenerla encapsulada.
interface CreateCustomerInput {
    name_customer: string;
    email_customer?: string;
    phone_customer?: string;
    birthdate_customer?: string;
}

export function useCreateCustomerMutation () {
  return useMutation({
    mutationFn: async (customerData: CreateCustomerInput) => {
      // Crear FormData aquí, asegurando claves snake_case
      const formData = new FormData()
      formData.append('name_customer', customerData.name_customer)
      if (customerData.email_customer) {
        formData.append('email_customer', customerData.email_customer)
      }
      if (customerData.phone_customer) {
        formData.append('phone_customer', customerData.phone_customer)
      }
      if (customerData.birthdate_customer) {
        formData.append('birthdate_customer', customerData.birthdate_customer)
      }

      // Llamar a la Server Action con FormData
      const newCustomerId = await createCustomer(formData)
      // La Server Action devuelve el ID (number) en caso de éxito
      return newCustomerId
    }
    // onSuccess y onError se manejarán en el hook del formulario que use esta mutación
  })
}
