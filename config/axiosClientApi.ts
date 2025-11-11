import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { getGoogleTokens, hasValidTokens } from '@/lib/token-storage'

/**
 * Instancia de Axios configurada para Client-Side Rendering (CSR)
 * Utiliza los tokens de Google almacenados en localStorage
 */
export const axiosClientApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_SERVICE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor de request para añadir el token de autorización
axiosClientApi.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') {
      return config
    }

    // Verificar si hay tokens válidos
    if (!hasValidTokens()) {
      console.warn('No hay tokens válidos disponibles para la petición')
      return config
    }

    // Obtener tokens del localStorage
    const tokens = getGoogleTokens()
    if (tokens?.access_token) {
      config.headers.Authorization = `Bearer ${tokens.id_token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor de response para manejar errores de autorización
axiosClientApi.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    // Si recibimos un 401, los tokens pueden haber expirado
    if (error.response?.status === 401) {
      console.error('Token expirado o inválido. Considera refrescar los tokens.')

      // Opcional: disparar un evento personalizado para que la app maneje la renovación
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:token-expired'))
      }
    }

    // Si recibimos un 403, el usuario no tiene permisos
    if (error.response?.status === 403) {
      console.error('Sin permisos para acceder a este recurso')
    }

    return Promise.reject(error)
  }
)

/**
 * Función helper para hacer peticiones con manejo automático de tokens
 */
export const apiClientRequest = {
  get: <T = unknown>(url: string, config?: InternalAxiosRequestConfig) =>
    axiosClientApi.get<T>(url, config),

  post: <T = unknown>(url: string, data?: unknown, config?: InternalAxiosRequestConfig) =>
    axiosClientApi.post<T>(url, data, config),

  put: <T = unknown>(url: string, data?: unknown, config?: InternalAxiosRequestConfig) =>
    axiosClientApi.put<T>(url, data, config),

  patch: <T = unknown>(url: string, data?: unknown, config?: InternalAxiosRequestConfig) =>
    axiosClientApi.patch<T>(url, data, config),

  delete: <T = unknown>(url: string, config?: InternalAxiosRequestConfig) =>
    axiosClientApi.delete<T>(url, config)
}

export default axiosClientApi
