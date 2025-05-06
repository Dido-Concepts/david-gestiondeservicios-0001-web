import { ServiceModel } from '@/modules/service/domain/models/service.model'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useServiceFormMutation } from './useServiceFormMutation'

export const formServiceManagementSchema = z.object({
  category_id: z
    .number()
    .int('El ID de categoría debe ser un número entero')
    .positive('El ID de categoría debe ser un número positivo'),
  service_name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(150, 'El nombre debe tener como máximo 150 caracteres'),
  duration_minutes: z
    .number()
    .positive('La duración debe ser un número positivo'),
  price: z
    .number()
    .positive('El precio debe ser un número positivo'),
  description: z
    .string()
    .max(500, 'La descripción debe tener como máximo 500 caracteres')
    .optional()
})

export type FormServiceManagementInputs = z.infer<
  typeof formServiceManagementSchema
>;

export function useFormServiceManagement (
  toggleModal: () => void,
  service: ServiceModel | null
) {
  const form = useForm<FormServiceManagementInputs>({
    resolver: zodResolver(formServiceManagementSchema),
    defaultValues: {
      category_id: 0,
      service_name: '',
      duration_minutes: 0,
      price: 0,
      description: ''
    }
  })

  const { reset } = form
  const { mutate } = useServiceFormMutation(service, toggleModal)

  useEffect(() => {
    if (service) {
      reset({
        category_id: service.category_id,
        service_name: service.name,
        duration_minutes: service.duration,
        price: service.price,
        description: service.description || ''
      })
    } else {
      reset({
        category_id: 0,
        service_name: '',
        duration_minutes: 0,
        price: 0,
        description: ''
      })
    }
  }, [service, reset])

  const onSubmit = (values: FormServiceManagementInputs) => {
    mutate(values)
  }

  return { form, onSubmit, isEdit: Boolean(service) }
}
