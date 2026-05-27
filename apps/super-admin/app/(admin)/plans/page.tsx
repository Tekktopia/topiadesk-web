'use client';

import { Check, Edit3, HardDrive, Users } from 'lucide-react';
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
import { usePlans } from '@/lib/queries';
import type { TenantPlan } from '@/lib/mock-data';

const PLAN_ACCENT: Record<TenantPlan, { border: string; badge: string; btn: string }> = {
  starter:    { border: 'border-slate-200',   badge: 'bg-slate-100 text-slate-700',     btn: 'text-slate-700' },
  business:   { border: 'border-blue-200',    badge: 'bg-blue-100 text-blue-700',       btn: 'text-blue-700' },
  enterprise: { border: 'border-violet-200',  badge: 'bg-violet-100 text-violet-700',   btn: 'text-violet-700' },
};

export default function PlansPage() {
  const plans = usePlans();

  return (
    <div className="space-y-5 p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Super Admin</p>
          <h1 className="font-display text-2xl font-bold tracking-tight">Plans & Pricing</h1>
          <p className="text-sm text-muted-foreground">Manage subscription tiers, feature entitlements, and limits.</p>
        </div>
        <Button size="sm">Add plan</Button>
      </header>

      {plans.isLoading ? (
        <div className="grid gap-5 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80" />)}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {(plans.data ?? []).map((plan) => {
            const acc = PLAN_ACCENT[plan.slug];
            return (
              <Card key={plan.id} className={cn('flex flex-col', acc.border)}>
                <CardHeader className="border-b py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-semibold', acc.badge)}>{plan.name}</span>
                      <p className="mt-2 text-3xl font-bold tracking-tight">${plan.priceMonthly}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                    </div>
                    <Button size="sm" variant="outline" className={cn('text-[11px]', acc.btn)}>
                      <Edit3 className="h-3 w-3" />Edit
                    </Button>
                  </div>

                  <div className="mt-3 flex gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {plan.agentLimit === null ? 'Unlimited agents' : `Up to ${plan.agentLimit} agents`}
                    </span>
                    <span className="flex items-center gap-1">
                      <HardDrive className="h-3.5 w-3.5" />{plan.storageLimitGb} GB
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 py-4">
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <div className="border-t p-4">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold">{plan.tenantCount} tenant{plan.tenantCount !== 1 ? 's' : ''}</p>
                      <p className="text-muted-foreground">MRR: <span className="font-semibold text-emerald-600">${plan.mrr.toLocaleString()}</span></p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">Active</Badge>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Comparison table */}
      <Card>
        <CardHeader className="border-b py-3">
          <CardTitle className="text-sm">Feature matrix</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b bg-muted/30 text-muted-foreground">
                <th className="px-4 py-2.5 text-left font-semibold">Feature</th>
                {(plans.data ?? []).map((p) => (
                  <th key={p.id} className="px-4 py-2.5 text-center font-semibold capitalize">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                'Email channel', 'Portal channel', 'WhatsApp & SMS channels', 'Voice channel',
                'SLA policies', 'Asset management', 'Monitoring & NOC', 'AI Reply Suggestions',
                'Custom branding', 'SSO / SAML', 'Audit log export',
              ].map((feature) => (
                <tr key={feature} className="hover:bg-muted/30">
                  <td className="px-4 py-2.5 font-medium">{feature}</td>
                  {(plans.data ?? []).map((p) => (
                    <td key={p.id} className="px-4 py-2.5 text-center">
                      {p.features.some((f) => f.toLowerCase().includes(feature.toLowerCase().split(' ')[0] ?? '')) ? (
                        <Check className="mx-auto h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
