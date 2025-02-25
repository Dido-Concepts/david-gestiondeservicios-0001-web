'use client'
import React, { useState } from 'react'

const AddButtonAndModalCustomer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [birthDate, setBirthDate] = useState('')

  const handleSave = () => {
    const customerData = { fullName, email, phone, birthDate }
    console.log('Nuevo Cliente:', customerData)
    setIsModalOpen(false)
  }

  return (
    <div>
      {/* Botón para abrir el modal */}
      <button
        className="bg-app-quaternary text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        onClick={() => setIsModalOpen(true)}
      >
        Añadir Cliente
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Añadir Cliente</h2>

            {/* Nombre completo */}
            <div className="flex flex-col mb-3">
              <label className="text-sm font-medium mb-1">Nombre completo</label>
              <input
                type="text"
                placeholder="por ejemplo, Juan Hancock"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border rounded p-2 w-full"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col mb-3">
              <label className="text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="por ejemplo, juanperez@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded p-2 w-full"
              />
            </div>

            {/* Teléfono */}
            <div className="flex flex-col mb-3">
              <label className="text-sm font-medium mb-1">Teléfono</label>
              <input
                type="text"
                placeholder="por ejemplo, +51 998525898"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border rounded p-2 w-full"
              />
            </div>

            {/* Fecha de Nacimiento */}
            <div className="flex flex-col mb-3">
              <label className="text-sm font-medium mb-1">Fecha de nacimiento</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="border rounded p-2 w-full"
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end mt-6 gap-3">
              <button className="border px-4 py-2 rounded-lg" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </button>
              <button className="bg-black text-white px-4 py-2 rounded-lg" onClick={handleSave}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddButtonAndModalCustomer
