# @topiadesk/customer-portal

End-user self-service portal and knowledge base

Next.js (App Router) application. Default dev port **3101**.

## Develop

```bash
pnpm --filter @topiadesk/customer-portal dev      # dev server on port 3101
pnpm --filter @topiadesk/customer-portal build    # production build
pnpm --filter @topiadesk/customer-portal start    # serve the production build
```

Shared UI comes from `@topiadesk/ui`; API access from `@topiadesk/api-client`.
