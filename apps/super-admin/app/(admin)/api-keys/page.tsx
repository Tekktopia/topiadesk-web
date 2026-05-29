'use client';

import { useState } from 'react';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  Filter,
  Key,
  KeyRound,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Send,
  Shield,
  Trash2,
  Webhook,
  XCircle,
  Zap,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  cn,
} from '@topiadesk/ui';

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  scope: 'read' | 'read_write' | 'admin';
  environment: 'production' | 'staging' | 'development';
  createdBy: string;
  createdAt: string;
  lastUsedAt?: string;
  requestsToday: number;
  ipRestrictions?: string[];
  status: 'active' | 'revoked' | 'expired';
  expiresAt?: string;
}

interface WebhookEndpoint {
  id: string;
  url: string;
  description: string;
  events: string[];
  status: 'healthy' | 'failing' | 'paused';
  successRate: number;
  lastDeliveryAt?: string;
  totalDeliveries: number;
  recentFailures: number;
  signingSecret: string;
}

const API_KEYS: ApiKey[] = [
  {
    id: 'k1', name: 'Production – Main backend', prefix: 'sk_live_4e8a',
    scope: 'admin', environment: 'production', createdBy: 'Daniel Oshinubi',
    createdAt: '2024-08-12', lastUsedAt: '12s ago', requestsToday: 482_192,
    ipRestrictions: ['52.211.40.0/22'], status: 'active',
  },
  {
    id: 'k2', name: 'Reporting / Metabase', prefix: 'sk_live_a112',
    scope: 'read', environment: 'production', createdBy: 'Amara Diallo',
    createdAt: '2024-11-22', lastUsedAt: '4m ago', requestsToday: 18_412,
    status: 'active',
  },
  {
    id: 'k3', name: 'Webhook delivery service', prefix: 'sk_live_b9d3',
    scope: 'read_write', environment: 'production', createdBy: 'Daniel Oshinubi',
    createdAt: '2024-08-12', lastUsedAt: '1s ago', requestsToday: 89_223,
    status: 'active',
  },
  {
    id: 'k4', name: 'Mobile app — iOS', prefix: 'sk_live_c4e1',
    scope: 'read_write', environment: 'production', createdBy: 'Tunde Bakare',
    createdAt: '2025-02-04', lastUsedAt: '38s ago', requestsToday: 24_891,
    status: 'active',
  },
  {
    id: 'k5', name: 'Staging — CI smoke tests', prefix: 'sk_test_f7a2',
    scope: 'admin', environment: 'staging', createdBy: 'Daniel Oshinubi',
    createdAt: '2024-06-01', lastUsedAt: '18m ago', requestsToday: 412,
    status: 'active',
  },
  {
    id: 'k6', name: 'Legacy reporting (deprecated)', prefix: 'sk_live_9921',
    scope: 'read', environment: 'production', createdBy: 'Fatima Suleiman',
    createdAt: '2023-09-04', lastUsedAt: '6 months ago', requestsToday: 0,
    status: 'revoked',
  },
  {
    id: 'k7', name: 'Mixpanel pipeline (expired)', prefix: 'sk_live_e2c8',
    scope: 'read', environment: 'production', createdBy: 'Daniel Oshinubi',
    createdAt: '2024-05-22', expiresAt: '2025-05-22', lastUsedAt: '1y ago',
    requestsToday: 0, status: 'expired',
  },
];

