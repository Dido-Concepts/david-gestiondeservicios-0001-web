'use client'
import React, { useState } from 'react'

interface AddModalShiftProps {
  isOpen: boolean
  onClose: () => void
  employeeName: string
  selectedDate: string
}

const AddModalShift = ({ isOpen, onClose, employeeName, selectedDate }: AddModalShiftProps) => {
  const [startTime, setStartTime] = useState<string>('10:00')
  const [endTime, setEndTime] = useState<string>('17:00')

  // Calcular la duración del turno en horas
  const calculateDuration = () => {
    const [startHour, startMinutes] = startTime.split(':').map(Number)
    const [endHour, endMinutes] = endTime.split(':').map(Number)

    const startTotalMinutes = startHour * 60 + startMinutes
    const endTotalMinutes = endHour * 60 + endMinutes
    const durationMinutes = endTotalMinutes - startTotalMinutes

    return durationMinutes > 0 ? `${Math.floor(durationMinutes / 60)} h` : '0 h'
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

        <button className="text-purple-600 mt-4 text-sm">+ Añadir turno</button>

        <p className="text-sm text-gray-500 mt-2">
          Solo estás editando los turnos de este día. Para configurar los turnos habituales, ve a{' '}
          <a href="#" className="text-blue-500 underline">
            turnos programados
          </a>
          .
        </p>

        <div className="flex justify-between mt-6">
          <button className="text-red-600 border border-red-600 px-4 py-2 rounded-lg">Eliminar</button>
          <div className="flex gap-3">
            <button className="border px-4 py-2 rounded-lg" onClick={onClose}>
              Cancelar
            </button>
            <button className="bg-black text-white px-4 py-2 rounded-lg">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddModalShift
