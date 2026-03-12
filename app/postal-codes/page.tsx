import Link from "next/link";
import { Abril_Fatface, Source_Sans_3 } from "next/font/google";
import type { CSSProperties } from "react";
import {
  buildPostalCodesHref,
  parsePostalCodeFiltersFromSearchParams,
  queryPostalCodes,
} from "@/lib/postal-codes";

const titleFont = Abril_Fatface({
  variable: "--font-postal-title",
  weight: "400",
  subsets: ["latin"],
});

const bodyFont = Source_Sans_3({
  variable: "--font-postal-body",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

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

export default async function PostalCodesPage({
  searchParams,
}: PostalCodesPageProps) {
  const params = await searchParams;
  const asUrlSearchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "string") {
      asUrlSearchParams.set(key, value);
    }
  });

  const filters = parsePostalCodeFiltersFromSearchParams(asUrlSearchParams);
  const result = await queryPostalCodes(filters);

  const hasPrev = result.page > 1;
  const hasNext = result.page < result.totalPages;

  return (
    <main
      className={`${titleFont.variable} ${bodyFont.variable} max-w-7xl mx-auto px-4 py-10`}
      style={
        {
          "--pc-bg": "#fcf8ef",
          "--pc-card": "#fffdf8",
          "--pc-line": "#d9cdb4",
          "--pc-ink": "#1d1a16",
          "--pc-accent": "#0b5e3d",
          "--pc-accent-2": "#9f2d1f",
          "--pc-muted": "#6a6257",
        } as CSSProperties
      }
    >
      <section className="relative overflow-hidden rounded-2xl border border-[var(--pc-line)] bg-[var(--pc-bg)] p-6 md:p-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-20 -top-20 h-52 w-52 rounded-full bg-[var(--pc-accent)]/8 blur-2xl" />
          <div className="absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-[var(--pc-accent-2)]/10 blur-2xl" />
        </div>

        <div className="relative flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--pc-muted)]">
              Catalogo nacional
            </p>
            <h2
              className="text-4xl text-[var(--pc-ink)] md:text-5xl"
              style={{ fontFamily: "var(--font-postal-title)" }}
            >
              Codigos postales SEPOMEX
            </h2>
            <p
              className="text-sm text-[var(--pc-muted)] md:text-base"
              style={{ fontFamily: "var(--font-postal-body)" }}
            >
              Explora y filtra por ubicacion con resultados paginados.
            </p>
          </div>

          <div
            className="inline-flex w-fit items-baseline gap-2 rounded-xl border border-[var(--pc-line)] bg-[var(--pc-card)] px-4 py-3"
            style={{ fontFamily: "var(--font-postal-body)" }}
          >
            <span className="text-xs uppercase tracking-[0.15em] text-[var(--pc-muted)]">
              Total
            </span>
            <span className="text-xl font-bold text-[var(--pc-ink)]">
              {result.total.toLocaleString("es-MX")}
            </span>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--pc-line)] bg-[var(--pc-card)] p-4 md:p-6">
        <form method="get" action="/postal-codes" className="space-y-4">
          <input type="hidden" name="page" value="1" />
          <input type="hidden" name="limit" value={String(filters.limit)} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <label className="space-y-1">
              <span
                className="text-sm text-[var(--pc-muted)]"
                style={{ fontFamily: "var(--font-postal-body)" }}
              >
                Estado
              </span>
              <input
                name="estado"
                defaultValue={filters.estado}
                className="w-full rounded border border-[var(--pc-line)] bg-white px-3 py-2 text-[var(--pc-ink)] outline-none transition focus:border-[var(--pc-accent)]"
                placeholder="Ej. Jalisco"
              />
            </label>

            <label className="space-y-1">
              <span
                className="text-sm text-[var(--pc-muted)]"
                style={{ fontFamily: "var(--font-postal-body)" }}
              >
                Colonia
              </span>
              <input
                name="colonia"
                defaultValue={filters.colonia}
                className="w-full rounded border border-[var(--pc-line)] bg-white px-3 py-2 text-[var(--pc-ink)] outline-none transition focus:border-[var(--pc-accent)]"
                placeholder="Ej. Americana"
              />
            </label>

            <label className="space-y-1">
              <span
                className="text-sm text-[var(--pc-muted)]"
                style={{ fontFamily: "var(--font-postal-body)" }}
              >
                Ciudad
              </span>
              <input
                name="ciudad"
                defaultValue={filters.ciudad}
                className="w-full rounded border border-[var(--pc-line)] bg-white px-3 py-2 text-[var(--pc-ink)] outline-none transition focus:border-[var(--pc-accent)]"
                placeholder="Ej. Guadalajara"
              />
            </label>

            <label className="space-y-1">
              <span
                className="text-sm text-[var(--pc-muted)]"
                style={{ fontFamily: "var(--font-postal-body)" }}
              >
                Codigo postal
              </span>
              <input
                name="codigoPostal"
                defaultValue={filters.codigoPostal}
                className="w-full rounded border border-[var(--pc-line)] bg-white px-3 py-2 text-[var(--pc-ink)] outline-none transition focus:border-[var(--pc-accent)]"
                placeholder="Ej. 44160"
                inputMode="numeric"
                maxLength={5}
              />
            </label>

            <label className="space-y-1">
              <span
                className="text-sm text-[var(--pc-muted)]"
                style={{ fontFamily: "var(--font-postal-body)" }}
              >
                Nombre
              </span>
              <input
                name="nombre"
                defaultValue={filters.nombre}
                className="w-full rounded border border-[var(--pc-line)] bg-white px-3 py-2 text-[var(--pc-ink)] outline-none transition focus:border-[var(--pc-accent)]"
                placeholder="Colonia o ciudad"
              />
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded bg-[var(--pc-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95"
              style={{ fontFamily: "var(--font-postal-body)" }}
            >
              Filtrar
            </button>
            <Link
              href="/postal-codes"
              className="rounded border border-[var(--pc-line)] px-4 py-2 text-sm text-[var(--pc-ink)] transition hover:bg-[var(--pc-bg)]"
              style={{ fontFamily: "var(--font-postal-body)" }}
            >
              Limpiar filtros
            </Link>
          </div>
        </form>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-[var(--pc-line)] bg-[var(--pc-card)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[var(--pc-bg)]">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-[var(--pc-ink)]">
                  Codigo postal
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--pc-ink)]">
                  Colonia
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--pc-ink)]">
                  Estado
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--pc-ink)]">
                  Municipio
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--pc-ink)]">
                  Ciudad
                </th>
              </tr>
            </thead>
            <tbody>
              {result.items.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-[var(--pc-muted)]"
                    style={{ fontFamily: "var(--font-postal-body)" }}
                  >
                    No se encontraron codigos postales con esos filtros.
                  </td>
                </tr>
              ) : (
                result.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-[var(--pc-line)] odd:bg-white even:bg-[var(--pc-bg)]/45"
                    style={{ fontFamily: "var(--font-postal-body)" }}
                  >
                    <td className="px-4 py-3 font-semibold text-[var(--pc-accent)]">
                      {item.codigoPostal}
                    </td>
                    <td className="px-4 py-3 text-[var(--pc-ink)]">{item.colonia}</td>
                    <td className="px-4 py-3 text-[var(--pc-ink)]">{item.estado}</td>
                    <td className="px-4 py-3 text-[var(--pc-ink)]">{item.municipio}</td>
                    <td className="px-4 py-3 text-[var(--pc-ink)]">{item.ciudad}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section
        className="mt-6 flex items-center gap-3"
        style={{ fontFamily: "var(--font-postal-body)" }}
      >
        {hasPrev ? (
          <Link
            href={buildPostalCodesHref(filters, result.page - 1)}
            className="inline-flex items-center gap-1 rounded border border-[var(--pc-line)] bg-[var(--pc-card)] px-3 py-2 text-sm text-[var(--pc-ink)] transition hover:bg-[var(--pc-bg)]"
          >
            Anterior
          </Link>
        ) : (
          <span className="inline-flex cursor-not-allowed items-center gap-1 rounded border border-[var(--pc-line)] px-3 py-2 text-sm text-[var(--pc-muted)]/60">
            Anterior
          </span>
        )}

        <span className="text-sm text-[var(--pc-muted)]">
          Pagina {result.page} de {result.totalPages}
        </span>

        {hasNext ? (
          <Link
            href={buildPostalCodesHref(filters, result.page + 1)}
            className="inline-flex items-center gap-1 rounded border border-[var(--pc-line)] bg-[var(--pc-card)] px-3 py-2 text-sm text-[var(--pc-ink)] transition hover:bg-[var(--pc-bg)]"
          >
            Siguiente
          </Link>
        ) : (
          <span className="inline-flex cursor-not-allowed items-center gap-1 rounded border border-[var(--pc-line)] px-3 py-2 text-sm text-[var(--pc-muted)]/60">
            Siguiente
          </span>
        )}
      </section>
    </main>
  );
}
