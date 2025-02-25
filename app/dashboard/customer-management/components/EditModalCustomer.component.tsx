'use client'
import React, { useState, useEffect } from 'react'

interface EditModalCustomerProps {
  isOpen: boolean
  onClose: () => void
  customerData: { fullName: string; email: string; phone: string; birthDate: string }
}

const EditModalCustomer = ({ isOpen, onClose, customerData }: EditModalCustomerProps) => {
  // Estado inicial para los datos del cliente
  const [fullName, setFullName] = useState(customerData.fullName)
  const [email, setEmail] = useState(customerData.email)
  const [phone, setPhone] = useState(customerData.phone)
  const [birthDate, setBirthDate] = useState(customerData.birthDate)

  useEffect(() => {
    // Actualiza los datos si el modal se abre y los datos del cliente cambian
    if (isOpen) {
      setFullName(customerData.fullName)
      setEmail(customerData.email)
      setPhone(customerData.phone)
      setBirthDate(customerData.birthDate)
    }
  }, [isOpen, customerData])

  const handleSave = () => {
    console.log('Cliente actualizado:', { fullName, email, phone, birthDate })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-1000">
      <div className="bg-white rounded-lg p-6 w-[500px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-left">Editar Cliente</h2>

        {/* Nombre completo */}
        <div className="flex flex-col mb-3">
          <label className="text-sm font-medium mb-1 text-left">Nombre completo</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col mb-3">
          <label className="text-sm font-medium mb-1 text-left">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* Teléfono */}
        <div className="flex flex-col mb-3">
          <label className="text-sm font-medium mb-1 text-left">Teléfono</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* Fecha de Nacimiento */}
        <div className="flex flex-col mb-3">
          <label className="text-sm font-medium mb-1 text-left">Fecha de nacimiento</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="border rounded p-2 w-full"
          />
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

export default EditModalCustomer
