# Runbook: Microsoft Entra ID multi-tenant app registration

**Audience:** Topiadesk platform operator (you).
**One-time setup. ~10 minutes.**
**Output:** the three env vars that unblock `services/device-sync` for every Entra-ID / Intune customer.

---

## Why this is manual

Microsoft requires a human in a browser with consent rights on Topiadesk's
own Azure tenant. No API or SDK can register a multi-tenant app on your
behalf — that's deliberate, to stop someone from silently creating
phishing-grade impersonation apps.

Once these 13 steps are done, the rest is fully automated. Every customer's
admin clicks **one consent URL** and Topiadesk picks up Graph webhooks and
polling for them automatically.

---

## Prerequisites

- Sign-in to **portal.azure.com** with a Topiadesk corporate account that
  has the **Application Administrator** or **Global Administrator** role on
  the Topiadesk Azure tenant. (Personal Microsoft accounts won't work.)
- A password manager open — you'll generate one client secret you must save
  immediately (Azure only shows it once).
- A 32-byte random string ready for `ENTRA_WEBHOOK_CLIENT_STATE`:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

---

## Step 1 — Create the app registration

1. Go to **portal.azure.com → Microsoft Entra ID → App registrations → + New registration**.
2. Fill in:
   - **Name:** `Topiadesk Device Sync`
   - **Supported account types:** ✅ **Accounts in any organizational directory (Any Microsoft Entra ID tenant — Multitenant)**
   - **Redirect URI:** *(leave blank for now — we add the consent redirect in step 4)*
3. Click **Register**.

You'll land on the app's overview page. **Copy these two values into your
password manager** (you'll need them in step 9):

| Azure label | Goes into `.env` as |
|---|---|
| **Application (client) ID** | `ENTRA_CLIENT_ID` |
| **Directory (tenant) ID** *(Topiadesk's own — for reference only)* | not used at runtime |

---

## Step 2 — Configure API permissions

1. Left rail → **API permissions → + Add a permission → Microsoft Graph → Application permissions**.
2. Tick exactly these (search-as-you-type works):

   | Permission | What it lets us do |
   |---|---|
   | `User.Read.All` | List + read users (for primary-user lookups) |
   | `Device.Read.All` | List Entra-registered devices |
   | `DeviceManagementManagedDevices.Read.All` | Read Intune-managed devices |
   | `Directory.Read.All` | Resolve user → device relationships |
   | `AuditLog.Read.All` | Read sign-in activity |

3. Click **Add permissions**.
4. Click **✓ Grant admin consent for [Topiadesk]** at the top of the list.
   Every row should now show a green ✓ under *Status*.

> ⚠️ **Don't tick "Delegated permissions"** — Topiadesk's worker has no user
> session. Application permissions only.

---

## Step 3 — Create the client secret

1. Left rail → **Certificates & secrets → Client secrets → + New client secret**.
2. **Description:** `device-sync prod` · **Expires:** `24 months` (set a calendar reminder for 23 months).
3. Click **Add**.
4. **Copy the `Value` column immediately** into your password manager. It
   goes into `.env` as `ENTRA_CLIENT_SECRET`. Once you navigate away, Azure
   only shows the *Secret ID*, never the value again.

---

## Step 4 — Add the consent redirect URI

This is what customers' browsers hit after they click "Connect Entra ID"
in the Topiadesk tenant-admin portal.

1. Left rail → **Authentication → + Add a platform → Web**.
2. **Redirect URIs:** add both
   ```
   https://api.topiadesk.com/v1/integrations/entra/oauth-callback
   http://localhost:3000/api/integrations/entra/oauth-callback
   ```
   (Add `http://localhost...` so you can test locally without ngrok.)
3. **Front-channel logout URL:** *(leave blank)*
4. Tick **ID tokens (used for implicit and hybrid flows)**.
5. **Configure**.

---

## Step 5 — Publisher domain (required for multi-tenant consent)

Customers see "Topiadesk requests permissions" — but if the publisher domain
is unverified, Microsoft shows a yellow "unverified publisher" warning that
scares enterprises off.

1. Left rail → **Branding & properties**.
2. **Publisher domain → Configure** → pick `topiadesk.com` from the dropdown
   if it appears, or follow the *Verify a new domain* flow:
   - Microsoft generates a `microsoft-identity-association.json` file.
   - Host it at `https://topiadesk.com/.well-known/microsoft-identity-association.json`.
   - Click **Verify**.

This step is *not* blocking — webhooks work without it — but you'll want it
done before going to market.

---

## Step 6 — Construct the customer consent URL

This is the URL the tenant-admin UI links to from
*Integrations → Entra ID → Connect*:

```
https://login.microsoftonline.com/{tenant}/adminconsent
  ?client_id=ENTRA_CLIENT_ID
  &redirect_uri=https%3A%2F%2Fapi.topiadesk.com%2Fv1%2Fintegrations%2Fentra%2Foauth-callback
  &state={signed-jwt-with-topiadesk-tenant-id}
```

- `{tenant}` = literal `common` (lets customer pick which AAD tenant to consent in)
- `{state}` = JWT signed with the Topiadesk tenant id, so the callback knows which Topiadesk tenant just connected
- Microsoft redirects back with `?tenant={customer-aad-tenant-id}&admin_consent=True`
- The callback persists `customer-aad-tenant-id` into the `device_sync_connections.creds.aadTenantId` column

---

## Step 7 — Configure Graph subscription (webhook) endpoint

The service code already does this per-tenant in
`services/device-sync/src/providers/entra.ts` → `createSubscription()`. It
POSTs to `https://graph.microsoft.com/v1.0/subscriptions` with:

```json
{
  "changeType":        "updated,created,deleted",
  "notificationUrl":   "https://api.topiadesk.com/webhooks/graph",
  "resource":          "users  |  devices  |  deviceManagement/managedDevices",
  "expirationDateTime": "<now + 60h>",
  "clientState":       "<per-customer random — stored in connection.creds.webhookClientState>"
}
```

Two things you must do once for the whole platform:

1. **TLS:** `api.topiadesk.com` must be reachable over HTTPS with a valid
   public certificate. Microsoft refuses self-signed certs.
2. **Validation handshake:** Microsoft sends `?validationToken=…` to the
   webhook URL during subscription creation; the receiver must echo it as
   `text/plain` within **10 seconds**. The `server.ts` route already does
   this — just confirm your load balancer doesn't strip the query string.

---

## Step 8 — Confirm renewal cadence

Graph subscriptions for `users`, `devices`, and `managedDevices` have these
maximum lifetimes:

| Resource | Max TTL |
|---|---|
| `users` | 4 230 minutes (~70.5 h) |
| `devices` | 4 230 minutes |
| `deviceManagement/managedDevices` | 1 440 minutes (24 h) |

The cron in `cron.ts` renews at 24h-before-expiry. For `managedDevices`
that means renewal sweeps must run **at least every 6 hours**. Default
`RENEW_INTERVAL_SECONDS=21600` (6 h) is correct — don't lower it without
also raising headroom.

---

## Step 9 — Fill in `services/device-sync/.env`

```bash
ENTRA_CLIENT_ID=<step 1 — Application (client) ID>
ENTRA_CLIENT_SECRET=<step 3 — Value column>
ENTRA_WEBHOOK_CLIENT_STATE=<from `node -e ...` in prerequisites>
```

> `ENTRA_WEBHOOK_CLIENT_STATE` is the **fallback / default** clientState
> used only if a per-connection one wasn't stored. In production every
> tenant connection mints its own random clientState — that's what
> `connectionStore.resolveByGraphClientState()` looks up. Keep this env var
> set anyway as a safety net.

---

## Step 10 — Smoke test

With `services/device-sync` running on localhost (`pnpm dev`), open a
public tunnel (`ngrok http 4040 --domain=…`) and:

```bash
# 1. Visit the consent URL in an incognito browser
#    as a tenant admin of a test Entra tenant
# 2. After consent, the callback persists the connection
# 3. Trigger:
curl -X POST https://api.topiadesk.com/webhooks/graph \
  -H 'content-type: application/json' \
  -d '{"validationToken":"hello"}'
# expected: 200, body "hello"
```

Then create a real subscription via Postman against
`https://graph.microsoft.com/v1.0/subscriptions` — within ~30 s a payload
arrives at your tunnel, the queue depth ticks, the reconciler logs
`reconciled`. If anything fails check pino-pretty output for the audit
trail.

---

## Step 11 — Rotate the client secret on a calendar

- Calendar event: **23 months from creation**
- Reminder: **+ New client secret → Add → copy → update `ENTRA_CLIENT_SECRET` → restart device-sync → delete the old secret**

Topiadesk supports two secrets in parallel during rotation: keep both in
Azure's secrets list, deploy with the new one, then delete the old.

---

## Step 12 — Customer-facing checklist (for the tenant admin's docs)

> **What we ask a tenant admin to do:**
> 1. In Topiadesk → **Tenant admin → Integrations → Microsoft → Connect**
> 2. Sign in with a Microsoft account that has **Global Administrator** on your tenant
> 3. Review and **Accept** the permissions list shown on the consent screen
> 4. You'll be redirected back to Topiadesk. Done.
>
> **What we ask under the hood:**
> - Read users, devices, Intune managed devices, sign-in activity
> - Receive change notifications (webhooks) on the above
> - No write access. We can't change anything in your tenant.

---

## Step 13 — Document for the security questionnaire team

Most enterprise prospects will ask:

| Question | Answer |
|---|---|
| Are you using delegated or application permissions? | **Application** (no user session) |
| What scopes do you request? | `User.Read.All`, `Device.Read.All`, `DeviceManagementManagedDevices.Read.All`, `Directory.Read.All`, `AuditLog.Read.All` |
| Where are tokens stored? | In-memory only, evicted at expiry minus 60 s |
| Where is the client secret stored? | In the Topiadesk vault (KMS-encrypted at rest, decrypted in-process only) |
| Does Topiadesk write to our directory? | **No.** Read-only. |
| Can we revoke access? | Entra → Enterprise applications → **Topiadesk Device Sync → Properties → Delete** |

---

## Troubleshooting

| Symptom | Root cause | Fix |
|---|---|---|
| `AADSTS65001: The user or administrator has not consented` | Missing `Grant admin consent` in step 2 | Re-do step 2 → click the green ✓ Grant button |
| Webhook subscription POST returns `403 Forbidden` | App permission `Subscription` scope missing | Add `Subscription.Read.All` and re-consent |
| `clientState validation failed` in pino logs | Each tenant has its own random clientState — yours doesn't match the one stored at subscription time | Re-create the subscription via the UI's *Reconnect* button |
| Validation handshake times out | Load balancer not forwarding `?validationToken=` query | Check LB rewrite rules — must pass query string verbatim |
| `429 Too Many Requests` from Graph during poll sweep | `POLL_INTERVAL_SECONDS=600` too aggressive for tenants with > 10k users | Raise to 1800 in `.env`, or implement per-tenant throttle in `providers/entra.ts` |
