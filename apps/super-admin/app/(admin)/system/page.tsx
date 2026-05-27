'use client';

import { useMemo } from 'react';
import { AlertTriangle, CheckCircle2, Clock, RefreshCw, XCircle, Wrench, Zap } from 'lucide-react';
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
import { useSystemComponents, useSystemIncidents } from '@/lib/queries';
import type { ComponentStatus } from '@/lib/mock-data';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}

const STATUS_META: Record<ComponentStatus, {
  label: string;
  icon: React.ElementType;
  iconColor: string;
  badgeVariant: 'success' | 'warning' | 'danger' | 'secondary';
  rowBg: string;
}> = {
  operational:  { label: 'Operational',  icon: CheckCircle2, iconColor: 'text-emerald-500', badgeVariant: 'success',   rowBg: '' },
  degraded:     { label: 'Degraded',     icon: AlertTriangle,iconColor: 'text-amber-500',   badgeVariant: 'warning',   rowBg: 'bg-amber-50/30 dark:bg-amber-950/10' },
  outage:       { label: 'Outage',       icon: XCircle,      iconColor: 'text-red-500',     badgeVariant: 'danger',    rowBg: 'bg-red-50/30 dark:bg-red-950/10' },
  maintenance:  { label: 'Maintenance',  icon: Wrench,       iconColor: 'text-blue-500',    badgeVariant: 'secondary', rowBg: 'bg-blue-50/20 dark:bg-blue-950/10' },
};

const INCIDENT_SEVERITY: Record<string, { variant: 'danger' | 'warning' | 'secondary'; label: string }> = {
  critical: { variant: 'danger',    label: 'Critical' },
  major:    { variant: 'warning',   label: 'Major' },
  minor:    { variant: 'secondary', label: 'Minor' },
};

const INCIDENT_STATUS: Record<string, { color: string; dot: string }> = {
  investigating: { color: 'text-red-600',   dot: 'bg-red-500 animate-pulse' },
  identified:    { color: 'text-amber-600', dot: 'bg-amber-500 animate-pulse' },
  monitoring:    { color: 'text-blue-600',  dot: 'bg-blue-500' },
  resolved:      { color: 'text-emerald-600', dot: 'bg-emerald-500' },
};

const CATEGORY_LABEL: Record<string, string> = {
  api: 'API', database: 'Database', queue: 'Queue',
  storage: 'Storage', email: 'Email', cdn: 'CDN', workers: 'Workers',
};

// ─── Latency Sparkline ─────────────────────────────────────────────────────────

