'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="bg-white min-h-screen p-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="text-8xl font-bold text-gray-200 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Página no encontrada</h1>
        <p className="text-gray-600 mb-6">
          El enlace de reseña que buscas no es válido o ya no existe.
        </p>
        <Link
          href="/"
          className="inline-block bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
