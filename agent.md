# Agent Guide - mvno-expenses

## Project Context
- Framework: Next.js (App Router) + TypeScript + TailwindCSS.
- Main domain: employee listing, pagination, employee detail and edit flow.
- Data source (current): `https://dummyjson.com/users`.

## Database Access (MCP Postgres)
- PostgreSQL access is available via MCP Postgres.
- Local CLI equivalent used in this workspace: `psql -d racksenvios`.
- Target database for postal codes: `racksenvios`.
- Verified table: `public.postal_codes_sepomexpostalcode` (156,423 rows).
- Main columns for UI filters:
  - `d_codigo` (codigo postal)
  - `d_asenta` (colonia)
  - `d_estado` (estado)
  - `"D_mnpio"` (municipio)
  - `d_ciudad` (ciudad)
- Existing relevant indexes:
  - `idx_sepomex_codigo` on `d_codigo`
  - `idx_sepomex_asenta` on `id_asenta_cpcons`
  - `uniq_sepomex_codigo_asenta_mnpio` unique on `(d_codigo, d_asenta, c_mnpio)`

### Useful SQL checks
- Validate table:
  - `\dt *postal_codes_sepomexpostalcode*`
- Describe structure:
  - `\d+ public.postal_codes_sepomexpostalcode`
- Count records:
  - `SELECT COUNT(*) FROM public.postal_codes_sepomexpostalcode;`
- Sample data:
  - `SELECT d_codigo, d_asenta, d_estado, "D_mnpio", d_ciudad FROM public.postal_codes_sepomexpostalcode LIMIT 5;`

## Current Structure
- `app/employees/page.tsx`: employees list with pagination.
- `app/employees/[id]/page.tsx`: employee detail page (server fetch).
- `app/employees/types.ts`: domain/API types.
- `app/components/employees/`: detail panel, form, and detail view components.
- `app/components/ui/Button.tsx`: reusable button component.
- `lib/api.ts`: generic typed `fetchJson<T>` helper.

## Coding Conventions
- Keep page-level data fetching in Server Components when possible.
- Keep interactive UI/state in Client Components (`"use client"`).
- Reuse UI primitives (`Button`) instead of repeating Tailwind classes.
- Prefer explicit typing (`ApiUser`, `ApiUsersResponse`, `UpdateUserPayload`).
- Handle loading/error states in forms and async actions.

## Pagination Rules
- URL is source of truth: `?page=`.
- Use `limit` + `skip` for API query.
- Validate incoming page values.

## Detail/Edit Rules
- Detail view and edit form should be separate components.
- Edit mode is controlled by a parent panel component.
- During save:
  - disable inputs/buttons
  - show loading text/state

## UI/UX Rules
- Buttons should have consistent variants and sizes.
- Icons can be used via `lucide-react`.
- For icon + text alignment, use `inline-flex items-center gap-*`.

## Quality Checklist
- Run lint before finishing:
  - `npm run lint`
- Verify manual flows:
  - list pagination
  - open detail
  - toggle edit
  - save/cancel behavior
