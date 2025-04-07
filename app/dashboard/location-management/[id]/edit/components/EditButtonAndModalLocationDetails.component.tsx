'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { IconComponent } from '@/app/components'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFormUpdateDetails } from '@/modules/location/infra/hooks/useFormLocationManagement'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { LocationModel } from '@/modules/location/domain/models/location.model'

export function EditButtonAndModalLocationDetails (props: {
  location: LocationModel;
}) {
  const { location } = props

  const [isModalOpen, setIsModalOpen] = useState(false)

  const params = useParams()
  const locationId = params.id as string

  const handleModalOpen = () => setIsModalOpen((prev) => !prev)

  const { form, onSubmit, isPending } = useFormUpdateDetails({
    handleModalOpen,
    idLocation: locationId
  })

  useEffect(() => {
    if (isModalOpen && location) {
      form.reset({
        nameLocation: location.name || '',
        phoneLocation: location.phone || '',
        addressLocation: location.address || '',
        reviewLocation: location.review || '',
        imgLocation: undefined
      })
    }
  }, [isModalOpen, location, form])

  return (
    <>
      {/* Botón para abrir el modal */}
      <button
        className="text-app-secondary font-medium hover:underline"
        onClick={handleModalOpen}
      >
        Editar
      </button>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} >
        <DialogContent
          onInteractOutside={(e) => {
            if (isPending) {
              e.preventDefault()
            }
          }}
        >
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold">
              Editar datos de la sede
            </DialogTitle>
            <DialogDescription className="text-gray-500 font-bold">
              Modifica los datos de la sede según sea necesario
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 font-semibold"
            >
              <FormField
                name="nameLocation"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de Sede</FormLabel>
                    <Input
                      disabled={isPending}
                      placeholder="Mi Ubicación 123"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="phoneLocation"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <Input
                      disabled={isPending}
                      maxLength={9}
                      placeholder="912345678"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="addressLocation"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <Input
                      disabled={isPending}
                      placeholder="Av. Principal 123"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="reviewLocation"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referencia</FormLabel>
                    <Input
                      disabled={isPending}
                      placeholder="Al lado de la tienda X"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="imgLocation"
                control={form.control}
                render={({ field: { onChange, ref } }) => (
                  <FormItem>
                    <FormLabel>Imagen del Local</FormLabel>
                    <Input
                      multiple={false}
                      disabled={isPending}
                      accept="image/*"
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        onChange(file)
                      }}
                      ref={ref}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="mt-4 w-full font-bold"
                disabled={isPending}
              >
                {isPending
                  ? (
                  <div className="flex items-center gap-4">
                    <IconComponent
                      name="spinner"
                      className="animate-spin h-4 w-4"
                    />
                    Guardando...
                  </div>
                    )
                  : (
                      'Guardar'
                    )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
