# Free-Trial Self-Serve Provisioning — Implementation Guide

**Audience:** Topiadesk backend / platform / DevOps team
**Goal:** Turn the existing marketing-site signup wizard (`apps/marketing-site/app/signup/page.tsx`) from a mocked flow into a real, Zendesk-style self-serve trial that provisions a live, isolated tenant and drops the new admin straight into their workspace.

---

## 1. Current state (what the frontend already does)

The wizard UI is **built and live** but entirely client-side mock:

| Step | UI | Today (mock) | Needs to become |
|------|----|--------------|-----------------|
| 1. Tenant | Company name, subdomain field, plan picker | Subdomain availability is a **fake 350 ms `setTimeout`** against a hard-coded reserved list | Real `GET /signup/check-subdomain` call |
| 2. Account | Name, email, password (+ strength), terms | `handleSubmit` just waits **1 s** then advances | Real `POST /signup/tenants` call |
| 3. Done | "Provisioning…" screen | Static; never redirects | Poll status (or await) then **redirect/auto-login** into the tenant |

No provisioning endpoints exist in this repo. `@topiadesk/api-client` is **tenant-bound** (`https://{tenant}.topiadesk.com/api/v1`) and only does tickets — it assumes the tenant already exists. Provisioning must live in a **tenant-less, public** service (the core `topiadesk` backend or `topiadesk-ops`).

---

## 2. Architecture decisions to make first

1. **Where does the endpoint live?** It must be reachable **before any tenant exists**, so it can't sit behind a tenant subdomain. Recommended: a public origin such as `https://api.topiadesk.com/v1/signup/*` (or `https://app.topiadesk.com/api/...`). Pick one and give the frontend a base URL.
2. **Tenancy model** — confirm how tenants are isolated (separate schema per tenant? shared schema with `tenant_id` + row-level security?). The marketing copy promises *"row-level security enforced at the database"* and *"fully isolated tenant"* — provisioning must set this up.
3. **Sync vs async provisioning.** Creating a tenant (DB schema/rows, DNS, seed data) can take seconds. Two options:
   - **Synchronous:** endpoint blocks until ready, returns tenant URL + token. Simplest for the frontend.
   - **Asynchronous (recommended for scale):** endpoint returns `202` + a `provisioningId`; frontend polls `GET /signup/status/{id}`. Matches the existing "Provisioning…" screen.
4. **Auto-login vs email activation.** Zendesk-style is usually: create → land in product immediately (auto-login via a one-time token), **then** verify email in the background. Decide whether email verification is required *before* first login.

---

## 3. API contract (the endpoints to build)

### 3.1 Check subdomain availability

```
GET /v1/signup/check-subdomain?slug=consomoafrica
```

**Response 200**
```json
{ "slug": "consomoafrica", "available": true }
```
```json
{ "slug": "www", "available": false, "reason": "reserved" }
```

Rules the backend must enforce (frontend mirrors them, but server is source of truth):
- Format: `^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$` (3–63 chars, no leading/trailing hyphen).
- Reserved list (already in the frontend): `www, api, admin, app, mail, support, help, topiadesk, tekktopia, status, docs, learn, credentials` — keep the canonical list server-side.
- Case-insensitive uniqueness against existing tenants.
- **Rate-limit** (e.g. 20/min/IP) — this endpoint is unauthenticated and enumerable.

### 3.2 Create trial tenant + first admin

```
POST /v1/signup/tenants
Content-Type: application/json
```
```json
{
  "companyName": "ConsomoAfrica",
  "subdomain": "consomoafrica",
  "plan": "growth",                 // starter | growth | business
  "admin": {
    "name": "Adaeze Nwosu",
    "email": "adaeze@consomoafrica.com",
    "password": "••••••••"
  },
  "acceptedTerms": true,
  "meta": { "source": "marketing-site", "utm": {} }   // optional analytics
}
```

**Response 201 (synchronous)**
```json
{
  "tenantId": "t_9f2c…",
  "subdomain": "consomoafrica",
  "tenantUrl": "https://consomoafrica.topiadesk.com",
  "status": "active",
  "trialEndsAt": "2026-08-27T00:00:00Z",
  "auth": {                          // omit if email-verification-first
    "oneTimeLoginToken": "otl_…",    // short-lived, single-use
    "loginUrl": "https://consomoafrica.topiadesk.com/auth/otl?token=otl_…"
  }
}
```

**Response 202 (asynchronous)** — return `{ "provisioningId": "prov_…" }` and expose:
```
GET /v1/signup/status/prov_…
→ { "status": "pending" | "active" | "failed", "tenantUrl": "…", "auth": {…} }
```

**Error responses** (frontend must handle each):
- `409 { "error": "subdomain_taken" }`
- `422 { "error": "validation", "fields": { "email": "invalid" } }`
- `429` rate-limited
- `503 { "error": "provisioning_failed" }`

### 3.3 (Optional) Email verification

```
POST /v1/signup/resend-verification   { "email": "…" }
GET  /v1/signup/verify?token=…        → marks email verified
```

