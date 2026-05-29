'use client';

import { useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  ExternalLink,
  Filter,
  Globe2,
  Headset,
  MoreHorizontal,
  Plus,
  Server,
  Sparkles,
  Wrench,
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
  DropdownMenuTrigger,
  cn,
} from '@topiadesk/ui';

type ComponentStatus = 'operational' | 'degraded' | 'partial' | 'major' | 'maintenance';

interface StatusComponent {
  id: string;
  name: string;
  description: string;
  status: ComponentStatus;
  region?: string;
  uptime30d: number;
  responseMs: number;
  group: 'apis' | 'apps' | 'channels' | 'infrastructure' | 'integrations';
}

interface Incident {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'major' | 'minor' | 'maintenance';
  affectedComponents: string[];
  startedAt: string;
  resolvedAt?: string;
  updates: { time: string; message: string; status: string }[];
}

const COMPONENTS: StatusComponent[] = [
  { id: 'api-rest',  name: 'REST API',                     description: 'Public API endpoints', status: 'operational', uptime30d: 99.97, responseMs: 142, group: 'apis' },
  { id: 'api-gql',   name: 'GraphQL API',                  description: 'GraphQL gateway',      status: 'operational', uptime30d: 99.94, responseMs: 188, group: 'apis' },
  { id: 'webhooks',  name: 'Webhook delivery',             description: 'Outbound webhooks',    status: 'degraded',    uptime30d: 98.12, responseMs: 421, group: 'apis' },
  { id: 'app-agent',     name: 'Agent Workspace',          description: 'app.topiadesk.com',    status: 'operational', uptime30d: 99.98, responseMs: 98,  group: 'apps' },
  { id: 'app-admin',     name: 'Tenant Admin Portal',      description: 'admin.topiadesk.com',  status: 'operational', uptime30d: 99.99, responseMs: 104, group: 'apps' },
  { id: 'app-customer',  name: 'Customer Portal',          description: 'Per-tenant subdomains',status: 'operational', uptime30d: 99.96, responseMs: 87,  group: 'apps' },
  { id: 'ch-email',     name: 'Email channel',             description: 'Inbound/outbound mail',status: 'operational', uptime30d: 99.95, responseMs: 234, group: 'channels' },
  { id: 'ch-whatsapp',  name: 'WhatsApp Business',         description: 'WA channel integration',status: 'partial',     uptime30d: 97.42, responseMs: 612, group: 'channels' },
  { id: 'ch-sms',       name: 'SMS (Twilio)',              description: 'SMS delivery',         status: 'operational', uptime30d: 99.91, responseMs: 312, group: 'channels' },
  { id: 'ch-voice',     name: 'Voice (Twilio)',            description: 'Voice channel',        status: 'operational', uptime30d: 99.88, responseMs: 412, group: 'channels' },
  { id: 'infra-db',     name: 'Primary database (eu-west-1)', description: 'PostgreSQL cluster',status: 'operational', uptime30d: 100,   responseMs: 8,   group: 'infrastructure' },
  { id: 'infra-cdn',    name: 'CDN (Cloudflare)',          description: 'Global edge network',  status: 'operational', uptime30d: 99.99, responseMs: 18,  group: 'infrastructure' },
  { id: 'infra-storage',name: 'Object storage (S3)',       description: 'Attachments & exports',status: 'operational', uptime30d: 99.97, responseMs: 64,  group: 'infrastructure' },
  { id: 'int-stripe',   name: 'Stripe (payments)',         description: 'Billing & subscriptions',status: 'operational', uptime30d: 99.93, responseMs: 198, group: 'integrations' },
  { id: 'int-openai',   name: 'OpenAI (AI suggestions)',   description: 'AI reply generation',  status: 'operational', uptime30d: 99.62, responseMs: 1_240, group: 'integrations' },
];

