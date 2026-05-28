'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCircle2,
  Filter,
  Search,
  X,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
  Skeleton,
  cn,
} from '@topiadesk/ui';
import { useMonitoringAlerts } from '@/lib/queries';
import type { MockMonAlert, MonAlertSeverity, MonAlertState } from '@/lib/mock-data';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SEVERITY_ORDER: Record<MonAlertSeverity, number> = { critical: 0, error: 1, warning: 2, info: 3 };

const SEV_META: Record<MonAlertSeverity, { badge: 'danger' | 'warning' | 'secondary'; dot: string; label: string }> = {
  critical: { badge: 'danger',    dot: 'bg-red-500',    label: 'Critical' },
  error:    { badge: 'warning',   dot: 'bg-orange-500', label: 'Error' },
  warning:  { badge: 'warning',   dot: 'bg-amber-500',  label: 'Warning' },
  info:     { badge: 'secondary', dot: 'bg-blue-500',   label: 'Info' },
};

const STATE_META: Record<MonAlertState, { label: string; cls: string }> = {
  active:       { label: 'Active',       cls: 'text-red-600 dark:text-red-400' },
  acknowledged: { label: 'Acknowledged', cls: 'text-amber-600 dark:text-amber-400' },
  resolved:     { label: 'Resolved',     cls: 'text-emerald-600 dark:text-emerald-400' },
};

function formatAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type StateFilter = 'all' | MonAlertState;
type SevFilter = 'all' | MonAlertSeverity;

