'use client';

import { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  Star,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const summary = useReportSummary();
  const volume = useTicketVolume();
  const agents = useAgentStats();
  const categories = useCategorySummary();
  const channels = useChannelSummary();

  const s = summary.data;
  const maxCat = Math.max(...(categories.data?.map((c) => c.count) ?? [1]));
  const maxCh = Math.max(...(channels.data?.map((c) => c.count) ?? [1]));

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
              Insights
            </p>
            <h1 className="font-display mt-0.5 text-2xl font-bold tracking-tight text-white">
              Reports &amp; Analytics
            </h1>
            <p className="mt-0.5 text-sm text-white/70">
              {s ? s.periodLabel : 'Loading…'} · {s ? s.totalCreated : '—'} tickets created
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-white/20 bg-white/10 p-0.5">
              {(['7d', '30d', '90d'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={cn(
                    'rounded-md px-3 py-1 text-xs font-semibold transition-all',
                    period === p
                      ? 'bg-coral text-white shadow-sm'
                      : 'text-white/70 hover:text-white',
                  )}
                >
                  {p}
                </button>
              ))}
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
      </div>

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

      {/* ── Agent leaderboard ── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Agent performance</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
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
  );
}
