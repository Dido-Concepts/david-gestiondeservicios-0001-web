'use client'

interface GoogleTokens {
  access_token: string
  id_token: string
  refresh_token?: string
  expires_at: number
  expires_in?: number
}

interface StoredTokenData {
  tokens: GoogleTokens
  timestamp: number
  expiresAt: number
}

const STORAGE_KEY = 'google_auth_tokens'

// Función simple de "encriptación" (en producción usar una librería de encriptación real)
const encode = (data: string): string => {
  return btoa(encodeURIComponent(data))
}

const decode = (data: string): string => {
  try {
    return decodeURIComponent(atob(data))
  } catch {
    return ''
  }
}

/**
 * Guarda los tokens de Google en localStorage de forma segura
 */
export const saveGoogleTokens = (tokens: GoogleTokens): void => {
  if (typeof window === 'undefined') return

  try {
    const tokenData: StoredTokenData = {
      tokens,
      timestamp: Date.now(),
      expiresAt: tokens.expires_at * 1000 // Convertir a milisegundos
    }

    const encodedData = encode(JSON.stringify(tokenData))
    localStorage.setItem(STORAGE_KEY, encodedData)

    console.log('✅ Tokens de Google guardados en localStorage')
  } catch (error) {
    console.error('❌ Error al guardar tokens en localStorage:', error)
  }
}

/**
 * Recupera los tokens de Google desde localStorage
 */
export const getGoogleTokens = (): GoogleTokens | null => {
  if (typeof window === 'undefined') return null

  try {
    const encodedData = localStorage.getItem(STORAGE_KEY)
    if (!encodedData) return null

    const decodedData = decode(encodedData)
    if (!decodedData) return null

    const tokenData: StoredTokenData = JSON.parse(decodedData)

    // Verificar si los tokens han expirado
    if (Date.now() > tokenData.expiresAt) {
      console.warn('⚠️ Los tokens han expirado')
      removeGoogleTokens()
      return null
    }

    return tokenData.tokens
  } catch (error) {
    console.error('❌ Error al recuperar tokens desde localStorage:', error)
    removeGoogleTokens() // Limpiar datos corruptos
    return null
  }
}

/**
 * Elimina los tokens de Google del localStorage
 */
export const removeGoogleTokens = (): void => {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEY)
    console.log('🗑️ Tokens de Google eliminados del localStorage')
  } catch (error) {
    console.error('❌ Error al eliminar tokens del localStorage:', error)
  }
}

/**
 * Verifica si existen tokens válidos en localStorage
 */
export const hasValidTokens = (): boolean => {
  const tokens = getGoogleTokens()
  return tokens !== null
}

/**
 * Obtiene el access token actual
 */
export const getAccessToken = (): string | null => {
  const tokens = getGoogleTokens()
  return tokens?.access_token || null
}

/**
 * Obtiene el ID token actual
 */
export const getIdToken = (): string | null => {
  const tokens = getGoogleTokens()
  return tokens?.id_token || null
}

/**
 * Actualiza solo el access token (útil después de un refresh)
 */
export const updateAccessToken = (newAccessToken: string, expiresIn: number): void => {
  const existingTokens = getGoogleTokens()
  if (!existingTokens) return

  const updatedTokens: GoogleTokens = {
    ...existingTokens,
    access_token: newAccessToken,
    expires_at: Math.floor(Date.now() / 1000) + expiresIn,
    expires_in: expiresIn
  }

  saveGoogleTokens(updatedTokens)
}

/**
 * Limpia completamente todo el localStorage
 * Útil para cerrar sesión y asegurar que no queden datos sensibles
 */
export const clearAllLocalStorage = (): void => {
  if (typeof window === 'undefined') return

  try {
    localStorage.clear()
    console.log('🧹 Todo el localStorage ha sido limpiado')
  } catch (error) {
    console.error('❌ Error al limpiar localStorage:', error)
  }
}