const WEBHOOKS: WebhookEndpoint[] = [
  {
    id: 'w1', url: 'https://hooks.zapier.com/abc123', description: 'Zapier integration — new tenant signups',
    events: ['tenant.created', 'tenant.upgraded'], status: 'healthy', successRate: 99.7,
    lastDeliveryAt: '24s ago', totalDeliveries: 1_842, recentFailures: 0,
    signingSecret: 'whsec_a4f8…',
  },
  {
    id: 'w2', url: 'https://api.consomoafrica.com/webhooks/topiadesk', description: 'Customer CRM sync',
    events: ['ticket.created', 'ticket.resolved', 'agent.added'], status: 'healthy', successRate: 100,
    lastDeliveryAt: '4s ago', totalDeliveries: 28_412, recentFailures: 0,
    signingSecret: 'whsec_c91a…',
  },
  {
    id: 'w3', url: 'https://hooks.slack.com/services/T0/B0/xxx', description: '#platform-alerts Slack channel',
    events: ['incident.opened', 'incident.resolved', 'security.alert'], status: 'healthy', successRate: 100,
    lastDeliveryAt: '8m ago', totalDeliveries: 247, recentFailures: 0,
    signingSecret: 'whsec_b2e4…',
  },
  {
    id: 'w4', url: 'https://flairtech.topiadesk.com/api/webhooks/stripe', description: 'FlairTech billing sync',
    events: ['invoice.paid', 'subscription.canceled'], status: 'failing', successRate: 62.4,
    lastDeliveryAt: '12m ago', totalDeliveries: 412, recentFailures: 18,
    signingSecret: 'whsec_8d12…',
  },
  {
    id: 'w5', url: 'https://api.example-tenant.com/topiadesk', description: 'Old integration (paused for review)',
    events: ['*'], status: 'paused', successRate: 0,
    lastDeliveryAt: '3d ago', totalDeliveries: 12, recentFailures: 0,
    signingSecret: 'whsec_2f9e…',
  },
];

const SCOPE_META = {
  read:       { label: 'Read',       color: 'text-blue-700',    bg: 'bg-blue-50' },
  read_write: { label: 'Read/Write', color: 'text-amber-700',   bg: 'bg-amber-50' },
  admin:      { label: 'Admin',      color: 'text-red-700',     bg: 'bg-red-50' },
};

