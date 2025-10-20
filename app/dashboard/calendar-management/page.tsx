'use client'

import { ClientQueryProvider } from '@/app/providers/ClientQueryProvider'
import { CalendarManagementContent } from './components/CalendarManagementContent.component'

export default function Page () {
  return (
    <ClientQueryProvider>
      <CalendarManagementContent />
    </ClientQueryProvider>
  )
}
