import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createDayOff, updateDayOffDetails } from '@/modules/days-off/application/days-off.action'
import { DaysOffModel, CreateDaysOffRequest, UpdateDaysOffDetailsRequest } from '@/modules/days-off/domain/models/days-off.model'
import { QUERY_KEYS_USER_LOCATION_MANAGEMENT, QUERY_KEYS_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { z } from 'zod'
import { formDaysOffManagementSchema } from '@/modules/days-off/infra/hooks/useFormDaysOffManagement'

type DaysOffResponse = {
  id: number
  mensaje?: string
}

export function useDaysOffFormMutation (
  dayOff: DaysOffModel | null,
  toggleModal: () => void,
  userId: number
) {
  const queryClient = useQueryClient()

  return useMutation<DaysOffResponse, Error, z.infer<typeof formDaysOffManagementSchema>>({
    mutationFn: async (data) => {
      if (dayOff) {
        // Modo edición - usar updateDayOffDetails
        const updateData: UpdateDaysOffDetailsRequest = {
          tipo_dia_libre_maintable_id: data.tipo_dia_libre_maintable_id,
          fecha_inicio: data.fecha_inicio,
          fecha_fin: data.fecha_fin,
          hora_inicio: `${data.hora_inicio}:00`,
          hora_fin: `${data.hora_fin}:00`,
          motivo: data.motivo
        }

        await updateDayOffDetails(dayOff.id!, updateData)
        return { id: dayOff.id!, mensaje: 'Día libre actualizado exitosamente' }
      } else {
        // Modo creación - usar createDayOff
        const createData: CreateDaysOffRequest = {
          fecha_inicio: data.fecha_inicio,
          fecha_fin: data.fecha_fin,
          hora_inicio: `${data.hora_inicio}:00`,
          hora_fin: `${data.hora_fin}:00`,
          motivo: data.motivo,
          tipo_dia_libre_maintable_id: data.tipo_dia_libre_maintable_id,
          user_id: userId
        }

        const newId = await createDayOff(createData)
        return { id: newId, mensaje: 'Día libre creado exitosamente' }
      }
    },
    onError: (error) => {
      // Manejo específico de errores
      if (error instanceof Error) {
        const errorMessage = error.message

        if (errorMessage.includes('User ID') && errorMessage.includes('does not exist')) {
          alert(`Error: El usuario con ID ${userId} no existe o no está activo. Por favor, verifica que el usuario sea válido.`)
        } else if (errorMessage.includes('404')) {
          alert('Error: No se pudo procesar la solicitud. Verifica que todos los datos sean correctos.')
        } else {
          alert(`Error al ${dayOff ? 'actualizar' : 'crear'} el día libre: ${errorMessage}`)
        }
      } else {
        alert(`Error desconocido al ${dayOff ? 'actualizar' : 'crear'} el día libre`)
      }
    },
    onSuccess: (data) => {
      // Invalidar múltiples queries relacionadas para asegurar actualización
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS_USER_LOCATION_MANAGEMENT.ULMGetUserLocationEvents]
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS_LOCATION_MANAGEMENT.LMGetLocation]
      })

      // Forzar refetch inmediato para mejor UX
      queryClient.refetchQueries({
        queryKey: [QUERY_KEYS_USER_LOCATION_MANAGEMENT.ULMGetUserLocationEvents]
      })

      console.log(data.mensaje)
      toggleModal()
    }
  })
}
