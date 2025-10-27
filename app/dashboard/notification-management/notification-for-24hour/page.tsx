'use client'

import { ClientQueryProvider } from '@/app/providers/ClientQueryProvider'
import { NotificationLocationsContent } from './components/NotificationLocationsContent.component'

export default function NotificationLocationsPage () {
  return (
    <ClientQueryProvider>
      <NotificationLocationsContent />
    </ClientQueryProvider>
  )
}
