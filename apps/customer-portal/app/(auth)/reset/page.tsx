'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Loader2, CheckCircle2, Eye, EyeOff, KeyRound } from 'lucide-react';
import { Button, Input, Label } from '@topiadesk/ui';

type Stage = 'request' | 'sent' | 'reset' | 'done';

export default function PortalResetPage() {
  const [stage, setStage] = useState<Stage>('request');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function requestReset(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) { setError('Enter a valid email address.'); return; }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setStage('sent');
  }

  async function submitNewPassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setStage('done');
  }

  // ── Stage: email sent ────────────────────────────────────────────────────────
  if (stage === 'sent') {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
            <Mail className="h-7 w-7 text-blue-600" />
          </div>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Check your email</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            If <span className="font-semibold text-foreground">{email}</span> is registered, you&apos;ll receive a reset link shortly.
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Didn&apos;t get it? Check your spam folder or{' '}
            <button className="text-blue-600 hover:underline" onClick={() => setStage('request')}>try again</button>.
          </p>
        </div>
        {/* Simulate clicking the link in email → show new password form */}
        <Button variant="outline" className="w-full text-xs" onClick={() => setStage('reset')}>
          [Demo] Open reset link →
        </Button>
        <Link href="/login" className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>
      </div>
    );
  }

  // ── Stage: new password ──────────────────────────────────────────────────────
  if (stage === 'reset') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Set new password</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a strong password for your account.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <form onSubmit={submitNewPassword} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="new-password">New password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={show ? 'text' : 'password'}
                placeholder="At least 8 characters"
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
          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-blue-700 text-white hover:bg-blue-800" disabled={loading}>
            {loading
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</>
              : <><KeyRound className="mr-2 h-4 w-4" /> Set new password</>
            }
          </Button>
        </form>
      </div>
    );
  }

  // ── Stage: done ──────────────────────────────────────────────────────────────
  if (stage === 'done') {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Password updated!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your password has been changed. You can now sign in with your new credentials.
          </p>
        </div>
        <Link href="/login">
          <Button className="w-full bg-blue-700 text-white hover:bg-blue-800">
            Go to sign in
          </Button>
        </Link>
      </div>
    );
  }

  // ── Stage: request ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Reset your password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the email address linked to your account and we&apos;ll send you a reset link.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={requestReset} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-700 text-white hover:bg-blue-800"
          disabled={loading}
        >
          {loading
            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending link…</>
            : <><Mail className="mr-2 h-4 w-4" /> Send reset link</>
          }
        </Button>
      </form>

      <Link
        href="/login"
        className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
      </Link>
    </div>
  );
}
