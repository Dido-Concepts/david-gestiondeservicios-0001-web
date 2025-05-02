'use client' // Indica que este es un componente de cliente

// Interfaz para los servicios
interface Service {
  id: string;
  name: string;
  duration: string;
  price: string;
  description: string;
}

// Props del componente
interface Paso2Props {
  onNext: (data: { service: Service }) => void;
  onBack: () => void;
}

// Lista de servicios basada en ServicePage
const services: Service[] = [
  {
    id: '1',
    name: 'Corte de cabello - Adulto/Niño',
    duration: '45 min',
    price: 'S/60',
    description: 'Solo hombres'
  },
  {
    id: '2',
    name: 'Corte de cabello + Ritual de Barba',
    duration: '1 hora',
    price: 'S/90',
    description: ''
  },
  {
    id: '3',
    name: 'Ritual de Barba',
    duration: '30 min',
    price: 'S/40',
    description: 'Solo hombres'
  }
]

export default function Paso2 ({ onNext, onBack }: Paso2Props) {
  // Removed unused selectedService state

  // Función para manejar la selección del servicio
  const handleReserveClick = (service: Service) => {
    // Removed setSelectedService as selectedService state is no longer used
    onNext({ service }) // Avanza al siguiente paso con el servicio seleccionado
  }

  return (
    <div className="bg-white min-h-screen p-8">
      {/* Título */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">SERVICIOS</h1>

      {/* Pestañas de categorías */}
      <div className="flex space-x-4 mb-8">
        <button className="text-gray-900 font-medium border-b-2 border-gray-900 pb-2">
          Destacados
        </button>
        <button className="text-gray-500 hover:text-gray-900">Packs SAPRA</button>
        <button className="text-gray-500 hover:text-gray-900">Skin Care</button>
        <button className="text-gray-500 hover:text-gray-900">Barba</button>
        <button className="text-gray-500 hover:text-gray-900">Cabello</button>
      </div>

      {/* Lista de servicios */}
      <div className="space-y-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{service.name}</h2>
              <p className="text-sm text-gray-600">
                {service.duration} · {service.price} · {service.description}
              </p>
            </div>
            <button
              onClick={() => handleReserveClick(service)}
              className="border border-gray-900 text-gray-900 px-4 py-2 rounded hover:bg-gray-100"
            >
              Reservar
            </button>
          </div>
        ))}
      </div>

      {/* Botón para retroceder */}
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
