// modules/customer/infra/hooks/useFormCustomerManagement.ts

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast' // Asumiendo que usas este hook para toasts
import { QUERY_KEYS_CUSTOMER_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { useCreateCustomerMutation } from './useCreateCustomerMutation' // Importar el hook de mutación

// Esquema Zod para validación (igual que antes)
const customerFormSchema = z.object({
  name_customer: z.string()
    .min(1, { message: 'El nombre es requerido.' })
    .regex(/^[A-ZÁÉÍÓÚÜÑa-záéíóúüñ ]+$/, { message: 'El nombre solo debe contener letras y espacios.' }),
  email_customer: z.string().email({ message: 'Email inválido.' }).optional().or(z.literal('')),
  phone_customer: z.string()
    .length(9, { message: 'El teléfono debe tener 9 dígitos.' })
    .regex(/^[9]\d{8}$/, { message: 'Debe ser 9 dígitos y empezar con 9.' })
    .optional()
    .or(z.literal('')),
  birthdate_customer: z.string().optional().or(z.literal(''))
})

// Tipo inferido del esquema
export type CustomerFormValues = z.infer<typeof customerFormSchema>;

// Hook personalizado para el formulario de creación de clientes
export function useFormCreateCustomer ({
  handleModalOpen // Función para cerrar el modal
}: {
    handleModalOpen: () => void;
}) {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name_customer: '',
      email_customer: '',
      phone_customer: '',
      birthdate_customer: ''
    },
    mode: 'onChange'
  })

  const queryClient = useQueryClient()
  const { mutate, isPending } = useCreateCustomerMutation() // Usar el hook de mutación

  // Función onSubmit que se pasará a react-hook-form
  const onSubmit = (values: CustomerFormValues) => {
    // Llamar a la función mutate del hook useCreateCustomerMutation
    mutate(values, { // Pasamos los valores validados
      onSuccess: (newCustomerId) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS_CUSTOMER_MANAGEMENT.LMListCustomers]
        })
        toast({ // Usar tu sistema de toasts
          title: 'Cliente Creado',
          description: `El cliente "${values.name_customer}" fue creado exitosamente (ID: ${newCustomerId}).`
        })
        form.reset() // Limpiar el formulario
        handleModalOpen() // Cerrar el modal
      },
      onError: (error) => {
        console.error('Error al crear cliente:', error)
        toast({ // Usar tu sistema de toasts
          variant: 'destructive',
          title: 'Error al Crear Cliente',
          description: error.message || 'Ocurrió un error inesperado.'
        })
        // No reseteamos ni cerramos el modal en caso de error
      }
    })
  }

  return {
    form, // Objeto form de react-hook-form
    onSubmit, // Función para pasar al <form>
    isPending // Estado de carga de la mutación
  }
}

// NOTA: Si necesitas formularios para editar, podrías añadir aquí:
// - Un esquema Zod para la edición (quizás campos diferentes son opcionales/requeridos)
// - Un hook `useUpdateCustomerMutation` (similar a useCreateCustomerMutation)
// - Un hook `useFormUpdateCustomer` (similar a useFormCreateCustomer)
