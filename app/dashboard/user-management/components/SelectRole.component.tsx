import { z } from 'zod'
import { Control, Controller } from 'react-hook-form'
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formUserManagementSchema } from '@/modules/user/infra/hooks/useFormUserManagement' // Ajusta la ruta según sea necesario

// Tipo de los datos del formulario basado en el esquema
type FormUserManagementInputs = z.infer<typeof formUserManagementSchema>

interface SelectRoleProps {
    control: Control<FormUserManagementInputs> // Control con el tipo de datos específico del formulario
    name: keyof FormUserManagementInputs // Usa keyof para el nombre del campo
  }

export function SelectRole ({ control, name }: SelectRoleProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Rol</FormLabel>
          <FormControl>
            <Select onValueChange={(value) => field.onChange(value === '' ? 0 : Number(value))} value={field.value === 0 ? '' : field.value.toString()}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Selecciona el rol" /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Roles de Usuario</SelectLabel>
                  <SelectItem value="8">Administrador</SelectItem>
                  <SelectItem value="9">Barbero</SelectItem>
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
