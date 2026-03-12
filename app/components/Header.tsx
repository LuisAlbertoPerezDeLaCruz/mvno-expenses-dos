import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">MVNO Expenses</h1>
        <nav className="flex space-x-6">
          <Link href="/" className="text-blue-600 font-medium">
            Inicio
          </Link>
          <Link href="/employees" className="text-gray-600 hover:text-blue-600">
            Empleados
          </Link>
          <Link href="/postal-codes" className="text-gray-600 hover:text-blue-600">
            Codigos postales
          </Link>
        </nav>
      </div>
    </header>
  );
}
