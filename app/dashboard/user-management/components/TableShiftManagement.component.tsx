'use client'
import { useState } from 'react'
import { format, addDays, startOfWeek } from 'date-fns'
import { es } from 'date-fns/locale/es'
import Cell from '@/app/dashboard/user-management/components/CellShiftManagement.component'
import { mockShiftData, ShiftData } from '@/app/dashboard/user-management/mocks/mockShiftData'

interface TableShiftManagementProps {
  selectedDate: number
}

const TableShiftManagement = ({ selectedDate }: TableShiftManagementProps) => {
  const [openId, setOpenId] = useState<string | null>(null)

  const start = startOfWeek(new Date(selectedDate), { weekStartsOn: 1 })
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(start, i))
  const formattedDates = daysOfWeek.map(date => format(date, 'yyyy-MM-dd'))

  return (
    <div className="container mx-auto py-10 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-3 text-left">Miembro del equipo</th>
            {daysOfWeek.map((date, i) => (
              <th key={i} className="p-3">
                {format(date, 'EEE, d MMM', { locale: es })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mockShiftData.map((employee: ShiftData, index) => (
            <tr key={index} className="border-t border-gray-300">
              <td className="p-3 flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700">
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span>{employee.name}</span>
              </td>
              {formattedDates.map((date, i) => (
                <td key={i}>
                  <Cell
                    shift={employee.shifts[date] || 'Sin turno'}
                    id={`${index}-${i}`}
                    openId={openId}
                    setOpenId={setOpenId}
                    employeeName={employee.name} // ✅ Pasamos el nombre dinámicamente
                    selectedDate={format(new Date(date), 'EEE, d MMM', { locale: es })} // ✅ Pasamos la fecha formateada dinámicamente
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableShiftManagement
//
