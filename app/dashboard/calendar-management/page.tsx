'use client'

import { useState } from 'react'
import { ClientQueryProvider } from '@/app/providers/ClientQueryProvider'
import { GoogleTokensExample } from '@/app/components/GoogleTokensExample.component'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Calendar, Settings } from 'lucide-react'
import { CalendarCSRComponent } from './components/CalendarCSRSimple.component'

export default function Page () {
  const [currentView, setCurrentView] = useState<'tokens' | 'calendar'>('tokens')

  return (
    <ClientQueryProvider>
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Gestión de Calendario - CSR con Google Tokens</h1>

          {/* Selector de vista */}
          <div className="flex gap-2">
            <Button
              variant={currentView === 'tokens' ? 'default' : 'outline'}
              onClick={() => setCurrentView('tokens')}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Configuración de Tokens
            </Button>
            <Button
              variant={currentView === 'calendar' ? 'default' : 'outline'}
              onClick={() => setCurrentView('calendar')}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Calendario CSR
            </Button>
          </div>
        </div>

        {/* Contenido dinámico */}
        {currentView === 'tokens' && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración de Tokens de Google
              </CardTitle>
              <CardDescription>
                Administra tus tokens de Google para hacer llamadas a las APIs desde el cliente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GoogleTokensExample />
            </CardContent>
          </Card>
        )}

        {currentView === 'calendar' && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Calendario CSR Demo
              </CardTitle>
              <CardDescription>
                Demostración del calendario funcionando con Client-Side Rendering y tokens de Google.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarCSRComponent />
            </CardContent>
          </Card>
        )}

        {/* Información sobre la implementación */}
        <Card className="w-full border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <AlertCircle className="h-5 w-5" />
              Información de la Implementación CSR
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-blue-700">
            <div>
              <h4 className="font-semibold">✅ Características implementadas:</h4>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li><strong>axiosClientApi:</strong> Configuración de Axios para CSR con tokens de localStorage</li>
                <li><strong>ClientQueryProvider:</strong> Provider dedicado de TanStack Query para CSR</li>
                <li><strong>useCalendarQueries:</strong> Hooks personalizados para queries del calendario</li>
                <li><strong>Manejo automático de tokens:</strong> Interceptors que añaden automáticamente los tokens</li>
                <li><strong>Renovación de tokens:</strong> Eventos personalizados para manejar expiración</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">🔧 Archivos creados/modificados:</h4>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm font-mono">
                <li>config/axiosClientApi.ts</li>
                <li>app/providers/ClientQueryProvider.tsx</li>
                <li>app/dashboard/calendar-management/hooks/useCalendarQueries.ts</li>
                <li>app/dashboard/calendar-management/page.tsx (esta página)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </ClientQueryProvider>
  )
}
