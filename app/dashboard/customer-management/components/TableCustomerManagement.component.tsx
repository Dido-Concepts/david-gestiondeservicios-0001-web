'use client'

import { DataTable } from '@/app/components'
import { getCustomers } from '@/modules/customer/application/actions/customer.action'
import { QUERY_KEYS_CUSTOMER_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { useSuspenseQuery } from '@tanstack/react-query'
import { COLUMNS_CUSTOMER_MANAGEMENT } from '@/app/dashboard/customer-management/components/ColumnsCustomerManagement.component'

const TableCustomerManagement = (param: { pageIndex: number, pageSize: number }) => {
  const { data } = useSuspenseQuery({
    queryKey: [QUERY_KEYS_CUSTOMER_MANAGEMENT.LMListCustomers, param.pageIndex, param.pageSize],
    queryFn: () => getCustomers({ pageIndex: param.pageIndex, pageSize: param.pageSize })
  })
  return (
    // <div className="rounded-t-xl overflow-x-auto border">
    //   <table className="w-full border-collapse">
    //     <thead>
    //       <tr className="bg-app-primary text-white text-left">
    //         <th className="p-3">Nombre y Apellidos</th>
    //         <th className="p-3">Número de Teléfono</th>
    //         <th className="p-3">Email</th>
    //         <th className="p-3">Fecha de Registro</th>
    //         <th className="p-3 text-right">Acciones</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {mockCustomerData.map((customer) => (
    //         <tr key={customer.id} className="border-t border-gray-300">
    //           <td className="p-3">{customer.fullName}</td>
    //           <td className="p-3">{customer.phone}</td>
    //           <td className="p-3">{customer.email}</td>
    //           <td className="p-3">{customer.registrationDate}</td>
    //           <td className="p-3 text-right">
    //             <ActionMenu customer={customer} />
    //           </td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    // </div>
    <DataTable columns={COLUMNS_CUSTOMER_MANAGEMENT} data={data.data} pageSize={param.pageSize} />
  )
}

export default TableCustomerManagement
