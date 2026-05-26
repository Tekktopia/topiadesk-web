'use client';

import Link from 'next/link';
import type { ComponentType } from 'react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  PriorityIndicator,
  ProgressRing,
  Skeleton,
  Sparkline,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from '@topiadesk/ui';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Inbox,
  Mail,
  MessageSquare,
  Phone,
  Smartphone,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useDashboardMetrics, useTickets } from '@/lib/queries';
import { initials, relativeTime } from '@/lib/format';

// Stable sparkline trend data per metric (last 12 buckets).
const TRENDS = {
  openTickets: [38, 41, 44, 42, 45, 47, 49, 46, 48, 44, 46, 47],
  slaAtRisk: [2, 3, 5, 4, 6, 5, 7, 6, 5, 4, 5, 4],
  resolvedToday: [12, 10, 14, 16, 13, 17, 15, 18, 16, 19, 17, 18],
  firstResponse: [18, 16, 17, 15, 14, 13, 12, 14, 13, 12, 11, 12],
} as const;

const DELTAS = {
  openTickets: { value: -3, direction: 'down' as const, good: true },
  slaAtRisk: { value: -1, direction: 'down' as const, good: true },
  resolvedToday: { value: 12, direction: 'up' as const, good: true },
  firstResponse: { value: -2, direction: 'down' as const, good: true },
};

const CHANNEL_BREAKDOWN = [
  { channel: 'Email', icon: Mail, count: 124, pct: 48 },
  { channel: 'Portal', icon: MessageSquare, count: 56, pct: 22 },
  { channel: 'WhatsApp', icon: Smartphone, count: 41, pct: 16 },
  { channel: 'Voice', icon: Phone, count: 24, pct: 9 },
  { channel: 'API', icon: Sparkles, count: 13, pct: 5 },
];

const LEADERBOARD = [
  { id: 'a1', name: 'Tunde Bakare', resolved: 27, avgResponse: '8m', csat: 4.9, online: true },
  { id: 'a2', name: 'Adaeze Nwosu', resolved: 24, avgResponse: '11m', csat: 4.8, online: true },
  { id: 'a3', name: 'Kwame Mensah', resolved: 21, avgResponse: '9m', csat: 4.7, online: false },
  { id: 'a4', name: 'Fatima Suleiman', resolved: 18, avgResponse: '14m', csat: 4.6, online: true },
  { id: 'a5', name: 'Chinedu Okafor', resolved: 16, avgResponse: '12m', csat: 4.8, online: false },
];

const VOLUME = [
  { day: 'Mon', created: 42, resolved: 38 },
  { day: 'Tue', created: 51, resolved: 45 },
  { day: 'Wed', created: 47, resolved: 49 },
  { day: 'Thu', created: 55, resolved: 51 },
  { day: 'Fri', created: 60, resolved: 53 },
  { day: 'Sat', created: 28, resolved: 31 },
  { day: 'Sun', created: 22, resolved: 24 },
  { day: 'Today', created: 18, resolved: 14 },
];

