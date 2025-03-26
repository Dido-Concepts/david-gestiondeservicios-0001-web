'use client' // Necesario para usar hooks como useState

import { useState } from 'react'
import { mockLocationData } from '@/modules/location/infra/mock/location.mock'

// Definimos las interfaces para las sedes y horarios
interface OpeningHour {
  day: string;
  open: number;
  close: number;
}

interface Sede {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  imageUrl: string;
  registrationDate: string;
  openingHours: OpeningHour[];
}

// Función para determinar si la sede está abierta ahora
const isOpenNow = (openingHours: OpeningHour[]): string => {
  const now = new Date()
  const currentDay = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase()
  const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()

  const todayHours = openingHours.find((hour) => hour.day === currentDay)
  if (!todayHours) return ''

  const { open, close } = todayHours
  return currentSeconds >= open && currentSeconds <= close ? 'Abierto ahora' : ''
}

// Props que recibe el componente
interface Paso1Props {
  onNext: (data: { sede: Sede }) => void;
}

export default function Paso1 ({ onNext }: Paso1Props) {
  const [selectedSede, setSelectedSede] = useState<Sede | null>(null)

  // Maneja el clic en una tarjeta
  const handleCardClick = (sede: Sede) => {
    setSelectedSede(sede) // Opcional, para mantener el estado local si se necesita
    onNext({ sede }) // Pasa la sede seleccionada al siguiente paso
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Selecciona el local de tu reserva</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockLocationData.locations.map((sede) => {
          const openStatus = isOpenNow(sede.openingHours)
          return (
            <div
              key={sede.id}
              className="border rounded-lg shadow-lg overflow-hidden cursor-pointer"
              onClick={() => handleCardClick(sede)} // Selecciona la sede y avanza
            >
              <img
                src={sede.imageUrl}
                alt={`Imagen de ${sede.name}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{sede.name}</h2>
                <p className="text-gray-600">
                  {sede.address}, {sede.city}, {sede.province}
                </p>
                <p className="text-gray-600">Teléfono: {sede.phone}</p>
                {openStatus && (
                  <p className="mt-2 font-medium text-green-600">{openStatus}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
