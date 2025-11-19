'use client'
import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createDayOff } from '@/modules/days-off/application/days-off.action'
import { CreateDaysOffRequest } from '@/modules/days-off/domain/models/days-off.model'
import { QUERY_KEYS_LOCATION_MANAGEMENT, QUERY_KEYS_USER_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { useDayOffTypes } from '@/modules/days-off/infra/hooks/useDayOffTypes'

interface AddModalShiftFreeProps {
  isOpen: boolean
  onClose: () => void
  employeeName: string
  selectedDate: string
  userId: number
}

const AddModalShiftFree = ({ isOpen, onClose, employeeName, selectedDate, userId }: AddModalShiftFreeProps) => {
  const [typeId, setTypeId] = useState<number>()
  const [startDate, setStartDate] = useState(selectedDate)
  const [endDate, setEndDate] = useState(selectedDate)
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('19:00')
  const [motivo, setMotivo] = useState('')

  const queryClient = useQueryClient()

  // Usar el hook para obtener los tipos de días libres desde la API maintable
  const { data: dayOffTypesResponse, isLoading: isLoadingTypes, error: typesError } = useDayOffTypes()

  const createDayOffMutation = useMutation({
    mutationFn: createDayOff,
    onSuccess: () => {
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

      onClose()

      // Reset form
      setTypeId(undefined)
      setStartDate(selectedDate)
      setEndDate(selectedDate)
      setStartTime('09:00')
      setEndTime('19:00')
      setMotivo('')
    },
    onError: (error) => {
      // Manejo específico de errores
      if (error instanceof Error) {
        const errorMessage = error.message

        if (errorMessage.includes('User ID') && errorMessage.includes('does not exist')) {
          alert(`Error: El usuario con ID ${userId} no existe o no está activo. Por favor, verifica que el usuario sea válido.`)
        } else if (errorMessage.includes('404')) {
          alert('Error: No se pudo crear el día libre. Verifica que todos los datos sean correctos.')
        } else {
          alert(`Error al crear el día libre: ${errorMessage}`)
        }
      } else {
        alert('Error desconocido al crear el día libre')
      }
    }
  })

  const handleSave = () => {
    if (!motivo.trim()) {
      alert('Por favor ingrese un motivo para el día libre')
      return
    }

    if (!typeId) {
      alert('Por favor seleccione un tipo de día libre')
      return
    }

    const dayOffData: CreateDaysOffRequest = {
      fecha_inicio: startDate,
      fecha_fin: endDate,
      hora_inicio: `${startTime}:00`,
      hora_fin: `${endTime}:00`,
      motivo,
      tipo_dia_libre_maintable_id: typeId,
      user_id: userId
    }

    createDayOffMutation.mutate(dayOffData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Añadir días libres</h2>

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
            disabled={createDayOffMutation.isPending}
          >
            Cancelar
          </button>
          <button
            className="bg-black text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
            onClick={handleSave}
            disabled={createDayOffMutation.isPending || isLoadingTypes}
          >
            {createDayOffMutation.isPending ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddModalShiftFree
