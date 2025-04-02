'use client'

import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, X } from 'lucide-react'
import { FieldErrors } from 'react-hook-form'
import { formLocationManagementInputs } from '@/modules/location/infra/hooks/useFormLocationManagement'

interface ScheduleDay {
  day: string;
  ranges: Array<{ start: string; end: string }>;
}

// Definición de tipos para errors

interface ListOfSchedulesProps {
  title: string;
  description: string;
  schedule: ScheduleDay[];
  onScheduleChange: (newSchedule: ScheduleDay[]) => void;
  errors?: FieldErrors<formLocationManagementInputs>['schedule'];
  isPending?: boolean;
}

export function ListOfSchedules ({ title, description, schedule, onScheduleChange, errors, isPending }: ListOfSchedulesProps) {
  const addRange = (dayIndex: number) => {
    const newSchedule = [...schedule]
    newSchedule[dayIndex] = {
      ...newSchedule[dayIndex],
      ranges: [...newSchedule[dayIndex].ranges, { start: '09:00', end: '19:00' }]
    }
    onScheduleChange(newSchedule)
  }

  const removeRange = (dayIndex: number, rangeIndex: number) => {
    const newSchedule = [...schedule]
    newSchedule[dayIndex].ranges = newSchedule[dayIndex].ranges.filter(
      (_, index) => index !== rangeIndex
    )
    onScheduleChange(newSchedule)
  }

  const handleTimeChange = (
    dayIndex: number,
    rangeIndex: number,
    field: 'start' | 'end',
    value: string
  ) => {
    const newSchedule = [...schedule]
    newSchedule[dayIndex].ranges[rangeIndex][field] = value
    onScheduleChange(newSchedule)
  }

  return (
    <>
      <DialogHeader className="mb-4">
        <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        <DialogDescription className="text-gray-500 font-bold">{description}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        {schedule.map((daySchedule, dayIndex) => (
          <div key={daySchedule.day} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-4">
              <Checkbox
                disabled={isPending}
                checked={daySchedule.ranges.length > 0}
                onCheckedChange={(checked) => {
                  const newSchedule = [...schedule]
                  if (checked) {
                    if (daySchedule.ranges.length === 0) {
                      newSchedule[dayIndex].ranges = [{ start: '09:00', end: '19:00' }]
                    }
                  } else {
                    newSchedule[dayIndex].ranges = []
                  }
                  onScheduleChange(newSchedule)
                }}
              />
              <span className="w-20">{daySchedule.day}</span>
            </div>
            {daySchedule.ranges.length > 0 && (
              <div className="flex flex-col space-y-2">
                {/* Mostrar error de solapamiento o duplicados para el día */}
                {errors && errors[dayIndex]?.ranges?.message && (
                  <p className="text-red-500 text-sm ml-8">{errors[dayIndex].ranges.message}</p>
                )}
                {daySchedule.ranges.map((range, rangeIndex) => (
                  <div
                    key={`${dayIndex}-${rangeIndex}`}
                    className="flex flex-col space-y-2 ml-8 w-full"
                  >
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={range.start}
                        disabled={isPending}
                        onChange={(e) => handleTimeChange(dayIndex, rangeIndex, 'start', e.target.value)}
                        className="flex-1"
                      />
                      <span>-</span>
                      <Input
                        type="time"
                        value={range.end}
                        disabled={isPending}
                        onChange={(e) => handleTimeChange(dayIndex, rangeIndex, 'end', e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={isPending}
                        onClick={() => removeRange(dayIndex, rangeIndex)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {/* Mostrar errores específicos de cada rango */}
                    {errors && errors[dayIndex]?.ranges?.[rangeIndex] && (
                      <p className="text-red-500 text-sm">
                        {errors[dayIndex].ranges[rangeIndex].start?.message ||
                          errors[dayIndex].ranges[rangeIndex].end?.message ||
                          errors[dayIndex].ranges[rangeIndex].message}
                      </p>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  disabled={isPending}
                  className="ml-8"
                  onClick={() => addRange(dayIndex)}
                >
                  <Plus />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
