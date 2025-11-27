import { CustomerModel } from '@/modules/customer/domain/models/customer.model'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCustomerFormMutation } from './useCustomerFormMutation'

export const formCustomerManagementSchema = z.object({
  name_customer: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre debe tener como máximo 100 caracteres'),
  email_customer: z
    .string()
    .email('Correo electrónico inválido'),
  phone_customer: z
    .string()
    .min(6, 'El teléfono debe tener al menos 6 caracteres')
    .max(20, 'El teléfono debe tener como máximo 20 caracteres'),
  birthdate_customer: z
    .string(),
  status_customer: z
    .enum(['active', 'blocked'])
    .optional()
})

export type FormCustomerManagementInputs = z.infer<typeof formCustomerManagementSchema>;

export function useFormCustomerManagement (
  toggleModal: () => void,
  customer: CustomerModel | null,
  isModalOpen: boolean
) {
  const form = useForm<FormCustomerManagementInputs>({
    resolver: zodResolver(formCustomerManagementSchema),
    defaultValues: {
      name_customer: '',
      email_customer: '',
      phone_customer: '',
      birthdate_customer: '',
      status_customer: 'active'
    }
  })

  const { reset } = form
  const { mutate } = useCustomerFormMutation(customer, toggleModal)

  useEffect(() => {
    if (!isModalOpen) return

    if (customer) {
      reset({
        name_customer: customer.name,
        email_customer: customer.email,
        phone_customer: customer.phone,
        birthdate_customer: customer.birthDate.toISOString().split('T')[0],
        status_customer: customer.status
      })
    } else {
      reset({
        name_customer: '',
        email_customer: '',
        phone_customer: '',
        birthdate_customer: '',
        status_customer: 'active'
      })
    }
  }, [customer, reset, isModalOpen])

  const onSubmit = (values: FormCustomerManagementInputs) => {
    mutate(values)
  }

  return { form, onSubmit, isEdit: Boolean(customer) }
}
