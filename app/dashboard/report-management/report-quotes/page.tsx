'use client'
import React, { useState } from 'react'
import { IconComponent } from '@/app/components/Icon.component'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
// import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ReportQuotesPage () {
  const [open, setOpen] = useState(false)
  const [dateRange, setDateRange] = useState<{ startDate: Date | undefined, endDate: Date | undefined }>({ startDate: undefined, endDate: undefined })

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <main className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2 text-gray-600">
        {/* Botón de atrás */}
        <Link
          className="flex items-center w-min px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100"
          href="/dashboard/report-management"
          passHref
        >
          <IconComponent
            name="arrow"
            width={20}
            height={20}
            className="w-6 h-6 mr-2"
          />
          Atrás
        </Link>
      </div>

      {/* Title and Description */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Resumen de citas</h1>
        <p className="text-gray-600">
          Reporte general de las citas filtrando por día, semana, mes, por barbero y por cliente
        </p>
      </div>

      {/* Filters and Options */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'bg-gray-100 text-gray-700 px-4 py-2 rounded-lg',
                  !dateRange.startDate && !dateRange.endDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.startDate && dateRange.endDate
                  ? `${format(dateRange.startDate, 'PPP')} - ${format(dateRange.endDate, 'PPP')}`
                  : <span>Mes actual</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              {/* <DateRangePicker
                selectedRange={dateRange}
                onSelectRange={setDateRange}
              /> */}
              <div className="flex justify-end space-x-2 p-2">
                <Button variant="outline" onClick={handleClose}>Cancelar</Button>
                <Button onClick={handleClose}>Aplicar</Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg">Filtros</Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg">Descargar</Button>
        </div>
      </div>
    </main>
  )
}
