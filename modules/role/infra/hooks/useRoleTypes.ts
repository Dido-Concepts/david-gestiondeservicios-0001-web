import { useQuery } from '@tanstack/react-query'
import { getRoles } from '@/modules/role/application/actions/role.action'
import { QUERY_KEYS_ROLE_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'

export const useRoleTypes = () => {
  return useQuery({
    queryKey: [QUERY_KEYS_ROLE_MANAGEMENT.RMGetRoles],
    queryFn: () => getRoles(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 1
  })
}
