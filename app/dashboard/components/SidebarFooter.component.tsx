'use client'

import { signOutOnServer } from '@/modules/auth/actions/auth.action'
import { useDashboardStore } from '@/modules/share/infra/store/ui.store'

export function SidebarFooter () {
  const { isDashboardOpen } = useDashboardStore()
  return (
        <form action={signOutOnServer} className="flex-shrink-0 p-2 border-t max-h-14 bg-app-primary">
            <button type='submit'
                className="flex items-center justify-center w-full px-4 py-2 space-x-1 font-medium tracking-wider uppercase bg-app-terciary border rounded-md focus:outline-none focus:ring">
                <span>
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </span>
                <span className={`${!isDashboardOpen ? 'lg:hidden' : ''}`}>Cerrar sesión</span>
            </button>
        </form>
  )
}
