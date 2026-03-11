# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
```

There is no test runner configured.

## Architecture

This is a **Next.js App Router** application that displays employee data from the [dummyjson.com](https://dummyjson.com) mock API.

### Server vs Client Components

All data fetching happens server-side in page components. The split is:
- **Server components**: pages (`app/**/page.tsx`), `EmployeeDetail.tsx`
- **Client components** (`"use client"`): `EmployeeDetailPanel.tsx`, `EmployeeForm.tsx`, `Button.tsx`

The pattern for interactive pages is: a server page fetches data and passes it to a client wrapper (e.g., `EmployeeDetailPanel`) that manages local state for edit mode, which in turn renders either the display (`EmployeeDetail`) or edit (`EmployeeForm`) component.

### Data Fetching

`lib/api.ts` exports a generic `fetchJson<T>(url, options?)` utility used in server components. The API base is hardcoded to `https://dummyjson.com`.

### Key Types

Defined in `app/employees/types.ts`:
- `ApiUser` — full user object from the API
- `UpdateUserPayload` — editable subset of fields
- `PaginatedResponse<T>` — generic paginated API response

### Routing

- `/` — Home page
- `/employees` — Paginated list (supports `?page=N`)
- `/employees/[id]` — Employee detail with inline edit form

### Styling

Tailwind CSS v4 via PostCSS. Custom CSS variables in `app/globals.css`. Dark mode via `prefers-color-scheme`.

### Path Alias

`@/*` resolves to the project root (e.g., `import { fetchJson } from "@/lib/api"`).
