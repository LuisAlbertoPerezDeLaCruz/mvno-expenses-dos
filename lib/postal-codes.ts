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

export type NormalizedPostalCodeFilters = {
  page: number;
  limit: number;
  estado: string;
  colonia: string;
  ciudad: string;
  codigoPostal: string;
  nombre: string;
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

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MIN_LIMIT = 1;
const MAX_LIMIT = 100;
const MAX_TEXT_LENGTH = 128;
const POSTAL_CODE_LENGTH = 5;

function normalizeText(value: string | undefined, maxLength = MAX_TEXT_LENGTH) {
  return value?.trim().slice(0, maxLength) ?? "";
}

function normalizeCodigoPostal(value: string | undefined) {
  return (value ?? "").replace(/\D/g, "").slice(0, POSTAL_CODE_LENGTH);
}

function parsePositiveInt(
  value: string | undefined,
  fallback: number,
  { min, max }: { min?: number; max?: number } = {},
) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  if (typeof min === "number" && parsed < min) {
    return min;
  }

  if (typeof max === "number" && parsed > max) {
    return max;
  }

  return parsed;
}

export function normalizePostalCodeFilters(
  filters: PostalCodeFilters,
): NormalizedPostalCodeFilters {
  return {
    page: Math.max(DEFAULT_PAGE, Math.trunc(filters.page ?? DEFAULT_PAGE)),
    limit: Math.min(
      MAX_LIMIT,
      Math.max(MIN_LIMIT, Math.trunc(filters.limit ?? DEFAULT_LIMIT)),
    ),
    estado: normalizeText(filters.estado),
    colonia: normalizeText(filters.colonia),
    ciudad: normalizeText(filters.ciudad),
    codigoPostal: normalizeCodigoPostal(filters.codigoPostal),
    nombre: normalizeText(filters.nombre),
  };
}

export function parsePostalCodeFiltersFromSearchParams(
  searchParams: URLSearchParams,
): NormalizedPostalCodeFilters {
  return normalizePostalCodeFilters({
    page: parsePositiveInt(searchParams.get("page") ?? undefined, DEFAULT_PAGE),
    limit: parsePositiveInt(searchParams.get("limit") ?? undefined, DEFAULT_LIMIT, {
      min: MIN_LIMIT,
      max: MAX_LIMIT,
    }),
    estado: searchParams.get("estado") ?? undefined,
    colonia: searchParams.get("colonia") ?? undefined,
    ciudad: searchParams.get("ciudad") ?? undefined,
    codigoPostal: searchParams.get("codigoPostal") ?? undefined,
    nombre: searchParams.get("nombre") ?? undefined,
  });
}

export function buildPostalCodesHref(
  filters: NormalizedPostalCodeFilters,
  page: number,
) {
  const query = new URLSearchParams();
  query.set("page", String(Math.max(DEFAULT_PAGE, Math.trunc(page))));
  query.set("limit", String(filters.limit));

  if (filters.estado) query.set("estado", filters.estado);
  if (filters.colonia) query.set("colonia", filters.colonia);
  if (filters.ciudad) query.set("ciudad", filters.ciudad);
  if (filters.codigoPostal) query.set("codigoPostal", filters.codigoPostal);
  if (filters.nombre) query.set("nombre", filters.nombre);

  return `/postal-codes?${query.toString()}`;
}

export async function queryPostalCodes(
  filters: PostalCodeFilters,
): Promise<PostalCodeQueryResult> {
  const normalized = normalizePostalCodeFilters(filters);
  const { page, limit, estado, colonia, ciudad, codigoPostal, nombre } =
    normalized;
  const offset = (page - 1) * limit;

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
