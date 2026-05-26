'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  Headset,
  Mail,
  MessageSquareText,
  Paperclip,
  Send,
  Star,
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
  Separator,
  Textarea,
  cn,
} from '@topiadesk/ui';
import {
  TENANT,
  mockPortalTickets,
  type PortalTicket,
} from '@/lib/mock-data';
import { absoluteDateTime, initials, relativeTime } from '@/lib/format';
import { PortalStatusBadge } from '../../_components/status-badge';

const STATUS_TIMELINE = ['submitted', 'in_progress', 'resolved'] as const;

export default function PortalTicketDetailPage() {
  const params = useParams<{ id: string }>();
  const ticket = mockPortalTickets.find((t) => t.id === params.id);

  if (!ticket) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center lg:px-8">
        <p className="text-sm text-muted-foreground">Ticket not found.</p>
        <Button asChild variant="outline" size="sm" className="mt-3">
          <Link href="/tickets">
            <ArrowLeft className="h-3 w-3" />
            Back to my tickets
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-muted/20">
      <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <Link
          href="/tickets"
          className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to my tickets
        </Link>

        <header className="mb-5 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              {ticket.number}
            </span>
            <PortalStatusBadge status={ticket.status} />
            <Badge variant="outline" className="text-[10px]">
              {ticket.category}
            </Badge>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            {ticket.subject}
          </h1>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Opened {relativeTime(ticket.createdAt)}
            </span>
            {ticket.agentName && (
              <>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1">
                  <Avatar className="h-4 w-4">
                    <AvatarFallback className="text-[8px]">
                      {initials(ticket.agentName)}
                    </AvatarFallback>
                  </Avatar>
                  Assigned to {ticket.agentName}
                </span>
              </>
            )}
          </p>
        </header>

        <StatusTimeline ticket={ticket} />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-4">
            <ConversationThread ticket={ticket} />
            {ticket.status !== 'closed' && <ReplyComposer ticket={ticket} />}
            {ticket.status === 'resolved' && <SatisfactionPrompt />}
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 text-xs">
                <DetailRow label="Status" value={<PortalStatusBadge status={ticket.status} />} />
                <DetailRow label="Category" value={ticket.category} />
                <DetailRow label="Channel" value={<span className="capitalize">{ticket.channel}</span>} />
                <DetailRow label="Opened" value={absoluteDateTime(ticket.createdAt)} />
                {ticket.expectedResolution && ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                  <DetailRow
                    label="Expected by"
                    value={absoluteDateTime(ticket.expectedResolution)}
                  />
                )}
                {ticket.resolvedAt && (
                  <DetailRow label="Resolved" value={absoluteDateTime(ticket.resolvedAt)} />
                )}
                <Separator />
                {ticket.agentName ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback>{initials(ticket.agentName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{ticket.agentName}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {TENANT.name} support
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No agent assigned yet — one will pick this up shortly.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Need to escalate?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <p className="text-muted-foreground">
                  If this is urgent or blocking work, you can request an
                  escalation.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  <Headset className="h-3 w-3" />
                  Request escalation
                </Button>
                <Button variant="ghost" size="sm" className="w-full">
                  <Mail className="h-3 w-3" />
                  Email {TENANT.supportEmail}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Related articles</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y text-xs">
                  <li>
                    <Link
                      href="/kb/connect-to-the-corporate-vpn-on-macos"
                      className="flex items-center justify-between gap-2 px-4 py-2.5 hover:bg-muted/40"
                    >
                      <span className="line-clamp-2">
                        Connect to the corporate VPN on macOS
                      </span>
                      <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/kb/reset-your-multi-factor-authentication-device"
                      className="flex items-center justify-between gap-2 px-4 py-2.5 hover:bg-muted/40"
                    >
                      <span className="line-clamp-2">Reset your MFA device</span>
                      <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

function StatusTimeline({ ticket }: { ticket: PortalTicket }) {
  if (ticket.status === 'closed') return null;

  const currentIndex =
    ticket.status === 'resolved'
      ? 2
      : ticket.status === 'in_progress' || ticket.status === 'waiting_on_you'
        ? 1
        : 0;

  const labels: Record<(typeof STATUS_TIMELINE)[number], string> = {
    submitted: 'Submitted',
    in_progress: 'In progress',
    resolved: 'Resolved',
  };

  return (
    <ol className="grid grid-cols-3 gap-3">
      {STATUS_TIMELINE.map((s, i) => {
        const reached = i <= currentIndex;
        const current = i === currentIndex;
        return (
          <li
            key={s}
            className={cn(
              'rounded-lg border bg-card p-3 text-xs transition-colors',
              reached && 'border-primary/40 bg-primary/5',
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold',
                  reached ? 'bg-primary text-white' : 'bg-muted text-muted-foreground',
                )}
              >
                {reached && !current ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
              </span>
              <span
                className={cn(
                  'font-semibold',
                  reached ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {labels[s]}
              </span>
            </div>
            <p className="mt-1.5 text-[10px] text-muted-foreground">
              {s === 'submitted' && `Created ${relativeTime(ticket.createdAt)}`}
              {s === 'in_progress' &&
                (reached
                  ? `Agent working since ${relativeTime(ticket.updatedAt)}`
                  : 'An agent will pick this up shortly')}
              {s === 'resolved' &&
                (ticket.resolvedAt
                  ? `Resolved ${relativeTime(ticket.resolvedAt)}`
                  : 'Pending resolution')}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

function ConversationThread({ ticket }: { ticket: PortalTicket }) {
  return (
    <div className="space-y-3">
      {ticket.messages.map((m) => {
        const isMe = m.author.role === 'You';
        const isSystem = m.author.role === 'Automated';
        return (
          <Card
            key={m.id}
            className={cn(
              isMe && 'border-primary/30 bg-primary/[0.02]',
              isSystem && 'border-amber-200 bg-amber-50/40',
            )}
          >
            <div className="flex items-center justify-between gap-3 border-b bg-muted/30 px-4 py-2">
              <div className="flex items-center gap-2.5">
                <Avatar className="h-7 w-7">
                  <AvatarFallback>{m.author.avatarHint}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold">{m.author.name}</p>
                    <Badge
                      variant={isMe ? 'default' : isSystem ? 'warning' : 'secondary'}
                      className="h-4 px-1.5 text-[9px]"
                    >
                      {m.author.role}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {absoluteDateTime(m.createdAt)} · {relativeTime(m.createdAt)}
                  </p>
                </div>
              </div>
            </div>
            <CardContent className="px-4 py-3">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {m.body}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function ReplyComposer({ ticket }: { ticket: PortalTicket }) {
  const [reply, setReply] = useState('');
  return (
    <Card>
      <CardHeader className="border-b py-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <MessageSquareText className="h-4 w-4" />
          Reply to {ticket.agentName ?? 'support'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <Textarea
          placeholder="Add a reply, attach a screenshot, or paste an error message..."
          rows={4}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            <Paperclip className="h-3 w-3" />
            Attach files
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Save draft
            </Button>
            <Button size="sm" disabled={!reply.trim()}>
              <Send className="h-3 w-3" />
              Send reply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SatisfactionPrompt() {
  const [rating, setRating] = useState<number | null>(null);
  return (
    <Card className="border-emerald-200 bg-emerald-50/40">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">How did we do?</p>
            <p className="text-xs text-muted-foreground">
              Your feedback helps us improve. This takes 5 seconds.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n} of 5`}
              className={cn(
                'transition-transform hover:scale-110',
                rating !== null && n <= rating ? 'text-orange' : 'text-muted-foreground',
              )}
            >
              <Star
                className={cn(
                  'h-7 w-7',
                  rating !== null && n <= rating && 'fill-orange',
                )}
              />
            </button>
          ))}
        </div>
        {rating !== null && (
          <div className="space-y-2">
            <Textarea placeholder="What worked well? (optional)" rows={2} />
            <div className="flex justify-end">
              <Button size="sm">Submit feedback</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <div className="text-right">{value}</div>
    </div>
  );
}
