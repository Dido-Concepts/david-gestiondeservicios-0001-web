import React from 'react'

const SuccessPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-300">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Cita reservada con éxito
          </h1>
        </div>
        <div className="flex justify-center">
          <button className="px-6 py-3 bg-gray-200 text-gray-700 text-lg border border-gray-400 rounded-md hover:bg-gray-300 transition-colors">
            Volver a la página de inicio
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuccessPage
