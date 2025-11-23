// @/app/dashboard/report-management/pages/ReportQuotesPage.tsx (or similar path)
'use client'

import React, { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { DateRangePopover } from './components/DateRangePopover'
import { FiltersPopover } from './components/FiltersPopover'
import { useGetReportExcelBlob, formatDateForApi, type ReportParams } from '@/app/dashboard/hook/client/useReportsQueries'
import { useToast } from '@/hooks/use-toast'

export default function ReportQuotesPage () {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [filters, setFilters] = useState<{
    barber_id?: number
    location_id?: number
  }>({})

  // Hook para obtener el blob del reporte (sin descarga automática)
  const getReportBlob = useGetReportExcelBlob()
  const { toast } = useToast()

  const handleApplyFilters = (newFilters: { barbero_id?: number; sede_id?: number }) => {
    // Mapear los nombres de los campos del FiltersPanel al formato esperado por la API
    const mappedFilters = {
      barber_id: newFilters.barbero_id,
      location_id: newFilters.sede_id
    }
    setFilters(mappedFilters)
    console.log('Filtros aplicados:', mappedFilters)
  }

  const handleClearAllFilters = () => {
    setFilters({})
    setDateRange(undefined)
    console.log('Todos los filtros borrados')
  }

  // Función para generar hash simple
  const generateHash = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convertir a entero de 32 bits
    }
    return Math.abs(hash).toString(16).slice(0, 8)
  }

  // Función para formatear fecha para el nombre del archivo
  const formatDateForFileName = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleDownloadReport = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona un rango de fechas válido',
        variant: 'destructive'
      })
      return
    }

    try {
      // Formatear las fechas al formato requerido por la API: YYYY-MM-DD HH:mm:ss
      const startDate = new Date(dateRange.from)
      startDate.setHours(0, 0, 0, 0) // Inicio del día

      const endDate = new Date(dateRange.to)
      endDate.setHours(23, 59, 59, 999) // Final del día

      const reportParams: ReportParams = {
        start_date: formatDateForApi(startDate),
        end_date: formatDateForApi(endDate),
        ...filters
      }

      // Generar nombre personalizado del archivo
      const startDateStr = formatDateForFileName(startDate)
      const endDateStr = formatDateForFileName(endDate)
      const dateRangeStr = startDateStr === endDateStr ? startDateStr : `${startDateStr}_${endDateStr}`

      // Crear string para hash basado en parámetros
      const hashString = JSON.stringify(reportParams)
      const hash = generateHash(hashString)

      const customFileName = `reportes_${dateRangeStr}_${hash}.xlsx`

      // Descargar el reporte obteniendo el blob
      const { blob } = await getReportBlob.mutateAsync(reportParams)

      // Crear descarga manual con nombre personalizado
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = customFileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: 'Éxito',
        description: `Reporte descargado como: ${customFileName}`
      })
    } catch (error) {
      console.error('Error al descargar reporte:', error)
      toast({
        title: 'Error',
        description: 'Hubo un problema al descargar el reporte',
        variant: 'destructive'
      })
    }
  }

  // Verificar si se ha seleccionado un rango de fechas completo
  const isDateRangeSelected = dateRange?.from && dateRange?.to

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
          <DateRangePopover
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />

          <FiltersPopover
            disabled={!isDateRangeSelected}
            onApplyFilters={handleApplyFilters}
            onClearAllFilters={handleClearAllFilters}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg"
            onClick={handleDownloadReport}
            disabled={!isDateRangeSelected || getReportBlob.isPending}
          >
            {getReportBlob.isPending ? 'Descargando...' : 'Descargar'}
          </Button>
        </div>
      </div>
      {/* Rest of your page content (e.g., table displaying reports) */}

      {/* Overlay de loading que bloquea toda la pantalla */}
      {getReportBlob.isPending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4 shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">Generando reporte</h3>
              <p className="text-gray-600 mt-1">Por favor espera mientras procesamos tu solicitud...</p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
