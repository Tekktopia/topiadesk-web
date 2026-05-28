'use client';

import { useState } from 'react';
import {
  Workflow,
  Plus,
  Play,
  Pause,
  ChevronRight,
  Zap,
  Clock,
  Hash,
  Filter,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Skeleton,
  cn,
} from '@topiadesk/ui';
import { useAutomations } from '@/lib/queries';
import type { AutomationTrigger, AutomationAction } from '@/lib/mock-data';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function triggerColor(t: AutomationTrigger) {
  switch (t) {
    case 'ticket_created':  return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'ticket_updated':  return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'sla_warning':     return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'sla_breached':    return 'bg-red-50 text-red-700 border-red-200';
    case 'ticket_idle':     return 'bg-coral/8 text-coral-dark border-coral/25';
    case 'customer_replied':return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'agent_assigned':  return 'bg-cyan-50 text-cyan-700 border-cyan-200';
  }
}

function actionColor(a: AutomationAction) {
  switch (a) {
    case 'assign_agent':
    case 'assign_group':   return 'text-blue-600';
    case 'set_priority':   return 'text-amber-600';
    case 'set_status':     return 'text-coral';
    case 'add_tag':        return 'text-cyan-600';
    case 'send_email':     return 'text-emerald-600';
    case 'add_note':       return 'text-muted-foreground';
    case 'escalate':       return 'text-red-600';
  }
}

function timeAgo(iso?: string) {
  if (!iso) return 'Never';
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AutomationsPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const automations = useAutomations();

  const counts = {
    all: automations.data?.length ?? 0,
    active: automations.data?.filter((a) => a.enabled).length ?? 0,
    inactive: automations.data?.filter((a) => !a.enabled).length ?? 0,
  };

  const filtered = (automations.data ?? []).filter((a) => {
    if (filter === 'active') return a.enabled;
    if (filter === 'inactive') return !a.enabled;
    return true;
  });

  const totalRuns = automations.data?.reduce((s, a) => s + a.runCount, 0) ?? 0;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
      {/* ── Gradient header ── */}
      <div
        className="relative overflow-hidden rounded-2xl bg-navy px-6 py-5 shadow-lg shadow-navy/15"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
              Helpdesk
            </p>
            <h1 className="font-display mt-0.5 text-2xl font-bold tracking-tight text-white">
              Automations
            </h1>
            <p className="mt-0.5 text-sm text-white/70">
              {counts.active} active · {counts.inactive} inactive · {totalRuns.toLocaleString()} total runs
            </p>
          </div>
          <Button size="sm" className="bg-coral text-white hover:bg-white/90">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New automation
          </Button>
        </div>
      </div>
      </div>

      <div className="flex-1 min-h-0 space-y-5 overflow-y-auto p-5 pt-5">

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active rules', value: counts.active, icon: Zap, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Total runs',   value: totalRuns.toLocaleString(), icon: Hash, color: 'bg-blue-50 text-blue-600' },
          { label: 'Inactive',     value: counts.inactive, icon: Pause, color: 'bg-muted text-muted-foreground' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-3 p-4">
              <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', color)}>
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="font-display text-xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Filter ── */}
      <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/30 p-0.5 w-fit">
        {(['all', 'active', 'inactive'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-md px-3 py-1 text-xs font-medium capitalize transition-all',
              filter === f ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {f} <span className="ml-1 text-muted-foreground/60">{counts[f]}</span>
          </button>
        ))}
      </div>

      {/* ── Automation cards ── */}
      <div className="space-y-3">
        {automations.isPending
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </CardContent>
              </Card>
            ))
          : filtered.map((auto) => (
              <Card key={auto.id} className={cn('transition-shadow hover:shadow-sm', !auto.enabled && 'opacity-70')}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Toggle indicator */}
                    <div className={cn(
                      'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                      auto.enabled ? 'bg-blue-50 text-blue-600' : 'bg-muted text-muted-foreground',
                    )}>
                      <Workflow className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-foreground">{auto.name}</p>
                        <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold', triggerColor(auto.trigger))}>
                          {auto.triggerLabel}
                        </span>
                        {!auto.enabled && (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">Inactive</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{auto.description}</p>

                      {/* Conditions */}
                      <div className="mb-2 flex flex-wrap gap-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">If:</span>
                        {auto.conditions.map((c, i) => (
                          <span key={i} className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">{c}</span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Then:</span>
                        {auto.actions.map((a, i) => (
                          <span key={i} className={cn('flex items-center gap-1 text-[10px] font-medium', actionColor(a.action))}>
                            {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground/40" />}
                            {a.label}
                          </span>
                        ))}
                      </div>

                      <div className="mt-2.5 flex items-center gap-4 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Hash className="h-2.5 w-2.5" />{auto.runCount} runs</span>
                        <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" />Last: {timeAgo(auto.lastRunAt)}</span>
                        <span>By {auto.createdBy}</span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        size="sm"
                        variant={auto.enabled ? 'outline' : 'default'}
                        className={cn('h-7 px-3 text-xs', !auto.enabled && 'bg-blue-600 text-white hover:bg-blue-700')}
                      >
                        {auto.enabled ? <><Pause className="mr-1 h-3 w-3" />Disable</> : <><Play className="mr-1 h-3 w-3" />Enable</>}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

        {!automations.isPending && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Filter className="mb-2 h-8 w-8 text-muted-foreground/30" />
            <p className="text-sm font-medium text-foreground">No automations found</p>
            <p className="text-xs text-muted-foreground">Adjust the filter or create your first automation.</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
