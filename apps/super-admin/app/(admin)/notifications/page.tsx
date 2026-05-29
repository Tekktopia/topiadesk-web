'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Bell,
  CheckCheck,
  CheckCircle2,
  CreditCard,
  Filter,
  MailWarning,
  MoreHorizontal,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  Sparkles,
  Trash2,
  Ticket,
  UserPlus,
  X,
} from 'lucide-react';
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  cn,
} from '@topiadesk/ui';

// ─── Mock notifications ──────────────────────────────────────────────────────

type NotificationType =
  | 'security'
  | 'billing'
  | 'tenant'
  | 'system'
  | 'ticket'
  | 'product';

interface PlatformNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: { href: string; label: string };
  createdAt: string;
  read: boolean;
  priority: 'critical' | 'high' | 'normal';
}

const NOTIFICATIONS: PlatformNotification[] = [
  {
    id: 'n-001',
    type: 'security',
    priority: 'critical',
    title: 'Brute force attempt blocked',
    body: '47 failed login attempts from 196.42.18.221 targeting tenant ConsomoAfrica. IP automatically blocklisted.',
    link: { href: '/security', label: 'Review security event' },
    createdAt: new Date(Date.now() - 12 * 60_000).toISOString(),
    read: false,
  },
  {
    id: 'n-002',
    type: 'billing',
    priority: 'high',
    title: 'Payment failure — DakarLink',
    body: 'Stripe charge of $499 declined on trial card. Retry scheduled in 24h. Customer notified by email.',
    link: { href: '/billing', label: 'Open billing' },
    createdAt: new Date(Date.now() - 32 * 60_000).toISOString(),
    read: false,
  },
  {
    id: 'n-003',
    type: 'tenant',
    priority: 'normal',
    title: 'New tenant onboarded',
    body: 'AbujaTech Hub (abujatech.topiadesk.com) completed signup on the Starter plan. 3 agents seeded.',
    link: { href: '/tenants', label: 'View tenant' },
    createdAt: new Date(Date.now() - 2 * 3_600_000).toISOString(),
    read: false,
  },
  {
    id: 'n-004',
    type: 'system',
    priority: 'high',
    title: 'eu-west-1 latency degraded',
    body: 'Average API response time elevated to 412ms over the last 15 minutes (baseline: 180ms). On-call engineer paged.',
    link: { href: '/system', label: 'System health' },
    createdAt: new Date(Date.now() - 4 * 3_600_000).toISOString(),
    read: true,
  },
  {
    id: 'n-005',
    type: 'ticket',
    priority: 'normal',
    title: 'Escalated support ticket',
    body: 'Tunde (KasiPay) opened CSR ticket #CSR-1042: "Cannot disable MFA after admin left company". SLA: 2h.',
    link: { href: '/tickets', label: 'Open ticket' },
    createdAt: new Date(Date.now() - 6 * 3_600_000).toISOString(),
    read: true,
  },
  {
    id: 'n-006',
    type: 'product',
    priority: 'normal',
    title: 'New feature rolled out',
    body: 'AI Reply Suggestions are now enabled by default on Business and Enterprise plans. See announcement.',
    link: { href: '/announcements', label: 'Read announcement' },
    createdAt: new Date(Date.now() - 1 * 86_400_000).toISOString(),
    read: true,
  },
  {
    id: 'n-007',
    type: 'security',
    priority: 'high',
    title: 'Admin role granted',
    body: 'Daniel Oshinubi granted Super Admin role to amara@topiadesk.com. Review and revoke if not authorized.',
    link: { href: '/users', label: 'Review users' },
    createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    read: true,
  },
  {
    id: 'n-008',
    type: 'billing',
    priority: 'normal',
    title: 'Invoice generated',
    body: 'Monthly invoices for May 2026 generated. $14,892 total across 12 paying tenants.',
    link: { href: '/billing', label: 'View invoices' },
    createdAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
    read: true,
  },
];

