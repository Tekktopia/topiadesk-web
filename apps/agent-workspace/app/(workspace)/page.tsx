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
  StatusPill,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from '@topiadesk/ui';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Clock,
  Inbox,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Reply,
  Send,
  Smartphone,
  TrendingUp,
  Upload,
  UserPlus,
} from 'lucide-react';
import { useDashboardMetrics, useTickets } from '@/lib/queries';
import type { MockTicket } from '@/lib/mock-data';
import { initials, relativeTime } from '@/lib/format';

const CURRENT_AGENT_ID = 'a1';
const CURRENT_AGENT_NAME = 'Tunde';

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

type ActivityType =
  | 'resolved'
  | 'reply'
  | 'assign'
  | 'escalate'
  | 'create'
  | 'note'
  | 'sla';

interface ActivityEvent {
  id: string;
  who: string;
  whoType: 'agent' | 'customer' | 'system';
  action: string;
  ticket: string;
  subject: string;
  time: string;
  type: ActivityType;
}

const ACTIVITY_FEED: ActivityEvent[] = [
  {
    id: 'e1',
    who: 'Adaeze Nwosu',
    whoType: 'agent',
    action: 'resolved',
    ticket: '#1018',
    subject: 'Slack notifications muted',
    time: '12m ago',
    type: 'resolved',
  },
  {
    id: 'e2',
    who: 'Sarah Okonkwo',
    whoType: 'customer',
    action: 'replied to',
    ticket: '#1024',
    subject: 'Cannot connect to VPN',
    time: '24m ago',
    type: 'reply',
  },
  {
    id: 'e3',
    who: 'Automation',
    whoType: 'system',
    action: 'escalated',
    ticket: '#1021',
    subject: 'CCTV cameras offline',
    time: '38m ago',
    type: 'escalate',
  },
  {
    id: 'e4',
    who: 'SLA engine',
    whoType: 'system',
    action: 'flagged at-risk',
    ticket: '#1024',
    subject: 'Cannot connect to VPN',
    time: '42m ago',
    type: 'sla',
  },
  {
    id: 'e5',
    who: 'Kwame Mensah',
    whoType: 'agent',
    action: 'assigned to themselves',
    ticket: '#1020',
    subject: 'Outlook password prompts',
    time: '1h ago',
    type: 'assign',
  },
  {
    id: 'e6',
    who: 'Adaeze Nwosu',
    whoType: 'agent',
    action: 'left an internal note on',
    ticket: '#1023',
    subject: 'Printer paper-jam (no jam visible)',
    time: '1h ago',
    type: 'note',
  },
  {
    id: 'e7',
    who: 'Grace Maathai',
    whoType: 'customer',
    action: 'opened',
    ticket: '#1019',
    subject: 'Laptop for new joiner',
    time: '2h ago',
    type: 'create',
  },
];

