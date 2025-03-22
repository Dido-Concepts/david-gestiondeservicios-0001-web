'use client' // Directiva para componentes de cliente

import React from 'react'
import { Calendar, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation' // Importamos useRouter

const ConfirmationPage = () => {
  const router = useRouter() // Instancia del router

  // Función para redirigir a /success
  const handleContinue = () => {
    router.push('/public/success')
  }

  return (
    <div className="bg-white min-h-screen p-8 flex flex-col items-center">
      {/* Contenedor principal con ancho máximo */}
      <div className="max-w-md w-full">
        {/* Sección de encabezado */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Confirmar cita</h1>
          <p className="text-sm text-gray-600 truncate">Sede Ayacucho</p>
        </div>

        {/* Detalles de la cita */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <p className="text-gray-900">martes 11 Marzo</p>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <p className="text-gray-900">17:00-17:45 (45 min de duración)</p>
          </div>
        </div>

        {/* Detalles del servicio y precio */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-900">Corte de cabello - Adulto/Niño 45 min • Solo hombres con Mariano</p>
          <p className="text-gray-900 font-bold">S/ 60</p>
        </div>

        {/* Separador */}
        <div className="border-t border-gray-300 my-4"></div>

        {/* Total del costo */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-900 font-bold">TOTAL</p>
          <p className="text-gray-900 font-bold">S/ 60</p>
        </div>

        {/* Botón "CONTINUAR" */}
        <div className="flex justify-center">
          <button
            className="bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
            onClick={handleContinue} // Evento onClick para redirigir
          >
            CONTINUAR
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationPage
