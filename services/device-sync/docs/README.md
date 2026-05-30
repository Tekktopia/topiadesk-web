# Device-sync setup runbooks

Two runbooks for the human-only steps that unblock everything in
`services/device-sync`. Do them once per Topiadesk environment
(prod / staging / local). Customer admins do their own ~3-click
consent flow afterwards — no work per tenant.

| Runbook | Time | Output env vars |
|---|---|---|
| [Microsoft Entra ID multi-tenant app](./azure-app-registration.md) | ~10 min | `ENTRA_CLIENT_ID`, `ENTRA_CLIENT_SECRET`, `ENTRA_WEBHOOK_CLIENT_STATE` |
| [Google Cloud project + service account](./google-cloud-setup.md) | ~15 min | `GOOGLE_SERVICE_ACCOUNT_KEY`, `GOOGLE_PUBSUB_TOPIC`, `GOOGLE_PUBSUB_AUDIENCE` |

Order doesn't matter — they're independent. Each one ends with a smoke
test you can run against the local `pnpm dev` server.

When both are done, drop the values into `services/device-sync/.env`,
restart, and the webhook receivers / pollers light up automatically.
