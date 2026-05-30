# Runbook: Google Cloud project + service account for Workspace device-sync

**Audience:** Topiadesk platform operator (you).
**One-time setup. ~15 minutes** (plus 5 min per provider domain-wide-delegation step that each customer admin does themselves).
**Output:** the four env vars that unblock `services/device-sync` for every Google Workspace customer.

---

## Why this is manual

Google Cloud needs:
- a project created under a billing account
- specific APIs enabled (the enable button counts as a deliberate human action — there's no API for "enable API")
- a service-account whose JSON key is generated and downloaded once
- a Cloud Pub/Sub topic + push subscription with a verified domain

Service accounts can't create themselves. Once Topiadesk has its SA, every
customer admin enables domain-wide delegation against your SA's client ID
— that part is **5 minutes per customer**, not per platform.

---

## Prerequisites

- A Google account with billing rights on a Google Cloud organisation. If
  Topiadesk doesn't already have a GCP org, create one at
  **cloud.google.com → Get started for free**.
- Your `topiadesk.com` domain verified in Google's Search Console (needed
  for the Pub/Sub push endpoint).
- A signed payload secret for the Pub/Sub push handshake:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

---

## Step 1 — Create the GCP project

1. **console.cloud.google.com → Select project → New project**.
2. Fields:
   - **Project name:** `Topiadesk Production`
   - **Project ID:** `topiadesk-prod` *(or whatever's free — record it, you'll need it)*
   - **Organisation:** your Topiadesk org
   - **Billing account:** your active billing account
3. **Create**.
4. After creation, **switch to the new project** in the top-bar picker.

---

## Step 2 — Enable APIs

**APIs & Services → Library** → search and enable each of these:

| API | What it's for |
|---|---|
| **Admin SDK API** | List users + devices in customers' Workspace |
| **Cloud Pub/Sub API** | Receive real-time device change events |
| **Cloud Identity API** | Org-unit + device structure |
| **Google Chat API** | *(optional, future)* Inline ticket notifications in Chat |
| **Reports API** *(part of Admin SDK)* | Sign-in activity for device fingerprinting |

After clicking each → **Enable**. Wait for the "API enabled" confirmation
before moving on.

---

## Step 3 — Create the service account

1. **IAM & Admin → Service Accounts → + Create service account**.
2. Fields:
   - **Service account name:** `device-sync`
   - **Service account ID:** `device-sync` *(auto-fills to `device-sync@<project>.iam.gserviceaccount.com`)*
   - **Description:** `Reads Workspace users + devices for the Topiadesk asset register`
3. **Create and continue**.
4. **Grant this service account access to project** → add roles:
   - `Pub/Sub Subscriber` *(consumes pushed device events)*
   - `Pub/Sub Publisher` *(writes test/back-channel events)*
5. **Continue → Done**.
6. On the SA list page, **copy the Email** (you'll need it as the *Client ID*
   that customers paste into their Workspace admin console in step 7):
   ```
   device-sync@topiadesk-prod.iam.gserviceaccount.com
   ```
7. Click into the SA → **Keys tab → Add key → Create new key → JSON → Create**.
   - A `.json` file downloads. **Treat it like a password.**
   - Move it to a secret store. For dev: `services/device-sync/secrets/google-sa.json`
     (gitignored — verify before commit).
8. **Also copy the OAuth 2.0 Client ID** of the service account. On the SA's
   *Details* tab → **Advanced settings → OAuth 2 Client ID**. It's a long
   numeric string. Customers paste **this number** (not the email) into the
   Workspace admin console's *Domain-wide Delegation* page.

---

## Step 4 — Enable domain-wide delegation on the SA

> This is *Topiadesk's* setting that says "this SA is allowed to act on
> behalf of users in customer tenants". The customer's admin then grants
> the specific scopes from their side in step 7.

