# @topiadesk/agent-workspace

The agent day-to-day helpdesk workspace

Next.js (App Router) application. Default dev port **3100**.

## Develop

```bash
pnpm --filter @topiadesk/agent-workspace dev      # dev server on port 3100
pnpm --filter @topiadesk/agent-workspace build    # production build
pnpm --filter @topiadesk/agent-workspace start    # serve the production build
```

Shared UI comes from `@topiadesk/ui`; API access from `@topiadesk/api-client`.
