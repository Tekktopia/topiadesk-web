'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock,
  Filter,
  Headset,
  Inbox,
  Mail,
  MessageCircle,
  Plus,
  Search,
  ShieldAlert,
  Star,
  Ticket,
  UserCheck,
  X,
  Zap,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Input,
  cn,
} from '@topiadesk/ui';
import {
  MOCK_CSR_TICKETS,
  type CsrStatus,
  type CsrPriority,
  type CsrCategory,
  type CsrTicket,
} from '@/lib/support-tickets';

const STATUS_META: Record<CsrStatus, { label: string; cls: string; dot: string }> = {
  new:             { label: 'New',             cls: 'bg-coral/10 text-coral-dark border-coral/20', dot: 'bg-coral' },
  in_progress:     { label: 'In progress',     cls: 'bg-blue-50 text-blue-700 border-blue-200',    dot: 'bg-blue-500' },
  awaiting_tenant: { label: 'Awaiting tenant', cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  resolved:        { label: 'Resolved',        cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  closed:          { label: 'Closed',          cls: 'bg-muted text-muted-foreground border-border', dot: 'bg-muted-foreground' },
};

const PRIORITY_META: Record<CsrPriority, { label: string; color: string; dot: string }> = {
  urgent: { label: 'Urgent', color: 'text-red-600',    dot: 'bg-red-500' },
  high:   { label: 'High',   color: 'text-orange-600', dot: 'bg-orange-500' },
  medium: { label: 'Medium', color: 'text-amber-600',  dot: 'bg-amber-500' },
  low:    { label: 'Low',    color: 'text-slate-500',  dot: 'bg-slate-400' },
};

const CATEGORY_LABEL: Record<CsrCategory, string> = {
  billing:        'Billing',
  auth:           'Auth & access',
  integration:    'Integrations',
  data:           'Data',
  feature_request:'Feature request',
  bug:            'Bug',
  general:        'General',
};

const CHANNEL_META: Record<CsrTicket['channel'], { icon: typeof Mail; color: string }> = {
  email:  { icon: Mail, color: 'text-blue-500' },
  chat:   { icon: MessageCircle, color: 'text-emerald-500' },
  phone:  { icon: Headset, color: 'text-amber-500' },
  portal: { icon: Inbox, color: 'text-slate-500' },
};

function formatAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 0)    return `${Math.abs(mins)}m overdue`;
  if (mins < 60)   return `${mins}m`;
  if (mins < 1440) return `${Math.round(mins / 60)}h`;
  return `${Math.round(mins / 1440)}d`;
}

function formatRel(iso: string) {
  const ago = formatAgo(iso);
  return ago.includes('overdue') ? ago : `${ago} ago`;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CsrSupportPage() {
  const [statusFilter,   setStatusFilter]   = useState<'all' | CsrStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | CsrPriority>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<'all' | 'mine' | 'unassigned'>('all');
  const [search,         setSearch]         = useState('');

  const counts = useMemo(() => {
    const all = MOCK_CSR_TICKETS;
    return {
      total: all.length,
      open:        all.filter((t) => t.status !== 'resolved' && t.status !== 'closed').length,
      breached:    all.filter((t) => t.sla === 'breached' && t.status !== 'resolved' && t.status !== 'closed').length,
      at_risk:     all.filter((t) => t.sla === 'at_risk'  && t.status !== 'resolved' && t.status !== 'closed').length,
      new:             all.filter((t) => t.status === 'new').length,
      in_progress:     all.filter((t) => t.status === 'in_progress').length,
      awaiting_tenant: all.filter((t) => t.status === 'awaiting_tenant').length,
      resolved:        all.filter((t) => t.status === 'resolved').length,
      closed:          all.filter((t) => t.status === 'closed').length,
      unassigned:      all.filter((t) => !t.assignee).length,
    };
  }, []);

  const filtered = useMemo(() => {
    return MOCK_CSR_TICKETS.filter((t) => {
      if (statusFilter   !== 'all' && t.status   !== statusFilter)   return false;
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
      if (assigneeFilter === 'mine'       && t.assignee?.name !== 'Daniel Oshinubi') return false;
      if (assigneeFilter === 'unassigned' && t.assignee)             return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return t.subject.toLowerCase().includes(q)
            || t.tenantName.toLowerCase().includes(q)
            || t.requesterName.toLowerCase().includes(q)
            || t.requesterEmail.toLowerCase().includes(q)
            || t.number.toLowerCase().includes(q);
      }
      return true;
    });
  }, [statusFilter, priorityFilter, assigneeFilter, search]);

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
      {/* Hero */}
      <div className="shrink-0 p-5 pb-0">
        <header className="relative overflow-hidden rounded-2xl bg-navy px-6 py-5 shadow-lg shadow-navy/15">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Customer Support</p>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">Tenant Support Tickets</h1>
              <p className="mt-0.5 text-sm text-white/70">
                {counts.open} open · {counts.breached} SLA breached · {counts.unassigned} unassigned · {counts.total} total
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Inbox className="h-3 w-3" />My queue
              </Button>
              <Button size="sm" className="bg-coral text-white hover:bg-coral-dark">
                <Plus className="h-3 w-3" />New ticket
              </Button>
            </div>
          </div>
        </header>
      </div>

      {/* Pinned KPI + filter strip */}
      <div className="shrink-0 space-y-5 px-5 pt-5">
        {/* KPI tiles */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: 'Open',            value: counts.open,            icon: Ticket,         color: 'text-foreground' },
            { label: 'SLA breached',    value: counts.breached,        icon: AlertTriangle,  color: counts.breached > 0 ? 'text-red-600' : 'text-foreground' },
            { label: 'At risk',         value: counts.at_risk,         icon: Clock,          color: counts.at_risk  > 0 ? 'text-amber-600' : 'text-foreground' },
            { label: 'Unassigned',      value: counts.unassigned,      icon: UserCheck,      color: counts.unassigned > 0 ? 'text-coral' : 'text-foreground' },
            { label: 'Resolved today',  value: counts.resolved,        icon: CheckCircle2,   color: 'text-emerald-600' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border bg-card px-4 py-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</p>
                <s.icon className={cn('h-3.5 w-3.5 opacity-40', s.color)} />
              </div>
              <p className={cn('mt-1 text-xl font-bold tabular-nums', s.color)}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter strip */}
        <div className="rounded-t-xl border border-b-0 border-border/70 bg-card px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Status tabs */}
            <div className="flex flex-wrap rounded-lg border p-0.5 text-xs">
              {([
                { key: 'all',             label: `All (${counts.total})` },
                { key: 'new',             label: `New (${counts.new})` },
                { key: 'in_progress',     label: `In progress (${counts.in_progress})` },
                { key: 'awaiting_tenant', label: `Awaiting (${counts.awaiting_tenant})` },
                { key: 'resolved',        label: `Resolved (${counts.resolved})` },
                { key: 'closed',          label: `Closed (${counts.closed})` },
              ] as { key: typeof statusFilter; label: string }[]).map((s) => (
                <button key={s.key} type="button" onClick={() => setStatusFilter(s.key)}
                  className={cn('rounded-md px-2.5 py-1 font-medium transition-colors',
                    statusFilter === s.key ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground')}>
                  {s.label}
                </button>
              ))}
            </div>

            {/* Assignee filter */}
            <div className="flex items-center gap-1">
              <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
              <select value={assigneeFilter} onChange={(e) => setAssigneeFilter(e.target.value as typeof assigneeFilter)}
                className="h-8 rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="all">All assignees</option>
                <option value="mine">Assigned to me</option>
                <option value="unassigned">Unassigned</option>
              </select>
            </div>

            {/* Priority filter */}
            <div className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as typeof priorityFilter)}
                className="h-8 rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="all">All priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative ml-auto">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ticket #, subject, tenant, requester…" className="h-8 w-72 pl-8 text-xs" />
              {search && (
                <button type="button" onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll body — table */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-5">
        <div className="rounded-b-xl border border-t-0 border-border/70 bg-card">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Ticket className="mb-2 h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm font-medium text-foreground">No tickets match your filters</p>
              <p className="text-xs text-muted-foreground">Try clearing search or switching status.</p>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead className="sticky top-0 z-10 bg-[#F4EFE6] shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
                <tr className="border-b border-border/60 text-left text-muted-foreground">
                  <th className="px-4 py-2.5 font-semibold">Ticket</th>
                  <th className="px-3 py-2.5 font-semibold">Tenant</th>
                  <th className="px-3 py-2.5 font-semibold">Category</th>
                  <th className="px-3 py-2.5 font-semibold">Priority</th>
                  <th className="px-3 py-2.5 font-semibold">Status</th>
                  <th className="px-3 py-2.5 font-semibold">Assignee</th>
                  <th className="px-3 py-2.5 font-semibold">SLA</th>
                  <th className="px-3 py-2.5 font-semibold">Last update</th>
                  <th className="px-3 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((t) => {
                  const st = STATUS_META[t.status];
                  const pr = PRIORITY_META[t.priority];
                  const ch = CHANNEL_META[t.channel];
                  const ChIcon = ch.icon;
                  return (
                    <tr key={t.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3 align-top">
                        <div className="flex items-start gap-2">
                          <ChIcon className={cn('mt-0.5 h-3.5 w-3.5 shrink-0', ch.color)} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <Link href={`/support/${t.id}`} className="font-mono text-[11px] text-muted-foreground hover:underline">{t.number}</Link>
                              {t.vipTenant && (
                                <Badge variant="secondary" className="border-coral/30 bg-coral/8 text-[9px] text-coral-dark">
                                  <Star className="h-2.5 w-2.5" />VIP
                                </Badge>
                              )}
                            </div>
                            <Link href={`/support/${t.id}`} className="block max-w-md truncate font-semibold text-foreground hover:text-coral">
                              {t.subject}
                            </Link>
                            <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                              {t.requesterName} · {t.requesterEmail} · {t.replies} {t.replies === 1 ? 'reply' : 'replies'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 align-top">
                        <Link href={`/support/tenant/${t.tenantId}`} className="flex items-center gap-1.5 hover:text-coral">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">{t.tenantName}</span>
                        </Link>
                        <p className="mt-0.5 text-[10px] text-muted-foreground capitalize">{t.tenantPlan}</p>
                      </td>
                      <td className="px-3 py-3 align-top text-muted-foreground">{CATEGORY_LABEL[t.category]}</td>
                      <td className="px-3 py-3 align-top">
                        <div className="flex items-center gap-1.5">
                          <span className={cn('h-1.5 w-1.5 rounded-full', pr.dot)} />
                          <span className={cn('font-medium', pr.color)}>{pr.label}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 align-top">
                        <span className={cn('inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold', st.cls)}>
                          <span className={cn('h-1 w-1 rounded-full', st.dot)} />
                          {st.label}
                        </span>
                      </td>
                      <td className="px-3 py-3 align-top">
                        {t.assignee ? (
                          <div className="flex items-center gap-1.5">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="bg-coral text-[9px] font-bold text-white">{t.assignee.initials}</AvatarFallback>
                            </Avatar>
                            <span className="text-[11px]">{t.assignee.name.split(' ')[0]}</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 align-top">
                        {t.status === 'resolved' || t.status === 'closed' ? (
                          <span className="text-[10px] text-muted-foreground">—</span>
                        ) : t.sla === 'breached' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-600">
                            <ShieldAlert className="h-2.5 w-2.5" />Breached
                          </span>
                        ) : t.sla === 'at_risk' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                            <Clock className="h-2.5 w-2.5" />Due in {formatAgo(t.slaDueAt)}
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-600">{formatAgo(t.slaDueAt)} left</span>
                        )}
                      </td>
                      <td className="px-3 py-3 align-top text-[10px] text-muted-foreground">{formatRel(t.updatedAt)}</td>
                      <td className="px-3 py-3 align-top">
                        <Button asChild size="sm" variant="outline" className="h-7 px-2 text-[10px]">
                          <Link href={`/support/${t.id}`}>
                            Open<ArrowUpRight className="h-3 w-3" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-2.5">
            <p className="text-xs text-muted-foreground">
              Showing {filtered.length} of {MOCK_CSR_TICKETS.length} tickets
            </p>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Zap className="h-3 w-3 text-coral" />
              Tier-1 response SLA: 30 min · Tier-2: 2 h · Critical: 15 min
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
