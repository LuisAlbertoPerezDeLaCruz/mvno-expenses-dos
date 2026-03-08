import { ApiUsersResponse } from "./types";
import { fetchJson } from "@/lib/api";

export default async function Employees() {
  const employees = await fetchJson<ApiUsersResponse>(
    "https://dummyjson.com/users?limit=8&skip=0",
  );
  return (
    <div>
      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-900">
          Listado de empleados
        </h2>
        <ul className="space-y-2">
          {employees.users.map((user) => (
            <li key={user.id} className="border rounded p-3">
              <p className="font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-gray-600"> {user.email}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
