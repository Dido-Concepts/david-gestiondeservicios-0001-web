import { getQueryClient } from '@/app/providers/GetQueryClient'
import { toast } from '@/hooks/use-toast'
import { QUERY_KEYS_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { createRegex } from '@/modules/share/infra/constants/regex.constant'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { LocationCreateResponse, useCreateLocationMutation } from './useCreateLocationMutation'

// Enum para los días de la semana
const daysOfWeek = [
  'Lunes',
  'Martes',
  'Miercoles',
  'Jueves',
  'Viernes',
  'Sabado',
  'Domingo'
] as const

// Esquema para un rango de tiempo
const timeRangeSchema = z
  .object({
    start: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:mm)'),
    end: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:mm)')
  })
  .refine((data) => data.start < data.end, {
    message: 'La hora de fin debe ser posterior a la hora de inicio'
  })

// Función para detectar solapamientos o duplicados en los rangos
function hasInvalidRanges (ranges: Array<{ start: string; end: string }>) {
  const sortedRanges = [...ranges].sort((a, b) =>
    a.start.localeCompare(b.start)
  )
  for (let i = 0; i < sortedRanges.length - 1; i++) {
    if (sortedRanges[i].end > sortedRanges[i + 1].start) {
      return true // Hay solapamiento o duplicado
    }
  }
  return false
}

// Esquema para un día del horario
const scheduleDaySchema = z.object({
  day: z.enum(daysOfWeek),
  ranges: z
    .array(timeRangeSchema)
    .refine((ranges) => !hasInvalidRanges(ranges), {
      message: 'Los rangos no deben solaparse ni duplicarse'
    })
})

// Esquema para el horario completo
const scheduleSchema = z.array(scheduleDaySchema).refine(
  (schedule) => {
    const days = schedule.map((s) => s.day)
    return days.length === 7 && new Set(days).size === 7
  },
  {
    message:
      'Debe haber exactamente un horario para cada día de la semana sin duplicados'
  }
)

// Esquema completo del formulario, incluyendo schedule
export const formLocationManagementSchema = z.object({
  nameLocation: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre debe tener como máximo 50 caracteres')
    .regex(createRegex(), 'El nombre no debe contener caracteres especiales'),
  phoneLocation: z
    .string()
    .length(9, 'El teléfono debe tener exactamente 9 dígitos')
    .regex(
      /^[9]\d{8}$/,
      "El teléfono debe comenzar con '9' y ser seguido por 8 dígitos"
    ),
  addressLocation: z
    .string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(100, 'La dirección debe tener como máximo 100 caracteres')
    .regex(
      createRegex('.#'),
      "La dirección solo debe contener letras, números, espacios, '.', o '#'"
    ),
  reviewLocation: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .optional()
    .refine(
      (val) => val === undefined || (val.length >= 10 && val.length <= 100),
      'La reseña debe tener entre 10 y 100 caracteres'
    )
    .refine(
      (val) => val === undefined || createRegex(',.#').test(val),
      "La reseña solo debe contener letras, números, espacios, ',', '#' o '.'"
    ),
  imgLocation: z
    .instanceof(File)
    .refine(
      (file) => file.type.startsWith('image/'),
      'La imagen debe ser un archivo de imagen válido'
    ),
  schedule: scheduleSchema
})

export type formLocationManagementInputs = z.infer<
  typeof formLocationManagementSchema
>;

// Hook del formulario actualizado
export function useFormCreateLocation ({
  handleModalOpen,
  onSuccessHandler
}: {
  handleModalOpen: () => void;
  onSuccessHandler?: (data: LocationCreateResponse) => void;
}) {
  const defaultSchedule = daysOfWeek.map((day) => ({
    day,
    ranges: [{ start: '09:00', end: '19:00' }]
  }))

  const form = useForm<formLocationManagementInputs>({
    resolver: zodResolver(formLocationManagementSchema),
    mode: 'onChange',
    defaultValues: {
      nameLocation: '',
      phoneLocation: '',
      addressLocation: '',
      reviewLocation: '',
      imgLocation: undefined,
      schedule: defaultSchedule
    }
  })

  const { reset } = form
  const { mutate, isPending } = useCreateLocationMutation()

  const onSubmit = (values: formLocationManagementInputs) => {
    const formData = new FormData()
    formData.append('nameLocation', values.nameLocation)
    formData.append('phoneLocation', values.phoneLocation)
    formData.append('addressLocation', values.addressLocation)
    if (values.reviewLocation) {
      formData.append('reviewLocation', values.reviewLocation)
    }
    formData.append('imgLocation', values.imgLocation)
    formData.append('schedule', JSON.stringify(values.schedule))

    mutate(formData, {
      onError: (error) => {
        console.log(error)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message || 'Failed to create location'
        })
        reset()
        handleModalOpen()
      },
      onSuccess: (data) => {
        const queryClient = getQueryClient()
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS_LOCATION_MANAGEMENT.LMListLocations]
        })
        toast({
          title: 'Sede creada',
          description: `Ubicación ${data.name} creada`
        })
        reset()
        handleModalOpen()
        if (onSuccessHandler) {
          onSuccessHandler(data)
        }
      }
    })
  }

  return { form, onSubmit, isPending }
}
