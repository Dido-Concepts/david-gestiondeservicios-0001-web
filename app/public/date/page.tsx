'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

const DatePage = () => {
  // Estado para manejar el mes y el día seleccionados
  const [selectedMonth, setSelectedMonth] = useState('Marzo 2025')
  const [selectedDay, setSelectedDay] = useState(12)

  // Lista de días simulada (basada en la imagen)
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
  const timeSlots = ['17:00', '17:30', '18:00', '18:30']

  // Funciones para navegar entre meses (simulación)
  const handlePrevMonth = () => {
    // Aquí iría la lógica para retroceder el mes
    console.log('Mes anterior')
  }

  const handleNextMonth = () => {
    // Aquí iría la lógica para avanzar el mes
    console.log('Mes siguiente')
  }

  return (
    <div className="bg-white min-h-screen p-8">
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Selecciona hora</h1>
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
            className="w-full p-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={() => console.log(`Hora seleccionada: ${time}`)}
          >
            {time}
          </button>
        ))}
      </div>

      {/* Botón "Continuar" al final */}
      <div className="flex justify-center mt-8">
        <button className="bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors">
          Continuar
        </button>
      </div>
    </div>
  )
}

export default DatePage
