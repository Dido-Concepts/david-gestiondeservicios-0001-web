'use client'
import React, { useState, useEffect } from 'react'

interface EditModalShiftFreeProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { employee: string; type: string; date: string; startTime: string; endTime: string }) => void
  initialData: { employee: string; type: string; date: string; startTime: string; endTime: string }
}

const EditModalShiftFree = ({ isOpen, onClose, onSave, initialData }: EditModalShiftFreeProps) => {
  const [employee, setEmployee] = useState(initialData.employee)
  const [type, setType] = useState(initialData.type)
  const [date, setDate] = useState(initialData.date)
  const [startTime, setStartTime] = useState(initialData.startTime)
  const [endTime, setEndTime] = useState(initialData.endTime)

  // Actualizar los valores cuando se abra el modal
  useEffect(() => {
    if (isOpen) {
      setEmployee(initialData.employee)
      setType(initialData.type)
      setDate(initialData.date)
      setStartTime(initialData.startTime)
      setEndTime(initialData.endTime)
    }
  }, [isOpen, initialData])

  const handleSave = () => {
    onSave({ employee, type, date, startTime, endTime })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Editar días libres</h2>

        {/* Selección de Miembro del equipo */}
        {/* <div className="flex flex-col mb-3">
          <label className="text-sm font-medium mb-1">Miembro del equipo</label>
          <select
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
            className="border rounded p-2"
          >
            <option value="Demetrio Vázquez">Demetrio Vázquez</option>
            <option value="Beto Cerv">Beto Cerv</option>
            <option value="Wendy Smith">Wendy Smith</option>
          </select>
        </div> */}

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
          </select>
        </div>

        <div className="flex gap-4">
          {/* Selección de Fecha */}
          <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium mb-1">Fecha de inicio</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded p-2"
            />
          </div>

          {/* Selección de Hora de inicio */}
          <div className="flex flex-col w-1/4">
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

          {/* Selección de Hora de finalización */}
          <div className="flex flex-col w-1/4">
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
          <button className="border px-4 py-2 rounded-lg" onClick={onClose}>
            Cancelar
          </button>
          <button className="bg-black text-white px-4 py-2 rounded-lg" onClick={handleSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditModalShiftFree
//
