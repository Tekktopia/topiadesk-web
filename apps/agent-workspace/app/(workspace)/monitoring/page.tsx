'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import type { ComponentType } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock,
  RefreshCw,
  Server,
  ShieldAlert,
  TrendingUp,
  WifiOff,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  Sparkline,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from '@topiadesk/ui';
import {
  useNOCMetrics,
  useMonitoringAlerts,
  useDevices,
  useUptimeTrend,
  useIncidents,
} from '@/lib/queries';
import type { MockMonAlert, MockDevice } from '@/lib/mock-data';

// ─── Severity / status helpers ────────────────────────────────────────────────

const SEVERITY_META = {
  critical: { cls: 'bg-red-500', textCls: 'text-red-600 dark:text-red-400', badge: 'danger' as const, label: 'Critical' },
  error:    { cls: 'bg-orange-500', textCls: 'text-orange-600 dark:text-orange-400', badge: 'warning' as const, label: 'Error' },
  warning:  { cls: 'bg-amber-500', textCls: 'text-amber-600 dark:text-amber-400', badge: 'warning' as const, label: 'Warning' },
  info:     { cls: 'bg-blue-500', textCls: 'text-blue-600 dark:text-blue-400', badge: 'secondary' as const, label: 'Info' },
} as const;

const STATUS_META = {
  up:      { dot: 'bg-emerald-500', label: 'UP',      text: 'text-emerald-600' },
  down:    { dot: 'bg-red-500',     label: 'DOWN',    text: 'text-red-600' },
  warning: { dot: 'bg-amber-500',   label: 'WARNING', text: 'text-amber-600' },
  paused:  { dot: 'bg-slate-400',   label: 'PAUSED',  text: 'text-slate-500' },
  unknown: { dot: 'bg-slate-300',   label: 'UNKNOWN', text: 'text-slate-400' },
} as const;

// ─── Static chart data ────────────────────────────────────────────────────────

