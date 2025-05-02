'use client' // Necesario para usar hooks como useRouter

import { useRouter } from 'next/navigation'
import { mockLocationData } from '@/modules/location/infra/mock/location.mock'

// Definimos las interfaces (puedes ajustarlas según tu código real)
interface OpeningHour {
  day: string;
  open: number;
  close: number;
}

export interface Sede {
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

// Función para determinar si está abierto (opcional, según tu implementación)
const isOpenNow = (openingHours: OpeningHour[]): string => {
  const now = new Date()
  const currentDay = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase()
  const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()

  const todayHours = openingHours.find((hour) => hour.day === currentDay)
  if (!todayHours) return ''

  const { open, close } = todayHours
  return currentSeconds >= open && currentSeconds <= close ? 'Abierto ahora' : ''
}

export default function LocationPage () {
  const router = useRouter()

  // Función que maneja el clic en la tarjeta
  const handleCardClick = () => {
    router.push('/public/service') // Redirige a la página de servicios
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
              onClick={handleCardClick} // Evento que redirige al hacer clic
            >
              <img
                src={sede.imageUrl}
                alt={`Imagen de ${sede.name}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{sede.name}</h2>
                <p className="text-gray-600">{sede.address}, {sede.city}, {sede.province}</p>
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
