'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Filter,
  Globe2,
  Headset,
  LineChart,
  Server,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
} from '@topiadesk/ui';

// ─── Mock data ───────────────────────────────────────────────────────────────

type Period = '7d' | '30d' | '90d' | '12m';

const KPI = {
  mrr:          { value: 142_870, delta: +12.4, sub: 'vs last month' },
  arr:          { value: 1_714_440, delta: +12.4, sub: 'annualised' },
  newMrr:       { value: 18_944, delta: +24.1, sub: 'this month' },
  churnedMrr:   { value: 4_211, delta: -8.2, sub: 'churn' },
  activeTenants:{ value: 142, delta: +6, sub: 'across 14 countries' },
  paying:       { value: 118, delta: +9, sub: '83% conversion' },
  trial:        { value: 24, delta: +4, sub: '8d avg trial' },
  churned30d:   { value: 5, delta: -2, sub: 'past month' },
  csat:         { value: 4.6, delta: +0.1, sub: '213 surveys' },
  avgResponse:  { value: '12m', delta: -8, sub: 'first reply' },
  totalUsers:   { value: 4_281, delta: +312, sub: 'agents + admins' },
  apiCalls:     { value: '24.8M', delta: +18, sub: 'last 30 days' },
} as const;

const MRR_TREND = [
  { month: 'Jan', mrr: 89_000,  new: 8_200,  churn: 1_800 },
  { month: 'Feb', mrr: 96_500,  new: 9_100,  churn: 1_600 },
  { month: 'Mar', mrr: 104_200, new: 9_400,  churn: 1_700 },
  { month: 'Apr', mrr: 112_800, new: 10_200, churn: 1_600 },
  { month: 'May', mrr: 121_100, new: 9_800,  churn: 1_500 },
  { month: 'Jun', mrr: 130_400, new: 11_200, churn: 1_900 },
  { month: 'Jul', mrr: 138_900, new: 10_800, churn: 2_300 },
  { month: 'Aug', mrr: 142_870, new: 18_944, churn: 4_211 },
];

const PLAN_BREAKDOWN = [
  { plan: 'Enterprise', tenants: 24, mrr: 95_976, share: 67.2, color: 'bg-coral'      },
  { plan: 'Business',   tenants: 56, mrr: 33_544, share: 23.5, color: 'bg-blue-500'   },
  { plan: 'Starter',    tenants: 38, mrr: 13_350, share:  9.3, color: 'bg-emerald-500'},
];

const REGION_BREAKDOWN = [
  { region: 'Nigeria',      tenants: 48, mrr: 49_870, growth: +24.1, flag: '🇳🇬' },
  { region: 'South Africa', tenants: 27, mrr: 34_120, growth: +18.7, flag: '🇿🇦' },
  { region: 'Kenya',        tenants: 22, mrr: 22_440, growth: +11.2, flag: '🇰🇪' },
  { region: 'Egypt',        tenants: 15, mrr: 14_120, growth:  +9.4, flag: '🇪🇬' },
  { region: 'Ghana',        tenants:  9, mrr:  8_120, growth:  +6.1, flag: '🇬🇭' },
  { region: 'Tanzania',     tenants:  7, mrr:  6_700, growth: +14.2, flag: '🇹🇿' },
  { region: 'Senegal',      tenants:  5, mrr:  4_500, growth: +21.0, flag: '🇸🇳' },
  { region: 'Uganda',       tenants:  5, mrr:  2_000, growth:  +3.4, flag: '🇺🇬' },
  { region: 'Other',        tenants:  4, mrr:  1_000, growth:  -2.1, flag: '🌍' },
];

const FUNNEL = [
  { stage: 'Marketing visits',  count: 48_200, conv: 100 },
  { stage: 'Trial signups',     count:  1_847, conv: 3.8 },
  { stage: 'Active during trial',count:    921, conv: 49.9 },
  { stage: 'Converted to paid', count:    412, conv: 44.7 },
  { stage: 'Retained 90+ days', count:    348, conv: 84.5 },
];

