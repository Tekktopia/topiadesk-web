'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertOctagon,
  Ban,
  CheckCircle2,
  ChevronDown,
  Filter,
  KeyRound,
  LogIn,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Unlock,
  X,
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
  Skeleton,
  cn,
} from '@topiadesk/ui';
import { useSecurityEvents } from '@/lib/queries';
import type { SecuritySeverity } from '@/lib/mock-data';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const SEVERITY_META: Record<SecuritySeverity, {
  variant: 'danger' | 'warning' | 'secondary';
  label: string;
  rowBg: string;
  dotColor: string;
}> = {
  critical: { variant: 'danger',    label: 'Critical', rowBg: 'bg-red-50/30 dark:bg-red-950/10',      dotColor: 'bg-red-500' },
  high:     { variant: 'danger',    label: 'High',     rowBg: 'bg-orange-50/30 dark:bg-orange-950/10', dotColor: 'bg-orange-500' },
  medium:   { variant: 'warning',   label: 'Medium',   rowBg: 'bg-amber-50/20 dark:bg-amber-950/10',   dotColor: 'bg-amber-500' },
  low:      { variant: 'secondary', label: 'Low',      rowBg: '',                                       dotColor: 'bg-slate-400' },
};

const TYPE_META: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  brute_force:      { icon: ShieldAlert,  label: 'Brute force',      color: 'text-red-600' },
  ip_blocked:       { icon: Ban,          label: 'IP blocked',        color: 'text-slate-600' },
  suspicious_login: { icon: LogIn,        label: 'Suspicious login',  color: 'text-amber-600' },
  api_abuse:        { icon: Zap,          label: 'API abuse',         color: 'text-orange-600' },
  failed_login:     { icon: KeyRound,     label: 'Failed login',      color: 'text-slate-500' },
  data_export:      { icon: Filter,       label: 'Large data export', color: 'text-amber-600' },
  token_reuse:      { icon: Unlock,       label: 'Token reuse',       color: 'text-red-600' },
  mfa_bypass:       { icon: ShieldAlert,  label: 'MFA bypass attempt',color: 'text-red-600' },
};

// ─── IP Blocklist ──────────────────────────────────────────────────────────────

