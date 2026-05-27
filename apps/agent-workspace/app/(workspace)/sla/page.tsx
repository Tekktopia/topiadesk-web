'use client';

import {
  ShieldCheck,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ProgressRing,
  Skeleton,
  cn,
} from '@topiadesk/ui';
import { useSLAPolicies } from '@/lib/queries';
import type { TicketPriority } from '@/lib/mock-data';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function priorityBadge(priority: TicketPriority) {
  switch (priority) {
    case 'urgent': return <span className="inline-block rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">Urgent</span>;
    case 'high':   return <span className="inline-block rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">High</span>;
    case 'medium': return <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">Medium</span>;
    case 'low':    return <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">Low</span>;
  }
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 1440) return `${(minutes / 60).toFixed(0)} hr${minutes >= 120 ? 's' : ''}`;
  return `${(minutes / 1440).toFixed(0)} day${minutes >= 2880 ? 's' : ''}`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SLAPage() {
  const [expanded, setExpanded] = useState<string | null>('sla-001');
  const sla = useSLAPolicies();

  const totalActive = sla.data?.reduce((s, p) => s + p.activeTickets, 0) ?? 0;
  const totalBreached = sla.data?.reduce((s, p) => s + p.breachedThisMonth, 0) ?? 0;
  const avgCompliance = sla.data
    ? Math.round(sla.data.reduce((s, p) => s + p.compliancePct, 0) / sla.data.length)
    : 0;

  return (
    <div className="space-y-5 p-5">
      {/* ── Gradient header ── */}
      <div
        className="relative -mx-5 -mt-5 mb-1 overflow-hidden px-5 py-6"
        style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' }}
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
              SLA Policies
            </h1>
            <p className="mt-0.5 text-sm text-white/70">
              {sla.data?.length ?? '—'} policies · {totalActive} active tickets · {avgCompliance}% avg compliance
            </p>
          </div>
          <Button size="sm" className="bg-coral text-white hover:bg-white/90">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New policy
          </Button>
        </div>
      </div>

      {/* ── Summary strip ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active tickets under SLA', value: totalActive,    icon: Clock, color: 'bg-blue-50 text-blue-600' },
          { label: 'Breached this month',       value: totalBreached,  icon: AlertTriangle, color: totalBreached > 0 ? 'bg-red-50 text-red-600' : 'bg-muted text-muted-foreground' },
          { label: 'Avg compliance rate',        value: `${avgCompliance}%`, icon: CheckCircle2, color: avgCompliance >= 95 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-3 p-4">
              <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', color)}>
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="font-display text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Policy cards ── */}
      <div className="space-y-3">
        {sla.isPending
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}><CardContent className="p-5 space-y-3">
                <Skeleton className="h-5 w-64" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-24 w-full" />
              </CardContent></Card>
            ))
          : sla.data?.map((policy) => {
              const open = expanded === policy.id;
              return (
                <Card key={policy.id} className="overflow-hidden transition-shadow hover:shadow-sm">
                  {/* ── Header row ── */}
                  <button
                    className="flex w-full items-start gap-4 p-5 text-left"
                    onClick={() => setExpanded(open ? null : policy.id)}
                  >
                    <ProgressRing
                      value={policy.compliancePct}
                      size={52}
                      strokeWidth={5}
                      className={policy.compliancePct >= 95 ? 'text-emerald-500' : policy.compliancePct >= 85 ? 'text-amber-500' : 'text-red-500'}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-foreground">{policy.name}</p>
                        {policy.breachedThisMonth > 0 && (
                          <Badge variant="danger" className="text-[10px]">{policy.breachedThisMonth} breached</Badge>
                        )}
                        {!policy.businessHoursOnly && (
                          <Badge variant="outline" className="text-[10px]">24/7</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{policy.description}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
                        <span>{policy.compliancePct}% compliance this month</span>
                        <span>{policy.activeTickets} active tickets</span>
                        <span className="flex flex-wrap gap-1">
                          {policy.conditions.map((c, i) => (
                            <span key={i} className="rounded bg-muted/60 px-1.5 py-0.5">{c}</span>
                          ))}
                        </span>
                      </div>
                    </div>
                    <div className="ml-auto flex shrink-0 items-center gap-2">
                      <Button size="sm" variant="outline" className="h-7 px-3 text-xs" onClick={(e) => e.stopPropagation()}>
                        Edit
                      </Button>
                      {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </button>

                  {/* ── Targets (expandable) ── */}
                  {open && (
                    <div className="border-t border-border/60 bg-muted/20 px-5 py-4">
                      <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Response &amp; resolution targets</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border/40">
                              <th className="pb-2 text-left text-xs font-semibold text-muted-foreground">Priority</th>
                              <th className="pb-2 text-right text-xs font-semibold text-muted-foreground">First response</th>
                              <th className="pb-2 text-right text-xs font-semibold text-muted-foreground">Resolution</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/30">
                            {policy.targets.map((t) => (
                              <tr key={t.priority}>
                                <td className="py-2">{priorityBadge(t.priority)}</td>
                                <td className="py-2 text-right text-xs font-medium text-foreground">
                                  <Clock className="mr-1 inline h-3 w-3 text-muted-foreground" />
                                  {formatDuration(t.firstResponseMin)}
                                </td>
                                <td className="py-2 text-right text-xs font-medium text-foreground">
                                  {formatDuration(t.resolutionHours * 60)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Info className="h-3 w-3" />
                          {policy.businessHoursOnly ? 'Business hours only' : '24/7 coverage'}
                        </span>
                        <span>Escalation: {policy.escalationEnabled ? 'Enabled' : 'Disabled'}</span>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
      </div>
    </div>
  );
}
