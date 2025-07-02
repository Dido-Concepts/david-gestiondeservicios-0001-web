'use client'
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns'
import { es } from 'date-fns/locale/es'

interface WeekSelectorProps {
  selectedDate: number
  setSelectedDate: (timestamp: number) => void
}

const WeekSelector = ({ selectedDate, setSelectedDate }: WeekSelectorProps) => {
  const start = startOfWeek(new Date(selectedDate), { weekStartsOn: 1 }) // Lunes como inicio de semana
  const end = endOfWeek(new Date(selectedDate), { weekStartsOn: 1 })

  const formattedRange = `${format(start, 'd')} - ${format(end, 'd MMM, yyyy', { locale: es })}`

  return (
    <div className="flex items-center gap-3 border rounded-full px-4 py-2 bg-white shadow-md">
      <button onClick={() => setSelectedDate(subWeeks(new Date(selectedDate), 1).getTime())} className="p-2 rounded-full hover:bg-gray-200">⬅</button>
      <button onClick={() => setSelectedDate(new Date().getTime())} className="text-blue-600 font-semibold">Semana actual</button>
      <span className="text-gray-700">{formattedRange}</span>
      <button onClick={() => setSelectedDate(addWeeks(new Date(selectedDate), 1).getTime())} className="p-2 rounded-full hover:bg-gray-200">➡</button>
    </div>
  )
}

export default WeekSelector
