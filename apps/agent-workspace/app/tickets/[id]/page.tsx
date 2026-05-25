'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Lock, Paperclip } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  PriorityIndicator,
  Separator,
  Skeleton,
  StatusPill,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from '@topiadesk/ui';
import { useTicket } from '../../../lib/queries';
import { mockAssets } from '../../../lib/mock-data';
import { absoluteDateTime, initials, relativeTime } from '../../../lib/format';
import type { ConversationMessage, Person } from '../../../lib/mock-data';

export default function TicketDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: ticket, isLoading } = useTicket(params.id);

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Ticket not found.</p>
        <Link
          href="/tickets"
          className="mt-3 inline-flex items-center gap-2 text-sm text-brand-navy hover:underline"
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
    <div className="grid h-full grid-cols-1 lg:grid-cols-[1fr_340px]">
      <div className="space-y-4 overflow-y-auto p-6">
        <Link
          href="/tickets"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> Back to tickets
        </Link>

        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm text-muted-foreground">
              {ticket.number}
            </span>
            <StatusPill status={ticket.status} />
            {ticket.slaStatus === 'breached' && (
              <Badge variant="danger">SLA breached</Badge>
            )}
            {ticket.slaStatus === 'at_risk' && (
              <Badge variant="warning">SLA at risk</Badge>
            )}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {ticket.subject}
          </h1>
          <p className="text-sm text-muted-foreground">
            Opened by {ticket.requester.name} ·{' '}
            {relativeTime(ticket.createdAt)} · {ticket.category}
          </p>
        </header>

        <Tabs defaultValue="conversation" className="space-y-4">
          <TabsList>
            <TabsTrigger value="conversation">Conversation</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="related">Related</TabsTrigger>
          </TabsList>

          <TabsContent value="conversation" className="space-y-4">
            <ConversationThread
              requester={ticket.requester}
              description={ticket.description}
              createdAt={ticket.createdAt}
              messages={ticket.conversations}
            />

            <Card>
              <CardHeader>
                <CardTitle>Reply</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="Type your reply to the customer..."
                  rows={5}
                />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Button variant="ghost" size="sm">
                      <Lock className="h-4 w-4" />
                      Internal note
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                      Attach
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Save draft
                    </Button>
                    <Button size="sm">Send reply</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                The audit log of every change made to this ticket will appear
                here.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="related">
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Related tickets, knowledge base articles, and merged tickets
                will appear here.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <aside className="space-y-6 overflow-y-auto border-l bg-background p-6">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Properties
          </h3>
          <dl className="mt-3 space-y-3 text-sm">
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
              label="Assignee"
              value={
                ticket.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        {initials(ticket.assignee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{ticket.assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Unassigned</span>
                )
              }
            />
            <PropertyRow
              label="SLA due"
              value={
                <span className="text-xs">
                  {absoluteDateTime(ticket.slaDueAt)}
                </span>
              }
            />
          </dl>
        </div>

        <Separator />

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Requester
          </h3>
          <div className="mt-3 flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{initials(ticket.requester.name)}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">{ticket.requester.name}</p>
              <p className="text-xs text-muted-foreground">
                {ticket.requester.email}
              </p>
            </div>
          </div>
        </div>

        {linkedAsset && (
          <>
            <Separator />
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Linked asset
              </h3>
              <Card className="mt-3">
                <CardContent className="space-y-1 p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">
                      {linkedAsset.tag}
                    </span>
                    <Badge variant="outline">{linkedAsset.category}</Badge>
                  </div>
                  <p className="font-medium">{linkedAsset.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {linkedAsset.specifications}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {linkedAsset.location}
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {ticket.tags.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tags
              </h3>
              <div className="mt-3 flex flex-wrap gap-1">
                {ticket.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
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
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
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
          className={m.isInternal ? 'border-warning/40 bg-warning/5' : undefined}
        >
          <CardContent className="space-y-2 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback>{initials(m.author.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{m.author.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.authorType === 'agent' ? 'Agent' : 'Customer'} ·{' '}
                    {relativeTime(m.createdAt)}
                  </p>
                </div>
              </div>
              {m.isInternal && (
                <Badge variant="warning">Internal note</Badge>
              )}
            </div>
            <p className="whitespace-pre-wrap text-sm">{m.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
