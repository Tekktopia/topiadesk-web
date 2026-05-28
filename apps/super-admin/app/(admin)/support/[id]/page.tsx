'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  AtSign,
  Bold,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock,
  Code,
  ExternalLink,
  Filter,
  Headset,
  Inbox,
  Italic,
  Link as LinkIcon,
  Lock,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Send,
  Shield,
  ShieldAlert,
  Star,
  Tag,
  Ticket,
  Underline,
  UserCheck,
  UserCog,
  Users,
  X,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Separator,
  Skeleton,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from '@topiadesk/ui';
import {
  findCsrTicket,
  getTenantSupportProfile,
  CSR_TEAM,
  type CsrPriority,
  type CsrStatus,
} from '@/lib/support-tickets';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const STATUS_META: Record<CsrStatus, { label: string; cls: string; dot: string }> = {
  new:             { label: 'New',             cls: 'bg-coral/10 text-coral-dark border-coral/20',       dot: 'bg-coral' },
  in_progress:     { label: 'In progress',     cls: 'bg-blue-50 text-blue-700 border-blue-200',          dot: 'bg-blue-500' },
  awaiting_tenant: { label: 'Awaiting tenant', cls: 'bg-amber-50 text-amber-700 border-amber-200',       dot: 'bg-amber-500' },
  resolved:        { label: 'Resolved',        cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  closed:          { label: 'Closed',          cls: 'bg-muted text-muted-foreground border-border',      dot: 'bg-muted-foreground' },
};

const PRIORITY_META: Record<CsrPriority, { label: string; color: string }> = {
  urgent: { label: 'Urgent', color: 'text-red-600'    },
  high:   { label: 'High',   color: 'text-orange-600' },
  medium: { label: 'Medium', color: 'text-amber-600'  },
  low:    { label: 'Low',    color: 'text-slate-500'  },
};

const CHANNEL_META = {
  email:  { label: 'Email',    icon: Mail,           color: 'text-blue-500'    },
  chat:   { label: 'Chat',     icon: MessageCircle,  color: 'text-emerald-500' },
  phone:  { label: 'Phone',    icon: Headset,        color: 'text-amber-500'   },
  portal: { label: 'Portal',   icon: Inbox,          color: 'text-slate-500'   },
} as const;

function formatAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60)   return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CsrTicketDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const ticket = findCsrTicket(id);
  const tenant = ticket ? getTenantSupportProfile(ticket.tenantId) : undefined;

  const [mode,  setMode]  = useState<'reply' | 'note' | 'forward'>('reply');
  const [body,  setBody]  = useState('');
  const [showCc, setShowCc] = useState(false);
  const [ccTo, setCcTo] = useState('');

  if (!ticket) {
    return (
      <div className="flex h-[calc(100vh-3rem)] items-center justify-center">
        <div className="text-center">
          <Ticket className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <p className="mt-3 text-sm font-medium">Ticket not found</p>
          <p className="text-xs text-muted-foreground">The ticket ID does not exist.</p>
          <Link href="/support" className="mt-3 inline-block">
            <Button size="sm" variant="outline">Back to support queue</Button>
          </Link>
        </div>
      </div>
    );
  }

  const status   = STATUS_META[ticket.status];
  const priority = PRIORITY_META[ticket.priority];
  const channel  = CHANNEL_META[ticket.channel];
  const ChIcon   = channel.icon;

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
      {/* Hero */}
      <div className="shrink-0 p-5 pb-0">
        <header className="relative overflow-hidden rounded-2xl bg-navy px-6 py-5 shadow-lg shadow-navy/15">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative">
            <Link href="/support" className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white/90 transition-colors">
              <ArrowLeft className="h-3 w-3" /> Support queue
            </Link>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-white/60">{ticket.number}</span>
                  <span className={cn('inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold', status.cls)}>
                    <span className={cn('h-1 w-1 rounded-full', status.dot)} />
                    {status.label}
                  </span>
                  <span className={cn('text-[10px] font-semibold', priority.color)}>· {priority.label} priority</span>
                  {ticket.vipTenant && (
                    <Badge className="border-coral/30 bg-coral/15 text-[10px] text-coral-light">
                      <Star className="h-2.5 w-2.5" />VIP
                    </Badge>
                  )}
                </div>
                <h1 className="mt-1 max-w-2xl font-display text-xl font-bold tracking-tight text-white">
                  {ticket.subject}
                </h1>
                <p className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-white/70">
                  <span className="flex items-center gap-1"><ChIcon className={cn('h-3 w-3', channel.color)} /> {channel.label}</span>
                  <span>·</span>
                  <span>From <Link href={`/support/tenant/${ticket.tenantId}`} className="text-white hover:underline">{ticket.tenantName}</Link></span>
                  <span>·</span>
                  <span>Opened {formatAgo(ticket.createdAt)}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                  <UserCheck className="h-3 w-3" />Assign
                </Button>
                <Button size="sm" className="bg-coral text-white hover:bg-coral-dark">
                  <CheckCircle2 className="h-3 w-3" />Mark resolved
                </Button>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Body — conversation (2/3) + sidebar (1/3) */}
      <div className="flex-1 min-h-0 grid gap-5 overflow-hidden p-5 pt-5 lg:grid-cols-[1fr_360px]">
        {/* ─── Conversation ─── */}
        <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border/70 bg-card">
          {/* Sticky title bar */}
          <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">Conversation</p>
              <Badge variant="secondary" className="text-[10px]">{(ticket.thread?.length ?? 1)} messages</Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Forward to tenant…</DropdownMenuItem>
                <DropdownMenuItem>Merge with another ticket</DropdownMenuItem>
                <DropdownMenuItem>Download transcript</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Move to spam</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Scrolling message thread */}
          <div className="flex-1 min-h-0 space-y-3 overflow-y-auto p-4">
            {(ticket.thread ?? [{
              id: 'r0',
              authorType: 'tenant' as const,
              authorName: ticket.requesterName,
              authorEmail: ticket.requesterEmail,
              body: ticket.body,
              createdAt: ticket.createdAt,
            }]).map((m) => {
              const isCsr = m.authorType === 'csr';
              const isSys = m.authorType === 'system';
              if (isSys) {
                return (
                  <div key={m.id} className="my-1 flex items-center gap-2 rounded-md border border-dashed border-border bg-muted/30 px-3 py-1.5 text-[11px] text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    <span>{m.body}</span>
                    <span className="ml-auto">{formatAgo(m.createdAt)}</span>
                  </div>
                );
              }
              return (
                <div
                  key={m.id}
                  className={cn(
                    'rounded-lg border p-3',
                    isCsr ? 'border-coral/20 bg-coral/5' : 'border-border bg-card',
                    m.internal && 'border-amber-200 bg-amber-50/50',
                  )}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className={cn(isCsr ? 'bg-coral text-white' : 'bg-navy text-white', 'text-[10px] font-bold')}>
                          {m.authorName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-semibold">{m.authorName}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {m.authorEmail ?? (isCsr ? 'CSR · Topiadesk' : 'Tenant')} · {formatAgo(m.createdAt)}
                        </p>
                      </div>
                      {m.internal && (
                        <Badge variant="warning" className="text-[9px]">
                          <Lock className="h-2.5 w-2.5" />Internal
                        </Badge>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground" title={formatDateTime(m.createdAt)}>
                      {formatDateTime(m.createdAt)}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{m.body}</p>
                </div>
              );
            })}
          </div>

          {/* Reply composer */}
          <div className="shrink-0 border-t border-border/60">
            {/* Mode tabs */}
            <div className="flex items-center gap-1 border-b border-border/50 px-3 py-1.5 text-xs">
              {(['reply', 'note', 'forward'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={cn(
                    'rounded-md px-2.5 py-1 font-medium capitalize transition-colors',
                    mode === m
                      ? 'bg-muted/60 text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {m === 'note' && <Lock className="mr-1 inline-block h-3 w-3" />}
                  {m === 'note' ? 'Internal note' : m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
              <span className="ml-auto text-[10px] text-muted-foreground">
                {mode === 'reply'   && <>Replying to {ticket.requesterName} ({ticket.requesterEmail})</>}
                {mode === 'note'    && <>Internal note — only visible to Topiadesk team</>}
                {mode === 'forward' && <>Forwarding ticket {ticket.number}</>}
              </span>
            </div>

            {/* From / To / Cc (only for reply mode) */}
            {mode === 'reply' && (
              <>
                <div className="flex items-center gap-2 border-b border-border/50 px-3 py-2 text-xs">
                  <span className="w-10 shrink-0 text-muted-foreground">From:</span>
                  <span className="font-medium">support@topiadesk.com</span>
                  <button type="button" onClick={() => setShowCc((c) => !c)} className="ml-auto text-[11px] text-muted-foreground hover:text-foreground">
                    {showCc ? '− Cc' : '+ Cc'}
                  </button>
                </div>
                <div className="flex items-center gap-2 border-b border-border/50 px-3 py-2 text-xs">
                  <span className="w-10 shrink-0 text-muted-foreground">To:</span>
                  <span className="rounded-full border border-border bg-muted/40 px-2 py-0.5">
                    <span className="font-medium">{ticket.requesterName}</span>
                    <span className="ml-1 text-muted-foreground">{ticket.requesterEmail}</span>
                  </span>
                </div>
                {showCc && (
                  <div className="flex items-center gap-2 border-b border-border/50 px-3 py-2 text-xs">
                    <span className="w-10 shrink-0 text-muted-foreground">Cc:</span>
                    <input
                      value={ccTo}
                      onChange={(e) => setCcTo(e.target.value)}
                      className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground/60"
                      placeholder="cc@example.com"
                    />
                  </div>
                )}
              </>
            )}

            {/* Toolbar */}
            <div className="flex items-center gap-1 px-3 py-1.5">
              {[Bold, Italic, Underline, LinkIcon, Code].map((Icon, i) => (
                <Button key={i} variant="ghost" size="icon" className="h-7 w-7"><Icon className="h-3 w-3" /></Button>
              ))}
              <Separator orientation="vertical" className="mx-1 h-4" />
              {[Paperclip, AtSign].map((Icon, i) => (
                <Button key={i} variant="ghost" size="icon" className="h-7 w-7"><Icon className="h-3 w-3" /></Button>
              ))}
            </div>

            <Textarea
              placeholder={
                mode === 'note' ? 'Add an internal note for the team…' :
                mode === 'forward' ? 'Forward this ticket — add context for the recipient…' :
                'Type your reply to the tenant…'
              }
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="resize-none border-0 px-4 py-2 shadow-none focus-visible:ring-0"
            />

            <div className="flex items-center justify-between gap-2 border-t border-border/60 bg-muted/20 px-3 py-2">
              <div className="text-[11px] text-muted-foreground">Press ⌘+Enter to send</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={!body.trim()}>Save draft</Button>
                <Button size="sm" disabled={!body.trim()} className="bg-coral text-white hover:bg-coral-dark">
                  <Send className="h-3 w-3" />
                  {mode === 'note' ? 'Save note' : mode === 'forward' ? 'Forward' : 'Send reply'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Sidebar: tenant + ticket properties ─── */}
        <aside className="hidden min-h-0 flex-col gap-5 overflow-y-auto lg:flex">
          {/* Tenant card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Building2 className="h-4 w-4 text-coral" />
                Tenant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Link href={`/support/tenant/${ticket.tenantId}`} className="font-semibold text-foreground hover:text-coral hover:underline">
                  {ticket.tenantName}
                </Link>
                <p className="text-[11px] capitalize text-muted-foreground">{ticket.tenantPlan} plan</p>
              </div>
              {tenant && (
                <>
                  <Separator />
                  <div className="space-y-1.5 text-xs">
                    <p className="flex items-center gap-2"><Mail className="h-3 w-3 text-muted-foreground" /><span>{tenant.primaryEmail}</span></p>
                    <p className="flex items-center gap-2"><Headset className="h-3 w-3 text-muted-foreground" /><span>{tenant.primaryPhone}</span></p>
                    <p className="flex items-center gap-2"><Building2 className="h-3 w-3 text-muted-foreground" /><span>{tenant.city}, {tenant.country}</span></p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg border bg-muted/30 p-2">
                      <p className="text-sm font-bold text-foreground tabular-nums">{tenant.metrics.ticketsOpened30d}</p>
                      <p className="text-[9px] uppercase tracking-wide text-muted-foreground">30d tickets</p>
                    </div>
                    <div className="rounded-lg border bg-muted/30 p-2">
                      <p className="text-sm font-bold text-emerald-600 tabular-nums">{tenant.metrics.csatScore || '—'}</p>
                      <p className="text-[9px] uppercase tracking-wide text-muted-foreground">CSAT</p>
                    </div>
                    <div className="rounded-lg border bg-muted/30 p-2">
                      <p className={cn('text-sm font-bold tabular-nums', tenant.health.healthScore >= 80 ? 'text-emerald-600' : tenant.health.healthScore >= 60 ? 'text-amber-600' : 'text-red-600')}>
                        {tenant.health.healthScore}
                      </p>
                      <p className="text-[9px] uppercase tracking-wide text-muted-foreground">Health</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={`/support/tenant/${ticket.tenantId}`}>
                      <ExternalLink className="h-3 w-3" />View full tenant profile
                    </Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Ticket properties */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {[
                { label: 'Status',     value: <span className={cn('inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold', status.cls)}><span className={cn('h-1 w-1 rounded-full', status.dot)} />{status.label}</span> },
                { label: 'Priority',   value: <span className={priority.color}>{priority.label}</span> },
                { label: 'Category',   value: ticket.category.replace('_', ' ') },
                { label: 'Channel',    value: <span className="inline-flex items-center gap-1"><ChIcon className={cn('h-3 w-3', channel.color)} />{channel.label}</span> },
                { label: 'Assignee',   value: ticket.assignee ? ticket.assignee.name : <span className="text-muted-foreground">Unassigned</span> },
                { label: 'Requester',  value: ticket.requesterName },
                { label: 'Email',      value: <a href={`mailto:${ticket.requesterEmail}`} className="text-coral hover:underline">{ticket.requesterEmail}</a> },
                { label: 'Created',    value: formatDateTime(ticket.createdAt) },
                { label: 'Updated',    value: formatAgo(ticket.updatedAt) },
                { label: 'SLA due',    value: (
                  ticket.sla === 'breached'
                    ? <span className="flex items-center gap-1 text-red-600 font-semibold"><ShieldAlert className="h-3 w-3" />Breached</span>
                    : ticket.sla === 'at_risk'
                      ? <span className="flex items-center gap-1 text-amber-600 font-semibold"><Clock className="h-3 w-3" />{formatAgo(ticket.slaDueAt).replace('ago', 'overdue')}</span>
                      : <span className="text-emerald-600">{formatAgo(ticket.slaDueAt).replace('ago', 'remaining')}</span>
                ) },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 border-b border-border/40 py-1.5 last:border-0">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="text-right text-foreground">{row.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tags */}
          {ticket.tags && ticket.tags.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {ticket.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[11px] text-foreground">
                      <Tag className="h-2.5 w-2.5 text-muted-foreground" />{tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <UserCheck className="h-3 w-3" />Assign to me
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <Clock className="h-3 w-3" />Snooze 24h
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <CheckCircle2 className="h-3 w-3" />Mark resolved
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs text-red-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700">
                <X className="h-3 w-3" />Close ticket
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
