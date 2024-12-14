import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { IconComponent } from '@/app/components/Icon.component'

const ActionMenuService = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button
          className="p-1 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2"
          aria-label="Action Menu"
        >
          <IconComponent
            name="ellipsis"
            width={20}
            height={20}
            className="w-5 h-5 ml-2"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={5}
        className="bg-white border border-gray-200 rounded-md shadow-md w-40"
      >
        <DropdownMenuItem onClick={() => console.log('Editar')}>
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => console.log('Cambiar estado')}>
          Cambiar estado
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ActionMenuService