---

## 4. What the backend must do inside `POST /signup/tenants`

Do this in a **transaction / saga** so a partial failure rolls back (no orphan subdomains):

1. **Re-validate** subdomain format + availability (never trust the client) and lock the slug.
2. **Create tenant record** (id, name, subdomain, plan, `trial_ends_at = now + 14d`, status).
3. **Provision isolation** — schema/rows per your tenancy model; enable row-level security.
4. **Seed defaults** — the "Provisioning…" screen promises these, so they must be real: default roles/permissions, ticket statuses, SLA policies, a starter knowledge base, plan-based limits (seats, storage, automations).
5. **Create the first admin user** — hash password (Argon2id/bcrypt), assign owner/admin role, mark email unverified.
6. **DNS / routing** — ensure `{subdomain}.topiadesk.com` resolves and TLS is served (see §6).
7. **Issue one-time login token** (short TTL, single-use) if doing auto-login.
8. **Fire side-effects** — welcome/activation email, assign an account officer, analytics event.
9. **Return** the contract above.

---

## 5. Security & abuse (must-haves before public launch)

- **Rate-limit + bot protection** on both endpoints (per IP + per email). Consider invisible CAPTCHA / Turnstile on submit — self-serve trial signup is a spam magnet.
- **Password policy** server-side (frontend requires ≥8 chars; enforce real rules + breach check if available).
- **Disposable/temporary email** filtering if trials are limited per company.
- **Duplicate control** — decide policy for the same email creating many tenants.
- **Reserved & offensive subdomain** filtering (extend the reserved list with a profanity/brand list).
- **Input sanitisation** — `companyName` is echoed into emails and the tenant UI (XSS surface).
- **Secrets** — one-time login token must be single-use, short-lived, and invalidated after redemption.
- **Audit** — the marketing copy promises a *"hash-chained, tamper-evident audit log"*; the tenant-creation and first-admin events should be the first entries.

---

## 6. Infrastructure prerequisites

- **Wildcard DNS**: `*.topiadesk.com → ` app ingress. Confirm it exists (the app already lives at `app.topiadesk.com`).
- **Wildcard TLS certificate** for `*.topiadesk.com` (e.g. ACME/Let's Encrypt wildcard or ACM), auto-renewing.
- **Routing** that maps the subdomain host header → tenant context.
- **Transactional email** provider configured (activation, welcome).
- **Background worker / queue** if provisioning is async.
- **Trial lifecycle job** — a scheduled task that watches `trial_ends_at` to downgrade/lock/notify, and the billing hand-off (the marketing site advertises *"Fixed Naira pricing"* — confirm the paid-conversion path).

---

## 7. Frontend wiring (what changes on this side once the API exists)

All in `apps/marketing-site/app/signup/page.tsx` — small, isolated changes:

1. Add `NEXT_PUBLIC_SIGNUP_API_URL` to `apps/marketing-site/.env` (and `.env.example`).
2. **Step 1 subdomain check** — replace the `setTimeout` in the `useEffect` (lines ~87–113) with a debounced `fetch(\`${API}/signup/check-subdomain?slug=\`)`; keep the local format/reserved checks as a fast pre-filter.
3. **Step 2 submit** — replace the mock `setTimeout` in `handleSubmit` (lines ~125–133) with `POST /signup/tenants`; map `409/422/429/503` to inline errors.
4. **Step 3** — on success, either `window.location.assign(auth.loginUrl)` (auto-login) or show "check your email" if verification-first. For async, poll `GET /signup/status/{id}` and show real progress against the four seed steps already listed.
5. Handle loading/disabled/error states (most UI already exists).

**Estimated frontend effort once the contract is fixed:** ~0.5–1 day. The UI is done; this is wiring + error states.

---

## 8. Acceptance criteria / definition of done

- [ ] A brand-new user can go from `/signup` → live workspace at `https://{their-sub}.topiadesk.com` with no manual steps.
- [ ] Subdomain collisions and validation errors are surfaced inline (no dead ends).
- [ ] New tenant is fully isolated; a user in tenant A cannot see tenant B's data.
- [ ] Trial expires after 14 days with the correct downgrade/notify behaviour.
- [ ] Endpoints are rate-limited and pass a basic abuse review.
- [ ] Wildcard DNS + TLS verified for a freshly created subdomain.
- [ ] Activation email is delivered and the verify link works.

---

## 9. Open questions for the team

1. Which service owns `POST /signup/tenants` — core `topiadesk` API or `topiadesk-ops`? What's its public base URL?
2. Tenancy isolation model (schema-per-tenant vs shared + RLS)?
3. Auto-login on create, or email-verification-first?
4. Sync or async provisioning? (Drives whether we build the status-poll endpoint.)
5. Plan IDs — the frontend currently uses `starter | growth | business`. Confirm canonical IDs and trial length per plan.
6. Is wildcard TLS for `*.topiadesk.com` already in place?
7. Paid conversion / billing hand-off at trial end — what's the flow?
