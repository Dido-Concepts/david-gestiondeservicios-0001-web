'use client'
import React, { useState } from 'react'
import { useCreateShiftMutation } from '@/modules/shift/infra/hooks/useShiftFormMutation'
import { CreateShiftRequest } from '@/modules/shift/domain/models/shift.model'
import { useSearchParams } from 'next/navigation'

interface AddModalShiftProps {
  isOpen: boolean
  onClose: () => void
  employeeName: string
  selectedDate: string
  userId: number
}

const AddModalShift = ({ isOpen, onClose, employeeName, selectedDate, userId }: AddModalShiftProps) => {
  const [startTime, setStartTime] = useState<string>('10:00')
  const [endTime, setEndTime] = useState<string>('17:00')

  const searchParams = useSearchParams()
  const locationFilter = searchParams.get('locationFilter') || '1'

  const createShiftMutation = useCreateShiftMutation()

  // Calcular la duración del turno en horas
  const calculateDuration = () => {
    const [startHour, startMinutes] = startTime.split(':').map(Number)
    const [endHour, endMinutes] = endTime.split(':').map(Number)

    const startTotalMinutes = startHour * 60 + startMinutes
    const endTotalMinutes = endHour * 60 + endMinutes
    const durationMinutes = endTotalMinutes - startTotalMinutes

    return durationMinutes > 0 ? `${Math.floor(durationMinutes / 60)} h` : '0 h'
  }

  const handleSave = () => {
    const shiftData: CreateShiftRequest = {
      fecha_turno: selectedDate,
      hora_inicio: `${startTime}:00`,
      hora_fin: `${endTime}:00`,
      sede_id: parseInt(locationFilter),
      user_id: userId
    }

    createShiftMutation.mutate(shiftData)
    onClose()

    // Reset form
    setStartTime('10:00')
    setEndTime('17:00')
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

        <p className="text-sm text-gray-500 mt-2">
          Solo estás editando los turnos de este día. Para configurar los turnos habituales, ve a{' '}
          <a href="#" className="text-blue-500 underline">
            turnos programados
          </a>
          .
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="border px-4 py-2 rounded-lg"
            onClick={onClose}
            disabled={createShiftMutation.isPending}
          >
            Cancelar
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            onClick={handleSave}
            disabled={createShiftMutation.isPending}
          >
            {createShiftMutation.isPending ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddModalShift
//
