'use client'
import { useState } from 'react'
import { format, addDays, startOfWeek } from 'date-fns'
import { es } from 'date-fns/locale/es'
import Cell from '@/app/dashboard/user-management/components/CellShiftManagement.component'
import { useQuery } from '@tanstack/react-query'
import { getUserLocationEvents } from '@/modules/user-location/application/user-location-action'
import { getLocationById } from '@/modules/location/application/actions/location.action'
import { QUERY_KEYS_USER_LOCATION_MANAGEMENT, QUERY_KEYS_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { UserLocationEvent } from '@/modules/user-location/domain/repositories/user-location.repository'

interface TableShiftManagementProps {
  selectedDate: number
  locationFilter: string
}

interface ProcessedEmployee {
  user_id: number
  name: string
  email: string
  shifts: Record<string, string>
}

const TableShiftManagement = ({ selectedDate, locationFilter }: TableShiftManagementProps) => {
  const [openId, setOpenId] = useState<string | null>(null)

  const start = startOfWeek(new Date(selectedDate), { weekStartsOn: 1 })
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(start, i))
  const formattedDates = daysOfWeek.map(date => format(date, 'yyyy-MM-dd'))

  // Obtener eventos de usuarios por sede
  const { data: userEvents = [] } = useQuery({
    queryKey: [QUERY_KEYS_USER_LOCATION_MANAGEMENT.ULMGetUserLocationEvents, locationFilter, formattedDates[0], formattedDates[6]],
    queryFn: () => getUserLocationEvents({
      sedeId: locationFilter,
      startDate: formattedDates[0],
      endDate: formattedDates[6]
    })
  })

  // Obtener información de la sede (horarios)
  const { data: location } = useQuery({
    queryKey: [QUERY_KEYS_LOCATION_MANAGEMENT.LMGetLocation, locationFilter],
    queryFn: () => getLocationById(locationFilter)
  })

  // Función para obtener el horario de la sede por día de la semana
  const getLocationScheduleForDay = (date: string): string => {
    if (!location?.openingHours) return 'Sin turno'

    const dayOfWeek = new Date(date).getDay()
    const dayMapping: Record<number, string> = {
      0: 'Lunes', // Monday
      1: 'Martes', // Tuesday
      2: 'Miercoles', // Wednesday
      3: 'Jueves', // Thursday
      4: 'Viernes', // Friday
      5: 'Sabado', // Saturday
      6: 'Domingo' // Sunday
    }

    const mappedDay = dayMapping[dayOfWeek]
    const schedule = location.openingHours.find(s => s.day === mappedDay)

    if (!schedule) {
      return 'Sin turno'
    }

    // Si no tiene rangos horarios definidos (ranges vacío)
    if (schedule.ranges.length === 0) {
      return 'Sin turno'
    }

    // Si tiene múltiples rangos, los concatena
    return schedule.ranges.map(range => `${range.start} - ${range.end}`).join(', ')
  }

  // Función para determinar qué mostrar en cada celda
  const getCellContent = (employee: ProcessedEmployee, date: string): string => {
    const userShift = employee.shifts[date]

    // Prioridad 1: Si tiene un evento asignado
    if (userShift && userShift !== 'Sin turno') {
      // Si es "No disponible" (ya procesado como día libre u otro evento)
      if (userShift === 'No disponible') {
        return 'No disponible'
      }
      // Si es un turno personalizado (contiene horarios con formato HH:mm - HH:mm)
      if (userShift.match(/^\d{2}:\d{2}\s*-\s*\d{2}:\d{2}$/)) {
        return userShift
      }
      // Cualquier otro evento (enfermedad, permiso, etc.) se considera "No disponible"
      return 'No disponible'
    }

    // Prioridad 2: Horario por defecto de la sede
    return getLocationScheduleForDay(date)
  }

  // Procesar datos de usuarios y sus eventos
  const processedEmployees = userEvents.reduce((acc: ProcessedEmployee[], event: UserLocationEvent) => {
    let employee = acc.find(emp => emp.user_id === event.user_id)

    if (!employee) {
      employee = {
        user_id: event.user_id,
        name: event.user_name,
        email: event.email,
        shifts: {}
      }
      acc.push(employee)
    }

    const eventDate = format(new Date(event.event_start_time), 'yyyy-MM-dd')

    // Determinar el contenido basado en el tipo de evento
    if (event.event_type === 'turno') {
      const eventTime = `${format(new Date(event.event_start_time), 'HH:mm')} - ${format(new Date(event.event_end_time), 'HH:mm')}`
      employee.shifts[eventDate] = eventTime
    } else {
      // Cualquier evento que NO sea turno se considera "No disponible"
      // (dia_libre, enfermedad, permiso, etc.)
      employee.shifts[eventDate] = 'No disponible'
    }

    return acc
  }, [])

  // Si no hay empleados asignados a la sede
  if (processedEmployees.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center py-20">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Esta sede no cuenta con barberos asignados
          </h3>
          <p className="text-gray-500">
            No hay empleados disponibles para mostrar horarios en esta ubicación.
          </p>
        </div>
      </div>
    )
  }

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
          {processedEmployees.map((employee) => (
            <tr key={employee.user_id} className="border-t border-gray-300">
              <td className="p-3 flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700">
                  {employee.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <span>{employee.name}</span>
              </td>
              {formattedDates.map((date, i) => (
                <td key={i}>
                  <Cell
                    shift={getCellContent(employee, date)}
                    id={`${employee.user_id}-${i}`}
                    openId={openId}
                    setOpenId={setOpenId}
                    employeeName={employee.name}
                    selectedDate={format(new Date(date), 'EEE, d MMM', { locale: es })}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mostrar horarios de la sede
      {location?.openingHours && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Horarios de atención - {location.name}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
            {location.openingHours.map((schedule: ScheduleDayModel, index: number) => (
              <div key={index} className="text-sm">
                <div className="font-medium">{schedule.day}</div>
                {schedule.ranges.map((range, i: number) => (
                  <div key={i} className="text-gray-600">
                    {range.start} - {range.end}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      */}
    </div>
  )
}

export default TableShiftManagement
