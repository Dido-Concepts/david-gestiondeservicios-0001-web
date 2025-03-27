'use client' // Marca el componente como cliente para interactividad

import React from 'react'

// Interfaz para los profesionales
interface Professional {
  id: string;
  name: string;
  image?: string;
  description?: string;
}

// Props del componente
interface Paso3Props {
  onNext: (data: { professional: Professional }) => void;
  onBack: () => void;
}

// Lista de profesionales basada en BarberPage
const professionals: Professional[] = [
  {
    id: 'any',
    name: 'Cualquier profesional',
    description: 'para máxima disponibilidad'
  },
  {
    id: 'mariano',
    name: 'Mariano',
    image: 'https://barberobengie.com/wp-content/uploads/2020/07/WhatsApp-Image-2020-07-04-at-4.59.48-PM.jpeg'
  },
  {
    id: 'rojo',
    name: 'ROJO',
    image: 'https://www.donjosegrisi.com/img/blog/don-jos%C3%A9--DJ-B1%20(3).png',
    description: 'Barbero'
  }
]

export default function Paso3 ({ onNext, onBack }: Paso3Props) {
  // Función para manejar la selección del profesional
  const handleOptionClick = (professional: Professional) => {
    onNext({ professional }) // Pasa el profesional seleccionado al siguiente paso
  }

  return (
    <div className="bg-white min-h-screen p-8">
      {/* Título */}
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Seleccionar profesional
      </h1>

      {/* Contenedor de opciones */}
      <div className="flex justify-center space-x-6">
        {professionals.map((professional) => (
          <div
            key={professional.id}
            onClick={() => handleOptionClick(professional)}
            className={`rounded-lg p-4 w-64 cursor-pointer ${
              professional.id === 'any'
                ? 'border-2 border-purple-400 text-center'
                : 'bg-gray-100 flex items-center'
            }`}
          >
            {professional.image
              ? (
              <img
                src={professional.image}
                alt={professional.name}
                className="w-12 h-12 rounded-full mr-4"
              />
                ) : (
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
                )}
            <div>
              <p className="text-lg font-semibold text-gray-900">{professional.name}</p>
              {professional.description && (
                <p className="text-sm text-gray-500">{professional.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Botón para retroceder */}
      <div className="mt-8 text-center">
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
