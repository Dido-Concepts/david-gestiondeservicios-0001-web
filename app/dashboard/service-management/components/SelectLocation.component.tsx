import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getLocationsCatalog } from '@/modules/location/application/actions/location.action'
import { FormCategoryManagementInputs } from '@/modules/service/infra/hooks/useFormCategoryManagement'
import { QUERY_KEYS_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Control, Controller } from 'react-hook-form'

interface SelectLocationProps {
  control: Control<FormCategoryManagementInputs>
  name: keyof FormCategoryManagementInputs
}

export function SelectLocation ({ control, name }: SelectLocationProps) {
  const { data: locations } = useSuspenseQuery({
    queryKey: [QUERY_KEYS_LOCATION_MANAGEMENT.LMGetLocationCatalog],
    queryFn: () =>
      getLocationsCatalog()
  })
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Sedes</FormLabel>
          <FormControl>
            <Select onValueChange={(value) => field.onChange(value === '' ? 0 : Number(value))} value={field.value === undefined || field.value === 0 ? '' : field.value.toString()}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona la Sede" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sedes</SelectLabel>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id.toString()}>{location.name}</SelectItem>
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
