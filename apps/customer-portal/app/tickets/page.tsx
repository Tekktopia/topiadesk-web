'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  Clock,
  Inbox,
  MessageSquareText,
  Paperclip,
  Plus,
  Search,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  EmptyState,
  Input,
  cn,
} from '@topiadesk/ui';
import {
  mockPortalTickets,
  type CustomerTicketStatus,
  type PortalTicket,
} from '@/lib/mock-data';
import { initials, relativeTime } from '@/lib/format';
import { PortalStatusBadge } from '../_components/status-badge';

interface ViewTab {
  id: 'open' | 'waiting' | 'resolved' | 'all';
  label: string;
  matches: (t: PortalTicket) => boolean;
}

const TABS: ViewTab[] = [
  {
    id: 'open',
    label: 'Open',
    matches: (t) =>
      ['submitted', 'in_progress', 'waiting_on_you'].includes(t.status),
  },
  {
    id: 'waiting',
    label: 'Waiting on you',
    matches: (t) => t.status === 'waiting_on_you',
  },
  {
    id: 'resolved',
    label: 'Resolved & closed',
    matches: (t) => ['resolved', 'closed'].includes(t.status),
  },
  { id: 'all', label: 'All', matches: () => true },
];

export default function PortalTicketsPage() {
  const [tabId, setTabId] = useState<ViewTab['id']>('open');
  const [search, setSearch] = useState('');

  const counts = useMemo(() => {
    const c: Record<ViewTab['id'], number> = {
      open: 0,
      waiting: 0,
      resolved: 0,
      all: mockPortalTickets.length,
    };
    for (const t of mockPortalTickets) {
      for (const tab of TABS) if (tab.id !== 'all' && tab.matches(t)) c[tab.id]++;
    }
    return c;
  }, []);

  const filtered = useMemo(() => {
    const tab = TABS.find((t) => t.id === tabId) ?? TABS[0]!;
    return mockPortalTickets
      .filter(tab.matches)
      .filter((t) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          t.subject.toLowerCase().includes(q) ||
          t.number.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
  }, [tabId, search]);

  return (
    <div className="bg-muted/20">
      <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Your support tickets
            </p>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              My tickets
            </h1>
            <p className="text-sm text-muted-foreground">
              Track every conversation with the support team.
            </p>
          </div>
          <Button asChild size="sm">
            <Link href="/submit">
              <Plus className="h-3 w-3" />
              New request
            </Link>
          </Button>
        </header>

        <Card>
          <div className="flex flex-wrap items-center gap-2 border-b p-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTabId(tab.id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  tabId === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[9px] tabular-nums',
                    tabId === tab.id
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {counts[tab.id]}
                </span>
              </button>
            ))}
            <div className="relative ml-auto">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search subject or ticket number"
                className="h-8 w-64 pl-8 text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title="No tickets here"
                description={
                  search
                    ? `No tickets match "${search}"`
                    : "You don't have any tickets in this view yet."
                }
                action={
                  <Button asChild size="sm">
                    <Link href="/submit">
                      <Plus className="h-3 w-3" />
                      Submit a request
                    </Link>
                  </Button>
                }
                className="m-6"
              />
            ) : (
              <ul className="divide-y">
                {filtered.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/tickets/${t.id}`}
                      className="flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-muted/40 sm:flex-row sm:items-start sm:gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {t.number}
                          </span>
                          <PortalStatusBadge status={t.status} />
                          <Badge variant="outline" className="text-[10px]">
                            {t.category}
                          </Badge>
                          {t.status === 'waiting_on_you' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                              <MessageSquareText className="h-2.5 w-2.5" />
                              Action needed
                            </span>
                          )}
                        </div>
                        <p className="mt-1 truncate text-sm font-medium">
                          {t.subject}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                          {t.description}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Updated {relativeTime(t.updatedAt)}
                          </span>
                          {t.agentName && (
                            <span className="inline-flex items-center gap-1">
                              <Avatar className="h-4 w-4">
                                <AvatarFallback className="text-[8px]">
                                  {initials(t.agentName)}
                                </AvatarFallback>
                              </Avatar>
                              {t.agentName}
                            </span>
                          )}
                          {t.attachments && t.attachments > 0 && (
                            <span className="inline-flex items-center gap-1">
                              <Paperclip className="h-3 w-3" />
                              {t.attachments} attachment
                              {t.attachments > 1 ? 's' : ''}
                            </span>
                          )}
                          <span>
                            {t.messages.length} message
                            {t.messages.length === 1 ? '' : 's'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          Don&rsquo;t see a ticket? Search by subject or ticket number above, or
          ask{' '}
          <Link href="mailto:support@consomoafrica.com" className="text-primary hover:underline">
            support
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export type { CustomerTicketStatus };