const TOP_TENANTS = [
  { name: 'AcmeBank Nigeria',   mrr: 2_398, plan: 'enterprise', growth: 'stable' },
  { name: 'KasiPay',            mrr: 1_199, plan: 'enterprise', growth: 'up' },
  { name: 'Dar Port Authority', mrr: 1_083, plan: 'enterprise', growth: 'up' },
  { name: 'SafariHold',         mrr:   374, plan: 'business',   growth: 'down' },
  { name: 'FlairTech Solutions',mrr:   499, plan: 'business',   growth: 'stable' },
];

const COHORTS = [
  { cohort: 'Jan 2026', size: 24, m1: 100, m2: 92, m3: 87, m4: 83, m5: 80 },
  { cohort: 'Feb 2026', size: 31, m1: 100, m2: 90, m3: 84, m4: 80, m5: '—' },
  { cohort: 'Mar 2026', size: 28, m1: 100, m2: 89, m3: 82, m4: '—', m5: '—' },
  { cohort: 'Apr 2026', size: 42, m1: 100, m2: 91, m3: '—', m4: '—', m5: '—' },
  { cohort: 'May 2026', size: 38, m1: 100, m2: '—', m3: '—', m4: '—', m5: '—' },
];

function fmtUsd(n: number) {
  return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}
function fmtNum(n: number) {
  return n.toLocaleString('en-US');
}

// ─── MRR line chart ──────────────────────────────────────────────────────────

