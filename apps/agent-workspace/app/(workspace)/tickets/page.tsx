'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Bot,
  CheckCircle2,
  Clock,
  Code,
  Database,
  Filter,
  Globe,
  Inbox,
  Mail,
  MessageSquare,
  MonitorSmartphone,
  MoreHorizontal,
  Pause,
  Phone,
  Plus,
  Reply,
  Search,
  Smartphone,
  Star,
  Tag,
  UserPlus,
  X,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from '@topiadesk/ui';
import { useTickets } from '@/lib/queries';
import { mockAISuggestions } from '@/lib/mock-data';
import type {
  MockTicket,
  TicketChannel,
  TicketPriority,
  TicketStatus,
} from '@/lib/mock-data';
import { initials, relativeTime } from '@/lib/format';

// ─── Helpers / meta ──────────────────────────────────────────────────────────

const CURRENT_AGENT_ID = 'a1';

interface View {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  /** When set, becomes a coral active dot on the row */
  tone?: 'default' | 'danger' | 'warning' | 'success';
  filter: (t: MockTicket) => boolean;
}

const VIEWS: View[] = [
  { id: 'open',       label: 'Open',         icon: Inbox,         filter: (t) => !['resolved','closed'].includes(t.status) },
  { id: 'awaiting',   label: 'Awaiting',     icon: Clock,         filter: (t) => t.status === 'pending' || t.status === 'on_hold' },
  { id: 'snoozed',    label: 'Snoozed',      icon: Pause,         filter: (t) => t.status === 'on_hold' },
  { id: 'overdue',    label: 'Overdue SLA',  icon: AlertTriangle, tone: 'danger', filter: (t) => t.slaStatus === 'breached' || t.slaStatus === 'at_risk' },
  { id: 'mine',       label: 'Assigned to me', icon: Star,        filter: (t) => t.assignee?.id === CURRENT_AGENT_ID && !['resolved','closed'].includes(t.status) },
  { id: 'unassigned', label: 'Unassigned',   icon: UserPlus,      filter: (t) => !t.assignee },
  { id: 'resolved',   label: 'Resolved',     icon: CheckCircle2,  tone: 'success', filter: (t) => t.status === 'resolved' },
];

const CHANNEL_META: Record<TicketChannel, { label: string; icon: ComponentType<{ className?: string }>; color: string }> = {
  email:     { label: 'Email',      icon: Mail,              color: 'text-blue-500'   },
  portal:    { label: 'Portal',     icon: Globe,             color: 'text-indigo-500' },
  whatsapp:  { label: 'WhatsApp',   icon: Smartphone,        color: 'text-emerald-500'},
  voice:     { label: 'Voice',      icon: Phone,             color: 'text-amber-500'  },
  sms:       { label: 'SMS',        icon: MessageSquare,     color: 'text-violet-500' },
  widget:    { label: 'Widget',     icon: MonitorSmartphone, color: 'text-rose-500'   },
  api:       { label: 'API',        icon: Code,              color: 'text-slate-500'  },
};

