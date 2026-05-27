'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, LogIn, ShieldCheck } from 'lucide-react';
import { Button, Input, Label } from '@topiadesk/ui';

type Step = 'credentials' | 'mfa';

export default function TenantAdminLoginPage() {
  const [step, setStep] = useState<Step>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError('Enter your email and password.'); return; }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setStep('mfa');
  }

  async function handleMFA(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { setError('Enter the 6-digit code.'); return; }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    // Production: verify OTP, redirect to /
    setError('Invalid code — please try again.');
  }

  function handleOtpChange(i: number, val: string) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) {
      const el = document.getElementById(`otp-${i + 1}`);
      if (el) (el as HTMLInputElement).focus();
    }
  }

  function handleOtpKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      const el = document.getElementById(`otp-${i - 1}`);
      if (el) (el as HTMLInputElement).focus();
    }
  }

  return (
    <div className="space-y-6">
      {step === 'credentials' ? (
        <>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">Admin portal</p>
            <h1 className="font-display mt-1 text-2xl font-bold tracking-tight text-foreground">
              Sign in to your workspace
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Access the tenant admin dashboard to manage your helpdesk.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleCredentials} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Admin email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@yourcompany.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="https://topiadesk.com/reset" className="text-xs text-orange-600 hover:text-orange-700 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShow((s) => !s)}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 text-white hover:bg-orange-600"
              disabled={loading}
            >
              {loading
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…</>
                : <><LogIn className="mr-2 h-4 w-4" /> Continue</>
              }
            </Button>
          </form>

          <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Admin access only.</span>{' '}
            If you&apos;re a support agent, sign in via your{' '}
            <a href="https://app.topiadesk.com" className="text-orange-600 hover:underline">agent workspace</a>.
          </div>
        </>
      ) : (
        <>
          <div>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
              <ShieldCheck className="h-6 w-6 text-orange-500" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Two-factor authentication</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter the 6-digit code from your authenticator app to confirm it&apos;s you.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleMFA} className="space-y-5">
            <div className="flex justify-center gap-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="h-12 w-10 rounded-lg border border-input bg-background text-center text-lg font-bold text-foreground shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 text-white hover:bg-orange-600"
              disabled={loading || otp.join('').length < 6}
            >
              {loading
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying…</>
                : 'Verify and sign in'
              }
            </Button>
          </form>

          <button
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => { setStep('credentials'); setOtp(['', '', '', '', '', '']); setError(''); }}
          >
            ← Back to sign in
          </button>
        </>
      )}
    </div>
  );
}
