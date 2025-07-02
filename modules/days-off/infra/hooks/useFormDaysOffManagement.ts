import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { DaysOffModel } from '@/modules/days-off/domain/models/days-off.model'
import { useDaysOffFormMutation } from '@/modules/days-off/infra/hooks/useDaysOffFormMutation'

export const formDaysOffManagementSchema = z.object({
  tipo_dia_libre_maintable_id: z.number().int().positive({ message: 'Debe seleccionar un tipo de día libre' }),
  fecha_inicio: z.string().min(1, { message: 'La fecha de inicio es requerida' }),
  fecha_fin: z.string().min(1, { message: 'La fecha de fin es requerida' }),
  hora_inicio: z.string().min(1, { message: 'La hora de inicio es requerida' }),
  hora_fin: z.string().min(1, { message: 'La hora de fin es requerida' }),
  motivo: z.string().min(3, { message: 'El motivo debe tener al menos 3 caracteres' }).max(255, { message: 'El motivo no puede exceder 255 caracteres' })
})

type FormDaysOffManagementInputs = z.infer<typeof formDaysOffManagementSchema>

export function useFormDaysOffManagement (
  toggleModal: () => void,
  dayOff: DaysOffModel | null,
  userId: number,
  selectedDate: string
) {
  const form = useForm<FormDaysOffManagementInputs>({
    resolver: zodResolver(formDaysOffManagementSchema),
    defaultValues: {
      tipo_dia_libre_maintable_id: 0,
      fecha_inicio: selectedDate,
      fecha_fin: selectedDate,
      hora_inicio: '09:00',
      hora_fin: '19:00',
      motivo: ''
    }
  })

  const { reset } = form
  const { mutate, isPending } = useDaysOffFormMutation(dayOff, toggleModal, userId)

  useEffect(() => {
    if (dayOff) {
      // Modo edición - cargar datos existentes
      reset({
        tipo_dia_libre_maintable_id: dayOff.tipo_dia_libre_maintable_id,
        fecha_inicio: dayOff.fecha_inicio,
        fecha_fin: dayOff.fecha_fin,
        hora_inicio: dayOff.hora_inicio.slice(0, 5), // Quitar segundos
        hora_fin: dayOff.hora_fin.slice(0, 5), // Quitar segundos
        motivo: dayOff.motivo
      })
    } else {
      // Modo creación - valores por defecto
      reset({
        tipo_dia_libre_maintable_id: 0,
        fecha_inicio: selectedDate,
        fecha_fin: selectedDate,
        hora_inicio: '09:00',
        hora_fin: '19:00',
        motivo: ''
      })
    }
  }, [dayOff, selectedDate, reset])

  const onSubmit = (values: FormDaysOffManagementInputs) => {
    mutate(values)
  }

  return {
    form,
    onSubmit,
    isEdit: Boolean(dayOff),
    isPending
  }
}