const STATUS_META: Record<TicketStatus, { label: string; cls: string; dot: string }> = {
  new:         { label: 'New',         cls: 'bg-blue-50 text-blue-700 border-blue-200',          dot: 'bg-blue-500'   },
  open:        { label: 'Open',        cls: 'bg-coral/8 text-coral-dark border-coral/20',        dot: 'bg-coral'      },
  in_progress: { label: 'In progress', cls: 'bg-amber-50 text-amber-700 border-amber-200',       dot: 'bg-amber-500'  },
  pending:     { label: 'Pending',     cls: 'bg-slate-50 text-slate-700 border-slate-200',       dot: 'bg-slate-400'  },
  on_hold:     { label: 'On hold',     cls: 'bg-purple-50 text-purple-700 border-purple-200',    dot: 'bg-purple-400' },
  escalated:   { label: 'Escalated',   cls: 'bg-red-50 text-red-700 border-red-200',             dot: 'bg-red-500'    },
  resolved:    { label: 'Resolved',    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500'},
  closed:      { label: 'Closed',      cls: 'bg-muted text-muted-foreground border-border',      dot: 'bg-muted-foreground'},
};

const PRIORITY_META: Record<TicketPriority, { label: string; color: string; ring: string }> = {
  urgent: { label: 'Urgent', color: 'text-red-600',    ring: 'ring-red-200'    },
  high:   { label: 'High',   color: 'text-orange-600', ring: 'ring-orange-200' },
  medium: { label: 'Medium', color: 'text-amber-600',  ring: 'ring-amber-200'  },
  low:    { label: 'Low',    color: 'text-slate-500',  ring: 'ring-slate-200'  },
};

// Avatar color from name (deterministic)
function avatarColor(name: string) {
  const palette = ['bg-coral', 'bg-navy', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-500', 'bg-rose-500', 'bg-cyan-600'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return palette[hash % palette.length]!;
}

// ─── Left rail ────────────────────────────────────────────────────────────────

function LeftRail({
  activeView,
  onSelect,
  counts,
  channelCounts,
}: {
  activeView: string;
  onSelect: (id: string) => void;
  counts: Record<string, number>;
  channelCounts: Record<TicketChannel, number>;
}) {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-border/60 bg-card/40 md:flex">
      <div className="flex h-12 items-center justify-between px-4 border-b border-border/60">
        <p className="text-sm font-semibold text-foreground">Inbox</p>
        <button
          type="button"
          className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="New view"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {/* Views */}
        <ul className="space-y-0.5">
          {VIEWS.map((v) => {
            const Icon = v.icon;
            const active = activeView === v.id;
            const count = counts[v.id] ?? 0;
            return (
              <li key={v.id}>
                <button
                  type="button"
                  onClick={() => onSelect(v.id)}
                  className={cn(
                    'group flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-all',
                    active
                      ? 'nav-pill-active text-foreground font-semibold'
                      : 'text-foreground/70 hover:bg-cream-deep/40 hover:text-foreground',
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className={cn(
                      'h-4 w-4 shrink-0',
                      active
                        ? v.tone === 'danger' ? 'text-red-500'
                          : v.tone === 'success' ? 'text-emerald-500'
                          : 'text-coral'
                        : 'text-muted-foreground',
                    )} />
                    {v.label}
                  </span>
                  {count > 0 && (
                    <span className={cn(
                      'tabular-nums text-[11px] font-semibold',
                      v.tone === 'danger' ? 'text-red-500' : 'text-muted-foreground',
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Channels */}
        <div className="mt-6">
          <p className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Channels
          </p>
          <ul className="space-y-0.5">
            {(Object.keys(CHANNEL_META) as TicketChannel[]).map((ch) => {
              const meta = CHANNEL_META[ch];
              const Icon = meta.icon;
              const count = channelCounts[ch] ?? 0;
              return (
                <li key={ch}>
                  <button
                    type="button"
                    onClick={() => onSelect(`channel:${ch}`)}
                    className={cn(
                      'group flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-all',
                      activeView === `channel:${ch}`
                        ? 'nav-pill-active text-foreground font-semibold'
                        : 'text-foreground/70 hover:bg-cream-deep/40 hover:text-foreground',
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className={cn('h-4 w-4 shrink-0', meta.color)} />
                      {meta.label}
                    </span>
                    {count > 0 && (
                      <span className="tabular-nums text-[11px] font-semibold text-muted-foreground">
                        {count}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </aside>
  );
}

// ─── Ticket row ───────────────────────────────────────────────────────────────

function TicketRow({
  ticket,
  selected,
  onSelect,
}: {
  ticket: MockTicket;
  selected: boolean;
  onSelect: () => void;
}) {
  const status   = STATUS_META[ticket.status];
  const channel  = CHANNEL_META[ticket.channel];
  const priority = PRIORITY_META[ticket.priority];
  const ChIcon   = channel.icon;
  const hasSuggestion = mockAISuggestions.some(
    (s) => s.ticketId === ticket.id && s.status === 'pending',
  );

  // Latest message snippet
  const lastMsg = ticket.conversations[ticket.conversations.length - 1];
  const snippet = lastMsg?.body ?? ticket.description;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'group relative flex w-full items-start gap-3 border-b border-border/40 px-5 py-3.5 text-left transition-colors',
        selected ? 'bg-coral/5' : 'hover:bg-muted/40',
      )}
    >
      {/* Active indicator strip on selected row */}
      {selected && <span className="absolute inset-y-0 left-0 w-0.5 bg-coral" />}

      {/* Avatar */}
      <div className="relative shrink-0">
        <Avatar className="h-9 w-9">
          <AvatarFallback className={cn(avatarColor(ticket.requester.name), 'text-[11px] font-semibold text-white')}>
            {initials(ticket.requester.name)}
          </AvatarFallback>
        </Avatar>
        <span className={cn(
          'absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-card ring-2 ring-card',
        )}>
          <ChIcon className={cn('h-2.5 w-2.5', channel.color)} />
        </span>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Top row: name + time */}
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {ticket.requester.name}
          </p>
          <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">
            {relativeTime(ticket.updatedAt)}
          </span>
        </div>

        {/* Subject */}
        <p className="mt-0.5 truncate text-sm text-foreground/85">
          {ticket.subject}
        </p>

        {/* Snippet */}
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
          {snippet.replace(/\n/g, ' ').slice(0, 110)}
        </p>

        {/* Meta row: status + priority + tags + AI badge */}
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className={cn('inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold', status.cls)}>
            <span className={cn('h-1 w-1 rounded-full', status.dot)} />
            {status.label}
          </span>
          {(ticket.priority === 'high' || ticket.priority === 'urgent') && (
            <span className={cn('inline-flex items-center gap-1 rounded-full bg-card border border-border px-1.5 py-0.5 text-[10px] font-medium', priority.color)}>
              <span className={cn('h-1 w-1 rounded-full', ticket.priority === 'urgent' ? 'bg-red-500' : 'bg-orange-500')} />
              {priority.label}
            </span>
          )}
          {ticket.slaStatus === 'breached' && (
            <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-600">
              <AlertTriangle className="h-2.5 w-2.5" />SLA breached
            </span>
          )}
          {ticket.slaStatus === 'at_risk' && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
              <Clock className="h-2.5 w-2.5" />SLA at risk
            </span>
          )}
          {hasSuggestion && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center gap-1 rounded-full border border-coral/20 bg-coral/8 px-1.5 py-0.5 text-[10px] font-semibold text-coral-dark">
                  <Bot className="h-2.5 w-2.5" />AI
                </span>
              </TooltipTrigger>
              <TooltipContent>AI suggestion ready</TooltipContent>
            </Tooltip>
          )}
          {!ticket.assignee && (
            <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              <UserPlus className="h-2.5 w-2.5" />Unassigned
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Right preview pane ───────────────────────────────────────────────────────

function PreviewPane({ ticket }: { ticket: MockTicket | null }) {
  if (!ticket) {
    return (
      <div className="hidden flex-col items-center justify-center px-6 text-center xl:flex">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-muted/50">
          <Inbox className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="mt-3 text-sm font-medium text-foreground">No ticket selected</p>
        <p className="mt-0.5 max-w-xs text-xs text-muted-foreground">
          Select a ticket from the list to preview it. Click through to open the full thread and reply.
        </p>
      </div>
    );
  }

  const status   = STATUS_META[ticket.status];
  const channel  = CHANNEL_META[ticket.channel];
  const priority = PRIORITY_META[ticket.priority];
  const ChIcon   = channel.icon;
  const messageCount = ticket.conversations.length + 1;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 border-b border-border/60 px-5 py-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="font-mono">{ticket.number}</span>
            <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/40" />
            <ChIcon className={cn('h-3 w-3', channel.color)} />
            <span>{channel.label}</span>
          </div>
          <h3 className="mt-1 text-base font-semibold leading-snug text-foreground">
            {ticket.subject}
          </h3>
        </div>
        <Link
          href={`/tickets/${ticket.id}`}
          className="shrink-0 inline-flex h-7 items-center gap-1 rounded-full bg-navy px-3 text-[11px] font-semibold text-white hover:bg-navy-mid transition-colors"
        >
          Open <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 divide-x divide-border/60 border-b border-border/60">
        <div className="px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Status</p>
          <div className="mt-1 flex items-center gap-1.5">
            <span className={cn('h-1.5 w-1.5 rounded-full', status.dot)} />
            <span className="text-sm font-medium text-foreground">{status.label}</span>
          </div>
        </div>
        <div className="px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Priority</p>
          <p className={cn('mt-1 text-sm font-medium', priority.color)}>{priority.label}</p>
        </div>
        <div className="px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Messages</p>
          <p className="mt-1 text-sm font-medium text-foreground">{messageCount}</p>
        </div>
      </div>

      {/* Customer */}
      <div className="border-b border-border/60 px-5 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Customer</p>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className={cn(avatarColor(ticket.requester.name), 'text-xs font-semibold text-white')}>
              {initials(ticket.requester.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{ticket.requester.name}</p>
            <p className="truncate text-xs text-muted-foreground">{ticket.requester.email}</p>
          </div>
        </div>
      </div>

      {/* Properties */}
      <div className="border-b border-border/60">
        {[
          { label: 'Assignee',  value: ticket.assignee?.name ?? '— Unassigned —' },
          { label: 'Group',     value: ticket.group },
          { label: 'Category',  value: ticket.category },
          { label: 'Created',   value: relativeTime(ticket.createdAt) },
          { label: 'Updated',   value: relativeTime(ticket.updatedAt) },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 border-b border-border/40 px-5 py-2 last:border-b-0">
            <span className="text-xs text-muted-foreground">{row.label}</span>
            <span className="truncate text-xs font-medium text-foreground">{row.value}</span>
          </div>
        ))}
      </div>

      {/* Tags */}
      {ticket.tags.length > 0 && (
        <div className="border-b border-border/60 px-5 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Tags</p>
          <div className="flex flex-wrap gap-1">
            {ticket.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[11px] text-foreground">
                <Tag className="h-2.5 w-2.5 text-muted-foreground" />{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Description preview */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Latest message</p>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
          {(ticket.conversations[ticket.conversations.length - 1]?.body ?? ticket.description).slice(0, 400)}
          {(ticket.conversations[ticket.conversations.length - 1]?.body ?? ticket.description).length > 400 ? '…' : ''}
        </p>
      </div>

      {/* Quick actions */}
      <div className="border-t border-border/60 bg-muted/20 px-5 py-3">
        <div className="flex items-center gap-2">
          <Link href={`/tickets/${ticket.id}`} className="flex-1">
            <Button size="sm" className="w-full bg-navy text-white hover:bg-navy-mid">
              <Reply className="h-3 w-3" />Reply
            </Button>
          </Link>
          <Button size="sm" variant="outline" className="h-9 px-3">
            <UserPlus className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" className="h-9 px-3">
            <CheckCircle2 className="h-3 w-3" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="h-9 px-3">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem><Pause className="h-3.5 w-3.5" />Snooze</DropdownMenuItem>
              <DropdownMenuItem><Bell className="h-3.5 w-3.5" />Watch</DropdownMenuItem>
              <DropdownMenuItem><Tag className="h-3.5 w-3.5" />Add tag</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Mark as spam</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

// ─── Search bar ───────────────────────────────────────────────────────────────

function SearchBar({
  value,
  onChange,
  onClear,
}: {
  value: string;
  onChange: (s: string) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  // Keyboard shortcuts: "/" or Cmd/Ctrl+K to focus, Esc to blur & clear.
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      // Cmd/Ctrl+K — works even if typing
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        return;
      }
      // "/" focuses search, only when not already typing
      if (e.key === '/' && !isTyping) {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }
      // Esc blurs and clears when focused
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        if (value) onClear();
        else inputRef.current?.blur();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [value, onClear]);

  return (
    <div
      className={cn(
        'group relative flex h-9 w-80 items-center gap-2 rounded-full border bg-card pl-3.5 pr-1.5 transition-all duration-150',
        focused
          ? 'border-coral/40 shadow-[0_0_0_4px_rgba(255,107,74,0.10)] ring-0'
          : value
            ? 'border-border/80 bg-card'
            : 'border-transparent bg-muted/45 hover:bg-muted/70 hover:border-border/40',
      )}
    >
      <Search
        className={cn(
          'h-3.5 w-3.5 shrink-0 transition-colors',
          focused ? 'text-coral' : value ? 'text-foreground' : 'text-muted-foreground',
        )}
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search tickets…"
        spellCheck={false}
        className={cn(
          'h-full flex-1 bg-transparent text-sm text-foreground outline-none',
          'placeholder:font-normal placeholder:text-muted-foreground/80',
        )}
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            onClear();
            inputRef.current?.focus();
          }}
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-3 w-3" />
        </button>
      ) : (
        <kbd
          className={cn(
            'pointer-events-none hidden h-5 select-none items-center gap-0.5 rounded-md border border-border/70 bg-card px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-flex',
            focused && 'opacity-0',
          )}
          aria-hidden="true"
        >
          <span className="text-[11px] leading-none">⌘</span>K
        </kbd>
      )}
    </div>
  );
}

// ─── Top action bar ───────────────────────────────────────────────────────────

function TopBar({
  count,
  isOfflineCached,
  search,
  onSearchChange,
  onClearSearch,
  sortKey,
  onSortChange,
}: {
  count: number;
  isOfflineCached?: boolean;
  search: string;
  onSearchChange: (s: string) => void;
  onClearSearch: () => void;
  sortKey: 'updated' | 'created' | 'priority';
  onSortChange: (k: 'updated' | 'created' | 'priority') => void;
}) {
  const sortLabel = { updated: 'Last updated', created: 'Date created', priority: 'Priority' }[sortKey];

  return (
    <div className="shrink-0 border-b border-border/60 bg-card/50">
      {/* Row 1: title · actions */}
      <div className="flex h-12 items-center justify-between gap-2 px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <h1 className="text-base font-bold tracking-tight text-foreground">Tickets</h1>
          <span className="text-xs text-muted-foreground tabular-nums">
            · {count.toLocaleString()}
          </span>
          {isOfflineCached && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
              <Database className="h-2.5 w-2.5" />Cached
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 rounded-full px-2.5 text-xs text-muted-foreground hover:text-foreground">
                <Filter className="h-3 w-3" />
                {sortLabel}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onSortChange('updated')}>Last updated</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange('created')}>Date created</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange('priority')}>Priority</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* New */}
          <Link href="/tickets/new">
            <Button size="sm" className="h-7 rounded-full bg-coral px-3 text-xs text-white hover:bg-coral-dark">
              <Plus className="h-3 w-3" />New
            </Button>
          </Link>
        </div>
      </div>

      {/* Row 2: search */}
      <div className="px-4 pb-2.5 pt-0.5">
        <SearchBar value={search} onChange={onSearchChange} onClear={onClearSearch} />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TicketsPage() {
  const { data: tickets, isLoading, isOfflineCached } = useTickets();

  const [view,     setView]     = useState<string>('open');
  const [search,   setSearch]   = useState('');
  const [sortKey,  setSortKey]  = useState<'updated' | 'created' | 'priority'>('updated');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Counts for left rail
  const viewCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const v of VIEWS) map[v.id] = 0;
    for (const t of tickets ?? []) for (const v of VIEWS) if (v.filter(t)) map[v.id]!++;
    return map;
  }, [tickets]);

  const channelCounts = useMemo(() => {
    const map = {} as Record<TicketChannel, number>;
    for (const t of tickets ?? []) map[t.channel] = (map[t.channel] ?? 0) + 1;
    return map;
  }, [tickets]);

  // Filter + sort
  const filtered = useMemo(() => {
    let list = tickets ?? [];
    if (view.startsWith('channel:')) {
      const ch = view.split(':')[1] as TicketChannel;
      list = list.filter((t) => t.channel === ch && !['resolved','closed'].includes(t.status));
    } else {
      const v = VIEWS.find((x) => x.id === view);
      if (v) list = list.filter(v.filter);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((t) =>
        [t.subject, t.number, t.requester.name, t.requester.email, t.category, ...t.tags]
          .join(' ').toLowerCase().includes(q),
      );
    }
    const sorted = [...list].sort((a, b) => {
      if (sortKey === 'updated') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sortKey === 'created') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      const order = { urgent: 4, high: 3, medium: 2, low: 1 };
      return (order[b.priority] ?? 0) - (order[a.priority] ?? 0);
    });
    return sorted;
  }, [tickets, view, search, sortKey]);

  const selected = filtered.find((t) => t.id === selectedId) ?? null;

  return (
    <div className="flex h-full min-h-[calc(100vh-3.5rem)]">
      {/* Left rail: views + channels */}
      <LeftRail
        activeView={view}
        onSelect={setView}
        counts={viewCounts}
        channelCounts={channelCounts}
      />

      {/* Center column: list */}
      <div className="flex min-w-0 flex-1 flex-col xl:max-w-[480px] xl:border-r xl:border-border/60">
        <TopBar
          count={filtered.length}
          isOfflineCached={isOfflineCached}
          search={search}
          onSearchChange={setSearch}
          onClearSearch={() => setSearch('')}
          sortKey={sortKey}
          onSortChange={setSortKey}
        />

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-2 p-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-muted/50">
                <Inbox className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="mt-3 text-sm font-medium text-foreground">No tickets here</p>
              <p className="mt-0.5 max-w-xs text-xs text-muted-foreground">
                {search ? 'Try clearing the search or switching views.' : 'When customers reach out, their tickets will appear here.'}
              </p>
              {search && (
                <Button size="sm" variant="outline" className="mt-3" onClick={() => setSearch('')}>
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <ul>
              {filtered.map((t) => (
                <li key={t.id}>
                  <TicketRow
                    ticket={t}
                    selected={selectedId === t.id}
                    onSelect={() => setSelectedId(t.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right preview pane */}
      <div className="hidden flex-1 xl:flex xl:flex-col">
        <PreviewPane ticket={selected} />
      </div>
    </div>
  );
}
