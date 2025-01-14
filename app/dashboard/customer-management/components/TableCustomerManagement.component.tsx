'use client'
import React from 'react'
import { mockCustomerData } from '@/app/dashboard/customer-management/mocks/mockCustomerData'

const TableCustomerManagement = () => {
  return (
    <div className="rounded-t-xl overflow-hidden border">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-app-primary text-white text-left">
            <th className="p-3">Nombre y Apellidos</th>
            <th className="p-3">Número de Teléfono</th>
            <th className="p-3">Email</th>
            <th className="p-3">Fecha de Registro</th>
          </tr>
        </thead>
        <tbody>
          {mockCustomerData.map((customer) => (
            <tr key={customer.id} className="border-t border-gray-300">
              <td className="p-3">{customer.fullName}</td>
              <td className="p-3">{customer.phone}</td>
              <td className="p-3">{customer.email}</td>
              <td className="p-3">{customer.registrationDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableCustomerManagement
