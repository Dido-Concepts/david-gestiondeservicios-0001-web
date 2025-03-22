'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation' // Importamos useRouter

const DatePage = () => {
  const router = useRouter() // Obtenemos la instancia del router

  // Estados existentes para mes y día
  const [selectedMonth, setSelectedMonth] = useState('Marzo 2025')
  const [selectedDay, setSelectedDay] = useState(12)

  // Nuevo estado para la hora seleccionada
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  // Lista de días simulada
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

  // Lista de franjas horarias simulada
  const timeSlots = ['11:00', '11:15', '11:30']

  // Funciones para navegar entre meses
  const handlePrevMonth = () => {
    console.log('Mes anterior')
  }

  const handleNextMonth = () => {
    console.log('Mes siguiente')
  }

  // Función para manejar la redirección al pulsar "Continuar"
  const handleContinue = () => {
    router.push('/public/login') // Redirige a la página de login
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
                day.number === selectedDay ? 'bg-purple-600 text-white' : 'text-gray-900 hover:bg-gray-100'
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
            onClick={() => setSelectedTime(time)} // Actualiza el estado al pulsar
          >
            {time}
          </button>
        ))}
      </div>

      {/* Botón "Continuar" al final */}
      <div className="flex justify-center mt-8">
        <button
          className="bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
          onClick={handleContinue} // Evento para redirigir a /login
        >
          Continuar
        </button>
      </div>
    </div>
  )
}

export default DatePage
