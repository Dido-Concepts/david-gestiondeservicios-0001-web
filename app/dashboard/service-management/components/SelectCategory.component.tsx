import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getAllCategories } from '@/modules/service/application/actions/category.action'
import { FormServiceManagementInputs } from '@/modules/service/infra/hooks/useFormServiceManagement'
import { QUERY_KEYS_SERVICE_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Control, Controller } from 'react-hook-form'

interface SelectLocationProps {
  control: Control<FormServiceManagementInputs>
  name: keyof FormServiceManagementInputs
  locationId: number
}

export function SelectCategory ({ control, name, locationId }: SelectLocationProps) {
  const { data: categories } = useSuspenseQuery({
    queryKey: [QUERY_KEYS_SERVICE_MANAGEMENT.SMListCategoriesCatalog],
    queryFn: () =>
      getAllCategories({ sede_id: locationId })
  })
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Categorías</FormLabel>
          <FormControl>
            <Select onValueChange={(value) => field.onChange(value === '' ? 0 : Number(value))} value={field.value === undefined || field.value === 0 ? '' : field.value.toString()}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona la Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categorías</SelectLabel>
                  {categories.map((catalog) => (
                    <SelectItem key={catalog.category_id} value={catalog.category_id.toString()}>{catalog.category_name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
