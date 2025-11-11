'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, ReactNode } from 'react'

interface ClientQueryProviderProps {
  children: ReactNode
}

/**
 * Provider específico para TanStack Query en Client-Side Rendering (CSR)
 * Configurado para uso con tokens de Google desde localStorage
 */
export function ClientQueryProvider ({ children }: ClientQueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Configuración para CSR - no hacer prefetch automático en SSR
            staleTime: 1000 * 60 * 5, // 5 minutos
            gcTime: 1000 * 60 * 30, // 30 minutos (antes era cacheTime)
            retry: (failureCount, error) => {
              // No reintentar si es error de autenticación
              if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { status?: number } }
                if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
                  return false
                }
              }
              // Reintentar hasta 3 veces para otros errores
              return failureCount < 3
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Solo habilitar cuando la ventana tiene foco (mejor UX para CSR)
            refetchOnWindowFocus: true,
            // Refetch cuando se reconecta la red
            refetchOnReconnect: true,
            // No hacer refetch automático en mount para CSR (lo controlaremos manualmente)
            refetchOnMount: true
          },
          mutations: {
            // Configuración para mutaciones
            retry: 1,
            onError: (error) => {
              console.error('Error en mutación:', error)

              // Manejar errores de autenticación
              if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { status?: number } }
                if (axiosError.response?.status === 401) {
                  // Disparar evento para renovar tokens
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('auth:token-expired'))
                  }
                }
              }
            }
          }
        }
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

/**
 * Hook para obtener el QueryClient desde cualquier componente hijo
 */
export { useQueryClient } from '@tanstack/react-query'
