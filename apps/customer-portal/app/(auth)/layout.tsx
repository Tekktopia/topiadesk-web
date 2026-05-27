import type { ReactNode } from 'react';
import Link from 'next/link';

/**
 * Auth layout for customer portal — dark navy split, no PortalHeader/PortalFooter.
 * Left: brand / hero panel. Right: form area.
 */
export default function PortalAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[5fr_6fr]">
      {/* ── Brand panel ── */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#0B1529] text-white lg:flex">
        {/* Blur orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -right-24 bottom-16 h-80 w-80 rounded-full bg-indigo-600/15 blur-3xl" />
        </div>
        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Logo */}
        <div className="relative z-10 p-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-900/40">
              <span className="font-display text-lg font-black text-white">C</span>
            </div>
            <div>
              <p className="font-display text-lg font-bold leading-tight">ConsomoAfrica</p>
              <p className="text-[11px] font-medium text-white/50 tracking-wide">Support Centre</p>
            </div>
          </Link>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-5 p-10">
          <h2 className="font-display text-3xl font-bold leading-tight">
            Fast, friendly support — whenever you need it.
          </h2>
          <p className="max-w-xs text-sm text-white/60 leading-relaxed">
            Submit tickets, track resolutions, browse our knowledge base, and chat directly with our support team — all from one place.
          </p>
          <ul className="space-y-2.5 text-sm text-white/70">
            {[
              'Real-time ticket status updates',
              'Knowledge base with 500+ articles',
              'Average response time under 2 hours',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                  <svg viewBox="0 0 12 12" fill="none" className="h-2.5 w-2.5"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="relative z-10 p-10 text-xs text-white/30">
          &copy; {new Date().getFullYear()} ConsomoAfrica · Powered by Topiadesk
        </div>
      </aside>

      {/* ── Form area ── */}
      <main className="flex items-center justify-center bg-background p-6 sm:p-10">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700">
              <span className="font-display text-base font-black text-white">C</span>
            </div>
            <div>
              <p className="font-display text-base font-bold leading-tight">ConsomoAfrica</p>
              <p className="text-[10px] text-muted-foreground">Support Centre</p>
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
