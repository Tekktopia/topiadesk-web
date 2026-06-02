'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CircleCheck,
  Layers,
  Loader2,
  Plus,
  Tag,
  X,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Switch,
  cn,
} from '@topiadesk/ui';
import type { TenantPlan } from '@/lib/mock-data';

const SLUGS: TenantPlan[] = ['starter', 'business', 'enterprise'];

const SUGGESTED_FEATURES = [
  'Helpdesk + Asset cores',
  'WhatsApp & SMS channels',
  'Unlimited automations',
  'SSO (SAML / OIDC)',
  'Asset discovery agent',
  'Custom roles',
  'Sandbox environment',
  'On-premises deployment',
  'Priority support',
];

export default function NewPlanPage() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState<TenantPlan>('business');
  const [price, setPrice] = useState('24');
  const [unlimited, setUnlimited] = useState(false);
  const [agentLimit, setAgentLimit] = useState('25');
  const [storage, setStorage] = useState('200');
  const [features, setFeatures] = useState<string[]>(['Helpdesk + Asset cores']);
  const [featureInput, setFeatureInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim().length > 1 && Number(price) >= 0;

  function addFeature(f: string) {
    const v = f.trim();
    if (!v || features.includes(v)) return;
    setFeatures([...features, v]);
    setFeatureInput('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    window.setTimeout(() => setSubmitting(false), 800);
  }

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
        <div className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link href="/plans" className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white">
                <ArrowLeft className="h-3 w-3" /> Plans
              </Link>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">New plan</h1>
              <p className="mt-0.5 text-sm text-white/70">Define pricing, limits, and the feature set tenants get on this tier.</p>
            </div>
            <Button form="new-plan-form" type="submit" size="sm" disabled={!canSubmit || submitting} className="bg-coral text-white hover:bg-coral-dark">
              {submitting && <Loader2 className="h-3 w-3 animate-spin" />} Save plan
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <form id="new-plan-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="flex items-center gap-2 text-sm"><Layers className="h-4 w-4 text-coral" /> Identity</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Display name *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Growth" />
                </div>
                <div className="space-y-2">
                  <Label>Tier slug</Label>
                  <div className="flex gap-1.5">
                    {SLUGS.map((s) => (
                      <button key={s} type="button" onClick={() => setSlug(s)}
                        className={cn('flex-1 rounded-md border py-2 text-[11px] capitalize transition-colors',
                          slug === s ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card hover:bg-muted')}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Pricing &amp; limits</CardTitle></CardHeader>
              <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="price">Price / agent / mo (USD)</Label>
                  <Input id="price" type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storage">Storage (GB)</Label>
                  <Input id="storage" type="number" min={0} value={storage} onChange={(e) => setStorage(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agents">Agent limit</Label>
                  <Input id="agents" type="number" min={0} value={agentLimit} disabled={unlimited}
                    onChange={(e) => setAgentLimit(e.target.value)} className={cn(unlimited && 'opacity-50')} />
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-xs sm:col-span-3">
                  <Switch checked={unlimited} onCheckedChange={setUnlimited} />
                  Unlimited agent seats
                </label>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="flex items-center gap-2 text-sm"><Tag className="h-4 w-4 text-coral" /> Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-6">
                <ul className="space-y-1.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-center justify-between rounded-md border bg-card px-3 py-2 text-xs">
                      <span className="flex items-center gap-2"><CircleCheck className="h-3.5 w-3.5 text-emerald-500" /> {f}</span>
                      <button type="button" onClick={() => setFeatures(features.filter((x) => x !== f))} aria-label={`Remove ${f}`}>
                        <X className="h-3 w-3 text-muted-foreground hover:text-red-600" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <Input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(featureInput); } }}
                    placeholder="Add a feature line, press Enter" className="h-8 text-xs" />
                  <Button type="button" variant="outline" size="sm" onClick={() => addFeature(featureInput)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 text-[10px]">
                  <span className="text-muted-foreground">Suggested:</span>
                  {SUGGESTED_FEATURES.filter((s) => !features.includes(s)).map((s) => (
                    <button key={s} type="button" onClick={() => addFeature(s)} className="rounded-full bg-muted px-2 py-0.5 hover:bg-muted/70">
                      + {s}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Preview</CardTitle></CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <p className="text-base font-bold">{name || 'Untitled plan'}</p>
                <p className="text-2xl font-bold">${price || '0'}<span className="text-[10px] font-normal text-muted-foreground">/agent/mo</span></p>
                <Badge variant="outline" className="capitalize">{slug}</Badge>
                <p className="text-muted-foreground">{unlimited ? 'Unlimited' : `${agentLimit} agents`} · {storage} GB storage</p>
                <ul className="space-y-1 pt-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5"><CircleCheck className="h-3 w-3 text-emerald-500" /> {f}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Badge variant="outline" className="mx-auto block w-fit text-[10px]">New tenants can select this plan immediately</Badge>
          </aside>
        </form>
      </div>
    </div>
  );
}
