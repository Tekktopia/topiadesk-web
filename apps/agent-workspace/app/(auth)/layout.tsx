import type { ReactNode } from 'react';
import Link from 'next/link';
import { Logo } from '@topiadesk/ui';

/**
 * Brand split layout for unauthenticated pages (login, reset).
 * Left: deep navy brand panel with hero copy. Right: form area.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[5fr_6fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-navy bg-dot-navy text-white lg:flex">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue/20 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-orange/15 blur-3xl" />
        </div>

        <div className="relative z-10 p-10">
          <Link href="https://topiadesk.com" className="inline-flex items-center gap-3">
            <Logo size={40} className="rounded-lg bg-white/10 p-1" />
            <span className="font-display text-xl font-bold tracking-tight">
              Topiadesk
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 p-10">
          <h2 className="font-display text-4xl font-bold leading-tight">
            The unified support and infrastructure platform built for African
            businesses.
          </h2>
          <p className="max-w-md text-base text-white/70">
            Helpdesk, asset management, monitoring, field service, sales CRM
            and more — one tenant, one source of truth.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/50">
            <span>SOC 2-ready</span>
            <span aria-hidden>·</span>
            <span>NDPR / GDPR aligned</span>
            <span aria-hidden>·</span>
            <span>99.95% uptime SLO</span>
          </div>
        </div>

        <div className="relative z-10 p-10 text-xs text-white/40">
          &copy; {new Date().getFullYear()} Tekktopia. All rights reserved.
        </div>
      </aside>

      <main className="flex items-center justify-center bg-background p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Logo size={36} />
            <span className="font-display text-lg font-bold tracking-tight">
              Topiadesk
            </span>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
