'use client';

import { use } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  Database,
  ExternalLink,
  FileText,
  Headset,
  HelpCircle,
  Inbox,
  LineChart,
  LogIn,
  Mail,
  MessageCircle,
  Phone,
  Server,
  Shield,
  Star,
  Ticket,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
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
  Separator,
  cn,
} from '@topiadesk/ui';
import {
  csrTicketsForTenant,
  getTenantSupportProfile,
  type CsrStatus,
  type CsrPriority,
} from '@/lib/support-tickets';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const STATUS_META: Record<CsrStatus, { label: string; cls: string; dot: string }> = {
  new:             { label: 'New',             cls: 'bg-coral/10 text-coral-dark border-coral/20',       dot: 'bg-coral' },
  in_progress:     { label: 'In progress',     cls: 'bg-blue-50 text-blue-700 border-blue-200',          dot: 'bg-blue-500' },
  awaiting_tenant: { label: 'Awaiting tenant', cls: 'bg-amber-50 text-amber-700 border-amber-200',       dot: 'bg-amber-500' },
  resolved:        { label: 'Resolved',        cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  closed:          { label: 'Closed',          cls: 'bg-muted text-muted-foreground border-border',      dot: 'bg-muted-foreground' },
};

const PRIORITY_META: Record<CsrPriority, { label: string; color: string }> = {
  urgent: { label: 'Urgent', color: 'text-red-600' },
  high:   { label: 'High',   color: 'text-orange-600' },
  medium: { label: 'Medium', color: 'text-amber-600' },
  low:    { label: 'Low',    color: 'text-slate-500' },
};

const TIMELINE_ICON: Record<string, { icon: typeof Activity; color: string; bg: string }> = {
  ticket:      { icon: Ticket,    color: 'text-coral-dark',  bg: 'bg-coral/10' },
  login:       { icon: LogIn,     color: 'text-blue-600',    bg: 'bg-blue-50' },
  plan_change: { icon: TrendingUp,color: 'text-emerald-600', bg: 'bg-emerald-50' },
  invoice:     { icon: CreditCard,color: 'text-emerald-700', bg: 'bg-emerald-50' },
  incident:    { icon: AlertCircle,color: 'text-red-600',    bg: 'bg-red-50' },
};

function formatAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60)   return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtNum(n: number) {
  return new Intl.NumberFormat('en-US').format(n);
}

// ─── Health score ring ───────────────────────────────────────────────────────

