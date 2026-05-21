# @topiadesk/tenant-admin

Per-tenant administration portal

Next.js (App Router) application. Default dev port **3102**.

## Develop

```bash
pnpm --filter @topiadesk/tenant-admin dev      # dev server on port 3102
pnpm --filter @topiadesk/tenant-admin build    # production build
pnpm --filter @topiadesk/tenant-admin start    # serve the production build
```

Shared UI comes from `@topiadesk/ui`; API access from `@topiadesk/api-client`.
