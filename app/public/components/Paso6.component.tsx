'use client' // Directiva para componentes de cliente

import React from 'react'
import { Calendar, Clock } from 'lucide-react'

// Interfaz para los props
interface Paso6Props {
  formData: FormData;
  onConfirm: () => void; // Función para manejar la confirmación
}

// Interfaces para los tipos de datos
interface SelectedDateTime {
  month: string;
  day: number;
  time: string;
}

interface FormData {
  sede?: { id: string; name: string };
  service?: { id: string; name: string; duration: string; price: string };
  professional?: { id: string; name: string };
  dateTime?: SelectedDateTime;
}

export default function Paso6 ({ formData, onConfirm }: Paso6Props) {
  // Función para formatear la fecha (ej: "martes 11 Marzo")
  const formatDate = (dateTime: SelectedDateTime) => {
    // En un caso real, deberías calcular el día de la semana dinámicamente
    const dayName = 'martes' // Placeholder, ajusta según lógica real
    return `${dayName} ${dateTime.day} ${dateTime.month}`
  }

  // Función para formatear la hora (ej: "17:00-17:45 (45 min de duración)")
  const formatTime = (time: string, duration: string) => {
    const startTime = time
    // Placeholder para la hora de fin; calcula dinámicamente en un caso real
    const endTime = '17:45'
    return `${startTime}-${endTime} (${duration} de duración)`
  }

  // Detalle completo del servicio
  const serviceDetail = `${formData.service?.name || 'Servicio no seleccionado'} ${
    formData.service?.duration ? `${formData.service.duration} min` : ''
  } con ${formData.professional?.name || 'Profesional no seleccionado'}`

  return (
    <div className="bg-white min-h-screen p-8 flex flex-col items-center">
      <div className="max-w-md w-full">
        {/* Sección de encabezado */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Confirmar cita</h1>
          <p className="text-sm text-gray-600 truncate">
            {formData.sede?.name || 'Sede no seleccionada'}
          </p>
        </div>

        {/* Detalles de la cita */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <p className="text-gray-900">
              {formData.dateTime
                ? formatDate(formData.dateTime)
                : 'Fecha no seleccionada'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <p className="text-gray-900">
              {formData.dateTime && formData.service
                ? formatTime(formData.dateTime.time, formData.service.duration)
                : 'Hora no seleccionada'}
            </p>
          </div>
        </div>

        {/* Detalles del servicio y precio */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-900">{serviceDetail}</p>
          <p className="text-gray-900 font-bold">
            {formData.service?.price || 'Precio no disponible'}
          </p>
        </div>

        {/* Separador */}
        <div className="border-t border-gray-300 my-4"></div>

        {/* Total del costo */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-900 font-bold">TOTAL</p>
          <p className="text-gray-900 font-bold">
            {formData.service?.price || 'S/ 0'}
          </p>
        </div>

        {/* Botón "CONTINUAR" */}
        <div className="flex justify-center">
          <button
            className="bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
            onClick={onConfirm} // Llama a la función de confirmación
          >
            CONTINUAR
          </button>
        </div>
      </div>
    </div>
  )
}
