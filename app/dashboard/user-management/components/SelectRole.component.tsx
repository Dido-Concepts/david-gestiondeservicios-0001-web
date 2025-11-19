import { z } from 'zod'
import { Control, Controller } from 'react-hook-form'
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formUserManagementSchema } from '@/modules/user/infra/hooks/useFormUserManagement'
import { useRoleTypes } from '@/modules/role/infra/hooks/useRoleTypes'

// Tipo de los datos del formulario basado en el esquema
type FormUserManagementInputs = z.infer<typeof formUserManagementSchema>

interface SelectRoleProps {
    control: Control<FormUserManagementInputs> // Control con el tipo de datos específico del formulario
    name: keyof FormUserManagementInputs // Usa keyof para el nombre del campo
  }

export function SelectRole ({ control, name }: SelectRoleProps) {
  const { data: roles, isLoading: isLoadingRoles, error: rolesError } = useRoleTypes()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Rol</FormLabel>
          <FormControl>
            {isLoadingRoles
              ? (
              <div className="border rounded p-2 bg-gray-100 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                Cargando roles...
              </div>
                )
              : rolesError
                ? (
              <div className="border rounded p-2 bg-red-50 text-red-600">
                Error al cargar los roles
              </div>
                  )
                : (
              <Select onValueChange={(value) => field.onChange(value === '' ? 0 : Number(value))} value={field.value === 0 ? '' : field.value.toString()}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Selecciona el rol" /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Roles de Usuario</SelectLabel>
                    {roles?.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()} title={role.description}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
                  )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
