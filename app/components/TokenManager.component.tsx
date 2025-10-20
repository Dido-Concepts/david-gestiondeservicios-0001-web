'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { saveGoogleTokens, removeGoogleTokens } from '@/lib/token-storage'

interface GoogleTokens {
  access_token: string
  id_token: string
  refresh_token?: string
  expires_at: number
}

/**
 * Componente que maneja automáticamente el almacenamiento de tokens en localStorage
 * Debe ser usado en el layout principal para que funcione en toda la aplicación
 */
export function TokenManager (): null {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') return

    if (session?.user?.id_token && status === 'authenticated') {
      try {
        // Extraer tokens de la sesión de NextAuth
        const tokens: GoogleTokens = {
          access_token: '', // NextAuth no expone directamente el access_token en la sesión
          id_token: session.user.id_token,
          expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hora por defecto
        }

        // Si hay más información disponible en la sesión, usarla
        const sessionWithTokens = session as typeof session & {
          accessToken?: string
          refreshToken?: string
          expiresAt?: number
        }

        if (sessionWithTokens.accessToken) {
          tokens.access_token = sessionWithTokens.accessToken
        }

        if (sessionWithTokens.refreshToken) {
          tokens.refresh_token = sessionWithTokens.refreshToken
        }

        if (sessionWithTokens.expiresAt) {
          tokens.expires_at = sessionWithTokens.expiresAt
        }

        // Guardar tokens en localStorage
        saveGoogleTokens(tokens)
      } catch (error) {
        console.error('❌ Error al sincronizar tokens:', error)
      }
    } else if (status === 'unauthenticated') {
      // Limpiar tokens cuando el usuario no está autenticado
      removeGoogleTokens()
      console.log('🧹 Tokens limpiados por falta de autenticación')
    }
  }, [session, status])

  // Este componente no renderiza nada
  return null
}
