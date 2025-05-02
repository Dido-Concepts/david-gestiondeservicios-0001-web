// @/app/dashboard/report-management/pages/ReportQuotesPage.tsx (or similar path)
'use client'

import React, { useState } from 'react'
import { DateRange } from 'react-day-picker'
// Make sure this path is correct for your project structure
// Assuming this is the correct path to your component
import { FiltersPanel } from '@/app/dashboard/report-management/components/FiltersPanel'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale' // Optional: Import locale for Spanish formatting
import { DateRangePicker } from '@/app/dashboard/report-management/components/DateRangePicker'

export default function ReportQuotesPage () {
  const [dateOpen, setDateOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  const handleFiltersClose = () => setFiltersOpen(false)
  const handleApplyFilters = () => {
    // Aquí puedes agregar la lógica para aplicar los filtros seleccionados
    console.log('Filtros aplicados')
    handleFiltersClose()
  }
  const handleClearAllFilters = () => {
    // Aquí puedes agregar la lógica para borrar todos los filtros
    console.log('Todos los filtros borrados')
  }

  // Function to close the Date Picker Popover
  const handleDatePopoverClose = () => {
    setDateOpen(false)
  }

  return (
    <main className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Resumen de citas</h1>
        <p className="text-gray-600">
          Reporte general de las citas filtrando por día, semana, mes, por barbero y por cliente
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {/* Popover para el DateRangePicker */}
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg justify-start text-left font-normal', // Added justify-start, text-left, font-normal for better alignment
                  !dateRange?.from && !dateRange?.to && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from && dateRange?.to
                  ? (
                  `${format(dateRange.from, 'PPP', { locale: es })} - ${format(dateRange.to, 'PPP', { locale: es })}` // Added locale
                    )
                  : (
                  <span className="text-gray-700">Elige una fecha</span>
                    )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              {/* === FIX IS HERE === */}
              <DateRangePicker
                selectedRange={dateRange}
                onSelectRange={setDateRange}
                onClose={handleDatePopoverClose} // Pass the closing function here
                // Alternatively, inline: onClose={() => setDateOpen(false)}
              />
              {/* ==================== */}
            </PopoverContent>
          </Popover>

          {/* Popover para el FiltersPanel */}
          <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg"> {/* Added variant="outline" for consistency */}
                Filtros
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <FiltersPanel
                onClose={handleFiltersClose}
                onApply={handleApplyFilters}
                onClearAll={handleClearAllFilters}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg"> {/* Added variant="outline" */}
            Descargar
          </Button>
        </div>
      </div>
      {/* Rest of your page content (e.g., table displaying reports) */}
    </main>
  )
}
