'use client'

import { IconsName, IconComponent } from '@/app/components/Icon.component'
import { useDashboardStore } from '@/modules/share/infra/store/ui.store'
import Link from 'next/link'

export interface LinkSidebarProps {
    href: string;
    icon: IconsName;
    text: string;
    isAdmin: boolean;
}

export function LinkSidebar (params: LinkSidebarProps) {
  const { isDashboardOpen } = useDashboardStore()
  return (
        <Link
            href={params.href}
            className={`font-extrabold text-app-terciary  flex items-center p-2 space-x-2 rounded-md hover:bg-app-terciary hover:text-app-primary ${!isDashboardOpen ? 'justify-center' : ''}`}
        >
            <span>
                <IconComponent name={params.icon} width={20} height={20} className="w-7 h-7" />
            </span>
            <span className={` ${!isDashboardOpen ? 'lg:hidden' : ''}`}>{params.text}</span>
        </Link>
  )
}
