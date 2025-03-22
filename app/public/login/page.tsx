'use client' // Indicamos que es un componente de cliente

import { IconComponent } from '@/app/components/Icon.component'
import React from 'react'
import { useRouter } from 'next/navigation' // Importamos useRouter

const LoginPage = () => {
  const router = useRouter() // Creamos una instancia del router

  // Función para manejar la redirección
  const handleLogin = () => {
    router.push('/public/confirmation') // Redirige a /confirmation
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
          onClick={handleLogin} // Añadimos el evento onClick
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
          onClick={handleLogin}
          className="text-gray-800 font-semibold underline hover:text-gray-900"
        >
          Solo quiero reservar
        </button>
      </div>

    </div>
  )
}

export default LoginPage
