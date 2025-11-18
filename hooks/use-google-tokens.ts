'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  getGoogleTokens,
  saveGoogleTokens,
  removeGoogleTokens,
  hasValidTokens,
  updateAccessToken,
  clearAllLocalStorage
} from '@/lib/token-storage'

interface GoogleTokens {
  access_token: string
  id_token: string
  refresh_token?: string
  expires_at: number
  expires_in?: number
}

interface UseGoogleTokensReturn {
  tokens: GoogleTokens | null
  accessToken: string | null
  idToken: string | null
  isLoading: boolean
  hasTokens: boolean
  refreshTokens: () => Promise<void>
  clearTokens: () => void
  clearAllStorage: () => void
}

/**
 * Hook personalizado para manejar tokens de Google en componentes client
 */
export const useGoogleTokens = (): UseGoogleTokensReturn => {
  const { data: session, status } = useSession()
  const [tokens, setTokens] = useState<GoogleTokens | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar tokens al montar el componente
  useEffect(() => {
    const loadTokens = () => {
      const storedTokens = getGoogleTokens()
      setTokens(storedTokens)
      setIsLoading(false)
    }

    loadTokens()
  }, [])

  // Sincronizar tokens cuando cambia la sesión
  useEffect(() => {
    if (status === 'loading') return

    if (session?.user?.id_token && status === 'authenticated') {
      // Construir objeto de tokens desde la sesión
      const sessionTokens: GoogleTokens = {
        access_token: (session as { accessToken?: string }).accessToken || '',
        id_token: session.user.id_token,
        expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hora por defecto
      }

      // Guardar en localStorage y actualizar estado
      saveGoogleTokens(sessionTokens)
      setTokens(sessionTokens)
    } else if (status === 'unauthenticated') {
      // Limpiar tokens si no hay sesión
      removeGoogleTokens()
      setTokens(null)
    }

    setIsLoading(false)
  }, [session, status])

  // Función para refrescar tokens
  const refreshTokens = async (): Promise<void> => {
    try {
      const currentTokens = getGoogleTokens()
      if (!currentTokens?.refresh_token) {
        console.warn('No hay refresh token disponible')
        return
      }

      const response = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refresh_token: currentTokens.refresh_token
        })
      })

      if (!response.ok) {
        throw new Error('Error al refrescar tokens')
      }

      const data = await response.json()

      if (data.access_token) {
        updateAccessToken(data.access_token, data.expires_in || 3600)
        setTokens(getGoogleTokens())
        console.log('✅ Tokens refrescados exitosamente')
      }
    } catch (error) {
      console.error('❌ Error al refrescar tokens:', error)
      // Si falla el refresh, limpiar tokens
      clearTokens()
    }
  }

  // Función para limpiar tokens
  const clearTokens = (): void => {
    removeGoogleTokens()
    setTokens(null)
  }

  // Función para limpiar todo el localStorage
  const clearAllStorage = (): void => {
    clearAllLocalStorage()
    setTokens(null)
  }

  return {
    tokens,
    accessToken: tokens?.access_token || null,
    idToken: tokens?.id_token || null,
    isLoading: isLoading || status === 'loading',
    hasTokens: hasValidTokens(),
    refreshTokens,
    clearTokens,
    clearAllStorage
  }
}

/**
 * Hook simplificado para obtener solo el access token
 */
export const useAccessToken = (): string | null => {
  const { accessToken } = useGoogleTokens()
  return accessToken
}

/**
 * Hook simplificado para obtener solo el ID token
 */
export const useIdToken = (): string | null => {
  const { idToken } = useGoogleTokens()
  return idToken
}

/**
 * Hook para verificar si hay tokens válidos
 */
export const useHasValidTokens = (): boolean => {
  const { hasTokens } = useGoogleTokens()
  return hasTokens
}
