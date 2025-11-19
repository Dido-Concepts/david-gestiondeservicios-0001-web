'use client'
import React, { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateDayOffDetails } from '@/modules/days-off/application/days-off.action'
import { UpdateDaysOffDetailsRequest } from '@/modules/days-off/domain/models/days-off.model'
import { QUERY_KEYS_USER_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { useDayOffTypes } from '@/modules/days-off/infra/hooks/useDayOffTypes'

interface EditModalShiftFreeProps {
  isOpen: boolean
  onClose: () => void
  employeeName: string
  selectedDate: string
  userId: number
  dayOffId?: number
  initialData?: {
    type: string
    startDate: string
    endDate: string
    startTime: string
    endTime: string
    motivo: string
  }
}

// Interfaz para los tipos de días libres transformados
interface DayOffType {
  id: number
  name: string
  value: string
  description: string
  order: number
}

const EditModalShiftFree = ({
  isOpen,
  onClose,
  employeeName,
  selectedDate,
  dayOffId,
  initialData
}: EditModalShiftFreeProps) => {
  const [typeId, setTypeId] = useState<number>(1) // Valor por defecto
  const [startDate, setStartDate] = useState(initialData?.startDate || selectedDate)
  const [endDate, setEndDate] = useState(initialData?.endDate || selectedDate)
  const [startTime, setStartTime] = useState(initialData?.startTime || '09:00')
  const [endTime, setEndTime] = useState(initialData?.endTime || '19:00')
  const [motivo, setMotivo] = useState(initialData?.motivo || '')

  const queryClient = useQueryClient()

  // Usar el hook para obtener los tipos de días libres desde la API maintable
  const { data: dayOffTypesResponse, isLoading: isLoadingTypes, error: typesError } = useDayOffTypes()

  // Función para encontrar el ID del tipo basándose en su nombre
  const findTypeIdByName = (typeName: string, types: DayOffType[]): number => {
    if (!types || types.length === 0) return 1 // Valor por defecto

    const foundType = types.find(type =>
      type.name.toLowerCase().trim() === typeName.toLowerCase().trim()
    )

    return foundType ? foundType.id : 1 // Si no encuentra el tipo, usa ID 1 por defecto
  }

  // Actualizar los valores cuando se abra el modal, cambien los datos iniciales, o se carguen los tipos
  useEffect(() => {
    if (initialData && dayOffTypesResponse?.types) {
      setStartDate(initialData.startDate)
      setEndDate(initialData.endDate)
      setStartTime(initialData.startTime)
      setEndTime(initialData.endTime)
      setMotivo(initialData.motivo)

      // Mapear el tipo desde el nombre al ID usando la API real
      const typeId = findTypeIdByName(initialData.type, dayOffTypesResponse.types)
      setTypeId(typeId)
    }
  }, [initialData, dayOffTypesResponse])

  // Debug: Log del dayOffId cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      console.log('🔍 DEBUG - EditModalShiftFree abierto:', {
        dayOffId,
        initialData,
        employeeName,
        selectedDate
      })
    }
  }, [isOpen, dayOffId, initialData, employeeName, selectedDate])

  const updateDayOffMutation = useMutation({
    mutationFn: ({ dayOffId, details }: { dayOffId: number; details: UpdateDaysOffDetailsRequest }) =>
      updateDayOffDetails(dayOffId, details),
    onSuccess: () => {
      // Invalidar queries para refrescar la tabla
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS_USER_LOCATION_MANAGEMENT.ULMGetUserLocationEvents]
      })

      console.log('Día libre actualizado exitosamente')
      onClose()
    },
    onError: (error) => {
      console.error('Error actualizando día libre:', error)
      console.error('🔍 DEBUG - Datos enviados:', {
        dayOffId,
        datos: {
          tipo_dia_libre_maintable_id: typeId,
          fecha_inicio: startDate,
          fecha_fin: endDate,
          hora_inicio: `${startTime}:00`,
          hora_fin: `${endTime}:00`,
          motivo
        }
      })
      alert(`Error al actualizar el día libre: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  })

  const handleSave = () => {
    if (!motivo.trim()) {
      alert('Por favor ingrese un motivo para el día libre')
      return
    }

    if (!dayOffId) {
      alert('Error: No se puede editar este día libre. El ID no está disponible.')
      console.error('🔍 DEBUG - dayOffId no disponible:', { dayOffId, initialData })
      return
    }

    if (!typeId) {
      alert('Por favor seleccione un tipo de día libre')
      return
    }

    const dayOffDetails: UpdateDaysOffDetailsRequest = {
      tipo_dia_libre_maintable_id: typeId,
      fecha_inicio: startDate,
      fecha_fin: endDate,
      hora_inicio: `${startTime}:00`,
      hora_fin: `${endTime}:00`,
      motivo
    }

    console.log('🔍 DEBUG - Enviando actualización:', {
      dayOffId,
      details: dayOffDetails
    })

    updateDayOffMutation.mutate({ dayOffId, details: dayOffDetails })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Editar días libres</h2>

        {/* Debug Info - Solo visible en desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <strong>🔍 DEBUG:</strong> dayOffId = {dayOffId || 'No disponible'}
          </div>
        )}

        {/* Mostrar empleado seleccionado (solo lectura) */}
        <div className="flex flex-col mb-3">
          <label className="text-sm font-medium mb-1">Miembro del equipo</label>
          <input
            type="text"
            value={employeeName}
            disabled
            className="border rounded p-2 bg-gray-100 text-gray-600"
          />
        </div>

        {/* Selección del Tipo de día libre */}
        <div className="flex flex-col mb-3">
          <label className="text-sm font-medium mb-1">Tipo</label>

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
              Error al cargar los tipos de días libres: {(typesError as Error).message}
            </div>
                )
              : (
            <select
              value={typeId || ''}
              onChange={(e) => setTypeId(Number(e.target.value))}
              className="border rounded p-2"
            >
              <option value="">Seleccione un tipo</option>
              {dayOffTypesResponse?.types?.map((type) => (
                <option key={type.id} value={type.id} title={type.description}>
                  {type.name}
                </option>
              ))}
            </select>
                )}

          {/* Mostrar descripción del tipo seleccionado */}
          {typeId && dayOffTypesResponse?.types && (
            <div className="text-xs text-gray-600 mt-1">
              {dayOffTypesResponse.types.find(t => t.id === typeId)?.description}
            </div>
          )}
        </div>

        {/* Motivo del día libre */}
        <div className="flex flex-col mb-3">
          <label className="text-sm font-medium mb-1">Motivo</label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ingrese el motivo del día libre..."
            className="border rounded p-2 min-h-[60px] resize-none"
          />
        </div>

        <div className="flex gap-4 mb-3">
          {/* Fecha de inicio */}
          <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium mb-1">Fecha de inicio</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded p-2"
            />
          </div>

          {/* Fecha de fin */}
          <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium mb-1">Fecha de fin</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded p-2"
            />
          </div>
        </div>

        <div className="flex gap-4">
          {/* Hora de inicio */}
          <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium mb-1">Hora de inicio</label>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border rounded p-2"
            >
              {Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`).map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
          </div>

          {/* Hora de finalización */}
          <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium mb-1">Hora de finalización</label>
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border rounded p-2"
            >
              {Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`).map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Información de carga */}
        {dayOffTypesResponse?.meta && (
          <div className="text-xs text-gray-500 mt-2">
            Total de tipos disponibles: {dayOffTypesResponse.meta.total}
          </div>
        )}

        {/* Botones */}
        <div className="flex justify-end mt-6 gap-3">
          <button
            className="border px-4 py-2 rounded-lg"
            onClick={onClose}
            disabled={updateDayOffMutation.isPending}
          >
            Cancelar
          </button>
          <button
            className="bg-black text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
            onClick={handleSave}
            disabled={updateDayOffMutation.isPending || isLoadingTypes}
          >
            {updateDayOffMutation.isPending ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditModalShiftFree
