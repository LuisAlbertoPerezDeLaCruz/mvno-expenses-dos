import { ApiUsersResponse, EmployeesPageProps } from "./types";
import { fetchJson } from "@/lib/api";

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
    <div>
      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-900">
          Listado de empleados
        </h2>

        <ul className="space-y-2">
          {employees.users.length === 0 ? (
            <li className="text-sm text-gray-500">
              No hay empleados en esta página.
            </li>
          ) : (
            employees.users.map((user) => (
              <li key={user.id} className="border rounded p-3">
                <p className="font-semibold">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-gray-600"> {user.email}</p>
              </li>
            ))
          )}
        </ul>
      </main>
    </div>
  );
}