const INCIDENTS: Incident[] = [
  {
    id: 'inc-008', title: 'WhatsApp Business API delivery delays',
    status: 'monitoring', severity: 'minor',
    affectedComponents: ['WhatsApp Business'],
    startedAt: new Date(Date.now() - 4 * 3_600_000).toISOString(),
    updates: [
      { time: new Date(Date.now() - 30 * 60_000).toISOString(), status: 'monitoring',  message: 'Channel is recovering. Message backlog cleared. Monitoring delivery rates.' },
      { time: new Date(Date.now() - 2 * 3_600_000).toISOString(), status: 'identified',  message: 'Identified — Meta-side rate limit on shared inbound webhook. Mitigation deployed.' },
      { time: new Date(Date.now() - 4 * 3_600_000).toISOString(), status: 'investigating', message: 'Investigating — tenants reporting delayed WhatsApp message delivery (avg 4-8 min vs target <30s).' },
    ],
  },
  {
    id: 'inc-007', title: 'Webhook delivery retries elevated',
    status: 'monitoring', severity: 'minor',
    affectedComponents: ['Webhook delivery'],
    startedAt: new Date(Date.now() - 12 * 3_600_000).toISOString(),
    updates: [
      { time: new Date(Date.now() - 1 * 3_600_000).toISOString(), status: 'monitoring', message: 'Retry queue normalized. Monitoring.' },
      { time: new Date(Date.now() - 12 * 3_600_000).toISOString(), status: 'investigating', message: 'Investigating elevated webhook retry rates (3% vs baseline 0.4%).' },
    ],
  },
  {
    id: 'inc-006', title: 'Scheduled DB maintenance — eu-west-1',
    status: 'resolved', severity: 'maintenance',
    affectedComponents: ['Primary database (eu-west-1)'],
    startedAt: new Date(Date.now() - 6 * 86_400_000).toISOString(),
    resolvedAt: new Date(Date.now() - 6 * 86_400_000 + 90 * 60_000).toISOString(),
    updates: [
      { time: new Date(Date.now() - 6 * 86_400_000 + 90 * 60_000).toISOString(), status: 'resolved', message: 'Maintenance completed successfully. No customer impact.' },
      { time: new Date(Date.now() - 6 * 86_400_000).toISOString(),                  status: 'identified', message: 'Scheduled DB minor version upgrade starting.' },
    ],
  },
  {
    id: 'inc-005', title: 'Brief CDN cache miss spike',
    status: 'resolved', severity: 'minor',
    affectedComponents: ['CDN (Cloudflare)'],
    startedAt: new Date(Date.now() - 9 * 86_400_000).toISOString(),
    resolvedAt: new Date(Date.now() - 9 * 86_400_000 + 18 * 60_000).toISOString(),
    updates: [{ time: new Date(Date.now() - 9 * 86_400_000 + 18 * 60_000).toISOString(), status: 'resolved', message: 'Cache miss rate returned to baseline within 18 minutes.' }],
  },
];

const STATUS_META: Record<ComponentStatus, { label: string; color: string; bg: string; dot: string }> = {
  operational: { label: 'Operational',         color: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
  degraded:    { label: 'Degraded performance',color: 'text-amber-700',   bg: 'bg-amber-50',   dot: 'bg-amber-500 animate-pulse' },
  partial:     { label: 'Partial outage',      color: 'text-orange-700',  bg: 'bg-orange-50',  dot: 'bg-orange-500 animate-pulse' },
  major:       { label: 'Major outage',        color: 'text-red-700',     bg: 'bg-red-50',     dot: 'bg-red-500 animate-pulse' },
  maintenance: { label: 'Under maintenance',   color: 'text-blue-700',    bg: 'bg-blue-50',    dot: 'bg-blue-500 animate-pulse' },
};

const GROUP_META = {
  apis:           { label: 'APIs',           icon: Zap        },
  apps:           { label: 'Applications',   icon: Globe2     },
  channels:       { label: 'Channels',       icon: Headset    },
  infrastructure: { label: 'Infrastructure', icon: Server     },
  integrations:   { label: 'Integrations',   icon: Activity   },
};

function fmtAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60)   return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}

