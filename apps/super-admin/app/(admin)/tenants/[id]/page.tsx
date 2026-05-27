'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  Globe,
  HardDrive,
  Info,
  Mail,
  MapPin,
  MoreHorizontal,
  Server,
  Tag,
  Ticket,
  Users,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Skeleton,
  cn,
} from '@topiadesk/ui';
import { useTenant, usePlatformUsers } from '@/lib/queries';
import type { TenantPlan, TenantStatus } from '@/lib/mock-data';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
function formatAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}

const PLAN_STYLES: Record<TenantPlan, string> = {
  enterprise: 'bg-coral/12 text-coral-dark',
  business:   'bg-blue-100 text-blue-700',
  starter:    'bg-slate-100 text-slate-700',
};

const STATUS_META: Record<TenantStatus, { variant: 'success' | 'warning' | 'danger' | 'secondary' }> = {
  active:    { variant: 'success' },
  trialing:  { variant: 'warning' },
  suspended: { variant: 'danger' },
  churned:   { variant: 'secondary' },
};

type Tab = 'overview' | 'billing' | 'usage' | 'agents';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const tenant = useTenant(id);
  const users  = usePlatformUsers();
  const [tab, setTab] = useState<Tab>('overview');

  const t = tenant.data;
  const tenantUsers = (users.data ?? []).filter((u) => u.tenantId === id);

  if (tenant.isLoading) {
    return (
      <div className="space-y-5 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!t) {
    return (
      <div className="flex flex-col items-center gap-3 p-16 text-muted-foreground">
        <Info className="h-8 w-8" />
        <p>Tenant not found.</p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/tenants"><ArrowLeft className="h-3 w-3" />Back to tenants</Link>
        </Button>
      </div>
    );
  }

  const sm = STATUS_META[t.status];
  const storageUsedPct = (t.storageUsedGb / t.storageLimitGb) * 100;
  const agentUsedPct   = t.agentLimit ? (t.agentCount / t.agentLimit) * 100 : 0;

  return (
    <div className="space-y-5 p-6">
      {/* Gradient header */}
      <div className="relative -mx-6 -mt-6 mb-1 overflow-hidden bg-navy px-6 py-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative">
          <Link href="/tenants" className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white/90">
            <ArrowLeft className="h-3 w-3" />Super Admin · Tenants
          </Link>
          <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-bold tracking-tight text-white">{t.name}</h1>
                <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-white">{t.plan}</span>
                <Badge variant={sm.variant} className="text-[10px]">{t.status.charAt(0).toUpperCase() + t.status.slice(1)}</Badge>
              </div>
              <p className="mt-1 font-mono text-sm text-white/60">{t.subdomain}.topiadesk.com</p>
              <p className="text-xs text-white/50">{t.owner.name} · {t.owner.email} · {t.country} · {t.industry}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" asChild>
                <a href={`https://${t.subdomain}.topiadesk.com`} target="_blank" rel="noopener">
                  <ExternalLink className="h-3 w-3" />Open workspace
                </a>
              </Button>
              <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">Impersonate admin</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-8 p-0 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Change plan</DropdownMenuItem>
                  <DropdownMenuItem>Reset owner password</DropdownMenuItem>
                  <DropdownMenuItem>Export tenant data</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-amber-600">{t.status === 'suspended' ? 'Reactivate' : 'Suspend tenant'}</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete tenant</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Tag,    label: 'MRR',           value: t.mrr > 0 ? `$${t.mrr.toLocaleString()}` : 'Trial / $0' },
          { icon: Users,  label: 'Agents',         value: `${t.agentCount}${t.agentLimit ? ` / ${t.agentLimit}` : ' (unlimited)'}` },
          { icon: Ticket, label: 'Tickets (mo)',   value: t.ticketsThisMonth.toLocaleString() },
          { icon: HardDrive, label: 'Storage',    value: `${t.storageUsedGb} / ${t.storageLimitGb} GB` },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <s.icon className="h-3.5 w-3.5" />
              <p className="text-[11px] font-semibold uppercase tracking-wide">{s.label}</p>
            </div>
            <p className="mt-1.5 text-xl font-bold tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex rounded-lg border p-0.5 text-xs w-fit">
        {(['overview', 'billing', 'usage', 'agents'] as Tab[]).map((t2) => (
          <button key={t2} type="button" onClick={() => setTab(t2)}
            className={cn('rounded-md px-3 py-1 font-medium capitalize transition-colors',
              tab === t2 ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground')}>
            {t2}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {tab === 'overview' && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader className="border-b py-3"><CardTitle className="text-sm">Tenant details</CardTitle></CardHeader>
            <CardContent className="py-4">
              <dl className="space-y-3 text-xs">
                {[
                  { icon: Globe,  label: 'Subdomain',   value: `${t.subdomain}.topiadesk.com` },
                  { icon: Mail,   label: 'Owner email',  value: t.owner.email },
                  { icon: MapPin, label: 'Country',      value: t.country },
                  { icon: Server, label: 'Industry',     value: t.industry },
                  { icon: Clock,  label: 'Created',      value: formatDate(t.createdAt) },
                  { icon: Clock,  label: 'Last active',  value: formatAgo(t.lastActiveAt) },
                ].map(({ icon: DtIcon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <DtIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">{label}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Channels</CardTitle></CardHeader>
              <CardContent className="py-3">
                <div className="flex flex-wrap gap-1.5">
                  {t.channels.length > 0
                    ? t.channels.map((c) => <Badge key={c} variant="secondary" className="capitalize text-[11px]">{c}</Badge>)
                    : <p className="text-xs text-muted-foreground">No active channels</p>}
                </div>
              </CardContent>
            </Card>

            {t.trialEndsAt && (
              <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
                <CardContent className="py-3">
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-400">
                    Trial ends: {formatDate(t.trialEndsAt)} ({Math.ceil((new Date(t.trialEndsAt).getTime() - Date.now()) / 86_400_000)} days left)
                  </p>
                </CardContent>
              </Card>
            )}

            {t.notes && (
              <Card>
                <CardHeader className="border-b py-3"><CardTitle className="text-sm">Internal notes</CardTitle></CardHeader>
                <CardContent className="py-3">
                  <p className="text-xs text-muted-foreground italic">{t.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Tab: Billing */}
      {tab === 'billing' && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader className="border-b py-3"><CardTitle className="text-sm">Subscription</CardTitle></CardHeader>
            <CardContent className="py-4 space-y-3 text-xs">
              {[
                { label: 'Plan',          value: <span className={cn('rounded-full px-2 py-0.5 font-semibold capitalize', PLAN_STYLES[t.plan])}>{t.plan}</span> },
                { label: 'Status',        value: <Badge variant={sm.variant} className="text-[10px]">{t.status}</Badge> },
                { label: 'MRR',           value: t.mrr > 0 ? `$${t.mrr}/month` : '— (trial)' },
                { label: 'ARR',           value: t.mrr > 0 ? `$${(t.mrr * 12).toLocaleString()}/year` : '—' },
                { label: 'Billing cycle', value: 'Monthly' },
                { label: 'Next invoice',  value: t.status === 'active' ? 'June 1, 2025' : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="text-[11px]">Change plan</Button>
                <Button size="sm" variant="outline" className="text-[11px]">View invoices</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab: Usage */}
      {tab === 'usage' && (
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            { label: 'Agents',        used: t.agentCount,       limit: t.agentLimit,       unit: 'agents',   pct: agentUsedPct },
            { label: 'Storage',       used: t.storageUsedGb,    limit: t.storageLimitGb,   unit: 'GB',        pct: storageUsedPct },
            { label: 'Tickets (mo)',  used: t.ticketsThisMonth, limit: null,                unit: 'tickets',  pct: null },
          ].map((r) => (
            <Card key={r.label}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold">{r.label}</span>
                  <span className="text-muted-foreground">{r.used}{r.limit ? ` / ${r.limit}` : ''} {r.unit}</span>
                </div>
                {r.pct !== null && (
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn('h-full rounded-full transition-all', r.pct > 85 ? 'bg-red-500' : r.pct > 70 ? 'bg-amber-500' : 'bg-emerald-500')}
                      style={{ width: `${Math.min(100, r.pct)}%` }}
                    />
                  </div>
                )}
                {r.pct !== null && (
                  <p className={cn('mt-1 text-[10px]', r.pct > 85 ? 'text-red-600' : 'text-muted-foreground')}>{r.pct.toFixed(1)}% used</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tab: Agents */}
      {tab === 'agents' && (
        <Card>
          <CardHeader className="border-b py-3">
            <CardTitle className="text-sm">Agents & users ({tenantUsers.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {users.isLoading ? (
              <div className="space-y-2 p-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
            ) : tenantUsers.length === 0 ? (
              <p className="p-6 text-center text-xs text-muted-foreground">No users found for this tenant.</p>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                    <th className="px-4 py-2.5 font-semibold">Name</th>
                    <th className="px-3 py-2.5 font-semibold">Email</th>
                    <th className="px-3 py-2.5 font-semibold">Role</th>
                    <th className="px-3 py-2.5 font-semibold">Status</th>
                    <th className="px-3 py-2.5 font-semibold">Last login</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {tenantUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/40">
                      <td className="px-4 py-2.5 font-medium">{u.name}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{u.email}</td>
                      <td className="px-3 py-2.5">
                        <Badge variant="secondary" className="capitalize text-[10px]">{u.role}</Badge>
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge variant={u.status === 'active' ? 'success' : u.status === 'invited' ? 'warning' : 'secondary'} className="text-[10px]">
                          {u.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">{u.lastLoginAt ? formatAgo(u.lastLoginAt) : 'Never'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
