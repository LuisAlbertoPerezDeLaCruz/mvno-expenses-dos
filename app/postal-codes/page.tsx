import Link from "next/link";
import { queryPostalCodes } from "@/lib/postal-codes";

type PostalCodesPageProps = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    estado?: string;
    colonia?: string;
    ciudad?: string;
    codigoPostal?: string;
    nombre?: string;
  }>;
};

function parsePositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export default async function PostalCodesPage({
  searchParams,
}: PostalCodesPageProps) {
  const params = await searchParams;
  const currentPage = parsePositiveInt(params.page, 1);
  const limit = Math.min(100, parsePositiveInt(params.limit, 20));

  const estado = params.estado?.trim() ?? "";
  const colonia = params.colonia?.trim() ?? "";
  const ciudad = params.ciudad?.trim() ?? "";
  const codigoPostal = params.codigoPostal?.trim() ?? "";
  const nombre = params.nombre?.trim() ?? "";

  const result = await queryPostalCodes({
    page: currentPage,
    limit,
    estado,
    colonia,
    ciudad,
    codigoPostal,
    nombre,
  });

  const hasPrev = result.page > 1;
  const hasNext = result.page < result.totalPages;

  function createHref(page: number) {
    const nextParams = new URLSearchParams();
    nextParams.set("page", String(page));
    nextParams.set("limit", String(limit));
    if (estado) nextParams.set("estado", estado);
    if (colonia) nextParams.set("colonia", colonia);
    if (ciudad) nextParams.set("ciudad", ciudad);
    if (codigoPostal) nextParams.set("codigoPostal", codigoPostal);
    if (nombre) nextParams.set("nombre", nombre);
    return `/postal-codes?${nextParams.toString()}`;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <section className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Codigos postales (SEPOMEX)
        </h2>
        <p className="text-sm text-gray-600">
          Total de resultados: {result.total.toLocaleString("es-MX")}
        </p>
      </section>

      <section className="border rounded p-4">
        <form method="get" action="/postal-codes" className="space-y-4">
          <input type="hidden" name="page" value="1" />
          <input type="hidden" name="limit" value={String(limit)} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <label className="space-y-1">
              <span className="text-sm text-gray-600">Estado</span>
              <input
                name="estado"
                defaultValue={estado}
                className="w-full border rounded px-3 py-2"
                placeholder="Ej. Jalisco"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm text-gray-600">Colonia</span>
              <input
                name="colonia"
                defaultValue={colonia}
                className="w-full border rounded px-3 py-2"
                placeholder="Ej. Americana"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm text-gray-600">Ciudad</span>
              <input
                name="ciudad"
                defaultValue={ciudad}
                className="w-full border rounded px-3 py-2"
                placeholder="Ej. Guadalajara"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm text-gray-600">Codigo postal</span>
              <input
                name="codigoPostal"
                defaultValue={codigoPostal}
                className="w-full border rounded px-3 py-2"
                placeholder="Ej. 44160"
                inputMode="numeric"
                maxLength={5}
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm text-gray-600">Nombre</span>
              <input
                name="nombre"
                defaultValue={nombre}
                className="w-full border rounded px-3 py-2"
                placeholder="Colonia o ciudad"
              />
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              Filtrar
            </button>
            <Link
              href="/postal-codes"
              className="px-4 py-2 rounded border text-sm hover:bg-gray-50"
            >
              Limpiar filtros
            </Link>
          </div>
        </form>
      </section>

      <section className="border rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Codigo postal
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Colonia
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Estado
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Municipio
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Ciudad
                </th>
              </tr>
            </thead>
            <tbody>
              {result.items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    No se encontraron codigos postales con esos filtros.
                  </td>
                </tr>
              ) : (
                result.items.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-3">{item.codigoPostal}</td>
                    <td className="px-4 py-3">{item.colonia}</td>
                    <td className="px-4 py-3">{item.estado}</td>
                    <td className="px-4 py-3">{item.municipio}</td>
                    <td className="px-4 py-3">{item.ciudad}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex items-center gap-3">
        {hasPrev ? (
          <Link
            href={createHref(result.page - 1)}
            className="inline-flex items-center gap-1 px-3 py-2 border rounded text-sm"
          >
            Anterior
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-2 border rounded text-sm text-gray-400 cursor-not-allowed">
            Anterior
          </span>
        )}

        <span className="text-sm text-gray-700">
          Pagina {result.page} de {result.totalPages}
        </span>

        {hasNext ? (
          <Link
            href={createHref(result.page + 1)}
            className="inline-flex items-center gap-1 px-3 py-2 border rounded text-sm"
          >
            Siguiente
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-2 border rounded text-sm text-gray-400 cursor-not-allowed">
            Siguiente
          </span>
        )}
      </section>
    </main>
  );
}
