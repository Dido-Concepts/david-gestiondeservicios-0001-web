'use client' // Indica que este es un componente de cliente

import { useRouter } from 'next/navigation'
import React from 'react'

const ServicePage = () => {
  const router = useRouter()

  // Función que redirige a la página /barber
  const handleReserveClick = () => {
    router.push('/public/barber')
  }

  return (
    <div className="bg-white min-h-screen p-8">
      {/* Título */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">SERVICIOS</h1>

      {/* Pestañas de categorías */}
      <div className="flex space-x-4 mb-8">
        <button className="text-gray-900 font-medium border-b-2 border-gray-900 pb-2">Destacados</button>
        <button className="text-gray-500 hover:text-gray-900">Packs SAPRA</button>
        <button className="text-gray-500 hover:text-gray-900">Skin Care</button>
        <button className="text-gray-500 hover:text-gray-900">Barba</button>
        <button className="text-gray-500 hover:text-gray-900">Cabello</button>
      </div>

      {/* Lista de servicios */}
      <div className="space-y-6">
        {/* Servicio 1 */}
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Corte de cabello - Adulto/Niño</h2>
            <p className="text-sm text-gray-600">45 min · S/60 · Solo hombres</p>
          </div>
          <button
            onClick={handleReserveClick} // Evento que redirige al hacer clic
            className="border border-gray-900 text-gray-900 px-4 py-2 rounded hover:bg-gray-100"
          >
            Reservar
          </button>
        </div>

        {/* Servicio 2 */}
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Corte de cabello + Ritual de Barba</h2>
            <p className="text-sm text-gray-600">1 hora · S/90</p>
          </div>
          <button
            onClick={handleReserveClick} // Evento que redirige al hacer clic
            className="border border-gray-900 text-gray-900 px-4 py-2 rounded hover:bg-gray-100"
          >
            Reservar
          </button>
        </div>

        {/* Servicio 3 */}
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Ritual de Barba</h2>
            <p className="text-sm text-gray-600">30 min · S/40 · Solo hombres</p>
          </div>
          <button
            onClick={handleReserveClick} // Evento que redirige al hacer clic
            className="border border-gray-900 text-gray-900 px-4 py-2 rounded hover:bg-gray-100"
          >
            Reservar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServicePage
