'use client';

import { useState } from 'react';
import {
  Filter,
  Plus,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Loader2,
  BarChart3,
  User,
} from 'lucide-react';
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
import { useAudits } from '@/lib/queries';
import type { AuditStatus } from '@/lib/mock-data';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function statusInfo(status: AuditStatus) {
  switch (status) {
    case 'completed':   return { label: 'Completed',   icon: CheckCircle2, cls: 'text-emerald-600', badgeVariant: 'default' as const, bg: 'bg-emerald-50' };
    case 'in_progress': return { label: 'In progress', icon: Loader2,       cls: 'text-blue-600',   badgeVariant: 'default' as const, bg: 'bg-blue-50' };
    case 'scheduled':   return { label: 'Scheduled',   icon: Clock,         cls: 'text-muted-foreground', badgeVariant: 'outline' as const, bg: 'bg-muted/40' };
    case 'overdue':     return { label: 'Overdue',     icon: AlertTriangle, cls: 'text-red-600',    badgeVariant: 'danger' as const, bg: 'bg-red-50' };
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AuditsPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | AuditStatus>('all');
  const audits = useAudits();

  const counts = {
    all: audits.data?.length ?? 0,
    in_progress: audits.data?.filter((a) => a.status === 'in_progress').length ?? 0,
    overdue: audits.data?.filter((a) => a.status === 'overdue').length ?? 0,
    scheduled: audits.data?.filter((a) => a.status === 'scheduled').length ?? 0,
    completed: audits.data?.filter((a) => a.status === 'completed').length ?? 0,
  };

  const filtered = (audits.data ?? []).filter(
    (a) => statusFilter === 'all' || a.status === statusFilter,
  );

  // Overall audit health
  const totalAssets = audits.data?.reduce((s, a) => s + a.totalAssets, 0) ?? 0;
  const totalVerified = audits.data?.reduce((s, a) => s + a.verified, 0) ?? 0;
  const totalMissing = audits.data?.reduce((s, a) => s + a.missing, 0) ?? 0;
  const overallPct = totalAssets > 0 ? Math.round((totalVerified / totalAssets) * 100) : 0;

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
              Infrastructure
            </p>
            <h1 className="font-display mt-0.5 text-2xl font-bold tracking-tight text-white">
              Asset Audits
            </h1>
            <p className="mt-0.5 text-sm text-white/70">
              {counts.in_progress} in progress · {counts.overdue} overdue · {counts.scheduled} scheduled
            </p>
          </div>
          <Button size="sm" className="bg-coral text-white hover:bg-white/90">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New audit
          </Button>
        </div>
      </div>

      {/* ── Overview strip ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total assets', value: totalAssets, icon: BarChart3 },
          { label: 'Verified', value: totalVerified, icon: CheckCircle2 },
          { label: 'Missing', value: totalMissing, icon: AlertTriangle },
          { label: 'Overall progress', value: `${overallPct}%`, icon: Filter },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
                <Icon className={cn('h-4 w-4', label === 'Missing' && totalMissing > 0 ? 'text-red-500' : 'text-blue-500')} />
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Status filter tabs ── */}
      <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/30 p-0.5 w-fit">
        {([
          { key: 'all',         label: 'All' },
          { key: 'in_progress', label: 'In progress' },
          { key: 'overdue',     label: 'Overdue' },
          { key: 'scheduled',   label: 'Scheduled' },
          { key: 'completed',   label: 'Completed' },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={cn(
              'rounded-md px-3 py-1 text-xs font-medium transition-all',
              statusFilter === key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
            {key !== 'all' && (
              <span className="ml-1.5 text-muted-foreground/60">{counts[key]}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Audit cards ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {audits.isPending
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2 mt-1">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          : filtered.map((audit) => {
              const st = statusInfo(audit.status);
              const StatusIcon = st.icon;
              const pct = audit.totalAssets > 0
                ? Math.round((audit.verified / audit.totalAssets) * 100)
                : 0;
              return (
                <Card key={audit.id} className={cn('transition-shadow hover:shadow-sm', audit.status === 'overdue' && 'border-red-200')}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <p className="text-sm font-semibold text-foreground">{audit.name}</p>
                          <span className={cn(
                            'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                            audit.status === 'completed' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                            audit.status === 'in_progress' ? 'border-blue-200 bg-blue-50 text-blue-700' :
                            audit.status === 'overdue' ? 'border-red-200 bg-red-50 text-red-700' :
                            'border-border bg-muted/40 text-muted-foreground'
                          )}>
                            <StatusIcon className="h-2.5 w-2.5" />
                            {st.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {audit.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" /> {audit.assignedTo}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {audit.status === 'completed' && audit.completedDate
                              ? `Completed ${formatDate(audit.completedDate)}`
                              : `Scheduled ${formatDate(audit.scheduledDate)}`}
                          </span>
                        </div>
                      </div>
                      <ProgressRing
                        value={pct}
                        size={52}
                        strokeWidth={5}
                        className={cn(
                          audit.status === 'completed' ? 'text-emerald-500' :
                          audit.status === 'overdue' ? 'text-red-500' :
                          audit.status === 'in_progress' ? 'text-blue-500' :
                          'text-muted-foreground',
                        )}
                      />
                    </div>

                    <div className="mt-3 flex items-center gap-4 rounded-lg bg-muted/30 px-3 py-2">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-foreground">{audit.totalAssets}</span>
                        <span className="text-[10px] text-muted-foreground">Total</span>
                      </div>
                      <div className="h-8 w-px bg-border/60" />
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-emerald-600">{audit.verified}</span>
                        <span className="text-[10px] text-muted-foreground">Verified</span>
                      </div>
                      <div className="h-8 w-px bg-border/60" />
                      <div className="flex flex-col items-center">
                        <span className={cn('text-sm font-bold', audit.missing > 0 ? 'text-red-600' : 'text-muted-foreground')}>{audit.missing}</span>
                        <span className="text-[10px] text-muted-foreground">Missing</span>
                      </div>
                      {audit.notes && (
                        <>
                          <div className="h-8 w-px bg-border/60" />
                          <p className="flex-1 text-[10px] text-muted-foreground line-clamp-2">{audit.notes}</p>
                        </>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-end gap-2">
                      {audit.status === 'in_progress' && (
                        <Button size="sm" className="h-7 px-3 text-xs">
                          Continue audit
                        </Button>
                      )}
                      {audit.status === 'overdue' && (
                        <Button size="sm" variant="outline" className="h-7 border-red-200 px-3 text-xs text-red-600 hover:bg-red-50">
                          Reschedule
                        </Button>
                      )}
                      {audit.status === 'scheduled' && (
                        <Button size="sm" variant="outline" className="h-7 px-3 text-xs">
                          Start audit
                        </Button>
                      )}
                      {audit.status === 'completed' && (
                        <Button size="sm" variant="ghost" className="h-7 px-3 text-xs">
                          View report
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {!audits.isPending && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Filter className="mb-2 h-8 w-8 text-muted-foreground/30" />
          <p className="text-sm font-medium text-foreground">No audits found</p>
          <p className="text-xs text-muted-foreground">No audits match the selected filter.</p>
        </div>
      )}
    </div>
  );
}
