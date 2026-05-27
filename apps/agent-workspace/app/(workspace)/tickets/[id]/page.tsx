'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  AtSign,
  ArrowLeft,
  Bold,
  Bookmark,
  ChevronDown,
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
    <div className="flex h-full min-h-[calc(100vh-3.5rem)] flex-col">
      <StatusBar ticket={ticket} />

      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[1fr_360px]">
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
            <h1 className="font-display text-2xl font-bold leading-tight">
              {ticket.subject}
            </h1>
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
                requester={ticket.requester}
                description={ticket.description}
                createdAt={ticket.createdAt}
                messages={ticket.conversations}
              />
              <Composer />
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
        <Button variant="outline" size="sm" className="h-7">
          Mark resolved
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
  requester: Person;
  description: string;
  createdAt: string;
  messages: ConversationMessage[];
}

function ConversationThread({
  requester,
  description,
  createdAt,
  messages,
}: ConversationThreadProps) {
  const opening: ConversationMessage = {
    id: 'opening',
    author: requester,
    authorType: 'customer',
    body: description,
    isInternal: false,
    createdAt,
  };
  const all = [opening, ...messages];

  return (
    <div className="space-y-3">
      {all.map((m) => (
        <Card
          key={m.id}
          className={cn(
            'overflow-hidden',
            m.isInternal && 'border-amber-300/60 bg-amber-50/40',
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b bg-muted/30 px-4 py-2">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-7 w-7">
                <AvatarFallback>{initials(m.author.name)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold">{m.author.name}</p>
                  <Badge
                    variant={m.authorType === 'agent' ? 'secondary' : 'outline'}
                    className="h-4 px-1.5 text-[9px]"
                  >
                    {m.authorType === 'agent' ? 'Agent' : 'Customer'}
                  </Badge>
                  {m.isInternal && (
                    <Badge variant="warning" className="h-4 px-1.5 text-[9px]">
                      <Lock className="h-2.5 w-2.5" />
                      Internal note
                    </Badge>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {absoluteDateTime(m.createdAt)} · {relativeTime(m.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Reply className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <CardContent className="px-4 py-3">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {m.body}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Composer() {
  return (
    <Card>
      <div className="flex items-center gap-2 border-b bg-muted/30 px-3 py-1.5 text-xs">
        <button className="rounded px-2 py-1 font-medium text-foreground hover:bg-background">
          Reply
        </button>
        <button className="rounded px-2 py-1 font-medium text-muted-foreground hover:bg-background">
          <Lock className="mr-1 inline-block h-3 w-3" />
          Internal note
        </button>
        <button className="rounded px-2 py-1 font-medium text-muted-foreground hover:bg-background">
          Forward
        </button>
        <span className="ml-auto text-[10px] text-muted-foreground">
          Replying to {`Sarah Okonkwo <sarah.o@acmebank.ng>`}
        </span>
      </div>
      <CardContent className="space-y-3 p-3">
        <div className="flex items-center gap-1 border-b pb-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Bold className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Italic className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Underline className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Underline</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Link2 className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Link</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <ListChecks className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bulleted list</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="mx-1 h-4" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Paperclip className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Attach file</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Smile className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Emoji</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <AtSign className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mention agent</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="mx-1 h-4" />
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
            <FileText className="h-3 w-3" />
            Canned response
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-orange">
            <Sparkles className="h-3 w-3" />
            AI suggest
          </Button>
        </div>
        <Textarea
          placeholder="Type your reply..."
          rows={5}
          className="resize-none border-0 px-0 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Tag className="h-3 w-3" />
            Add tag on send
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8">
              Save draft
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="h-8">
                  <Send className="h-3 w-3" />
                  Send
                  <ChevronDown className="h-3 w-3 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>Send</DropdownMenuItem>
                <DropdownMenuItem>Send and set Pending</DropdownMenuItem>
                <DropdownMenuItem>Send and resolve</DropdownMenuItem>
                <DropdownMenuItem>Send and snooze</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
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

