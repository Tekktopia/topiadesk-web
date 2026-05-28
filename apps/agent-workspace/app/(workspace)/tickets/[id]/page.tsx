'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  AtSign,
  ArrowLeft,
  Bold,
  Bookmark,
  ChevronDown,
  ExternalLink,
  X,
  Clock,
  Copy,
  FileText,
  History,
  Italic,
  Link2,
  ListChecks,
  Lock,
  Mail,
  MapPin,
  MoreHorizontal,
  Paperclip,
  Phone,
  Reply,
  Send,
  Smile,
  Sparkles,
  Tag,
  Timer,
  Trash2,
  Underline,
  UserPlus,
  Users,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  PriorityIndicator,
  Separator,
  Skeleton,
  StatusPill,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from '@topiadesk/ui';
import { useTicket } from '@/lib/queries';
import { mockAssets } from '@/lib/mock-data';
import type {
  ConversationMessage,
  MockTicket,
  Person,
} from '@/lib/mock-data';
import {
  absoluteDateTime,
  initials,
  relativeTime,
} from '@/lib/format';
import { useOfflineMutation } from '@/app/_hooks/use-offline-mutation';
import { useOffline } from '@/app/_hooks/use-offline';
import { PendingBadge } from '@/app/_components/pending-badge';
import { AISuggestionPanel } from '@/app/_components/ai-suggestion-panel';

const RELATED_TICKETS = [
  { number: '#1015', subject: 'VPN cert provisioning fails on imaging', status: 'resolved' as const },
  { number: '#1009', subject: 'New laptops missing PKI cert in keychain', status: 'resolved' as const },
  { number: '#998', subject: 'Cisco AnyConnect intermittent on 5GHz', status: 'closed' as const },
];

const REQUESTER_TICKETS = 12;
const REQUESTER_OPEN = 2;

export default function TicketDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: ticket, isLoading } = useTicket(params.id);

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-[calc(100vh-8rem)]" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Ticket not found.</p>
        <Link
          href="/tickets"
          className="mt-3 inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to tickets
        </Link>
      </div>
    );
  }

  const linkedAsset = ticket.linkedAssetId
    ? mockAssets.find((a) => a.id === ticket.linkedAssetId)
    : undefined;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <StatusBar ticket={ticket} />

      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[1fr_360px]">
        <div className="space-y-4 overflow-y-auto p-5">
          <header className="space-y-2">
            <div className="flex items-center gap-2">
              <Link
                href="/tickets"
                className="text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Tickets
              </Link>
              <span className="text-xs text-muted-foreground">/</span>
              <span className="font-mono text-xs text-muted-foreground">
                {ticket.number}
              </span>
            </div>
            <div className="flex flex-wrap items-start gap-2">
              <h1 className="font-display text-2xl font-bold leading-tight">
                {ticket.subject}
              </h1>
              <PendingBadge entityId={ticket.id} className="mt-1.5" />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                Opened {relativeTime(ticket.createdAt)} by{' '}
                <span className="font-medium text-foreground">
                  {ticket.requester.name}
                </span>
              </span>
              <span aria-hidden>·</span>
              <span>{ticket.category}</span>
              <span aria-hidden>·</span>
              <span>via Email</span>
              {ticket.slaStatus === 'at_risk' && (
                <Badge variant="warning" className="ml-1 h-4 px-1.5 text-[9px]">
                  SLA at risk
                </Badge>
              )}
              {ticket.slaStatus === 'breached' && (
                <Badge variant="danger" className="ml-1 h-4 px-1.5 text-[9px]">
                  SLA breached
                </Badge>
              )}
            </div>
          </header>

          <Tabs defaultValue="conversation" className="space-y-4">
            <div className="flex items-center justify-between gap-3 border-b pb-2">
              <TabsList>
                <TabsTrigger value="conversation">
                  Conversation
                  <Badge
                    variant="secondary"
                    className="ml-2 h-4 px-1.5 text-[9px]"
                  >
                    {ticket.conversations.length + 1}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="activity">
                  <History className="h-3 w-3" />
                  Activity
                </TabsTrigger>
                <TabsTrigger value="time">
                  <Timer className="h-3 w-3" />
                  Time
                </TabsTrigger>
                <TabsTrigger value="related">Related</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Bookmark className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Watch ticket</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy link</TooltipContent>
                </Tooltip>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem>Merge ticket</DropdownMenuItem>
                    <DropdownMenuItem>Split ticket</DropdownMenuItem>
                    <DropdownMenuItem>Move to group</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Mark as spam</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <TabsContent value="conversation" className="space-y-4">
              <ConversationThread
                ticket={ticket}
              />
              <AISuggestionPanel ticketId={ticket.id} />
              <Composer ticket={ticket} />
            </TabsContent>

            <TabsContent value="activity">
              <ActivityTimeline ticket={ticket} />
            </TabsContent>

            <TabsContent value="time">
              <TimeTrackingCard />
            </TabsContent>

            <TabsContent value="related">
              <RelatedTicketsCard />
            </TabsContent>
          </Tabs>
        </div>

        <RightRail ticket={ticket} linkedAsset={linkedAsset} />
      </div>
    </div>
  );
}

