'use client'

import { IconComponent } from '@/app/components/Icon.component'
import { Button } from '@/components/ui/button'
import { useDashboardStore, useModalUser } from '@/modules/share/infra/store/ui.store'

export function NavbarHeaderContainer (param: { userName: string }) {
  const { isDashboardOpen, toggleDashboard } = useDashboardStore()
  const { toggleModalUser } = useModalUser()
  return (
    <header className="flex-shrink-0 border-b bg-app-primary">
      <div className="flex items-center justify-between p-2">
        {/* Navbar left */}
        <div className="flex items-center space-x-3 ">
          <span className="p-2 text-xl font-bold tracking-wider uppercase lg:hidden text-app-terciary">Lima 21</span>
          {/* Toggle sidebar button */}
          <button onClick={toggleDashboard} className="p-2 rounded-md focus:outline-none focus:ring">
            <IconComponent name="back" width={20} height={20} className={`w-6 h-6 text-app-terciary ${isDashboardOpen ? 'transform transition-transform -rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navbar right */}
        <div className="flex justify-end">
          {/* Botón para abrir el modal del usuario */}
          <Button variant="ghost"
            className="flex items-center space-x-2 bg-app-primary text-white px-4 py-2 rounded-lg  hover:text-app-primary"
            onClick={toggleModalUser}
          >
            <IconComponent name="user" width={20} height={20} className="w-6 h-6  " />
            <span className="text-sm md:text-base">{param.userName}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
