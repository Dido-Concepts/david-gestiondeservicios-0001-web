'use client'
import { useDashboardStore } from '@/modules/share/infra/store/ui.store'

export function SidebarBackdrop () {
  const { isDashboardOpen } = useDashboardStore()
  return (
        <>
            {isDashboardOpen && (
                <div
                    className="fixed inset-0 z-10 bg-black bg-opacity-20 lg:hidden"
                    style={{ backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
                ></div>
            )}
        </>
  )
}