const BLOCKED_IPS = [
  { ip: '102.89.45.200', reason: 'Brute force — AcmeBank Nigeria', blockedAt: new Date(Date.now() - 2 * 86_400_000).toISOString() },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SecurityPage() {
  const events = useSecurityEvents();
  const [severityFilter, setSeverityFilter] = useState<'all' | SecuritySeverity>('all');
  const [resolvedFilter, setResolvedFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [search, setSearch] = useState('');
  const [showBlocklist, setShowBlocklist] = useState(false);

  const filtered = useMemo(() => {
    let list = [...(events.data ?? [])].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    if (severityFilter !== 'all')  list = list.filter((e) => e.severity === severityFilter);
    if (resolvedFilter === 'open')     list = list.filter((e) => !e.resolved);
    if (resolvedFilter === 'resolved') list = list.filter((e) => e.resolved);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((e) =>
        e.description.toLowerCase().includes(q) ||
        e.ip.includes(q) ||
        (e.actor ?? '').toLowerCase().includes(q) ||
        (e.tenantName ?? '').toLowerCase().includes(q) ||
        e.type.includes(q),
      );
    }
    return list;
  }, [events.data, severityFilter, resolvedFilter, search]);

  const counts = useMemo(() => {
    const all = events.data ?? [];
    return {
      open:     all.filter((e) => !e.resolved).length,
      critical: all.filter((e) => e.severity === 'critical' && !e.resolved).length,
      high:     all.filter((e) => e.severity === 'high' && !e.resolved).length,
      resolved: all.filter((e) => e.resolved).length,
    };
  }, [events.data]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
      {/* Gradient header */}
      <div className="relative overflow-hidden rounded-2xl bg-navy px-6 py-5 shadow-lg shadow-navy/15">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Super Admin</p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">Security</h1>
            <p className="mt-0.5 text-sm text-white/70">Monitor threats, suspicious activity, and IP blocklist across all tenants.</p>
          </div>
          <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" onClick={() => setShowBlocklist(!showBlocklist)}>
            <Ban className="h-3.5 w-3.5" />IP Blocklist ({BLOCKED_IPS.length})
          </Button>
        </div>
      </div>
      </div>

      <div className="flex-1 min-h-0 space-y-5 overflow-y-auto p-5 pt-5">

      {/* Alert: open critical / high events */}
      {counts.critical > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950/30">
          <span className="mt-0.5 h-2 w-2 shrink-0 animate-pulse rounded-full bg-red-500" />
          <div>
            <p className="text-sm font-semibold text-red-800 dark:text-red-300">
              {counts.critical} critical security event{counts.critical !== 1 ? 's' : ''} require immediate attention
            </p>
            <p className="text-xs text-muted-foreground">Review and resolve below.</p>
          </div>
        </div>
      )}

      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Open events',    value: counts.open,     color: 'text-red-600',     icon: ShieldAlert },
          { label: 'Critical open',  value: counts.critical, color: 'text-red-600',     icon: AlertOctagon },
          { label: 'High open',      value: counts.high,     color: 'text-orange-600',  icon: Shield },
          { label: 'Resolved',       value: counts.resolved, color: 'text-emerald-600', icon: ShieldCheck },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</p>
              <s.icon className={cn('h-4 w-4 opacity-40', s.color)} />
            </div>
            <p className={cn('mt-1.5 text-2xl font-bold tabular-nums', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* IP Blocklist */}
      {showBlocklist && (
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="border-b py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-red-700 dark:text-red-400">IP Blocklist ({BLOCKED_IPS.length})</CardTitle>
              <Button size="sm" variant="outline" className="h-6 px-2 text-[10px]">Add IP</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y">
              {BLOCKED_IPS.map((b) => (
                <li key={b.ip} className="flex items-center justify-between px-4 py-2.5">
                  <div>
                    <p className="font-mono text-sm font-semibold text-red-600">{b.ip}</p>
                    <p className="text-xs text-muted-foreground">{b.reason} · Blocked {formatAgo(b.blockedAt)}</p>
                  </div>
                  <Button size="sm" variant="outline" className="h-6 px-2 text-[10px] text-amber-600">
                    <Unlock className="h-3 w-3" />Unblock
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Events table */}
      <Card>
        <CardHeader className="border-b py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Resolved filter */}
            <div className="flex rounded-lg border p-0.5 text-xs">
              {([
                { key: 'all',      label: 'All' },
                { key: 'open',     label: `Open (${counts.open})` },
                { key: 'resolved', label: `Resolved (${counts.resolved})` },
              ] as { key: typeof resolvedFilter; label: string }[]).map((s) => (
                <button key={s.key} type="button" onClick={() => setResolvedFilter(s.key)}
                  className={cn('rounded-md px-2.5 py-1 font-medium transition-colors',
                    resolvedFilter === s.key ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground')}>
                  {s.label}
                </button>
              ))}
            </div>

            {/* Severity filter */}
            <div className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value as typeof severityFilter)}
                className="h-8 rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="all">All severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative ml-auto">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, IP, actor…" className="h-8 w-60 pl-8 text-xs" />
              {search && (
                <button type="button" onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {events.isLoading ? (
            <div className="space-y-2 p-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
          ) : (
            <div className="divide-y">
              {filtered.map((ev) => {
                const sm = SEVERITY_META[ev.severity];
                const tm = TYPE_META[ev.type];
                const Icon = tm?.icon ?? Shield;

                return (
                  <div key={ev.id} className={cn('flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/20', sm.rowBg)}>
                    {/* Severity dot */}
                    <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', sm.dotColor, !ev.resolved && 'animate-pulse')} />

                    {/* Type icon */}
                    <div className="mt-0.5 shrink-0">
                      <Icon className={cn('h-4 w-4', ev.resolved ? 'text-muted-foreground/40' : (tm?.color ?? 'text-muted-foreground'))} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn('text-xs font-semibold', ev.resolved ? 'text-muted-foreground' : (tm?.color ?? 'text-foreground'))}>
                          {tm?.label ?? ev.type}
                        </span>
                        <Badge variant={sm.variant} className="text-[10px]">{sm.label}</Badge>
                        {ev.resolved && (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-600">
                            <CheckCircle2 className="h-3 w-3" />Resolved
                          </span>
                        )}
                      </div>
                      <p className={cn('text-xs', ev.resolved ? 'text-muted-foreground/60' : 'text-muted-foreground')}>{ev.description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
                        <span className="font-mono">{ev.ip}</span>
                        {ev.actor && <span>Actor: <span className="font-medium text-foreground">{ev.actor}</span></span>}
                        {ev.tenantId && (
                          <Link href={`/tenants/${ev.tenantId}`} className="text-primary hover:underline">
                            {ev.tenantName}
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Time + actions */}
                    <div className="shrink-0 text-right space-y-1">
                      <p className="text-[10px] text-muted-foreground" title={formatDateTime(ev.createdAt)}>
                        {formatAgo(ev.createdAt)}
                      </p>
                      {!ev.resolved && (
                        <div className="flex items-center justify-end gap-1">
                          <Button size="sm" variant="outline" className="h-6 px-2 text-[10px]">
                            <CheckCircle2 className="h-3 w-3" />Resolve
                          </Button>
                          {(ev.type === 'brute_force' || ev.type === 'api_abuse') && (
                            <Button size="sm" variant="outline" className="h-6 px-2 text-[10px] text-red-600 border-red-200">
                              <Ban className="h-3 w-3" />Block IP
                            </Button>
                          )}
                        </div>
                      )}
                      {ev.resolved && (
                        <button type="button" className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 justify-end">
                          <ChevronDown className="h-3 w-3" />Details
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <p className="p-8 text-center text-sm text-muted-foreground">No security events match your filters.</p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-2.5">
            <p className="text-xs text-muted-foreground">Showing {filtered.length} of {events.data?.length ?? 0} events</p>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Shield className="h-3 w-3 text-emerald-500" />
              Security events are retained for 90 days.
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
