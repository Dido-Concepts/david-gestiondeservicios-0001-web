'use client'
import { useState } from 'react'
import WeekSelector from '@/app/dashboard/user-management/components/WeekSelector.component'
import TableShiftManagement from '@/app/dashboard/user-management/components/TableShiftManagement.component'

const ShiftManagementContainer = () => {
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getTime())

  return (
    <>
      {/* Componente para seleccionar la semana */}
      <div className="flex justify-center my-4">
        <WeekSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      </div>

      {/* Tabla de turnos basada en la semana seleccionada */}
      <TableShiftManagement selectedDate={selectedDate} />
    </>
  )
}

export default ShiftManagementContainer
//
