'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { axiosClientApi } from '@/config/axiosClientApi'
import { useGoogleTokens } from '@/hooks/use-google-tokens'

// Tipos para Reports basados en la API real
export type ReportParams = {
  start_date: string // Formato: YYYY-MM-DD HH:mm:ss (requerido)
  end_date: string // Formato: YYYY-MM-DD HH:mm:ss (requerido)
  barber_id?: number // ID del barbero (opcional)
  location_id?: number // ID de la ubicación (opcional)
}

export type ReportResponseModel = {
  blob: Blob
  fileName: string
}

// Query Keys
export const REPORTS_QUERY_KEYS = {
  reports: ['reports'] as const,
  excel: ['reports', 'excel'] as const
}

/**
 * Hook para descargar reportes en Excel
 */
export const useReportsExcel = (
  reportParams: ReportParams & {
    enabled?: boolean // Parámetro para controlar cuándo ejecutar la query
  }
) => {
  const { hasTokens } = useGoogleTokens()

  return useQuery({
    queryKey: [...REPORTS_QUERY_KEYS.excel, reportParams],
    queryFn: async (): Promise<Blob> => {
      const params = new URLSearchParams()

      // Parámetros obligatorios
      params.append('start_date', reportParams.start_date)
      params.append('end_date', reportParams.end_date)

      // Parámetros opcionales
      if (reportParams.barber_id) {
        params.append('barber_id', reportParams.barber_id.toString())
      }
      if (reportParams.location_id) {
        params.append('location_id', reportParams.location_id.toString())
      }

      const response = await axiosClientApi.get(`/api/v2/reports/excel?${params.toString()}`, {
        responseType: 'blob', // Importante para manejar archivos
        headers: {
          Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      })

      return response.data
    },
    enabled: hasTokens && reportParams.enabled && !!reportParams.start_date && !!reportParams.end_date,
    staleTime: 0, // Los reportes siempre deben ser frescos
    gcTime: 1000 * 60 * 5, // 5 minutos
    retry: 1 // Solo reintentar una vez para descargas
  })
}

/**
 * Hook mutation para generar y descargar reportes en Excel
 * Útil cuando quieres controlar manualmente la descarga
 */
export const useDownloadReportExcel = () => {
  return useMutation({
    mutationFn: async (reportParams: ReportParams): Promise<{ blob: Blob; fileName: string }> => {
      const params = new URLSearchParams()

      // Parámetros obligatorios
      params.append('start_date', reportParams.start_date)
      params.append('end_date', reportParams.end_date)

      // Parámetros opcionales
      if (reportParams.barber_id) {
        params.append('barber_id', reportParams.barber_id.toString())
      }
      if (reportParams.location_id) {
        params.append('location_id', reportParams.location_id.toString())
      }

      const response = await axiosClientApi.get(`/api/v2/reports/excel?${params.toString()}`, {
        responseType: 'blob',
        headers: {
          Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      })

      // Extraer nombre del archivo de los headers
      // Formato esperado: "attachment; filename=reportes_citas.xlsx"
      const contentDisposition = response.headers['content-disposition']
      let fileName = 'reportes_citas.xlsx' // Nombre por defecto basado en la respuesta

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename=([^;\s]+)/)
        if (fileNameMatch) {
          fileName = fileNameMatch[1].replace(/['"]/g, '').trim()
        }
      }

      return {
        blob: response.data,
        fileName
      }
    },
    onSuccess: ({ blob, fileName }) => {
      // Crear URL temporal para el blob
      const url = window.URL.createObjectURL(blob)

      // Crear elemento de enlace temporal para descargar
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()

      // Limpiar
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    },
    onError: (error) => {
      console.error('Error al descargar reporte:', error)
    }
  })
}

/**
 * Hook mutation para obtener el blob del reporte sin descarga automática
 * Útil cuando quieres controlar manualmente el nombre del archivo y la descarga
 */
export const useGetReportExcelBlob = () => {
  return useMutation({
    mutationFn: async (reportParams: ReportParams): Promise<{ blob: Blob; fileName: string }> => {
      const params = new URLSearchParams()

      // Parámetros obligatorios
      params.append('start_date', reportParams.start_date)
      params.append('end_date', reportParams.end_date)

      // Parámetros opcionales
      if (reportParams.barber_id) {
        params.append('barber_id', reportParams.barber_id.toString())
      }
      if (reportParams.location_id) {
        params.append('location_id', reportParams.location_id.toString())
      }

      const response = await axiosClientApi.get(`/api/v2/reports/excel?${params.toString()}`, {
        responseType: 'blob',
        headers: {
          Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      })

      // Extraer nombre del archivo de los headers
      const contentDisposition = response.headers['content-disposition']
      let fileName = 'reportes_citas.xlsx' // Nombre por defecto

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename=([^;\s]+)/)
        if (fileNameMatch) {
          fileName = fileNameMatch[1].replace(/['"]/g, '').trim()
        }
      }

      return {
        blob: response.data,
        fileName
      }
    },
    // Sin onSuccess para permitir manejo manual de la descarga
    onError: (error) => {
      console.error('Error al obtener reporte:', error)
    }
  })
}

/**
 * Función utilitaria para formatear fechas al formato esperado por la API
 * @param date Date object
 * @returns string en formato YYYY-MM-DD HH:mm:ss
 */
export const formatDateForApi = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * Función utilitaria para crear parámetros de fecha rápidos
 */
export const getQuickDateRanges = () => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const thisWeekStart = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000))
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const thisYearStart = new Date(now.getFullYear(), 0, 1)

  return {
    today: {
      start_date: formatDateForApi(today),
      end_date: formatDateForApi(new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1))
    },
    yesterday: {
      start_date: formatDateForApi(yesterday),
      end_date: formatDateForApi(new Date(yesterday.getTime() + 24 * 60 * 60 * 1000 - 1))
    },
    thisWeek: {
      start_date: formatDateForApi(thisWeekStart),
      end_date: formatDateForApi(now)
    },
    thisMonth: {
      start_date: formatDateForApi(thisMonthStart),
      end_date: formatDateForApi(now)
    },
    thisYear: {
      start_date: formatDateForApi(thisYearStart),
      end_date: formatDateForApi(now)
    }
  }
}
