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

  const hasActiveFilters = !!(
    filters.estado ||
    filters.colonia ||
    filters.ciudad ||
    filters.codigoPostal ||
    filters.nombre
  );

  return (
    <main
      className={`${titleFont.variable} ${bodyFont.variable}`}
      style={
        {
          "--pc-bg": "#faf6ec",
          "--pc-card": "#fffef9",
          "--pc-line": "#ddd0b0",
          "--pc-line-light": "#ede5cc",
          "--pc-ink": "#1a1714",
          "--pc-accent": "#0b5e3d",
          "--pc-accent-hover": "#094d33",
          "--pc-accent-2": "#8c2418",
          "--pc-muted": "#6b5e4e",
          "--pc-muted-light": "#9e9080",
          "--pc-stamp": "#f0ebe0",
          minHeight: "100vh",
          backgroundColor: "var(--pc-bg)",
          fontFamily: "var(--font-postal-body)",
        } as CSSProperties
      }
    >
      <style>{`
        .pc-input {
          width: 100%;
          background: var(--pc-card);
          border: 1.5px solid var(--pc-line);
          border-radius: 6px;
          padding: 9px 12px;
          color: var(--pc-ink);
          font-family: var(--font-postal-body);
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .pc-input:focus {
          border-color: var(--pc-accent);
          box-shadow: 0 0 0 3px rgba(11, 94, 61, 0.1);
        }
        .pc-input::placeholder {
          color: var(--pc-muted-light);
        }
        .pc-row {
          transition: background-color 0.1s;
        }
        .pc-row:hover {
          background-color: rgba(11, 94, 61, 0.04) !important;
        }
        .pc-row:hover .pc-badge {
          background-color: var(--pc-accent);
          color: white;
        }
        .pc-badge {
          display: inline-block;
          font-family: 'Courier New', monospace;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          padding: 2px 8px;
          border-radius: 4px;
          background-color: var(--pc-stamp);
          color: var(--pc-accent);
          border: 1px solid var(--pc-line);
          transition: background-color 0.15s, color 0.15s;
        }
        .pc-page-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          font-family: var(--font-postal-body);
          transition: all 0.15s;
          border: 1.5px solid var(--pc-line);
          background: var(--pc-card);
          color: var(--pc-ink);
          text-decoration: none;
        }
        .pc-page-btn:hover {
          border-color: var(--pc-accent);
          color: var(--pc-accent);
          background: var(--pc-stamp);
        }
        .pc-page-btn-disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .pc-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, var(--pc-line), transparent);
        }
        .pc-submit-btn {
          padding: 9px 22px;
          border-radius: 7px;
          background: var(--pc-accent);
          color: white;
          font-size: 0.85rem;
          font-weight: 700;
          font-family: var(--font-postal-body);
          border: none;
          cursor: pointer;
          letter-spacing: 0.03em;
          transition: background 0.15s;
        }
        .pc-submit-btn:hover {
          background: var(--pc-accent-hover);
        }
      `}</style>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px 60px" }}>

        {/* ── Header ── */}
        <header style={{ marginBottom: "32px" }}>
          <p style={{
            fontSize: "0.7rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--pc-muted-light)",
            marginBottom: "10px",
          }}>
            Catálogo Nacional · SEPOMEX
          </p>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
            <h1
              style={{
                fontFamily: "var(--font-postal-title)",
                fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
                color: "var(--pc-ink)",
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              Códigos Postales
            </h1>

            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "2px",
              padding: "12px 20px",
              borderRadius: "10px",
              border: "1.5px solid var(--pc-line)",
              background: "var(--pc-card)",
              flexShrink: 0,
            }}>
              <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--pc-muted-light)" }}>
                Total registros
              </span>
              <span style={{
                fontFamily: "var(--font-postal-title)",
                fontSize: "1.9rem",
                color: "var(--pc-accent)",
                lineHeight: 1,
              }}>
                {result.total.toLocaleString("es-MX")}
              </span>
            </div>
          </div>

          <div className="pc-divider" style={{ marginTop: "20px" }} />
        </header>

        {/* ── Filters ── */}
        <section
          style={{
            background: "var(--pc-card)",
            border: "1.5px solid var(--pc-line)",
            borderRadius: "14px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <form method="get" action="/postal-codes">
            <input type="hidden" name="page" value="1" />
            <input type="hidden" name="limit" value={String(filters.limit)} />

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "12px",
              marginBottom: "16px",
            }}>
              {[
                { name: "estado", label: "Estado", placeholder: "Ej. Jalisco", value: filters.estado },
                { name: "colonia", label: "Colonia", placeholder: "Ej. Americana", value: filters.colonia },
                { name: "ciudad", label: "Ciudad", placeholder: "Ej. Guadalajara", value: filters.ciudad },
                { name: "codigoPostal", label: "Código postal", placeholder: "Ej. 44160", value: filters.codigoPostal, inputMode: "numeric" as const, maxLength: 5 },
                { name: "nombre", label: "Nombre", placeholder: "Colonia o ciudad", value: filters.nombre },
              ].map((field) => (
                <label key={field.name} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <span style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pc-muted)", fontWeight: 600 }}>
                    {field.label}
                  </span>
                  <input
                    name={field.name}
                    defaultValue={field.value}
                    placeholder={field.placeholder}
                    inputMode={field.inputMode}
                    maxLength={field.maxLength}
                    className="pc-input"
                  />
                </label>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                type="submit"
                className="pc-submit-btn"
              >
                Buscar
              </button>

              {hasActiveFilters && (
                <Link
                  href="/postal-codes"
                  style={{
                    padding: "9px 18px",
                    borderRadius: "7px",
                    border: "1.5px solid var(--pc-line)",
                    color: "var(--pc-muted)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    fontFamily: "var(--font-postal-body)",
                    textDecoration: "none",
                    transition: "border-color 0.15s, color 0.15s",
                  }}
                >
                  Limpiar filtros
                </Link>
              )}
            </div>
          </form>
        </section>

        {/* ── Table ── */}
        <section
          style={{
            background: "var(--pc-card)",
            border: "1.5px solid var(--pc-line)",
            borderRadius: "14px",
            overflow: "hidden",
            marginBottom: "20px",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ minWidth: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "var(--pc-bg)" }}>
                  {["Código postal", "Colonia", "Estado", "Municipio", "Ciudad"].map((col) => (
                    <th
                      key={col}
                      style={{
                        padding: "13px 18px",
                        textAlign: "left",
                        fontSize: "0.7rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "var(--pc-muted)",
                        fontWeight: 700,
                        fontFamily: "var(--font-postal-body)",
                        borderBottom: "1.5px solid var(--pc-line)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: "48px 18px",
                        textAlign: "center",
                        color: "var(--pc-muted-light)",
                        fontFamily: "var(--font-postal-body)",
                      }}
                    >
                      No se encontraron códigos postales con esos filtros.
                    </td>
                  </tr>
                ) : (
                  result.items.map((item, i) => (
                    <tr
                      key={item.id}
                      className="pc-row"
                      style={{
                        borderTop: i === 0 ? "none" : "1px solid var(--pc-line-light)",
                        background: i % 2 === 0 ? "var(--pc-card)" : "rgba(250,246,236,0.5)",
                        fontFamily: "var(--font-postal-body)",
                      }}
                    >
                      <td style={{ padding: "11px 18px" }}>
                        <span className="pc-badge">{item.codigoPostal}</span>
                      </td>
                      <td style={{ padding: "11px 18px", color: "var(--pc-ink)", fontWeight: 600 }}>
                        {item.colonia}
                      </td>
                      <td style={{ padding: "11px 18px", color: "var(--pc-muted)" }}>
                        {item.estado}
                      </td>
                      <td style={{ padding: "11px 18px", color: "var(--pc-muted)" }}>
                        {item.municipio}
                      </td>
                      <td style={{ padding: "11px 18px", color: "var(--pc-muted)" }}>
                        {item.ciudad}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Pagination ── */}
        {result.totalPages > 1 && (
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              fontFamily: "var(--font-postal-body)",
            }}
          >
            {hasPrev ? (
              <Link
                href={buildPostalCodesHref(filters, result.page - 1)}
                className="pc-page-btn"
              >
                ← Anterior
              </Link>
            ) : (
              <span className="pc-page-btn pc-page-btn-disabled">← Anterior</span>
            )}

            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1px",
              padding: "6px 16px",
              borderRadius: "8px",
              background: "var(--pc-stamp)",
              border: "1.5px solid var(--pc-line)",
            }}>
              <span style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--pc-muted-light)" }}>
                Página
              </span>
              <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--pc-ink)" }}>
                {result.page} <span style={{ color: "var(--pc-muted-light)", fontWeight: 400 }}>/ {result.totalPages}</span>
              </span>
            </div>

            {hasNext ? (
              <Link
                href={buildPostalCodesHref(filters, result.page + 1)}
                className="pc-page-btn"
              >
                Siguiente →
              </Link>
            ) : (
              <span className="pc-page-btn pc-page-btn-disabled">Siguiente →</span>
            )}
          </nav>
        )}
      </div>
    </main>
  );
}
