'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  DollarSign,
  Server,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  cn,
} from '@topiadesk/ui';
import {
  useAdminMetrics,
  useRevenueTrend,
  useTenants,
  useSystemComponents,
  useSecurityEvents,
} from '@/lib/queries';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toLocaleString()}`;
}

function formatAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}

// ─── MRR Trend Chart ──────────────────────────────────────────────────────────

function MrrChart({ data }: { data: { month: string; mrr: number; newMrr: number; churnedMrr: number }[] }) {
  const W = 520; const H = 120;
  const pad = { t: 12, r: 12, b: 28, l: 48 };
  const xs = W - pad.l - pad.r;
  const ys = H - pad.t - pad.b;
  const max = Math.max(...data.map((d) => d.mrr));
  const pts = data.map((d, i) => ({
    x: pad.l + (i / (data.length - 1)) * xs,
    y: pad.t + (1 - d.mrr / max) * ys,
    ...d,
  }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1]!.x.toFixed(1)},${(pad.t + ys).toFixed(1)} L${pts[0]!.x.toFixed(1)},${(pad.t + ys).toFixed(1)} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full text-emerald-500">
      <defs>
        <linearGradient id="mrr-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity={0.3} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((t) => {
        const v = max * (1 - t);
        const y = pad.t + t * ys;
        return (
          <g key={t}>
            <line x1={pad.l} y1={y} x2={pad.l + xs} y2={y} stroke="currentColor" strokeOpacity={0.08} strokeWidth={1} />
            <text x={pad.l - 4} y={y + 3} textAnchor="end" fontSize={9} fill="currentColor" opacity={0.5}>${(v / 1000).toFixed(1)}k</text>
          </g>
        );
      })}
      <path d={area} fill="url(#mrr-grad)" />
      <path d={line} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p) => (
        <g key={p.month}>
          <circle cx={p.x} cy={p.y} r={3.5} fill="currentColor" stroke="#fff" strokeWidth={1.5} />
          <text x={p.x} y={H - 6} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.5}>{p.month}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  label, value, sub, icon: Icon, color, href,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: typeof DollarSign;
  color: string;
  href?: string;
}) {
  const inner = (
    <div className="rounded-xl border bg-card p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className={cn('rounded-lg p-2', color.replace('text-', 'bg-').replace('-600', '-100').replace('-500', '-100'))}>
          <Icon className={cn('h-4 w-4', color)} />
        </div>
        {href && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </div>
      <p className={cn('mt-3 text-2xl font-bold tabular-nums tracking-tight', color)}>{value}</p>
      <p className="mt-0.5 text-xs font-semibold text-muted-foreground">{label}</p>
      {sub && <p className="mt-0.5 text-[10px] text-muted-foreground">{sub}</p>}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const metrics  = useAdminMetrics();
  const trend    = useRevenueTrend();
  const tenants  = useTenants();
  const system   = useSystemComponents();
  const security = useSecurityEvents();

  const m = metrics.data;

  const recentTenants = useMemo(
    () => [...(tenants.data ?? [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [tenants.data],
  );

  const degraded = useMemo(
    () => (system.data ?? []).filter((c) => c.status !== 'operational'),
    [system.data],
  );

  const openSecEvents = useMemo(
    () => (security.data ?? []).filter((e) => !e.resolved),
    [security.data],
  );

  const planDist = useMemo(() => {
    const all = tenants.data ?? [];
    return [
      { label: 'Enterprise', count: all.filter((t) => t.plan === 'enterprise').length, color: 'bg-violet-500' },
      { label: 'Business',   count: all.filter((t) => t.plan === 'business').length,   color: 'bg-blue-500' },
      { label: 'Starter',    count: all.filter((t) => t.plan === 'starter').length,    color: 'bg-emerald-500' },
    ];
  }, [tenants.data]);

  return (
    <div className="space-y-6">
      {/* Gradient header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-700 px-6 py-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Super Admin</p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">Platform Overview</h1>
            <p className="mt-0.5 text-sm text-white/70">Real-time snapshot of all tenants, revenue, and infrastructure.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" asChild>
              <Link href="/tenants">View tenants</Link>
            </Button>
            <Button size="sm" className="bg-white text-emerald-700 hover:bg-white/90" asChild>
              <Link href="/billing">Revenue report</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6 px-6 pb-6">
      {/* System alert banner */}
      {degraded.length > 0 && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950/30">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
              {degraded.length} system component{degraded.length > 1 ? 's' : ''} degraded: {degraded.map((c) => c.name).join(', ')}
            </p>
          </div>
          <Button size="sm" variant="outline" className="shrink-0 text-xs" asChild>
            <Link href="/system">View status</Link>
          </Button>
        </div>
      )}

      {/* Security alert banner */}
      {openSecEvents.length > 0 && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950/30">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            <p className="text-sm font-medium text-red-800 dark:text-red-400">
              {openSecEvents.length} unresolved security event{openSecEvents.length > 1 ? 's' : ''} require attention.
            </p>
          </div>
          <Button size="sm" variant="outline" className="shrink-0 text-xs" asChild>
            <Link href="/security">Review</Link>
          </Button>
        </div>
      )}

      {/* KPI grid */}
      {metrics.isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : m && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="Monthly Recurring Revenue"  value={fmt(m.totalMrr)}             sub={`ARR ${fmt(m.totalArr)}`}                  icon={DollarSign}  color="text-emerald-600" href="/billing" />
          <KpiCard label="Active Tenants"             value={m.activeTenants}             sub={`${m.trialingTenants} trialling`}           icon={Building2}   color="text-blue-600"   href="/tenants" />
          <KpiCard label="Total Users"                value={m.totalUsers.toLocaleString()}sub="Across all tenants"                         icon={Users}       color="text-violet-600" href="/users" />
          <KpiCard label="Tickets This Month"         value={m.totalTicketsThisMonth.toLocaleString()} sub="Across all tenants"             icon={TrendingUp}  color="text-orange-600" />
          <KpiCard label="Avg Rev / Account"          value={fmt(m.avgRevenuePerAccount)} sub="Active tenants only"                        icon={DollarSign}  color="text-emerald-600" />
          <KpiCard label="New Tenants (Month)"        value={m.newTenantsThisMonth}       sub={`${m.churnedThisMonth} churned`}            icon={ArrowUpRight} color="text-blue-600"  href="/tenants" />
          <KpiCard label="System Uptime (30d)"        value={`${m.systemUptime}%`}        sub={degraded.length > 0 ? `${degraded.length} degraded` : 'All operational'} icon={Server} color={degraded.length > 0 ? 'text-amber-600' : 'text-emerald-600'} href="/system" />
          <KpiCard label="Churned Tenants"            value={m.churnedTenants}            sub="All time"                                   icon={AlertTriangle} color="text-red-600"  href="/tenants" />
        </div>
      )}

      {/* Charts + info row */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* MRR Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">MRR trend</CardTitle>
              <Button size="sm" variant="outline" className="text-xs" asChild>
                <Link href="/billing">Full report <ArrowUpRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="py-4">
            {trend.isLoading ? (
              <Skeleton className="h-28 w-full" />
            ) : trend.data ? (
              <>
                <MrrChart data={trend.data} />
                <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                  {trend.data.slice(-1).map((d) => (
                    <span key="last">
                      <span className="font-semibold text-emerald-600">+${d.newMrr.toLocaleString()} new</span>
                      {' · '}
                      <span className="font-semibold text-red-500">−${d.churnedMrr.toLocaleString()} churned</span>
                      {' this month'}
                    </span>
                  ))}
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>

        {/* Plan distribution */}
        <Card>
          <CardHeader className="border-b py-3">
            <CardTitle className="text-sm">Plan distribution</CardTitle>
          </CardHeader>
          <CardContent className="py-4 space-y-3">
            {tenants.isLoading
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-8" />)
              : planDist.map((p) => (
                <div key={p.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{p.label}</span>
                    <span className="font-semibold">{p.count} tenants</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn('h-full rounded-full', p.color)}
                      style={{ width: `${(p.count / (tenants.data?.length ?? 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            }
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Recent tenants */}
        <Card>
          <CardHeader className="border-b py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Recent sign-ups</CardTitle>
              <Button size="sm" variant="outline" className="text-xs" asChild>
                <Link href="/tenants">All tenants</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {tenants.isLoading
              ? <div className="space-y-2 p-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
              : (
                <ul className="divide-y">
                  {recentTenants.map((t) => (
                    <li key={t.id}>
                      <Link href={`/tenants/${t.id}`} className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold">{t.name}</p>
                          <p className="text-[10px] text-muted-foreground">{t.owner.email} · {t.country}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="secondary" className={cn('text-[10px]', t.plan === 'enterprise' ? 'bg-violet-100 text-violet-700' : t.plan === 'business' ? 'bg-blue-100 text-blue-700' : '')}>
                            {t.plan}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">{formatAgo(t.createdAt)}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )
            }
          </CardContent>
        </Card>

        {/* System health strip */}
        <Card>
          <CardHeader className="border-b py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">System health</CardTitle>
              <Button size="sm" variant="outline" className="text-xs" asChild>
                <Link href="/system">Details</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {system.isLoading
              ? <div className="space-y-2 p-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8" />)}</div>
              : (
                <ul className="divide-y">
                  {(system.data ?? []).slice(0, 7).map((c) => (
                    <li key={c.id} className="flex items-center justify-between px-4 py-2">
                      <div className="flex items-center gap-2">
                        {c.status === 'operational' ? (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        ) : c.status === 'degraded' ? (
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                        ) : (
                          <span className="relative flex h-3.5 w-3.5 shrink-0">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-red-500" />
                          </span>
                        )}
                        <span className="text-xs text-foreground">{c.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {c.latencyMs !== undefined && (
                          <span className="text-[10px] tabular-nums text-muted-foreground">{c.latencyMs}ms</span>
                        )}
                        <Badge
                          variant={c.status === 'operational' ? 'success' : c.status === 'degraded' ? 'warning' : 'danger'}
                          className="text-[10px]"
                        >
                          {c.status}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            }
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
