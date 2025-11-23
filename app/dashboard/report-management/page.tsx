'use client'

import { ClientQueryProvider } from '@/app/providers/ClientQueryProvider'
import { ReportManagementContent } from './components/ReportManagementContent.component'

export default function Page () {
  return (
    <ClientQueryProvider>
      <ReportManagementContent />
    </ClientQueryProvider>
  )
}
