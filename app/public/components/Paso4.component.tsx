'use client' // Marca el componente como cliente para interactividad

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

// Interfaz para la fecha y hora seleccionadas
interface SelectedDateTime {
  month: string;
  day: number;
  time: string;
}

// Props del componente
interface Paso4Props {
  onNext: (data: { dateTime: SelectedDateTime }) => void;
  onBack: () => void;
}

// Lista de días simulada (igual que en DatePage)
const days = [
  { number: 11, label: 'mar' },
  { number: 12, label: 'mié' },
  { number: 13, label: 'jue' },
  { number: 14, label: 'vie' },
  { number: 15, label: 'sáb' },
  { number: 16, label: 'dom' },
  { number: 17, label: 'lun' },
  { number: 18, label: 'mar' },
  { number: 19, label: 'mié' }
]

// Lista de franjas horarias simulada (igual que en DatePage)
const timeSlots = ['11:00', '11:15', '11:30']

export default function Paso4 ({ onNext, onBack }: Paso4Props) {
  const [selectedMonth, setSelectedMonth] = useState('Marzo 2025')
  const [selectedDay, setSelectedDay] = useState(12)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  // Funciones para navegar entre meses (igual que en DatePage)
  const handlePrevMonth = () => {
    console.log('Mes anterior')
  }

  const handleNextMonth = () => {
    console.log('Mes siguiente')
  }

  // Función para manejar "Continuar"
  const handleContinue = () => {
    if (selectedTime) {
      const dateTime: SelectedDateTime = {
        month: selectedMonth,
        day: selectedDay,
        time: selectedTime
      }
      onNext({ dateTime }) // Pasa la fecha y hora al siguiente paso
    } else {
      alert('Por favor, selecciona una hora.')
    }
  }

  return (
    <div className="bg-white min-h-screen p-8">
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Selecciona la fecha y la hora</h1>
        <Calendar className="w-6 h-6 text-gray-600" />
      </div>

      {/* Selector de mes y año */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} aria-label="Mes anterior">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <span className="text-lg font-semibold text-gray-900">{selectedMonth}</span>
        <button onClick={handleNextMonth} aria-label="Mes siguiente">
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Grid de días */}
      <div className="flex justify-between mb-6">
        {days.map((day) => (
          <div key={day.number} className="text-center">
            <button
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                day.number === selectedDay
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => setSelectedDay(day.number)}
              aria-label={`Seleccionar día ${day.number}`}
            >
              {day.number}
            </button>
            <span className="text-sm text-gray-600">{day.label}</span>
          </div>
        ))}
      </div>

      {/* Lista de franjas horarias */}
      <div className="space-y-2">
        {timeSlots.map((time) => (
          <button
            key={time}
            className={`w-full p-3 rounded-lg transition-colors ${
              selectedTime === time
                ? 'bg-gray-100 text-gray-900 border-2 border-purple-600 shadow-lg'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedTime(time)}
          >
            {time}
          </button>
        ))}
      </div>

      {/* Botones "Atrás" y "Continuar" */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Atrás
        </button>
        <button
          onClick={handleContinue}
          className="bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