function HealthRing({ score }: { score: number }) {
  const radius = 38;
  const circ   = 2 * Math.PI * radius;
  const stroke = circ * (1 - Math.min(100, Math.max(0, score)) / 100);
  const color  = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <svg viewBox="0 0 100 100" className="h-24 w-24">
      <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="8" />
      <circle
        cx="50" cy="50" r={radius}
        fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={stroke}
        transform="rotate(-90 50 50)"
      />
      <text x="50" y="46" textAnchor="middle" fontSize="22" fontWeight="700" fill="currentColor">{score}</text>
      <text x="50" y="62" textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.5">HEALTH</text>
    </svg>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CsrTenantDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const tenant = getTenantSupportProfile(id);
  const tickets = csrTicketsForTenant(id);

  if (!tenant) {
    return (
      <div className="flex h-[calc(100vh-3rem)] items-center justify-center">
        <div className="text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <p className="mt-3 text-sm font-medium">Tenant not found</p>
          <Link href="/support" className="mt-3 inline-block">
            <Button size="sm" variant="outline">Back to support queue</Button>
          </Link>
        </div>
      </div>
    );
  }

  const openTickets = tickets.filter((t) => t.status !== 'resolved' && t.status !== 'closed');
  const seatPct  = (tenant.metrics.activeAgents / tenant.metrics.seatLimit) * 100;
  const stgPct   = (tenant.metrics.storageUsedGb / tenant.metrics.storageLimitGb) * 100;
  const apiPct   = Math.min(100, (tenant.metrics.apiCallsThisMonth / 3_000_000) * 100);

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
      {/* Hero */}
      <div className="shrink-0 p-5 pb-0">
        <header className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative">
            <Link href="/support" className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white/90 transition-colors">
              <ArrowLeft className="h-3 w-3" /> Support queue
            </Link>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-white">{tenant.name}</h1>
                  <Badge className="border-white/20 bg-white/10 text-[10px] text-white capitalize">{tenant.plan}</Badge>
                  {tenant.vip && (
                    <Badge className="border-coral/30 bg-coral/20 text-[10px] text-coral-light">
                      <Star className="h-2.5 w-2.5" />VIP
                    </Badge>
                  )}
                  <Badge className={cn(
                    'text-[10px]',
                    tenant.health.accountStatus === 'active'    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : tenant.health.accountStatus === 'trialing' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-red-500/20 text-red-300 border-red-500/30',
                  )}>
                    {tenant.health.accountStatus}
                  </Badge>
                </div>
                <p className="mt-1 flex items-center gap-3 text-[11px] text-white/70">
                  <span><Building2 className="mr-1 inline-block h-3 w-3" />{tenant.city}, {tenant.country}</span>
                  <span>·</span>
                  <span>{tenant.subdomain}.topiadesk.com</span>
                  <span>·</span>
                  <span>Signed up {formatDate(tenant.signupDate)}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild size="sm" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                  <a href={`https://${tenant.subdomain}.topiadesk.com`} target="_blank" rel="noopener">
                    <ExternalLink className="h-3 w-3" />Open workspace
                  </a>
                </Button>
                <Button asChild size="sm" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                  <Link href={`/tenants/${tenant.tenantId}`}><Building2 className="h-3 w-3" />Admin view</Link>
                </Button>
                <Button size="sm" className="bg-coral text-white hover:bg-coral-dark">
                  <Ticket className="h-3 w-3" />New ticket
                </Button>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 space-y-5 overflow-y-auto p-5 pt-5">

        {/* Top: Health + KPIs */}
        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          {/* Health */}
          <Card className={cn(
            'overflow-hidden',
            tenant.health.riskLevel === 'high'   && 'border-red-200',
            tenant.health.riskLevel === 'medium' && 'border-amber-200',
          )}>
            <CardContent className="flex items-center gap-4 p-5">
              <HealthRing score={tenant.health.healthScore} />
              <div>
                <p className="text-sm font-semibold text-foreground">Account health</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{tenant.health.riskLevel} risk</p>
                <Separator className="my-2" />
                <p className="flex items-center gap-1.5 text-xs">
                  <CreditCard className="h-3 w-3 text-muted-foreground" />
                  Payment <span className={cn('font-semibold', tenant.health.paymentStatus === 'current' ? 'text-emerald-600' : 'text-red-600')}>{tenant.health.paymentStatus}</span>
                </p>
                {tenant.health.csm && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs">
                    <Headset className="h-3 w-3 text-muted-foreground" />
                    CSM <span className="font-semibold">{tenant.health.csm}</span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: '30d tickets',  value: tenant.metrics.ticketsOpened30d,                            sub: `${tenant.metrics.ticketsResolved30d} resolved`,           icon: Ticket,        tone: 'text-foreground' },
              { label: 'Avg resolve',  value: tenant.metrics.avgResolutionHours ? `${tenant.metrics.avgResolutionHours.toFixed(1)}h` : '—', sub: 'CSR side',                icon: Clock,         tone: 'text-foreground' },
              { label: 'CSAT',         value: tenant.metrics.csatScore ? tenant.metrics.csatScore.toFixed(1) : '—',                        sub: 'out of 5',                                                                              icon: Award,         tone: tenant.metrics.csatScore >= 4 ? 'text-emerald-600' : tenant.metrics.csatScore >= 3 ? 'text-amber-600' : 'text-red-600' },
              { label: 'Total spend',  value: `$${fmtNum(tenant.metrics.totalSpendUsd)}`,                                                    sub: 'lifetime',                                                                              icon: TrendingUp,    tone: 'text-emerald-600' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border bg-card p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</p>
                  <s.icon className="h-3.5 w-3.5 text-muted-foreground/40" />
                </div>
                <p className={cn('mt-1 text-xl font-bold tabular-nums', s.tone)}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Middle: Contact + Usage + Activity */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Contact */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Users className="h-4 w-4 text-coral" />Primary contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-coral text-xs font-bold text-white">
                    {tenant.primaryEmail.split('@')[0].slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">Primary admin</p>
                  <p className="truncate text-[11px] text-muted-foreground">{tenant.subdomain}.topiadesk.com</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-1.5">
                <a href={`mailto:${tenant.primaryEmail}`} className="flex items-center gap-2 hover:text-coral">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  {tenant.primaryEmail}
                </a>
                <a href={`tel:${tenant.primaryPhone}`} className="flex items-center gap-2 hover:text-coral">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  {tenant.primaryPhone}
                </a>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="h-3 w-3" />
                  Billing: <a href={`mailto:${tenant.billingEmail}`} className="hover:text-coral">{tenant.billingEmail}</a>
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-3 w-3" />{tenant.city}, {tenant.country}
                </p>
              </div>
              <Separator />
              <div className="flex gap-2">
                <Button asChild size="sm" variant="outline" className="flex-1 text-[11px]">
                  <a href={`mailto:${tenant.primaryEmail}`}><Mail className="h-3 w-3" />Email</a>
                </Button>
                <Button asChild size="sm" variant="outline" className="flex-1 text-[11px]">
                  <a href={`tel:${tenant.primaryPhone}`}><Phone className="h-3 w-3" />Call</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Usage */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Activity className="h-4 w-4 text-coral" />Plan utilization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Agent seats',  used: tenant.metrics.activeAgents, limit: tenant.metrics.seatLimit,    pct: seatPct, unit: '', icon: Users },
                { label: 'Storage',      used: tenant.metrics.storageUsedGb, limit: tenant.metrics.storageLimitGb, pct: stgPct, unit: ' GB', icon: Database },
                { label: 'API calls (mo)', used: tenant.metrics.apiCallsThisMonth, limit: 3_000_000,            pct: apiPct, unit: '', icon: Zap },
              ].map((row) => {
                const Icon = row.icon;
                const color = row.pct >= 90 ? 'bg-red-500' : row.pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500';
                return (
                  <div key={row.label}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-muted-foreground"><Icon className="h-3 w-3" />{row.label}</span>
                      <span className="font-medium text-foreground tabular-nums">
                        {fmtNum(row.used)}{row.unit} / {fmtNum(row.limit)}{row.unit}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${row.pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <LineChart className="h-4 w-4 text-coral" />Recent activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border/60">
                {tenant.timeline.map((ev) => {
                  const meta = TIMELINE_ICON[ev.type] ?? TIMELINE_ICON.login;
                  const Icon = meta.icon;
                  return (
                    <li key={ev.id} className="flex items-start gap-3 px-4 py-2.5 text-xs">
                      <span className={cn('mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md', meta.bg)}>
                        <Icon className={cn('h-3 w-3', meta.color)} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-foreground">{ev.title}</p>
                        <p className="text-[10px] text-muted-foreground">{formatAgo(ev.when)}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Bottom: Open tickets table */}
        <Card>
          <CardHeader className="border-b pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Ticket className="h-4 w-4 text-coral" />Tickets for {tenant.name}
                <Badge variant="secondary" className="text-[10px]">{tickets.length} total</Badge>
              </CardTitle>
              <Button asChild size="sm" variant="outline" className="text-xs">
                <Link href={`/support?tenant=${tenant.tenantId}`}>
                  View all in queue<ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {tickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Ticket className="h-8 w-8 text-muted-foreground/30" />
                <p className="mt-2 text-sm font-medium text-foreground">No tickets yet</p>
                <p className="text-xs text-muted-foreground">This tenant hasn&apos;t opened any support tickets.</p>
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead className="bg-[#F4EFE6]">
                  <tr className="border-b border-border/60 text-left text-muted-foreground">
                    <th className="px-4 py-2.5 font-semibold">Ticket</th>
                    <th className="px-3 py-2.5 font-semibold">Category</th>
                    <th className="px-3 py-2.5 font-semibold">Priority</th>
                    <th className="px-3 py-2.5 font-semibold">Status</th>
                    <th className="px-3 py-2.5 font-semibold">Assignee</th>
                    <th className="px-3 py-2.5 font-semibold">Updated</th>
                    <th className="px-3 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {tickets.map((t) => {
                    const st = STATUS_META[t.status];
                    const pr = PRIORITY_META[t.priority];
                    return (
                      <tr key={t.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <Link href={`/support/${t.id}`} className="block">
                            <p className="font-mono text-[10px] text-muted-foreground">{t.number}</p>
                            <p className="font-semibold text-foreground hover:text-coral">{t.subject}</p>
                          </Link>
                        </td>
                        <td className="px-3 py-3 text-muted-foreground capitalize">{t.category.replace('_', ' ')}</td>
                        <td className={cn('px-3 py-3 font-medium', pr.color)}>{pr.label}</td>
                        <td className="px-3 py-3">
                          <span className={cn('inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold', st.cls)}>
                            <span className={cn('h-1 w-1 rounded-full', st.dot)} />{st.label}
                          </span>
                        </td>
                        <td className="px-3 py-3">{t.assignee?.name ?? <span className="text-muted-foreground">—</span>}</td>
                        <td className="px-3 py-3 text-[10px] text-muted-foreground">{formatAgo(t.updatedAt)}</td>
                        <td className="px-3 py-3">
                          <Button asChild size="sm" variant="outline" className="h-7 px-2 text-[10px]">
                            <Link href={`/support/${t.id}`}>Open<ArrowUpRight className="h-3 w-3" /></Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Quick links */}
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { href: `/tenants/${tenant.tenantId}`,           label: 'Admin view',         icon: Building2 },
            { href: `/billing?tenant=${tenant.tenantId}`,    label: 'Invoices & billing', icon: CreditCard },
            { href: `/audit-logs?tenant=${tenant.tenantId}`, label: 'Audit logs',         icon: FileText },
            { href: `/security?tenant=${tenant.tenantId}`,   label: 'Security events',    icon: Shield },
          ].map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="group flex items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3 transition-all hover:border-coral/30 hover:bg-coral/5"
            >
              <span className="flex items-center gap-2">
                <q.icon className="h-3.5 w-3.5 text-coral" />
                <span className="text-xs font-medium text-foreground">{q.label}</span>
              </span>
              <ArrowUpRight className="h-3 w-3 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-coral" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
