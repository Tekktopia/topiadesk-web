import Link from 'next/link';
import { ArrowRight, CheckCircle2, Search, Shield, Zap } from 'lucide-react';
import { Button, Card, CardContent, Input } from '@topiadesk/ui';

export default function CredentialsPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#050C1A]">

      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-[300px] w-[400px] rounded-full bg-violet-600/10 blur-[100px]" />
      </div>

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage: 'radial-gradient(#ffffff08 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Header */}
      <header className="relative flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold text-white">Topiadesk</span>
        </Link>
        <Link
          href="/"
          className="text-xs font-medium text-slate-500 transition-colors hover:text-slate-300"
        >
          Back to marketing site
        </Link>
      </header>

      {/* Main content */}
      <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-12">

        {/* Shield icon */}
        <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-2xl shadow-blue-600/40">
          <Shield className="h-8 w-8 text-white" />
        </div>

        <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-white">
          Credential verification
        </h1>
        <p className="mb-8 max-w-sm text-center text-sm text-slate-400">
          Verify Topiadesk-issued certifications, badges, and professional credentials
          instantly and securely.
        </p>

        {/* Verification card */}
        <Card className="w-full max-w-md border-white/10 bg-white/[0.04] shadow-2xl">
          <CardContent className="p-6">
            <p className="mb-4 text-sm font-semibold text-white">
              Enter a credential ID
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  placeholder="e.g. TDP-2026-A4B3C2"
                  className="border-white/10 bg-white/5 pl-9 text-white placeholder:text-slate-600 focus-visible:border-blue-500/50 focus-visible:ring-blue-500/20"
                />
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-500 shadow-md shadow-blue-600/20 hover:from-blue-500 hover:to-blue-400">
                Verify
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.03] p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-600">
                Sample credentials
              </p>
              <ul className="space-y-2">
                {[
                  'TDP-2026-HD001 · Certified Helpdesk Specialist',
                  'TDP-2026-NOC42 · NOC Operations Professional',
                  'TDP-2026-ADM07 · Topiadesk Administrator',
                ].map((c) => (
                  <li
                    key={c}
                    className="flex items-center gap-2.5 text-xs text-slate-500"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    <span className="font-mono">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Trust indicators */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          {[
            { label: '2 400+',  sub: 'credentials issued' },
            { label: '99.99%', sub: 'verification uptime' },
            { label: 'ISO 27001', sub: 'certified platform' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-xl font-bold text-transparent">
                {s.label}
              </p>
              <p className="text-[10px] text-slate-600">{s.sub}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative py-6 text-center">
        <p className="text-xs text-slate-700">
          &copy; {new Date().getFullYear()} Tekktopia Ltd &middot;{' '}
          <Link href="#" className="hover:text-slate-400">
            Privacy policy
          </Link>
        </p>
      </footer>
    </div>
  );
}
