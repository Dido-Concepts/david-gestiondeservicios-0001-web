'use client'
import { useState } from 'react'
import { format, addDays, startOfWeek } from 'date-fns'
import { es } from 'date-fns/locale/es'
import Cell from '@/app/dashboard/user-management/components/CellShiftManagement.component'
import CellShiftActions from '@/app/dashboard/user-management/components/CellShiftActions.component'
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
    queryFn: async () => {
      const result = await getUserLocationEvents({
        sedeId: locationFilter,
        startDate: formattedDates[0],
        endDate: formattedDates[6]
      })

      // 🔍 DEBUG: Ver cada evento individual
      if (result && Array.isArray(result)) {
        console.log(`🔍 DEBUG - Total eventos recibidos: ${result.length}`)
        result.forEach((event, index) => {
          console.log(`📅 DEBUG - Evento ${index + 1}:`, {
            event_type: event.event_type,
            user_id: event.user_id,
            user_name: event.user_name,
            eventDate: format(new Date(event.event_start_time), 'yyyy-MM-dd'),
            event_start_time: event.event_start_time,
            event_end_time: event.event_end_time
          })
        })
      }

      return result
    }
  })

  // Obtener información de la sede (horarios)
  const { data: location } = useQuery({
    queryKey: [QUERY_KEYS_LOCATION_MANAGEMENT.LMGetLocation, locationFilter],
    queryFn: () => getLocationById(locationFilter)
  })

  // Función para obtener el horario de la sede por día de la semana
  const getLocationScheduleForDay = (date: string): string => {
    if (!location?.openingHours) return 'Sin turno'

    const dayOfWeek = new Date(date + 'T12:00:00').getDay()

    // 🔧 CORREGIDO: JavaScript usa 0 = Domingo, 1 = Lunes, etc.
    const dayMapping: Record<number, string> = {
      0: 'Domingo', // Sunday
      1: 'Lunes', // Monday
      2: 'Martes', // Tuesday
      3: 'Miercoles', // Wednesday
      4: 'Jueves', // Thursday
      5: 'Viernes', // Friday
      6: 'Sabado' // Saturday
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
      // Si contiene salto de línea (No disponible + horario)
      if (userShift.includes('\n')) {
        return userShift
      }
      // Si es un turno personalizado (contiene horarios con formato HH:mm - HH:mm)
      if (userShift.match(/^\d{2}:\d{2}\s*-\s*\d{2}:\d{2}$/)) {
        return userShift
      }
      // Cualquier otro evento se considera "No disponible"
      return userShift
    }

    // Prioridad 2: Horario por defecto de la sede
    return getLocationScheduleForDay(date)
  }

  // Procesar datos de usuarios y sus eventos incluyendo días libres
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

    // Procesar diferentes tipos de eventos
    console.log('🔍 DEBUG - Tipo de evento recibido:', {
      event_type: event.event_type,
      user_id: event.user_id,
      eventDate,
      event
    })
    if (event.event_type === 'turno' || event.event_type === 'SHIFT') {
      const eventTime = `${format(new Date(event.event_start_time), 'HH:mm')} - ${format(new Date(event.event_end_time), 'HH:mm')}`
      employee.shifts[eventDate] = eventTime
    } else if (event.event_type === 'DAY_OFF' || event.event_type === 'dia_libre' || event.event_type === 'day_off' || event.event_type === 'days_off') {
      // Manejo específico de días libres
      console.log('🔍 DEBUG - Evento de día libre:', {
        event_type: event.event_type,
        user_id: event.user_id,
        eventDate,
        event_details: event.event_description,
        event
      })
      const eventTime = `${format(new Date(event.event_start_time), 'HH:mm')} - ${format(new Date(event.event_end_time), 'HH:mm')}`
      employee.shifts[eventDate] = `No disponible\n${eventTime}`
    } else {
      // Cualquier otro evento se considera "No disponible" + horario del evento
      const eventTime = `${format(new Date(event.event_start_time), 'HH:mm')} - ${format(new Date(event.event_end_time), 'HH:mm')}`
      employee.shifts[eventDate] = `No disponible\n${eventTime}`
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
              {formattedDates.map((date, i) => {
                // Buscar el evento de día libre para esta fecha y usuario
                const dayOffEvent = userEvents.find(event => {
                  const eventDate = format(new Date(event.event_start_time), 'yyyy-MM-dd')
                  return (
                    event.user_id === employee.user_id &&
                    eventDate === date &&
                    (event.event_type === 'DAY_OFF' || event.event_type === 'dia_libre' || event.event_type === 'day_off' || event.event_type === 'days_off')
                  )
                })

                return (
                  <td key={i} className="p-2">
                    <div className="space-y-1">
                      <Cell
                        shift={getCellContent(employee, date)}
                        id={`${employee.user_id}-${i}`}
                        openId={openId}
                        setOpenId={setOpenId}
                        employeeName={employee.name}
                        selectedDate={date}
                        userId={employee.user_id}
                        dayOffEvent={dayOffEvent}
                      />
                      <div className="flex justify-center">
                        <CellShiftActions
                          shift={getCellContent(employee, date)}
                          employeeName={employee.name}
                          selectedDate={date}
                          userId={employee.user_id}
                          dayOffEvent={dayOffEvent}
                        />
                      </div>
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableShiftManagement
//
