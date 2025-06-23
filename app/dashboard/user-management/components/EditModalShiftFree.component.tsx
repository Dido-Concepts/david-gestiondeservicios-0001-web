'use client'
import React, { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateDayOff } from '@/modules/days-off/application/days-off.action'
import { CreateDaysOffRequest } from '@/modules/days-off/domain/models/days-off.model'
import { QUERY_KEYS_USER_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'

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

const EditModalShiftFree = ({
  isOpen,
  onClose,
  employeeName,
  selectedDate,
  dayOffId,
  initialData
}: EditModalShiftFreeProps) => {
  const [type, setType] = useState(initialData?.type || 'Vacaciones anuales')
  const [startDate, setStartDate] = useState(initialData?.startDate || selectedDate)
  const [endDate, setEndDate] = useState(initialData?.endDate || selectedDate)
  const [startTime, setStartTime] = useState(initialData?.startTime || '09:00')
  const [endTime, setEndTime] = useState(initialData?.endTime || '19:00')
  const [motivo, setMotivo] = useState(initialData?.motivo || '')

  const queryClient = useQueryClient()

  // Mapeo de tipos a IDs (esto debería venir de una API en producción)
  const typeToIdMap: Record<string, number> = {
    'Vacaciones anuales': 1,
    'Licencia médica': 2,
    'Permiso personal': 3,
    'Día libre': 4
  }

  // Actualizar los valores cuando se abra el modal
  useEffect(() => {
    if (isOpen && initialData) {
      setType(initialData.type)
      setStartDate(initialData.startDate)
      setEndDate(initialData.endDate)
      setStartTime(initialData.startTime)
      setEndTime(initialData.endTime)
      setMotivo(initialData.motivo)
    }
  }, [isOpen, initialData])

  const updateDayOffMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateDaysOffRequest> }) =>
      updateDayOff(id, data),
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
      // Aquí podrías mostrar un toast de error
    }
  })

  const handleSave = () => {
    if (!motivo.trim()) {
      alert('Por favor ingrese un motivo para el día libre')
      return
    }

    if (!dayOffId) {
      alert('Error: ID del día libre no disponible')
      return
    }

    const dayOffData: Partial<CreateDaysOffRequest> = {
      fecha_inicio: startDate,
      fecha_fin: endDate,
      hora_inicio: `${startTime}:00`,
      hora_fin: `${endTime}:00`,
      motivo,
      tipo_dia_libre_maintable_id: typeToIdMap[type] || 1
    }

    updateDayOffMutation.mutate({ id: dayOffId, data: dayOffData })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Editar días libres</h2>

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
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border rounded p-2"
          >
            <option value="Vacaciones anuales">Vacaciones anuales</option>
            <option value="Licencia médica">Licencia médica</option>
            <option value="Permiso personal">Permiso personal</option>
            <option value="Día libre">Día libre</option>
          </select>
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
            disabled={updateDayOffMutation.isPending}
          >
            {updateDayOffMutation.isPending ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditModalShiftFree
//