export default function AlertsFeedPage() {
  const alerts = useMonitoringAlerts();
  const [stateFilter, setStateFilter] = useState<StateFilter>('all');
  const [sevFilter, setSevFilter] = useState<SevFilter>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = alerts.data ?? [];
    if (stateFilter !== 'all') list = list.filter((a) => a.state === stateFilter);
    if (sevFilter !== 'all')   list = list.filter((a) => a.severity === sevFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) => a.title.toLowerCase().includes(q) || a.deviceName.toLowerCase().includes(q) || a.site.toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
  }, [alerts.data, stateFilter, sevFilter, search]);

  const counts = useMemo(() => {
    const all = alerts.data ?? [];
    return {
      active:       all.filter((a) => a.state === 'active').length,
      acknowledged: all.filter((a) => a.state === 'acknowledged').length,
      resolved:     all.filter((a) => a.state === 'resolved').length,
      critical:     all.filter((a) => a.severity === 'critical').length,
      error:        all.filter((a) => a.severity === 'error').length,
      warning:      all.filter((a) => a.severity === 'warning').length,
    };
  }, [alerts.data]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
      {/* Gradient header */}
      <div className="relative overflow-hidden rounded-2xl bg-navy px-6 py-5 shadow-lg shadow-navy/15">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Monitoring</p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">Alerts Feed</h1>
            <p className="mt-0.5 text-sm text-white/70">All infrastructure alerts — active, acknowledged and resolved</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" asChild>
              <Link href="/monitoring/alerts/rules">
                <Filter className="h-3 w-3" />
                Alert rules
              </Link>
            </Button>
            <Button size="sm" className="bg-coral text-white hover:bg-white/90">
              <Bell className="h-3 w-3" />
              New alert rule
            </Button>
          </div>
        </div>
      </div>
      </div>

      <div className="flex-1 min-h-0 space-y-5 overflow-y-auto p-5 pt-5">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {[
          { label: 'Active', count: counts.active, color: 'text-red-600' },
          { label: 'Acknowledged', count: counts.acknowledged, color: 'text-amber-600' },
          { label: 'Resolved', count: counts.resolved, color: 'text-emerald-600' },
          { label: 'Critical', count: counts.critical, color: 'text-red-600' },
          { label: 'Error', count: counts.error, color: 'text-orange-600' },
          { label: 'Warning', count: counts.warning, color: 'text-amber-600' },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border bg-card p-3 text-center">
            <p className={cn('text-xl font-bold tabular-nums', s.color)}>{s.count}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <Card>
        {/* Filters */}
        <CardHeader className="border-b py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* State tabs */}
            <div className="flex rounded-lg border p-0.5 text-xs">
              {(['all', 'active', 'acknowledged', 'resolved'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStateFilter(s)}
                  className={cn(
                    'rounded-md px-2.5 py-1 font-medium capitalize transition-colors',
                    stateFilter === s ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {s === 'all' ? `All (${alerts.data?.length ?? 0})` : `${s.charAt(0).toUpperCase() + s.slice(1)} (${counts[s as keyof typeof counts] ?? 0})`}
                </button>
              ))}
            </div>

            {/* Severity filter */}
            <div className="flex gap-1">
              {(['all', 'critical', 'error', 'warning', 'info'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSevFilter(s)}
                  className={cn(
                    'rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors',
                    sevFilter === s ? 'bg-foreground text-background' : 'border-border text-muted-foreground hover:border-foreground',
                  )}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative ml-auto">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search alerts…"
                className="h-8 w-52 pl-8 text-xs"
              />
              {search && (
                <button type="button" onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {alerts.isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              <p className="text-sm font-medium">No alerts match your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                    <th className="px-4 py-2.5 font-semibold">Severity</th>
                    <th className="px-3 py-2.5 font-semibold">Alert</th>
                    <th className="px-3 py-2.5 font-semibold">Device</th>
                    <th className="px-3 py-2.5 font-semibold">Site</th>
                    <th className="px-3 py-2.5 font-semibold">Sensor</th>
                    <th className="px-3 py-2.5 font-semibold">State</th>
                    <th className="px-3 py-2.5 font-semibold">Triggered</th>
                    <th className="px-3 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((a) => <AlertTableRow key={a.id} alert={a} />)}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

// ─── AlertTableRow ────────────────────────────────────────────────────────────

function AlertTableRow({ alert: a }: { alert: MockMonAlert }) {
  const sev = SEV_META[a.severity];
  const state = STATE_META[a.state];
  const rowBg = a.state === 'active' && a.severity === 'critical'
    ? 'bg-red-50/40 dark:bg-red-950/20'
    : '';
  return (
    <tr className={cn('transition-colors hover:bg-muted/40', rowBg)}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {a.state === 'active' && a.severity === 'critical' && (
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
          )}
          <Badge variant={sev.badge} className="text-[10px]">{sev.label}</Badge>
        </div>
      </td>
      <td className="max-w-[260px] px-3 py-3">
        <p className="truncate font-medium text-foreground">{a.title}</p>
        <p className="mt-0.5 truncate text-muted-foreground">{a.message.slice(0, 90)}…</p>
      </td>
      <td className="px-3 py-3">
        <Link href={`/monitoring/devices/${a.deviceId}`} className="font-medium text-primary hover:underline">
          {a.deviceName}
        </Link>
      </td>
      <td className="px-3 py-3 text-muted-foreground">{a.site}</td>
      <td className="px-3 py-3 text-muted-foreground">{a.sensorName}</td>
      <td className="px-3 py-3">
        <span className={cn('font-medium', state.cls)}>{state.label}</span>
        {a.acknowledgedBy && (
          <p className="text-[10px] text-muted-foreground">{a.acknowledgedBy}</p>
        )}
      </td>
      <td className="px-3 py-3 tabular-nums text-muted-foreground">{formatAgo(a.triggeredAt)}</td>
      <td className="px-3 py-3">
        <div className="flex gap-1.5">
          {a.state === 'active' && (
            <Button size="sm" variant="outline" className="h-7 px-2 text-[11px]">
              Acknowledge
            </Button>
          )}
          {a.state === 'active' && (
            <Button size="sm" variant="outline" className="h-7 px-2 text-[11px]">
              Resolve
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
