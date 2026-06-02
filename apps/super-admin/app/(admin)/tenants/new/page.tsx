'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  CircleCheck,
  Copy,
  Globe,
  Info,
  Loader2,
  Mail,
  Rocket,
  Server,
  ShieldCheck,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
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
import { mockPlans } from '@/lib/mock-data';

// Reserved subdomain labels — see PRD §7.3.1
const RESERVED = [
  'www', 'admin', 'api', 'status', 'app', 'docs', 'help',
  'support', 'mail', 'blog', 'dev', 'staging', 'test', 'public',
];

const REGIONS = [
  { id: 'af-south-1', label: 'Cape Town (af-south-1)', note: 'Primary for African tenants' },
  { id: 'eu-west-1', label: 'Ireland (eu-west-1)', note: 'EU tenants · DR for Africa' },
  { id: 'us-east-1', label: 'N. Virginia (us-east-1)', note: 'North-American tenants' },
  { id: 'europe-west2', label: 'London (GCP europe-west2)', note: 'Strict EU residency' },
];

const INDUSTRIES = [
  'Financial Services', 'Healthcare', 'Education', 'Retail',
  'Telecom', 'Managed Service Provider', 'Government', 'Other',
];

function slugify(v: string) {
  return v
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function CreateTenantPage() {
  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [subdomainTouched, setSubdomainTouched] = useState(false);
  const [plan, setPlan] = useState<TenantPlan>('business');
  const [region, setRegion] = useState(REGIONS[0]!.id);
  const [industry, setIndustry] = useState(INDUSTRIES[0]!);
  const [country, setCountry] = useState('Nigeria');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [trial, setTrial] = useState(true);
  const [sendActivation, setSendActivation] = useState(true);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);

  const effectiveSubdomain = subdomainTouched ? subdomain : slugify(name);
  const selectedPlan = mockPlans.find((p) => p.slug === plan) ?? mockPlans[0]!;

  const subdomainError = useMemo(() => {
    if (!effectiveSubdomain) return null;
    if (effectiveSubdomain.length < 3 || effectiveSubdomain.length > 63)
      return 'Must be 3–63 characters.';
    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(effectiveSubdomain))
      return 'Lowercase letters, digits and hyphens only; cannot start or end with a hyphen.';
    if (RESERVED.includes(effectiveSubdomain)) return 'This subdomain is reserved.';
    return null;
  }, [effectiveSubdomain]);

  const valid =
    name.trim().length > 1 &&
    !!effectiveSubdomain &&
    !subdomainError &&
    ownerName.trim().length > 1 &&
    /.+@.+\..+/.test(ownerEmail);

  async function handleCreate() {
    if (!valid) return;
    setCreating(true);
    await new Promise((r) => setTimeout(r, 900));
    setCreating(false);
    setCreated(true);
  }

  // ─── Success ───
  if (created) {
    const url = `${effectiveSubdomain}.topiadesk.com`;
    return (
      <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-2xl pt-10">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100">
              <CircleCheck className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="mt-4 text-center text-2xl font-bold text-foreground">Tenant provisioned</h2>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{name}</span> is now{' '}
              {trial ? 'on a 21-day trial' : 'active'} in{' '}
              {REGIONS.find((r) => r.id === region)?.label}.
            </p>

            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Globe className="h-4 w-4 text-coral" /> Tenant URL
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded-md border bg-card px-3 py-2 font-mono text-sm">
                    https://{url}
                  </code>
                  <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(`https://${url}`)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="rounded-md border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900">
                  <p className="flex items-start gap-1.5">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>
                      Wildcard DNS + TLS are provisioning (typically &lt; 2 min). Default config (roles,
                      SLAs, ticket statuses, KB) is being seeded.
                      {sendActivation && ` An activation email has been sent to ${ownerEmail}.`}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 flex justify-center gap-2">
              <Button asChild>
                <Link href="/tenants">Back to tenants</Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCreated(false); setName(''); setSubdomain(''); setSubdomainTouched(false);
                  setOwnerName(''); setOwnerEmail('');
                }}
              >
                Provision another
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Form ───
  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
        <header className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="relative">
            <Link href="/tenants" className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white/90">
              <ArrowLeft className="h-3 w-3" /> All tenants
            </Link>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-white">Provision a new tenant</h1>
            <p className="mt-0.5 text-sm text-white/70">
              Spin up an isolated tenant with its own subdomain, data namespace, and seeded configuration.
            </p>
          </div>
        </header>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Building2 className="h-4 w-4 text-coral" /> Organisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Company name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Consomo Africa" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sub">Subdomain</Label>
                  <div className="flex items-center">
                    <Input
                      id="sub"
                      value={effectiveSubdomain}
                      onChange={(e) => { setSubdomainTouched(true); setSubdomain(slugify(e.target.value)); }}
                      placeholder="consomoafrica"
                      className="rounded-r-none"
                    />
                    <span className="inline-flex h-9 items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                      .topiadesk.com
                    </span>
                  </div>
                  {subdomainError ? (
                    <p className="text-[11px] text-red-600">{subdomainError}</p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">Globally unique. Auto-filled from the company name.</p>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Industry</Label>
                    <Picker value={industry} options={INDUSTRIES} onChange={setIndustry} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Rocket className="h-4 w-4 text-coral" /> Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:grid-cols-3">
                  {mockPlans.map((p) => {
                    const selected = plan === p.slug;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPlan(p.slug)}
                        className={cn(
                          'rounded-lg border p-3.5 text-left transition-all',
                          selected ? 'border-coral/40 bg-coral/5 ring-2 ring-coral/20' : 'border-border bg-card hover:border-coral/20',
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold capitalize">{p.name}</p>
                          {selected && <CircleCheck className="h-4 w-4 text-coral" />}
                        </div>
                        <p className="mt-1 text-lg font-bold">${p.priceMonthly}<span className="text-[10px] font-normal text-muted-foreground">/agent/mo</span></p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {p.agentLimit ? `${p.agentLimit} agents` : 'Unlimited agents'} · {p.storageLimitGb} GB
                        </p>
                      </button>
                    );
                  })}
                </div>
                <label className="mt-3 flex cursor-pointer items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="text-sm font-medium">Start on 21-day trial</p>
                    <p className="text-[11px] text-muted-foreground">No card required; converts to {plan} at trial end.</p>
                  </div>
                  <Switch checked={trial} onCheckedChange={setTrial} />
                </label>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Server className="h-4 w-4 text-coral" /> Data residency
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 sm:grid-cols-2">
                {REGIONS.map((r) => {
                  const selected = region === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRegion(r.id)}
                      className={cn(
                        'rounded-lg border p-3 text-left text-xs transition-all',
                        selected ? 'border-coral/40 bg-coral/5 ring-2 ring-coral/20' : 'border-border bg-card hover:border-coral/20',
                      )}
                    >
                      <p className="font-semibold">{r.label}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">{r.note}</p>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Mail className="h-4 w-4 text-coral" /> Tenant admin (owner)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="oname">Full name</Label>
                    <Input id="oname" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="e.g. Adaeze Okafor" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="oemail">Work email</Label>
                    <Input id="oemail" type="email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} placeholder="adaeze@consomoafrica.com" />
                  </div>
                </div>
                <label className="flex cursor-pointer items-center justify-between border-t pt-3">
                  <div>
                    <p className="text-sm font-medium">Send activation email</p>
                    <p className="text-[11px] text-muted-foreground">Magic link to set password &amp; configure MFA on first login.</p>
                  </div>
                  <Switch checked={sendActivation} onCheckedChange={setSendActivation} />
                </label>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" asChild>
                <Link href="/tenants">Cancel</Link>
              </Button>
              <Button disabled={!valid || creating} onClick={handleCreate} className="min-w-40">
                {creating
                  ? <span className="flex items-center gap-2"><Loader2 className="h-3.5 w-3.5 animate-spin" />Provisioning…</span>
                  : <><Rocket className="h-3.5 w-3.5" />Provision tenant</>}
              </Button>
            </div>
          </div>

          <div className="space-y-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-coral text-xs font-bold text-white">
                      {(name.trim()[0] ?? 'T').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{name || 'New tenant'}</p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {effectiveSubdomain || 'subdomain'}.topiadesk.com
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <Row k="Plan" v={<Badge variant="outline" className="capitalize">{selectedPlan.name}</Badge>} />
                  <Row k="Billing" v={`$${selectedPlan.priceMonthly}/agent/mo`} />
                  <Row k="Status" v={<Badge variant="outline">{trial ? 'Trialing (21d)' : 'Active'}</Badge>} />
                  <Row k="Region" v={REGIONS.find((r) => r.id === region)?.id ?? ''} />
                  <Row k="Industry" v={industry} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50/40">
              <CardContent className="flex gap-2 p-4 text-xs">
                <ShieldCheck className="h-4 w-4 shrink-0 text-amber-600" />
                <div>
                  <p className="font-semibold text-amber-800">Isolated by design</p>
                  <p className="mt-0.5 text-amber-700/80">
                    Every row carries this tenant&rsquo;s <code>tenant_id</code>; data is enforced isolated via
                    Postgres RLS. Provisioning is audit-logged.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Picker({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm"
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium text-foreground">{v}</span>
    </div>
  );
}
