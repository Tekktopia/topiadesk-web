'use client';

import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Code,
  CreditCard,
  ExternalLink,
  Filter,
  Headset,
  Key,
  MessageSquare,
  Mail,
  Plug,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Webhook,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  cn,
} from '@topiadesk/ui';
import { adminIntegrations, adminWebhooks } from '@/lib/mock-data';

const CATEGORY_META: Record<
  'sso' | 'channel' | 'productivity' | 'payment' | 'monitoring',
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  sso: { label: 'Sign-in & SSO', icon: ShieldCheck },
  channel: { label: 'Channels', icon: Headset },
  productivity: { label: 'Productivity', icon: MessageSquare },
  payment: { label: 'Payments', icon: CreditCard },
  monitoring: { label: 'Monitoring', icon: AlertCircle },
};

export default function IntegrationsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all' | keyof typeof CATEGORY_META>('all');

  const filtered = adminIntegrations.filter((i) => {
    if (category !== 'all' && i.category !== category) return false;
    if (search && !i.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const connected = filtered.filter((i) => i.status === 'connected');
  const available = filtered.filter((i) => i.status === 'available');

  return (
    <div className="space-y-5 p-5 lg:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Connect
          </p>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Integrations
          </h1>
          <p className="text-sm text-muted-foreground">
            {adminIntegrations.filter((i) => i.status === 'connected').length}{' '}
            connected ·{' '}
            {adminIntegrations.filter((i) => i.status === 'available').length}{' '}
            available · all integrations are tenant-scoped
          </p>
        </div>
        <Button size="sm" variant="outline">
          <Sparkles className="h-3 w-3" />
          Browse marketplace
        </Button>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCategory('all')}
          className={cn(
            'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            category === 'all'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          All
        </button>
        {(Object.keys(CATEGORY_META) as (keyof typeof CATEGORY_META)[]).map(
          (k) => {
            const meta = CATEGORY_META[k];
            const Icon = meta.icon;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setCategory(k)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  category === k
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <Icon className="h-3 w-3" />
                {meta.label}
              </button>
            );
          },
        )}
        <Filter className="ml-2 h-3 w-3 text-muted-foreground" />
        <div className="relative ml-auto">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search integrations"
            className="h-8 w-64 pl-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {connected.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Connected ({connected.length})
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {connected.map((i) => (
              <IntegrationCard key={i.id} integration={i} />
            ))}
          </div>
        </section>
      )}

      {available.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Available ({available.length})
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {available.map((i) => (
              <IntegrationCard key={i.id} integration={i} />
            ))}
          </div>
        </section>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Webhook className="h-4 w-4" />
              Webhooks
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Send ticket and asset events to your own systems
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-3 w-3" />
            New endpoint
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {adminWebhooks.map((w) => (
              <li key={w.id} className="px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{w.name}</p>
                      {w.active ? (
                        <Badge variant="success" className="text-[9px]">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[9px]">
                          Paused
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-[10px]">
                        {w.successRate}% success
                      </Badge>
                    </div>
                    <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground">
                      {w.url}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      {w.events.map((e) => (
                        <code
                          key={e}
                          className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                        >
                          {e}
                        </code>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">
                      Last delivery {w.lastDelivery}
                    </span>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      View deliveries
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Key className="h-4 w-4" />
              API keys & access tokens
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Personal access tokens and service credentials for the public API
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-3 w-3" />
            New token
          </Button>
        </CardHeader>
        <CardContent className="space-y-3 p-4 text-xs">
          <TokenRow
            name="CI deployment pipeline"
            scope="tickets:write, assets:write"
            lastUsed="14 min ago"
            owner="System"
          />
          <TokenRow
            name="Adaeze — personal"
            scope="tickets:read, assets:read"
            lastUsed="Yesterday"
            owner="Adaeze Nwosu"
          />
          <TokenRow
            name="Datadog forwarder"
            scope="events:write"
            lastUsed="2 days ago"
            owner="System"
          />
        </CardContent>
      </Card>
    </div>
  );
}

function IntegrationCard({
  integration,
}: {
  integration: (typeof adminIntegrations)[number];
}) {
  const meta = CATEGORY_META[integration.category];
  const Icon = meta.icon;
  return (
    <article className="flex h-full flex-col gap-3 rounded-lg border bg-card p-4 transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-md bg-muted text-muted-foreground">
          {/* placeholder vendor icon */}
          <Icon className="h-5 w-5" />
        </div>
        {integration.status === 'connected' ? (
          <Badge variant="success" className="text-[9px]">
            <CheckCircle2 className="h-2.5 w-2.5" />
            Connected
          </Badge>
        ) : (
          <Badge variant="outline" className="text-[9px]">
            Available
          </Badge>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold">{integration.name}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
          {integration.description}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2 pt-2 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Plug className="h-3 w-3" />
          {meta.label}
        </span>
        {integration.connectedAt ? (
          <span>Since {integration.connectedAt}</span>
        ) : null}
      </div>
      <Button
        variant={integration.status === 'connected' ? 'outline' : 'default'}
        size="sm"
        className="w-full"
      >
        {integration.status === 'connected' ? (
          <>
            Configure
            <ExternalLink className="h-3 w-3" />
          </>
        ) : (
          <>
            <Plus className="h-3 w-3" />
            Connect
          </>
        )}
      </Button>
    </article>
  );
}

function TokenRow({
  name,
  scope,
  lastUsed,
  owner,
}: {
  name: string;
  scope: string;
  lastUsed: string;
  owner: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-muted/20 p-3">
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-muted text-muted-foreground">
          <Code className="h-4 w-4" />
        </div>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-[10px] text-muted-foreground">
            <code className="rounded bg-card px-1 font-mono">{scope}</code> ·
            owner {owner}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <Mail className="h-3 w-3" />
        Last used {lastUsed}
        <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600">
          Revoke
        </Button>
      </div>
    </div>
  );
}
