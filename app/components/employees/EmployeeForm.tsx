"use client";

import { useState } from "react";
import type { ApiUser, UpdateUserPayload } from "@/app/employees/types";

type EmployeeFormProps = {
  user: ApiUser;
  onCancel: () => void;
  onSave: (payload: UpdateUserPayload) => Promise<void> | void;
};

function toPayload(user: ApiUser): UpdateUserPayload {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    username: user.username,
    address: {
      address: user.address.address,
      city: user.address.city,
      state: user.address.state,
      postalCode: user.address.postalCode,
      country: user.address.country,
    },
    company: {
      name: user.company.name,
      department: user.company.department,
      title: user.company.title,
    },
  };
}

export default function EmployeeForm({
  user,
  onCancel,
  onSave,
}: EmployeeFormProps) {
  const initial = toPayload(user);

  const [form, setForm] = useState<UpdateUserPayload>(initial);

  const [isSaving, setIsSaving] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          setIsSaving(true);
          await onSave(form);
        } finally {
          setIsSaving(false);
        }
      }}
      className="space-y-4"
    >
      <section className="border rounded p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Información del empleado</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-1">
            <span className="text-sm text-gray-600">Nombre</span>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              disabled={isSaving}
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm text-gray-600">Apellido</span>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              disabled={isSaving}
            />
          </label>

          <label className="space-y-1 md:col-span-2">
            <span className="text-sm text-gray-600">Email</span>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={isSaving}
            />
          </label>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 border rounded text-sm bg-red-500 text-white"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-3 py-2 border rounded text-sm bg-emerald-500 text-white"
            disabled={isSaving}
          >
            {isSaving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </section>
    </form>
  );
}
