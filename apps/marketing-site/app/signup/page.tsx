'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  X,
} from 'lucide-react';
import { Button, Input, Label, Logo, cn } from '@topiadesk/ui';

type Step = 1 | 2 | 3;

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

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    subtitle: 'Free 14-day trial',
    seats: 'Up to 3 seats',
    recommended: false,
  },
  {
    id: 'standard',
    name: 'Standard',
    subtitle: 'Best for single-branch broking',
    seats: 'Up to 25 seats',
    recommended: true,
  },
  {
    id: 'professional',
    name: 'Professional',
    subtitle: 'Best for multi-branch brokers',
    seats: 'Up to 100 seats',
    recommended: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    subtitle: 'For large / regulated groups',
    seats: 'Unlimited seats',
    recommended: false,
  },
] as const;

type SubdomainState =
  | { status: 'idle' }
  | { status: 'checking' }
  | { status: 'available' }
  | { status: 'taken'; reason: string };

export default function SignupPage() {
  const [step, setStep] = useState<Step>(1);

  // Step 1 state
  const [companyName, setCompanyName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [planId, setPlanId] = useState<(typeof PLANS)[number]['id']>('standard');
  const [subdomainState, setSubdomainState] = useState<SubdomainState>({
    status: 'idle',
  });

  // Step 2 state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [terms, setTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Mock subdomain availability check.
  useEffect(() => {
    if (!subdomain) {
      setSubdomainState({ status: 'idle' });
      return;
    }
    const slug = subdomain.toLowerCase();
    if (!/^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/.test(slug)) {
      setSubdomainState({
        status: 'taken',
        reason:
          'Use 3-63 lowercase letters, digits and hyphens. Cannot start or end with a hyphen.',
      });
      return;
    }
    setSubdomainState({ status: 'checking' });
    const handle = window.setTimeout(() => {
      if (RESERVED_SUBDOMAINS.has(slug)) {
        setSubdomainState({
          status: 'taken',
          reason: 'This subdomain is reserved or already in use.',
        });
      } else {
        setSubdomainState({ status: 'available' });
      }
    }, 350);
    return () => window.clearTimeout(handle);
  }, [subdomain]);

  const passwordStrength = useMemo(() => scorePassword(password), [password]);

  const step1Valid =
    companyName.trim().length > 1 && subdomainState.status === 'available';
  const step2Valid =
    name.trim().length > 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    password.length >= 8 &&
    terms;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!step2Valid) return;
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setStep(3);
    }, 1000);
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[5fr_6fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-navy text-white lg:flex">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[var(--brand-orange)]/25 blur-[120px]" />
          <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[var(--brand-blue)]/15 blur-[110px]" />
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        <div className="relative z-10 p-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <Logo size={32} className="shrink-0" />
            <span className="font-display text-xl font-bold tracking-tight text-white">
              Topiadesk
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 p-10">
          <h2 className="font-display text-4xl font-bold leading-tight text-white">
            Spin up your own Topiadesk tenant in under two minutes.
          </h2>
          <ul className="space-y-3.5 text-sm text-white/85">
            {[
              'Fully isolated tenant on your own subdomain',
              'Unlimited end customers and tickets',
              'Asset CMDB, automations and SLAs out of the box',
              'No credit card required for the 14-day trial',
            ].map((line) => (
              <li key={line} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--brand-orange)] text-[#111111]">
                  <Check className="h-3 w-3" />
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 p-10 text-xs text-white/55">
          &copy; {new Date().getFullYear()} Tekktopia. All rights reserved.
        </div>
      </aside>

      <main className="flex items-start justify-center bg-background p-6 sm:p-10 lg:items-center">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <Logo size={28} className="shrink-0" />
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              Topiadesk
            </span>
          </Link>

          {step !== 3 && (
            <ol className="mb-8 flex items-center gap-3 text-xs font-medium">
              <StepDot index={1} active={step >= 1} current={step === 1}>
                Tenant
              </StepDot>
              <div className="h-px flex-1 bg-border" />
              <StepDot index={2} active={step >= 2} current={step === 2}>
                Account
              </StepDot>
              <div className="h-px flex-1 bg-border" />
              <StepDot index={3} active={false} current={false}>
                Done
              </StepDot>
            </ol>
          )}

          {step === 1 && (
            <Step1
              companyName={companyName}
              setCompanyName={setCompanyName}
              subdomain={subdomain}
              setSubdomain={setSubdomain}
              subdomainState={subdomainState}
              planId={planId}
              setPlanId={setPlanId}
              canContinue={step1Valid}
              onContinue={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <Step2
              companyName={companyName}
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              terms={terms}
              setTerms={setTerms}
              submitting={submitting}
              canSubmit={step2Valid}
              passwordStrength={passwordStrength}
              onBack={() => setStep(1)}
              onSubmit={handleSubmit}
            />
          )}

          {step === 3 && <Step3 subdomain={subdomain} email={email} />}
        </div>
      </main>
    </div>
  );
}

function StepDot({
  index,
  active,
  current,
  children,
}: {
  index: number;
  active: boolean;
  current: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold',
          current
            ? 'bg-[var(--brand-orange)] text-[#111111]'
            : active
              ? 'bg-[var(--brand-orange)] text-white'
              : 'bg-muted text-muted-foreground',
        )}
      >
        {active && !current ? <Check className="h-3 w-3" /> : index}
      </span>
      <span
        className={cn(
          'whitespace-nowrap',
          current ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {children}
      </span>
    </div>
  );
}

interface Step1Props {
  companyName: string;
  setCompanyName: (v: string) => void;
  subdomain: string;
  setSubdomain: (v: string) => void;
  subdomainState: SubdomainState;
  planId: (typeof PLANS)[number]['id'];
  setPlanId: (id: (typeof PLANS)[number]['id']) => void;
  canContinue: boolean;
  onContinue: () => void;
}

function Step1({
  companyName,
  setCompanyName,
  subdomain,
  setSubdomain,
  subdomainState,
  planId,
  setPlanId,
  canContinue,
  onContinue,
}: Step1Props) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Tell us about your team
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We&rsquo;ll provision a fully isolated tenant on your own subdomain.
        </p>
      </header>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company">Company name</Label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="company"
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="ConsomoAfrica"
              className="pl-9"
            />
          </div>
        </div>

        <SubdomainField
          subdomain={subdomain}
          setSubdomain={setSubdomain}
          state={subdomainState}
        />

        <div className="space-y-2">
          <Label>Plan</Label>
          <div className="space-y-2">
            {PLANS.map((p) => (
              <label
                key={p.id}
                className={cn(
                  'flex cursor-pointer items-start justify-between gap-3 rounded-md border p-3 text-sm transition-colors',
                  planId === p.id
                    ? 'border-[var(--brand-orange)] bg-[var(--brand-orange-soft)]'
                    : 'border-border bg-card hover:bg-muted',
                )}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {p.name}
                    </span>
                    {p.recommended && (
                      <span className="rounded-full bg-[var(--brand-orange-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--brand-orange-active)]">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{p.subtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-right text-xs font-medium text-foreground">
                    {p.seats}
                  </span>
                  <input
                    type="radio"
                    name="plan"
                    checked={planId === p.id}
                    onChange={() => setPlanId(p.id)}
                    className="h-4 w-4 accent-[var(--brand-orange)]"
                    aria-label={p.name}
                  />
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <Button
        type="button"
        className="w-full"
        onClick={onContinue}
        disabled={!canContinue}
      >
        Continue
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function SubdomainField({
  subdomain,
  setSubdomain,
  state,
}: {
  subdomain: string;
  setSubdomain: (v: string) => void;
  state: SubdomainState;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="subdomain">Tenant URL</Label>
      <div
        className={cn(
          'flex items-stretch overflow-hidden rounded-md border bg-card text-sm transition-colors',
          state.status === 'taken' ? 'border-red-300' : 'border-input',
          state.status === 'available' ? 'border-emerald-300' : '',
        )}
      >
        <input
          id="subdomain"
          type="text"
          value={subdomain}
          onChange={(e) =>
            setSubdomain(
              e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
            )
          }
          placeholder="consomoafrica"
          className="flex-1 bg-transparent px-3 py-2 outline-none placeholder:text-muted-foreground"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <div className="flex items-center gap-2 border-l border-input bg-muted px-3 text-sm text-muted-foreground">
          <span>.topiadesk.com</span>
          {state.status === 'checking' && (
            <Loader2 className="h-3 w-3 animate-spin" />
          )}
          {state.status === 'available' && (
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
          )}
          {state.status === 'taken' && (
            <X className="h-3 w-3 text-red-500" />
          )}
        </div>
      </div>
      {state.status === 'taken' && (
        <p className="text-xs text-red-600">{state.reason}</p>
      )}
      {state.status === 'available' && subdomain && (
        <p className="text-xs text-emerald-700">
          Great — <span className="font-mono">{subdomain}.topiadesk.com</span>{' '}
          is available.
        </p>
      )}
      {state.status === 'idle' && !subdomain && (
        <p className="text-xs text-muted-foreground">
          3-63 characters. Lowercase letters, digits and hyphens only.
        </p>
      )}
    </div>
  );
}

interface Step2Props {
  companyName: string;
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  terms: boolean;
  setTerms: (v: boolean) => void;
  submitting: boolean;
  canSubmit: boolean;
  passwordStrength: { score: number; label: string };
  onBack: () => void;
  onSubmit: (e: FormEvent) => void;
}

function Step2({
  companyName,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  terms,
  setTerms,
  submitting,
  canSubmit,
  passwordStrength,
  onBack,
  onSubmit,
}: Step2Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You&rsquo;ll be the first administrator of{' '}
          <strong className="text-foreground">
            {companyName || 'your tenant'}
          </strong>
          .
        </p>
      </header>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Your name</Label>
          <Input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Adaeze Nwosu"
            autoComplete="name"
          />
        </div>
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
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
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
              onClick={() => setShowPassword(!showPassword)}
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
          <PasswordStrengthBar strength={passwordStrength} hasValue={!!password} />
        </div>
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[var(--brand-orange)]"
          />
          <span className="text-muted-foreground">
            I agree to the{' '}
            <a href="#" className="text-[var(--brand-blue-active)] hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-[var(--brand-blue-active)] hover:underline">
              Privacy Policy
            </a>
            .
          </span>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={!canSubmit || submitting}
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? 'Creating tenant' : 'Create tenant'}
        </Button>
      </div>
    </form>
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

function Step3({ subdomain, email }: { subdomain: string; email: string }) {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
        <CheckCircle2 className="h-7 w-7" />
      </div>
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Check your inbox
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          A custom tenant will be sent to{' '}
          <span className="font-medium text-foreground">
            {email || 'your work email'}
          </span>{' '}
          soon — for you to enjoy Topiadesk free of charge for 14 days.
        </p>
      </header>

      <div className="rounded-md border border-border bg-muted/40 p-4 text-left">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Your workspace
        </p>
        <p className="mt-1 font-mono text-sm text-foreground">
          {subdomain || 'your-tenant'}.topiadesk.com
        </p>
      </div>

      <div className="pt-1">
        <Button asChild variant="outline" className="w-full">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
}
