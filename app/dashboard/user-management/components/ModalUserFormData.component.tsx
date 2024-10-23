'use client'

import { getQueryClient } from '@/app/providers/GetQueryClient'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { QUERY_KEYS_USER_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { createUser } from '@/modules/user/infra/actions/user.action'
import { useModalUserForm } from '@/modules/user/infra/store/user-management.store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formUserManagementSchema = z.object({
  nameUser: z.string().min(2).max(50),
  idRole: z.number().int().positive(),
  email: z.string()
    .email()
    .regex(/^[\w.%+-]+@gmail\.com$/, { message: 'El correo debe ser un correo de Gmail' })
})

export function ModalUserFormData () {
  const { isModalOpen, user, toggleModal } = useModalUserForm()

  const { mutate } = useMutation({
    mutationFn: createUser,
    onError: (error) => {
      return toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to updated'
      })
    },
    onSuccess: () => {
      const queryClient = getQueryClient()
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS_USER_MANAGEMENT.UMListUsers] })
      toast({
        title: 'Usuario actualizado',
        description: `Usuario ${form.getValues('email')} creado`
      })
      toggleModal()
    }
  })

  const form = useForm<z.infer<typeof formUserManagementSchema>>({
    resolver: zodResolver(formUserManagementSchema),
    defaultValues: {
      nameUser: '',
      idRole: 0,
      email: ''
    }
  })

  const handleOpenChange = () => {
    form.reset()
    toggleModal()
  }

  function onSubmit (values: z.infer<typeof formUserManagementSchema>) {
    mutate({ email: values.email, name: values.nameUser, idRole: values.idRole })
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-app-primary text-white">
        <DialogHeader>
          <DialogTitle className="text-white">{user ? 'Editar' : 'Añadir'} usuario</DialogTitle>
          <DialogDescription className="text-gray-300">
            {user ? 'Haz cambios en la información del usuario' : 'Completa los campos para crear el usuario '}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" id="UserFormData">

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
                      <Select onValueChange={(value) => field.onChange(Number(value))}>
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
                      <Input placeholder="usuario@gmail.com" {...field} />
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
          <Button type="submit" form='UserFormData' className="bg-slate-200 hover:bg-slate-400 text-app-primary hover:text-slate-200">
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
