import type { ReactNode } from 'react';
import Link from 'next/link';

/**
 * Auth split layout for tenant admin — orange brand accent on left panel.
 * No sidebar or topbar; used for login and first-run onboarding entry.
 */
export default function TenantAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[5fr_6fr]">
      {/* ── Brand panel ── */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#0D1117] text-white lg:flex">
        {/* Blur orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-orange-600/10 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/5 blur-3xl" />
        </div>
        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Logo */}
        <div className="relative z-10 p-10">
          <Link href="https://topiadesk.com" className="inline-flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-900/40">
              <span className="font-display text-lg font-black text-white">T</span>
            </div>
            <span className="font-display text-xl font-bold tracking-tight">Topiadesk</span>
          </Link>
        </div>

        {/* Hero */}
        <div className="relative z-10 space-y-6 p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
            <span className="text-xs font-medium text-orange-300">Admin portal</span>
          </div>
          <h2 className="font-display text-3xl font-bold leading-tight">
            Manage your team, channels, and helpdesk — all from one place.
          </h2>
          <p className="max-w-xs text-sm text-white/60 leading-relaxed">
            Configure SLA policies, onboard agents, set up integrations, and monitor your support operations in real time.
          </p>
          <ul className="space-y-3">
            {[
              'Role-based access control',
              'Automated ticket routing',
              'Real-time SLA monitoring',
              'NDPR / GDPR aligned audit logs',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-white/70">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
                  <svg viewBox="0 0 12 12" fill="none" className="h-2.5 w-2.5">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="relative z-10 p-10 text-xs text-white/30">
          &copy; {new Date().getFullYear()} Tekktopia · Topiadesk Admin
        </div>
      </aside>

      {/* ── Form area ── */}
      <main className="flex items-center justify-center bg-background p-6 sm:p-10">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600">
              <span className="font-display text-base font-black text-white">T</span>
            </div>
            <span className="font-display text-lg font-bold tracking-tight">Topiadesk</span>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
