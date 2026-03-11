import { ApiUsersResponse, EmployeesPageProps } from "./types";
import { fetchJson } from "@/lib/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function Employees({ searchParams }: EmployeesPageProps) {
  const params = await searchParams;
  const pageParam = params.page;
  const page = Number(pageParam);

  // Si viene vacío, NaN, decimal o menor a 1 -> usar 1
  const currentPage = Number.isInteger(page) && page > 0 ? page : 1;
  const limit = 8;
  const skip = (currentPage - 1) * limit;

  const employees = await fetchJson<ApiUsersResponse>(
    `https://dummyjson.com/users?limit=${limit}&skip=${skip}`,
  );
  const totalPages = Math.ceil(employees.total / limit);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {/* Contenido principal */}
      <h2 className="text-2xl font-bold text-gray-900">Listado de empleados</h2>

      <ul className="space-y-2">
        {employees.users.length === 0 ? (
          <li className="text-sm text-gray-500">
            No hay empleados en esta página.
          </li>
        ) : (
          employees.users.map((user) => (
            <li key={user.id} className="border rounded p-3">
              <Link href={`/employees/${user.id}`} className="text-blue-600 underline hover:text-blue-800">
                <p className="font-semibold">
                  {user.firstName} {user.lastName}
                </p>
              </Link>
              <p className="text-sm text-gray-600"> {user.email}</p>
            </li>
          ))
        )}
      </ul>
      <div className="mt-6 flex items-center gap-3">
        {hasPrev ? (
          <Link
            href={`/employees?page=${currentPage - 1}`}
            className="inline-flex items-center gap-1 px-3 py-2 border rounded text-sm"
          >
            <ChevronLeft size={16} />
            <span>Anterior</span>
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-2 border rounded text-sm text-gray-400 cursor-not-allowed">
            <ChevronLeft size={16} />
            <span>Anterior</span>
          </span>
        )}

        <span className="text-sm text-gray-700">
          Página {currentPage} de {totalPages}
        </span>

        {hasNext ? (
          <Link
            href={`/employees?page=${currentPage + 1}`}
            className="inline-flex items-center gap-1 px-3 py-2 border rounded text-sm"
          >
            <span>Siguiente</span>
            <ChevronRight size={16} />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-2 border rounded text-sm text-gray-400 cursor-not-allowed">
            <span>Siguiente</span>
            <ChevronRight size={16} />
          </span>
        )}
      </div>
    </main>
  );
}
