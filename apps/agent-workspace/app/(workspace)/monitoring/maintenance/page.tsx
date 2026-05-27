'use client';

import { useState, useMemo } from 'react';
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  Hammer,
  Plus,
  RefreshCw,
  Server,
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
import { useMaintenanceWindows } from '@/lib/queries';
import type { MaintenanceWindow } from '@/lib/mock-data';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatDuration(startIso: string, endIso: string) {
  const mins = Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 60_000);
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)}h ${mins % 60 > 0 ? `${mins % 60}m` : ''}`.trim();
}

function timeToStart(startIso: string) {
  const diffMs = new Date(startIso).getTime() - Date.now();
  if (diffMs <= 0) return null;
  const mins = Math.round(diffMs / 60_000);
  if (mins < 60) return `Starts in ${mins}m`;
  if (mins < 1440) return `Starts in ${Math.floor(mins / 60)}h`;
  return `Starts in ${Math.floor(mins / 1440)}d`;
}

const STATUS_META: Record<MaintenanceWindow['status'], { badge: 'warning' | 'secondary' | 'success'; label: string; dot: string }> = {
  active:    { badge: 'warning',   label: 'Active',    dot: 'bg-amber-500' },
  scheduled: { badge: 'secondary', label: 'Scheduled', dot: 'bg-blue-500' },
  completed: { badge: 'success',   label: 'Completed', dot: 'bg-emerald-500' },
};

// ─── MaintenanceCard ──────────────────────────────────────────────────────────

function MaintenanceCard({ mw }: { mw: MaintenanceWindow }) {
  const s = STATUS_META[mw.status];
  const startText = mw.status === 'scheduled' ? timeToStart(mw.startAt) : null;

  return (
    <Card className={cn(mw.status === 'active' ? 'border-amber-300 dark:border-amber-800' : '')}>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            {/* Status dot */}
            <div className="mt-1">
              {mw.status === 'active' ? (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
                </span>
              ) : (
                <span className={cn('block h-2.5 w-2.5 rounded-full', s.dot)} />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-foreground">{mw.name}</p>
                <Badge variant={s.badge} className="text-[10px]">{s.label}</Badge>
                {mw.recurrence !== 'none' && (
                  <Badge variant="secondary" className="text-[10px]">
                    <RefreshCw className="mr-1 h-2.5 w-2.5" />{mw.recurrence}
                  </Badge>
                )}
              </div>

              {/* Time row */}
              <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDateTime(mw.startAt)} — {formatDateTime(mw.endAt)}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarClock className="h-3 w-3" />
                  Duration: {formatDuration(mw.startAt, mw.endAt)}
                </span>
                {startText && (
                  <span className="font-medium text-blue-600 dark:text-blue-400">{startText}</span>
                )}
              </div>

              {/* Devices + sites */}
              <div className="mt-2 flex flex-wrap gap-1">
                {mw.deviceNames.map((n) => (
                  <span key={n} className="flex items-center gap-1 rounded-full border bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground">
                    <Server className="h-2.5 w-2.5" />{n}
                  </span>
                ))}
                {mw.sites.map((s) => (
                  <span key={s} className="rounded-full border bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>

              {mw.notes && (
                <p className="mt-2 text-[11px] italic text-muted-foreground">{mw.notes}</p>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex shrink-0 flex-col items-end gap-1.5 text-[10px] text-muted-foreground">
            <p>Created by <span className="font-medium text-foreground">{mw.createdBy}</span></p>
            {mw.status !== 'completed' && (
              <div className="flex gap-1.5">
                <Button size="sm" variant="outline" className="h-7 px-2 text-[11px]">Edit</Button>
                <Button size="sm" variant="outline" className="h-7 px-2 text-[11px] text-red-600 hover:text-red-700">Cancel</Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type StatusFilter = 'all' | MaintenanceWindow['status'];

export default function MaintenancePage() {
  const windows = useMaintenanceWindows();
  const [filter, setFilter] = useState<StatusFilter>('all');

  const filtered = useMemo(() => {
    const list = windows.data ?? [];
    if (filter === 'all') return list;
    return list.filter((w) => w.status === filter);
  }, [windows.data, filter]);

  const counts = useMemo(() => {
    const all = windows.data ?? [];
    return {
      all:       all.length,
      active:    all.filter((w) => w.status === 'active').length,
      scheduled: all.filter((w) => w.status === 'scheduled').length,
      completed: all.filter((w) => w.status === 'completed').length,
    };
  }, [windows.data]);

  return (
    <div className="space-y-5 p-5">
      {/* Gradient header */}
      <div className="relative -mx-5 -mt-5 mb-1 overflow-hidden bg-navy px-5 py-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Monitoring</p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">Maintenance Windows</h1>
            <p className="mt-0.5 text-sm text-white/70">Schedule downtime to suppress alerts during planned maintenance</p>
          </div>
          <Button size="sm" className="bg-coral text-white hover:bg-white/90">
            <Plus className="h-3 w-3" />New window
          </Button>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total',      count: counts.all,       color: 'text-foreground',     icon: CalendarClock },
          { label: 'Active now', count: counts.active,    color: 'text-amber-600',      icon: Hammer },
          { label: 'Scheduled',  count: counts.scheduled, color: 'text-blue-600',       icon: Clock },
          { label: 'Completed',  count: counts.completed, color: 'text-emerald-600',    icon: CheckCircle2 },
        ].map(({ label, count, color, icon: Icon }) => (
          <div key={label} className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
              <Icon className={cn('h-4 w-4 opacity-40', color)} />
            </div>
            <p className={cn('mt-1.5 text-2xl font-bold tabular-nums', color)}>{count}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex rounded-lg border p-0.5 text-xs w-fit">
        {(['all', 'active', 'scheduled', 'completed'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={cn(
              'rounded-md px-2.5 py-1 font-medium capitalize transition-colors',
              filter === s ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {s === 'all' ? `All (${counts.all})` : `${s.charAt(0).toUpperCase() + s.slice(1)} (${counts[s]})`}
          </button>
        ))}
      </div>

      {/* Window list */}
      {windows.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
          <CalendarClock className="h-8 w-8 opacity-50" />
          <p className="text-sm">No maintenance windows match your filter.</p>
          <Button size="sm" variant="outline"><Plus className="h-3 w-3" />New window</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((mw) => <MaintenanceCard key={mw.id} mw={mw} />)}
        </div>
      )}

      {/* Info callout */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30">
        <CardHeader className="py-3">
          <CardTitle className="text-xs text-blue-700 dark:text-blue-400">How maintenance windows work</CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          <ul className="space-y-1 text-[11px] text-blue-700 dark:text-blue-400">
            <li>• Alerts are suppressed for all selected devices while the window is active.</li>
            <li>• Status changes during the window are still recorded for reporting.</li>
            <li>• Recurring windows auto-create the next occurrence on completion.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
