'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCheck,
  CircleCheck,
  Copy,
  Info,
  KeyRound,
  Loader2,
  TriangleAlert,
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
  cn,
} from '@topiadesk/ui';

const SCOPES = [
  { id: 'tenants:read', label: 'Read tenants' },
  { id: 'tenants:write', label: 'Manage tenants' },
  { id: 'billing:read', label: 'Read billing' },
  { id: 'billing:write', label: 'Manage billing' },
  { id: 'users:read', label: 'Read users' },
  { id: 'users:write', label: 'Manage users' },
  { id: 'metrics:read', label: 'Read platform metrics' },
  { id: 'audit:read', label: 'Read audit logs' },
];

const EXPIRY = [
  { id: '30', label: '30 days' },
  { id: '90', label: '90 days' },
  { id: '365', label: '1 year' },
  { id: 'never', label: 'Never' },
];

function genKey() {
  const seg = () => Math.random().toString(36).slice(2, 10);
  return `tk_live_${seg()}${seg()}${seg()}${seg()}`;
}

export default function NewApiKeyPage() {
  const [name, setName] = useState('');
  const [scopes, setScopes] = useState<string[]>(['tenants:read']);
  const [expiry, setExpiry] = useState('90');
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);
  const [token] = useState(() => genKey());
  const [copied, setCopied] = useState(false);

  const valid = name.trim().length > 1 && scopes.length > 0;

  function toggleScope(id: string) {
    setScopes((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }
  async function handleCreate() {
    if (!valid) return;
    setCreating(true);
    await new Promise((r) => setTimeout(r, 800));
    setCreating(false);
    setCreated(true);
  }
  async function copy() {
    try { await navigator.clipboard.writeText(token); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* */ }
  }

  if (created) {
    return (
      <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-2xl pt-10">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100">
              <CircleCheck className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="mt-4 text-center text-2xl font-bold text-foreground">API key created</h2>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{name}</span> · {scopes.length} scope{scopes.length > 1 ? 's' : ''}
            </p>
            <Card className="mt-6 border-amber-200 bg-amber-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                  <KeyRound className="h-4 w-4" /> Secret key — shown once
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <code className="flex-1 truncate rounded-md border bg-card px-3 py-2 font-mono text-sm">{token}</code>
                  <Button size="sm" variant="outline" onClick={copy}>
                    {copied ? <CheckCheck className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <p className="flex items-start gap-1.5 rounded-md border border-amber-300 bg-amber-100/60 p-3 text-xs text-amber-900">
                  <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span><strong>Copy it now.</strong> For security, the full key is never displayed again. Store it in your secrets manager.</span>
                </p>
              </CardContent>
            </Card>
            <div className="mt-6 flex justify-center gap-2">
              <Button asChild><Link href="/api-keys">Back to API keys</Link></Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
        <div className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link href="/api-keys" className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white">
                <ArrowLeft className="h-3 w-3" /> API keys
              </Link>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">New API key</h1>
              <p className="mt-0.5 text-sm text-white/70">Create a scoped key for platform automation. Grant the least privilege needed.</p>
            </div>
            <Button onClick={handleCreate} size="sm" disabled={!valid || creating} className="bg-coral text-white hover:bg-coral-dark">
              {creating && <Loader2 className="h-3 w-3 animate-spin" />} Generate key
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Identity</CardTitle></CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Key name *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Billing reconciliation job" />
                  <p className="text-[11px] text-muted-foreground">A human label so you can identify this key later.</p>
                </div>
                <div className="space-y-2">
                  <Label>Expiry</Label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {EXPIRY.map((e) => (
                      <button key={e.id} type="button" onClick={() => setExpiry(e.id)}
                        className={cn('rounded-md border py-2 text-[11px] transition-colors',
                          expiry === e.id ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card hover:bg-muted')}>
                        {e.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Scopes *</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 gap-1.5 p-6 sm:grid-cols-2">
                {SCOPES.map((s) => (
                  <label key={s.id} className="flex cursor-pointer items-center gap-2 rounded-md border bg-card px-3 py-2 text-xs hover:bg-muted">
                    <input type="checkbox" checked={scopes.includes(s.id)} onChange={() => toggleScope(s.id)} className="h-3.5 w-3.5 accent-primary" />
                    <span className="flex-1">{s.label}</span>
                    <code className="text-[10px] text-muted-foreground">{s.id}</code>
                  </label>
                ))}
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Summary</CardTitle></CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <p className="font-semibold">{name || 'Unnamed key'}</p>
                <p className="text-muted-foreground">Expires: {EXPIRY.find((e) => e.id === expiry)?.label}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {scopes.length === 0 ? <Badge variant="outline">No scopes</Badge>
                    : scopes.map((s) => <Badge key={s} variant="outline" className="font-mono text-[10px]">{s}</Badge>)}
                </div>
              </CardContent>
            </Card>
            <Card className="border-amber-200 bg-amber-50/40">
              <CardContent className="flex gap-2 p-4 text-xs">
                <Info className="h-4 w-4 shrink-0 text-amber-600" />
                <p className="text-amber-700/80">The secret is shown only once after creation. Key generation is audit-logged.</p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
