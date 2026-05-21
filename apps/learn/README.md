# @topiadesk/learn

Certification and training platform at learn.topiadesk.com

Next.js (App Router) application. Default dev port **3105**.

## Develop

```bash
pnpm --filter @topiadesk/learn dev      # dev server on port 3105
pnpm --filter @topiadesk/learn build    # production build
pnpm --filter @topiadesk/learn start    # serve the production build
```

Shared UI comes from `@topiadesk/ui`; API access from `@topiadesk/api-client`.
