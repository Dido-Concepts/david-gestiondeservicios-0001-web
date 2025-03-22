'use client' // Marca el componente como cliente para usar hooks

import { useRouter } from 'next/navigation'
import React from 'react'

const BarberPage = () => {
  const router = useRouter()

  // Función para redirigir a la página /date
  const handleOptionClick = () => {
    router.push('/public/date')
  }

  return (
    <div className="bg-white min-h-screen p-8">
      {/* Título */}
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Seleccionar profesional
      </h1>

      {/* Contenedor de opciones */}
      <div className="flex justify-center space-x-6">
        {/* Opción 1: Cualquier profesional */}
        <div
          onClick={handleOptionClick} // Evento de clic para redirigir
          className="border-2 border-purple-400 rounded-lg p-4 w-64 text-center cursor-pointer"
        >
          <div className="flex justify-center mb-2">
            {/* Icono de figuras humanas */}
            <svg
              className="w-12 h-12 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              ></path>
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-900">Cualquier profesional</p>
          <p className="text-sm text-gray-500">para máxima disponibilidad</p>
        </div>

        {/* Opción 2: Mariano */}
        <div
          onClick={handleOptionClick} // Evento de clic para redirigir
          className="bg-gray-100 rounded-lg p-4 w-64 flex items-center cursor-pointer"
        >
          <img
            src="https://barberobengie.com/wp-content/uploads/2020/07/WhatsApp-Image-2020-07-04-at-4.59.48-PM.jpeg"
            alt="Mariano"
            className="w-12 h-12 rounded-full mr-4"
          />
          <p className="text-lg font-semibold text-gray-900">Mariano</p>
        </div>

        {/* Opción 3: ROJO */}
        <div
          onClick={handleOptionClick} // Evento de clic para redirigir
          className="bg-gray-100 rounded-lg p-4 w-64 flex items-center cursor-pointer"
        >
          <img
            src="https://www.donjosegrisi.com/img/blog/don-jos%C3%A9--DJ-B1%20(3).png"
            alt="ROJO"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <p className="text-lg font-semibold text-gray-900">ROJO</p>
            <p className="text-sm text-gray-500">Barbero</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BarberPage
