'use client';

import { useState } from 'react';
import {
  CheckCircle2, ChevronRight, CreditCard, FileCheck2, Globe, Mail,
  Settings2, ShieldCheck, Sparkles, UserPlus, Workflow,
} from 'lucide-react';
import {
  Badge, Button, Input, Label, Switch, cn,
} from '@topiadesk/ui';

interface OnboardingStep {
  id: string; name: string; icon: typeof UserPlus; description: string;
  enabled: boolean; required: boolean; avgTime: string;
}

const STEPS: OnboardingStep[] = [
  { id: 'signup',       name: 'Account signup',          icon: UserPlus,    description: 'Email + password or SSO, captcha protection', enabled: true,  required: true,  avgTime: '1m 12s' },
  { id: 'verify',       name: 'Email verification',      icon: Mail,        description: 'Verification link with 24h expiry',           enabled: true,  required: true,  avgTime: '4m 38s' },
  { id: 'workspace',    name: 'Workspace creation',      icon: Globe,       description: 'Subdomain selection, region, timezone',       enabled: true,  required: true,  avgTime: '48s' },
  { id: 'plan',         name: 'Plan selection',          icon: CreditCard,  description: '14-day trial on Pro, then choose tier',       enabled: true,  required: false, avgTime: '1m 52s' },
  { id: 'invite',       name: 'Invite team',             icon: UserPlus,    description: 'Bulk invite up to 25 teammates',              enabled: true,  required: false, avgTime: '2m 04s' },
  { id: 'channels',     name: 'Connect channels',        icon: Workflow,    description: 'Email forwarding, web widget, WhatsApp',      enabled: true,  required: false, avgTime: '3m 22s' },
  { id: 'branding',     name: 'Customize branding',      icon: Sparkles,    description: 'Logo, colors, portal subdomain',              enabled: false, required: false, avgTime: '4m 11s' },
  { id: 'compliance',   name: 'Compliance acknowledgement', icon: ShieldCheck, description: 'GDPR / NDPR / POPIA consent forms',       enabled: true,  required: true,  avgTime: '38s' },
  { id: 'launch',       name: 'Launch checklist',        icon: FileCheck2,  description: 'Final review and go-live confirmation',       enabled: true,  required: false, avgTime: '1m 48s' },
];

const FUNNEL = [
  { step: 'Signup started',     count: 1_842, rate: 100 },
  { step: 'Email verified',     count: 1_421, rate: 77.1 },
  { step: 'Workspace created',  count: 1_312, rate: 71.2 },
  { step: 'Plan selected',      count: 1_198, rate: 65.0 },
  { step: 'First channel set',  count:   942, rate: 51.1 },
  { step: 'First ticket',       count:   721, rate: 39.1 },
  { step: 'Activated (7-day)',  count:   612, rate: 33.2 },
];

