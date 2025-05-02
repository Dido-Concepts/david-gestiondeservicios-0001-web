// En Paso7.component.tsx
import type { FormData } from '../register/page'

interface Paso7Props {
  data: FormData;
  onBack: () => void;
}

// Aplica la interfaz aquí VVVVVVVVVVVVVVVVVVVV
export default function Paso7 ({ data, onBack }: Paso7Props) {
  // Ahora TypeScript sabe que 'data' y 'onBack' existen y tienen los tipos correctos
  // Puedes usar 'data' para mostrar el resumen y 'onBack' para el botón de retroceso

  return (
    <div>
      <h2>Resumen y Confirmación (Paso 7)</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre> {/* Ejemplo: Muestra los datos */}

      {/* Ejemplo de cómo usar las props */}
      <p>Sede: {data.sede?.name || 'No seleccionada'}</p>
      <p>Servicio: {data.service?.name || 'No seleccionado'}</p>
      {/* ... mostrar otros datos ... */}

      <button
        onClick={onBack} // Usa la función onBack pasada como prop
        className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2"
      >
        Atrás
      </button>
      <button
        // Aquí iría la lógica para confirmar/finalizar la reserva
        onClick={() => alert('Reserva Confirmada (simulado)!')}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Confirmar Reserva
      </button>
    </div>
  )
}
