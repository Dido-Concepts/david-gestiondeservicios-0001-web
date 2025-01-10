'use client'
import { useState } from 'react'

const CellShiftManagement = ({ shift }: { shift: string }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <div
        className="text-sm p-3 font-medium text-center bg-blue-100 rounded-md cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {shift}
      </div>
      {isOpen && (
        <div className="absolute z-10 left-0 mt-2 w-32 bg-white border border-gray-300 shadow-md rounded-md">
          <ul className="py-1 text-sm text-gray-700">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Editar</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Eliminar</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default CellShiftManagement
