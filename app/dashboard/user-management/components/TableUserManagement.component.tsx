'use client'

import { DataTable } from '@/app/components'
import { QUERY_KEYS_USER_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { getListUsers } from '@/modules/user/infra/actions/user.action'
import { useSuspenseQuery } from '@tanstack/react-query'
import { COLUMNS_USER_MANAGEMENT } from '@/app/dashboard/user-management/components'

export function TableUserManagement (param:{pageIndex: number, pageSize: number, query?: string}) {
  const { data } = useSuspenseQuery({
    queryKey: [QUERY_KEYS_USER_MANAGEMENT.UMListUsers, param.query, param.pageIndex, param.pageSize],
    queryFn: () => getListUsers({ pageIndex: param.pageIndex, pageSize: param.pageSize, query: param.query })
  })

  return (
    <DataTable columns={COLUMNS_USER_MANAGEMENT} data={data.data} />
  )
}
