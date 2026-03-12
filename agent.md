# Agent Guide - mvno-expenses

## Project Context
- Framework: Next.js (App Router) + TypeScript + TailwindCSS.
- Main domain: employee listing, pagination, employee detail and edit flow.
- Data source (current): `https://dummyjson.com/users`.

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
