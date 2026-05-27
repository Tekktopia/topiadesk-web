'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowUpRight, DollarSign, TrendingDown, TrendingUp, Users } from 'lucide-react';
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
import { useRevenueTrend, useTenants, usePlans } from '@/lib/queries';
import type { TenantPlan } from '@/lib/mock-data';

// ─── MRR Chart ────────────────────────────────────────────────────────────────

function MrrChart({ data }: { data: { month: string; mrr: number; newMrr: number; churnedMrr: number }[] }) {
  const W = 640; const H = 140;
  const pad = { t: 14, r: 16, b: 30, l: 52 };
  const xs = W - pad.l - pad.r; const ys = H - pad.t - pad.b;
  const max = Math.max(...data.map((d) => d.mrr));

  const pts = data.map((d, i) => ({
    x: pad.l + (i / (data.length - 1)) * xs,
    y: pad.t + (1 - d.mrr / max) * ys,
    ...d,
  }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1]!.x.toFixed(1)},${(pad.t + ys).toFixed(1)} L${pts[0]!.x.toFixed(1)},${(pad.t + ys).toFixed(1)} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full text-emerald-500">
      <defs>
        <linearGradient id="mrr-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity={0.25} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const v = max * (1 - t);
        const y = pad.t + t * ys;
        return (
          <g key={t}>
            <line x1={pad.l} y1={y} x2={pad.l + xs} y2={y} stroke="currentColor" strokeOpacity={0.07} strokeWidth={1} />
            <text x={pad.l - 6} y={y + 3.5} textAnchor="end" fontSize={9} fill="currentColor" opacity={0.5}>${(v / 1000).toFixed(1)}k</text>
          </g>
        );
      })}
      <path d={area} fill="url(#mrr-area)" />
      <path d={line} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p) => (
        <g key={p.month}>
          <circle cx={p.x} cy={p.y} r={4} fill="currentColor" stroke="#fff" strokeWidth={2} />
          <text x={p.x} y={H - 8} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.5}>{p.month}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const PLAN_STYLES: Record<TenantPlan, string> = {
  enterprise: 'bg-coral/12 text-coral-dark',
  business:   'bg-blue-100 text-blue-700',
  starter:    'bg-slate-100 text-slate-700',
};

export default function BillingPage() {
  const trend   = useRevenueTrend();
  const tenants = useTenants();
  const plans   = usePlans();

  const lastMonth = trend.data?.[trend.data.length - 1];
  const prevMonth = trend.data?.[trend.data.length - 2];
  const mrrGrowth = lastMonth && prevMonth ? ((lastMonth.mrr - prevMonth.mrr) / prevMonth.mrr) * 100 : 0;

  const trialTenants = useMemo(
    () => (tenants.data ?? []).filter((t) => t.status === 'trialing').sort((a, b) => new Date(a.trialEndsAt ?? '').getTime() - new Date(b.trialEndsAt ?? '').getTime()),
    [tenants.data],
  );

  const activePaying = useMemo(
    () => (tenants.data ?? []).filter((t) => t.status === 'active' || t.status === 'suspended').sort((a, b) => b.mrr - a.mrr),
    [tenants.data],
  );

  return (
    <div className="space-y-5 p-6">
      {/* Gradient header */}
      <div className="relative -mx-6 -mt-6 mb-1 overflow-hidden bg-navy px-6 py-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Super Admin</p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">Billing & Revenue</h1>
            <p className="mt-0.5 text-sm text-white/70">Subscription metrics across all tenants</p>
          </div>
          <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">Export CSV</Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'MRR', value: `$${(lastMonth?.mrr ?? 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600',
            sub: `${mrrGrowth >= 0 ? '+' : ''}${mrrGrowth.toFixed(1)}% vs last month` },
          { label: 'ARR', value: `$${((lastMonth?.mrr ?? 0) * 12).toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', sub: 'Annualised' },
          { label: 'New MRR (mo)', value: `+$${(lastMonth?.newMrr ?? 0).toLocaleString()}`, icon: ArrowUpRight, color: 'text-blue-600', sub: 'New & upgrades' },
          { label: 'Churned MRR', value: `-$${(lastMonth?.churnedMrr ?? 0).toLocaleString()}`, icon: TrendingDown, color: 'text-red-600', sub: 'Cancellations' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</p>
              <s.icon className={cn('h-4 w-4 opacity-40', s.color)} />
            </div>
            <p className={cn('mt-1.5 text-2xl font-bold tabular-nums', s.color)}>{s.value}</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* MRR trend */}
      <Card>
        <CardHeader className="border-b py-3">
          <CardTitle className="text-sm">MRR growth (7 months)</CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          {trend.isLoading ? <Skeleton className="h-36 w-full" /> : trend.data && <MrrChart data={trend.data} />}
        </CardContent>
      </Card>

      {/* Revenue by plan */}
      <div className="grid gap-5 lg:grid-cols-3">
        {plans.isLoading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32" />)
          : (plans.data ?? []).map((plan) => (
            <Card key={plan.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize', PLAN_STYLES[plan.slug])}>{plan.name}</span>
                  <Users className="h-4 w-4 text-muted-foreground opacity-40" />
                </div>
                <p className="mt-3 text-2xl font-bold text-emerald-600">${plan.mrr.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">MRR · {plan.tenantCount} tenant{plan.tenantCount !== 1 ? 's' : ''}</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${(plan.mrr / ((plans.data ?? []).reduce((s, p) => s + p.mrr, 0) || 1)) * 100}%` }} />
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">${plan.priceMonthly}/mo per tenant</p>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Trials expiring + paying accounts */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Trials */}
        <Card>
          <CardHeader className="border-b py-3">
            <CardTitle className="text-sm text-amber-600">Trials expiring soon ({trialTenants.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {trialTenants.length === 0 ? (
              <p className="p-4 text-xs text-muted-foreground">No active trials.</p>
            ) : (
              <ul className="divide-y">
                {trialTenants.map((t) => {
                  const daysLeft = t.trialEndsAt ? Math.ceil((new Date(t.trialEndsAt).getTime() - Date.now()) / 86_400_000) : null;
                  return (
                    <li key={t.id} className="flex items-center justify-between px-4 py-2.5">
                      <div>
                        <p className="text-xs font-semibold">{t.name}</p>
                        <p className="text-[10px] text-muted-foreground">{t.owner.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={daysLeft !== null && daysLeft <= 3 ? 'danger' : 'warning'} className="text-[10px]">
                          {daysLeft !== null ? `${daysLeft}d left` : '—'}
                        </Badge>
                        <Button size="sm" variant="outline" className="h-6 px-2 text-[10px]" asChild>
                          <Link href={`/tenants/${t.id}`}>View</Link>
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Top paying accounts */}
        <Card>
          <CardHeader className="border-b py-3">
            <CardTitle className="text-sm">Top accounts by MRR</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y">
              {activePaying.slice(0, 6).map((t, i) => (
                <li key={t.id} className="flex items-center justify-between px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-4 text-center text-[10px] font-bold text-muted-foreground">{i + 1}</span>
                    <div>
                      <Link href={`/tenants/${t.id}`} className="text-xs font-semibold hover:underline">{t.name}</Link>
                      <p className="text-[10px] text-muted-foreground capitalize">{t.plan}</p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-600 tabular-nums text-xs">${t.mrr.toLocaleString()}/mo</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