function LatencySparkline({ data, status }: { data: number[]; status: ComponentStatus }) {
  if (data.length < 2) return <span className="text-[10px] text-muted-foreground">—</span>;
  const W = 60; const H = 20;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - (v / max) * H,
  }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const color = status === 'degraded' ? '#f59e0b' : status === 'outage' ? '#ef4444' : '#10b981';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-14 shrink-0" style={{ height: H }}>
      <path d={line} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SystemPage() {
  const components = useSystemComponents();
  const incidents  = useSystemIncidents();

  const openIncidents = useMemo(
    () => (incidents.data ?? []).filter((i) => i.status !== 'resolved'),
    [incidents.data],
  );
  const resolvedIncidents = useMemo(
    () => (incidents.data ?? []).filter((i) => i.status === 'resolved'),
    [incidents.data],
  );

  const overallStatus = useMemo(() => {
    const comps = components.data ?? [];
    if (comps.some((c) => c.status === 'outage'))    return 'outage';
    if (comps.some((c) => c.status === 'degraded'))  return 'degraded';
    if (comps.some((c) => c.status === 'maintenance')) return 'maintenance';
    return 'operational';
  }, [components.data]);

  const grouped = useMemo(() => {
    const comps = components.data ?? [];
    const map: Record<string, typeof comps> = {};
    for (const c of comps) {
      if (!map[c.category]) map[c.category] = [];
      map[c.category]!.push(c);
    }
    return map;
  }, [components.data]);

  const avgUptime = useMemo(() => {
    const comps = components.data ?? [];
    if (!comps.length) return 100;
    return comps.reduce((s, c) => s + c.uptime30d, 0) / comps.length;
  }, [components.data]);

  return (
    <div className="space-y-5 p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Super Admin</p>
          <h1 className="font-display text-2xl font-bold tracking-tight">System Health</h1>
          <p className="text-sm text-muted-foreground">Real-time status of all platform components.</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-3.5 w-3.5" />Refresh
        </Button>
      </header>

      {/* Overall status banner */}
      {components.isLoading ? (
        <Skeleton className="h-16 w-full" />
      ) : (
        <div className={cn(
          'flex items-center gap-4 rounded-xl border px-5 py-4',
          overallStatus === 'operational'  ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30' :
          overallStatus === 'degraded'     ? 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30' :
          overallStatus === 'outage'       ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30' :
                                             'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30',
        )}>
          {overallStatus === 'operational' ? (
            <CheckCircle2 className="h-7 w-7 text-emerald-500 shrink-0" />
          ) : overallStatus === 'degraded' ? (
            <AlertTriangle className="h-7 w-7 text-amber-500 shrink-0" />
          ) : (
            <XCircle className="h-7 w-7 text-red-500 shrink-0" />
          )}
          <div>
            <p className={cn('font-semibold', overallStatus === 'operational' ? 'text-emerald-800 dark:text-emerald-300' : overallStatus === 'degraded' ? 'text-amber-800 dark:text-amber-300' : 'text-red-800 dark:text-red-300')}>
              {overallStatus === 'operational' ? 'All systems operational' :
               overallStatus === 'degraded'    ? `${openIncidents.length} incident${openIncidents.length !== 1 ? 's' : ''} affecting platform performance` :
                                                 'Major outage in progress'}
            </p>
            <p className="text-xs text-muted-foreground">
              Avg 30-day uptime: {avgUptime.toFixed(2)}% · {components.data?.length ?? 0} components monitored
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />Last checked: just now
          </div>
        </div>
      )}

      {/* Active incidents */}
      {(openIncidents.length > 0 || incidents.isLoading) && (
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader className="border-b py-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
              <CardTitle className="text-sm text-amber-700 dark:text-amber-400">
                Active Incidents ({openIncidents.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {incidents.isLoading ? (
              <div className="space-y-2 p-4">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
            ) : (
              <ul className="divide-y">
                {openIncidents.map((inc) => {
                  const sev = INCIDENT_SEVERITY[inc.severity] ?? INCIDENT_SEVERITY.minor!;
                  const ist = INCIDENT_STATUS[inc.status] ?? INCIDENT_STATUS.investigating!;
                  return (
                    <li key={inc.id} className="px-4 py-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={cn('h-2 w-2 rounded-full shrink-0', ist.dot)} />
                            <p className="text-sm font-semibold">{inc.title}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Affects: <span className="font-medium">{inc.component}</span> · Started {formatAgo(inc.startedAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={sev.variant} className="text-[10px]">{sev.label}</Badge>
                          <span className={cn('text-xs font-medium capitalize', ist.color)}>{inc.status}</span>
                          <Button size="sm" variant="outline" className="h-6 px-2 text-[10px]">Update</Button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {/* Component grid by category */}
      {components.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(grouped).map(([category, comps]) => (
            <Card key={category}>
              <CardHeader className="border-b py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {CATEGORY_LABEL[category] ?? category}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    {comps.some((c) => c.status !== 'operational') && (
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    )}
                    <span className="text-[10px] text-muted-foreground">{comps.length} component{comps.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y">
                  {comps.map((comp) => {
                    const sm = STATUS_META[comp.status];
                    const Icon = sm.icon;
                    return (
                      <li key={comp.id} className={cn('flex items-center gap-3 px-4 py-2.5', sm.rowBg)}>
                        <Icon className={cn('h-4 w-4 shrink-0', sm.iconColor)} />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium truncate">{comp.name}</p>
                          <p className="text-[10px] text-muted-foreground">Uptime 30d: {comp.uptime30d}%</p>
                        </div>
                        {comp.latencyMs !== undefined && (
                          <div className="hidden sm:flex items-center gap-2">
                            <LatencySparkline data={comp.sparkline} status={comp.status} />
                            <span className={cn('text-[10px] tabular-nums font-medium',
                              comp.latencyMs > 500 ? 'text-red-600' : comp.latencyMs > 200 ? 'text-amber-600' : 'text-muted-foreground',
                            )}>{comp.latencyMs}ms</span>
                          </div>
                        )}
                        <Badge variant={sm.badgeVariant} className="shrink-0 text-[10px]">{sm.label}</Badge>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Uptime summary bar */}
      <Card>
        <CardHeader className="border-b py-3">
          <CardTitle className="text-sm">30-Day Uptime by Component</CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          {components.isLoading ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-5" />)}</div>
          ) : (
            <div className="space-y-2.5">
              {(components.data ?? []).map((comp) => {
                const pct = comp.uptime30d;
                const color = pct >= 99.9 ? 'bg-emerald-500' : pct >= 99 ? 'bg-amber-500' : 'bg-red-500';
                return (
                  <div key={comp.id} className="flex items-center gap-3 text-xs">
                    <span className="w-44 shrink-0 truncate text-muted-foreground">{comp.name}</span>
                    <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className={cn('h-full rounded-full', color)} style={{ width: `${pct}%` }} />
                    </div>
                    <span className={cn('w-14 text-right tabular-nums font-medium',
                      pct >= 99.9 ? 'text-emerald-600' : pct >= 99 ? 'text-amber-600' : 'text-red-600',
                    )}>{pct.toFixed(2)}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resolved incidents */}
      {resolvedIncidents.length > 0 && (
        <Card>
          <CardHeader className="border-b py-3">
            <CardTitle className="text-sm">Recently Resolved</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y">
              {resolvedIncidents.map((inc) => (
                <li key={inc.id} className="flex items-center justify-between px-4 py-2.5">
                  <div>
                    <p className="text-xs font-medium">{inc.title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {inc.component} · Resolved {inc.resolvedAt ? formatAgo(inc.resolvedAt) : '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] capitalize">{inc.severity}</Badge>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Footer note */}
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <Zap className="h-3 w-3 text-emerald-500" />
        Status checks run every 60 seconds. <span className="text-primary hover:underline cursor-pointer">View status page →</span>
      </div>
    </div>
  );
}
