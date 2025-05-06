// useFormUserManagement.ts
import { CategoryModel } from '@/modules/service/domain/models/category.model'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCategoryFormMutation } from './useCategoryFormMutation'

export const formCategoryManagementSchema = z.object({
  description_category: z
    .string()
    .min(2, 'La descripción debe tener al menos 2 caracteres')
    .max(500, 'La descripción debe tener como máximo 500 caracteres')
    .optional(),
  location_id: z
    .number()
    .int('El ID de ubicación debe ser un número entero')
    .positive('El ID de ubicación debe ser un número positivo'),
  name_category: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre debe tener como máximo 100 caracteres')
})

export type FormCategoryManagementInputs = z.infer<
  typeof formCategoryManagementSchema
>;

export function useFormCategoryManagement (
  toggleModal: () => void,
  category: CategoryModel | null,
  locationId: number
) {
  const form = useForm<FormCategoryManagementInputs>({
    resolver: zodResolver(formCategoryManagementSchema),
    defaultValues: {
      description_category: '',
      location_id: 0,
      name_category: ''
    }
  })

  const { reset } = form
  const { mutate } = useCategoryFormMutation(category, toggleModal)

  useEffect(() => {
    if (category) {
      reset({
        description_category: category.description,
        location_id: locationId,
        name_category: category.name
      })
    } else {
      reset({
        description_category: '',
        location_id: locationId,
        name_category: ''
      })
    }
  }, [category, locationId, reset])

  const onSubmit = (values: FormCategoryManagementInputs) => {
    mutate(values)
  }

  return { form, onSubmit, isEdit: Boolean(category) }
}
