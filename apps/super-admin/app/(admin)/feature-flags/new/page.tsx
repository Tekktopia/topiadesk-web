'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Flag, Loader2, Sparkles } from 'lucide-react';
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
  Textarea,
  cn,
} from '@topiadesk/ui';
import type { TenantPlan } from '@/lib/mock-data';

const PLANS: TenantPlan[] = ['starter', 'business', 'enterprise'];

function keyify(v: string) {
  return v.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

export default function NewFeatureFlagPage() {
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [keyTouched, setKeyTouched] = useState(false);
  const [description, setDescription] = useState('');
  const [enabledGlobally, setEnabledGlobally] = useState(false);
  const [plans, setPlans] = useState<TenantPlan[]>([]);
  const [rollout, setRollout] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const effectiveKey = keyTouched ? key : keyify(name);
  const canSubmit = name.trim().length > 1 && !!effectiveKey;

  function togglePlan(p: TenantPlan) {
    setPlans((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
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
              <Link href="/feature-flags" className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white">
                <ArrowLeft className="h-3 w-3" /> Feature flags
              </Link>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">New feature flag</h1>
              <p className="mt-0.5 text-sm text-white/70">Gate a feature behind a flag for staged rollout across tenants.</p>
            </div>
            <Button form="new-flag-form" type="submit" size="sm" disabled={!canSubmit || submitting} className="bg-coral text-white hover:bg-coral-dark">
              {submitting && <Loader2 className="h-3 w-3 animate-spin" />} Create flag
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <form id="new-flag-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="flex items-center gap-2 text-sm"><Flag className="h-4 w-4 text-coral" /> Identity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. AI suggested replies" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="key">Flag key</Label>
                  <Input id="key" value={effectiveKey} onChange={(e) => { setKeyTouched(true); setKey(keyify(e.target.value)); }}
                    placeholder="ai_suggested_replies" className="font-mono text-sm" />
                  <p className="text-[11px] text-muted-foreground">Referenced in code. Lowercase, underscores only.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea id="desc" rows={2} value={description} onChange={(e) => setDescription(e.target.value)}
                    placeholder="What does this flag control?" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Targeting</CardTitle></CardHeader>
              <CardContent className="space-y-4 p-6">
                <label className="flex cursor-pointer items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="text-sm font-medium">Enabled globally</p>
                    <p className="text-[11px] text-muted-foreground">On for every tenant, overriding plan and rollout settings.</p>
                  </div>
                  <Switch checked={enabledGlobally} onCheckedChange={setEnabledGlobally} />
                </label>
                <div className={cn('space-y-2', enabledGlobally && 'opacity-50 pointer-events-none')}>
                  <Label>Enable for plans</Label>
                  <div className="flex gap-1.5">
                    {PLANS.map((p) => (
                      <button key={p} type="button" onClick={() => togglePlan(p)}
                        className={cn('flex-1 rounded-md border py-2 text-[11px] capitalize transition-colors',
                          plans.includes(p) ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card hover:bg-muted')}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={cn('space-y-2', enabledGlobally && 'opacity-50 pointer-events-none')}>
                  <div className="flex items-center justify-between">
                    <Label>Percentage rollout</Label>
                    <span className="text-xs font-semibold">{rollout}%</span>
                  </div>
                  <input type="range" min={0} max={100} step={5} value={rollout}
                    onChange={(e) => setRollout(Number(e.target.value))} className="w-full accent-coral" />
                  <p className="text-[11px] text-muted-foreground">Gradually expose to a random share of eligible tenants.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Preview</CardTitle></CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <p className="font-semibold">{name || 'Untitled flag'}</p>
                <code className="block rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">{effectiveKey || 'flag_key'}</code>
                <div className="flex flex-wrap gap-1 pt-1">
                  {enabledGlobally ? (
                    <Badge className="bg-emerald-100 text-emerald-700">Global ON</Badge>
                  ) : (
                    <>
                      {plans.length === 0 && rollout === 0 && <Badge variant="outline">Off (no targets)</Badge>}
                      {plans.map((p) => <Badge key={p} variant="outline" className="capitalize">{p}</Badge>)}
                      {rollout > 0 && <Badge variant="outline">{rollout}% rollout</Badge>}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Tips</CardTitle></CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <Tip text="Start at 0% and ramp; you can dial rollout up without a deploy." />
                <Tip text="Per-tenant overrides can be added from the flag detail page after creation." />
              </CardContent>
            </Card>
          </aside>
        </form>
      </div>
    </div>
  );
}

function Tip({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-md bg-muted/40 p-2">
      <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-coral" />
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}