1. **IAM → Service Accounts → device-sync → ⋮ Manage details → Show advanced settings**.
2. Tick **Enable Google Workspace Domain-wide Delegation**.
3. **OAuth scopes** — leave blank here (scopes are picked per-customer at
   delegation time).
4. **Save**.

---

## Step 5 — Create the Pub/Sub topic + subscription

1. **Pub/Sub → Topics → + Create topic**.
   - **Topic ID:** `device-events`
   - Defaults for the rest → **Create**.
2. On the topic page → **+ Create subscription**.
   - **Subscription ID:** `device-events-push`
   - **Delivery type:** **Push**
   - **Endpoint URL:** `https://api.topiadesk.com/webhooks/google`
   - **Enable authentication:** ✅
     - **Service account:** select `device-sync@topiadesk-prod.iam.gserviceaccount.com`
     - **Audience:** `https://api.topiadesk.com/webhooks/google` *(must exactly match `GOOGLE_PUBSUB_AUDIENCE` in `.env`)*
   - **Acknowledgement deadline:** 60 seconds
   - **Message retention:** 7 days
   - **Dead-letter topic:** *(optional but recommended — create `device-events-dlq` and select it)*
3. **Create**.

> ⚠️ Google requires the push endpoint domain to be **verified in Google
> Search Console** *and* served over **HTTPS** with a public CA cert. For
> local dev, use ngrok with `--domain=...` and verify that subdomain too.

---

## Step 6 — Configure verified domain for push (one-time)

1. **Pub/Sub → Subscriptions → device-events-push → Edit**.
2. Scroll to **Verify endpoint domain** → **Verify**.
3. Google opens Search Console — add a DNS TXT record pointing
   `_google-site-verification.topiadesk.com` at the value Google provides.
4. Wait for verification (usually < 1 min). Save.

Without this, Pub/Sub silently drops every push.

---

## Step 7 — Customer-facing checklist (Workspace admin's docs)

> **What we ask a customer's Workspace admin to do**, after they click
> *Connect Google Workspace* in Topiadesk:
>
> 1. In Google admin (`admin.google.com`) → **Security → API Controls → Domain-wide Delegation → Add new**.
> 2. **Client ID:** `<paste the numeric OAuth 2.0 Client ID from Topiadesk>`
> 3. **OAuth scopes** *(comma-separated)*:
>    ```
>    https://www.googleapis.com/auth/admin.directory.user.readonly,
>    https://www.googleapis.com/auth/admin.directory.device.mobile.readonly,
>    https://www.googleapis.com/auth/admin.directory.device.chromeos.readonly,
>    https://www.googleapis.com/auth/admin.reports.audit.readonly
>    ```
> 4. **Authorize**.
> 5. Back in Topiadesk, paste the **admin email** for impersonation
>    (a Workspace super-admin's address — the SA acts as them when reading
>    directory data) — Topiadesk stores it as `connection.creds.impersonate`.

That's the whole customer-side flow. Around 3 clicks once the steps above
are in place.

---

## Step 8 — Fill in `services/device-sync/.env`

```bash
GOOGLE_SERVICE_ACCOUNT_KEY=/absolute/path/to/secrets/google-sa.json
GOOGLE_PUBSUB_TOPIC=projects/topiadesk-prod/topics/device-events
GOOGLE_PUBSUB_AUDIENCE=https://api.topiadesk.com/webhooks/google
```

For local dev, replace the URL with your ngrok domain in both
`GOOGLE_PUBSUB_AUDIENCE` and the Pub/Sub subscription endpoint.

---

## Step 9 — Verify the JWT validation path

Google signs every push with a JWT in `Authorization: Bearer <jwt>`. Our
receiver in `providers/google.ts → verifyPubSubJwt()` must:

1. Decode the JWT.
2. Confirm `iss` is `accounts.google.com` or `https://accounts.google.com`.
3. Confirm `aud` exactly equals `GOOGLE_PUBSUB_AUDIENCE`.
4. Confirm the signing key is the current Google public key (cached, rotated).
5. Confirm `email` matches `device-sync@…iam.gserviceaccount.com`.