export default function DashboardPage() {
  const metrics = useDashboardMetrics();
  const tickets = useTickets();

  const myQueue = (tickets.data ?? []).filter(
    (t) =>
      t.assignee?.id === CURRENT_AGENT_ID &&
      !['resolved', 'closed', 'spam'].includes(t.status),
  );

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
      <PageHeader queueCount={myQueue.length} />

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
              <CardTitle className="text-sm">My queue</CardTitle>
              <p className="text-xs text-muted-foreground">
                Tickets assigned to you, ordered by SLA urgency
              </p>
            </div>
            <Link
              href="/tickets?view=my-open"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Open queue
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {tickets.isLoading ? (
              <div className="space-y-2 p-4">
                <Skeleton className="h-14" />
                <Skeleton className="h-14" />
                <Skeleton className="h-14" />
              </div>
            ) : myQueue.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">
                Your queue is empty.
              </p>
            ) : (
              <ul className="divide-y">
                {myQueue.map((t) => (
                  <MyQueueRow key={t.id} ticket={t} />
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
              <ProgressRing
                value={89}
                size={88}
                strokeWidth={8}
                className="text-emerald-500"
              >
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
                {CHANNEL_BREAKDOWN.map((c) => {
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
              <CardTitle className="text-sm">Needs attention</CardTitle>
              <p className="text-xs text-muted-foreground">
                Breached, at-risk and escalated tickets across the workspace
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

        <ActivityFeed events={ACTIVITY_FEED} />
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

function PageHeader({ queueCount }: { queueCount: number }) {
  return (
    <header className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-5 shadow-lg shadow-blue-600/15">
      {/* Subtle pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200">
            Helpdesk overview
          </p>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Good morning, {CURRENT_AGENT_NAME} 👋
          </h1>
          <p className="text-sm text-blue-200">
            You have{' '}
            <Link
              href="/tickets?view=my-open"
              className="font-semibold text-white underline-offset-2 hover:underline"
            >
              {queueCount} open tickets
            </Link>{' '}
            in your queue. 2 are due in the next hour.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/30"
          >
            <Link href="/tickets?view=my-open">
              <Inbox className="h-3 w-3" />
              My queue
              <Badge className="ml-1 h-4 bg-white/20 px-1.5 text-[9px] text-white">
                {queueCount}
              </Badge>
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 bg-white/10 text-white hover:bg-white/20"
          >
            <Upload className="h-3 w-3" />
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 bg-white/10 text-white hover:bg-white/20"
          >
            <Activity className="h-3 w-3" />
            Run report
          </Button>
          <Button
            size="sm"
            className="bg-white text-blue-700 font-semibold shadow-md hover:bg-blue-50"
          >
            <Plus className="h-3 w-3" />
            New ticket
          </Button>
        </div>
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

const accentClasses: Record<
  MetricCardProps['accent'],
  { iconBg: string; iconText: string; spark: string; strip: string }
> = {
  info:    { iconBg: 'bg-blue-500/10',    iconText: 'text-blue-600',    spark: 'text-blue-500',    strip: 'from-blue-500 to-blue-400' },
  warning: { iconBg: 'bg-amber-500/10',   iconText: 'text-amber-600',   spark: 'text-amber-500',   strip: 'from-amber-500 to-amber-400' },
  success: { iconBg: 'bg-emerald-500/10', iconText: 'text-emerald-600', spark: 'text-emerald-500', strip: 'from-emerald-500 to-emerald-400' },
  default: { iconBg: 'bg-muted',          iconText: 'text-muted-foreground', spark: 'text-muted-foreground', strip: 'from-slate-400 to-slate-300' },
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
  const ac = accentClasses[accent];
  const ArrowIcon = delta.direction === 'up' ? ArrowUpRight : ArrowDownRight;
  return (
    <Card className="overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      {/* Gradient accent strip */}
      <div className={cn('h-1 w-full bg-gradient-to-r', ac.strip)} />
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
                    'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                    delta.good
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-red-50 text-red-600',
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
              'grid h-10 w-10 shrink-0 place-items-center rounded-xl',
              ac.iconBg,
              ac.iconText,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <Sparkline data={trend} width={240} height={28} className={ac.spark} />
      </CardContent>
    </Card>
  );
}

function MyQueueRow({ ticket }: { ticket: MockTicket }) {
  const sla = computeSlaProgress(ticket);
  return (
    <li>
      <Link
        href={`/tickets/${ticket.id}`}
        className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50"
      >
        <PriorityIndicator priority={ticket.priority} className="shrink-0" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-muted-foreground">
              {ticket.number}
            </span>
            <StatusPill status={ticket.status} />
            {ticket.slaStatus === 'breached' && (
              <Badge variant="danger" className="h-4 px-1.5 text-[9px]">
                Breached
              </Badge>
            )}
          </div>
          <p className="mt-0.5 truncate text-sm font-medium">{ticket.subject}</p>
          <p className="truncate text-[11px] text-muted-foreground">
            {ticket.requester.name} · {ticket.category}
          </p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              <ProgressRing
                value={sla.percentRemaining}
                size={32}
                strokeWidth={3}
                className={cn(
                  sla.tone === 'danger' && 'text-red-500',
                  sla.tone === 'warning' && 'text-amber-500',
                  sla.tone === 'ok' && 'text-emerald-500',
                )}
              />
              <div className="text-right">
                <p
                  className={cn(
                    'text-xs font-medium tabular-nums',
                    sla.tone === 'danger' && 'text-red-600',
                    sla.tone === 'warning' && 'text-amber-600',
                  )}
                >
                  {sla.label}
                </p>
                <p className="text-[10px] text-muted-foreground">SLA</p>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            Resolution due {new Date(ticket.slaDueAt).toLocaleString()}
          </TooltipContent>
        </Tooltip>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="Reply"
                className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={(e) => e.preventDefault()}
              >
                <Reply className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Quick reply</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="Mark resolved"
                className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={(e) => e.preventDefault()}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Mark resolved</TooltipContent>
          </Tooltip>
        </div>
      </Link>
    </li>
  );
}

interface SlaProgress {
  percentRemaining: number;
  label: string;
  tone: 'ok' | 'warning' | 'danger';
}

function computeSlaProgress(ticket: MockTicket): SlaProgress {
  const due = new Date(ticket.slaDueAt).getTime();
  const created = new Date(ticket.createdAt).getTime();
  const now = Date.now();
  const total = Math.max(due - created, 1);
  const remainingMs = due - now;
  const remainingMin = Math.round(remainingMs / 60_000);
  const pct = Math.max(0, Math.min(100, (remainingMs / total) * 100));

  let label: string;
  if (remainingMs < 0) {
    label = `${Math.abs(Math.round(remainingMs / 60_000))}m late`;
  } else if (remainingMin < 60) {
    label = `${remainingMin}m left`;
  } else {
    label = `${Math.round(remainingMin / 60)}h left`;
  }

  let tone: SlaProgress['tone'] = 'ok';
  if (ticket.slaStatus === 'breached' || remainingMs < 0) tone = 'danger';
  else if (ticket.slaStatus === 'at_risk' || pct < 30) tone = 'warning';

  return { percentRemaining: pct, label, tone };
}

const activityMeta: Record<
  ActivityType,
  { icon: ComponentType<{ className?: string }>; tone: string }
> = {
  resolved: { icon: CheckCircle2, tone: 'bg-emerald-100 text-emerald-700' },
  reply: { icon: Reply, tone: 'bg-blue-100 text-blue-700' },
  assign: { icon: UserPlus, tone: 'bg-blue-100 text-blue-700' },
  escalate: { icon: AlertTriangle, tone: 'bg-red-100 text-red-700' },
  create: { icon: Send, tone: 'bg-muted text-muted-foreground' },
  note: { icon: MessageSquare, tone: 'bg-amber-100 text-amber-700' },
  sla: { icon: AlertCircle, tone: 'bg-amber-100 text-amber-700' },
};

function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
        <div>
          <CardTitle className="text-sm">Recent activity</CardTitle>
          <p className="text-xs text-muted-foreground">
            Across all tickets in this tenant
          </p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="cursor-default text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live
            </Badge>
          </TooltipTrigger>
          <TooltipContent>Updates in real time</TooltipContent>
        </Tooltip>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y">
          {events.map((e) => {
            const meta = activityMeta[e.type];
            const Icon = meta.icon;
            const showAvatar = e.whoType !== 'system';
            return (
              <li key={e.id} className="flex items-start gap-3 px-4 py-2.5">
                <div className="relative shrink-0">
                  {showAvatar ? (
                    <Avatar className="h-7 w-7">
                      <AvatarFallback>{initials(e.who)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-muted">
                      <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full ring-2 ring-background',
                      meta.tone,
                    )}
                  >
                    <Icon className="h-2.5 w-2.5" />
                  </div>
                </div>
                <div className="min-w-0 flex-1 text-xs leading-relaxed">
                  <p>
                    <span className="font-medium text-foreground">{e.who}</span>{' '}
                    <span className="text-muted-foreground">{e.action}</span>{' '}
                    <Link
                      href={`/tickets/${e.ticket.replace('#', 't-')}`}
                      className="font-mono text-[11px] font-medium text-primary hover:underline"
                    >
                      {e.ticket}
                    </Link>
                  </p>
                  <p className="truncate text-muted-foreground">{e.subject}</p>
                  <p className="text-[10px] text-muted-foreground/70">{e.time}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="border-t bg-muted/20 p-2 text-center">
          <Link
            href="#"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
          >
            View full activity log
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
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
