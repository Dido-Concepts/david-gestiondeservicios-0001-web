// modules/customer/infra/hooks/useFormCustomerManagement.ts

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCustomerFormMutation } from './useCustomerFormMutation'
import { useEffect } from 'react'

// Exportamos el schema para usarlo en useCustomerFormMutation
export const customerFormSchema = z.object({
  name_customer: z.string()
    .min(1, { message: 'El nombre es requerido.' })
    .regex(/^[A-ZÁÉÍÓÚÜÑa-záéíóúüñ ]+$/, {
      message: 'El nombre solo debe contener letras y espacios.'
    }),
  email_customer: z.string()
    .email({ message: 'Email inválido.' })
    .or(z.literal('')),
  phone_customer: z.string()
    .regex(/^[9]\d{8}$/, {
      message: 'Debe ser 9 dígitos y empezar con 9.'
    })
    .or(z.literal('')),
  birthdate_customer: z.string()
    .refine(
      (date) => {
        if (!date) return true
        const today = new Date()
        const selectedDate = new Date(date)
        return selectedDate <= today
      },
      { message: 'La fecha de nacimiento no puede ser en el futuro.' }
    )
    .or(z.literal(''))
})

export type CustomerFormValues = z.infer<typeof customerFormSchema>

interface Customer {
  id: number;
  name_customer: string;
  email_customer?: string;
  phone_customer?: string;
  birthdate_customer?: string;
}

export function useFormCustomerManagement (
  toggleModal: () => void,
  customer: Customer | null
) {
  // Inicializar con valores vacíos por defecto
  const defaultValues: CustomerFormValues = {
    name_customer: '',
    email_customer: '',
    phone_customer: '',
    birthdate_customer: ''
  }

  // Solo usar valores del cliente si existe
  if (customer && customer.id) {
    defaultValues.name_customer = customer.name_customer || ''
    defaultValues.email_customer = customer.email_customer || ''
    defaultValues.phone_customer = customer.phone_customer || ''
    defaultValues.birthdate_customer = customer.birthdate_customer || ''
  }

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues,
    mode: 'onChange'
  })

  // Efecto para actualizar el formulario cuando cambia el cliente
  useEffect(() => {
    if (customer && customer.id) {
      // Solo resetear si hay un cliente con ID válido
      form.reset({
        name_customer: customer.name_customer || '',
        email_customer: customer.email_customer || '',
        phone_customer: customer.phone_customer || '',
        birthdate_customer: customer.birthdate_customer || ''
      })
    } else if (!customer) {
      // Si no hay cliente, limpiar el formulario
      form.reset(defaultValues)
    }
  }, [customer, defaultValues, form])

  const { mutate, isPending } = useCustomerFormMutation(customer, toggleModal)

  const onSubmit = (values: CustomerFormValues) => {
    mutate(values)
  }

  return {
    form,
    onSubmit,
    isPending,
    isEdit: Boolean(customer?.id)
  }
}

// NOTA: Si necesitas formularios para editar, podrías añadir aquí:
// - Un esquema Zod para la edición (quizás campos diferentes son opcionales/requeridos)
// - Un hook `useUpdateCustomerMutation` (similar a useCreateCustomerMutation)
// - Un hook `useFormUpdateCustomer` (similar a useFormCreateCustomer)
