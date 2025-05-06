// @/components/ui/date-range-picker.tsx
'use client'

import * as React from 'react'
import { format, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface DateRangePickerProps {
  className?: string
  selectedRange: DateRange | undefined
  onSelectRange: (range: DateRange | undefined) => void
  onClose: () => void
}

type Preset = {
  label: string
  range: () => DateRange
}

const presets: Preset[] = [
  {
    label: 'Resto de la semana',
    range: () => {
      const today = new Date()
      return { from: today, to: endOfWeek(today) }
    }
  },
  {
    label: 'Mes actual',
    range: () => {
      const today = new Date()
      return { from: startOfMonth(today), to: endOfMonth(today) }
    }
  }
  // Puedes agregar más presets según necesites
]

export function DateRangePicker ({
  className,
  selectedRange,
  onSelectRange,
  onClose
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(selectedRange)
  const [preset, setPreset] = React.useState<string>('')

  React.useEffect(() => {
    setDate(selectedRange)
  }, [selectedRange])

  const handleSelect = (newDate: DateRange | undefined) => {
    setDate(newDate)
    setPreset('') // Limpiar el preset cuando se selecciona manualmente
  }

  const handlePresetChange = (value: string) => {
    setPreset(value)
    const selectedPreset = presets.find(p => p.label === value)
    if (selectedPreset) {
      const newRange = selectedPreset.range()
      setDate(newRange)
      onSelectRange(newRange)
    }
  }

  const handleApply = () => {
    onSelectRange(date)
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <div className={cn('grid gap-4 p-4', className)}>
      {/* Dropdown de Presets */}
      <div>
        <Label htmlFor="preset">Rango de fechas</Label>
        <Select value={preset} onValueChange={handlePresetChange}>
          <SelectTrigger id="preset">
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            {presets.map(p => (
              <SelectItem key={p.label} value={p.label}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Campos de Entrada de Fechas */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start">Inicio</Label>
          <Input
            id="start"
            type="date"
            value={date?.from ? format(date.from, 'yyyy-MM-dd') : ''}
            onChange={(e) => {
              const newFrom = e.target.value ? new Date(e.target.value) : undefined
              setDate(prev => ({ ...prev, from: newFrom }))
            }}
          />
        </div>
        <div>
          <Label htmlFor="end">Fin</Label>
          <Input
            id="end"
            type="date"
            value={date?.to ? format(date.to, 'yyyy-MM-dd') : ''}
            onChange={(e) => {
              const newTo = e.target.value ? new Date(e.target.value) : undefined
              setDate(prev => prev ? { ...prev, to: newTo } : { from: undefined, to: newTo })
            }}
          />
        </div>
      </div>

      {/* Calendario */}
      <Calendar
        initialFocus
        mode="range"
        defaultMonth={date?.from}
        selected={date}
        onSelect={handleSelect}
        numberOfMonths={2}
      />

      {/* Botones de Acción */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button onClick={handleApply}>Aplicar</Button>
      </div>
    </div>
  )
}
