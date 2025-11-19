'use client'
import React, { useState, useEffect } from 'react'
import { useUpdateShiftDetailsMutation, useDeleteShiftMutation } from '@/modules/shift/infra/hooks/useShiftFormMutation'

interface EditModalShiftProps {
  isOpen: boolean
  onClose: () => void
  employeeName: string
  selectedDate: string
  shift: string
  shiftId: number
  shiftDate: string
}

const EditModalShift = ({
  isOpen,
  onClose,
  employeeName,
  selectedDate,
  shift,
  shiftId,
  shiftDate
}: EditModalShiftProps) => {
  const [startTime, setStartTime] = useState<string>('09:00')
  const [endTime, setEndTime] = useState<string>('19:00')

  const updateShiftDetailsMutation = useUpdateShiftDetailsMutation()
  const deleteShiftMutation = useDeleteShiftMutation()

  useEffect(() => {
    if (shift) {
      const [start, end] = shift.split(' - ')
      setStartTime(start || '09:00')
      setEndTime(end || '19:00')
    }
  }, [shift, isOpen])

  const calculateDuration = () => {
    const [startHour, startMinutes] = startTime.split(':').map(Number)
    const [endHour, endMinutes] = endTime.split(':').map(Number)

    const startTotalMinutes = startHour * 60 + startMinutes
    const endTotalMinutes = endHour * 60 + endMinutes
    const durationMinutes = endTotalMinutes - startTotalMinutes

    return durationMinutes > 0 ? `${Math.floor(durationMinutes / 60)} h` : '0 h'
  }

  const handleSave = () => {
    const horaInicio = `${startTime}:00`
    const horaFin = `${endTime}:00`

    updateShiftDetailsMutation.mutate({
      id: shiftId,
      details: {
        fecha_turno: shiftDate,
        hora_inicio: horaInicio,
        hora_fin: horaFin
      }
    }, {
      onSuccess: () => {
        onClose()
      }
    })
  }

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este turno?')) {
      deleteShiftMutation.mutate(shiftId, {
        onSuccess: () => {
          onClose()
        }
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          Turno de {employeeName} el {selectedDate}
        </h2>

        <div className="flex items-center gap-4">
          <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium mb-1">Hora de inicio</label>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border rounded p-2"
              disabled={updateShiftDetailsMutation.isPending || deleteShiftMutation.isPending}
            >
              {Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`).map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
          </div>

          <span className="text-lg">-</span>

          <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium mb-1">Hora de finalización</label>
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border rounded p-2"
              disabled={updateShiftDetailsMutation.isPending || deleteShiftMutation.isPending}
            >
              {Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`).map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-right text-sm mt-2 text-gray-600">{calculateDuration()}</div>

        <div className="flex justify-between mt-6">
          <button
            className="text-red-600 border border-red-600 px-4 py-2 rounded-lg hover:bg-red-50 disabled:opacity-50"
            onClick={handleDelete}
            disabled={updateShiftDetailsMutation.isPending || deleteShiftMutation.isPending}
          >
            {deleteShiftMutation.isPending ? 'Eliminando...' : 'Eliminar'}
          </button>
          <div className="flex gap-3">
            <button
              className="border px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              onClick={onClose}
              disabled={updateShiftDetailsMutation.isPending || deleteShiftMutation.isPending}
            >
              Cancelar
            </button>
            <button
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
              onClick={handleSave}
              disabled={updateShiftDetailsMutation.isPending || deleteShiftMutation.isPending}
            >
              {updateShiftDetailsMutation.isPending ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditModalShift
//
