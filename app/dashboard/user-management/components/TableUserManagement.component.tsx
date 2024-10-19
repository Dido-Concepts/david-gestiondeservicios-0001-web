'use client'

import { DataTable } from '@/app/components'
import { QUERY_KEYS_USER_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { getListUsers } from '@/modules/user/infra/actions/user.action'

import { useSuspenseQuery } from '@tanstack/react-query'
import { COLUMNS_USER_MANAGEMENT } from '@/app/dashboard/user-management/components'

export function TableUserManagement () {
  const { data } = useSuspenseQuery({
    queryKey: [QUERY_KEYS_USER_MANAGEMENT.UMListUsers],
    queryFn: () => getListUsers()
  })

  return (
    <DataTable columns={COLUMNS_USER_MANAGEMENT} data={data.data} />
  )
}
