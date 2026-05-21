# topiadesk-web

Frontend monorepo for the **Topiadesk** platform — every web surface plus
the shared design system. Built with Next.js (App Router) per PRD Section 24.1.

> Proprietary and confidential — Tekktopia. See `LICENSE`.

## Applications (`apps/`)

| App | Port | Surface |
|-----|------|---------|
| `agent-workspace` | 3100 | The agent's day-to-day helpdesk workspace |
| `customer-portal` | 3101 | End-user self-service portal & knowledge base |
| `tenant-admin` | 3102 | Per-tenant administration portal |
| `super-admin` | 3103 | Topiadesk-internal Super-Admin portal |
| `marketing-site` | 3104 | Public marketing site (topiadesk.com) |
| `learn` | 3105 | Certification & training (learn.topiadesk.com) |
| `credentials` | 3106 | Public credential verification |

## Shared packages (`packages/`)

| Package | Purpose |
|---------|---------|
| `@topiadesk/ui` | Shared React component library (Tailwind + shadcn-style) |
| `@topiadesk/design-tokens` | Colour, spacing, and typography tokens |
| `@topiadesk/api-client` | Typed client for the Topiadesk REST API |
| `@topiadesk/eslint-config` | Shared ESLint flat config |
| `@topiadesk/tsconfig` | Shared TypeScript configurations |

The `ui`, `design-tokens`, and `api-client` packages ship source and are
compiled by each app via Next.js `transpilePackages` — no separate build.

## Tech stack (PRD Section 24.1)

Next.js · React · TypeScript (strict) · Tailwind CSS · shadcn-style UI ·
TanStack Query · Zustand · React Hook Form + Zod · Recharts / ECharts ·
Socket.IO · Vitest + Playwright.

## Getting started

Requires Node.js 20+ (see `.nvmrc`) and pnpm 9.

```bash
pnpm install
pnpm dev         # run every app in dev mode
pnpm build       # production build of every app
pnpm lint        # lint all apps and packages
pnpm typecheck   # type-check all apps and packages
```

Run a single app: `pnpm --filter @topiadesk/agent-workspace dev`.

## Related repositories

`topiadesk` (backend) · `topiadesk-mobile` · `topiadesk-docs` · `topiadesk-ops`
