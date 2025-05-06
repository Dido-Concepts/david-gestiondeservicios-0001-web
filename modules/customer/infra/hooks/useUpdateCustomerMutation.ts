import { useMutation } from '@tanstack/react-query'
import { CustomerFormValues } from '@/modules/customer/infra/hooks/useFormCustomerManagement'

interface UpdateCustomerData extends CustomerFormValues {
  id: number;
}

export function useUpdateCustomerMutation () {
  return useMutation({
    mutationFn: async (data: UpdateCustomerData) => {
      const response = await fetch(`/api/customers/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el cliente')
      }

      return response.json()
    }
  })
}
