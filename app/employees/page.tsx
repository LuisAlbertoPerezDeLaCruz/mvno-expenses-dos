import { ApiUsers } from "./types";
import { fetchJson } from "@/lib/api";

export default async function Employees() {
  const employees = await fetchJson<ApiUsers>(
    "https://jsonplaceholder.typicode.com/users",
  );
  return (
    <div>
      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-900">
          Listado de empleados
        </h2>
        <ul className="space-y-2">
          {employees.map((emp) => (
            <li key={emp.id} className="border rounded p-3">
              <p className="font-semibold">{emp.name}</p>
              <p className="text-sm text-gray-600">{emp.email}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
