'use client'

import { useDashboardStore } from '@/modules/share/infra/store/ui.store'
import { IconComponent } from '@/app/components/Icon.component'
import Link from 'next/link'
import Image from 'next/image'
import { ReactNode } from 'react'

export function SidebarContainer ({
  children
}: Readonly<{
    children: ReactNode;
}>) {
  const { isDashboardOpen, toggleDashboard } = useDashboardStore()
  return (
        <aside
            className={`fixed inset-y-0 z-10 flex flex-col flex-shrink-0 w-64 max-h-screen overflow-hidden transition-all transform bg-app-terciary border-r shadow-lg lg:z-auto lg:static lg:shadow-none ${!isDashboardOpen ? '-translate-x-full lg:translate-x-0 lg:w-20' : ''}`}
        >
            <div className={`py-4 relative bg-app-primary flex items-center justify-center flex-shrink-0  ${!isDashboardOpen ? 'lg:justify-center' : ''}`}>
                <span className="text-xl font-semibold leading-8 tracking-wider uppercase whitespace-nowrap">
                    <Link href="/dashboard" title="Ir al Dashboard"
                        aria-label="Ir al Dashboard" >
                        <Image src='/aldonatelogo.webp' width={436} height={542} alt='lima 21' priority loading='eager' className='w-16 h-auto' />
                    </Link>
                </span>
                <button onClick={toggleDashboard} className="absolute top-2 right-2 rounded-md lg:hidden">
                    <IconComponent name="close" width={20} height={20} className="w-6 h-6 text-app-terciary" />
                </button>
            </div>
            {children}
        </aside>
  )
}
