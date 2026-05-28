'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  Building2,
  ChevronDown,
  ExternalLink,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  X,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Skeleton,
  cn,
} from '@topiadesk/ui';
import { useTenants } from '@/lib/queries';
import type { TenantPlan, TenantStatus } from '@/lib/mock-data';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

const PLAN_STYLES: Record<TenantPlan, string> = {
  enterprise: 'bg-coral/12 text-coral-dark dark:bg-violet-900/30 dark:text-violet-300',
  business:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  starter:    'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

const STATUS_META: Record<TenantStatus, { variant: 'success' | 'warning' | 'danger' | 'secondary'; label: string }> = {
  active:    { variant: 'success',   label: 'Active' },
  trialing:  { variant: 'warning',   label: 'Trial' },
  suspended: { variant: 'danger',    label: 'Suspended' },
  churned:   { variant: 'secondary', label: 'Churned' },
};

function SortTh({ col, label, sort, onSort, className }: {
  col: string; label: string; className?: string;
  sort: { col: string; dir: 'asc' | 'desc' };
  onSort: (c: string) => void;
}) {
  const active = sort.col === col;
  return (
    <th className={cn('px-3 py-2.5', className)}>
      <button type="button" onClick={() => onSort(col)}
        className={cn('flex items-center gap-1 font-semibold transition-colors hover:text-foreground', active ? 'text-foreground' : 'text-muted-foreground')}>
        {label}
        <ChevronDown className={cn('h-3 w-3 transition-transform', active && sort.dir === 'asc' && 'rotate-180')} />
      </button>
    </th>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TenantsPage() {
  const tenants = useTenants();
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<'all' | TenantPlan>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | TenantStatus>('all');
  const [sort, setSort] = useState<{ col: string; dir: 'asc' | 'desc' }>({ col: 'createdAt', dir: 'desc' });

  const filtered = useMemo(() => {
    let list = tenants.data ?? [];
    if (planFilter !== 'all')   list = list.filter((t) => t.plan === planFilter);
    if (statusFilter !== 'all') list = list.filter((t) => t.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.name.toLowerCase().includes(q) || t.subdomain.includes(q) || t.owner.email.toLowerCase().includes(q) || t.country.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      const dir = sort.dir === 'asc' ? 1 : -1;
      if (sort.col === 'mrr')       return (a.mrr - b.mrr) * dir;
      if (sort.col === 'agents')    return (a.agentCount - b.agentCount) * dir;
      if (sort.col === 'tickets')   return (a.ticketsThisMonth - b.ticketsThisMonth) * dir;
      if (sort.col === 'createdAt') return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
      if (sort.col === 'name')      return a.name.localeCompare(b.name) * dir;
      return 0;
    });
  }, [tenants.data, planFilter, statusFilter, search, sort]);

  const handleSort = (col: string) => setSort((s) => ({ col, dir: s.col === col && s.dir === 'asc' ? 'desc' : 'asc' }));

  const counts = useMemo(() => {
    const all = tenants.data ?? [];
    return {
      all: all.length,
      active: all.filter((t) => t.status === 'active').length,
      trialing: all.filter((t) => t.status === 'trialing').length,
      suspended: all.filter((t) => t.status === 'suspended').length,
      churned: all.filter((t) => t.status === 'churned').length,
    };
  }, [tenants.data]);

  return (
    <div className="space-y-5">
      {/* Gradient header */}
      <div className="relative overflow-hidden rounded-2xl bg-navy px-6 py-5 shadow-lg shadow-navy/15">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Super Admin</p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">Tenants</h1>
            <p className="mt-0.5 text-sm text-white/70">{counts.all} tenants · {counts.active} active · {counts.trialing} trialling</p>
          </div>
          <Button size="sm" className="bg-coral text-white hover:bg-white/90">
            <Plus className="h-3 w-3" />Create tenant
          </Button>
        </div>
      </div>

      <div className="px-6 pb-6 space-y-5">
      <Card>
        {/* Filters */}
        <CardHeader className="border-b py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Status tabs */}
            <div className="flex rounded-lg border p-0.5 text-xs">
              {(['all', 'active', 'trialing', 'suspended', 'churned'] as const).map((s) => (
                <button key={s} type="button" onClick={() => setStatusFilter(s)}
                  className={cn('rounded-md px-2.5 py-1 font-medium capitalize transition-colors',
                    statusFilter === s ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground')}>
                  {s === 'all' ? `All (${counts.all})` : `${s.charAt(0).toUpperCase() + s.slice(1)} (${counts[s]})`}
                </button>
              ))}
            </div>

            {/* Plan filter */}
            <div className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value as typeof planFilter)}
                className="h-8 rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="all">All plans</option>
                <option value="enterprise">Enterprise</option>
                <option value="business">Business</option>
                <option value="starter">Starter</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative ml-auto">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, subdomain, email…" className="h-8 w-60 pl-8 text-xs" />
              {search && (
                <button type="button" onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {tenants.isLoading ? (
            <div className="space-y-2 p-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                    <SortTh col="name"      label="Tenant"          sort={sort} onSort={handleSort} className="px-4" />
                    <th className="px-3 py-2.5 font-semibold">Plan</th>
                    <th className="px-3 py-2.5 font-semibold">Status</th>
                    <th className="px-3 py-2.5 font-semibold">Country</th>
                    <SortTh col="mrr"       label="MRR"             sort={sort} onSort={handleSort} className="text-right" />
                    <SortTh col="agents"    label="Agents"          sort={sort} onSort={handleSort} className="text-center" />
                    <SortTh col="tickets"   label="Tickets (mo)"    sort={sort} onSort={handleSort} className="text-right" />
                    <SortTh col="createdAt" label="Created"         sort={sort} onSort={handleSort} />
                    <th className="px-3 py-2.5 font-semibold">Last active</th>
                    <th className="px-3 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((t) => {
                    const sm = STATUS_META[t.status];
                    return (
                      <tr key={t.id} className={cn('transition-colors hover:bg-muted/40',
                        t.status === 'suspended' ? 'bg-red-50/20 dark:bg-red-950/10' :
                        t.status === 'trialing'  ? 'bg-amber-50/20 dark:bg-amber-950/10' : '')}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-muted">
                              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                            <div>
                              <Link href={`/tenants/${t.id}`} className="font-semibold text-foreground hover:text-primary hover:underline">
                                {t.name}
                              </Link>
                              <p className="text-muted-foreground">{t.subdomain}.topiadesk.com</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize', PLAN_STYLES[t.plan])}>
                            {t.plan}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1.5">
                            {t.status === 'trialing' && t.trialEndsAt && (
                              <span className="text-[10px] text-amber-600">
                                {Math.ceil((new Date(t.trialEndsAt).getTime() - Date.now()) / 86_400_000)}d left
                              </span>
                            )}
                            <Badge variant={sm.variant} className="text-[10px]">{sm.label}</Badge>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-muted-foreground">{t.country}</td>
                        <td className="px-3 py-3 text-right font-semibold tabular-nums">
                          {t.mrr > 0 ? `$${t.mrr.toLocaleString()}` : '—'}
                        </td>
                        <td className="px-3 py-3 text-center tabular-nums text-muted-foreground">
                          {t.agentCount}{t.agentLimit !== null ? `/${t.agentLimit}` : ''}
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">{t.ticketsThisMonth.toLocaleString()}</td>
                        <td className="px-3 py-3 text-muted-foreground">{formatDate(t.createdAt)}</td>
                        <td className="px-3 py-3 text-muted-foreground">{formatAgo(t.lastActiveAt)}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="outline" className="h-7 px-2 text-[11px]" asChild>
                              <Link href={`/tenants/${t.id}`}>View</Link>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                                  <MoreHorizontal className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <a href={`https://${t.subdomain}.topiadesk.com`} target="_blank" rel="noopener">
                                    <ExternalLink className="h-3.5 w-3.5" />Open workspace
                                  </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem>Impersonate admin</DropdownMenuItem>
                                <DropdownMenuItem>Change plan</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-amber-600">
                                  {t.status === 'suspended' ? 'Reactivate tenant' : 'Suspend tenant'}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Delete tenant</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <p className="p-8 text-center text-sm text-muted-foreground">No tenants match your filters.</p>
              )}
            </div>
          )}
          <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-2.5">
            <p className="text-xs text-muted-foreground">Showing {filtered.length} of {tenants.data?.length ?? 0} tenants</p>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
