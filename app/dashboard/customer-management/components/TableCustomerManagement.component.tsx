'use client'

import { DataTable } from '@/app/components'
import { getCustomers } from '@/modules/customer/application/actions/customer.action'
import { QUERY_KEYS_CUSTOMER_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { useSuspenseQuery } from '@tanstack/react-query'
import { COLUMNS_CUSTOMER_MANAGEMENT } from '@/app/dashboard/customer-management/components/ColumnsCustomerManagement.component'
import { PaginationTable } from '@/app/components/PaginationTable.component'

const TableCustomerManagement = (param: {
  pageIndex: number;
  pageSize: number;
}) => {
  const { data } = useSuspenseQuery({
    queryKey: [
      QUERY_KEYS_CUSTOMER_MANAGEMENT.LMListCustomers,
      param.pageIndex,
      param.pageSize
    ],
    queryFn: () =>
      getCustomers({ pageIndex: param.pageIndex, pageSize: param.pageSize })
  })
  return (
    <>
      <DataTable
        columns={COLUMNS_CUSTOMER_MANAGEMENT}
        data={data.data}
        pageSize={param.pageSize}
      />
      <PaginationTable total={data.meta.total} pageTotal={data.meta.pageCount} />
    </>
  )
}

export default TableCustomerManagement
//
