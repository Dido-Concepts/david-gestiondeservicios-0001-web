'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { Button } from '@/components/ui/button'

import { useFormUserManagement } from '@/modules/user/infra/hooks/useFormUserManagement'
import { useModalUserForm } from '@/modules/user/infra/store/user-management.store'
import { SelectRole } from './SelectRole.component'

export function ModalUserFormData () {
  const { isModalOpen, toggleModal, user } = useModalUserForm()
  const { form, onSubmit, isEdit } = useFormUserManagement(toggleModal, user)

  const handleOpenChange = () => {
    form.reset()
    toggleModal()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-app-terciary text-app-quaternary">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{isEdit ? 'Editar' : 'Añadir'} usuario</DialogTitle>
          <DialogDescription className="text-gray-600">
            {isEdit
              ? 'Haz cambios en la información del usuario'
              : 'Completa los campos para crear el usuario '}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" id="UserFormData">
            <FormField name="nameUser" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre y Apellido</FormLabel>
                <Input placeholder="Juan Perez" {...field} />
                <FormMessage />
              </FormItem>
            )} />

            <SelectRole control={form.control} name="idRole" />

            <FormField name="email" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input disabled={isEdit} placeholder="usuario@gmail.com" {...field} />
                <FormMessage />
              </FormItem>
            )} />
          </form>
        </Form>

        <DialogFooter>
          <Button type="submit" form="UserFormData" className="bg-app-quaternary hover:bg-slate-400 text-app-terciary hover:text-slate-200">
             {isEdit
               ? 'Guardar cambios'
               : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
