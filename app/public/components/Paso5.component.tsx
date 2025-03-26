'use client' // Indicamos que es un componente de cliente

import React from 'react'
import { IconComponent } from '@/app/components/Icon.component'

// Interfaz para la opción seleccionada
interface LoginOption {
  option: 'login' | 'guest';
}

// Props del componente
interface Paso5Props {
  onNext: (data: LoginOption) => void;
  onBack: () => void;
}

export default function Paso5 ({ onNext, onBack }: Paso5Props) {
  // Función para manejar el inicio de sesión
  const handleLogin = () => {
    onNext({ option: 'login' }) // Pasa la opción 'login' al siguiente paso
  }

  // Función para manejar la opción de invitado
  const handleGuest = () => {
    onNext({ option: 'guest' }) // Pasa la opción 'guest' al siguiente paso
  }

  return (
    <div className="bg-white min-h-screen flex flex-col justify-center items-center p-8">
      {/* Título */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
        Iniciar sesión
      </h1>
      {/* Subtítulo */}
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 text-center lg:text-left pb-6">
        Inicia sesión o regístrate para acceder a beneficios exclusivos
      </p>

      {/* Botones de inicio de sesión social */}
      <div className="w-full flex justify-center">
        <button
          className={
            'inline-flex items-center justify-center px-4 py-1 sm:px-6 sm:py-3 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 gap-2 text-sm sm:text-base md:text-lg'
          }
          type="submit"
          onClick={handleLogin} // Llama a handleLogin
        >
          <IconComponent
            name="google"
            width={30}
            height={30}
            className="w-5 h-5 sm:w-6 sm:h-6"
          />
          Iniciar sesión
        </button>
      </div>

      {/* Opción "Solo quiero reservar" */}
      <div className="mt-4">
        <button
          onClick={handleGuest} // Llama a handleGuest
          className="text-gray-800 font-semibold underline hover:text-gray-900"
        >
          Solo quiero reservar
        </button>
      </div>

      {/* Botón "Atrás" */}
      <div className="mt-8">
        <button
          onClick={onBack}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Atrás
        </button>
      </div>
    </div>
  )
}
