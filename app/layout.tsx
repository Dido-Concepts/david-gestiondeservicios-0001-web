import type { Metadata } from 'next'
import { Raleway } from 'next/font/google'
import './globals.css'
import { ReactNode } from 'react'
import '@/config/di/reflect-metadata'
import QueryClientProvider from '@/app/providers/QueryClient.provider'
import NextTopLoader from 'nextjs-toploader'
import { Toaster } from '@/components/ui/toaster'

const raleway = Raleway({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aldonate - Dashboard',
  description: 'Aldonate - Dashboard'
}

export default function RootLayout ({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${raleway.className} antialiased`}
      >
        <QueryClientProvider>
          {children}
          <Toaster />
          <NextTopLoader
            color='linear-gradient(90deg, #414141, #BF0413)'
            height={10}
          />
        </QueryClientProvider>
      </body>
    </html>
  )
}
