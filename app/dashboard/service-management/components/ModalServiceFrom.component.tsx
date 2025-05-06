'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { Button } from '@/components/ui/button'

import { useFormServiceManagement } from '@/modules/service/infra/hooks/useFormServiceManagement'
import { useModalService } from '@/modules/service/infra/store/service-modal.store'
import { SelectCategory } from './SelectCategory.component'
import { useSearchParams } from 'next/navigation'

export function ModalServiceFrom () {
  const searchParams = useSearchParams()
  const locationFilterFromURL = searchParams.get('locationFilter')

  const { isModalOpen, toggleModal, service } = useModalService()
  const { form, onSubmit, isEdit } = useFormServiceManagement(toggleModal, service)

  const handleOpenChange = () => {
    form.reset()
    toggleModal()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-app-primary text-white">
        <DialogHeader>
          <DialogTitle className="text-white">{isEdit ? 'Editar' : 'Añadir'} Servicio</DialogTitle>
          <DialogDescription className="text-gray-300">
            {isEdit
              ? 'Haz cambios en la información del usuario'
              : 'Completa los campos para crear el usuario '}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" id="ServiceFormData">
            <FormField name="service_name" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de Servicio</FormLabel>
                <Input placeholder="Name Example" {...field} />
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="description" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <Input placeholder="Detalla la categoría" {...field} />
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="duration_minutes" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Duración</FormLabel>
                <Input
                  type="number"
                  placeholder="Duración en minutos"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="price" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <Input
                  type="number"
                  placeholder="Precio del servicio"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                <FormMessage />
              </FormItem>
            )} />

            <SelectCategory control={form.control} name="category_id" locationId={locationFilterFromURL ? parseInt(locationFilterFromURL) : 0} />
          </form>
        </Form>

        <DialogFooter>
          <Button type="submit" form="ServiceFormData" className="bg-slate-200 hover:bg-slate-400 text-app-primary hover:text-slate-200">
            {isEdit
              ? 'Guardar cambios'
              : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