function StatusBar({ ticket }: { ticket: MockTicket }) {
  const { isOffline } = useOffline();
  const resolveOp = useOfflineMutation<{ status: string }>({
    type: 'ticket_status',
    entityId: ticket.id,
    dedupeKey: (p) => `ticket_status:${ticket.id}:${p.status}`,
    url: () => `/api/tickets/${ticket.id}`,
    method: 'PATCH',
    label: () => `Mark ticket ${ticket.number} as resolved`,
    invalidates: [['tickets'], ['tickets', ticket.id]],
    optimisticUpdate: (payload) => ({
      store: 'tickets',
      id: ticket.id,
      updater: (current: any) => ({ ...current, status: payload.status }),
    }),
  });

  const resolved = resolveOp.status === 'success' || resolveOp.status === 'queued';

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 border-b bg-background/90 backdrop-blur-sm shadow-sm px-5 py-2.5">
      <InlineSelect label="Status" current={<StatusPill status={ticket.status} />} options={['New', 'Open', 'In progress', 'Pending', 'Resolved', 'Closed']} />
      <Separator orientation="vertical" className="h-5" />
      <InlineSelect label="Priority" current={<PriorityIndicator priority={ticket.priority} />} options={['Low', 'Medium', 'High', 'Urgent']} />
      <Separator orientation="vertical" className="h-5" />
      <InlineSelect
        label="Group"
        current={<span className="text-xs">{ticket.group}</span>}
        options={['Tier 1 Support', 'Field Support', 'Security Ops', 'IT Operations']}
      />
      <Separator orientation="vertical" className="h-5" />
      <InlineSelect
        label="Assignee"
        current={
          ticket.assignee ? (
            <div className="flex items-center gap-1.5">
              <Avatar className="h-5 w-5">
                <AvatarFallback>{initials(ticket.assignee.name)}</AvatarFallback>
              </Avatar>
              <span className="text-xs">{ticket.assignee.name}</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Unassigned</span>
          )
        }
        options={['Tunde Bakare', 'Adaeze Nwosu', 'Kwame Mensah', 'Fatima Suleiman']}
      />
      <div className="ml-auto flex items-center gap-2">
        {/* Offline indicator pill */}
        {isOffline && (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
            <Reply className="h-2.5 w-2.5" /> Offline — changes queued
          </span>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-card px-2 py-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              SLA {absoluteDateTime(ticket.slaDueAt)}
            </span>
          </TooltipTrigger>
          <TooltipContent>Resolution due</TooltipContent>
        </Tooltip>
        <Button size="sm" className="h-7">
          <UserPlus className="h-3 w-3" />
          Assign me
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7"
          disabled={resolveOp.status === 'loading' || resolved}
          onClick={() => resolveOp.mutate({ status: 'resolved' })}
        >
          {resolveOp.status === 'loading' ? 'Saving…'
            : resolveOp.status === 'queued' ? '⏱ Queued'
            : resolveOp.status === 'success' ? '✓ Resolved'
            : 'Mark resolved'}
        </Button>
      </div>
    </div>
  );
}

interface InlineSelectProps {
  label: string;
  current: React.ReactNode;
  options: string[];
}

function InlineSelect({ label, current, options }: InlineSelectProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors hover:bg-muted"
        >
          <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </span>
          {current}
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        {options.map((opt) => (
          <DropdownMenuItem key={opt}>{opt}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface ConversationThreadProps {
  ticket: MockTicket;
}

/** Format an EmailAddress as "Name <email>" or "email" */
function formatAddr(a: { name?: string; email: string }) {
  return a.name ? `${a.name} <${a.email}>` : a.email;
}

/** Render To / Cc list as comma-separated chips with overflow */
function AddressList({
  label,
  addrs,
  className,
}: {
  label: string;
  addrs: { name?: string; email: string }[];
  className?: string;
}) {
  if (!addrs.length) return null;
  return (
    <div className={cn('flex gap-2 text-xs', className)}>
      <span className="w-10 shrink-0 font-medium text-muted-foreground">{label}:</span>
      <span className="min-w-0 break-words text-foreground/90">
        {addrs.map((a, i) => (
          <span key={a.email}>
            {a.name ? <span className="font-medium">{a.name}</span> : null}
            {a.name ? ' ' : ''}
            <span className="text-muted-foreground">&lt;{a.email}&gt;</span>
            {i < addrs.length - 1 ? ', ' : ''}
          </span>
        ))}
      </span>
    </div>
  );
}

/** Collapsible email-style message card with full From/To/Cc headers */
function MessageCard({ m, isOpening }: { m: ConversationMessage; isOpening?: boolean }) {
  const [open, setOpen] = useState(!!isOpening || false);
  const isEmail   = m.channel === 'email';
  const isNote    = m.isInternal;
  const isAgent   = m.authorType === 'agent';

  return (
    <article
      className={cn(
        'overflow-hidden rounded-xl border bg-card transition-colors',
        isNote ? 'border-amber-300/50 bg-amber-50/40' : 'border-border/70',
      )}
    >
      {/* Header (always visible, click to expand) */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/30"
      >
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className={cn(isAgent ? 'bg-navy text-white' : 'bg-coral text-white', 'text-[11px] font-semibold')}>
              {initials(m.author.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-semibold text-foreground">{m.author.name}</p>
              {isNote && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                  <Lock className="h-2.5 w-2.5" />Internal note
                </span>
              )}
              {!isNote && (
                <span className={cn(
                  'inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-semibold',
                  isAgent ? 'border-border bg-muted/60 text-foreground' : 'border-coral/20 bg-coral/8 text-coral-dark',
                )}>
                  {isAgent ? 'Agent' : 'Customer'}
                </span>
              )}
              {isEmail && (
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  <Mail className="h-2.5 w-2.5" />Email
                </span>
              )}
            </div>
            {/* Compact recipients line (when collapsed) */}
            {!open && isEmail && m.to && (
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                to {m.to.map((a) => a.name || a.email).join(', ')}
                {m.cc && m.cc.length > 0 && (
                  <> · cc {m.cc.map((a) => a.name || a.email).join(', ')}</>
                )}
              </p>
            )}
            {!open && !isEmail && (
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{m.body.slice(0, 80)}{m.body.length > 80 ? '…' : ''}</p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden text-[11px] text-muted-foreground sm:inline">
            {relativeTime(m.createdAt)}
          </span>
          <ChevronDown className={cn('h-3.5 w-3.5 text-muted-foreground transition-transform', open && 'rotate-180')} />
        </div>
      </button>

      {open && (
        <div className="border-t border-border/60 px-4 py-3 space-y-3">
          {/* Email headers block */}
          {isEmail && (
            <div className="space-y-1 rounded-lg bg-muted/30 px-3 py-2">
              {m.from && (
                <div className="flex gap-2 text-xs">
                  <span className="w-10 shrink-0 font-medium text-muted-foreground">From:</span>
                  <span className="min-w-0 break-words text-foreground/90">
                    <span className="font-medium">{m.from.name ?? ''}</span>{m.from.name ? ' ' : ''}
                    <span className="text-muted-foreground">&lt;{m.from.email}&gt;</span>
                  </span>
                </div>
              )}
              <AddressList label="To"  addrs={m.to ?? []} />
              <AddressList label="Cc"  addrs={m.cc ?? []} />
              <AddressList label="Bcc" addrs={m.bcc ?? []} />
              {m.subject && (
                <div className="flex gap-2 text-xs">
                  <span className="w-10 shrink-0 font-medium text-muted-foreground">Subj:</span>
                  <span className="min-w-0 break-words font-medium text-foreground">{m.subject}</span>
                </div>
              )}
              <div className="flex gap-2 text-[10px] text-muted-foreground pt-1">
                <span className="w-10 shrink-0">Date:</span>
                <span>{absoluteDateTime(m.createdAt)}</span>
              </div>
            </div>
          )}

          {/* Body */}
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{m.body}</p>

          {/* Attachments */}
          {m.attachments && m.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {m.attachments.map((att) => (
                <a
                  key={att.name}
                  href="#"
                  className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-2.5 py-1.5 text-xs transition-colors hover:bg-muted"
                >
                  <Paperclip className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium text-foreground">{att.name}</span>
                  <span className="text-muted-foreground">{att.sizeKb} KB</span>
                </a>
              ))}
            </div>
          )}

          {/* Per-message actions */}
          <div className="flex items-center gap-1 pt-1">
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
              <Reply className="h-3 w-3" /> Reply
            </Button>
            {isEmail && (
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                <ExternalLink className="h-3 w-3" /> Forward
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
              <Copy className="h-3 w-3" /> Copy
            </Button>
          </div>
        </div>
      )}
    </article>
  );
}

function ConversationThread({ ticket }: ConversationThreadProps) {
  // Build the opening message from the ticket description, but enrich with email metadata if available.
  const opening: ConversationMessage = {
    id: 'opening',
    author: ticket.requester,
    authorType: 'customer',
    channel: ticket.channel === 'email' ? 'email' : undefined,
    from:    ticket.emailFrom,
    to:      ticket.emailTo,
    cc:      ticket.emailCc,
    subject: ticket.emailSubject ?? ticket.subject,
    body:    ticket.description,
    isInternal: false,
    createdAt:  ticket.createdAt,
  };
  // If the conversation already contains the first message (which we now do for email tickets), skip the synthetic opening.
  const hasFirstAlready = ticket.conversations.length > 0
    && ticket.conversations[0]!.authorType === 'customer'
    && Math.abs(new Date(ticket.conversations[0]!.createdAt).getTime() - new Date(ticket.createdAt).getTime()) < 60_000;

  const all = hasFirstAlready ? ticket.conversations : [opening, ...ticket.conversations];
  // Keep the most-recent message open by default; collapse older ones for an email-thread feel.
  return (
    <div className="space-y-2.5">
      {all.map((m, i) => (
        <MessageCard key={m.id} m={m} isOpening={i === all.length - 1} />
      ))}
    </div>
  );
}

/** Mailbox options the agent can send From */
const FROM_MAILBOXES = [
  { name: 'IT Support',      email: 'support@consomoafrica.com'  },
  { name: 'Helpdesk',        email: 'helpdesk@consomoafrica.com' },
  { name: 'Field Services',  email: 'field@consomoafrica.com'    },
  { name: 'Security Ops',    email: 'security@consomoafrica.com' },
];

/** Pretty parser for "Name <email>" or just "email" lists */
function parseAddrs(s: string): { name?: string; email: string }[] {
  if (!s.trim()) return [];
  return s
    .split(/[,;\n]/)
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((token) => {
      const m = token.match(/^(.*?)\s*<\s*([^>]+)\s*>$/);
      if (m) return { name: m[1]!.trim() || undefined, email: m[2]!.trim() };
      return { email: token };
    });
}

/** Inline pill list editor for To/Cc/Bcc fields */
function RecipientField({
  label,
  value,
  onChange,
  trailing,
}: {
  label: string;
  value: { name?: string; email: string }[];
  onChange: (next: { name?: string; email: string }[]) => void;
  trailing?: React.ReactNode;
}) {
  const [pending, setPending] = useState('');

  function commit() {
    const parsed = parseAddrs(pending);
    if (parsed.length) onChange([...value, ...parsed]);
    setPending('');
  }

  return (
    <div className="flex items-start gap-2 border-b border-border/50 px-3 py-2">
      <span className="mt-1 w-10 shrink-0 text-xs font-medium text-muted-foreground">{label}:</span>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
        {value.map((a, i) => (
          <span
            key={`${a.email}-${i}`}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[11px]"
          >
            <span className="font-medium text-foreground">{a.name ?? a.email}</span>
            {a.name && <span className="text-muted-foreground">{a.email}</span>}
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="ml-0.5 grid h-3.5 w-3.5 place-items-center rounded-full text-muted-foreground hover:bg-card hover:text-foreground"
              aria-label={`Remove ${a.email}`}
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        <input
          value={pending}
          onChange={(e) => setPending(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',' || e.key === ';') {
              e.preventDefault();
              commit();
            } else if (e.key === 'Backspace' && !pending && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          className="min-w-32 flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground/60"
          placeholder={value.length === 0 ? 'name@company.com' : ''}
        />
      </div>
      {trailing}
    </div>
  );
}

function Composer({ ticket }: { ticket: MockTicket }) {
  const [mode, setMode]       = useState<'reply' | 'note' | 'forward'>('reply');
  const [showCc, setShowCc]   = useState(!!(ticket.emailCc && ticket.emailCc.length));
  const [showBcc, setShowBcc] = useState(false);

  // From — defaults to the inbound mailbox; agent can switch.
  const defaultFrom = ticket.inboundMailbox ?? FROM_MAILBOXES[0]!;
  const [fromAddr, setFromAddr] = useState(defaultFrom);

  // To / Cc / Bcc — initial defaults based on the ticket context
  const [toAddrs, setToAddrs] = useState<{ name?: string; email: string }[]>(
    [{ name: ticket.requester.name, email: ticket.requester.email }],
  );
  const [ccAddrs, setCcAddrs]   = useState<{ name?: string; email: string }[]>(ticket.emailCc ?? []);
  const [bccAddrs, setBccAddrs] = useState<{ name?: string; email: string }[]>([]);

  // Subject — pre-fill with "Re: …"
  const [subject, setSubject] = useState(`Re: ${ticket.emailSubject ?? ticket.subject}`);

  const [body, setBody] = useState('');
  const { isOffline } = useOffline();

  const replyOp = useOfflineMutation<{
    body: string; type: string; ticketId: string;
    from: string; to: string[]; cc: string[]; bcc: string[]; subject: string;
  }>({
    type: 'ticket_reply',
    entityId: ticket.id,
    url: () => `/api/tickets/${ticket.id}/replies`,
    method: 'POST',
    label: (p) => `Reply to ticket: "${p.body.slice(0, 60)}${p.body.length > 60 ? '…' : ''}"`,
    invalidates: [['tickets', ticket.id]],
  });

  function handleSend(_andThen?: 'resolve' | 'pending') {
    if (!body.trim()) return;
    if (mode !== 'note' && toAddrs.length === 0) return;
    replyOp.mutate({
      body,
      type: mode,
      ticketId: ticket.id,
      from: fromAddr.email,
      to:   toAddrs.map((a) => a.email),
      cc:   ccAddrs.map((a) => a.email),
      bcc:  bccAddrs.map((a) => a.email),
      subject,
    });
    if (replyOp.status !== 'queued') setBody('');
  }

  const sending = replyOp.status === 'loading';
  const queued  = replyOp.status === 'queued';
  const sent    = replyOp.status === 'success';
  const isNote  = mode === 'note';

  return (
    <div className={cn(
      'overflow-hidden rounded-xl border bg-card',
      queued && 'ring-1 ring-amber-300',
      sent   && 'ring-1 ring-emerald-300',
      isNote ? 'border-amber-300/60 bg-amber-50/30' : 'border-border/70',
    )}>
      {/* Offline / queued / sent banners */}
      {isOffline && (
        <div className="flex items-center gap-2 border-b border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <Reply className="h-3 w-3 shrink-0 text-amber-500" />
          You&apos;re offline — your reply will be saved and sent when you reconnect.
        </div>
      )}
      {queued && (
        <div className="flex items-center gap-2 border-b border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <Send className="h-3 w-3 shrink-0 text-amber-500" />
          Reply queued — will be sent automatically when you&apos;re back online.
        </div>
      )}
      {sent && (
        <div className="flex items-center gap-2 border-b border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          <Send className="h-3 w-3 shrink-0 text-emerald-500" />
          Reply sent successfully.
        </div>
      )}

      {/* Mode tabs */}
      <div className="flex items-center gap-1 border-b border-border/60 px-3 py-1.5 text-xs">
        {(['reply', 'note', 'forward'] as const).map((m) => (
          <button
            key={m}
            type="button"
            className={cn(
              'rounded-md px-2.5 py-1 font-medium capitalize transition-colors',
              mode === m
                ? 'bg-card text-foreground shadow-sm border border-border/60'
                : 'text-muted-foreground hover:text-foreground',
            )}
            onClick={() => setMode(m)}
          >
            {m === 'note' && <Lock className="mr-1 inline-block h-3 w-3" />}
            {m === 'note' ? 'Internal note' : m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-muted-foreground">
          {mode === 'reply'   && <>Replying to {ticket.requester.name}</>}
          {mode === 'note'    && <>Visible to agents only — no email sent</>}
          {mode === 'forward' && <>Forwarding ticket {ticket.number}</>}
        </span>
      </div>

      {/* Email headers — hidden when in 'note' mode */}
      {!isNote && (
        <>
          {/* From */}
          <div className="flex items-center gap-2 border-b border-border/50 px-3 py-2">
            <span className="w-10 shrink-0 text-xs font-medium text-muted-foreground">From:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-md px-1 py-0.5 text-xs hover:bg-muted/40"
                >
                  <span className="font-medium text-foreground">{fromAddr.name}</span>
                  <span className="text-muted-foreground">&lt;{fromAddr.email}&gt;</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72">
                <DropdownMenuLabel>Send from mailbox</DropdownMenuLabel>
                {FROM_MAILBOXES.map((mbx) => (
                  <DropdownMenuItem
                    key={mbx.email}
                    onClick={() => setFromAddr(mbx)}
                    className="flex flex-col items-start"
                  >
                    <span className="text-sm font-medium">{mbx.name}</span>
                    <span className="text-xs text-muted-foreground">{mbx.email}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="ml-auto flex items-center gap-1.5">
              {!showCc && (
                <button
                  type="button"
                  onClick={() => setShowCc(true)}
                  className="text-[11px] font-medium text-muted-foreground hover:text-foreground"
                >
                  + Cc
                </button>
              )}
              {!showBcc && (
                <button
                  type="button"
                  onClick={() => setShowBcc(true)}
                  className="text-[11px] font-medium text-muted-foreground hover:text-foreground"
                >
                  + Bcc
                </button>
              )}
            </div>
          </div>

          {/* To */}
          <RecipientField label="To"  value={toAddrs}  onChange={setToAddrs} />
          {showCc  && <RecipientField label="Cc"  value={ccAddrs}  onChange={setCcAddrs}  trailing={
            <button type="button" onClick={() => { setShowCc(false); setCcAddrs([]); }} className="grid h-5 w-5 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Remove Cc"><X className="h-3 w-3" /></button>
          } />}
          {showBcc && <RecipientField label="Bcc" value={bccAddrs} onChange={setBccAddrs} trailing={
            <button type="button" onClick={() => { setShowBcc(false); setBccAddrs([]); }} className="grid h-5 w-5 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Remove Bcc"><X className="h-3 w-3" /></button>
          } />}

          {/* Subject */}
          <div className="flex items-center gap-2 border-b border-border/50 px-3 py-2">
            <span className="w-10 shrink-0 text-xs font-medium text-muted-foreground">Subj:</span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-xs font-medium text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="Subject line"
            />
          </div>
        </>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-border/50 px-3 py-1.5">
        {[
          { icon: Bold,       tip: 'Bold'          },
          { icon: Italic,     tip: 'Italic'        },
          { icon: Underline,  tip: 'Underline'     },
          { icon: Link2,      tip: 'Link'          },
          { icon: ListChecks, tip: 'Bulleted list' },
        ].map(({ icon: Icon, tip }) => (
          <Tooltip key={tip}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7"><Icon className="h-3 w-3" /></Button>
            </TooltipTrigger>
            <TooltipContent>{tip}</TooltipContent>
          </Tooltip>
        ))}
        <Separator orientation="vertical" className="mx-1 h-4" />
        {[
          { icon: Paperclip, tip: 'Attach file'   },
          { icon: Smile,     tip: 'Emoji'         },
          { icon: AtSign,    tip: 'Mention agent' },
        ].map(({ icon: Icon, tip }) => (
          <Tooltip key={tip}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7"><Icon className="h-3 w-3" /></Button>
            </TooltipTrigger>
            <TooltipContent>{tip}</TooltipContent>
          </Tooltip>
        ))}
        <Separator orientation="vertical" className="mx-1 h-4" />
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
          <FileText className="h-3 w-3" /> Canned
        </Button>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-coral">
          <Sparkles className="h-3 w-3" /> AI suggest
        </Button>
      </div>

      {/* Body */}
      <Textarea
        placeholder={
          isNote
            ? 'Type an internal note — only visible to agents…'
            : isOffline
              ? 'Type your reply — it will be queued and sent when you reconnect…'
              : 'Type your reply…'
        }
        rows={6}
        className="resize-none border-0 px-4 py-3 shadow-none focus-visible:ring-0"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        disabled={sending}
      />

      {/* Send bar */}
      <div className="flex items-center justify-between gap-2 border-t border-border/60 bg-muted/20 px-3 py-2">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <Tag className="h-3 w-3" />
          Add tag on send
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8" disabled={!body.trim() || sending}>
            Save draft
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                className={cn('h-8 bg-navy text-white hover:bg-navy-mid', queued && 'bg-amber-500 hover:bg-amber-600')}
                disabled={!body.trim() || sending || queued}
                onClick={() => handleSend()}
              >
                {sending
                  ? <><Send className="h-3 w-3 animate-pulse" /> Sending…</>
                  : queued
                    ? <><Send className="h-3 w-3" /> Queued</>
                    : <><Send className="h-3 w-3" /> {isNote ? 'Save note' : 'Send email'}</>}
                <ChevronDown className="h-3 w-3 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleSend()}>
                {isOffline ? 'Queue reply' : isNote ? 'Save note' : 'Send email'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSend('pending')}>
                {isOffline ? 'Queue and set Pending' : 'Send and set Pending'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSend('resolve')}>
                {isOffline ? 'Queue and resolve' : 'Send and resolve'}
              </DropdownMenuItem>
              <DropdownMenuItem>Send and snooze</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

function ActivityTimeline({ ticket }: { ticket: MockTicket }) {
  const events = [
    { who: 'Tunde Bakare', what: `set priority to ${ticket.priority}`, when: relativeTime(ticket.updatedAt) },
    { who: 'Automation rule', what: 'tagged ticket with vpn after subject match', when: relativeTime(ticket.updatedAt) },
    { who: 'Tunde Bakare', what: 'assigned ticket to themselves', when: relativeTime(ticket.createdAt) },
    { who: 'Automation rule', what: 'created ticket from email channel', when: relativeTime(ticket.createdAt) },
  ];
  return (
    <Card>
      <CardContent className="p-0">
        <ul className="divide-y">
          {events.map((e, i) => (
            <li key={i} className="flex items-start gap-3 px-4 py-3 text-sm">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
              <div className="flex-1">
                <p>
                  <span className="font-medium">{e.who}</span>{' '}
                  <span className="text-muted-foreground">{e.what}</span>
                </p>
                <p className="text-[11px] text-muted-foreground">{e.when}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function TimeTrackingCard() {
  return (
    <Card>
      <CardContent className="space-y-3 p-4 text-sm">
        <p className="text-muted-foreground">
          Logged time on this ticket — billable to the customer&rsquo;s contract.
        </p>
        <ul className="space-y-2 text-xs">
          <li className="flex items-center justify-between rounded-md border px-3 py-2">
            <span>Tunde Bakare — Investigation</span>
            <span className="font-medium">42m</span>
          </li>
          <li className="flex items-center justify-between rounded-md border px-3 py-2">
            <span>Tunde Bakare — Customer reply</span>
            <span className="font-medium">8m</span>
          </li>
        </ul>
        <Button variant="outline" size="sm" className="w-full">
          <Timer className="h-3 w-3" />
          Start timer
        </Button>
      </CardContent>
    </Card>
  );
}

function RelatedTicketsCard() {
  return (
    <Card>
      <CardContent className="p-0">
        <ul className="divide-y">
          {RELATED_TICKETS.map((r) => (
            <li
              key={r.number}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50"
            >
              <span className="font-mono text-[11px] text-muted-foreground">
                {r.number}
              </span>
              <p className="flex-1 truncate text-sm">{r.subject}</p>
              <StatusPill status={r.status} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function RightRail({
  ticket,
  linkedAsset,
}: {
  ticket: MockTicket;
  linkedAsset?: ReturnType<typeof mockAssets.find>;
}) {
  return (
    <aside className="space-y-5 overflow-y-auto border-l bg-card p-5">
      <RequesterCard requester={ticket.requester} />

      <SidebarSection title="Properties">
        <PropertyRow
          label="Status"
          value={<StatusPill status={ticket.status} />}
        />
        <PropertyRow
          label="Priority"
          value={<PriorityIndicator priority={ticket.priority} />}
        />
        <PropertyRow label="Category" value={ticket.category} />
        <PropertyRow label="Group" value={ticket.group} />
        <PropertyRow
          label="Channel"
          value={
            <span className="inline-flex items-center gap-1 text-xs">
              <Mail className="h-3 w-3" />
              Email
            </span>
          }
        />
        <PropertyRow
          label="SLA due"
          value={
            <span className="text-[11px]">
              {absoluteDateTime(ticket.slaDueAt)}
            </span>
          }
        />
      </SidebarSection>

      {linkedAsset && (
        <SidebarSection title="Linked asset">
          <div className="rounded-md border bg-background p-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-muted-foreground">
                {linkedAsset.tag}
              </span>
              <Badge variant="outline" className="text-[9px]">
                {linkedAsset.category}
              </Badge>
            </div>
            <p className="mt-1 text-sm font-medium">{linkedAsset.name}</p>
            <p className="text-[11px] text-muted-foreground">
              {linkedAsset.specifications}
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {linkedAsset.location}
            </p>
          </div>
        </SidebarSection>
      )}

      <SidebarSection title="Tags">
        <div className="flex flex-wrap gap-1">
          {ticket.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-[10px]">
              #{tag}
            </Badge>
          ))}
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-input px-2 py-0.5 text-[10px] text-muted-foreground hover:bg-muted"
          >
            <Tag className="h-3 w-3" />
            Add tag
          </button>
        </div>
      </SidebarSection>

      <SidebarSection title="Followers">
        <div className="flex items-center -space-x-2">
          {['Tunde Bakare', 'Adaeze Nwosu', 'Kwame Mensah'].map((n) => (
            <Avatar key={n} className="h-6 w-6 ring-2 ring-card">
              <AvatarFallback>{initials(n)}</AvatarFallback>
            </Avatar>
          ))}
          <button
            type="button"
            className="grid h-6 w-6 place-items-center rounded-full border border-dashed border-input bg-card text-muted-foreground hover:bg-muted"
            aria-label="Add follower"
          >
            <UserPlus className="h-3 w-3" />
          </button>
        </div>
      </SidebarSection>
    </aside>
  );
}

function RequesterCard({ requester }: { requester: Person }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarFallback>{initials(requester.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{requester.name}</p>
          <p className="truncate text-[11px] text-muted-foreground">
            {requester.email}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 divide-x border-t pt-3 text-center text-xs">
        <div>
          <p className="text-sm font-semibold tabular-nums">
            {REQUESTER_TICKETS}
          </p>
          <p className="text-[10px] text-muted-foreground">Total tickets</p>
        </div>
        <div>
          <p className="text-sm font-semibold tabular-nums">
            {REQUESTER_OPEN}
          </p>
          <p className="text-[10px] text-muted-foreground">Open</p>
        </div>
        <div>
          <p className="text-sm font-semibold tabular-nums">VIP</p>
          <p className="text-[10px] text-muted-foreground">Tier</p>
        </div>
      </div>

      <div className="mt-3 space-y-1 border-t pt-3 text-[11px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-3 w-3" />
          +234 803 123 4567
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-3 w-3" />
          Lagos, Nigeria
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-3 w-3" />
          Acme Bank — Operations
        </div>
      </div>

      <Button variant="outline" size="sm" className="mt-3 w-full">
        View contact
      </Button>
    </div>
  );
}

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </p>
      <div className="space-y-1.5">{children}</div>
    </section>
  );
}

function PropertyRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <div className="text-right">{value}</div>
    </div>
  );
}

