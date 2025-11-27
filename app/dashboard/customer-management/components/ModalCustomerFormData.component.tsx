'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useFormCustomerManagement } from '@/modules/customer/infra/hooks/useFormCustomerManagement'
import { useCustomerModal } from '@/modules/customer/infra/store/customer-modal.store'

export function ModalCustomerFormData () {
  const { isModalOpen, toggleModal, customer } = useCustomerModal()

  const { form, onSubmit, isEdit } = useFormCustomerManagement(
    toggleModal,
    customer,
    isModalOpen
  )

  return (
    <Dialog open={isModalOpen} onOpenChange={toggleModal}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-1">
            {isEdit ? 'Editar Cliente' : 'Añadir Cliente'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Modifica la información del cliente.'
              : 'Completa la información del nuevo cliente.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="CustomerFormData">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name_customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Juan Hancock" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email_customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Ej: juan@correo.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Ej: 987654321"
                        maxLength={9}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthdate_customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de nacimiento (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end mt-4 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={toggleModal}
              >
                Cancelar
              </Button>
              <Button type="submit" form="CustomerFormData">
                Guardar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
