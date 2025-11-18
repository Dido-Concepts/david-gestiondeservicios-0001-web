'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'
import { TokenManager } from '@/app/components/TokenManager.component'

interface AuthProviderProps {
  children: ReactNode
}

/**
 * Proveedor de autenticación que envuelve la aplicación con SessionProvider
 * e incluye el TokenManager para manejar tokens automáticamente
 */
export function AuthProvider ({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <TokenManager />
      {children}
    </SessionProvider>
  )
}
