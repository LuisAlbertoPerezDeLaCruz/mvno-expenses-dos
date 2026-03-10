import { notFound } from "next/navigation";
import { fetchJson } from "@/lib/api";
import type { ApiUser } from "../types";
import EmployeeDetail from "@/app/components/employees/EmployeeDetail";

type EmployeeDetailPageProps = {
  params: Promise<{ id: string }>;
};

async function getEmployeeById(id: string): Promise<ApiUser> {
  const user = await fetchJson<ApiUser>(`https://dummyjson.com/users/${id}`);
  return user;
}

export default async function EmployeeDetailPage({
  params,
}: EmployeeDetailPageProps) {
  const { id } = await params;

  // Validación mínima de id
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    notFound();
  }
  let user: ApiUser;

  try {
    user = await getEmployeeById(id);
  } catch {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Empleado #{user.id}
      </h1>
      <EmployeeDetail user={user} />
    </main>
  );
}
