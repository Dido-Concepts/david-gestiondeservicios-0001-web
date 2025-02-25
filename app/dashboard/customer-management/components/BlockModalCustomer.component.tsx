'use client'
import React, { useState } from 'react'

interface BlockModalCustomerProps {
  isOpen: boolean
  onClose: () => void
  onBlock: (reason: string) => void
}

const BlockModalCustomer = ({ isOpen, onClose, onBlock }: BlockModalCustomerProps) => {
  const [blockReason, setBlockReason] = useState('')

  if (!isOpen) return null

  const handleBlock = () => {
    if (blockReason) {
      onBlock(blockReason)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg text-start">
        <h2 className="text-xl font-semibold mb-3">Bloquear cliente</h2>
        <p className="text-gray-700 mb-2">
          ¿Quieres bloquear a este cliente?
        </p>
        <p className="text-gray-600 mb-2 text-sm">
          Si lo bloqueas, este cliente no podrá reservar citas online, ya que no encontrará horas disponibles.
        </p>
        <p className="text-gray-600 mb-5 text-sm">
          Los clientes bloqueados también quedan excluidos automáticamente de los mensajes de marketing.
        </p>

        {/* Motivo del bloqueo */}
        <div className="flex flex-col mb-4">
          <label className="text-sm font-medium mb-1">Selecciona el motivo del bloqueo</label>
          <select
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="" disabled>Selecciona el motivo del bloqueo</option>
            <option value="No asistió a citas">No asistió a citas</option>
            <option value="Comportamiento inapropiado">Comportamiento inapropiado</option>
            <option value="Solicitud del cliente">Solicitud del cliente</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3">
          <button className="border px-4 py-2 rounded-lg" onClick={onClose}>
            Cancelar
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-white ${
              blockReason ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
            onClick={handleBlock}
            disabled={!blockReason}
          >
            Bloquear
          </button>
        </div>
      </div>
    </div>
  )
}

export default BlockModalCustomer
