import * as React from 'react';
import { cn } from '../lib/cn';

/**
 * Topiadesk brand mark — the default "T" symbol shown across every Topiadesk
 * surface until a tenant uploads their own logo via Branding settings.
 *
 * Renders the PNG at `<basePath>/icons/icon.png`. Each Next.js app ships that
 * file in its own `public/icons/` directory. Apps mounted at a sub-path
 * (e.g. tenant-admin → `basePath: '/admin'`) need the URL prefixed; Next.js
 * bakes the prefix into `process.env.__NEXT_ROUTER_BASEPATH` at build time,
 * so we read it once here and the same component works in every app.
 *
 * If a caller passes `src`, that overrides the default — this is how a
 * tenant's uploaded logo replaces the Topiadesk T once configured.
 */

// Next.js inlines `process.env.__NEXT_ROUTER_BASEPATH` at build time when the
// host app sets `basePath` (e.g. tenant-admin → "/admin"). For apps with no
// basePath it inlines to `""`. We declare a local ambient `process` type so
// the UI package doesn't need to take a dependency on `@types/node`.
declare const process: { env: { __NEXT_ROUTER_BASEPATH?: string } };
const BASE_PATH: string =
  (typeof process !== 'undefined' ? process.env.__NEXT_ROUTER_BASEPATH : undefined) ?? '';

export interface LogoProps {
  /** Visual size in px. Renders square. Defaults to 24. */
  size?: number;
  /** Optional accessible label. Defaults to "Topiadesk". */
  label?: string;
  /** Extra classes applied to the wrapper. */
  className?: string;
  /** Override URL — when the tenant has uploaded a custom logo. */
  src?: string;
}

export function Logo({ size = 24, label = 'Topiadesk', className, src }: LogoProps) {
  const resolvedSrc = src ?? `${BASE_PATH}/icons/icon.png`;
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={resolvedSrc}
      alt={label}
      width={size}
      height={size}
      className={cn('inline-block shrink-0 object-contain', className)}
      style={{ width: size, height: size }}
    />
  );
}
Logo.displayName = 'Logo';
