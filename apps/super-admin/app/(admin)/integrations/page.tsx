'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertCircle,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cloud,
  Code,
  CreditCard,
  Database,
  ExternalLink,
  Filter,
  Headset,
  Key,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Server,
  Settings,
  Shield,
  Webhook,
  Zap,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Switch,
  cn,
} from '@topiadesk/ui';

type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'configuring';
type IntegrationCategory =
  | 'payments' | 'messaging' | 'observability' | 'analytics'
  | 'storage' | 'auth' | 'crm' | 'ai';

interface Integration {
  id: string;
  name: string;
  vendor: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  description: string;
  icon: typeof CreditCard;
  iconColor: string;
  iconBg: string;
  connectedAt?: string;
  lastEvent?: string;
  eventsToday?: number;
  errorMessage?: string;
  required?: boolean;
  webhookUrl?: string;
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'stripe', name: 'Stripe', vendor: 'Stripe Inc.', category: 'payments',
    status: 'connected', description: 'Subscription billing, invoicing and payment intents for all tenants.',
    icon: CreditCard, iconColor: 'text-violet-600', iconBg: 'bg-violet-50',
    connectedAt: '2024-03-14', lastEvent: '12s ago', eventsToday: 482, required: true,
    webhookUrl: 'https://api.topiadesk.com/webhooks/stripe',
  },
  {
    id: 'sendgrid', name: 'SendGrid', vendor: 'Twilio', category: 'messaging',
    status: 'connected', description: 'Transactional email — invoices, password resets, welcome emails.',
    icon: Mail, iconColor: 'text-blue-600', iconBg: 'bg-blue-50',
    connectedAt: '2024-03-14', lastEvent: '2m ago', eventsToday: 1_842, required: true,
  },
  {
    id: 'twilio-sms', name: 'Twilio SMS', vendor: 'Twilio', category: 'messaging',
    status: 'connected', description: 'SMS delivery for tenant 2FA codes and notifications.',
    icon: MessageCircle, iconColor: 'text-red-600', iconBg: 'bg-red-50',
    connectedAt: '2024-06-22', lastEvent: '8m ago', eventsToday: 412,
  },
  {
    id: 'twilio-voice', name: 'Twilio Voice', vendor: 'Twilio', category: 'messaging',
    status: 'connected', description: 'Voice channel for tenants on Business and Enterprise plans.',
    icon: Phone, iconColor: 'text-amber-600', iconBg: 'bg-amber-50',
    connectedAt: '2024-08-15', lastEvent: '45m ago', eventsToday: 87,
  },
  {
    id: 'datadog', name: 'Datadog', vendor: 'Datadog Inc.', category: 'observability',
    status: 'connected', description: 'APM, log aggregation and infrastructure monitoring.',
    icon: Activity, iconColor: 'text-violet-700', iconBg: 'bg-violet-50',
    connectedAt: '2024-04-02', lastEvent: '1s ago', eventsToday: 89_412,
  },
  {
    id: 'sentry', name: 'Sentry', vendor: 'Functional Software', category: 'observability',
    status: 'connected', description: 'Frontend and backend error tracking across all apps.',
    icon: Shield, iconColor: 'text-amber-700', iconBg: 'bg-amber-50',
    connectedAt: '2024-04-02', lastEvent: '34m ago', eventsToday: 142,
  },
  {
    id: 'segment', name: 'Segment', vendor: 'Twilio', category: 'analytics',
    status: 'error', description: 'Customer event pipeline — currently failing on webhook validation.',
    icon: Activity, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50',
    connectedAt: '2024-09-11', lastEvent: '4h ago (failed)', errorMessage: 'Webhook signature mismatch — rotate secret',
  },
  {
    id: 'mixpanel', name: 'Mixpanel', vendor: 'Mixpanel Inc.', category: 'analytics',
    status: 'disconnected', description: 'Product analytics for tenant in-app behaviour.',
    icon: Activity, iconColor: 'text-indigo-600', iconBg: 'bg-indigo-50',
  },
  {
    id: 's3', name: 'AWS S3', vendor: 'Amazon Web Services', category: 'storage',
    status: 'connected', description: 'Object storage for tenant attachments and exports (eu-west-1).',
    icon: Database, iconColor: 'text-orange-600', iconBg: 'bg-orange-50',
    connectedAt: '2024-03-14', lastEvent: '4s ago', eventsToday: 12_842, required: true,
  },
  {
    id: 'cloudflare', name: 'Cloudflare', vendor: 'Cloudflare', category: 'storage',
    status: 'connected', description: 'CDN, DDoS protection and custom tenant domain SSL.',
    icon: Cloud, iconColor: 'text-amber-600', iconBg: 'bg-amber-50',
    connectedAt: '2024-03-14', lastEvent: '1s ago', eventsToday: 412_882, required: true,
  },
  {
    id: 'auth0', name: 'Auth0', vendor: 'Okta', category: 'auth',
    status: 'configuring', description: 'Identity provider for super-admin SSO (in setup).',
    icon: Key, iconColor: 'text-orange-600', iconBg: 'bg-orange-50',
  },
  {
    id: 'okta-saml', name: 'Okta SAML', vendor: 'Okta', category: 'auth',
    status: 'disconnected', description: 'SAML SSO for tenant-side admin users — requested by 3 tenants.',
    icon: Shield, iconColor: 'text-blue-700', iconBg: 'bg-blue-50',
  },
  {
    id: 'salesforce', name: 'Salesforce', vendor: 'Salesforce Inc.', category: 'crm',
    status: 'connected', description: 'CRM sync — tenant → Salesforce account/contact mapping.',
    icon: Cloud, iconColor: 'text-blue-500', iconBg: 'bg-blue-50',
    connectedAt: '2024-11-08', lastEvent: '12m ago', eventsToday: 24,
  },
  {
    id: 'openai', name: 'OpenAI', vendor: 'OpenAI', category: 'ai',
    status: 'connected', description: 'AI Reply Suggestions and ticket summarisation (gpt-4o).',
    icon: Zap, iconColor: 'text-emerald-700', iconBg: 'bg-emerald-50',
    connectedAt: '2024-12-01', lastEvent: '6s ago', eventsToday: 8_412,
  },
  {
    id: 'anthropic', name: 'Anthropic Claude', vendor: 'Anthropic', category: 'ai',
    status: 'connected', description: 'Backup AI provider for ticket analysis (Claude Sonnet).',
    icon: Zap, iconColor: 'text-coral-dark', iconBg: 'bg-coral/10',
    connectedAt: '2025-02-14', lastEvent: '4m ago', eventsToday: 1_212,
  },
  {
    id: 'slack', name: 'Slack', vendor: 'Salesforce / Slack', category: 'messaging',
    status: 'connected', description: 'Internal alerts to #platform-alerts channel.',
    icon: MessageCircle, iconColor: 'text-violet-600', iconBg: 'bg-violet-50',
    connectedAt: '2024-04-22', lastEvent: '8m ago', eventsToday: 47,
  },
];

