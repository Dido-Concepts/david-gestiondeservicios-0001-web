const Sidebar = () => {
  return (
    <aside className="w-40 h-screen fixed top-14 border-r border-gray-300 px-2 pt-5 text-app-quaternary">
    <h2 className="text-xl font-bold mb-4">Equipo</h2>
    <nav>
      <ul className="space-y-4">
        <li><a href="/dashboard/user-management/team-management" className="block rounded hover:bg-gray-200">Gestionar equipo</a></li>
        <li><a href="/dashboard/user-management/shift-management" className="block rounded hover:bg-gray-200">Gestionar turnos</a></li>
      </ul>
    </nav>
  </aside>
  )
}

export default Sidebar
