'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  PriorityIndicator,
  Skeleton,
  StatusPill,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from '@topiadesk/ui';
import { useTickets } from '../../lib/queries';
import { initials, relativeTime } from '../../lib/format';
import type { TicketStatus } from '../../lib/mock-data';

const statusFilters: Array<TicketStatus | 'all'> = [
  'all',
  'new',
  'open',
  'in_progress',
  'pending',
  'escalated',
  'resolved',
];

const filterLabels: Record<TicketStatus | 'all', string> = {
  all: 'All',
  new: 'New',
  open: 'Open',
  in_progress: 'In progress',
  pending: 'Pending',
  on_hold: 'On hold',
  escalated: 'Escalated',
  resolved: 'Resolved',
  closed: 'Closed',
};

export default function TicketsPage() {
  const { data: tickets, isLoading } = useTickets();
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const list = tickets ?? [];
    return list.filter((t) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !t.subject.toLowerCase().includes(q) &&
          !t.number.toLowerCase().includes(q) &&
          !t.requester.name.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [tickets, statusFilter, search]);

  return (
    <div className="space-y-4 p-6">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tickets</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} of {tickets?.length ?? 0} tickets
            {statusFilter !== 'all' ? ` · ${filterLabels[statusFilter]}` : ''}
          </p>
        </div>
        <Button>New ticket</Button>
      </header>

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative max-w-xs flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by subject, number, requester..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {statusFilters.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                    statusFilter === s
                      ? 'bg-brand-navy text-white'
                      : 'bg-muted text-foreground hover:bg-muted/70',
                  )}
                >
                  {filterLabels[s]}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <Skeleton className="h-96" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => (
                  <TableRow key={t.id} className="cursor-pointer">
                    <TableCell>
                      <Link href={`/tickets/${t.id}`} className="block">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">
                            {t.number}
                          </span>
                          {t.slaStatus === 'breached' && (
                            <Badge variant="danger">SLA breached</Badge>
                          )}
                          {t.slaStatus === 'at_risk' && (
                            <Badge variant="warning">SLA at risk</Badge>
                          )}
                        </div>
                        <p className="mt-1 max-w-md truncate font-medium hover:underline">
                          {t.subject}
                        </p>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{t.requester.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {t.requester.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusPill status={t.status} />
                    </TableCell>
                    <TableCell>
                      <PriorityIndicator priority={t.priority} />
                    </TableCell>
                    <TableCell>
                      {t.assignee ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>
                              {initials(t.assignee.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{t.assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Unassigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {relativeTime(t.updatedAt)}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-12 text-center text-sm text-muted-foreground"
                    >
                      No tickets match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
