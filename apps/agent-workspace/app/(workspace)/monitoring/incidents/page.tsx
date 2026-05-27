'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Clock,
  Server,
  ShieldAlert,
  UserCheck,
  Zap,
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
import { useIncidents } from '@/lib/queries';
import type { MockIncident, MonAlertSeverity, IncidentTimelineEvent } from '@/lib/mock-data';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}

function formatDuration(startIso: string, endIso?: string) {
  const endMs = endIso ? new Date(endIso).getTime() : Date.now();
  const mins = Math.round((endMs - new Date(startIso).getTime()) / 60_000);
  if (mins < 60) return `${mins}m`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  return `${Math.floor(mins / 1440)}d ${Math.floor((mins % 1440) / 60)}h`;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

const SEV_META: Record<MonAlertSeverity, { badge: 'danger' | 'warning' | 'secondary'; label: string; dot: string }> = {
  critical: { badge: 'danger',    label: 'Critical', dot: 'bg-red-500' },
  error:    { badge: 'warning',   label: 'Error',    dot: 'bg-orange-500' },
  warning:  { badge: 'warning',   label: 'Warning',  dot: 'bg-amber-500' },
  info:     { badge: 'secondary', label: 'Info',     dot: 'bg-blue-500' },
};

const STATE_META: Record<MockIncident['state'], { label: string; badge: 'danger' | 'warning' | 'success' }> = {
  open:          { label: 'Open',          badge: 'danger' },
  investigating: { label: 'Investigating', badge: 'warning' },
  resolved:      { label: 'Resolved',      badge: 'success' },
};

const EVENT_ICONS: Record<IncidentTimelineEvent['type'], typeof Activity> = {
  detection:   ShieldAlert,
  alert:       AlertTriangle,
  acknowledge: UserCheck,
  update:      Activity,
  escalate:    Zap,
  resolve:     CheckCircle2,
};

const EVENT_COLORS: Record<IncidentTimelineEvent['type'], string> = {
  detection:   'text-red-500',
  alert:       'text-amber-500',
  acknowledge: 'text-blue-500',
  update:      'text-slate-500',
  escalate:    'text-orange-500',
  resolve:     'text-emerald-500',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IncidentsPage() {
  const incidents = useIncidents();
  const [expanded, setExpanded] = useState<string | null>('inc-001');
  const [stateFilter, setStateFilter] = useState<'all' | MockIncident['state']>('all');

  const filtered = useMemo(() => {
    let list = incidents.data ?? [];
    if (stateFilter !== 'all') list = list.filter((i) => i.state === stateFilter);
    return [...list].sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  }, [incidents.data, stateFilter]);

  const counts = useMemo(() => {
    const all = incidents.data ?? [];
    return {
      all:          all.length,
      open:         all.filter((i) => i.state === 'open').length,
      investigating:all.filter((i) => i.state === 'investigating').length,
      resolved:     all.filter((i) => i.state === 'resolved').length,
    };
  }, [incidents.data]);

  return (
    <div className="space-y-5 p-5">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Monitoring</p>
          <h1 className="font-display text-2xl font-bold tracking-tight">Incident Timeline</h1>
          <p className="text-sm text-muted-foreground">Track, investigate and resolve infrastructure incidents</p>
        </div>
        <Button size="sm"><ShieldAlert className="h-3 w-3" />New incident</Button>
      </header>

      {/* Summary tiles */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Open', count: counts.open, color: 'text-red-600', bg: 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30' },
          { label: 'Investigating', count: counts.investigating, color: 'text-amber-700 dark:text-amber-400', bg: 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30' },
          { label: 'Resolved', count: counts.resolved, color: 'text-emerald-700 dark:text-emerald-400', bg: 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30' },
        ].map((t) => (
          <div key={t.label} className={cn('flex items-center gap-3 rounded-lg border px-4 py-2.5', t.bg)}>
            <p className={cn('text-sm font-semibold', t.color)}>{t.count} {t.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex rounded-lg border p-0.5 text-xs w-fit">
        {(['all', 'open', 'investigating', 'resolved'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStateFilter(s)}
            className={cn(
              'rounded-md px-2.5 py-1 font-medium capitalize transition-colors',
              stateFilter === s ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {s === 'all' ? `All (${counts.all})` : `${s.charAt(0).toUpperCase() + s.slice(1)} (${counts[s]})`}
          </button>
        ))}
      </div>

      {/* Incident list */}
      {incidents.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          <p className="text-sm">No incidents match your filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((incident) => {
            const sev = SEV_META[incident.severity];
            const state = STATE_META[incident.state];
            const isOpen = expanded === incident.id;

            return (
              <Card key={incident.id} className={cn(
                incident.state !== 'resolved' && incident.severity === 'critical' ? 'border-red-200 dark:border-red-900' : '',
              )}>
                {/* Incident header */}
                <button
                  type="button"
                  className="w-full text-left"
                  onClick={() => setExpanded(isOpen ? null : incident.id)}
                >
                  <CardHeader className="py-3">
                    <div className="flex flex-wrap items-start gap-3">
                      {/* Severity dot */}
                      <div className="mt-0.5 flex items-center gap-1.5">
                        {incident.state !== 'resolved' && incident.severity === 'critical' ? (
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                          </span>
                        ) : (
                          <span className={cn('h-2.5 w-2.5 rounded-full', sev.dot)} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <CardTitle className="text-sm">{incident.title}</CardTitle>
                          <Badge variant={sev.badge} className="text-[10px]">{sev.label}</Badge>
                          <Badge variant={state.badge} className="text-[10px]">{state.label}</Badge>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />{formatAgo(incident.startedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="h-3 w-3" />Duration: {formatDuration(incident.startedAt, incident.resolvedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Server className="h-3 w-3" />{incident.affectedDevices.join(', ')}
                          </span>
                        </div>
                      </div>

                      <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
                    </div>
                  </CardHeader>
                </button>

                {/* Expandable timeline */}
                {isOpen && (
                  <CardContent className="border-t p-0">
                    {/* Affected context bar */}
                    <div className="flex flex-wrap gap-4 bg-muted/30 px-4 py-2.5 text-[11px] text-muted-foreground">
                      <span><span className="font-medium text-foreground">Sites:</span> {incident.affectedSites.join(', ')}</span>
                      <span><span className="font-medium text-foreground">Devices:</span> {incident.affectedDevices.join(', ')}</span>
                      {incident.resolvedAt && (
                        <span><span className="font-medium text-foreground">Resolved:</span> {formatTime(incident.resolvedAt)}</span>
                      )}
                    </div>

                    {/* Timeline */}
                    <div className="px-4 py-4">
                      <ol className="relative border-l border-border">
                        {[...incident.timeline].reverse().map((event) => {
                          const EvIcon = EVENT_ICONS[event.type] ?? Activity;
                          const evColor = EVENT_COLORS[event.type];
                          return (
                            <li key={event.id} className="mb-5 ml-4 last:mb-0">
                              <span className={cn(
                                'absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full bg-background ring-2 ring-border',
                                evColor,
                              )}>
                                <EvIcon className="h-3 w-3" />
                              </span>
                              <div className="ml-1">
                                <div className="flex flex-wrap items-baseline gap-2">
                                  <p className="text-[11px] font-semibold text-foreground">{event.actor}</p>
                                  <Badge variant={event.actorType === 'system' ? 'secondary' : 'success'} className="text-[9px]">
                                    {event.actorType}
                                  </Badge>
                                  <time className="text-[10px] text-muted-foreground">{formatTime(event.time)}</time>
                                </div>
                                <p className="mt-0.5 text-xs text-muted-foreground">{event.message}</p>
                              </div>
                            </li>
                          );
                        })}
                      </ol>
                    </div>

                    {/* Actions */}
                    {incident.state !== 'resolved' && (
                      <div className="flex gap-2 border-t px-4 py-3">
                        <Button size="sm" variant="outline" className="text-[11px]">Add update</Button>
                        {incident.state === 'open' && (
                          <Button size="sm" variant="outline" className="text-[11px]">Mark investigating</Button>
                        )}
                        <Button size="sm" variant="outline" className="text-[11px] text-emerald-600 hover:text-emerald-700">
                          Resolve incident
                        </Button>
                        <Button size="sm" variant="outline" className="ml-auto text-[11px]" asChild>
                          <Link href="/monitoring/alerts">View alerts</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
