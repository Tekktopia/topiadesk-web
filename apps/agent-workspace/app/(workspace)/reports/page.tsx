'use client';

import { useMemo, useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  CalendarDays,
  TrendingUp,
  Clock,
  CheckCircle2,
  Star,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Target,
  TrendingDown,
  PieChart,
  Filter,
  Award,
  AlertTriangle,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  cn,
} from '@topiadesk/ui';
import {
  useReportSummary,
  useTicketVolume,
  useAgentStats,
  useCategorySummary,
  useChannelSummary,
} from '@/lib/queries';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <Card className="bg-card">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Icon className="h-3.5 w-3.5" />
          </span>
        </div>
        <p className="font-display text-2xl font-bold tracking-tight text-foreground">{value}</p>
        {sub && (
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            {trend === 'up' && <ArrowUpRight className="h-3 w-3 text-emerald-500" />}
            {trend === 'down' && <ArrowDownRight className="h-3 w-3 text-red-500" />}
            {sub}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Minimal bar chart using divs
function BarRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-36 shrink-0 truncate text-right text-xs text-muted-foreground">{label}</span>
      <div className="flex-1 overflow-hidden rounded-full bg-muted/50" style={{ height: 8 }}>
        <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-right text-xs font-semibold text-foreground">{value}</span>
    </div>
  );
}

// Tiny sparkline-style volume chart
function VolumeChart({ data }: { data: { label: string; created: number; resolved: number }[] }) {
  const maxVal = Math.max(...data.flatMap((d) => [d.created, d.resolved]));
  const show = data.slice(-14); // last 14 days
  return (
    <div className="flex h-32 items-end gap-px">
      {show.map((d) => {
        const createdH = maxVal > 0 ? (d.created / maxVal) * 100 : 0;
        const resolvedH = maxVal > 0 ? (d.resolved / maxVal) * 100 : 0;
        return (
          <div key={d.label} className="group relative flex flex-1 flex-col items-center gap-px">
            <div
              className="w-full rounded-t bg-blue-500/30 transition-all group-hover:bg-blue-500/50"
              style={{ height: `${createdH}%` }}
            />
            <div
              className="w-full rounded-t bg-blue-600 transition-all group-hover:bg-blue-700"
              style={{ height: `${resolvedH}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}

// ─── SLA TARGETS (set by tenant admin in /sla policy) ───────────────────────
// These come from the tenant-admin SLA policy. Hardcoded here for now;
// in production these would be fetched from the same source.
const SLA_TARGETS = {
  firstResponseSla: 90,
  resolutionSla:    85,
};

// ─── SLA by group/agent (Freshdesk-style) ────────────────────────────────────

interface AgentSlaStat {
  id: string;
  name: string;
  avatar: string;
  tickets: number;
  firstResponseSla: number; // %
  resolutionSla: number;    // %
  breached: number;
}

interface GroupSlaStat {
  group: string;
  totalTickets: number;
  firstResponseSla: number; // %
  resolutionSla: number;    // %
  breached: number;
  agents: AgentSlaStat[];
}

const GROUP_SLA: GroupSlaStat[] = [
  {
    group: 'Tier 1 Support', totalTickets: 142, firstResponseSla: 94.4, resolutionSla: 88.7, breached: 16,
    agents: [
      { id: 'a1', name: 'Tunde Bakare',    avatar: 'TB', tickets: 82, firstResponseSla: 96.3, resolutionSla: 91.5, breached: 3 },
      { id: 'a3', name: 'Kwame Mensah',    avatar: 'KM', tickets: 60, firstResponseSla: 91.7, resolutionSla: 84.9, breached: 13 },
    ],
  },
  {
    group: 'Tier 2 Support', totalTickets: 98, firstResponseSla: 91.8, resolutionSla: 85.2, breached: 14,
    agents: [
      { id: 'a2', name: 'Adaeze Nwosu',    avatar: 'AN', tickets: 54, firstResponseSla: 94.4, resolutionSla: 88.9, breached: 6 },
      { id: 'a5', name: 'Chinedu Okafor',  avatar: 'CO', tickets: 44, firstResponseSla: 88.6, resolutionSla: 80.7, breached: 8 },
    ],
  },
  {
    group: 'IT Operations', totalTickets: 76, firstResponseSla: 96.1, resolutionSla: 92.4, breached: 6,
    agents: [
      { id: 'a1', name: 'Tunde Bakare',    avatar: 'TB', tickets: 38, firstResponseSla: 97.4, resolutionSla: 94.7, breached: 2 },
      { id: 'a4', name: 'Fatima Suleiman', avatar: 'FS', tickets: 38, firstResponseSla: 94.7, resolutionSla: 90.0, breached: 4 },
    ],
  },
  {
    group: 'Field Support', totalTickets: 54, firstResponseSla: 88.9, resolutionSla: 79.6, breached: 11,
    agents: [
      { id: 'a3', name: 'Kwame Mensah',    avatar: 'KM', tickets: 30, firstResponseSla: 90.0, resolutionSla: 80.0, breached: 6 },
      { id: 'a5', name: 'Chinedu Okafor',  avatar: 'CO', tickets: 24, firstResponseSla: 87.5, resolutionSla: 79.2, breached: 5 },
    ],
  },
  {
    group: 'Security Ops', totalTickets: 42, firstResponseSla: 97.6, resolutionSla: 95.2, breached: 2,
    agents: [
      { id: 'a4', name: 'Fatima Suleiman', avatar: 'FS', tickets: 24, firstResponseSla: 100,  resolutionSla: 95.8, breached: 1 },
      { id: 'a2', name: 'Adaeze Nwosu',    avatar: 'AN', tickets: 18, firstResponseSla: 94.4, resolutionSla: 94.4, breached: 1 },
    ],
  },
  {
    group: 'Billing', totalTickets: 28, firstResponseSla: 92.9, resolutionSla: 89.3, breached: 3,
    agents: [
      { id: 'a2', name: 'Adaeze Nwosu',    avatar: 'AN', tickets: 28, firstResponseSla: 92.9, resolutionSla: 89.3, breached: 3 },
    ],
  },
  {
    group: 'Identity & Access', totalTickets: 21, firstResponseSla: 90.5, resolutionSla: 85.7, breached: 3,
    agents: [
      { id: 'a4', name: 'Fatima Suleiman', avatar: 'FS', tickets: 21, firstResponseSla: 90.5, resolutionSla: 85.7, breached: 3 },
    ],
  },
];

function slaTone(pct: number) {
  if (pct >= 95) return 'text-emerald-600';
  if (pct >= 90) return 'text-amber-600';
  return 'text-red-600';
}
function slaBg(pct: number) {
  if (pct >= 95) return 'bg-emerald-500';
  if (pct >= 90) return 'bg-amber-500';
  return 'bg-red-500';
}

function SlaByGroupSection() {
  const [group, setGroup] = useState<'all' | string>('all');
  const [agentId, setAgentId] = useState<'all' | string>('all');

  // Aggregate when "all" is selected
  const overall = useMemo(() => {
    const totalT = GROUP_SLA.reduce((s, g) => s + g.totalTickets, 0);
    const fr = GROUP_SLA.reduce((s, g) => s + g.firstResponseSla * g.totalTickets, 0) / Math.max(1, totalT);
    const rs = GROUP_SLA.reduce((s, g) => s + g.resolutionSla    * g.totalTickets, 0) / Math.max(1, totalT);
    const br = GROUP_SLA.reduce((s, g) => s + g.breached, 0);
    return { totalT, firstResponseSla: fr, resolutionSla: rs, breached: br };
  }, []);

  const selectedGroup = useMemo(() => GROUP_SLA.find((g) => g.group === group), [group]);
  const selectedAgent = useMemo(
    () => selectedGroup?.agents.find((a) => a.id === agentId),
    [selectedGroup, agentId],
  );

  // Active metrics — group, agent, or overall
  const view = useMemo(() => {
    if (selectedAgent) {
      return {
        scope: `${selectedAgent.name} · ${selectedGroup!.group}`,
        tickets: selectedAgent.tickets,
        firstResponseSla: selectedAgent.firstResponseSla,
        resolutionSla: selectedAgent.resolutionSla,
        breached: selectedAgent.breached,
      };
    }
    if (selectedGroup) {
      return {
        scope: `Group: ${selectedGroup.group}`,
        tickets: selectedGroup.totalTickets,
        firstResponseSla: selectedGroup.firstResponseSla,
        resolutionSla: selectedGroup.resolutionSla,
        breached: selectedGroup.breached,
      };
    }
    return {
      scope: 'All groups',
      tickets: overall.totalT,
      firstResponseSla: overall.firstResponseSla,
      resolutionSla: overall.resolutionSla,
      breached: overall.breached,
    };
  }, [selectedAgent, selectedGroup, overall]);

  // Reset agent filter when group changes
  const handleSelectGroup = (g: string) => {
    setGroup(g);
    setAgentId('all');
  };

  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-coral" />
            <CardTitle className="text-sm font-semibold">SLA performance by group</CardTitle>
          </div>
          <Badge variant="secondary" className="text-[10px]">SLA target: 90%</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Group</span>
            <select
              value={group}
              onChange={(e) => handleSelectGroup(e.target.value)}
              className="h-8 rounded-md border bg-background px-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">All groups</option>
              {GROUP_SLA.map((g) => <option key={g.group} value={g.group}>{g.group}</option>)}
            </select>
          </div>
          {selectedGroup && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Agent</span>
              <select
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="h-8 rounded-md border bg-background px-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="all">All agents in group</option>
                {selectedGroup.agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          )}
          <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {view.scope} · {view.tickets} tickets
          </span>
        </div>

        {/* KPI tiles with achieved/missed vs target */}
        <div className="grid gap-3 sm:grid-cols-3">
          <SlaKpiTile
            label="First response SLA %"
            actual={view.firstResponseSla}
            target={SLA_TARGETS.firstResponseSla}
          />
          <SlaKpiTile
            label="Resolution SLA %"
            actual={view.resolutionSla}
            target={SLA_TARGETS.resolutionSla}
          />
          <div className="rounded-xl border bg-card p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">SLA breached</p>
            <p className={cn('mt-1.5 text-3xl font-bold tabular-nums', view.breached === 0 ? 'text-emerald-600' : 'text-red-600')}>
              {view.breached}
            </p>
            <p className="mt-1.5 text-[10px] text-muted-foreground">
              {((view.breached / Math.max(1, view.tickets)) * 100).toFixed(1)}% of tickets
            </p>
          </div>
        </div>

        {/* Breakdown table */}
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 text-left text-muted-foreground">
              <tr className="border-b">
                <th className="px-3 py-2 font-semibold">{group === 'all' ? 'Group' : 'Agent'}</th>
                <th className="px-3 py-2 text-right font-semibold">Tickets</th>
                <th className="px-3 py-2 text-right font-semibold">First response SLA</th>
                <th className="px-3 py-2 text-right font-semibold">Resolution SLA</th>
                <th className="px-3 py-2 text-right font-semibold">Breached</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {group === 'all'
                ? GROUP_SLA.map((g) => (
                    <tr key={g.group} className="hover:bg-muted/30">
                      <td className="px-3 py-2.5 font-semibold">
                        <button type="button" onClick={() => handleSelectGroup(g.group)} className="hover:text-primary hover:underline">
                          {g.group}
                        </button>
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{g.totalTickets}</td>
                      <td className="px-3 py-2.5 text-right">
                        <span className={cn('font-semibold tabular-nums', slaTone(g.firstResponseSla))}>
                          {g.firstResponseSla.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <span className={cn('font-semibold tabular-nums', slaTone(g.resolutionSla))}>
                          {g.resolutionSla.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <Badge variant={g.breached === 0 ? 'default' : g.breached <= 5 ? 'warning' : 'danger'} className="text-[10px]">
                          {g.breached}
                        </Badge>
                      </td>
                    </tr>
                  ))
                : selectedGroup?.agents
                    .filter((a) => agentId === 'all' || a.id === agentId)
                    .map((a) => (
                      <tr key={a.id} className="hover:bg-muted/30">
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-blue-100 text-[9px] font-bold text-blue-700">{a.avatar}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{a.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-right tabular-nums">{a.tickets}</td>
                        <td className="px-3 py-2.5 text-right">
                          <span className={cn('font-semibold tabular-nums', slaTone(a.firstResponseSla))}>
                            {a.firstResponseSla.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <span className={cn('font-semibold tabular-nums', slaTone(a.resolutionSla))}>
                            {a.resolutionSla.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <Badge variant={a.breached === 0 ? 'default' : a.breached <= 3 ? 'warning' : 'danger'} className="text-[10px]">
                            {a.breached}
                          </Badge>
                        </td>
                      </tr>
                    ))}
            </tbody>
          </table>
        </div>
        {group !== 'all' && (
          <p className="text-[11px] text-muted-foreground">
            Showing {selectedGroup?.agents.filter((a) => agentId === 'all' || a.id === agentId).length ?? 0} agent(s) in {selectedGroup?.group}.
            <button type="button" onClick={() => { setGroup('all'); setAgentId('all'); }} className="ml-2 text-primary hover:underline">
              ← Back to all groups
            </button>
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function SlaKpiTile({ label, actual, target }: { label: string; actual: number; target: number }) {
  const achieved = actual >= target;
  const delta = actual - target;
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <span className={cn(
          'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide',
          achieved ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700',
        )}>
          {achieved ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
          {achieved ? 'Achieved' : 'Missed'}
        </span>
      </div>
      <p className={cn('mt-1.5 text-3xl font-bold tabular-nums', slaTone(actual))}>
        {actual.toFixed(1)}%
      </p>
      <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className={cn('h-full rounded-full transition-all', slaBg(actual))}
          style={{ width: `${actual}%` }} />
        {/* Target marker */}
        <div className="absolute top-0 bottom-0 w-px bg-foreground/40" style={{ left: `${target}%` }} />
      </div>
      <p className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>Target: <span className="font-semibold text-foreground">{target}%</span></span>
        <span className={achieved ? 'text-emerald-600' : 'text-red-600'}>
          {delta >= 0 ? '+' : ''}{delta.toFixed(1)} pts
        </span>
      </p>
    </div>
  );
}

// ─── SLA detail breakdown (drill-down by priority / channel / type) ──────────

interface SlaDimensionRow {
  label: string;
  tickets: number;
  firstResponseSla: number;
  resolutionSla: number;
}

const SLA_BY_PRIORITY: SlaDimensionRow[] = [
  { label: 'Urgent', tickets: 32,  firstResponseSla: 96.9, resolutionSla: 87.5 },
  { label: 'High',   tickets: 98,  firstResponseSla: 94.9, resolutionSla: 89.8 },
  { label: 'Medium', tickets: 168, firstResponseSla: 92.3, resolutionSla: 86.9 },
  { label: 'Low',    tickets: 84,  firstResponseSla: 88.1, resolutionSla: 81.0 },
];
const SLA_BY_CHANNEL: SlaDimensionRow[] = [
  { label: 'Email',     tickets: 165, firstResponseSla: 92.7, resolutionSla: 87.3 },
  { label: 'Web portal',tickets: 98,  firstResponseSla: 95.9, resolutionSla: 89.8 },
  { label: 'WhatsApp',  tickets: 54,  firstResponseSla: 90.7, resolutionSla: 83.3 },
  { label: 'Chat',      tickets: 41,  firstResponseSla: 97.6, resolutionSla: 92.7 },
  { label: 'Phone',     tickets: 24,  firstResponseSla: 100,  resolutionSla: 87.5 },
];
const SLA_BY_CATEGORY: SlaDimensionRow[] = [
  { label: 'Network / VPN',  tickets: 58, firstResponseSla: 93.1, resolutionSla: 84.5 },
  { label: 'Hardware',       tickets: 42, firstResponseSla: 90.5, resolutionSla: 81.0 },
  { label: 'Software',       tickets: 39, firstResponseSla: 94.9, resolutionSla: 89.7 },
  { label: 'Access Request', tickets: 34, firstResponseSla: 97.1, resolutionSla: 94.1 },
  { label: 'Security',       tickets: 28, firstResponseSla: 96.4, resolutionSla: 92.9 },
  { label: 'Email',          tickets: 22, firstResponseSla: 95.5, resolutionSla: 90.9 },
  { label: 'Other',          tickets: 39, firstResponseSla: 89.7, resolutionSla: 82.1 },
];

const SLA_TREND: { day: string; firstResponseSla: number; resolutionSla: number }[] = [
  { day: 'Apr 30', firstResponseSla: 88.5, resolutionSla: 82.0 },
  { day: 'May 03', firstResponseSla: 91.2, resolutionSla: 84.5 },
  { day: 'May 06', firstResponseSla: 90.0, resolutionSla: 83.8 },
  { day: 'May 09', firstResponseSla: 93.4, resolutionSla: 86.1 },
  { day: 'May 12', firstResponseSla: 94.7, resolutionSla: 88.2 },
  { day: 'May 15', firstResponseSla: 92.1, resolutionSla: 85.9 },
  { day: 'May 18', firstResponseSla: 95.3, resolutionSla: 89.7 },
  { day: 'May 21', firstResponseSla: 96.0, resolutionSla: 91.4 },
  { day: 'May 24', firstResponseSla: 93.8, resolutionSla: 87.5 },
  { day: 'May 27', firstResponseSla: 94.4, resolutionSla: 88.0 },
];

function SlaTrendChart() {
  const W = 700;
  const H = 180;
  const pad = { t: 16, r: 32, b: 28, l: 36 };
  const xs = W - pad.l - pad.r;
  const ys = H - pad.t - pad.b;
  const yMin = 75;
  const yMax = 100;
  const yRange = yMax - yMin;

  const ptsFor = (key: 'firstResponseSla' | 'resolutionSla') =>
    SLA_TREND.map((d, i) => ({
      x: pad.l + (i / (SLA_TREND.length - 1)) * xs,
      y: pad.t + (1 - (d[key] - yMin) / yRange) * ys,
    }));

  const frPts = ptsFor('firstResponseSla');
  const rsPts = ptsFor('resolutionSla');
  const path = (p: { x: number; y: number }[]) => p.map((q, i) => `${i === 0 ? 'M' : 'L'}${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' ');

  const targetY = (target: number) => pad.t + (1 - (target - yMin) / yRange) * ys;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* Y gridlines */}
      {[80, 85, 90, 95, 100].map((v) => {
        const y = pad.t + (1 - (v - yMin) / yRange) * ys;
        return (
          <g key={v}>
            <line x1={pad.l} y1={y} x2={pad.l + xs} y2={y} stroke="currentColor" strokeOpacity={0.08} />
            <text x={pad.l - 6} y={y + 3} textAnchor="end" fontSize={8} fill="currentColor" opacity={0.5}>{v}%</text>
          </g>
        );
      })}
      {/* Target lines */}
      <g>
        <line x1={pad.l} y1={targetY(SLA_TARGETS.firstResponseSla)} x2={pad.l + xs} y2={targetY(SLA_TARGETS.firstResponseSla)}
          stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
        <text x={pad.l + xs + 2} y={targetY(SLA_TARGETS.firstResponseSla) + 3} fontSize={7} fill="#2563eb">FRT {SLA_TARGETS.firstResponseSla}%</text>
        <line x1={pad.l} y1={targetY(SLA_TARGETS.resolutionSla)} x2={pad.l + xs} y2={targetY(SLA_TARGETS.resolutionSla)}
          stroke="#7c3aed" strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
        <text x={pad.l + xs + 2} y={targetY(SLA_TARGETS.resolutionSla) + 3} fontSize={7} fill="#7c3aed">RST {SLA_TARGETS.resolutionSla}%</text>
      </g>
      {/* Lines */}
      <path d={path(frPts)} fill="none" stroke="#2563eb" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d={path(rsPts)} fill="none" stroke="#7c3aed" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots + x labels */}
      {SLA_TREND.map((d, i) => {
        const fr = frPts[i]!;
        const rs = rsPts[i]!;
        return (
          <g key={d.day}>
            <circle cx={fr.x} cy={fr.y} r={3} fill="#2563eb" stroke="#fff" strokeWidth={1.5} />
            <circle cx={rs.x} cy={rs.y} r={3} fill="#7c3aed" stroke="#fff" strokeWidth={1.5} />
            <text x={fr.x} y={H - 4} textAnchor="middle" fontSize={7} fill="currentColor" opacity={0.5}>{d.day}</text>
          </g>
        );
      })}
    </svg>
  );
}

function SlaDetailSection() {
  const [dim, setDim] = useState<'priority' | 'channel' | 'category'>('priority');
  const rows =
    dim === 'priority' ? SLA_BY_PRIORITY :
    dim === 'channel'  ? SLA_BY_CHANNEL :
                         SLA_BY_CATEGORY;
  const dimLabel = dim === 'priority' ? 'Priority' : dim === 'channel' ? 'Channel' : 'Category';

  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-coral" />
            <CardTitle className="text-sm font-semibold">SLA detail breakdown</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="h-2 w-3 rounded bg-blue-600" /> First response
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="h-2 w-3 rounded bg-violet-600" /> Resolution
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        {/* Trend chart */}
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">SLA % trend — last 30 days</p>
          <div className="text-foreground/70">
            <SlaTrendChart />
          </div>
        </div>

        {/* Dimension selector */}
        <div className="flex items-center gap-2 border-t pt-3">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground">Break down by</span>
          <div className="flex rounded-lg border p-0.5 text-xs">
            {(['priority', 'channel', 'category'] as const).map((d) => (
              <button key={d} type="button" onClick={() => setDim(d)}
                className={cn('rounded-md px-2.5 py-1 font-medium capitalize transition-colors',
                  dim === d ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground')}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Breakdown table */}
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 text-left text-muted-foreground">
              <tr className="border-b">
                <th className="px-3 py-2 font-semibold">{dimLabel}</th>
                <th className="px-3 py-2 text-right font-semibold">Tickets</th>
                <th className="px-3 py-2 font-semibold">First response SLA</th>
                <th className="px-3 py-2 font-semibold">Resolution SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((r) => (
                <tr key={r.label} className="hover:bg-muted/30">
                  <td className="px-3 py-2 font-medium">{r.label}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.tickets}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div className={cn('h-full', slaBg(r.firstResponseSla))} style={{ width: `${r.firstResponseSla}%` }} />
                      </div>
                      <span className={cn('w-12 text-right font-semibold tabular-nums', slaTone(r.firstResponseSla))}>
                        {r.firstResponseSla.toFixed(1)}%
                      </span>
                      {r.firstResponseSla >= SLA_TARGETS.firstResponseSla
                        ? <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        : <AlertTriangle className="h-3 w-3 text-red-600" />}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div className={cn('h-full', slaBg(r.resolutionSla))} style={{ width: `${r.resolutionSla}%` }} />
                      </div>
                      <span className={cn('w-12 text-right font-semibold tabular-nums', slaTone(r.resolutionSla))}>
                        {r.resolutionSla.toFixed(1)}%
                      </span>
                      {r.resolutionSla >= SLA_TARGETS.resolutionSla
                        ? <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        : <AlertTriangle className="h-3 w-3 text-red-600" />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Tickets by Category donut + insights ────────────────────────────────────

interface CategorySlice {
  label: string;
  count: number;
  color: string;
}

const CATEGORY_PALETTE = ['#2563eb', '#7c3aed', '#0891b2', '#059669', '#d97706', '#dc2626', '#475569'];

function TicketCategoryDonut() {
  const [dim, setDim] = useState<'category' | 'priority' | 'channel' | 'status'>('category');

  const data: CategorySlice[] = useMemo(() => {
    if (dim === 'category') {
      return [
        { label: 'Network / VPN',  count: 58, color: CATEGORY_PALETTE[0]! },
        { label: 'Hardware',       count: 42, color: CATEGORY_PALETTE[1]! },
        { label: 'Software',       count: 39, color: CATEGORY_PALETTE[2]! },
        { label: 'Access Request', count: 34, color: CATEGORY_PALETTE[3]! },
        { label: 'Security',       count: 28, color: CATEGORY_PALETTE[4]! },
        { label: 'Email',          count: 22, color: CATEGORY_PALETTE[5]! },
        { label: 'Other',          count: 39, color: CATEGORY_PALETTE[6]! },
      ];
    }
    if (dim === 'priority') {
      return [
        { label: 'Urgent', count: 32,  color: '#dc2626' },
        { label: 'High',   count: 98,  color: '#d97706' },
        { label: 'Medium', count: 168, color: '#2563eb' },
        { label: 'Low',    count: 84,  color: '#64748b' },
      ];
    }
    if (dim === 'channel') {
      return [
        { label: 'Email',     count: 165, color: '#2563eb' },
        { label: 'Portal',    count: 98,  color: '#7c3aed' },
        { label: 'WhatsApp',  count: 54,  color: '#059669' },
        { label: 'Chat',      count: 41,  color: '#0891b2' },
        { label: 'Phone',     count: 24,  color: '#d97706' },
      ];
    }
    return [
      { label: 'Open',        count: 84,  color: '#2563eb' },
      { label: 'Pending',     count: 41,  color: '#d97706' },
      { label: 'Resolved',    count: 198, color: '#059669' },
      { label: 'Closed',      count: 59,  color: '#64748b' },
    ];
  }, [dim]);

  const total = data.reduce((s, d) => s + d.count, 0);
  const cx = 100, cy = 100, rOuter = 90, rInner = 56;
  let angle = -Math.PI / 2;
  const arcs = data.map((d) => {
    const pct = d.count / total;
    const start = angle;
    const end = angle + pct * Math.PI * 2;
    angle = end;
    const large = end - start > Math.PI ? 1 : 0;
    const x1o = cx + rOuter * Math.cos(start);
    const y1o = cy + rOuter * Math.sin(start);
    const x2o = cx + rOuter * Math.cos(end);
    const y2o = cy + rOuter * Math.sin(end);
    const x1i = cx + rInner * Math.cos(end);
    const y1i = cy + rInner * Math.sin(end);
    const x2i = cx + rInner * Math.cos(start);
    const y2i = cy + rInner * Math.sin(start);
    const path = `M${x1o},${y1o} A${rOuter},${rOuter} 0 ${large} 1 ${x2o},${y2o} L${x1i},${y1i} A${rInner},${rInner} 0 ${large} 0 ${x2i},${y2i} Z`;
    return { d, pct, path };
  });

  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <PieChart className="h-4 w-4 text-coral" />
            <CardTitle className="text-sm font-semibold">Tickets by {dim}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">Group by</span>
            <select
              value={dim}
              onChange={(e) => setDim(e.target.value as typeof dim)}
              className="h-7 rounded-md border bg-background px-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="category">Category</option>
              <option value="priority">Priority</option>
              <option value="channel">Channel / Source</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="grid items-center gap-6 sm:grid-cols-2">
          <div className="relative mx-auto">
            <svg viewBox="0 0 200 200" className="h-56 w-56">
              {arcs.map((a, i) => (
                <path
                  key={i}
                  d={a.path}
                  fill={a.d.color}
                  stroke="#fff"
                  strokeWidth={1.5}
                  aria-label={`${a.d.label}: ${a.d.count} (${(a.pct * 100).toFixed(1)}%)`}
                >
                  <title>{`${a.d.label}: ${a.d.count} (${(a.pct * 100).toFixed(1)}%)`}</title>
                </path>
              ))}
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total</p>
              <p className="font-display text-2xl font-bold tabular-nums">{total}</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs">
            {data
              .slice()
              .sort((a, b) => b.count - a.count)
              .map((d) => {
                const pct = (d.count / total) * 100;
                return (
                  <li key={d.label} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: d.color }} />
                    <span className="min-w-0 flex-1 truncate font-medium">{d.label}</span>
                    <span className="tabular-nums text-muted-foreground">{d.count}</span>
                    <span className="w-12 text-right font-semibold tabular-nums">{pct.toFixed(1)}%</span>
                  </li>
                );
              })}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Preset = '7d' | '30d' | '90d' | 'today' | 'yesterday' | 'this-week' | 'last-week' | 'this-month' | 'last-month' | 'qtd' | 'ytd' | 'custom';

/** Compute a [from, to] ISO date pair for any preset. `to` is inclusive end-of-day. */
function rangeFor(preset: Preset, customFrom?: string, customTo?: string): { from: Date; to: Date; label: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const endOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

  switch (preset) {
    case '7d':         return { from: startOf(new Date(today.getTime() - 6  * 864e5)), to: endOf(today), label: 'Last 7 days' };
    case '30d':        return { from: startOf(new Date(today.getTime() - 29 * 864e5)), to: endOf(today), label: 'Last 30 days' };
    case '90d':        return { from: startOf(new Date(today.getTime() - 89 * 864e5)), to: endOf(today), label: 'Last 90 days' };
    case 'today':      return { from: startOf(today), to: endOf(today), label: 'Today' };
    case 'yesterday':  {
      const y = new Date(today.getTime() - 864e5);
      return { from: startOf(y), to: endOf(y), label: 'Yesterday' };
    }
    case 'this-week':  {
      const dow = (today.getDay() + 6) % 7; // Monday = 0
      const monday = new Date(today.getTime() - dow * 864e5);
      return { from: startOf(monday), to: endOf(today), label: 'This week (Mon–today)' };
    }
    case 'last-week':  {
      const dow = (today.getDay() + 6) % 7;
      const lastMon = new Date(today.getTime() - (dow + 7) * 864e5);
      const lastSun = new Date(lastMon.getTime() + 6 * 864e5);
      return { from: startOf(lastMon), to: endOf(lastSun), label: 'Last week' };
    }
    case 'this-month': return { from: new Date(today.getFullYear(), today.getMonth(), 1), to: endOf(today), label: 'This month' };
    case 'last-month': {
      const first = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const last  = new Date(today.getFullYear(), today.getMonth(),     0, 23, 59, 59, 999);
      return { from: first, to: last, label: 'Last month' };
    }
    case 'qtd': {
      const q = Math.floor(today.getMonth() / 3);
      return { from: new Date(today.getFullYear(), q * 3, 1), to: endOf(today), label: 'Quarter-to-date' };
    }
    case 'ytd':        return { from: new Date(today.getFullYear(), 0, 1), to: endOf(today), label: 'Year-to-date' };
    case 'custom': {
      const from = customFrom ? new Date(customFrom + 'T00:00:00') : startOf(today);
      const to   = customTo   ? new Date(customTo   + 'T23:59:59') : endOf(today);
      return { from, to, label: `${formatDate(from)} – ${formatDate(to)}` };
    }
  }
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
function toInputValue(d: Date) {
  // YYYY-MM-DD for <input type="date">
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function ReportsPage() {
  const [preset, setPreset] = useState<Preset>('30d');
  const [customFrom, setCustomFrom] = useState<string>(toInputValue(new Date(Date.now() - 29 * 864e5)));
  const [customTo,   setCustomTo]   = useState<string>(toInputValue(new Date()));
  const [pickerOpen, setPickerOpen] = useState(false);

  const range = useMemo(() => rangeFor(preset, customFrom, customTo), [preset, customFrom, customTo]);
  const daysInRange = Math.max(1, Math.round((range.to.getTime() - range.from.getTime()) / 864e5));

  const summary = useReportSummary();
  const volume = useTicketVolume();
  const agents = useAgentStats();
  const categories = useCategorySummary();
  const channels = useChannelSummary();

  const s = summary.data;
  const maxCat = Math.max(...(categories.data?.map((c) => c.count) ?? [1]));
  const maxCh = Math.max(...(channels.data?.map((c) => c.count) ?? [1]));

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      {/* ── Fixed header ── */}
      <div className="shrink-0 p-5 pb-0">
      <header className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
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
              Insights
            </p>
            <h1 className="font-display mt-0.5 text-2xl font-bold tracking-tight text-white">
              Reports &amp; Analytics
            </h1>
            <p className="mt-0.5 text-sm text-white/70">
              <span className="font-medium text-white">{range.label}</span>
              <span className="mx-1.5 opacity-50">·</span>
              {formatDate(range.from)} → {formatDate(range.to)}
              <span className="mx-1.5 opacity-50">·</span>
              {daysInRange} day{daysInRange === 1 ? '' : 's'}
              <span className="mx-1.5 opacity-50">·</span>
              {s ? s.totalCreated : '—'} tickets
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Quick preset toggle */}
            <div className="flex rounded-lg border border-white/20 bg-white/10 p-0.5">
              {(['7d', '30d', '90d'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => { setPreset(p); setPickerOpen(false); }}
                  className={cn(
                    'rounded-md px-3 py-1 text-xs font-semibold transition-all',
                    preset === p
                      ? 'bg-coral text-white shadow-sm'
                      : 'text-white/70 hover:text-white',
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPickerOpen((o) => !o)}
                className={cn(
                  'inline-flex items-center gap-1 rounded-md px-3 py-1 text-xs font-semibold transition-all',
                  preset !== '7d' && preset !== '30d' && preset !== '90d'
                    ? 'bg-coral text-white shadow-sm'
                    : 'text-white/70 hover:text-white',
                )}
                title="Choose any date range"
              >
                <CalendarDays className="h-3 w-3" />
                Custom
              </button>
            </div>
            <Button
              size="sm"
              className="border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              variant="outline"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export CSV
            </Button>
          </div>
        </div>
      </header>

      {/* Custom date-range picker — drops down under the header */}
      {pickerOpen && (
        <div className="relative -mt-2 rounded-xl border border-border/70 bg-card p-4 shadow-md">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Quick presets
              </p>
              <div className="flex flex-wrap gap-1.5">
                {([
                  { k: 'today',      label: 'Today' },
                  { k: 'yesterday',  label: 'Yesterday' },
                  { k: 'this-week',  label: 'This week' },
                  { k: 'last-week',  label: 'Last week' },
                  { k: 'this-month', label: 'This month' },
                  { k: 'last-month', label: 'Last month' },
                  { k: 'qtd',        label: 'Quarter-to-date' },
                  { k: 'ytd',        label: 'Year-to-date' },
                  { k: '7d',         label: 'Last 7 days' },
                  { k: '30d',        label: 'Last 30 days' },
                  { k: '90d',        label: 'Last 90 days' },
                ] as { k: Preset; label: string }[]).map((p) => (
                  <button
                    key={p.k}
                    onClick={() => {
                      setPreset(p.k);
                      // Sync the date inputs so the user sees what range got picked
                      const r = rangeFor(p.k);
                      setCustomFrom(toInputValue(r.from));
                      setCustomTo(toInputValue(r.to));
                    }}
                    className={cn(
                      'rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors',
                      preset === p.k
                        ? 'border-coral bg-coral/10 text-coral-dark'
                        : 'border-border bg-background text-foreground hover:bg-muted/40',
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  From
                </label>
                <input
                  type="date"
                  value={customFrom}
                  max={customTo}
                  onChange={(e) => { setCustomFrom(e.target.value); setPreset('custom'); }}
                  className="mt-1 h-9 rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  To
                </label>
                <input
                  type="date"
                  value={customTo}
                  min={customFrom}
                  max={toInputValue(new Date())}
                  onChange={(e) => { setCustomTo(e.target.value); setPreset('custom'); }}
                  className="mt-1 h-9 rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <Button size="sm" className="bg-coral text-white hover:bg-coral-dark" onClick={() => setPickerOpen(false)}>
                Apply
              </Button>
            </div>
          </div>

          <p className="mt-3 text-[11px] text-muted-foreground">
            Showing data for <span className="font-semibold text-foreground">{range.label}</span> —{' '}
            {formatDate(range.from)} to {formatDate(range.to)} ({daysInRange} day{daysInRange === 1 ? '' : 's'}).
            All KPIs, charts and tables below recalculate automatically.
          </p>
        </div>
      )}
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 min-h-0 space-y-5 overflow-y-auto p-5">

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summary.isPending ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <Skeleton className="mb-3 h-4 w-24" />
                <Skeleton className="h-7 w-16" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <KpiCard label="Tickets created" value={s?.totalCreated ?? 0} icon={BarChart3} sub="This period" trend="up" />
            <KpiCard label="Avg first response" value={`${s?.avgFirstResponseMin ?? 0}m`} icon={Clock} sub="Target: 30 min" trend="up" />
            <KpiCard label="Resolution rate" value={`${s?.resolutionRate ?? 0}%`} icon={CheckCircle2} sub={`${s?.totalResolved ?? 0} resolved`} trend="up" />
            <KpiCard label="SLA compliance" value={`${s?.slaComplianceRate ?? 0}%`} icon={ShieldCheck} sub="vs 90% target" trend="up" />
          </>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* ── Volume chart ── */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm font-semibold">
              <span>Ticket volume — last 14 days</span>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-4 rounded bg-blue-500/30" /> Created
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-4 rounded bg-blue-600" /> Resolved
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {volume.isPending ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <>
                <VolumeChart data={volume.data ?? []} />
                <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                  <span>{volume.data?.at(-14)?.label}</span>
                  <span>{volume.data?.at(-1)?.label}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* ── CSAT score summary ── */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">CSAT overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {summary.isPending ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-4xl font-bold text-foreground">{s?.csatScore.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">out of 5.0</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {[5, 4, 3, 2, 1].map((r) => (
                      <div key={r} className="flex items-center gap-2">
                        <span className="w-3 text-right text-xs text-muted-foreground">{r}</span>
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted/50">
                          <div
                            className="h-full rounded-full bg-blue-500"
                            style={{ width: `${r === 5 ? 60 : r === 4 ? 24 : r === 3 ? 10 : r === 2 ? 4 : 2}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted/40 p-3">
                  <Star className="h-4 w-4 shrink-0 text-amber-500" />
                  <p className="text-xs text-muted-foreground">
                    Based on <span className="font-semibold text-foreground">{s?.csatSampleSize ?? 0}</span> survey responses (68% response rate)
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* ── Category breakdown ── */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Tickets by category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-0">
            {categories.isPending
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)
              : categories.data?.map((c) => (
                  <BarRow key={c.category} label={c.category} value={c.count} max={maxCat} color="bg-blue-500" />
                ))}
          </CardContent>
        </Card>

        {/* ── Channel breakdown ── */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Tickets by channel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-0">
            {channels.isPending
              ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)
              : channels.data?.map((c) => (
                  <BarRow key={c.channel} label={c.channel} value={c.count} max={maxCh} color="bg-indigo-500" />
                ))}
          </CardContent>
        </Card>
      </div>

      {/* ── SLA by group + per-agent filter (Freshdesk-style) ── */}
      <SlaByGroupSection />

      {/* ── SLA detail breakdown: trend chart + by priority/channel/category ── */}
      <SlaDetailSection />

      {/* ── Tickets by Category donut (configurable group-by) ── */}
      <TicketCategoryDonut />

      {/* ── Agent leaderboard ── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Agent performance</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-[#F4EFE6] shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
                <tr className="border-b border-border/60">
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-muted-foreground">#</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Agent</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground">Resolved</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground">Avg first resp.</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground">Avg resolution</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground">CSAT</th>
                  <th className="px-3 pr-5 py-2.5 text-right text-xs font-semibold text-muted-foreground">SLA breached</th>
                </tr>
              </thead>
              <tbody>
                {agents.isPending
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-border/40">
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="px-3 py-3">
                            <Skeleton className="h-4 w-16" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : agents.data?.map((a, idx) => (
                      <tr key={a.id} className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-3 text-xs font-bold text-muted-foreground">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="bg-blue-100 text-[10px] font-bold text-blue-700">
                                {a.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium text-foreground">{a.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right text-xs font-semibold text-foreground">{a.resolved}</td>
                        <td className="px-3 py-3 text-right text-xs text-muted-foreground">{a.avgFirstResponseMin}m</td>
                        <td className="px-3 py-3 text-right text-xs text-muted-foreground">{a.avgResolutionHours}h</td>
                        <td className="px-3 py-3 text-right">
                          <span className={cn('text-xs font-semibold', a.csatScore >= 4.5 ? 'text-emerald-600' : a.csatScore >= 4 ? 'text-amber-600' : 'text-red-600')}>
                            {a.csatScore.toFixed(1)} ★
                          </span>
                        </td>
                        <td className="px-3 pr-5 py-3 text-right">
                          <Badge variant={a.slaBreached === 0 ? 'default' : a.slaBreached <= 2 ? 'warning' : 'danger'} className="text-[10px]">
                            {a.slaBreached}
                          </Badge>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
