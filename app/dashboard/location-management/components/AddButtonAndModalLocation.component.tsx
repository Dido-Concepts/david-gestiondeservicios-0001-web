'use client'

import { IconComponent } from '@/app/components'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { useFormCreateLocation } from '@/modules/location/infra/hooks/useFormLocationManagement'
import { useState } from 'react'
import { Controller } from 'react-hook-form'
import { ListOfSchedules } from './ListOfSchedules.component'
import { useRouter } from 'next/navigation'
import { LocationCreateResponse } from '@/modules/location/infra/hooks/useCreateLocationMutation'

export function AddButtonAndModalLocation () {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('datos-de-la-sede')

  const router = useRouter()

  const handleModalOpen = () => setIsModalOpen(prev => !prev)

  const { form, onSubmit, isPending } = useFormCreateLocation({
    handleModalOpen,
    onSuccessHandler: (data: LocationCreateResponse) => router.push(`/dashboard/location-management/${data.idLocation}/edit`)
  })

  // Verifica si hay errores en los campos de "Datos de la sede"
  const hasDatosErrors = !!(
    form.formState.errors.nameLocation ||
    form.formState.errors.phoneLocation ||
    form.formState.errors.addressLocation ||
    form.formState.errors.reviewLocation ||
    form.formState.errors.imgLocation
  )

  // Opcional: Verifica si hay errores en "Horario de atención"
  const hasHorarioErrors = !!form.formState.errors.schedule

  return (
    <>
      <button
        className="mt-4 md:mt-0 bg-app-quaternary hover:bg-gray-500 text-app-terciary px-4 py-2 rounded-lg flex items-center"
        onClick={handleModalOpen}
      >
        Añadir sede
        <IconComponent name="plus" width={20} height={20} className="w-6 h-6 ml-2" />
      </button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="px-12 max-h-[80vh] overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs className="pt-4" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4 w-full">
                  <TabsTrigger
                    value="datos-de-la-sede"
                    className={cn(
                      'w-1/2 font-semibold text-base',
                      hasDatosErrors && 'text-red-500' // Pinta de rojo si hay errores
                    )}
                  >
                    Datos de la sede
                  </TabsTrigger>
                  <TabsTrigger
                    value="horario-de-atencion"
                    className={cn(
                      'w-1/2 font-semibold text-base',
                      hasHorarioErrors && 'text-red-500' // Opcional: también para "Horario de atención"
                    )}
                  >
                    Horario de atención
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="datos-de-la-sede" className="px-4">
                  <DialogHeader className="mb-4">
                    <DialogTitle className="text-2xl font-bold">Añadir datos de la sede</DialogTitle>
                    <DialogDescription className="text-gray-500 font-bold">
                      Completa los datos de la sede
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 font-semibold">
                    <FormField
                      name="nameLocation"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de Sede</FormLabel>
                          <Input disabled={isPending} placeholder="Mi Ubicación 123" {...field} />
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
                          <Input disabled={isPending} maxLength={9} placeholder="912345678" {...field} />
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
                          <Input disabled={isPending} placeholder="Av. Principal 123" {...field} />
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
                          <Input disabled={isPending} placeholder="Al lado de la tienda X" {...field} />
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

                    {hasDatosErrors && (
                      <h1 className="text-red-500 text-sm">
                        Por favor, completa campos obligatorios
                      </h1>
                    )}

                  </div>
                </TabsContent>

                <TabsContent value="horario-de-atencion" className="px-8">
                  <Controller
                    control={form.control}
                    name="schedule"
                    render={({ field }) => (
                      <ListOfSchedules
                        title="Añadir horario de atención"
                        description="Completa los horarios de atención para cada día"
                        schedule={field.value}
                        onScheduleChange={field.onChange}
                        errors={form.formState.errors.schedule}
                        isPending={isPending}
                      />
                    )}
                  />
                  {hasDatosErrors && (
                    <h1 className="text-red-500 text-sm">
                      Por favor, completa campos obligatorios de Datos de la sede
                    </h1>
                  )}
                </TabsContent>
              </Tabs>
              <Button
                type="submit"
                className="mt-4 w-full font-bold"
                disabled={isPending}
              >
                {isPending
                  ? (
                    <div className="flex items-center gap-4">
                      <IconComponent name="spinner" className="animate-spin h-4 w-4" />
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