export default function DashboardPage() {
  const metrics = useDashboardMetrics();
  const tickets = useTickets();

  const attention = (tickets.data ?? [])
    .filter(
      (t) =>
        t.slaStatus === 'breached' ||
        t.slaStatus === 'at_risk' ||
        t.status === 'escalated',
    )
    .slice(0, 6);

  return (
    <div className="space-y-5 p-5">
      <PageHeader />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Inbox}
          label="Open tickets"
          value={metrics.data?.openTickets}
          sub={`${metrics.data?.unassignedTickets ?? 0} unassigned`}
          accent="info"
          trend={[...TRENDS.openTickets]}
          delta={DELTAS.openTickets}
          loading={metrics.isLoading}
        />
        <MetricCard
          icon={AlertTriangle}
          label="SLA at risk"
          value={metrics.data?.slaAtRisk}
          sub={`${metrics.data?.slaBreached ?? 0} already breached`}
          accent="warning"
          trend={[...TRENDS.slaAtRisk]}
          delta={DELTAS.slaAtRisk}
          loading={metrics.isLoading}
        />
        <MetricCard
          icon={CheckCircle2}
          label="Resolved today"
          value={metrics.data?.resolvedToday}
          sub={`CSAT ${metrics.data?.csatScore ?? '—'} / 5 (${metrics.data?.csatSampleSize ?? 0})`}
          accent="success"
          trend={[...TRENDS.resolvedToday]}
          delta={DELTAS.resolvedToday}
          loading={metrics.isLoading}
        />
        <MetricCard
          icon={Clock}
          label="First response avg"
          value={
            metrics.data ? `${metrics.data.avgFirstResponseMinutes}m` : undefined
          }
          sub="rolling 24 hours"
          accent="default"
          trend={[...TRENDS.firstResponse]}
          delta={DELTAS.firstResponse}
          loading={metrics.isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
            <div>
              <CardTitle className="text-sm">Needs attention</CardTitle>
              <p className="text-xs text-muted-foreground">
                Breached, at-risk and escalated tickets
              </p>
            </div>
            <Link
              href="/tickets?view=attention"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {tickets.isLoading ? (
              <div className="space-y-2 p-4">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            ) : attention.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">
                Nothing needs attention right now. Nice work.
              </p>
            ) : (
              <ul className="divide-y">
                {attention.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/tickets/${t.id}`}
                      className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-muted/50"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {t.number}
                          </span>
                          {t.slaStatus === 'breached' && (
                            <Badge variant="danger" className="h-4 px-1.5 text-[9px]">
                              SLA breached
                            </Badge>
                          )}
                          {t.slaStatus === 'at_risk' && (
                            <Badge variant="warning" className="h-4 px-1.5 text-[9px]">
                              SLA at risk
                            </Badge>
                          )}
                          {t.status === 'escalated' && (
                            <Badge variant="outline" className="h-4 px-1.5 text-[9px]">
                              Escalated
                            </Badge>
                          )}
                        </div>
                        <p className="truncate text-sm font-medium">
                          {t.subject}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {t.requester.name} · {t.category} ·{' '}
                          {relativeTime(t.updatedAt)}
                        </p>
                      </div>
                      <PriorityIndicator priority={t.priority} />
                      {t.assignee ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Avatar className="h-7 w-7">
                              <AvatarFallback>
                                {initials(t.assignee.name)}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>{t.assignee.name}</TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800">
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
          <CardHeader className="border-b py-3">
            <CardTitle className="text-sm">SLA health</CardTitle>
            <p className="text-xs text-muted-foreground">
              Across {(42 + 4 + 1).toLocaleString()} active tickets
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            <div className="flex items-center gap-5">
              <ProgressRing value={89} size={88} strokeWidth={8} className="text-emerald-500">
                <div className="text-center">
                  <p className="text-base font-semibold">89%</p>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
                    On track
                  </p>
                </div>
              </ProgressRing>
              <div className="space-y-2 text-xs">
                <SlaStatRow label="On track" count={42} dotClass="bg-emerald-500" />
                <SlaStatRow label="At risk" count={4} dotClass="bg-amber-500" />
                <SlaStatRow label="Breached" count={1} dotClass="bg-red-500" />
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                By channel
              </p>
              <div className="space-y-2">
                {CHANNEL_BREAKDOWN.slice(0, 4).map((c) => {
                  const Icon = c.icon;
                  return (
                    <div key={c.channel} className="flex items-center gap-2 text-xs">
                      <Icon className="h-3 w-3 text-muted-foreground" />
                      <span className="w-16 truncate">{c.channel}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${c.pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-right tabular-nums text-muted-foreground">
                        {c.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
            <div>
              <CardTitle className="text-sm">Ticket volume</CardTitle>
              <p className="text-xs text-muted-foreground">
                Created vs. resolved — last 7 days plus today
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <LegendDot color="bg-primary" label="Created" />
              <LegendDot color="bg-emerald-500" label="Resolved" />
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <VolumeChart data={VOLUME} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
            <div>
              <CardTitle className="text-sm">Top agents</CardTitle>
              <p className="text-xs text-muted-foreground">Resolved this week</p>
            </div>
            <Badge variant="outline" className="text-[10px]">
              <TrendingUp className="h-3 w-3" />
              Live
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y">
              {LEADERBOARD.map((a, idx) => (
                <li key={a.id} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="w-4 text-center font-mono text-xs font-semibold text-muted-foreground">
                    {idx + 1}
                  </span>
                  <div className="relative">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback>{initials(a.name)}</AvatarFallback>
                    </Avatar>
                    {a.online && (
                      <span
                        aria-label="Online"
                        className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-background"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{a.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Avg {a.avgResponse} · CSAT {a.csat}/5
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums">
                      {a.resolved}
                    </p>
                    <p className="text-[10px] text-muted-foreground">tickets</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Overview
        </p>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Good morning, Tunde
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&rsquo;s what needs your attention today.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Activity className="h-3 w-3" />
          Today&rsquo;s queue
        </Button>
        <Button size="sm">
          <Sparkles className="h-3 w-3" />
          Run report
        </Button>
      </div>
    </header>
  );
}

interface MetricCardProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: number | string | undefined;
  sub: string;
  accent: 'info' | 'warning' | 'success' | 'default';
  trend: number[];
  delta: { value: number; direction: 'up' | 'down'; good: boolean };
  loading?: boolean;
}

const accentClasses: Record<MetricCardProps['accent'], { bg: string; spark: string }> = {
  info: { bg: 'bg-blue-100 text-blue-700', spark: 'text-blue-500' },
  warning: { bg: 'bg-amber-100 text-amber-700', spark: 'text-amber-500' },
  success: { bg: 'bg-emerald-100 text-emerald-700', spark: 'text-emerald-500' },
  default: { bg: 'bg-muted text-muted-foreground', spark: 'text-muted-foreground' },
};

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
  trend,
  delta,
  loading,
}: MetricCardProps) {
  const accentClass = accentClasses[accent];
  const ArrowIcon = delta.direction === 'up' ? ArrowUpRight : ArrowDownRight;
  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-muted-foreground">
              {label}
            </p>
            {loading ? (
              <Skeleton className="mt-1 h-7 w-16" />
            ) : (
              <div className="mt-0.5 flex items-baseline gap-2">
                <p className="text-2xl font-bold tracking-tight">
                  {value ?? '—'}
                </p>
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 text-[10px] font-semibold',
                    delta.good ? 'text-emerald-600' : 'text-red-600',
                  )}
                >
                  <ArrowIcon className="h-3 w-3" />
                  {Math.abs(delta.value)}
                  {label.includes('avg') ? 'm' : ''}
                </span>
              </div>
            )}
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
              {sub}
            </p>
          </div>
          <div
            className={cn(
              'grid h-9 w-9 shrink-0 place-items-center rounded-lg',
              accentClass.bg,
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <Sparkline data={trend} width={240} height={28} className={accentClass.spark} />
      </CardContent>
    </Card>
  );
}

function SlaStatRow({
  label,
  count,
  dotClass,
}: {
  label: string;
  count: number;
  dotClass: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn('h-1.5 w-1.5 rounded-full', dotClass)} />
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-auto font-medium tabular-nums">{count}</span>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className={cn('h-2 w-2 rounded-full', color)} />
      {label}
    </span>
  );
}

interface VolumePoint {
  day: string;
  created: number;
  resolved: number;
}

function VolumeChart({ data }: { data: VolumePoint[] }) {
  const max = Math.max(...data.flatMap((d) => [d.created, d.resolved]));
  const width = 520;
  const height = 140;
  const padX = 24;
  const padY = 8;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const step = innerW / (data.length - 1);

  const project = (key: 'created' | 'resolved') =>
    data.map((d, i) => {
      const x = padX + i * step;
      const y = padY + innerH - (d[key] / max) * innerH;
      return [x, y] as const;
    });

  const createdPts = project('created');
  const resolvedPts = project('resolved');

  const pathFrom = (pts: ReadonlyArray<readonly [number, number]>) =>
    pts
      .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
      .join(' ');

  const createdPath = pathFrom(createdPts);
  const resolvedPath = pathFrom(resolvedPts);

  const firstCreated = createdPts[0];
  const lastCreated = createdPts[createdPts.length - 1];
  const createdArea =
    firstCreated && lastCreated
      ? `${createdPath} L ${lastCreated[0].toFixed(1)} ${height - padY} L ${firstCreated[0].toFixed(1)} ${height - padY} Z`
      : '';

  return (
    <div className="space-y-2">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        className="overflow-visible"
      >
        {[0.25, 0.5, 0.75].map((p) => (
          <line
            key={p}
            x1={padX}
            x2={width - padX}
            y1={padY + innerH * p}
            y2={padY + innerH * p}
            stroke="currentColor"
            className="text-border"
            strokeDasharray="2 4"
            strokeWidth={1}
          />
        ))}
        <path
          d={createdArea}
          fill="currentColor"
          className="text-primary"
          fillOpacity={0.08}
        />
        <path
          d={createdPath}
          fill="none"
          stroke="currentColor"
          className="text-primary"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={resolvedPath}
          fill="none"
          stroke="currentColor"
          className="text-emerald-500"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {createdPts.map(([x, y], i) => (
          <circle
            key={`c-${i}`}
            cx={x}
            cy={y}
            r={2.5}
            fill="currentColor"
            className="text-primary"
          />
        ))}
        {resolvedPts.map(([x, y], i) => (
          <circle
            key={`r-${i}`}
            cx={x}
            cy={y}
            r={2.5}
            fill="currentColor"
            className="text-emerald-500"
          />
        ))}
      </svg>
      <div className="flex justify-between px-6 text-[10px] text-muted-foreground">
        {data.map((d) => (
          <span
            key={d.day}
            className={d.day === 'Today' ? 'font-semibold text-foreground' : ''}
          >
            {d.day}
          </span>
        ))}
      </div>
    </div>
  );
}
