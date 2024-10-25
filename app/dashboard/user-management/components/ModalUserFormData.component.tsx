'use client'

import { getQueryClient } from '@/app/providers/GetQueryClient'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { QUERY_KEYS_USER_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { createUser, editUser } from '@/modules/user/infra/actions/user.action'
import { useModalUserForm } from '@/modules/user/infra/store/user-management.store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect } from 'react'
import { EditUserCommand } from '@/modules/user/application/use-cases/command/edit-user/edit-user.command'
import { CreateUserCommand } from '@/modules/user/application/use-cases/command/create-user/create-user.command'

const formUserManagementSchema = z.object({
  nameUser: z.string().min(2).max(50),
  idRole: z.number().int().positive(),
  email: z
    .string()
    .email()
    .regex(/^[\w.%+-]+@gmail\.com$/, {
      message: 'El correo debe ser un correo de Gmail'
    })
})

const initialValues = {
  nameUser: '',
  idRole: 0,
  email: ''
}

export function ModalUserFormData () {
  const { isModalOpen, user, toggleModal } = useModalUserForm()

  const { mutate } = useMutation({
    mutationFn: async (data: z.infer<typeof formUserManagementSchema>) => {
      if (user) {
        // Preparar datos para editar usuario
        const editUserData: EditUserCommand = {
          userName: data.nameUser,
          idUser: user.id,
          idRole: data.idRole
        }
        return editUser(editUserData)
      } else {
        // Preparar datos para crear usuario
        const createUserData: CreateUserCommand = {
          name: data.nameUser,
          email: data.email,
          idRole: data.idRole
        }
        return createUser(createUserData)
      }
    },
    onError: (error) => {
      return toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to updated'
      })
    },
    onSuccess: () => {
      const queryClient = getQueryClient()
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS_USER_MANAGEMENT.UMListUsers]
      })
      toast({
        title: user ? 'Usuario actualizado' : 'Usuario creado',
        description: user
          ? `Usuario ${form.getValues('email')} actualizado`
          : `Usuario ${form.getValues('email')} creado`
      })
      toggleModal()
    }
  })

  const form = useForm<z.infer<typeof formUserManagementSchema>>({
    resolver: zodResolver(formUserManagementSchema),
    defaultValues: initialValues
  })

  // Este efecto se activará cada vez que cambie el usuario o el modal se abra
  useEffect(() => {
    if (user) {
      form.reset({
        nameUser: user.userName,
        idRole: user.role.id,
        email: user.email
      })
    } else {
      form.reset(initialValues)
    }
  }, [user, form])

  const handleOpenChange = () => {
    form.reset()
    toggleModal()
  }

  function onSubmit (values: z.infer<typeof formUserManagementSchema>) {
    mutate(values)
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-app-primary text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            {user ? 'Editar' : 'Añadir'} usuario
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {user
              ? 'Haz cambios en la información del usuario'
              : 'Completa los campos para crear el usuario '}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
              id="UserFormData"
            >
              <FormField
                control={form.control}
                name="nameUser"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre y Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan Perez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="idRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === '' ? 0 : Number(value))
                        }
                        value={field.value === 0 ? '' : field.value.toString()}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona el rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Roles de Usuario</SelectLabel>
                            <SelectItem value="1">Administrador</SelectItem>
                            <SelectItem value="2">Supervisor</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={Boolean(user)}
                        placeholder="usuario@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Solo se aceptan correos electrónicos gmail.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            form="UserFormData"
            className="bg-slate-200 hover:bg-slate-400 text-app-primary hover:text-slate-200"
          >
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

//