export default function StatusPageManager() {
  const [tab, setTab] = useState<'components' | 'incidents'>('components');
  const activeIncidents = INCIDENTS.filter((i) => i.status !== 'resolved');
  const overallStatus: ComponentStatus = COMPONENTS.some((c) => c.status === 'major') ? 'major'
    : COMPONENTS.some((c) => c.status === 'partial') ? 'partial'
    : COMPONENTS.some((c) => c.status === 'degraded') ? 'degraded'
    : COMPONENTS.some((c) => c.status === 'maintenance') ? 'maintenance'
    : 'operational';
  const overall = STATUS_META[overallStatus];

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
        <header className="relative overflow-hidden rounded-2xl bg-navy px-6 py-5 shadow-lg shadow-navy/15">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Super Admin</p>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">Status Page</h1>
              <p className="mt-0.5 text-sm text-white/70">
                Public status at <a href="https://status.topiadesk.com" target="_blank" rel="noopener" className="underline hover:text-white">status.topiadesk.com</a> · {activeIncidents.length} active incidents
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" asChild>
                <a href="https://status.topiadesk.com" target="_blank" rel="noopener">
                  <ExternalLink className="h-3 w-3" />View public page
                </a>
              </Button>
              <Button size="sm" className="bg-coral text-white hover:bg-coral-dark">
                <Plus className="h-3 w-3" />Report incident
              </Button>
            </div>
          </div>
        </header>
      </div>

      <div className="flex-1 min-h-0 space-y-5 overflow-y-auto p-5 pt-5">
        {/* Overall status banner */}
        <Card className={cn('border-l-4', overallStatus === 'operational' ? 'border-l-emerald-500' : 'border-l-amber-500')}>
          <CardContent className="flex items-center gap-4 p-5">
            <span className={cn('grid h-12 w-12 place-items-center rounded-full', overall.bg)}>
              {overallStatus === 'operational' ? <CheckCircle2 className={cn('h-6 w-6', overall.color)} /> : <AlertCircle className={cn('h-6 w-6', overall.color)} />}
            </span>
            <div className="flex-1">
              <h2 className={cn('text-lg font-bold', overall.color)}>
                {overallStatus === 'operational' ? 'All systems operational' : overall.label}
              </h2>
              <p className="text-xs text-muted-foreground">
                {activeIncidents.length} active incident{activeIncidents.length !== 1 ? 's' : ''} · Last incident-free streak: 6d 18h
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: '24h',  value: '99.98%' },
                { label: '7d',   value: '99.94%' },
                { label: '30d',  value: '99.87%' },
              ].map((u) => (
                <div key={u.label} className="rounded-lg border bg-muted/30 px-3 py-1.5">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{u.label} uptime</p>
                  <p className="text-sm font-bold tabular-nums text-emerald-600">{u.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex rounded-lg border p-0.5 text-xs w-fit">
          <button onClick={() => setTab('components')}
            className={cn('rounded-md px-3 py-1 font-medium transition-colors',
              tab === 'components' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground')}>
            <Server className="mr-1 inline h-3 w-3" />Components ({COMPONENTS.length})
          </button>
          <button onClick={() => setTab('incidents')}
            className={cn('rounded-md px-3 py-1 font-medium transition-colors',
              tab === 'incidents' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground')}>
            <AlertCircle className="mr-1 inline h-3 w-3" />Incidents ({INCIDENTS.length})
          </button>
        </div>

        {tab === 'components' ? (
          <div className="space-y-4">
            {(Object.keys(GROUP_META) as (keyof typeof GROUP_META)[]).map((g) => {
              const items = COMPONENTS.filter((c) => c.group === g);
              if (items.length === 0) return null;
              const meta = GROUP_META[g];
              return (
                <Card key={g} className="overflow-hidden">
                  <CardHeader className="border-b py-2.5">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <meta.icon className="h-4 w-4 text-coral" />{meta.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ul className="divide-y">
                      {items.map((c) => {
                        const st = STATUS_META[c.status];
                        return (
                          <li key={c.id} className="flex items-center justify-between px-4 py-3 text-sm hover:bg-muted/30">
                            <div className="flex items-center gap-3">
                              <span className={cn('h-2 w-2 rounded-full', st.dot)} />
                              <div>
                                <p className="font-medium">{c.name}</p>
                                <p className="text-[10px] text-muted-foreground">{c.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                              <span className="text-muted-foreground tabular-nums">{c.responseMs}ms</span>
                              <span className={cn('font-semibold tabular-nums', c.uptime30d >= 99.9 ? 'text-emerald-600' : c.uptime30d >= 99 ? 'text-amber-600' : 'text-red-600')}>
                                {c.uptime30d}%
                              </span>
                              <span className={cn('inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold', st.bg, st.color)}>
                                {st.label}
                              </span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-3 w-3" /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View metrics</DropdownMenuItem>
                                  <DropdownMenuItem>Edit component</DropdownMenuItem>
                                  <DropdownMenuItem>Set under maintenance</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {INCIDENTS.map((inc) => {
              const isActive = inc.status !== 'resolved';
              return (
                <Card key={inc.id} className={cn(isActive && 'border-amber-300')}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{inc.title}</h3>
                          <Badge variant={inc.severity === 'major' ? 'danger' : inc.severity === 'minor' ? 'warning' : 'secondary'} className="text-[10px] capitalize">{inc.severity}</Badge>
                          <Badge variant={inc.status === 'resolved' ? 'success' : 'warning'} className="text-[10px] capitalize">{inc.status}</Badge>
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Affects: {inc.affectedComponents.join(', ')} · Started {fmtAgo(inc.startedAt)}
                          {inc.resolvedAt && ` · Resolved ${fmtAgo(inc.resolvedAt)}`}
                        </p>
                      </div>
                      {isActive && (
                        <Button size="sm" className="bg-coral text-white hover:bg-coral-dark h-7 text-xs">
                          <Sparkles className="h-3 w-3" />Post update
                        </Button>
                      )}
                    </div>
                    <ul className="mt-3 space-y-2 border-t pt-3">
                      {inc.updates.map((u, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs">
                          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                          <div className="flex-1">
                            <p className="flex items-center gap-2">
                              <span className="font-semibold capitalize">{u.status}</span>
                              <span className="text-muted-foreground">· {fmtAgo(u.time)}</span>
                            </p>
                            <p className="text-muted-foreground">{u.message}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
