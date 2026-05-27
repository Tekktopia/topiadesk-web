'use client';

import { useMemo, useState } from 'react';
import { Filter, Search, X } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
  Skeleton,
  cn,
} from '@topiadesk/ui';
import Link from 'next/link';
import { usePlatformUsers } from '@/lib/queries';
import type { PlatformUserRole, PlatformUserStatus, TenantPlan } from '@/lib/mock-data';

function formatAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}

const ROLE_META: Record<PlatformUserRole, { label: string; variant: 'success' | 'warning' | 'secondary' | 'danger' }> = {
  super_admin: { label: 'Super admin', variant: 'danger' },
  admin:       { label: 'Admin',       variant: 'warning' },
  agent:       { label: 'Agent',       variant: 'secondary' },
};

const STATUS_META: Record<PlatformUserStatus, { variant: 'success' | 'warning' | 'secondary' }> = {
  active:   { variant: 'success' },
  invited:  { variant: 'warning' },
  inactive: { variant: 'secondary' },
};

const PLAN_STYLES: Record<TenantPlan, string> = {
  enterprise: 'bg-violet-100 text-violet-700',
  business:   'bg-blue-100 text-blue-700',
  starter:    'bg-slate-100 text-slate-700',
};

export default function UsersPage() {
  const users = usePlatformUsers();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | PlatformUserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | PlatformUserStatus>('all');

  const filtered = useMemo(() => {
    let list = users.data ?? [];
    if (roleFilter !== 'all')   list = list.filter((u) => u.role === roleFilter);
    if (statusFilter !== 'all') list = list.filter((u) => u.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.tenantName.toLowerCase().includes(q));
    }
    return list;
  }, [users.data, roleFilter, statusFilter, search]);

  const counts = useMemo(() => {
    const all = users.data ?? [];
    return {
      total:       all.length,
      active:      all.filter((u) => u.status === 'active').length,
      invited:     all.filter((u) => u.status === 'invited').length,
      inactive:    all.filter((u) => u.status === 'inactive').length,
      super_admin: all.filter((u) => u.role === 'super_admin').length,
    };
  }, [users.data]);

  return (
    <div className="space-y-5 p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Super Admin</p>
          <h1 className="font-display text-2xl font-bold tracking-tight">All Users</h1>
          <p className="text-sm text-muted-foreground">{counts.total} users across all tenants · {counts.super_admin} super admins</p>
        </div>
        <Button size="sm">Invite user</Button>
      </header>

      {/* Summary */}
      <div className="flex flex-wrap gap-3 text-xs">
        {[
          { label: 'Total',    value: counts.total,    color: 'text-foreground' },
          { label: 'Active',   value: counts.active,   color: 'text-emerald-600' },
          { label: 'Invited',  value: counts.invited,  color: 'text-amber-600' },
          { label: 'Inactive', value: counts.inactive, color: 'text-slate-500' },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border bg-card px-4 py-2.5">
            <p className={cn('text-lg font-bold tabular-nums', s.color)}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader className="border-b py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Status tabs */}
            <div className="flex rounded-lg border p-0.5 text-xs">
              {(['all', 'active', 'invited', 'inactive'] as const).map((s) => (
                <button key={s} type="button" onClick={() => setStatusFilter(s)}
                  className={cn('rounded-md px-2.5 py-1 font-medium capitalize transition-colors',
                    statusFilter === s ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground')}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            {/* Role filter */}
            <div className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
                className="h-8 rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="all">All roles</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="agent">Agent</option>
              </select>
            </div>

            <div className="relative ml-auto">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, tenant…" className="h-8 w-60 pl-8 text-xs" />
              {search && <button type="button" onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {users.isLoading ? (
            <div className="space-y-2 p-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                    <th className="px-4 py-2.5 font-semibold">User</th>
                    <th className="px-3 py-2.5 font-semibold">Tenant</th>
                    <th className="px-3 py-2.5 font-semibold">Plan</th>
                    <th className="px-3 py-2.5 font-semibold">Role</th>
                    <th className="px-3 py-2.5 font-semibold">Status</th>
                    <th className="px-3 py-2.5 font-semibold">Last login</th>
                    <th className="px-3 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((u) => (
                    <tr key={u.id} className="transition-colors hover:bg-muted/40">
                      <td className="px-4 py-2.5">
                        <p className="font-semibold">{u.name}</p>
                        <p className="text-muted-foreground">{u.email}</p>
                      </td>
                      <td className="px-3 py-2.5">
                        {u.tenantId ? (
                          <Link href={`/tenants/${u.tenantId}`} className="text-primary hover:underline">{u.tenantName}</Link>
                        ) : (
                          <span className="text-muted-foreground">{u.tenantName}</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        {u.tenantId ? (
                          <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize', PLAN_STYLES[u.tenantPlan])}>{u.tenantPlan}</span>
                        ) : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge variant={ROLE_META[u.role].variant} className="text-[10px]">{ROLE_META[u.role].label}</Badge>
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge variant={STATUS_META[u.status].variant} className="text-[10px] capitalize">{u.status}</Badge>
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">{u.lastLoginAt ? formatAgo(u.lastLoginAt) : 'Never'}</td>
                      <td className="px-3 py-2.5">
                        <Button size="sm" variant="outline" className="h-6 px-2 text-[10px]">Actions</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">No users match your filters.</p>}
            </div>
          )}
          <div className="border-t bg-muted/20 px-4 py-2.5">
            <p className="text-xs text-muted-foreground">Showing {filtered.length} of {users.data?.length ?? 0} users</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
