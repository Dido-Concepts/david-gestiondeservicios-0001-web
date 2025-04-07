import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useMutation } from '@tanstack/react-query'
import { changeStatusLocation } from '@/modules/location/application/actions/location.action'
import { getQueryClient } from '@/app/providers/GetQueryClient'
import { useToast } from '@/hooks/use-toast'
import { QUERY_KEYS_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'

export function ActionMenuChangeStatusLocation (props: {
  status: boolean;
  idLocation: string;
  nameLocation: string;
}) {
  const { toast } = useToast()

  const { mutate, isPending } = useMutation({
    mutationFn: changeStatusLocation,
    onError: (error) => {
      return toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to updated'
      })
    },
    onSuccess: () => {
      const queryClient = getQueryClient()
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS_LOCATION_MANAGEMENT.LMListLocations]
      })
      toast({
        title: 'Usuario actualizado',
        description: `La sede ${props.nameLocation} ha sido ${props.status ? 'activada' : 'desactivada'}`
      })
    }
  })
  return (
    <DropdownMenuItem onClick={(e) => {
      e.preventDefault()
      mutate(props.idLocation)
    }} disabled={isPending}>
      {props.status ? 'Activar' : 'Desactivar'}
    </DropdownMenuItem>
  )
}
