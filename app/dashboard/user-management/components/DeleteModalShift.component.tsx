'use client'
import React from 'react'

interface DeleteModalShiftProps {
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
}

const DeleteModalShift = ({ isOpen, onClose, onDelete }: DeleteModalShiftProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg">
        <h2 className="text-xl font-semibold mb-3">Eliminar turno</h2>
        <p className="text-gray-600 mb-5">Esta acción no se puede deshacer</p>

        <div className="flex justify-end gap-3">
          <button className="border px-4 py-2 rounded-lg" onClick={onClose}>
            Cancelar
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg" onClick={onDelete}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModalShift
