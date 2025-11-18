'use client'

import { useGoogleTokens } from '@/hooks/use-google-tokens'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Componente de ejemplo que muestra cómo usar los tokens de Google
 * en un componente client
 */
export function GoogleTokensExample () {
  const {
    tokens,
    accessToken,
    idToken,
    isLoading,
    hasTokens,
    refreshTokens,
    clearTokens
  } = useGoogleTokens()

  const handleCallGoogleAPI = async () => {
    if (!accessToken) {
      alert('No hay access token disponible')
      return
    }

    try {
      // Ejemplo de llamada a la API de Google usando el access token
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Error al llamar la API de Google')
      }

      const userData = await response.json()
      console.log('Información del usuario desde Google:', userData)
      alert(`Hola ${userData.name}! Revisa la consola para más detalles.`)
    } catch {
      console.error('Error al llamar la API de Google')
      alert('Error al llamar la API de Google. Revisa la consola.')
    }
  }

  const handleRefreshTokens = async () => {
    try {
      await refreshTokens()
      alert('Tokens refrescados exitosamente')
    } catch (error:unknown) {
      alert(`Error al refrescar tokens ${error}`)
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Cargando tokens...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Google Tokens Manager</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Estado de Tokens</h3>
            <p className="text-sm">
              <strong>Tiene tokens válidos:</strong> {hasTokens ? '✅ Sí' : '❌ No'}
            </p>
            <p className="text-sm">
              <strong>Access Token:</strong> {accessToken ? '✅ Disponible' : '❌ No disponible'}
            </p>
            <p className="text-sm">
              <strong>ID Token:</strong> {idToken ? '✅ Disponible' : '❌ No disponible'}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Información de Tokens</h3>
            {tokens && (
              <div className="text-xs space-y-1">
                <p><strong>Expira:</strong> {new Date(tokens.expires_at * 1000).toLocaleString()}</p>
                <p><strong>Access Token (primeros 20 chars):</strong> {tokens.access_token.substring(0, 20)}...</p>
                <p><strong>ID Token (primeros 20 chars):</strong> {tokens.id_token.substring(0, 20)}...</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleCallGoogleAPI}
            disabled={!hasTokens}
            variant="default"
          >
            Llamar API de Google
          </Button>

          <Button
            onClick={handleRefreshTokens}
            disabled={!hasTokens}
            variant="secondary"
          >
            Refrescar Tokens
          </Button>

          <Button
            onClick={clearTokens}
            variant="destructive"
          >
            Limpiar Tokens
          </Button>
        </div>

        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold mb-2">Ejemplos de uso en componentes:</h4>
          <pre className="text-xs text-gray-600">
{`// Hook completo
const { accessToken, idToken, hasTokens } = useGoogleTokens()

// Hooks simplificados
const accessToken = useAccessToken()
const idToken = useIdToken()

// Usar en llamadas a API
fetch('/api/some-endpoint', {
  headers: {
    'Authorization': \`Bearer \${accessToken}\`,
    'X-ID-Token': idToken
  }
})`}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}
