'use client'
import React, { useState, useEffect } from 'react'

interface EditModalShiftProps {
  isOpen: boolean
  onClose: () => void
  employeeName: string
  selectedDate: string // Se recibe formateado desde `TableShiftManagement`
  shift: string // Ejemplo: "09:00 - 19:00"
}

const EditModalShift = ({ isOpen, onClose, employeeName, selectedDate, shift }: EditModalShiftProps) => {
  const [startTime, setStartTime] = useState<string>('09:00')
  const [endTime, setEndTime] = useState<string>('19:00')

  useEffect(() => {
    if (shift) {
      const [start, end] = shift.split(' - ') // Separar "09:00 - 19:00"
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          Turno de {employeeName} el {selectedDate} {/* ✅ Título dinámico */}
        </h2>

        <div className="flex items-center gap-4">
          <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium mb-1">Hora de inicio</label>
            <select value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border rounded p-2">
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
            <select value={endTime} onChange={(e) => setEndTime(e.target.value)} className="border rounded p-2">
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

export default EditModalShift