export default function TenantOnboardingPage() {
  const [steps, setSteps] = useState(STEPS);
  const [trialDays, setTrialDays] = useState('14');
  const [defaultPlan, setDefaultPlan] = useState('pro');
  const [requireCC, setRequireCC] = useState(false);
  const [autoActivate, setAutoActivate] = useState(true);

  const toggle = (id: string) =>
    setSteps((prev) => prev.map((s) => (s.id === id && !s.required ? { ...s, enabled: !s.enabled } : s)));

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
        <header className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Super Admin</p>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">Tenant Onboarding</h1>
              <p className="mt-0.5 text-sm text-white/70">
                Configure the signup flow new tenants experience — {steps.filter((s) => s.enabled).length} of {steps.length} steps enabled
              </p>
            </div>
            <Button size="sm" className="bg-coral text-white hover:bg-coral-dark">
              Save & publish
            </Button>
          </div>
        </header>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-xl border border-border/70 bg-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-sm font-bold">Signup flow steps</h3>
                  <p className="text-[11px] text-muted-foreground">Drag to reorder · toggle to enable/disable</p>
                </div>
                <Badge variant="secondary" className="text-[10px]">Avg total: 19m 11s</Badge>
              </div>
              <div className="mt-4 space-y-2">
                {steps.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.id} className={cn('flex items-center gap-3 rounded-lg border bg-background p-3 transition-opacity',
                      !s.enabled && 'opacity-50')}>
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-[10px] font-bold">
                        {i + 1}
                      </span>
                      <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                        s.enabled ? 'bg-coral/10 text-coral' : 'bg-muted text-muted-foreground')}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{s.name}</p>
                          {s.required && <Badge variant="secondary" className="text-[9px]">Required</Badge>}
                        </div>
                        <p className="truncate text-[11px] text-muted-foreground">{s.description}</p>
                      </div>
                      <div className="hidden text-right text-[10px] text-muted-foreground sm:block">
                        <p className="uppercase tracking-wide">Avg time</p>
                        <p className="font-mono">{s.avgTime}</p>
                      </div>
                      <Switch checked={s.enabled} onCheckedChange={() => toggle(s.id)} disabled={s.required} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-border/70 bg-card p-5">
              <h3 className="font-display text-sm font-bold">Activation funnel (last 30 days)</h3>
              <p className="text-[11px] text-muted-foreground">Where prospects drop off in your signup flow</p>
              <div className="mt-4 space-y-2">
                {FUNNEL.map((f, i) => (
                  <div key={f.step}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">{f.step}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {f.count.toLocaleString()} <span className="ml-1.5 font-semibold text-foreground">{f.rate}%</span>
                      </span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                      <div className={cn('h-full rounded-full transition-all',
                        i === 0 ? 'bg-emerald-500' :
                        f.rate >= 60 ? 'bg-blue-500' :
                        f.rate >= 40 ? 'bg-amber-500' : 'bg-red-500')}
                        style={{ width: `${f.rate}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-xl border border-border/70 bg-card p-5">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-coral" />
                <h3 className="font-display text-sm font-bold">Default settings</h3>
              </div>
              <div className="mt-4 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Trial duration (days)</Label>
                  <Input type="number" value={trialDays} onChange={(e) => setTrialDays(e.target.value)} className="h-8 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Default trial plan</Label>
                  <select value={defaultPlan} onChange={(e) => setDefaultPlan(e.target.value)}
                    className="h-8 w-full rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring">
                    <option value="starter">Starter</option>
                    <option value="pro">Pro</option>
                    <option value="business">Business</option>
                  </select>
                </div>
                <div className="flex items-center justify-between rounded-lg border bg-background p-3">
                  <div className="pr-3">
                    <p className="text-xs font-semibold">Require credit card upfront</p>
                    <p className="text-[10px] text-muted-foreground">Reduces signup volume but improves activation</p>
                  </div>
                  <Switch checked={requireCC} onCheckedChange={setRequireCC} />
                </div>
                <div className="flex items-center justify-between rounded-lg border bg-background p-3">
                  <div className="pr-3">
                    <p className="text-xs font-semibold">Auto-activate on first ticket</p>
                    <p className="text-[10px] text-muted-foreground">Skip manual review for low-risk regions</p>
                  </div>
                  <Switch checked={autoActivate} onCheckedChange={setAutoActivate} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/70 bg-card p-5">
              <h3 className="font-display text-sm font-bold">Recent signups</h3>
              <div className="mt-3 space-y-2">
                {[
                  { name: 'Sterling Cooper', email: 'admin@sterlingcooper.io', step: 'Plan selection',     ago: '4m ago',  ok: true },
                  { name: 'Pied Piper',      email: 'richard@piedpiper.com',   step: 'Activated',          ago: '38m ago', ok: true },
                  { name: 'Hooli Inc',       email: 'gavin@hooli.com',         step: 'Email verification', ago: '1h ago',  ok: false },
                  { name: 'Soylent Corp',    email: 'ops@soylent.co',          step: 'Workspace created',  ago: '2h ago',  ok: true },
                ].map((u) => (
                  <div key={u.email} className="flex items-center gap-2 rounded-lg border bg-background p-2.5 text-xs">
                    <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-bold text-white',
                      u.ok ? 'bg-emerald-500' : 'bg-amber-500')}>
                      {u.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{u.name}</p>
                      <p className="truncate text-[10px] text-muted-foreground">{u.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-medium">{u.step}</p>
                      <p className="text-[10px] text-muted-foreground">{u.ago}</p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-xs font-semibold text-emerald-900">Onboarding health: Good</p>
                  <p className="mt-0.5 text-[11px] text-emerald-800/80">
                    33.2% 7-day activation is above the SaaS benchmark of 28%. Email verification is your biggest drop-off — consider adding a magic-link option.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
