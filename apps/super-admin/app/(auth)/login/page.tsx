'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  Shield,
  ShieldCheck,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Logo,
  Switch,
  cn,
} from '@topiadesk/ui';
import { useRole, type AdminRole } from '@/lib/role-context';

// ─── Demo credentials per role ──────────────────────────────────────────────
// These are PRESET accounts for switching contexts during dev. In production
// any of these would be a real auth call against the platform.

const DEMO_ACCOUNTS: { role: AdminRole; email: string; label: string; color: string }[] = [
  { role: 'super_admin', email: 'daniel@topiadesk.com',  label: 'Super Admin', color: 'text-red-600' },
  { role: 'admin',       email: 'amara@topiadesk.com',   label: 'Admin',       color: 'text-coral-dark' },
  { role: 'csr',         email: 'tunde@topiadesk.com',   label: 'CSR',         color: 'text-blue-600' },
  { role: 'viewer',      email: 'fatima@topiadesk.com',  label: 'Viewer',      color: 'text-slate-600' },
];

const DEMO_PASSWORD = 'Topiadesk2026!';

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useRole();

  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [showPwd,    setShowPwd]    = useState(false);
  const [remember,   setRemember]   = useState(true);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    // Match against demo accounts
    const match = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (!match) {
      setLoading(false);
      setError('No admin account found for that email. Contact a super admin.');
      return;
    }
    if (password !== DEMO_PASSWORD) {
      setLoading(false);
      setError('Incorrect password. Use the demo password shown below.');
      return;
    }
    setRole(match.role);
    router.push('/dashboard');
  }

  function quickFill(account: typeof DEMO_ACCOUNTS[number]) {
    setEmail(account.email);
    setPassword(DEMO_PASSWORD);
    setError(null);
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[5fr_6fr]">
      {/* ── Left: brand panel ── */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-navy text-white lg:flex">
        {/* Pattern overlay */}
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-coral/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl" />

        <div className="relative z-10 p-10">
          <Link href="https://topiadesk.com" className="inline-flex items-center gap-3 text-white">
            <Logo size={44} />
            <div>
              <p className="font-display text-xl font-bold tracking-tight text-white">Topiadesk</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-coral-light">Super Admin Portal</p>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 p-10 text-white">
          <h2 className="font-display text-4xl font-bold leading-tight text-white">
            Centralized control for every tenant on Topiadesk.
          </h2>
          <p className="max-w-md text-base text-white/80">
            Manage all tenants, billing, support tickets, security and platform configuration
            from one secure command centre.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/60">
            <span className="flex items-center gap-1.5 text-white/70"><ShieldCheck className="h-3 w-3" />SOC 2-ready</span>
            <span aria-hidden>·</span>
            <span className="text-white/70">MFA enforced</span>
            <span aria-hidden>·</span>
            <span className="text-white/70">IP allowlist</span>
            <span aria-hidden>·</span>
            <span className="text-white/70">Audit logged</span>
          </div>
        </div>

        <div className="relative z-10 p-10 text-xs text-white/50">
          &copy; {new Date().getFullYear()} Tekktopia. All rights reserved.
        </div>
      </aside>

      {/* ── Right: login form ── */}
      <main className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Logo size={36} />
            <div>
              <p className="font-display text-lg font-bold tracking-tight">Topiadesk</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-coral">Super Admin</p>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold tracking-tight">Sign in to your portal</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Use your Topiadesk admin credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@topiadesk.com"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-xs font-medium text-coral hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <Switch checked={remember} onCheckedChange={setRemember} />
                <span>Remember this device for 30 days</span>
              </label>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" disabled={loading} className="h-10 w-full">
              {loading
                ? <span className="flex items-center gap-2"><span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />Signing in…</span>
                : <>Sign in <ArrowRight className="h-3.5 w-3.5" /></>}
            </Button>

            <p className="text-center text-[11px] text-muted-foreground">
              Protected by MFA. By signing in you agree to our <a href="#" className="text-coral hover:underline">platform admin policy</a>.
            </p>
          </form>

          {/* ── Demo accounts (dev only) ── */}
          <Card className="mt-6 border-amber-200 bg-amber-50/40">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <KeyRound className="h-3.5 w-3.5 text-amber-700" />
                <p className="text-xs font-semibold text-amber-800">Demo accounts — click to fill</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => quickFill(acc)}
                    className="rounded-md border border-amber-200 bg-white px-2.5 py-1.5 text-left text-[11px] transition-colors hover:border-coral/40 hover:bg-coral/5"
                  >
                    <p className={cn('font-semibold', acc.color)}>{acc.label}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{acc.email}</p>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-amber-700/80">
                Password for all demo accounts: <code className="rounded bg-amber-100 px-1 font-mono font-medium">{DEMO_PASSWORD}</code>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
