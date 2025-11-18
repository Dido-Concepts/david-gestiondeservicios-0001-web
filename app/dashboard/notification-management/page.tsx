'use client'

import { ClientQueryProvider } from '@/app/providers/ClientQueryProvider'
import { NotificationManagementContent } from './components/NotificationManagementContent.component'

export default function Page () {
  return (
    <ClientQueryProvider>
      <NotificationManagementContent />
    </ClientQueryProvider>
  )
}
