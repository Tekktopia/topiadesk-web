'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Bell,
  BellOff,
  CheckCircle2,
  Clock,
  Plus,
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
import { useAlertRules } from '@/lib/queries';
import type { MonAlertSeverity } from '@/lib/mock-data';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}

const SEV_META: Record<MonAlertSeverity, { badge: 'danger' | 'warning' | 'secondary'; label: string; dot: string }> = {
  critical: { badge: 'danger',    label: 'Critical', dot: 'bg-red-500' },
  error:    { badge: 'warning',   label: 'Error',    dot: 'bg-orange-500' },
  warning:  { badge: 'warning',   label: 'Warning',  dot: 'bg-amber-500' },
  info:     { badge: 'secondary', label: 'Info',     dot: 'bg-blue-500' },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AlertRulesPage() {
  const rules = useAlertRules();
  const [search, setSearch] = useState('');
  const [sevFilter, setSevFilter] = useState<'all' | MonAlertSeverity>('all');
  const [enabledFilter, setEnabledFilter] = useState<'all' | 'enabled' | 'disabled'>('all');

  const filtered = useMemo(() => {
    let list = rules.data ?? [];
    if (sevFilter !== 'all')       list = list.filter((r) => r.severity === sevFilter);
    if (enabledFilter === 'enabled')  list = list.filter((r) => r.enabled);
    if (enabledFilter === 'disabled') list = list.filter((r) => !r.enabled);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) => r.name.toLowerCase().includes(q) || r.target.toLowerCase().includes(q) || r.metric.toLowerCase().includes(q),
      );
    }
    return list;
  }, [rules.data, sevFilter, enabledFilter, search]);

  const counts = useMemo(() => {
    const all = rules.data ?? [];
    return {
      enabled:  all.filter((r) => r.enabled).length,
      disabled: all.filter((r) => !r.enabled).length,
      total:    all.length,
    };
  }, [rules.data]);

  return (
    <div className="space-y-5 p-5">
      {/* Gradient header */}
      <div className="relative -mx-5 -mt-5 mb-1 overflow-hidden bg-navy px-5 py-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/monitoring/alerts" className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white/90">
              <ArrowLeft className="h-3 w-3" />Monitoring › Alerts
            </Link>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">Alert Rules</h1>
            <p className="mt-0.5 text-sm text-white/70">
              {counts.enabled} active rule{counts.enabled !== 1 ? 's' : ''} · {counts.disabled} disabled
            </p>
          </div>
          <Button size="sm" className="bg-coral text-white hover:bg-white/90">
            <Plus className="h-3 w-3" />New rule
          </Button>
        </div>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total rules',    value: counts.total,    color: 'text-foreground',  icon: Bell },
          { label: 'Enabled',        value: counts.enabled,  color: 'text-emerald-600', icon: CheckCircle2 },
          { label: 'Disabled',       value: counts.disabled, color: 'text-slate-500',   icon: BellOff },
          {
            label: 'Triggered (all)',
            value: (rules.data ?? []).reduce((s, r) => s + r.triggeredCount, 0),
            color: 'text-amber-600',
            icon: Clock,
          },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
              <Icon className={cn('h-4 w-4 opacity-40', color)} />
            </div>
            <p className={cn('mt-1.5 text-2xl font-bold tabular-nums', color)}>{value}</p>
          </div>
        ))}
      </div>

      <Card>
        {/* Filters */}
        <CardHeader className="border-b py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Enabled filter */}
            <div className="flex rounded-lg border p-0.5 text-xs">
              {(['all', 'enabled', 'disabled'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setEnabledFilter(s)}
                  className={cn(
                    'rounded-md px-2.5 py-1 font-medium capitalize transition-colors',
                    enabledFilter === s ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {s === 'all' ? `All (${counts.total})` : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            {/* Severity chips */}
            <div className="flex gap-1">
              {(['all', 'critical', 'error', 'warning', 'info'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSevFilter(s)}
                  className={cn(
                    'rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors',
                    sevFilter === s
                      ? 'bg-foreground text-background'
                      : 'border-border text-muted-foreground hover:border-foreground',
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
                placeholder="Search rules…"
                className="h-8 w-52 pl-8 text-xs"
              />
              {search && (
                <button type="button" onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {rules.isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
              <Bell className="h-7 w-7 opacity-30" />
              <p className="text-sm">No rules match your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                    <th className="px-4 py-2.5 font-semibold">Rule name</th>
                    <th className="px-3 py-2.5 font-semibold">Target</th>
                    <th className="px-3 py-2.5 font-semibold">Metric</th>
                    <th className="px-3 py-2.5 font-semibold">Condition</th>
                    <th className="px-3 py-2.5 font-semibold">Severity</th>
                    <th className="px-3 py-2.5 font-semibold">Channels</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Triggers</th>
                    <th className="px-3 py-2.5 font-semibold">Last fired</th>
                    <th className="px-3 py-2.5 font-semibold">Enabled</th>
                    <th className="px-3 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((rule) => {
                    const sev = SEV_META[rule.severity];
                    return (
                      <tr key={rule.id} className={cn('transition-colors hover:bg-muted/40', !rule.enabled && 'opacity-50')}>
                        <td className="px-4 py-3 font-medium text-foreground">{rule.name}</td>
                        <td className="px-3 py-3 text-muted-foreground">{rule.target}</td>
                        <td className="px-3 py-3 text-muted-foreground">{rule.metric}</td>
                        <td className="px-3 py-3">
                          <span className="rounded bg-muted px-1.5 py-0.5 font-mono">{rule.condition} {rule.threshold}</span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className={cn('h-2 w-2 rounded-full', sev.dot)} />
                            <Badge variant={sev.badge} className="text-[10px]">{sev.label}</Badge>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap gap-1">
                            {rule.channels.map((c) => (
                              <span key={c} className="rounded-full border bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">{c}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums font-semibold">
                          {rule.triggeredCount}
                        </td>
                        <td className="px-3 py-3 tabular-nums text-muted-foreground">
                          {rule.lastTriggered ? formatAgo(rule.lastTriggered) : '—'}
                        </td>
                        <td className="px-3 py-3">
                          {/* Toggle chip */}
                          <button
                            type="button"
                            className={cn(
                              'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                              rule.enabled ? 'bg-emerald-500' : 'bg-muted',
                            )}
                            aria-label={rule.enabled ? 'Disable rule' : 'Enable rule'}
                          >
                            <span className={cn(
                              'inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform',
                              rule.enabled ? 'translate-x-[18px]' : 'translate-x-[3px]',
                            )} />
                          </button>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="h-7 px-2 text-[11px]">Edit</Button>
                            <Button size="sm" variant="outline" className="h-7 px-2 text-[11px] text-red-600">Delete</Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-2.5">
            <p className="text-xs text-muted-foreground">Showing {filtered.length} of {rules.data?.length ?? 0} rules</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
