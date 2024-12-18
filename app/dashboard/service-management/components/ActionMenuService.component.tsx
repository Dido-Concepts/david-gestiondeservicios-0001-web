'use client'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { IconComponent } from '@/app/components/Icon.component'

const ActionMenuService = () => {
  return (
    <DropdownMenu>
      {/* Usa un <div> en lugar de <button> */}
      <DropdownMenuTrigger asChild>
        <div
          className="p-1 rounded-md hover:bg-gray-300 cursor-pointer focus:outline-none focus:ring-2"
          role="button"
          aria-label="Action Menu"
        >
          <IconComponent
            name="ellipsis"
            width={20}
            height={20}
            className="w-5 h-5 ml-2"
          />
        </div>
      </DropdownMenuTrigger>

      {/* Contenido del menú */}
      <DropdownMenuContent
        align="end"
        sideOffset={5}
        className="bg-white border border-gray-200 rounded-md shadow-md w-40"
      >
        <DropdownMenuItem onSelect={() => console.log('Editar')}>
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => console.log('Cambiar estado')}>
          Cambiar estado
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ActionMenuService
