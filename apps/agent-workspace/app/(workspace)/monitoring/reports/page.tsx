'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  BarChart3,
  Download,
  TrendingDown,
  TrendingUp,
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
import { useDevices, useUptimeTrend } from '@/lib/queries';

// ─── Uptime trend chart ───────────────────────────────────────────────────────

function UptimeTrendChart({ data }: { data: { day: string; uptime: number; events: number }[] }) {
  const W = 680;
  const H = 100;
  const pad = { t: 8, r: 12, b: 24, l: 44 };
  const xs = W - pad.l - pad.r;
  const ys = H - pad.t - pad.b;

  const yMin = 94;
  const yMax = 100;
  const yRange = yMax - yMin;

  const pts = data.map((d, i) => ({
    x: pad.l + (i / (data.length - 1)) * xs,
    y: pad.t + (1 - (d.uptime - yMin) / yRange) * ys,
    ...d,
  }));

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaD = `${pathD} L${pts[pts.length - 1]!.x.toFixed(1)},${(pad.t + ys).toFixed(1)} L${pts[0]!.x.toFixed(1)},${(pad.t + ys).toFixed(1)} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full text-primary">
      <defs>
        <linearGradient id="rpt-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity={0.2} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Y gridlines */}
      {[94, 96, 98, 100].map((v) => {
        const y = pad.t + (1 - (v - yMin) / yRange) * ys;
        return (
          <g key={v}>
            <line x1={pad.l} y1={y} x2={pad.l + xs} y2={y} stroke="currentColor" strokeOpacity={0.08} strokeWidth={1} />
            <text x={pad.l - 4} y={y + 3} textAnchor="end" fontSize={8} fill="currentColor" opacity={0.5}>{v}%</text>
          </g>
        );
      })}

      {/* 99.9% SLA line */}
      {(() => {
        const y = pad.t + (1 - (99.9 - yMin) / yRange) * ys;
        return (
          <g>
            <line x1={pad.l} y1={y} x2={pad.l + xs} y2={y} stroke="#f59e0b" strokeWidth={1} strokeDasharray="5 3" />
            <text x={pad.l + xs + 3} y={y + 3} fontSize={7} fill="#f59e0b">99.9</text>
          </g>
        );
      })()}

      {/* Area */}
      <path d={areaD} fill="url(#rpt-area)" />

      {/* Line */}
      <path d={pathD} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

      {/* Data points + X labels */}
      {pts.map((p) => (
        <g key={p.day}>
          <circle
            cx={p.x} cy={p.y} r={4}
            fill={p.events > 0 ? '#ef4444' : 'currentColor'}
            stroke="#fff" strokeWidth={1.5}
          />
          <text x={p.x} y={H - 4} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.5}>{p.day}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Period = '7d' | '30d' | '90d';

function uptimeColor(pct: number) {
  return pct >= 99.5 ? 'text-emerald-600' : pct >= 98 ? 'text-amber-600' : 'text-red-600';
}

function uptimeBg(pct: number) {
  const p = Math.max(0, Math.min(100, pct));
  return (
    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={cn('h-full rounded-full', pct >= 99.5 ? 'bg-emerald-500' : pct >= 98 ? 'bg-amber-500' : 'bg-red-500')}
        style={{ width: `${p}%` }}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const devices = useDevices();
  const trend   = useUptimeTrend();
  const [period, setPeriod] = useState<Period>('30d');
  const [siteFilter, setSiteFilter] = useState<string>('all');

  const sites = useMemo(
    () => ['all', ...Array.from(new Set((devices.data ?? []).map((d) => d.site)))],
    [devices.data],
  );

  const rows = useMemo(() => {
    let list = devices.data ?? [];
    if (siteFilter !== 'all') list = list.filter((d) => d.site === siteFilter);
    return [...list].sort((a, b) => a.uptimePct - b.uptimePct);
  }, [devices.data, siteFilter]);

  const summary = useMemo(() => {
    const list = devices.data ?? [];
    const avg = list.length ? list.reduce((s, d) => s + d.uptimePct, 0) / list.length : 0;
    const below99 = list.filter((d) => d.uptimePct < 99).length;
    const below95 = list.filter((d) => d.uptimePct < 95).length;
    return { avg, below99, below95 };
  }, [devices.data]);

  return (
    <div className="space-y-5 p-5">
      {/* Gradient header */}
      <div className="relative overflow-hidden rounded-2xl bg-navy px-6 py-5 shadow-lg shadow-navy/15">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Monitoring</p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">Availability Reports</h1>
            <p className="mt-0.5 text-sm text-white/70">Uptime statistics per device and site</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
              <Download className="h-3 w-3" />Export CSV
            </Button>
            <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" asChild>
              <Link href="/monitoring"><ArrowUpRight className="h-3 w-3" />NOC Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          {
            label: 'Avg uptime (30d)',
            value: `${summary.avg.toFixed(2)}%`,
            icon: <BarChart3 className="h-4 w-4" />,
            color: uptimeColor(summary.avg),
            sub: summary.avg >= 99 ? 'Above SLA target' : 'Below 99% SLA',
          },
          {
            label: 'Devices below 99%',
            value: summary.below99,
            icon: <TrendingDown className="h-4 w-4" />,
            color: summary.below99 > 0 ? 'text-amber-600' : 'text-emerald-600',
            sub: 'In 30-day window',
          },
          {
            label: 'Devices below 95%',
            value: summary.below95,
            icon: <TrendingUp className="h-4 w-4" />,
            color: summary.below95 > 0 ? 'text-red-600' : 'text-emerald-600',
            sub: 'Severely degraded',
          },
        ].map((t) => (
          <div key={t.label} className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{t.label}</p>
              <span className={cn('opacity-40', t.color)}>{t.icon}</span>
            </div>
            <p className={cn('mt-1.5 text-2xl font-bold tabular-nums', t.color)}>{t.value}</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">{t.sub}</p>
          </div>
        ))}
      </div>

      {/* Trend chart */}
      <Card>
        <CardHeader className="border-b py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Fleet uptime trend (7-day rolling)</CardTitle>
            <span className="text-[10px] text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-1" />red = incident day
            </span>
          </div>
        </CardHeader>
        <CardContent className="py-4">
          {trend.isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : trend.data ? (
            <UptimeTrendChart data={(trend.data as { day: string; upPct: number; events: number }[]).map((d) => ({ day: d.day, uptime: d.upPct, events: d.events }))} />
          ) : null}
        </CardContent>
      </Card>

      {/* Per-device table */}
      <Card>
        <CardHeader className="border-b py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-sm">Device uptime ({period})</CardTitle>
            <div className="flex items-center gap-3">
              {/* Period selector */}
              <div className="flex rounded-lg border p-0.5 text-xs">
                {(['7d', '30d', '90d'] as Period[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriod(p)}
                    className={cn(
                      'rounded-md px-2.5 py-1 font-medium transition-colors',
                      period === p ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              {/* Site filter */}
              <select
                value={siteFilter}
                onChange={(e) => setSiteFilter(e.target.value)}
                className="h-8 rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {sites.map((s) => <option key={s} value={s}>{s === 'all' ? 'All sites' : s}</option>)}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {devices.isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                    <th className="px-4 py-2.5 font-semibold">Device</th>
                    <th className="px-3 py-2.5 font-semibold">Site</th>
                    <th className="px-3 py-2.5 font-semibold">Type</th>
                    <th className="px-3 py-2.5 font-semibold">Status</th>
                    <th className="px-3 py-2.5 font-semibold">Uptime (30d)</th>
                    <th className="px-3 py-2.5 w-40 font-semibold">Chart</th>
                    <th className="px-3 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((d) => {
                    const TYPE_LABELS: Record<string, string> = {
                      server: 'Server', switch: 'Switch', router: 'Router', firewall: 'Firewall',
                      access_point: 'AP', nvr: 'NVR', printer: 'Printer', ups: 'UPS',
                    };
                    return (
                      <tr key={d.id} className="transition-colors hover:bg-muted/40">
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground">{d.name}</p>
                          <p className="text-muted-foreground">{d.vendor} {d.model}</p>
                        </td>
                        <td className="px-3 py-3 text-muted-foreground">{d.site}</td>
                        <td className="px-3 py-3 text-muted-foreground">{TYPE_LABELS[d.type] ?? d.type}</td>
                        <td className="px-3 py-3">
                          <Badge
                            variant={d.status === 'up' ? 'success' : d.status === 'down' ? 'danger' : 'warning'}
                            className="text-[10px]"
                          >
                            {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-3 py-3">
                          <div className="space-y-1">
                            <span className={cn('font-bold tabular-nums', uptimeColor(d.uptimePct))}>
                              {d.uptimePct.toFixed(2)}%
                            </span>
                            {uptimeBg(d.uptimePct)}
                          </div>
                        </td>
                        <td className="px-3 py-3 w-40">
                          {(() => {
                            const ping = d.sensors.find((s) => s.type === 'ping');
                            if (!ping) return <span className="text-muted-foreground">—</span>;
                            const pts = [...ping.sparkline];
                            const max = Math.max(...pts) || 1;
                            return (
                              <svg viewBox={`0 0 72 16`} className={cn('w-full', uptimeColor(d.uptimePct))}>
                                {pts.map((v, i) => {
                                  const barH = Math.max(2, (v / max) * 14);
                                  return (
                                    <rect
                                      key={i}
                                      x={i * 6 + 1}
                                      y={16 - barH}
                                      width={4}
                                      height={barH}
                                      rx={1}
                                      fill="currentColor"
                                      opacity={0.7}
                                    />
                                  );
                                })}
                              </svg>
                            );
                          })()}
                        </td>
                        <td className="px-3 py-3">
                          <Button size="sm" variant="outline" className="h-7 px-2 text-[11px]" asChild>
                            <Link href={`/monitoring/devices/${d.id}`}>Detail</Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="border-t bg-muted/20 px-4 py-2.5">
            <p className="text-xs text-muted-foreground">
              Showing {rows.length} devices · SLA target: 99.9% · <span className="font-medium text-amber-600">amber &lt;99%</span> · <span className="font-medium text-red-600">red &lt;95%</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
