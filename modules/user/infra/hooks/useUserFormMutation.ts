import { useMutation } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { getQueryClient } from '@/app/providers/GetQueryClient'
import { createUser, editUser } from '@/modules/user/infra/actions/user.action'
import { ListUsersResponse } from '@/modules/user/application/use-cases/query/list-users/list-users.response'
import { EditUserCommand } from '@/modules/user/application/use-cases/command/edit-user/edit-user.command'
import { CreateUserCommand } from '@/modules/user/application/use-cases/command/create-user/create-user.command'
import { QUERY_KEYS_USER_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { z } from 'zod'
import { formUserManagementSchema } from '@/modules/user/infra/hooks/useFormUserManagement'

// Define el tipo de la respuesta esperada de `createUser` y `editUser`
type UserResponse = {
    email: string;
    // Agrega otros campos de usuario según sea necesario
  }

export function useUserFormMutation (user: ListUsersResponse | null, toggleModal: () => void) {
  return useMutation<UserResponse, Error, z.infer<typeof formUserManagementSchema>>({
    mutationFn: async (data) => {
      if (user) {
        const editUserData: EditUserCommand = {
          userName: data.nameUser,
          idUser: user.id,
          idRole: data.idRole
        }
        await editUser(editUserData)

        // Construye y retorna un objeto `UserResponse` manualmente
        return { email: data.email }
      } else {
        const createUserData: CreateUserCommand = {
          name: data.nameUser,
          email: data.email,
          idRole: data.idRole
        }
        await createUser(createUserData)

        // Construye y retorna un objeto `UserResponse` manualmente
        return { email: data.email }
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS_USER_MANAGEMENT.UMListUsers] })
      toast({
        title: user ? 'Usuario actualizado' : 'Usuario creado',
        description: `Usuario ${data.email} ${user ? 'actualizado' : 'creado'}`
      })
      toggleModal()
    }
  })
}
