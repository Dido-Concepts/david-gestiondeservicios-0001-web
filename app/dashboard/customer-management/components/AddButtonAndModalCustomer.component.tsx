// app/dashboard/customer-management/components/AddButtonAndModalCustomer.component.tsx

'use client'

import React, { useState } from 'react'
// Importar el nuevo hook y componentes UI
import { useFormCreateCustomer } from '@/modules/customer/infra/hooks/useFormCustomerManagement'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { IconComponent } from '@/app/components' // Asumiendo que existe

const AddButtonAndModalCustomer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Función para pasar al hook para cerrar el modal
  const handleModalClose = () => setIsModalOpen(false)

  // 1. Usar el hook personalizado
  const { form, onSubmit, isPending } = useFormCreateCustomer({
    handleModalOpen: handleModalClose
  })

  // Función para manejar el cambio de estado del diálogo y resetear si se cierra
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset() // Resetea el form si se cierra el modal
    }
    setIsModalOpen(open)
  }

  return (
        <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button // Usar Button de Shadcn si está disponible
                  variant="default" // Ajusta el variant según tu diseño
                  className="bg-app-quaternary text-white hover:bg-gray-600" // Mantén o ajusta clases
                >
                    Añadir Cliente
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                {/* 2. Usar el Form y onSubmit del hook */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold mb-1">Añadir Cliente</DialogTitle>
                            <DialogDescription>
                                Completa la información del nuevo cliente.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            {/* 3. Usar FormField para cada input (igual que antes) */}
                            <FormField
                                control={form.control}
                                name="name_customer" // Usar snake_case aquí porque el schema lo usa
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre completo</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ej: Juan Hancock"
                                                {...field}
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email_customer" // snake_case
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email (Opcional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="Ej: juan@correo.com"
                                                {...field}
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone_customer" // snake_case
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Teléfono (Opcional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="tel"
                                                placeholder="Ej: 987654321"
                                                maxLength={9}
                                                {...field}
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="birthdate_customer" // snake_case
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha de nacimiento (Opcional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                disabled={isPending}
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
                                onClick={() => handleOpenChange(false)}
                                disabled={isPending}
                            >
                                Cancelar
                            </Button>
                            {/* 4. Usar isPending del hook */}
                            <Button type="submit" disabled={isPending}>
                                {isPending
                                  ? (
                                    <div className="flex items-center gap-2">
                                        <IconComponent name="spinner" className="animate-spin h-4 w-4" />
                                        Guardando...
                                    </div>
                                    )
                                  : (
                                      'Guardar'
                                    )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
  )
}

export default AddButtonAndModalCustomer
//
