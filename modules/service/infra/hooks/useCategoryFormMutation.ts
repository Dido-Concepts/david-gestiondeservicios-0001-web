import { getQueryClient } from '@/app/providers/GetQueryClient'
import { toast } from '@/hooks/use-toast'
import { CategoryModel } from '@/modules/service/domain/models/category.model'
import { formCategoryManagementSchema } from '@/modules/service/infra/hooks/useFormCategoryManagement'
import { QUERY_KEYS_SERVICE_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { createCategory, updateCategory } from '@/modules/service/application/actions/category.action'

type CategoryResponse = {
    nameCategory: string;
    messageResponse: string;
  }

export function useCategoryFormMutation (category: CategoryModel | null, toggleModal: () => void) {
  return useMutation<CategoryResponse, Error, z.infer<typeof formCategoryManagementSchema>>({
    mutationFn: async (data) => {
      if (category) {
        const res = await updateCategory({
          id: Number(category.id),
          description_category: data.description_category || '',
          location_id: data.location_id,
          name_category: data.name_category
        })

        return { nameCategory: data.name_category, messageResponse: res }
      } else {
        const res = await createCategory({
          description_category: data.description_category || '',
          location_id: data.location_id,
          name_category: data.name_category
        })

        return { nameCategory: data.name_category, messageResponse: res }
      }
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update'
      })
    },
    onSuccess: (data) => {
      const queryClient = getQueryClient()
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS_SERVICE_MANAGEMENT.SMListServices] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS_SERVICE_MANAGEMENT.SMListCategoriesCatalog] })
      toast({
        title: category ? 'Categoría actualizado' : 'Categoría creado',
        description: `Categoría ${data.nameCategory} ${category ? 'actualizado' : 'creado'}`
      })
      toggleModal()
    }
  })
}
