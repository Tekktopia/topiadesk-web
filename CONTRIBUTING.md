# Contributing to topiadesk-web

## Prerequisites

- Node.js 20+ (`.nvmrc` pins the dev version), pnpm 9

## Workflow

Trunk-based development.

1. Branch from `main`: `feat/<scope>`, `fix/<scope>`, or `chore/<scope>`.
2. Run `pnpm lint`, `pnpm typecheck`, and `pnpm build` locally.
3. Open a pull request. CI must be green and CODEOWNERS must approve.
4. Squash-merge to `main`.

## Conventions

- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`...).
- **TypeScript:** strict mode; no `any` without a written reason.
- **Components:** shared, reusable UI belongs in `@topiadesk/ui`, not in an
  individual app. Design values come from `@topiadesk/design-tokens`.
- **Accessibility:** every interactive surface must be keyboard-navigable
  and meet WCAG 2.1 AA (PRD Section 21).