const CATEGORY_META: Record<IntegrationCategory, { label: string; icon: typeof Boxes; color: string }> = {
  payments:      { label: 'Payments',       icon: CreditCard,    color: 'text-violet-600' },
  messaging:     { label: 'Messaging',      icon: Mail,          color: 'text-blue-600'   },
  observability: { label: 'Observability',  icon: Activity,      color: 'text-amber-600'  },
  analytics:     { label: 'Analytics',      icon: Activity,      color: 'text-emerald-600'},
  storage:       { label: 'Storage & CDN',  icon: Database,      color: 'text-orange-600' },
  auth:          { label: 'Auth & SSO',     icon: Shield,        color: 'text-blue-700'   },
  crm:           { label: 'CRM',            icon: Cloud,         color: 'text-blue-500'   },
  ai:            { label: 'AI providers',   icon: Zap,           color: 'text-emerald-700'},
};

const STATUS_META: Record<IntegrationStatus, { label: string; cls: string; dot: string }> = {
  connected:    { label: 'Connected',    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  disconnected: { label: 'Not connected',cls: 'bg-muted text-muted-foreground border-border',      dot: 'bg-muted-foreground' },
  error:        { label: 'Error',        cls: 'bg-red-50 text-red-700 border-red-200',             dot: 'bg-red-500 animate-pulse' },
  configuring:  { label: 'Configuring',  cls: 'bg-amber-50 text-amber-700 border-amber-200',       dot: 'bg-amber-500 animate-pulse' },
};

function fmtNum(n: number) {
  return new Intl.NumberFormat('en-US').format(n);
}

export default function IntegrationsPage() {
  const [category, setCategory] = useState<'all' | IntegrationCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | IntegrationStatus>('all');
  const [search, setSearch] = useState('');

  const filtered = INTEGRATIONS.filter((i) => {
    if (category !== 'all' && i.category !== category) return false;
    if (statusFilter !== 'all' && i.status !== statusFilter) return false;
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all:          INTEGRATIONS.length,
    connected:    INTEGRATIONS.filter((i) => i.status === 'connected').length,
    disconnected: INTEGRATIONS.filter((i) => i.status === 'disconnected').length,
    error:        INTEGRATIONS.filter((i) => i.status === 'error').length,
    configuring:  INTEGRATIONS.filter((i) => i.status === 'configuring').length,
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
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">Integrations</h1>
              <p className="mt-0.5 text-sm text-white/70">
                {counts.connected} connected · {counts.error} error · {counts.disconnected} not connected · {counts.all} total
              </p>
            </div>
            <Button size="sm" className="bg-coral text-white hover:bg-coral-dark">
              <Plus className="h-3 w-3" />Browse marketplace
            </Button>
          </div>
        </header>
      </div>

      {/* Pinned filter strip */}
      <div className="shrink-0 space-y-5 px-5 pt-5">
        {counts.error > 0 && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <div className="text-xs">
              <p className="font-semibold text-red-800">
                {counts.error} integration{counts.error !== 1 ? 's' : ''} require attention
              </p>
              <p className="text-red-700/80">
                Failing integrations may impact tenant billing, notifications or analytics.
              </p>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-border/70 bg-card px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Category tabs */}
            <div className="flex flex-wrap rounded-lg border p-0.5 text-xs">
              <button onClick={() => setCategory('all')}
                className={cn('rounded-md px-2.5 py-1 font-medium transition-colors',
                  category === 'all' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground')}>
                All ({counts.all})
              </button>
              {(Object.keys(CATEGORY_META) as IntegrationCategory[]).map((c) => (
                <button key={c} onClick={() => setCategory(c)}
                  className={cn('rounded-md px-2.5 py-1 font-medium transition-colors',
                    category === c ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground')}>
                  {CATEGORY_META[c].label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="h-8 rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="all">All statuses</option>
                <option value="connected">Connected</option>
                <option value="error">Error</option>
                <option value="configuring">Configuring</option>
                <option value="disconnected">Not connected</option>
              </select>
            </div>

            <div className="relative ml-auto">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search integrations…" className="h-8 w-60 pl-8 text-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll body — cards grid */}
      <div className="flex-1 min-h-0 overflow-y-auto p-5 pt-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((int) => {
            const Icon = int.icon;
            const st = STATUS_META[int.status];
            return (
              <Card key={int.id} className={cn(
                int.status === 'error' && 'border-red-200',
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-lg', int.iconBg)}>
                      <Icon className={cn('h-5 w-5', int.iconColor)} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="font-semibold text-sm">{int.name}</p>
                        {int.required && <Badge variant="secondary" className="text-[9px]">Required</Badge>}
                      </div>
                      <p className="text-[10px] text-muted-foreground">{int.vendor}</p>
                    </div>
                    <Switch
                      checked={int.status === 'connected'}
                      disabled={int.required}
                    />
                  </div>

                  <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{int.description}</p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className={cn('inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold', st.cls)}>
                      <span className={cn('h-1 w-1 rounded-full', st.dot)} />
                      {st.label}
                    </span>
                    {int.eventsToday !== undefined && (
                      <span className="text-[10px] text-muted-foreground tabular-nums">{fmtNum(int.eventsToday)} events / 24h</span>
                    )}
                  </div>

                  {int.errorMessage && (
                    <p className="mt-2 rounded-md border border-red-200 bg-red-50 px-2 py-1.5 text-[11px] text-red-700">
                      {int.errorMessage}
                    </p>
                  )}

                  <div className="mt-3 flex items-center gap-2 border-t border-border/60 pt-3">
                    <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
                      <Settings className="h-3 w-3" />Configure
                    </Button>
                    {int.status === 'connected' && (
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px] text-muted-foreground">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Webhook className="h-8 w-8 text-muted-foreground/30" />
            <p className="mt-2 text-sm font-medium">No integrations match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
