'use client'

import { useState } from 'react'
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, X } from 'lucide-react'

interface ScheduleDay {
    day: string
    ranges: Array<{ start: string; end: string }>
}

export function ListOfSchedules (param: { title: string, description: string }) {
  const [schedule, setSchedule] = useState<ScheduleDay[]>([
    { day: 'Domingo', ranges: [{ start: '09:00', end: '19:00' }] },
    { day: 'Lunes', ranges: [{ start: '09:00', end: '19:00' }] },
    { day: 'Martes', ranges: [{ start: '09:00', end: '19:00' }] },
    { day: 'Miércoles', ranges: [{ start: '09:00', end: '19:00' }] },
    { day: 'Jueves', ranges: [{ start: '09:00', end: '19:00' }] },
    { day: 'Viernes', ranges: [{ start: '09:00', end: '19:00' }] },
    { day: 'Sábado', ranges: [{ start: '09:00', end: '19:00' }] }
  ])

  const addRange = (dayIndex: number) => {
    setSchedule(prevSchedule => {
      const newSchedule = [...prevSchedule]
      newSchedule[dayIndex] = {
        ...newSchedule[dayIndex],
        ranges: [...newSchedule[dayIndex].ranges, { start: '09:00', end: '19:00' }]
      }
      return newSchedule
    })
  }

  const removeRange = (dayIndex: number, rangeIndex: number) => {
    setSchedule(prevSchedule => {
      const newSchedule = [...prevSchedule]
      newSchedule[dayIndex].ranges = newSchedule[dayIndex].ranges.filter(
        (_, index) => index !== rangeIndex
      )
      return newSchedule
    })
  }

  // Actualiza la hora de inicio o fin de un rango específico
  const handleTimeChange = (dayIndex: number, rangeIndex: number, field: 'start' | 'end', value: string) => {
    setSchedule(prevSchedule => {
      const newSchedule = [...prevSchedule]
      newSchedule[dayIndex].ranges[rangeIndex][field] = value
      return newSchedule
    })
  }

  return (
        <>
            <DialogHeader className="mb-4">
                <DialogTitle className="text-2xl font-bold">{param.title}</DialogTitle>
                <DialogDescription className="text-gray-500 font-bold">
                    {param.description}
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
                {schedule.map((daySchedule, dayIndex) => (
                    <div key={daySchedule.day} className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-4">
                            <Checkbox />
                            <span className="w-20">{daySchedule.day}</span>
                        </div>
                        {daySchedule.ranges.map((range, rangeIndex) => (
                            <div key={`${dayIndex}-${rangeIndex}`} className="flex items-center space-x-2 ml-8 w-full">
                                <Input
                                    type="time"
                                    value={range.start}
                                    onChange={(e) => handleTimeChange(dayIndex, rangeIndex, 'start', e.target.value)}
                                    className="flex-1"
                                />
                                <span>-</span>
                                <Input
                                    type="time"
                                    value={range.end}
                                    onChange={(e) => handleTimeChange(dayIndex, rangeIndex, 'end', e.target.value)}
                                    className="flex-1"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => removeRange(dayIndex, rangeIndex)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            size="icon"
                            className="ml-8"
                            onClick={() => addRange(dayIndex)}
                        >
                            <Plus />
                        </Button>
                    </div>
                ))}
                <Button className="mt-4 w-full">
                    Guardar
                </Button>
            </div>
        </>
  )
}
