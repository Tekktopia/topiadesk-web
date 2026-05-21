# Security

Report vulnerabilities to **security@topiadesk.com**. Do not open public
issues for security matters.

## Frontend security notes

- Never embed secrets in client bundles; only `NEXT_PUBLIC_`-prefixed
  variables are exposed to the browser, and those must be non-sensitive.
- All API calls go through `@topiadesk/api-client`, which attaches auth
  tokens and the tenant context.
- User-supplied content is escaped; `dangerouslySetInnerHTML` requires a
  reviewed sanitisation step.
