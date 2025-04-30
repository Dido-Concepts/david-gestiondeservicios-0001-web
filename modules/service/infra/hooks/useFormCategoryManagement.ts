// useFormUserManagement.ts
import { CategoryModel } from '@/modules/service/domain/models/category.model'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCategoryFormMutation } from './useCategoryFormMutation'

export const formCategoryManagementSchema = z.object({
  description_category: z.string().min(2).max(500).optional(),
  location_id: z.number().int().positive(),
  name_category: z.string().min(2).max(100)
})

export type FormCategoryManagementInputs = z.infer<typeof formCategoryManagementSchema>

export function useFormCategoryManagement (toggleModal: () => void, category: CategoryModel | null, locationId: number) {
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
