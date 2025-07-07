// useFormUserManagement.ts
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ListUsersResponse } from '@/modules/user/application/use-cases/query/list-users/list-users.response'
import { useUserFormMutation } from '@/modules/user/infra/hooks/useUserFormMutation'

export const formUserManagementSchema = z.object({
  nameUser: z.string().min(2).max(50),
  idRole: z.number().int().positive(),
  email: z.string().email().regex(/^[\w.%+-]+@gmail\.com$/, { message: 'El correo debe ser un correo de Gmail' })
})

type FormUserManagementInputs = z.infer<typeof formUserManagementSchema>

export function useFormUserManagement (toggleModal: () => void, user: ListUsersResponse | null) {
  const form = useForm<FormUserManagementInputs>({
    resolver: zodResolver(formUserManagementSchema),
    defaultValues: {
      nameUser: '',
      idRole: 0,
      email: ''
    }
  })

  const { reset } = form
  const { mutate } = useUserFormMutation(user, toggleModal) // Usa la mutación para crear o editar el usuario

  useEffect(() => {
    if (user) {
      reset({
        nameUser: user.userName,
        idRole: user.role.id,
        email: user.email
      })
    } else {
      reset({
        nameUser: '',
        idRole: 0,
        email: ''
      })
    }
  }, [user, reset])

  const onSubmit = (values: FormUserManagementInputs) => {
    mutate(values) // Usa `values` para ejecutar la mutación
  }

  return { form, onSubmit, isEdit: Boolean(user) }
}
//
