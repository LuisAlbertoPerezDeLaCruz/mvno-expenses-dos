import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Header con navegación */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">MVNO Expenses</h1>
          <nav className="flex space-x-6">
            <Link href="/" className="text-blue-600 font-medium">
              Inicio
            </Link>
            <Link
              href="/employees"
              className="text-gray-600 hover:text-blue-600"
            >
              Empleados
            </Link>
          </nav>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-900">
          Bienvenido al Sistema de Control de Gastos
        </h2>
      </main>
    </div>
  );
}
