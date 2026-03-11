"use client";

import { useState } from "react";
import type { ApiUser, UpdateUserPayload } from "@/app/employees/types";
import EmployeeDetail from "@/app/components/employees/EmployeeDetail";
import EmployeeForm from "@/app/components/employees/EmployeeForm";
import Button from "@/app/components/ui/Button";
import { Pencil } from "lucide-react";

type Props = {
  user: ApiUser;
};

export default function EmployeeDetailPanel({ user }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<ApiUser>(user);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(payload: UpdateUserPayload) {
    setError(null);
    const res = await fetch(`https://dummyjson.com/users/${currentUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setError(`Error al guardar: ${res.status} ${res.statusText}`);
      return;
    }

    const updated: ApiUser = await res.json();
    setCurrentUser((prev) => ({
      ...prev,
      ...updated,
      address: { ...prev.address, ...updated.address },
      company: { ...prev.company, ...updated.company },
    }));
    setIsEditing(false);
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Empleado #{currentUser.id}
        </h1>

        {!isEditing && (
          <Button
            variant="ghost"
            leftIcon={<Pencil size={16} />}
            onClick={() => setIsEditing(true)}
          >
            Editar
          </Button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {isEditing ? (
        <EmployeeForm
          user={currentUser}
          onCancel={() => setIsEditing(false)}
          onSave={handleSave}
        />
      ) : (
        <EmployeeDetail user={currentUser} />
      )}
    </section>
  );
}
