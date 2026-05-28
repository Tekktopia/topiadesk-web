'use client';

import { useMemo, useState } from 'react';
import { Download, Filter, Search, X, User, Building2, Flag, Megaphone, Shield, Settings, FileText } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
  Skeleton,
  cn,
} from '@topiadesk/ui';
import { useAuditLogs } from '@/lib/queries';
import type { AuditLog } from '@/lib/mock-data';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}

// Action display map
const ACTION_META: Record<string, { label: string; color: string }> = {
  'tenant.suspended':         { label: 'Tenant suspended',       color: 'text-red-600' },
  'tenant.created':           { label: 'Tenant created',         color: 'text-emerald-600' },
  'tenant.plan_changed':      { label: 'Plan changed',           color: 'text-blue-600' },
  'tenant.impersonated':      { label: 'Admin impersonated',     color: 'text-amber-600' },
  'tenant.notes_updated':     { label: 'Notes updated',          color: 'text-slate-600' },
  'feature_flag.updated':     { label: 'Flag updated',           color: 'text-blue-600' },
  'feature_flag.created':     { label: 'Flag created',           color: 'text-emerald-600' },
  'announcement.published':   { label: 'Announcement published', color: 'text-emerald-600' },
  'announcement.created':     { label: 'Announcement created',   color: 'text-blue-600' },
  'plan.updated':             { label: 'Plan updated',           color: 'text-blue-600' },
  'user.deactivated':         { label: 'User deactivated',       color: 'text-red-600' },
  'security.ip_blocked':      { label: 'IP blocked',             color: 'text-red-600' },
};

const TARGET_TYPE_ICONS: Record<AuditLog['targetType'], React.ElementType> = {
  tenant:       Building2,
  user:         User,
  plan:         Settings,
  feature_flag: Flag,
  system:       Settings,
  announcement: Megaphone,
  security:     Shield,
};

const TARGET_TYPE_STYLES: Record<AuditLog['targetType'], string> = {
  tenant:       'bg-blue-100 text-blue-700',
  user:         'bg-slate-100 text-slate-700',
  plan:         'bg-coral/12 text-coral-dark',
  feature_flag: 'bg-amber-100 text-amber-700',
  system:       'bg-slate-100 text-slate-700',
  announcement: 'bg-emerald-100 text-emerald-700',
  security:     'bg-red-100 text-red-700',
};

type TargetType = AuditLog['targetType'] | 'all';

export default function AuditLogsPage() {
  const logs = useAuditLogs();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TargetType>('all');
  const [actorFilter, setActorFilter] = useState<'all' | string>('all');

  const actors = useMemo(() => {
    const all = logs.data ?? [];
    return Array.from(new Set(all.map((l) => l.actorEmail)));
  }, [logs.data]);

  const filtered = useMemo(() => {
    let list = [...(logs.data ?? [])].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    if (typeFilter !== 'all')  list = list.filter((l) => l.targetType === typeFilter);
    if (actorFilter !== 'all') list = list.filter((l) => l.actorEmail === actorFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((l) =>
        l.action.toLowerCase().includes(q) ||
        l.target.toLowerCase().includes(q) ||
        l.actor.toLowerCase().includes(q) ||
        l.actorEmail.toLowerCase().includes(q) ||
        l.ip.includes(q),
      );
    }
    return list;
  }, [logs.data, typeFilter, actorFilter, search]);

  const typeCounts = useMemo(() => {
    const all = logs.data ?? [];
    const map: Record<string, number> = {};
    for (const l of all) {
      map[l.targetType] = (map[l.targetType] ?? 0) + 1;
    }
    return map;
  }, [logs.data]);

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
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">Audit Logs</h1>
            <p className="mt-0.5 text-sm text-white/70">Immutable record of all super-admin actions and platform events.</p>
          </div>
          <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
            <Download className="h-3.5 w-3.5" />Export CSV
          </Button>
        </div>
      </div>
      </div>

      <div className="flex-1 min-h-0 space-y-5 overflow-y-auto p-5 pt-5">

      <Card>
        <CardHeader className="border-b py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Type tabs */}
            <div className="flex flex-wrap rounded-lg border p-0.5 text-xs">
              <button type="button" onClick={() => setTypeFilter('all')}
                className={cn('rounded-md px-2.5 py-1 font-medium transition-colors',
                  typeFilter === 'all' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground')}>
                All ({logs.data?.length ?? 0})
              </button>
              {(['tenant', 'user', 'plan', 'feature_flag', 'announcement', 'security'] as AuditLog['targetType'][]).map((t) => (
                <button key={t} type="button" onClick={() => setTypeFilter(t)}
                  className={cn('rounded-md px-2.5 py-1 font-medium capitalize transition-colors',
                    typeFilter === t ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground')}>
                  {t.replace('_', ' ')} {typeCounts[t] ? `(${typeCounts[t]})` : ''}
                </button>
              ))}
            </div>

            {/* Actor filter */}
            <div className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <select value={actorFilter} onChange={(e) => setActorFilter(e.target.value)}
                className="h-8 rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="all">All actors</option>
                {actors.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* Search */}
            <div className="relative ml-auto">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search action, target, IP…" className="h-8 w-60 pl-8 text-xs" />
              {search && (
                <button type="button" onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {logs.isLoading ? (
            <div className="space-y-2 p-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : (
            <div className="divide-y">
              {filtered.map((log) => {
                const actionMeta = ACTION_META[log.action];
                const TargetIcon = TARGET_TYPE_ICONS[log.targetType];
                const typeStyle = TARGET_TYPE_STYLES[log.targetType];

                return (
                  <div key={log.id} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/20 transition-colors">
                    {/* Target type icon */}
                    <div className={cn('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md', typeStyle)}>
                      <TargetIcon className="h-3.5 w-3.5" />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn('text-xs font-semibold', actionMeta?.color ?? 'text-foreground')}>
                          {actionMeta?.label ?? log.action}
                        </span>
                        <code className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">{log.action}</code>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{log.actor}</span>
                        {' '}·{' '}
                        <span className="font-mono">{log.actorEmail}</span>
                      </p>
                      <p className="text-xs">
                        Target: <span className="font-medium">{log.target}</span>
                        {log.meta && Object.entries(log.meta).map(([k, v]) => (
                          <span key={k} className="ml-2 text-muted-foreground">
                            {k}: <span className="text-foreground">{v}</span>
                          </span>
                        ))}
                      </p>
                    </div>

                    {/* Meta */}
                    <div className="shrink-0 text-right space-y-1">
                      <p className="text-[10px] text-muted-foreground" title={formatDateTime(log.createdAt)}>
                        {formatAgo(log.createdAt)}
                      </p>
                      <p className="font-mono text-[10px] text-muted-foreground">{log.ip}</p>
                      <span className={cn('inline-block rounded-full px-1.5 py-0.5 text-[9px] font-semibold capitalize', typeStyle)}>
                        {log.targetType.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <p className="p-8 text-center text-sm text-muted-foreground">No audit log entries match your filters.</p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-2.5">
            <p className="text-xs text-muted-foreground">Showing {filtered.length} of {logs.data?.length ?? 0} events</p>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <FileText className="h-3 w-3" />
              Audit logs are immutable and retained for 2 years.
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
