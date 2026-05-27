'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, UserPlus, CheckCircle2 } from 'lucide-react';
import { Button, Input, Label } from '@topiadesk/ui';

export default function PortalSignupPage() {
  const [fields, setFields] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
  });
  const [show, setShow] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof typeof fields, v: string) => setFields((f) => ({ ...f, [k]: v }));

  function validate() {
    if (!fields.name.trim()) return 'Full name is required.';
    if (!fields.email.trim()) return 'Email address is required.';
    if (!fields.email.includes('@')) return 'Enter a valid email address.';
    if (fields.password.length < 8) return 'Password must be at least 8 characters.';
    if (fields.password !== fields.confirmPassword) return 'Passwords do not match.';
    if (!agreed) return 'You must accept the terms and privacy policy.';
    return '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Check your inbox</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a verification link to <span className="font-semibold text-foreground">{fields.email}</span>. Click the link to activate your account.
          </p>
        </div>
        <Button variant="outline" className="w-full" onClick={() => setDone(false)}>
          Back to sign up
        </Button>
        <p className="text-sm text-muted-foreground">
          Already verified?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">Sign in</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Create account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set up your support account to submit and track requests.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Emeka Okafor"
            value={fields.name}
            onChange={(e) => set('name', e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Work email <span className="text-red-500">*</span></Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="emeka@company.com"
            value={fields.email}
            onChange={(e) => set('email', e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="company">
            Company{' '}
            <span className="text-xs font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="company"
            placeholder="Consomo Africa Ltd"
            value={fields.company}
            onChange={(e) => set('company', e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
          <div className="relative">
            <Input
              id="password"
              type={show ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="pr-10"
              value={fields.password}
              onChange={(e) => set('password', e.target.value)}
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
          {fields.password && (
            <div className="mt-1.5 flex gap-1">
              {[8, 12, 16].map((n, i) => (
                <div
                  key={n}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    fields.password.length >= n
                      ? i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-blue-400' : 'bg-emerald-400'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm">Confirm password <span className="text-red-500">*</span></Label>
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat password"
            value={fields.confirmPassword}
            onChange={(e) => set('confirmPassword', e.target.value)}
            required
          />
        </div>

        <div className="flex items-start gap-2.5">
          <input
            id="terms"
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-input accent-blue-600"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <Label htmlFor="terms" className="cursor-pointer text-sm font-normal leading-snug">
            I agree to the{' '}
            <Link href="https://topiadesk.com/terms" className="text-blue-600 hover:underline" target="_blank">Terms of Service</Link>
            {' '}and{' '}
            <Link href="https://topiadesk.com/privacy" className="text-blue-600 hover:underline" target="_blank">Privacy Policy</Link>
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-700 text-white hover:bg-blue-800"
          disabled={loading}
        >
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account…</>
          ) : (
            <><UserPlus className="mr-2 h-4 w-4" /> Create account</>
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
