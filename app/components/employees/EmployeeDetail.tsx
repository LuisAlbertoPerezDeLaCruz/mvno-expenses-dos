import type { ApiUser } from "@/app/employees/types";

type EmployeeDetailProps = {
  user: ApiUser;
};

export default function EmployeeDetail({ user }: EmployeeDetailProps) {
  return (
    <section className="border rounded p-4 space-y-4">
      <h2 className="text-lg font-semibold">Detalle del empleado</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Info label="Nombre" value={`${user.firstName} ${user.lastName}`} />
        <Info label="Username" value={user.username} />
        <Info label="Email" value={user.email} />
        <Info label="Teléfono" value={user.phone} />
        <Info label="Edad" value={String(user.age)} />
        <Info label="Género" value={user.gender} />
        <Info label="Fecha de nacimiento" value={user.birthDate} />
        <Info label="Grupo sanguíneo" value={user.bloodGroup} />
      </div>

      <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Info
          label="Dirección"
          value={`${user.address.address}, ${user.address.city}, ${user.address.state}, ${user.address.country}`}
        />
        <Info
          label="Empresa"
          value={`${user.company.name} - ${user.company.department} (${user.company.title})`}
        />
        <Info label="Universidad" value={user.university} />
        <Info label="Rol" value={user.role} />
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  );
}
