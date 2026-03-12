import { postgresPool } from "@/lib/postgres";

export type PostalCodeItem = {
  id: number;
  codigoPostal: string;
  colonia: string;
  estado: string;
  municipio: string;
  ciudad: string;
};

export type PostalCodeFilters = {
  page?: number;
  limit?: number;
  estado?: string;
  colonia?: string;
  ciudad?: string;
  codigoPostal?: string;
  nombre?: string;
};

export type PostalCodeQueryResult = {
  items: PostalCodeItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type QueryRow = {
  id: string;
  codigo_postal: string;
  colonia: string;
  estado: string;
  municipio: string;
  ciudad: string;
};

function normalizeText(value: string | undefined, maxLength = 128) {
  return value?.trim().slice(0, maxLength) || "";
}

function normalizeCodigoPostal(value: string | undefined) {
  return (value ?? "").replace(/\D/g, "").slice(0, 5);
}

export async function queryPostalCodes(
  filters: PostalCodeFilters,
): Promise<PostalCodeQueryResult> {
  const page = Math.max(1, Math.trunc(filters.page ?? 1));
  const limit = Math.min(100, Math.max(1, Math.trunc(filters.limit ?? 20)));
  const offset = (page - 1) * limit;

  const estado = normalizeText(filters.estado);
  const colonia = normalizeText(filters.colonia);
  const ciudad = normalizeText(filters.ciudad);
  const nombre = normalizeText(filters.nombre);
  const codigoPostal = normalizeCodigoPostal(filters.codigoPostal);

  const clauses: string[] = [];
  const params: Array<string | number> = [];

  if (estado) {
    params.push(`%${estado}%`);
    clauses.push(`d_estado ILIKE $${params.length}`);
  }

  if (colonia) {
    params.push(`%${colonia}%`);
    clauses.push(`d_asenta ILIKE $${params.length}`);
  }

  if (ciudad) {
    params.push(`%${ciudad}%`);
    clauses.push(`d_ciudad ILIKE $${params.length}`);
  }

  if (codigoPostal) {
    params.push(`${codigoPostal}%`);
    clauses.push(`d_codigo LIKE $${params.length}`);
  }

  if (nombre) {
    params.push(`%${nombre}%`);
    const idx = params.length;
    params.push(`%${nombre}%`);
    clauses.push(`(d_asenta ILIKE $${idx} OR d_ciudad ILIKE $${idx + 1})`);
  }

  const whereSql = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";

  const totalResult = await postgresPool.query<{ count: string }>(
    `SELECT COUNT(*) AS count
     FROM public.postal_codes_sepomexpostalcode
     ${whereSql}`,
    params,
  );

  const total = Number(totalResult.rows[0]?.count ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const rowsResult = await postgresPool.query<QueryRow>(
    `SELECT
      id,
      d_codigo AS codigo_postal,
      d_asenta AS colonia,
      d_estado AS estado,
      "D_mnpio" AS municipio,
      d_ciudad AS ciudad
     FROM public.postal_codes_sepomexpostalcode
     ${whereSql}
     ORDER BY d_codigo ASC, d_estado ASC, d_asenta ASC
     LIMIT $${params.length + 1}
     OFFSET $${params.length + 2}`,
    [...params, limit, offset],
  );

  return {
    items: rowsResult.rows.map((row) => ({
      id: Number(row.id),
      codigoPostal: row.codigo_postal,
      colonia: row.colonia,
      estado: row.estado,
      municipio: row.municipio,
      ciudad: row.ciudad,
    })),
    total,
    page,
    limit,
    totalPages,
  };
}
