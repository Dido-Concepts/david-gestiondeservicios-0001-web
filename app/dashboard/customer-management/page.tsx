import TableCustomerManagement from '@/app/dashboard/customer-management/components/TableCustomerManagement.component'
import AddButtonAndModalCustomer from '@/app/dashboard/customer-management/components/AddButtonAndModalCustomer.component'

export default function Page () {
  return (
    <main className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-app-quaternary mb-2">
            Clientes
          </h1>
          <p className="text-app-primary">
            Ver, añadir, editar y eliminar información del cliente.
          </p>
        </div>
        <div className="flex space-x-2">
          {/* Botón para añadir clientes */}
          <AddButtonAndModalCustomer />
        </div>
      </div>

      {/* Tabla de clientes */}
      <TableCustomerManagement />
    </main>
  )
}
