'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Plug, Sparkles } from 'lucide-react';
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

type Category = 'sso' | 'channel' | 'productivity' | 'payment' | 'monitoring';

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'sso', label: 'Sign-in & SSO' },
  { id: 'channel', label: 'Channels' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'payment', label: 'Payments' },
  { id: 'monitoring', label: 'Monitoring' },
];

interface Provider {
  id: string;
  name: string;
  category: Category;
  auth: 'oauth' | 'apikey';
  blurb: string;
}

const PROVIDERS: Provider[] = [
  { id: 'google', name: 'Google Workspace', category: 'sso', auth: 'oauth', blurb: 'SSO + Gmail-to-ticket + calendar' },
  { id: 'microsoft', name: 'Microsoft 365 / Entra', category: 'sso', auth: 'oauth', blurb: 'SSO + Outlook-to-ticket + Teams' },
  { id: 'saml', name: 'Generic SAML 2.0', category: 'sso', auth: 'apikey', blurb: 'Okta, OneLogin, Ping, ADFS' },
  { id: 'whatsapp', name: 'WhatsApp Business', category: 'channel', auth: 'apikey', blurb: 'Meta Cloud API' },
  { id: 'twilio', name: 'Twilio', category: 'channel', auth: 'apikey', blurb: 'SMS + voice' },
  { id: 'termii', name: 'Termii', category: 'channel', auth: 'apikey', blurb: 'African SMS routes' },
  { id: 'slack', name: 'Slack', category: 'productivity', auth: 'oauth', blurb: 'Notifications + ticket creation' },
  { id: 'teams', name: 'Microsoft Teams', category: 'productivity', auth: 'oauth', blurb: 'Adaptive card notifications' },
  { id: 'zapier', name: 'Zapier', category: 'productivity', auth: 'apikey', blurb: 'Connect to 5000+ apps' },
  { id: 'paystack', name: 'Paystack', category: 'payment', auth: 'apikey', blurb: 'USD, GHS, ZAR' },
  { id: 'flutterwave', name: 'Flutterwave', category: 'payment', auth: 'apikey', blurb: 'Multi-currency African cards' },
  { id: 'stripe', name: 'Stripe', category: 'payment', auth: 'apikey', blurb: 'International card + ACH' },
  { id: 'discovery', name: 'Asset Discovery Agent', category: 'monitoring', auth: 'apikey', blurb: 'Windows/macOS/Linux inventory' },
];

export default function NewIntegrationPage() {
  const [category, setCategory] = useState<Category>('sso');
  const [providerId, setProviderId] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const provider = PROVIDERS.find((p) => p.id === providerId) ?? null;
  const canSubmit = !!provider && (provider.auth === 'oauth' || apiKey.trim().length > 4);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    window.setTimeout(() => setSubmitting(false), 900);
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
        <div className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link href="/integrations" className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white">
                <ArrowLeft className="h-3 w-3" /> Integrations
              </Link>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">Connect an integration</h1>
              <p className="mt-0.5 text-sm text-white/70">Wire Topiadesk to the tools your team already uses.</p>
            </div>
            <Button form="new-int-form" type="submit" size="sm" disabled={!canSubmit || submitting} className="bg-coral text-white hover:bg-coral-dark">
              {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
              {provider?.auth === 'oauth' ? 'Authorize & connect' : 'Connect'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <form id="new-int-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Category</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-1.5 p-4">
                {CATEGORIES.map((c) => (
                  <button key={c.id} type="button" onClick={() => { setCategory(c.id); setProviderId(null); }}
                    className={cn('rounded-full border px-3 py-1.5 text-[11px] transition-colors',
                      category === c.id ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card hover:bg-muted')}>
                    {c.label}
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Provider</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 gap-2 p-6 sm:grid-cols-2">
                {PROVIDERS.filter((p) => p.category === category).map((p) => {
                  const selected = providerId === p.id;
                  return (
                    <button key={p.id} type="button" onClick={() => { setProviderId(p.id); setApiKey(''); }}
                      className={cn('flex items-start gap-3 rounded-lg border p-3 text-left transition-all',
                        selected ? 'border-coral/40 bg-coral/5 ring-2 ring-coral/20' : 'border-border bg-card hover:border-coral/20')}>
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                        {p.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground">{p.blurb}</p>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {provider && (
              <Card>
                <CardHeader className="border-b py-3">
                  <CardTitle className="flex items-center gap-2 text-sm"><Plug className="h-4 w-4 text-coral" /> {provider.name} setup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-6">
                  {provider.auth === 'oauth' ? (
                    <p className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
                      You&rsquo;ll be redirected to {provider.name} to authorize access, then returned here. No secrets are stored on this form.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="key">API key / secret *</Label>
                      <Input id="key" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Paste the key from your provider dashboard" className="font-mono text-sm" />
                      <p className="text-[11px] text-muted-foreground">Encrypted at rest with your tenant data-encryption key.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Selection</CardTitle></CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                {provider ? (
                  <>
                    <p className="font-semibold">{provider.name}</p>
                    <p className="text-muted-foreground">{provider.blurb}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      <Badge variant="outline" className="capitalize">{CATEGORIES.find((c) => c.id === category)?.label}</Badge>
                      <Badge variant="outline">{provider.auth === 'oauth' ? 'OAuth' : 'API key'}</Badge>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">Pick a provider to continue.</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Tips</CardTitle></CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <Tip text="Grant the least scope needed; you can broaden it later." />
                <Tip text="Integration tokens are never shared across tenants." />
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
