'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { Button, Input, Label } from '@topiadesk/ui';

export default function ResetPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 700);
  }

  if (sent) {
    return (
      <div className="space-y-6">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-blue-100 text-primary">
          <Mail className="h-6 w-6" />
        </div>
        <header>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Check your email
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            If an account exists for{' '}
            <strong className="text-foreground">{email}</strong>, we&rsquo;ve
            sent password reset instructions.
          </p>
        </header>

        <div className="rounded-md border border-border bg-muted p-4 text-sm text-muted-foreground">
          The reset link expires in 60 minutes. Check your spam folder if you
          don&rsquo;t see it within a few minutes.
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setSent(false)}
            className="flex-1"
          >
            Try a different email
          </Button>
          <Button asChild className="flex-1">
            <Link href="/login">Back to sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/login"
        className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" /> Back to sign in
      </Link>

      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Reset your password
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the email you use for Topiadesk and we&rsquo;ll send you a link
          to set a new password.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourcompany.com"
            autoComplete="email"
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={submitting || !email}
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? 'Sending' : 'Send reset instructions'}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        Need help? Contact your tenant administrator or{' '}
        <a
          href="mailto:support@topiadesk.com"
          className="font-medium text-primary hover:underline"
        >
          Topiadesk support
        </a>
        .
      </p>
    </div>
  );
}
