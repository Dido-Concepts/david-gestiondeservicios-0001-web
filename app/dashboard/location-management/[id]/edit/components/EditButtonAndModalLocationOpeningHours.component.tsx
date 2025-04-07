'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useState, useEffect } from 'react'
import { ListOfSchedules } from '../../../components/ListOfSchedules.component'
import { useFormUpdateSchedule, type formUpdateScheduleInputs } from '@/modules/location/infra/hooks/useFormLocationManagement'
import { useParams } from 'next/navigation'
import { Form } from '@/components/ui/form'
import { Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { IconComponent } from '@/app/components'

export function EditButtonAndModalLocationOpeningHours (props: {
  schedule: formUpdateScheduleInputs['schedule'];
}) {
  const { schedule } = props
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleModalOpen = () => setIsModalOpen((prev) => !prev)

  const params = useParams()
  const locationId = params.id as string

  const { form, onSubmit, isPending } = useFormUpdateSchedule({
    handleModalOpen,
    idLocation: locationId
  })

  useEffect(() => {
    if (isModalOpen && schedule) {
      form.reset({
        schedule
      })
    }
  }, [isModalOpen, schedule, form])

  return (
    <>
      <button
        className="text-app-secondary font-medium hover:underline"
        onClick={handleModalOpen}
      >
        Editar
      </button>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="px-12 max-h-[80vh] overflow-y-auto"
         onInteractOutside={(e) => {
           if (isPending) {
             e.preventDefault()
           }
         }}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Controller
                control={form.control}
                name="schedule"
                render={({ field }) => (
                  <ListOfSchedules
                    title="Editar horario de atención"
                    description="Completa los horarios de atención para cada día"
                    schedule={field.value}
                    onScheduleChange={field.onChange}
                    errors={form.formState.errors.schedule}
                    isPending={isPending}
                  />
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
