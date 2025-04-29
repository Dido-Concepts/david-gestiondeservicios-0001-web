import { IconComponent, IconsName } from '@/app/components'
import { getQueryClient } from '@/app/providers/GetQueryClient'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { QUERY_KEYS_USER_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { ListUsersResponse } from '@/modules/user/application/use-cases/query/list-users/list-users.response'
import { UserStatus } from '@/modules/user/domain/models/user.model'
import { changeStatus } from '@/modules/user/infra/actions/user.action'
import { useModalUserForm } from '@/modules/user/infra/store/user-management.store'
import { useMutation } from '@tanstack/react-query'
import { Row } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

export function ActionMenu ({ row }: { row: Row<ListUsersResponse> }) {
  const nameIcon: IconsName = row.original.status === UserStatus.ACTIVE ? 'person-fill-slash' : 'person-fill-check'

  const changeStatusWithMutation = row.original.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE

  const { toast } = useToast()

  const { setUser, toggleModal } = useModalUserForm()

  const handleEditUser = () => {
    setUser(row.original)
    toggleModal()
  }

  const { mutate, isPending } = useMutation({
    mutationFn: changeStatus,
    onError: (error) => {
      return toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to updated'
      })
    },
    onSuccess: () => {
      const queryClient = getQueryClient()
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS_USER_MANAGEMENT.UMListUsers] })
      toast({
        title: 'Usuario actualizado',
        description: `El usuario ${row.original.email} ha sido ${row.original.status === UserStatus.ACTIVE ? 'desactivado' : 'activado'}`
      })
    }
  })

  return (

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {
          isPending
            ? (
              <Button variant="ghost" disabled >
                <span className="sr-only">Cargando...</span>
                <IconComponent name="spinner" className="animate-spin h-4 w-4" />
              </Button>
              )
            : (
              <Button variant="ghost" >
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              )
        }

      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" >
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer' onClick={handleEditUser}>
          <IconComponent name="pencil" className='text-blue-500' />
          Editar Usuario
        </DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer' onClick={() => mutate({ idUser: row.original.id, status: changeStatusWithMutation })} >
          <IconComponent name={nameIcon}
            className={
              row.original.status === UserStatus.ACTIVE
                ? 'text-red-500'
                : 'text-green-500'
            }
          />
          {
            row.original.status === UserStatus.ACTIVE
              ? 'Desactivar '
              : 'Activar '
          } Usuario
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