The current `providers/google.ts` is a stub. Before going to production,
swap it for:

```ts
import { OAuth2Client } from 'google-auth-library';
const oauth = new OAuth2Client();
const ticket = await oauth.verifyIdToken({
  idToken: jwt,
  audience: config.GOOGLE_PUBSUB_AUDIENCE,
});
const payload = ticket.getPayload();
if (payload?.email !== EXPECTED_SA_EMAIL) throw new Error('wrong signer');
```

Add `google-auth-library` to `package.json` at that point.

---

## Step 10 — Smoke test

```bash
# Publish a synthetic event to your topic
gcloud pubsub topics publish device-events \
  --project=topiadesk-prod \
  --message='{"userKey":"d.oshinubi@netcomafrica.com","deviceId":"abc-123","event":"primary-user-changed"}'

# Watch the device-sync logs
pnpm dev
# expected within ~2s:
#   {svc:"device-sync"} google webhook received — shaping TBD
```

If you see the message but the reconciler doesn't fire, that means the
google.ts stub didn't shape it into a `RawSignal[]` — that's the next
ticket of real implementation work (separate from this runbook).

---

## Step 11 — Cost guard rails

| Surface | Free quota | Likely monthly spend at 100 tenants × 1k users |
|---|---|---|
| Pub/Sub | 10 GB ingress/egress free | ~$0.40 |
| Admin SDK | Unlimited reads | $0 |
| Cloud Identity | Unlimited | $0 |
| Service-account auth | Unlimited | $0 |
| Cloud Logging *(for SA audit)* | 50 GB free | ~$2 |

Set a **billing budget alert** at `$50/month` for the project until traffic
is well-understood: **Billing → Budgets & alerts → + Create budget**.

---

## Step 12 — SA key rotation

Google service-account JSON keys never auto-expire, which is a security
liability. Topiadesk's policy:

- Rotate **every 90 days**.
- During rotation, keep both old and new keys active.
- New `.env` deployed → SA verified to fingerprint correctly → old key
  deleted in **IAM → SA → Keys**.

Cron-equivalent calendar reminder + ops runbook page.

---

## Step 13 — Document for the security questionnaire team

| Question | Answer |
|---|---|
| Auth model | Service account with domain-wide delegation |
| Scopes requested | Directory read-only (users + devices + ChromeOS + mobile), Reports audit read-only |
| Write access? | **No.** Read-only. |
| Where is the SA key stored? | KMS-encrypted at rest, decrypted only in the device-sync pod's memory |
| Where are pushed messages validated? | JWT signed by `accounts.google.com`, audience-checked against our receiver URL, signer-checked against our SA email |
| Can we revoke access? | Workspace admin → API Controls → Domain-wide Delegation → **Remove** the Topiadesk client ID |

---

## Troubleshooting

| Symptom | Root cause | Fix |
|---|---|---|
| Pub/Sub push gets 401 from our endpoint | JWT audience mismatch | Check `GOOGLE_PUBSUB_AUDIENCE` matches the *exact* string set when creating the subscription, scheme + host + path |
| `Insufficient Permission` from Admin SDK calls | Customer admin didn't grant the right scopes in step 7 | Send them step 7 verbatim; the scope list must be comma-separated *with no spaces* in Google's UI |
| Pub/Sub messages disappear, no errors anywhere | Push endpoint domain not verified | Step 6 — TXT record + Search Console verify |
| `403 Caller does not have permission` on `gcloud pubsub topics publish` | SA roles missing | IAM → grant SA `Pub/Sub Publisher` on the topic |
| Reports API returns empty results | Customer is on a Workspace edition without audit logs (Business Starter) | Tell the prospect: needs Business Standard or higher |
| Push delivery rate drops to zero after a few days | Underlying SA key was rotated/revoked | Re-issue key, restart device-sync, push subscription auto-reauthenticates |
