'use client';

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  X,
} from 'lucide-react';
import { Button, Input, Label, cn } from '@topiadesk/ui';

/**
 * Demonstration token states. In real life these come from the API.
 * Try /reset/expired or /reset/invalid to see the error states.
 */
const EXPIRED_TOKENS = new Set(['expired', 'invalid', 'used']);

export default function ResetWithTokenPage() {
  const { token } = useParams<{ token: string }>();
  const isInvalid = EXPIRED_TOKENS.has(token);

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const strength = useMemo(() => scorePassword(password), [password]);
  const passwordsMatch = confirm.length > 0 && password === confirm;
  const canSubmit =
    password.length >= 8 && passwordsMatch && strength.score >= 2;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 800);
  }

  if (isInvalid) {
    return (
      <div className="space-y-6">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-red-100 text-red-600">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <header>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            This reset link won&rsquo;t work
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            It may have expired (links are valid for 60 minutes) or already
            been used. Request a fresh link to continue.
          </p>
        </header>

        <Button asChild className="w-full">
          <Link href="/reset">Request a new link</Link>
        </Button>

        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> Back to sign in
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="space-y-6">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <header>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Password updated
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You can now sign in to your tenant with your new password.
          </p>
        </header>
        <Button asChild className="w-full">
          <Link href="/login">Continue to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Choose a new password
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pick something memorable — but not something you&rsquo;ve used
          elsewhere.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <PasswordStrengthBar strength={strength} hasValue={!!password} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm new password</Label>
          <div className="relative">
            <Input
              id="confirm"
              type={showPassword ? 'text' : 'password'}
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              placeholder="Type it again"
              className="pr-10"
              aria-invalid={confirm.length > 0 && !passwordsMatch}
            />
            {confirm.length > 0 && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                {passwordsMatch ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </div>
            )}
          </div>
          {confirm.length > 0 && !passwordsMatch && (
            <p className="text-xs text-red-600">Passwords don&rsquo;t match.</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!canSubmit || submitting}
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? 'Updating password' : 'Update password'}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        Signed-out everywhere else after this change for your security.
      </p>
    </div>
  );
}

function PasswordStrengthBar({
  strength,
  hasValue,
}: {
  strength: { score: number; label: string };
  hasValue: boolean;
}) {
  if (!hasValue) {
    return (
      <p className="text-xs text-muted-foreground">
        Use at least 8 characters, mixing letters, numbers and symbols.
      </p>
    );
  }
  const colors = [
    'bg-red-400',
    'bg-amber-400',
    'bg-amber-500',
    'bg-emerald-500',
  ];
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-1.5 flex-1 gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              'flex-1 rounded-full transition-colors',
              i < strength.score
                ? colors[Math.min(strength.score - 1, colors.length - 1)]
                : 'bg-muted',
            )}
          />
        ))}
      </div>
      <span className="w-16 text-right text-xs text-muted-foreground">
        {strength.label}
      </span>
    </div>
  );
}

function scorePassword(password: string): { score: number; label: string } {
  if (!password) return { score: 0, label: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) && /[^a-zA-Z0-9]/.test(password)) score++;
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  return { score, label: labels[Math.max(0, score - 1)] ?? '' };
}
