import { Pool } from "pg";

declare global {
  var __postgresPool: Pool | undefined;
}

function createPool() {
  if (process.env.DATABASE_URL) {
    return new Pool({ connectionString: process.env.DATABASE_URL });
  }

  return new Pool({
    host: process.env.PGHOST ?? "127.0.0.1",
    port: Number(process.env.PGPORT ?? 5432),
    user: process.env.PGUSER ?? process.env.USER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE ?? "racksenvios",
  });
}

export const postgresPool = globalThis.__postgresPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalThis.__postgresPool = postgresPool;
}
