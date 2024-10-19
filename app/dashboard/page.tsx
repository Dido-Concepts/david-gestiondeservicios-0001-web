export default async function DashboardPage () {
  return (
        <div className="flex items-center justify-center  mx-auto my-14 bg-app-terciary">
            <div className="text-center text-app-primary px-4 md:px-16 lg:px-48">
                <div className="text-4xl md:text-5xl lg:text-6xl">👋</div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-4">
                    Bienvenido al panel de Administración
                </h1>
                <p className="text-base md:text-lg lg:text-xl px-4 md:px-16 lg:px-32 xl:px-48 mt-4">
                    Aquí encontrarás todas las herramientas y opciones necesarias para gestionar y administrar eficientemente el aplicativo web.
                </p>
                <p className="text-base md:text-lg lg:text-xl font-semibold mt-4">
                    ¡Tu control comienza aquí!
                </p>

            </div>
        </div>
  )
}
