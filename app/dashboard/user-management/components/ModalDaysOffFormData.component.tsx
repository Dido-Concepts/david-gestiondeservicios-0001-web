'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useDayOffTypes } from '@/modules/days-off/infra/hooks/useDayOffTypes'
import { useFormDaysOffManagement } from '@/modules/days-off/infra/hooks/useFormDaysOffManagement'
import { useModalDaysOffForm } from '@/modules/days-off/infra/store/days-off-modal.store'

export function ModalDaysOffFormData () {
  const {
    isModalOpen,
    toggleModal,
    dayOff,
    employeeName,
    selectedDate,
    userId,
    reset
  } = useModalDaysOffForm()

  const { form, onSubmit, isEdit, isPending } = useFormDaysOffManagement(
    toggleModal,
    dayOff,
    userId,
    selectedDate
  )

  // Obtener tipos de días libres desde la API
  const { data: dayOffTypesResponse, isLoading: isLoadingTypes, error: typesError } = useDayOffTypes()

  const handleOpenChange = () => {
    form.reset()
    reset()
  }

  return (
      <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px] bg-app-terciary text-app-quaternary ">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {isEdit ? 'Editar' : 'Añadir'} días libres
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {isEdit
                ? 'Modifica los detalles del día libre existente'
                : `Completa los campos para crear un día libre para ${employeeName}`}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3" id="DaysOffFormData">
              {/* Empleado (solo lectura) */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Miembro del equipo</label>
                <Input
                  value={employeeName}
                  disabled
                  className="bg-gray-100 text-gray-600 border"
                />
              </div>

              {/* Tipo de día libre */}
              <FormField
                name="tipo_dia_libre_maintable_id"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Tipo</FormLabel>
                    {isLoadingTypes
                      ? (
                      <div className="border rounded p-2 bg-gray-100 flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                        Cargando tipos...
                      </div>
                        )
                      : typesError
                        ? (
                      <div className="border rounded p-2 bg-red-50 text-red-600">
                        Error al cargar los tipos de días libres
                      </div>
                          )
                        : (
                      <select
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="w-full border rounded p-2"
                      >
                        <option value={0}>Seleccione un tipo</option>
                        {dayOffTypesResponse?.types?.map((type) => (
                          <option key={type.id} value={type.id} title={type.description}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                          )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Motivo */}
              <FormField
                name="motivo"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Motivo</FormLabel>
                    <textarea
                      {...field}
                      placeholder="Ingrese el motivo del día libre..."
                      className="w-full border rounded p-2 min-h-[60px] resize-none"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fechas */}
              <div className="flex gap-4">
                <FormField
                  name="fecha_inicio"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel className="text-sm font-medium">Fecha de inicio</FormLabel>
                      <Input
                        type="date"
                        {...field}
                        className="border rounded p-2"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="fecha_fin"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel className="text-sm font-medium">Fecha de fin</FormLabel>
                      <Input
                        type="date"
                        {...field}
                        className="border rounded p-2"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Horas */}
              <div className="flex gap-4">
                <FormField
                  name="hora_inicio"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel className="text-sm font-medium">Hora de inicio</FormLabel>
                      <select
                        {...field}
                        className="w-full border rounded p-2"
                      >
                        {Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`).map((hour) => (
                          <option key={hour} value={hour}>
                            {hour}
                          </option>
                        ))}
                      </select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="hora_fin"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel className="text-sm font-medium">Hora de finalización</FormLabel>
                      <select
                        {...field}
                        className="w-full border rounded p-2"
                      >
                        {Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`).map((hour) => (
                          <option key={hour} value={hour}>
                            {hour}
                          </option>
                        ))}
                      </select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>

          <DialogFooter>
            <Button
              type="submit"
              form="DaysOffFormData"
              disabled={isPending || isLoadingTypes}
              className="bg-black text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
            >
              {isPending
                ? (isEdit ? 'Guardando...' : 'Guardando...')
                : (isEdit ? 'Guardar' : 'Guardar')
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}