const ENV_META = {
  production:  { label: 'Production',  cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  staging:     { label: 'Staging',     cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  development: { label: 'Development', cls: 'bg-slate-50 text-slate-700 border-slate-200' },
};

const KEY_STATUS = {
  active:  { label: 'Active',  cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  revoked: { label: 'Revoked', cls: 'bg-red-50 text-red-700 border-red-200',             dot: 'bg-red-500'    },
  expired: { label: 'Expired', cls: 'bg-muted text-muted-foreground border-border',      dot: 'bg-muted-foreground' },
};

const WH_STATUS = {
  healthy: { label: 'Healthy', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  failing: { label: 'Failing', cls: 'bg-red-50 text-red-700 border-red-200',             dot: 'bg-red-500 animate-pulse' },
  paused:  { label: 'Paused',  cls: 'bg-muted text-muted-foreground border-border',      dot: 'bg-muted-foreground' },
};

function fmtNum(n: number) {
  return new Intl.NumberFormat('en-US').format(n);
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ApiKeysPage() {
  const [tab, setTab] = useState<'keys' | 'webhooks'>('keys');
  const [search, setSearch] = useState('');
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});

  const filteredKeys = API_KEYS.filter((k) => !search || k.name.toLowerCase().includes(search.toLowerCase()));
  const filteredHooks = WEBHOOKS.filter((w) => !search || w.url.toLowerCase().includes(search.toLowerCase()) || w.description.toLowerCase().includes(search.toLowerCase()));

  const counts = {
    keys: {
      active:    API_KEYS.filter((k) => k.status === 'active').length,
      revoked:   API_KEYS.filter((k) => k.status === 'revoked').length,
      expired:   API_KEYS.filter((k) => k.status === 'expired').length,
      requests:  API_KEYS.reduce((s, k) => s + k.requestsToday, 0),
    },
    hooks: {
      healthy:  WEBHOOKS.filter((w) => w.status === 'healthy').length,
      failing:  WEBHOOKS.filter((w) => w.status === 'failing').length,
      paused:   WEBHOOKS.filter((w) => w.status === 'paused').length,
      delivered:WEBHOOKS.reduce((s, w) => s + w.totalDeliveries, 0),
    },
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
      {/* Hero */}
      <div className="shrink-0 p-5 pb-0">
        <header className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Super Admin</p>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">API Keys &amp; Webhooks</h1>
              <p className="mt-0.5 text-sm text-white/70">
                {counts.keys.active} active keys · {counts.hooks.healthy} healthy webhooks · {fmtNum(counts.keys.requests)} API calls today
              </p>
            </div>
            <Button size="sm" className="bg-coral text-white hover:bg-coral-dark">
              <Plus className="h-3 w-3" />{tab === 'keys' ? 'New API key' : 'New webhook'}
            </Button>
          </div>
        </header>
      </div>

      {/* Pinned tabs + filter */}
      <div className="shrink-0 space-y-5 px-5 pt-5">
        {/* KPI strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {tab === 'keys' ? (
            <>
              <Kpi label="Active keys"      value={counts.keys.active}   icon={Key}    color="text-emerald-600" />
              <Kpi label="Revoked"          value={counts.keys.revoked}  icon={XCircle} color="text-red-600" />
              <Kpi label="Expired"          value={counts.keys.expired}  icon={AlertCircle} color="text-amber-600" />
              <Kpi label="Calls today"      value={fmtNum(counts.keys.requests)} icon={Zap} color="text-foreground" />
            </>
          ) : (
            <>
              <Kpi label="Healthy"          value={counts.hooks.healthy}  icon={CheckCircle2} color="text-emerald-600" />
              <Kpi label="Failing"          value={counts.hooks.failing}  icon={AlertCircle} color="text-red-600" />
              <Kpi label="Paused"           value={counts.hooks.paused}   icon={XCircle} color="text-muted-foreground" />
              <Kpi label="Total delivered"  value={fmtNum(counts.hooks.delivered)} icon={Send} color="text-foreground" />
            </>
          )}
        </div>

        {/* Tabs */}
        <div className="rounded-t-xl border border-b-0 border-border/70 bg-card px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-lg border p-0.5 text-xs">
              <button onClick={() => setTab('keys')}
                className={cn('rounded-md px-3 py-1 font-medium transition-colors',
                  tab === 'keys' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground')}>
                <Key className="mr-1 inline-block h-3 w-3" />API keys
              </button>
              <button onClick={() => setTab('webhooks')}
                className={cn('rounded-md px-3 py-1 font-medium transition-colors',
                  tab === 'webhooks' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground')}>
                <Webhook className="mr-1 inline-block h-3 w-3" />Webhooks
              </button>
            </div>

            <div className="relative ml-auto">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder={tab === 'keys' ? 'Search keys…' : 'Search webhooks…'}
                className="h-8 w-60 pl-8 text-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll body */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-5">
        <div className="rounded-b-xl border border-t-0 border-border/70 bg-card">
          {tab === 'keys' ? (
            <table className="w-full text-xs">
              <thead className="sticky top-0 z-10 bg-[#F4EFE6] shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
                <tr className="border-b text-left text-muted-foreground">
                  <th className="px-4 py-2.5 font-semibold">Name</th>
                  <th className="px-3 py-2.5 font-semibold">Key</th>
                  <th className="px-3 py-2.5 font-semibold">Scope</th>
                  <th className="px-3 py-2.5 font-semibold">Environment</th>
                  <th className="px-3 py-2.5 font-semibold">Status</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Calls today</th>
                  <th className="px-3 py-2.5 font-semibold">Last used</th>
                  <th className="px-3 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredKeys.map((k) => {
                  const sc = SCOPE_META[k.scope];
                  const env = ENV_META[k.environment];
                  const st = KEY_STATUS[k.status];
                  return (
                    <tr key={k.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <p className="font-semibold">{k.name}</p>
                        <p className="text-[10px] text-muted-foreground">Created by {k.createdBy} · {formatDate(k.createdAt)}</p>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <code className="rounded bg-muted/40 px-2 py-0.5 font-mono text-[11px]">
                            {showSecret[k.id] ? `${k.prefix}_${'x'.repeat(28)}` : `${k.prefix}_${'•'.repeat(28)}`}
                          </code>
                          <button type="button" onClick={() => setShowSecret((p) => ({ ...p, [k.id]: !p[k.id] }))}
                            className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                            {showSecret[k.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </button>
                          <button type="button" className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-semibold', sc.bg, sc.color)}>{sc.label}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={cn('inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold', env.cls)}>
                          {env.label}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={cn('inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold', st.cls)}>
                          <span className={cn('h-1 w-1 rounded-full', st.dot)} />{st.label}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">{fmtNum(k.requestsToday)}</td>
                      <td className="px-3 py-3 text-muted-foreground">{k.lastUsedAt ?? '—'}</td>
                      <td className="px-3 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Activity className="h-3.5 w-3.5" />View usage</DropdownMenuItem>
                            <DropdownMenuItem><Shield className="h-3.5 w-3.5" />Edit IP restrictions</DropdownMenuItem>
                            <DropdownMenuItem><RefreshCw className="h-3.5 w-3.5" />Rotate key</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-3.5 w-3.5" />Revoke
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-xs">
              <thead className="sticky top-0 z-10 bg-[#F4EFE6] shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
                <tr className="border-b text-left text-muted-foreground">
                  <th className="px-4 py-2.5 font-semibold">Endpoint</th>
                  <th className="px-3 py-2.5 font-semibold">Events</th>
                  <th className="px-3 py-2.5 font-semibold">Status</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Success rate</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Total delivered</th>
                  <th className="px-3 py-2.5 font-semibold">Last delivery</th>
                  <th className="px-3 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredHooks.map((w) => {
                  const st = WH_STATUS[w.status];
                  return (
                    <tr key={w.id} className={cn('hover:bg-muted/30', w.status === 'failing' && 'bg-red-50/20')}>
                      <td className="px-4 py-3">
                        <p className="truncate font-mono text-[11px] text-foreground">{w.url}</p>
                        <p className="text-[10px] text-muted-foreground">{w.description}</p>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1">
                          {w.events.slice(0, 2).map((e) => (
                            <code key={e} className="rounded bg-muted/40 px-1.5 py-0.5 font-mono text-[10px]">{e}</code>
                          ))}
                          {w.events.length > 2 && (
                            <span className="text-[10px] text-muted-foreground">+{w.events.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className={cn('inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold', st.cls)}>
                          <span className={cn('h-1 w-1 rounded-full', st.dot)} />{st.label}
                        </span>
                        {w.recentFailures > 0 && (
                          <p className="mt-0.5 text-[10px] text-red-600">{w.recentFailures} recent failures</p>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className={cn('tabular-nums font-semibold',
                          w.successRate >= 99 ? 'text-emerald-600' :
                          w.successRate >= 90 ? 'text-amber-600'  : 'text-red-600',
                        )}>
                          {w.successRate}%
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">{fmtNum(w.totalDeliveries)}</td>
                      <td className="px-3 py-3 text-muted-foreground">{w.lastDeliveryAt ?? '—'}</td>
                      <td className="px-3 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Send className="h-3.5 w-3.5" />Send test event</DropdownMenuItem>
                            <DropdownMenuItem><Activity className="h-3.5 w-3.5" />View delivery log</DropdownMenuItem>
                            <DropdownMenuItem><KeyRound className="h-3.5 w-3.5" />Reveal signing secret</DropdownMenuItem>
                            <DropdownMenuItem><RefreshCw className="h-3.5 w-3.5" />Rotate secret</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600"><Trash2 className="h-3.5 w-3.5" />Delete endpoint</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, icon: Icon, color }: { label: string; value: number | string; icon: typeof Key; color: string }) {
  return (
    <div className="rounded-xl border bg-card px-4 py-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <Icon className={cn('h-3.5 w-3.5 opacity-40', color)} />
      </div>
      <p className={cn('mt-1 text-xl font-bold tabular-nums', color)}>{value}</p>
    </div>
  );
}