const ALERT_TREND  = [2, 3, 2, 5, 4, 3, 6, 5, 4, 5, 6, 6] as const;
const DEVICE_TREND = [14, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NOCDashboardPage() {
  const metrics  = useNOCMetrics();
  const alerts   = useMonitoringAlerts();
  const devices  = useDevices();
  const trend    = useUptimeTrend();
  const incidents = useIncidents();

  const activeAlerts = useMemo(
    () => (alerts.data ?? []).filter((a) => a.state !== 'resolved')
           .sort((a, b) => {
             const order = { critical: 0, error: 1, warning: 2, info: 3 };
             return (order[a.severity] ?? 4) - (order[b.severity] ?? 4);
           }),
    [alerts.data],
  );

  const siteBreakdown = useMemo(() => {
    const map = new Map<string, { up: number; down: number; warning: number; total: number }>();
    for (const d of devices.data ?? []) {
      const rec = map.get(d.site) ?? { up: 0, down: 0, warning: 0, total: 0 };
      rec.total++;
      if (d.status === 'up') rec.up++;
      else if (d.status === 'down') rec.down++;
      else if (d.status === 'warning') rec.warning++;
      map.set(d.site, rec);
    }
    return Array.from(map.entries()).map(([site, counts]) => ({ site, ...counts }));
  }, [devices.data]);

  const downDevices = useMemo(
    () => (devices.data ?? []).filter((d) => d.status === 'down' || d.status === 'warning'),
    [devices.data],
  );

  const openIncidents = useMemo(
    () => (incidents.data ?? []).filter((i) => i.state !== 'resolved'),
    [incidents.data],
  );

  const m = metrics.data;

  return (
    <div className="space-y-5 p-5">
      <PageHeader />

      {/* Status summary strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatusTile label="Devices up" value={m?.upDevices} color="emerald" icon={CheckCircle2} loading={metrics.isLoading} />
        <StatusTile label="Devices down" value={m?.downDevices} color="red" icon={WifiOff} loading={metrics.isLoading} href="/monitoring/down" />
        <StatusTile label="Warning" value={m?.warningDevices} color="amber" icon={AlertTriangle} loading={metrics.isLoading} href="/monitoring/down" />
        <StatusTile label="Paused" value={m?.pausedDevices} color="slate" icon={Clock} loading={metrics.isLoading} />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={Server} label="Devices monitored" value={m?.totalDevices} sub={`${m?.totalSensors ?? '—'} sensors total`} trend={DEVICE_TREND} accent="default" loading={metrics.isLoading} />
        <MetricCard icon={Bell} label="Active alerts" value={m?.activeAlerts} sub={`${m?.criticalAlerts ?? 0} critical`} trend={ALERT_TREND} accent={m && m.criticalAlerts > 0 ? 'danger' : 'warning'} loading={metrics.isLoading} />
        <MetricCard icon={ShieldAlert} label="Open incidents" value={m?.openIncidents} sub="Requires attention" trend={[0,0,1,1,1,1,2,2,2,2,2,2]} accent={m && m.openIncidents > 0 ? 'danger' : 'default'} loading={metrics.isLoading} />
        <MetricCard icon={TrendingUp} label="Avg uptime (30d)" value={m ? `${m.avgUptime30d}%` : undefined} sub="Across all devices" trend={[99.1,99.5,99.8,97.2,98.7,99.9,99.6,97.8,98.2,98.9,97.8,97.8]} accent="success" loading={metrics.isLoading} />
      </div>

      {/* Alerts + Site breakdown */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
            <div>
              <CardTitle className="text-sm">Active alerts</CardTitle>
              <p className="text-xs text-muted-foreground">Sorted by severity — most urgent first</p>
            </div>
            <Link href="/monitoring/alerts" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              All alerts <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {alerts.isLoading ? (
              <div className="space-y-2 p-4"><Skeleton className="h-12" /><Skeleton className="h-12" /><Skeleton className="h-12" /></div>
            ) : activeAlerts.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                <p className="text-sm font-medium">All clear — no active alerts</p>
              </div>
            ) : (
              <ul className="divide-y">
                {activeAlerts.slice(0, 7).map((a) => <AlertRow key={a.id} alert={a} />)}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b py-3">
            <CardTitle className="text-sm">Status by site</CardTitle>
            <p className="text-xs text-muted-foreground">Device health per location</p>
          </CardHeader>
          <CardContent className="pt-4">
            {devices.isLoading ? (
              <div className="space-y-3"><Skeleton className="h-8" /><Skeleton className="h-8" /><Skeleton className="h-8" /></div>
            ) : (
              <div className="space-y-3">
                {siteBreakdown.map((s) => (
                  <div key={s.site} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">{s.site}</span>
                      <span className="text-muted-foreground">{s.total} devices</span>
                    </div>
                    <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                      {s.up > 0 && <div className="bg-emerald-500" style={{ width: `${(s.up / s.total) * 100}%` }} />}
                      {s.warning > 0 && <div className="bg-amber-500" style={{ width: `${(s.warning / s.total) * 100}%` }} />}
                      {s.down > 0 && <div className="bg-red-500" style={{ width: `${(s.down / s.total) * 100}%` }} />}
                    </div>
                    <div className="flex gap-3 text-[10px] text-muted-foreground">
                      {s.up > 0 && <span className="text-emerald-600">{s.up} up</span>}
                      {s.warning > 0 && <span className="text-amber-600">{s.warning} warn</span>}
                      {s.down > 0 && <span className="text-red-600">{s.down} down</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 border-t pt-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Sensor summary</p>
              <div className="space-y-1.5 text-xs">
                <SensorStatRow label="Up" count={m?.upSensors ?? 0} dotCls="bg-emerald-500" />
                <SensorStatRow label="Warning" count={m?.warningSensors ?? 0} dotCls="bg-amber-500" />
                <SensorStatRow label="Down" count={m?.downSensors ?? 0} dotCls="bg-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Uptime trend + Problem devices */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
            <div>
              <CardTitle className="text-sm">Uptime trend</CardTitle>
              <p className="text-xs text-muted-foreground">Average device availability — last 7 days + today</p>
            </div>
            <div className="flex gap-3 text-xs">
              <LegendDot color="bg-primary" label="Uptime %" />
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            {trend.isLoading ? <Skeleton className="h-36" /> : <UptimeChart data={trend.data ?? []} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
            <div>
              <CardTitle className="text-sm">Devices needing attention</CardTitle>
              <p className="text-xs text-muted-foreground">Down or degraded</p>
            </div>
            <Link href="/monitoring/down" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {devices.isLoading ? (
              <div className="space-y-2 p-4"><Skeleton className="h-10" /><Skeleton className="h-10" /></div>
            ) : downDevices.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">All devices are up.</p>
            ) : (
              <ul className="divide-y">
                {downDevices.slice(0, 5).map((d) => <ProblemDeviceRow key={d.id} device={d} />)}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Open incidents */}
      {openIncidents.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
            <div>
              <CardTitle className="text-sm">Open incidents</CardTitle>
              <p className="text-xs text-muted-foreground">Active and investigating</p>
            </div>
            <Link href="/monitoring/incidents" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              Incident log <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y">
              {openIncidents.map((inc) => {
                const meta = SEVERITY_META[inc.severity];
                return (
                  <li key={inc.id}>
                    <Link href="/monitoring/incidents" className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50">
                      <span className={cn('h-2 w-2 shrink-0 rounded-full', meta.cls)} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{inc.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {inc.affectedSites.join(', ')} · {inc.affectedDevices.length} device{inc.affectedDevices.length > 1 ? 's' : ''} affected
                        </p>
                      </div>
                      <Badge variant={meta.badge} className="shrink-0 text-[10px] capitalize">
                        {inc.state}
                      </Badge>
                      <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── PageHeader ───────────────────────────────────────────────────────────────

function PageHeader() {
  return (
    <div className="relative -mx-5 -mt-5 mb-1 overflow-hidden bg-gradient-to-br from-blue-700 to-blue-800 px-5 py-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Monitoring</p>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">NOC Dashboard</h1>
          <p className="mt-0.5 text-sm text-white/70">
            Network Operations Centre — live infrastructure health across all sites
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-white/20 bg-white/10 text-white text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live · updates every 60s
          </Badge>
          <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
            <RefreshCw className="h-3 w-3" />
            Refresh
          </Button>
          <Button size="sm" className="bg-white text-blue-700 hover:bg-white/90" asChild>
            <Link href="/monitoring/incidents">
              <Activity className="h-3 w-3" />
              New incident
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── StatusTile ───────────────────────────────────────────────────────────────

const STATUS_TILE_COLORS = {
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-700', card: 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30' },
  red:     { bg: 'bg-red-500',     text: 'text-red-700',     card: 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30' },
  amber:   { bg: 'bg-amber-500',   text: 'text-amber-700',   card: 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30' },
  slate:   { bg: 'bg-slate-400',   text: 'text-slate-600',   card: 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/30' },
} as const;

function StatusTile({ label, value, color, icon: Icon, loading, href }: {
  label: string; value: number | undefined; color: keyof typeof STATUS_TILE_COLORS;
  icon: ComponentType<{ className?: string }>; loading?: boolean; href?: string;
}) {
  const cls = STATUS_TILE_COLORS[color];
  const content = (
    <div className={cn('flex items-center gap-4 rounded-xl border p-4 transition-colors', cls.card, href && 'cursor-pointer hover:opacity-90')}>
      <div className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-lg', cls.bg)}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        {loading ? <Skeleton className="h-7 w-10" /> : (
          <p className={cn('text-2xl font-bold tabular-nums', cls.text)}>{value ?? '—'}</p>
        )}
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

type Accent = 'default' | 'warning' | 'success' | 'danger';

const ACCENT_CLS: Record<Accent, { bg: string; spark: string }> = {
  default: { bg: 'bg-muted text-muted-foreground',       spark: 'text-muted-foreground' },
  warning: { bg: 'bg-amber-100 text-amber-700',          spark: 'text-amber-500' },
  success: { bg: 'bg-emerald-100 text-emerald-700',      spark: 'text-emerald-500' },
  danger:  { bg: 'bg-red-100 text-red-700',              spark: 'text-red-500' },
};

function MetricCard({ icon: Icon, label, value, sub, trend, accent, loading }: {
  icon: ComponentType<{ className?: string }>; label: string; value: number | string | undefined;
  sub: string; trend: readonly number[]; accent: Accent; loading?: boolean;
}) {
  const cls = ACCENT_CLS[accent];
  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
            {loading ? <Skeleton className="mt-1 h-7 w-16" /> : (
              <p className="mt-0.5 text-2xl font-bold tracking-tight">{value ?? '—'}</p>
            )}
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{sub}</p>
          </div>
          <div className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-lg', cls.bg)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <Sparkline data={[...trend]} width={240} height={28} className={cls.spark} />
      </CardContent>
    </Card>
  );
}

// ─── AlertRow ─────────────────────────────────────────────────────────────────

function AlertRow({ alert: a }: { alert: MockMonAlert }) {
  const meta = SEVERITY_META[a.severity];
  return (
    <li>
      <Link href="/monitoring/alerts" className="flex items-start gap-3 px-4 py-2.5 transition-colors hover:bg-muted/50">
        <span className={cn('mt-1 h-2 w-2 shrink-0 rounded-full', meta.cls)} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Badge variant={meta.badge} className="text-[10px]">{meta.label}</Badge>
            {a.state === 'acknowledged' && (
              <span className="text-[10px] text-muted-foreground">Acknowledged</span>
            )}
          </div>
          <p className="mt-0.5 truncate text-xs font-medium">{a.title}</p>
          <p className="truncate text-[10px] text-muted-foreground">
            {a.deviceName} · {a.site} · {a.sensorName}
          </p>
        </div>
        <span className="shrink-0 text-[10px] text-muted-foreground">
          {formatAgo(a.triggeredAt)}
        </span>
      </Link>
    </li>
  );
}

// ─── ProblemDeviceRow ─────────────────────────────────────────────────────────

function ProblemDeviceRow({ device: d }: { device: MockDevice }) {
  const meta = STATUS_META[d.status];
  return (
    <li>
      <Link href={`/monitoring/devices/${d.id}`} className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-muted/50">
        <span className={cn('h-2 w-2 shrink-0 rounded-full', meta.dot)} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium">{d.name}</p>
          <p className="truncate text-[10px] text-muted-foreground">{d.site} · {d.ip}</p>
        </div>
        <span className={cn('text-[10px] font-semibold', meta.text)}>{meta.label}</span>
      </Link>
    </li>
  );
}

// ─── UptimeChart ──────────────────────────────────────────────────────────────

function UptimeChart({ data }: { data: { day: string; upPct: number; events: number }[] }) {
  const W = 520; const H = 120; const pX = 24; const pY = 8;
  const iW = W - pX * 2; const iH = H - pY * 2;
  const min = 96; const range = 100 - min;
  const pts = data.map((d, i) => {
    const x = pX + (i / (data.length - 1)) * iW;
    const y = pY + iH - ((d.upPct - min) / range) * iH;
    return [x, y] as const;
  });
  const path = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const first = pts[0]; const last = pts[pts.length - 1];
  const area = first && last ? `${path} L ${last[0].toFixed(1)} ${H - pY} L ${first[0].toFixed(1)} ${H - pY} Z` : '';
  return (
    <div className="space-y-2">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} className="overflow-visible">
        {[96, 98, 100].map((v) => {
          const y = pY + iH - ((v - min) / range) * iH;
          return (
            <g key={v}>
              <line x1={pX} x2={W - pX} y1={y} y2={y} stroke="currentColor" className="text-border" strokeDasharray="2 4" strokeWidth={1} />
              <text x={pX - 2} y={y + 3} fontSize={8} textAnchor="end" className="fill-muted-foreground font-mono">{v}%</text>
            </g>
          );
        })}
        {area && <path d={area} fill="currentColor" className="text-primary" fillOpacity={0.08} />}
        <path d={path} fill="none" stroke="currentColor" className="text-primary" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {pts.map(([x, y], i) => (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <circle cx={x} cy={y} r={3.5} fill="currentColor" className={cn('cursor-default', data[i]?.events ? 'text-red-500' : 'text-primary')} />
            </TooltipTrigger>
            <TooltipContent>{data[i]?.day}: {data[i]?.upPct}% uptime{data[i]?.events ? ` · ${data[i].events} event${data[i].events > 1 ? 's' : ''}` : ''}</TooltipContent>
          </Tooltip>
        ))}
      </svg>
      <div className="flex justify-between px-6 text-[10px] text-muted-foreground">
        {data.map((d) => <span key={d.day} className={d.day === 'Today' ? 'font-semibold text-foreground' : ''}>{d.day}</span>)}
      </div>
    </div>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function SensorStatRow({ label, count, dotCls }: { label: string; count: number; dotCls: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn('h-1.5 w-1.5 rounded-full', dotCls)} />
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-auto font-medium tabular-nums">{count}</span>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className={cn('h-2 w-2 rounded-full', color)} />
      {label}
    </span>
  );
}

function formatAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}
