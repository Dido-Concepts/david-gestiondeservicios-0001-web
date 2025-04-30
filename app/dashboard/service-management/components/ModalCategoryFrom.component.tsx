'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { Button } from '@/components/ui/button'

import { useFormCategoryManagement } from '@/modules/service/infra/hooks/useFormCategoryManagement'
import { useModalCategory } from '@/modules/service/infra/store/category-modal.store'
import { SelectLocation } from '@/app/dashboard/service-management/components/SelectLocation.component'
import { useSearchParams } from 'next/navigation'

export function ModalCategoryFrom () {
  const searchParams = useSearchParams()
  const locationFilterFromURL = searchParams.get('locationFilter')
  const { isModalOpen, toggleModal, category } = useModalCategory()
  const { form, onSubmit, isEdit } = useFormCategoryManagement(toggleModal, category, locationFilterFromURL ? parseInt(locationFilterFromURL) : 0)

  const handleOpenChange = () => {
    form.reset()
    toggleModal()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-app-primary text-white">
        <DialogHeader>
          <DialogTitle className="text-white">{isEdit ? 'Editar' : 'Añadir'} Categoría</DialogTitle>
          <DialogDescription className="text-gray-300">
            {isEdit
              ? 'Haz cambios en la información del usuario'
              : 'Completa los campos para crear el usuario '}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" id="CategoryFormData">
            <FormField name="name_category" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de Categoría</FormLabel>
                <Input placeholder="Name Example" {...field} />
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="description_category" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <Input disabled={isEdit} placeholder="Detalla la categoría" {...field} />
                <FormMessage />
              </FormItem>
            )} />

             <SelectLocation control={form.control} name="location_id" />
          </form>
        </Form>

        <DialogFooter>
          <Button type="submit" form="CategoryFormData" className="bg-slate-200 hover:bg-slate-400 text-app-primary hover:text-slate-200">
             {isEdit
               ? 'Guardar cambios'
               : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
