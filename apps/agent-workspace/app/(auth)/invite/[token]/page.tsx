'use client';

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { Avatar, AvatarFallback, Button, Input, Label, cn } from '@topiadesk/ui';
import { SsoButton } from '../../_components/sso-buttons';

/**
 * Mocked invite payloads. In real life these come from the API by token.
 * Try /invite/expired to see the expired state.
 */
interface Invite {
  tenant: { name: string; subdomain: string; logoEmoji: string };
  role: string;
  inviter: { name: string; email: string };
  inviteeEmail: string;
  expiresAt: string;
}

const SAMPLE_INVITE: Invite = {
  tenant: {
    name: 'ConsomoAfrica',
    subdomain: 'consomoafrica',
    logoEmoji: '🌍',
  },
  role: 'Helpdesk Agent',
  inviter: { name: 'Adaeze Nwosu', email: 'adaeze@consomoafrica.com' },
  inviteeEmail: 'tunde@consomoafrica.com',
  expiresAt: 'in 6 days',
};

const EXPIRED_TOKENS = new Set(['expired', 'invalid', 'used']);

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const isInvalid = EXPIRED_TOKENS.has(token);
  const invite = isInvalid ? null : SAMPLE_INVITE;

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [terms, setTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const strength = useMemo(() => scorePassword(password), [password]);
  const canAccept =
    name.trim().length > 1 &&
    password.length >= 8 &&
    strength.score >= 2 &&
    terms;

  function handleAccept(e: FormEvent) {
    e.preventDefault();
    if (!canAccept) return;
    setSubmitting(true);
    window.setTimeout(() => setSubmitting(false), 800);
  }

  if (isInvalid || !invite) {
    return (
      <div className="space-y-6">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-red-100 text-red-600">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <header>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Invitation is no longer valid
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This invitation has expired or has already been used. Ask the
            person who invited you to send a fresh one.
          </p>
        </header>
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-3 w-3" /> Already a member? Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-muted text-2xl">
            {invite.tenant.logoEmoji}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-3 w-3" />
              <span className="font-mono text-xs">
                {invite.tenant.subdomain}.topiadesk.com
              </span>
            </div>
            <p className="mt-1 font-display text-lg font-bold text-card-foreground">
              {invite.tenant.name}
            </p>
            <p className="text-sm text-muted-foreground">
              Role:{' '}
              <span className="font-medium text-foreground">{invite.role}</span>
            </p>
          </div>
        </div>
      </div>

      <header>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          You&rsquo;re invited
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          <Avatar className="mr-1 inline-flex h-5 w-5 align-text-bottom">
            <AvatarFallback>{initials(invite.inviter.name)}</AvatarFallback>
          </Avatar>{' '}
          <span className="font-medium text-foreground">
            {invite.inviter.name}
          </span>{' '}
          invited you to join{' '}
          <span className="font-medium text-foreground">
            {invite.tenant.name}
          </span>{' '}
          on Topiadesk. Invitation expires {invite.expiresAt}.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <SsoButton provider="google" />
        <SsoButton provider="microsoft" />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            or set a password
          </span>
        </div>
      </div>

      <form onSubmit={handleAccept} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={invite.inviteeEmail}
            readOnly
            className="cursor-not-allowed bg-muted text-muted-foreground"
          />
          <p className="text-xs text-muted-foreground">
            This is the email your invitation was sent to.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Your name</Label>
          <Input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tunde Bakare"
            autoComplete="name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Choose a password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
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
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-primary"
          />
          <span className="text-muted-foreground">
            I agree to the{' '}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
            .
          </span>
        </label>

        <Button
          type="submit"
          className="w-full"
          disabled={!canAccept || submitting}
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? 'Joining tenant' : `Accept and join ${invite.tenant.name}`}
        </Button>
      </form>

      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-3 w-3" />
        Topiadesk never asks for invitation tokens — only share them with
        people you trust.
      </div>
    </div>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return (parts[0] ?? '').slice(0, 2).toUpperCase();
  const first = parts[0] ?? '';
  const last = parts[parts.length - 1] ?? '';
  return (first.charAt(0) + last.charAt(0)).toUpperCase();
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
  const colors = ['bg-red-400', 'bg-amber-400', 'bg-amber-500', 'bg-emerald-500'];
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
