'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Loader2,
  Sparkles,
  X,
} from 'lucide-react';
import { Button, cn } from '@topiadesk/ui';

const RESERVED_SUBDOMAINS = new Set([
  'www',
  'api',
  'admin',
  'app',
  'mail',
  'support',
  'help',
  'topiadesk',
  'tekktopia',
  'status',
  'docs',
  'learn',
  'credentials',
]);

type SubdomainState =
  | { status: 'idle' }
  | { status: 'invalid'; reason: string }
  | { status: 'checking' }
  | { status: 'available' }
  | { status: 'taken'; reason: string };

const SUGGESTION_TEMPLATES = ['{}-hq', '{}-support', '{}-team', '{}-app'];

export default function ClaimSubdomainPage() {
  const [subdomain, setSubdomain] = useState('');
  const [state, setState] = useState<SubdomainState>({ status: 'idle' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!subdomain) {
      setState({ status: 'idle' });
      return;
    }
    if (!/^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/.test(subdomain)) {
      setState({
        status: 'invalid',
        reason:
          '3-63 characters. Lowercase letters, digits and hyphens only. Cannot start or end with a hyphen.',
      });
      return;
    }
    setState({ status: 'checking' });
    const handle = window.setTimeout(() => {
      if (RESERVED_SUBDOMAINS.has(subdomain)) {
        setState({
          status: 'taken',
          reason: 'This name is reserved or already claimed.',
        });
      } else {
        setState({ status: 'available' });
      }
    }, 350);
    return () => window.clearTimeout(handle);
  }, [subdomain]);

  const suggestions = useMemo(() => {
    if (state.status !== 'taken' || !subdomain) return [];
    return SUGGESTION_TEMPLATES.map((tpl) => tpl.replace('{}', subdomain));
  }, [state, subdomain]);

  function handleReserve(e: FormEvent) {
    e.preventDefault();
    if (state.status !== 'available') return;
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 700);
  }

  if (done) {
    return (
      <SplitLayout>
        <div className="space-y-6 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <header>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              <span className="font-mono">{subdomain}</span> is reserved
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We&rsquo;re holding{' '}
              <span className="font-mono text-foreground">
                {subdomain}.topiadesk.com
              </span>{' '}
              for you for 30 days. Finish creating your tenant to claim it
              permanently.
            </p>
          </header>
          <Button asChild className="w-full">
            <Link href={`/signup?subdomain=${encodeURIComponent(subdomain)}`}>
              Finish creating tenant
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </SplitLayout>
    );
  }

  return (
    <SplitLayout>
      <div className="space-y-8">
        <header className="space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange">
            <Sparkles className="h-3 w-3" />
            Claim your URL
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight">
            Pick your tenant&rsquo;s home on Topiadesk.
          </h1>
          <p className="text-base text-muted-foreground">
            Your subdomain is permanent and visible to your customers. Choose
            something short, recognisable, and easy to spell aloud.
          </p>
        </header>

        <form onSubmit={handleReserve} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your tenant URL
            </span>
            <div
              className={cn(
                'flex items-stretch overflow-hidden rounded-xl border-2 bg-card text-base shadow-sm transition-colors',
                state.status === 'available' && 'border-emerald-400',
                (state.status === 'taken' || state.status === 'invalid') &&
                  'border-red-300',
                (state.status === 'idle' || state.status === 'checking') &&
                  'border-input focus-within:border-primary',
              )}
            >
              <div className="grid w-12 place-items-center bg-muted text-muted-foreground">
                <Globe className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={subdomain}
                onChange={(e) =>
                  setSubdomain(
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                  )
                }
                placeholder="your-tenant"
                className="flex-1 bg-transparent px-3 py-4 text-lg font-medium outline-none placeholder:text-muted-foreground"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                autoFocus
              />
              <div className="flex items-center gap-2 border-l border-input bg-muted px-4 text-sm text-muted-foreground">
                <span className="font-mono">.topiadesk.com</span>
                {state.status === 'checking' && (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
                {state.status === 'available' && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                )}
                {(state.status === 'taken' || state.status === 'invalid') && (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          </label>

          {state.status === 'invalid' && (
            <p className="text-sm text-red-600">{state.reason}</p>
          )}
          {state.status === 'taken' && (
            <div className="space-y-3">
              <p className="text-sm text-red-600">{state.reason}</p>
              {suggestions.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Try one of these instead:
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setSubdomain(s)}
                        className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {state.status === 'available' && (
            <p className="text-sm text-emerald-700">
              <CheckCircle2 className="mr-1 inline-block h-3 w-3 align-text-bottom" />
              <span className="font-mono">{subdomain}.topiadesk.com</span> is
              available.
            </p>
          )}
          {state.status === 'idle' && (
            <p className="text-sm text-muted-foreground">
              3-63 characters. Lowercase letters, digits and hyphens only.
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={state.status !== 'available' || submitting}
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? 'Reserving' : 'Reserve this URL'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="text-xs text-muted-foreground">
          Reserved for 30 days. Already have a tenant?{' '}
          <a
            href="https://app.topiadesk.com/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </a>
          .
        </p>
      </div>
    </SplitLayout>
  );
}

function SplitLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[5fr_6fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-navy bg-dot-navy text-white lg:flex">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue/20 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-orange/15 blur-3xl" />
        </div>

        <div className="relative z-10 p-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-orange shadow-lg shadow-orange/30">
              <span className="font-display text-lg font-black text-white">
                T
              </span>
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              Topiadesk
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 p-10">
          <h2 className="font-display text-4xl font-bold leading-tight">
            Your subdomain is your customers&rsquo; front door.
          </h2>
          <ul className="space-y-3 text-sm text-white/80">
            {[
              'Fully isolated tenant boundary',
              'Wildcard TLS — works from day one',
              'Optional vanity domain (support.yourbrand.com) on Business+',
              'Reserved free for 30 days',
            ].map((line) => (
              <li key={line} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-orange/20 text-orange">
                  <CheckCircle2 className="h-3 w-3" />
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 p-10 text-xs text-white/40">
          &copy; {new Date().getFullYear()} Tekktopia. All rights reserved.
        </div>
      </aside>

      <main className="flex items-center justify-center bg-background p-6 sm:p-10">
        <div className="w-full max-w-lg">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-orange">
              <span className="font-display text-base font-black text-white">
                T
              </span>
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              Topiadesk
            </span>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