const TYPE_META: Record<NotificationType, { label: string; icon: typeof Bell; color: string; bg: string }> = {
  security: { label: 'Security', icon: ShieldAlert, color: 'text-red-600',     bg: 'bg-red-50' },
  billing:  { label: 'Billing',  icon: CreditCard,  color: 'text-emerald-600', bg: 'bg-emerald-50' },
  tenant:   { label: 'Tenant',   icon: UserPlus,    color: 'text-blue-600',    bg: 'bg-blue-50' },
  system:   { label: 'System',   icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
  ticket:   { label: 'Ticket',   icon: Ticket,      color: 'text-coral-dark',  bg: 'bg-coral/8' },
  product:  { label: 'Product',  icon: Sparkles,    color: 'text-indigo-600',  bg: 'bg-indigo-50' },
};

function formatAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60)   return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [items,        setItems       ] = useState(NOTIFICATIONS);
  const [search,       setSearch      ] = useState('');
  const [typeFilter,   setTypeFilter  ] = useState<'all' | NotificationType>('all');
  const [readFilter,   setReadFilter  ] = useState<'all' | 'unread' | 'read'>('all');

  const counts = useMemo(() => {
    const all = items;
    return {
      total:    all.length,
      unread:   all.filter((n) => !n.read).length,
      critical: all.filter((n) => n.priority === 'critical' && !n.read).length,
      types: {
        security: all.filter((n) => n.type === 'security').length,
        billing:  all.filter((n) => n.type === 'billing').length,
        tenant:   all.filter((n) => n.type === 'tenant').length,
        system:   all.filter((n) => n.type === 'system').length,
        ticket:   all.filter((n) => n.type === 'ticket').length,
        product:  all.filter((n) => n.type === 'product').length,
      },
    };
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((n) => {
      if (typeFilter !== 'all' && n.type !== typeFilter) return false;
      if (readFilter === 'unread' && n.read)             return false;
      if (readFilter === 'read'   && !n.read)            return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!n.title.toLowerCase().includes(q) && !n.body.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [items, typeFilter, readFilter, search]);

  function toggleRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  }
  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }
  function remove(id: string) {
    setItems((prev) => prev.filter((n) => n.id !== id));
  }

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
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">Notifications</h1>
              <p className="mt-0.5 text-sm text-white/70">
                {counts.unread} unread · {counts.critical} critical · {counts.total} total
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                onClick={markAllRead}
                disabled={counts.unread === 0}
              >
                <CheckCheck className="h-3 w-3" />Mark all read
              </Button>
              <Button size="sm" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" asChild>
                <Link href="/settings"><Settings className="h-3 w-3" />Preferences</Link>
              </Button>
            </div>
          </div>
        </header>
      </div>

      {/* Pinned KPI + filter strip */}
      <div className="shrink-0 space-y-5 px-5 pt-5">
        {/* Summary */}
        <div className="flex flex-wrap gap-3 text-xs">
          {[
            { label: 'Unread',      value: counts.unread,   color: counts.unread   > 0 ? 'text-coral'        : 'text-foreground' },
            { label: 'Critical',    value: counts.critical, color: counts.critical > 0 ? 'text-red-600'     : 'text-foreground' },
            { label: 'Security',    value: counts.types.security, color: 'text-red-600' },
            { label: 'Billing',     value: counts.types.billing,  color: 'text-emerald-600' },
            { label: 'System',      value: counts.types.system,   color: 'text-amber-600' },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border bg-card px-4 py-2.5">
              <p className={cn('text-lg font-bold tabular-nums', s.color)}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter strip */}
        <div className="rounded-t-xl border border-b-0 border-border/70 bg-card px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Read filter */}
            <div className="flex rounded-lg border p-0.5 text-xs">
              {([
                { key: 'all',    label: 'All' },
                { key: 'unread', label: `Unread (${counts.unread})` },
                { key: 'read',   label: 'Read' },
              ] as const).map((s) => (
                <button key={s.key} type="button" onClick={() => setReadFilter(s.key)}
                  className={cn('rounded-md px-2.5 py-1 font-medium transition-colors',
                    readFilter === s.key ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground')}>
                  {s.label}
                </button>
              ))}
            </div>

            {/* Type filter */}
            <div className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
                className="h-8 rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="all">All types</option>
                {Object.entries(TYPE_META).map(([k, m]) => (
                  <option key={k} value={k}>{m.label} ({counts.types[k as NotificationType]})</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="relative ml-auto">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notifications…" className="h-8 w-64 pl-8 text-xs" />
              {search && (
                <button type="button" onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll body */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-5">
        <div className="rounded-b-xl border border-t-0 border-border/70 bg-card">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Bell className="mb-2 h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm font-medium text-foreground">All caught up</p>
              <p className="text-xs text-muted-foreground">No notifications match your filters.</p>
            </div>
          ) : (
            <ul className="divide-y">
              {filtered.map((n) => {
                const meta = TYPE_META[n.type];
                const Icon = meta.icon;
                return (
                  <li
                    key={n.id}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 transition-colors',
                      n.read ? 'hover:bg-muted/30' : 'bg-coral/4 hover:bg-coral/6',
                    )}
                  >
                    {/* Type icon */}
                    <div className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', meta.bg)}>
                      <Icon className={cn('h-4 w-4', meta.color)} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <div className="flex items-center gap-2">
                          {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />}
                          <p className={cn('text-sm', n.read ? 'font-medium text-foreground' : 'font-semibold text-foreground')}>
                            {n.title}
                          </p>
                          {n.priority === 'critical' && (
                            <Badge variant="danger" className="text-[10px]">Critical</Badge>
                          )}
                          {n.priority === 'high' && (
                            <Badge variant="warning" className="text-[10px]">High</Badge>
                          )}
                        </div>
                        <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">
                          {formatAgo(n.createdAt)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                      <div className="mt-2 flex items-center gap-3">
                        {n.link && (
                          <Link href={n.link.href} className="text-xs font-medium text-coral hover:underline">
                            {n.link.label} →
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleRead(n.id)}
                          className="text-[11px] text-muted-foreground hover:text-foreground"
                        >
                          {n.read ? 'Mark as unread' : 'Mark as read'}
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => toggleRead(n.id)}>
                          {n.read
                            ? <><MailWarning className="h-3.5 w-3.5" />Mark as unread</>
                            : <><CheckCircle2 className="h-3.5 w-3.5" />Mark as read</>}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="h-3.5 w-3.5" />Mute this type
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => remove(n.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />Dismiss
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-2.5">
            <p className="text-xs text-muted-foreground">
              Showing {filtered.length} of {items.length} notifications
            </p>
            <Link href="/settings" className="text-[11px] text-muted-foreground hover:text-foreground">
              Configure email digest →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