function MrrChart({ data }: { data: typeof MRR_TREND }) {
  const W = 720;
  const H = 180;
  const pad = { t: 12, r: 24, b: 28, l: 56 };
  const xs = W - pad.l - pad.r;
  const ys = H - pad.t - pad.b;

  const max = Math.max(...data.map((d) => d.mrr)) * 1.1;
  const min = 0;
  const range = max - min;

  const points = data.map((d, i) => ({
    x: pad.l + (i / (data.length - 1)) * xs,
    y: pad.t + (1 - (d.mrr - min) / range) * ys,
    ...d,
  }));

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = `${path} L${points[points.length - 1]!.x.toFixed(1)},${(pad.t + ys).toFixed(1)} L${points[0]!.x.toFixed(1)},${(pad.t + ys).toFixed(1)} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full text-coral">
      <defs>
        <linearGradient id="mrr-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity={0.25} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = pad.t + ys * t;
        const v = max - range * t;
        return (
          <g key={t}>
            <line x1={pad.l} y1={y} x2={pad.l + xs} y2={y} stroke="currentColor" strokeOpacity={0.06} strokeWidth={1} />
            <text x={pad.l - 6} y={y + 3} textAnchor="end" fontSize={9} fill="currentColor" opacity={0.5}>{fmtUsd(v)}</text>
          </g>
        );
      })}
      <path d={area} fill="url(#mrr-area)" />
      <path d={path} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p) => (
        <g key={p.month}>
          <circle cx={p.x} cy={p.y} r={4} fill="currentColor" stroke="#fff" strokeWidth={2} />
          <text x={p.x} y={H - 8} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.55}>{p.month}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30d');

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
      {/* Hero */}
      <div className="shrink-0 p-5 pb-0">
        <header className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Super Admin</p>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">Platform Analytics</h1>
              <p className="mt-0.5 text-sm text-white/70">Growth, revenue, retention and engagement across all tenants.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-white/15 bg-white/5 p-0.5 text-xs">
                {(['7d', '30d', '90d', '12m'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={cn(
                      'rounded-md px-2.5 py-1 font-medium transition-colors',
                      period === p ? 'bg-white text-navy' : 'text-white/70 hover:text-white',
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <Button size="sm" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Download className="h-3 w-3" />Export
              </Button>
            </div>
          </div>
        </header>
      </div>

      <div className="flex-1 min-h-0 space-y-5 overflow-y-auto p-5 pt-5">

        {/* ── KPI strip ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'MRR',           value: fmtUsd(KPI.mrr.value),         delta: KPI.mrr.delta,         sub: KPI.mrr.sub,         icon: DollarSign, accent: 'text-emerald-600' },
            { label: 'ARR',           value: fmtUsd(KPI.arr.value),         delta: KPI.arr.delta,         sub: KPI.arr.sub,         icon: TrendingUp, accent: 'text-emerald-600' },
            { label: 'New MRR',       value: `+${fmtUsd(KPI.newMrr.value)}`, delta: KPI.newMrr.delta,    sub: KPI.newMrr.sub,      icon: ArrowUp,    accent: 'text-blue-600' },
            { label: 'Churned MRR',   value: `-${fmtUsd(KPI.churnedMrr.value)}`, delta: KPI.churnedMrr.delta, sub: KPI.churnedMrr.sub, icon: ArrowDown, accent: 'text-red-600' },
            { label: 'Active tenants',value: KPI.activeTenants.value,        delta: KPI.activeTenants.delta, sub: KPI.activeTenants.sub, icon: Building2, accent: 'text-foreground' },
            { label: 'Trial',         value: KPI.trial.value,                delta: KPI.trial.delta,     sub: KPI.trial.sub,       icon: Sparkles,   accent: 'text-amber-600' },
            { label: 'Platform CSAT', value: KPI.csat.value,                 delta: KPI.csat.delta,      sub: KPI.csat.sub,        icon: Star,       accent: 'text-emerald-600' },
            { label: 'API calls',     value: KPI.apiCalls.value,             delta: KPI.apiCalls.delta,  sub: KPI.apiCalls.sub,    icon: Zap,        accent: 'text-foreground' },
          ].map((k) => (
            <div key={k.label} className="rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{k.label}</p>
                <k.icon className={cn('h-3.5 w-3.5 opacity-40', k.accent)} />
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <p className={cn('text-xl font-bold tabular-nums', k.accent)}>{k.value}</p>
                {typeof k.delta === 'number' && (
                  <span className={cn(
                    'text-[10px] font-semibold',
                    k.delta > 0 ? 'text-emerald-600' : k.delta < 0 ? 'text-red-600' : 'text-muted-foreground',
                  )}>
                    {k.delta > 0 ? '+' : ''}{k.delta}{typeof k.delta === 'number' && k.label.includes('CSAT') ? '' : (k.label.includes('MRR') || k.label.includes('ARR') ? '%' : '')}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* ── MRR trend (full width) ── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b py-3 pb-3">
            <div>
              <CardTitle className="text-sm font-semibold">MRR Growth</CardTitle>
              <p className="text-xs text-muted-foreground">8-month trend with new vs churned</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-coral" />MRR</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" />New</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" />Churn</span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <MrrChart data={MRR_TREND} />
          </CardContent>
        </Card>

        {/* ── Plans + Regions ── */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader className="border-b py-3 pb-3">
              <CardTitle className="text-sm font-semibold">Revenue by plan</CardTitle>
              <p className="text-xs text-muted-foreground">% of total MRR</p>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {PLAN_BREAKDOWN.map((p) => (
                <div key={p.plan}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={cn('h-2 w-2 rounded-full', p.color)} />
                      <span className="font-semibold capitalize">{p.plan}</span>
                      <span className="text-muted-foreground">· {p.tenants} tenants</span>
                    </div>
                    <span className="font-bold tabular-nums">{fmtUsd(p.mrr)}/mo</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className={cn('h-full rounded-full', p.color)} style={{ width: `${p.share}%` }} />
                  </div>
                  <p className="mt-0.5 text-right text-[10px] text-muted-foreground tabular-nums">{p.share}%</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b py-3 pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Globe2 className="h-4 w-4 text-coral" />By region
              </CardTitle>
              <p className="text-xs text-muted-foreground">Tenant distribution & growth</p>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y">
                {REGION_BREAKDOWN.map((r) => (
                  <li key={r.region} className="flex items-center justify-between px-4 py-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base leading-none">{r.flag}</span>
                      <span className="font-semibold">{r.region}</span>
                      <span className="text-muted-foreground">· {r.tenants}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold tabular-nums">{fmtUsd(r.mrr)}</span>
                      <span className={cn(
                        'tabular-nums text-[10px] font-semibold',
                        r.growth > 0 ? 'text-emerald-600' : 'text-red-600',
                      )}>
                        {r.growth > 0 ? '+' : ''}{r.growth}%
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* ── Funnel + Top tenants ── */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader className="border-b py-3 pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Activity className="h-4 w-4 text-coral" />Acquisition funnel
              </CardTitle>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardHeader>
            <CardContent className="space-y-2 pt-4">
              {FUNNEL.map((stage, i) => {
                const width = (stage.count / FUNNEL[0]!.count) * 100;
                const isLast = i === FUNNEL.length - 1;
                return (
                  <div key={stage.stage}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium">{stage.stage}</span>
                      <span className="flex items-center gap-2">
                        <span className="font-bold tabular-nums">{fmtNum(stage.count)}</span>
                        {i > 0 && (
                          <span className={cn(
                            'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                            stage.conv >= 50 ? 'bg-emerald-50 text-emerald-700' :
                            stage.conv >= 20 ? 'bg-amber-50 text-amber-700'  : 'bg-red-50 text-red-700',
                          )}>
                            {stage.conv}%
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-md bg-muted">
                      <div
                        className={cn('h-full rounded-md', isLast ? 'bg-emerald-500' : 'bg-coral')}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b py-3 pb-3">
              <div>
                <CardTitle className="text-sm font-semibold">Top tenants by MRR</CardTitle>
                <p className="text-xs text-muted-foreground">Highest-value accounts</p>
              </div>
              <Button asChild size="sm" variant="outline" className="h-7 text-xs">
                <Link href="/tenants">All tenants<ArrowUpRight className="h-3 w-3" /></Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y">
                {TOP_TENANTS.map((t, i) => (
                  <li key={t.name} className="flex items-center justify-between px-4 py-2.5 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="grid h-6 w-6 place-items-center rounded-md bg-muted/40 text-[10px] font-bold text-muted-foreground">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-semibold">{t.name}</p>
                        <p className="text-[10px] capitalize text-muted-foreground">{t.plan}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold tabular-nums text-emerald-600">{fmtUsd(t.mrr)}/mo</p>
                      {t.growth === 'up'   && <TrendingUp   className="h-3 w-3 text-emerald-500" />}
                      {t.growth === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                      {t.growth === 'stable' && <span className="h-0.5 w-3 rounded-full bg-muted-foreground/40" />}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* ── Cohort retention ── */}
        <Card>
          <CardHeader className="border-b py-3 pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <LineChart className="h-4 w-4 text-coral" />Cohort retention
            </CardTitle>
            <p className="text-xs text-muted-foreground">% of original cohort still active after N months</p>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-[#F4EFE6]">
                <tr className="border-b text-left text-muted-foreground">
                  <th className="px-4 py-2.5 font-semibold">Cohort</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Size</th>
                  {['M1', 'M2', 'M3', 'M4', 'M5'].map((m) => (
                    <th key={m} className="px-3 py-2.5 font-semibold text-center">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {COHORTS.map((c) => (
                  <tr key={c.cohort} className="hover:bg-muted/30">
                    <td className="px-4 py-2 font-medium">{c.cohort}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{c.size}</td>
                    {[c.m1, c.m2, c.m3, c.m4, c.m5].map((v, i) => (
                      <td key={i} className="px-3 py-2 text-center">
                        {typeof v === 'number'
                          ? (
                            <span className={cn(
                              'inline-block rounded px-2 py-0.5 text-[10px] font-semibold tabular-nums',
                              v >= 90 ? 'bg-emerald-100 text-emerald-700' :
                              v >= 80 ? 'bg-emerald-50 text-emerald-700' :
                              v >= 70 ? 'bg-amber-50 text-amber-700' :
                                        'bg-red-50 text-red-700',
                            )}>{v}%</span>
                          )
                          : <span className="text-muted-foreground/40">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* ── Quick KPI strip 2 (engagement) ── */}
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { label: 'Avg first response',  value: KPI.avgResponse.value, sub: KPI.avgResponse.sub, icon: Clock,    color: 'text-emerald-600' },
            { label: 'Total platform users',value: fmtNum(KPI.totalUsers.value), sub: KPI.totalUsers.sub, icon: Users,    color: 'text-foreground' },
            { label: 'Resolved this month', value: 1_842, sub: '92% within SLA',  icon: CheckCircle2, color: 'text-emerald-600' },
            { label: 'Active CSRs',         value: 12,    sub: '3 on-call now',   icon: Headset,      color: 'text-coral'      },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border bg-card px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</p>
                <s.icon className={cn('h-3.5 w-3.5 opacity-40', s.color)} />
              </div>
              <p className={cn('mt-1 text-xl font-bold tabular-nums', s.color)}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
