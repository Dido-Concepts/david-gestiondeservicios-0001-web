'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { IconComponent } from '@/app/components/Icon.component'
import AddModalService from '@/app/dashboard/service-management/components/AddModalService.component'

export default function AddButtonService () {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='mt-4 md:mt-0 bg-app-quaternary hover:bg-gray-500 text-app-terciary px-4 py-2 rounded-lg flex items-center text-base' >
          Añadir
          <IconComponent name="plus" width={20} height={20} className="w-6 h-6 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
          <DropdownMenuItem>
            <AddModalService />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Categoría</span>
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
