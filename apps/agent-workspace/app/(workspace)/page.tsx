'use client';

import Link from 'next/link';
import type { ComponentType } from 'react';
import {
  Avatar,
  AvatarFallback,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  PriorityIndicator,
  Skeleton,
  StatusPill,
  cn,
} from '@topiadesk/ui';
import {
  Inbox,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { useDashboardMetrics, useTickets } from '@/lib/queries';
import { initials, relativeTime } from '@/lib/format';

export default function DashboardPage() {
  const metrics = useDashboardMetrics();
  const tickets = useTickets();

  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Good morning, Tunde
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&rsquo;s what needs your attention today.
          </p>
        </div>
        <span className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </span>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Inbox}
          label="Open tickets"
          value={metrics.data?.openTickets}
          sub={`${metrics.data?.unassignedTickets ?? 0} unassigned`}
          accent="info"
          loading={metrics.isLoading}
        />
        <MetricCard
          icon={AlertTriangle}
          label="SLA at risk"
          value={metrics.data?.slaAtRisk}
          sub={`${metrics.data?.slaBreached ?? 0} already breached`}
          accent="warning"
          loading={metrics.isLoading}
        />
        <MetricCard
          icon={CheckCircle2}
          label="Resolved today"
          value={metrics.data?.resolvedToday}
          sub={`CSAT ${metrics.data?.csatScore ?? '—'} / 5 (${metrics.data?.csatSampleSize ?? 0})`}
          accent="success"
          loading={metrics.isLoading}
        />
        <MetricCard
          icon={Clock}
          label="First response avg"
          value={
            metrics.data ? `${metrics.data.avgFirstResponseMinutes}m` : undefined
          }
          sub="last 24 hours"
          accent="default"
          loading={metrics.isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Recent activity</CardTitle>
            <Link
              href="/tickets"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {tickets.isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            ) : (
              <ul className="divide-y">
                {(tickets.data ?? []).slice(0, 6).map((t) => (
                  <li key={t.id} className="py-3">
                    <Link
                      href={`/tickets/${t.id}`}
                      className="flex items-center justify-between gap-4 rounded-md px-1 py-1 hover:bg-muted/50"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">
                            {t.number}
                          </span>
                          <StatusPill status={t.status} />
                        </div>
                        <p className="mt-1 truncate text-sm font-medium">
                          {t.subject}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {t.requester.name} · {relativeTime(t.updatedAt)}
                        </p>
                      </div>
                      <PriorityIndicator priority={t.priority} />
                      {t.assignee ? (
                        <Avatar className="h-7 w-7">
                          <AvatarFallback>
                            {initials(t.assignee.name)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Unassigned
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SLA health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SlaBar label="On track" count={42} total={47} variant="success" />
            <SlaBar label="At risk" count={4} total={47} variant="warning" />
            <SlaBar label="Breached" count={1} total={47} variant="danger" />
            <p className="pt-2 text-xs text-muted-foreground">
              Targets reset at midnight {Intl.DateTimeFormat().resolvedOptions().timeZone}.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: number | string | undefined;
  sub: string;
  accent: 'info' | 'warning' | 'success' | 'default';
  loading?: boolean;
}

const accentClasses: Record<MetricCardProps['accent'], string> = {
  info: 'bg-blue-100 text-blue-800',
  warning: 'bg-amber-100 text-amber-800',
  success: 'bg-emerald-100 text-emerald-800',
  default: 'bg-muted text-muted-foreground',
};

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
  loading,
}: MetricCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            {loading ? (
              <Skeleton className="mt-2 h-8 w-16" />
            ) : (
              <p className="mt-2 text-3xl font-semibold tracking-tight">
                {value ?? '—'}
              </p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
          </div>
          <div
            className={cn(
              'grid h-10 w-10 place-items-center rounded-lg',
              accentClasses[accent],
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface SlaBarProps {
  label: string;
  count: number;
  total: number;
  variant: 'success' | 'warning' | 'danger';
}

const slaBarFill: Record<SlaBarProps['variant'], string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

function SlaBar({ label, count, total, variant }: SlaBarProps) {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-foreground">{label}</span>
        <span className="font-medium">{count}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn('h-full rounded-full', slaBarFill[variant])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
