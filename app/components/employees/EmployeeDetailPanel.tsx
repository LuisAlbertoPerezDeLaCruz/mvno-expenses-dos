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

  async function handleSave(payload: UpdateUserPayload) {
    // aquí luego llamas update API
    // por ahora simulas éxito y actualizas UI local:
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setCurrentUser((prev) => ({
      ...prev,
      ...payload,
      address: { ...prev.address, ...payload.address },
      company: { ...prev.company, ...payload.company },
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
