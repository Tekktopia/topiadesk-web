# @topiadesk/device-sync

Asset-register reconciliation service. Receives webhooks from Entra ID, Google
Workspace, Intune, Jamf and Kandji, diffs the detected device against
Topiadesk's asset register, and writes pending-decision entries into the
device-sync inbox (`/assets/sync` in the agent workspace).

## Endpoints

| Route | Auth | Provider |
|---|---|---|
| `POST /webhooks/graph`  | Graph `clientState` validated against connection store | Entra ID + Intune |
| `POST /webhooks/google` | Google-signed Pub/Sub push JWT                          | Google Workspace |
| `POST /webhooks/jamf`   | `HMAC-SHA256(secret, body)` in `Jamf-Webhook-Signature` | Jamf Pro |
| `POST /webhooks/kandji` | Static bearer in `Authorization`                        | Kandji |
| `GET /healthz`          | —                                                       | Liveness |
| `GET /readyz`           | —                                                       | Readiness (queue depth) |

## Workers

- **Reconciler** — consumes the in-memory queue (swap for BullMQ / SQS in production); diffs device fingerprint against the user's current asset; applies the connection's policy (`require-approval` → inbox entry / `auto-approve` → asset update / `ignore` → audit-only). Every branch writes an audit-log entry.
- **Subscription renewer** — runs every `RENEW_INTERVAL_SECONDS` (default 6h). Renews any Graph subscription within 24h of expiry.
- **Polling fallback** — runs every `POLL_INTERVAL_SECONDS` (default 10min). Pulls list-devices from every connected provider as a safety net if a webhook was missed.

## Local dev

```bash
cd services/device-sync
cp .env.example .env
# fill in ENTRA_CLIENT_ID etc (see runbook in repo root)
pnpm install
pnpm dev
```

Service listens on `$PORT` (default 4040). In dev, the persistence adapters
are in-memory — restart wipes state. Production should swap
`src/persistence.ts` adapters for the Topiadesk core API + Postgres.

## Wiring to production

| In-mem dev adapter | Production swap |
|---|---|
| `createInMemoryQueue<RawSignal>()` in `queue.ts` | BullMQ on Redis |
| `inMemAssets` in `persistence.ts` | HTTP calls against `TOPIADESK_API_URL` |
| `inMemConnections` | Postgres `device_sync_connections` |
| `auditLog.write` | HTTP POST to `/api/audit-log` |
| `inbox.createPendingEntry` | HTTP POST to `/api/inbox/device-sync` |

## Test

```bash
pnpm test
```

## Signature verification — gotchas

- **Graph** — Microsoft sends a `validationToken` query param when you create
  the subscription; we must echo it as `text/plain` within 10 seconds or the
  subscription is refused. Same handler does both the handshake and the
  normal `value[]` notifications.
- **Jamf** — verify against the *raw* body bytes, not the parsed JSON.
  `@fastify/raw-body` is registered per-route for `/webhooks/jamf` precisely
  so this works without breaking JSON parsing.
- **Kandji** — bearer token compare must be constant-time. Use
  `crypto.timingSafeEqual`, not `===`.
- **Google Pub/Sub** — the push handler must validate the JWT's audience
  against the URL Google was configured to push to, otherwise an attacker
  with any Google account can forge events.
