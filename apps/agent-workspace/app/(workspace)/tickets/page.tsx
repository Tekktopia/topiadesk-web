'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Bookmark,
  ChevronDown,
  Download,
  Filter,
  Inbox,
  LayoutGrid,
  Mail,
  MoreHorizontal,
  Plus,
  Reply,
  Rows3,
  Search,
  Sparkles,
  Tag,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from '@topiadesk/ui';
import { useTickets } from '@/lib/queries';
import type { MockTicket, TicketStatus } from '@/lib/mock-data';
import { initials, relativeTime } from '@/lib/format';

interface View {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  count?: number;
  filter: (t: MockTicket) => boolean;
}

const CURRENT_AGENT_ID = 'a1';

const VIEWS: View[] = [
  {
    id: 'all',
    label: 'All open',
    icon: Inbox,
    filter: (t) => !['resolved', 'closed', 'spam'].includes(t.status),
  },
  {
    id: 'my-open',
    label: 'My open',
    icon: Mail,
    filter: (t) =>
      t.assignee?.id === CURRENT_AGENT_ID &&
      !['resolved', 'closed', 'spam'].includes(t.status),
  },
  {
    id: 'unassigned',
    label: 'Unassigned',
    icon: UserPlus,
    filter: (t) => !t.assignee,
  },
  {
    id: 'attention',
    label: 'Needs attention',
    icon: Sparkles,
    filter: (t) =>
      t.slaStatus === 'breached' ||
      t.slaStatus === 'at_risk' ||
      t.status === 'escalated',
  },
  {
    id: 'high-priority',
    label: 'High priority',
    icon: Bookmark,
    filter: (t) => t.priority === 'high' || t.priority === 'urgent',
  },
  {
    id: 'resolved',
    label: 'Resolved this week',
    icon: ArrowUpRight,
    filter: (t) => t.status === 'resolved',
  },
];

const STATUS_OPTIONS: TicketStatus[] = [
  'new',
  'open',
  'in_progress',
  'pending',
  'on_hold',
  'escalated',
  'resolved',
  'closed',
];

type SortKey = 'updated' | 'priority' | 'created';
type Density = 'compact' | 'comfortable';

export default function TicketsPage() {
  const { data: tickets, isLoading } = useTickets();
  const [viewId, setViewId] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Set<TicketStatus>>(
    new Set(),
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({
    key: 'updated',
    dir: 'desc',
  });
  const [density, setDensity] = useState<Density>('comfortable');

  const activeView = VIEWS.find((v) => v.id === viewId) ?? VIEWS[0]!;

  const viewCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const v of VIEWS) map[v.id] = 0;
    for (const t of tickets ?? []) {
      for (const v of VIEWS) if (v.filter(t)) map[v.id] = (map[v.id] ?? 0) + 1;
    }
    return map;
  }, [tickets]);

  const filtered = useMemo(() => {
    const list = (tickets ?? []).filter(activeView.filter);
    return list
      .filter((t) => {
        if (statusFilter.size > 0 && !statusFilter.has(t.status)) return false;
        if (search) {
          const q = search.toLowerCase();
          if (
            !t.subject.toLowerCase().includes(q) &&
            !t.number.toLowerCase().includes(q) &&
            !t.requester.name.toLowerCase().includes(q) &&
            !t.category.toLowerCase().includes(q)
          ) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const dir = sort.dir === 'asc' ? 1 : -1;
        if (sort.key === 'updated') {
          return (
            (new Date(a.updatedAt).getTime() -
              new Date(b.updatedAt).getTime()) *
            dir
          );
        }
        if (sort.key === 'created') {
          return (
            (new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime()) *
            dir
          );
        }
        const order: Record<string, number> = {
          urgent: 4,
          high: 3,
          medium: 2,
          low: 1,
        };
        return ((order[a.priority] ?? 0) - (order[b.priority] ?? 0)) * dir;
      });
  }, [tickets, activeView, search, statusFilter, sort]);

  const allSelected =
    filtered.length > 0 && filtered.every((t) => selected.has(t.id));
  const someSelected =
    filtered.some((t) => selected.has(t.id)) && !allSelected;

  function toggleSelectAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((t) => t.id)));
    }
  }

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleStatusFilter(s: TicketStatus) {
    setStatusFilter((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }

  function flipSort(key: SortKey) {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'desc' },
    );
  }

  const previewTicket = previewId
    ? filtered.find((t) => t.id === previewId) ?? null
    : null;

  return (
    <div className="grid h-full min-h-[calc(100vh-3.5rem)] grid-cols-1 md:grid-cols-[220px_1fr] xl:grid-cols-[220px_1fr_380px]">
      <ViewsRail
        viewId={viewId}
        onViewChange={(id) => {
          setViewId(id);
          setSelected(new Set());
          setPreviewId(null);
        }}
        counts={viewCounts}
      />

      <div className="flex min-w-0 flex-col border-l">
        <ListHeader
          activeView={activeView}
          total={tickets?.length ?? 0}
          showing={filtered.length}
          search={search}
          setSearch={setSearch}
          density={density}
          setDensity={setDensity}
        />

        <FilterBar
          statusFilter={statusFilter}
          onToggleStatus={toggleStatusFilter}
          onClear={() => setStatusFilter(new Set())}
        />

        {selected.size > 0 && <BulkActionBar count={selected.size} onClear={() => setSelected(new Set())} />}

        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="p-4">
              <Skeleton className="h-96" />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No tickets match your filters"
              description="Try clearing filters or switching views."
              className="m-6"
            />
          ) : (
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-card">
                <TableRow>
                  <TableHead className="w-10 pl-4">
                    <Checkbox
                      checked={
                        allSelected
                          ? true
                          : someSelected
                            ? 'indeterminate'
                            : false
                      }
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <SortableHead
                    label="Ticket"
                    active={false}
                    onClick={() => undefined}
                  />
                  <TableHead>Requester</TableHead>
                  <TableHead>Status</TableHead>
                  <SortableHead
                    label="Priority"
                    active={sort.key === 'priority'}
                    dir={sort.dir}
                    onClick={() => flipSort('priority')}
                  />
                  <TableHead>Assignee</TableHead>
                  <SortableHead
                    label="Updated"
                    active={sort.key === 'updated'}
                    dir={sort.dir}
                    onClick={() => flipSort('updated')}
                    className="w-32"
                  />
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => (
                  <TicketRow
                    key={t.id}
                    ticket={t}
                    selected={selected.has(t.id)}
                    onToggle={() => toggleRow(t.id)}
                    onPreview={() => setPreviewId(t.id)}
                    isPreviewed={previewId === t.id}
                    density={density}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <Footer count={filtered.length} />
      </div>

      <PreviewPane ticket={previewTicket} onClose={() => setPreviewId(null)} />
    </div>
  );
}

interface ViewsRailProps {
  viewId: string;
  onViewChange: (id: string) => void;
  counts: Record<string, number>;
}

function ViewsRail({ viewId, onViewChange, counts }: ViewsRailProps) {
  return (
    <aside className="hidden flex-col bg-muted/30 md:flex">
      <div className="flex h-14 items-center justify-between border-b px-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Views
        </p>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="Create view"
              className="grid h-6 w-6 place-items-center rounded text-muted-foreground hover:bg-background hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Save current as view</TooltipContent>
        </Tooltip>
      </div>
      <ul className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {VIEWS.map((v) => {
          const Icon = v.icon;
          const active = v.id === viewId;
          return (
            <li key={v.id}>
              <button
                type="button"
                onClick={() => onViewChange(v.id)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                  active
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-background',
                )}
              >
                <Icon
                  className={cn(
                    'h-3.5 w-3.5 shrink-0',
                    active ? 'text-white' : 'text-muted-foreground',
                  )}
                />
                <span className="flex-1 truncate text-left">{v.label}</span>
                <span
                  className={cn(
                    'text-[11px] tabular-nums',
                    active ? 'text-white/80' : 'text-muted-foreground',
                  )}
                >
                  {counts[v.id] ?? 0}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="border-t p-2 text-[10px] text-muted-foreground">
        <button className="flex w-full items-center justify-between rounded-md px-2 py-1.5 hover:bg-background">
          <span>Shared views (2)</span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>
    </aside>
  );
}

interface ListHeaderProps {
  activeView: View;
  total: number;
  showing: number;
  search: string;
  setSearch: (v: string) => void;
  density: Density;
  setDensity: (d: Density) => void;
}

function ListHeader({
  activeView,
  total,
  showing,
  search,
  setSearch,
  density,
  setDensity,
}: ListHeaderProps) {
  const Icon = activeView.icon;
  return (
    <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-card px-4">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <div>
          <h2 className="text-sm font-semibold leading-tight">
            {activeView.label}
          </h2>
          <p className="text-[10px] text-muted-foreground">
            Showing {showing} of {total}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search this view"
            className="h-8 w-56 pl-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() =>
                setDensity(density === 'compact' ? 'comfortable' : 'compact')
              }
              aria-label="Toggle density"
            >
              {density === 'compact' ? (
                <LayoutGrid className="h-3.5 w-3.5" />
              ) : (
                <Rows3 className="h-3.5 w-3.5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {density === 'compact' ? 'Comfortable density' : 'Compact density'}
          </TooltipContent>
        </Tooltip>

        <Button variant="outline" size="sm" className="h-8">
          <Download className="h-3.5 w-3.5" />
          Export
        </Button>
        <Button size="sm" className="h-8">
          <Plus className="h-3.5 w-3.5" />
          New ticket
        </Button>
      </div>
    </div>
  );
}

interface FilterBarProps {
  statusFilter: Set<TicketStatus>;
  onToggleStatus: (s: TicketStatus) => void;
  onClear: () => void;
}

function FilterBar({ statusFilter, onToggleStatus, onClear }: FilterBarProps) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 border-b bg-muted/20 px-4 py-2">
      <Filter className="h-3 w-3 text-muted-foreground" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-input bg-card px-2.5 py-0.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            Status
            {statusFilter.size > 0 && (
              <Badge variant="secondary" className="h-4 px-1.5 text-[9px]">
                {statusFilter.size}
              </Badge>
            )}
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
          {STATUS_OPTIONS.map((s) => (
            <DropdownMenuItem
              key={s}
              onSelect={(e) => {
                e.preventDefault();
                onToggleStatus(s);
              }}
            >
              <Checkbox checked={statusFilter.has(s)} />
              <span className="capitalize">{s.replace('_', ' ')}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {[...statusFilter].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onToggleStatus(s)}
          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
        >
          <span className="capitalize">{s.replace('_', ' ')}</span>
          <X className="h-3 w-3" />
        </button>
      ))}

      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-full border border-dashed border-input bg-card px-2.5 py-0.5 text-xs font-medium text-foreground hover:bg-muted"
      >
        Priority
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-full border border-dashed border-input bg-card px-2.5 py-0.5 text-xs font-medium text-foreground hover:bg-muted"
      >
        Assignee
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-full border border-dashed border-input bg-card px-2.5 py-0.5 text-xs font-medium text-foreground hover:bg-muted"
      >
        Channel
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>

      {statusFilter.size > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="ml-1 text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}

function BulkActionBar({
  count,
  onClear,
}: {
  count: number;
  onClear: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2 border-b bg-primary/5 px-4 py-2 text-sm">
      <span className="font-medium text-foreground">{count} selected</span>
      <Button variant="outline" size="sm" className="h-7 text-xs">
        <UserPlus className="h-3 w-3" />
        Assign
      </Button>
      <Button variant="outline" size="sm" className="h-7 text-xs">
        <Tag className="h-3 w-3" />
        Tag
      </Button>
      <Button variant="outline" size="sm" className="h-7 text-xs">
        <Reply className="h-3 w-3" />
        Reply with macro
      </Button>
      <Button variant="outline" size="sm" className="h-7 text-xs text-red-600">
        <Trash2 className="h-3 w-3" />
        Move to trash
      </Button>
      <button
        type="button"
        onClick={onClear}
        className="ml-auto text-xs text-muted-foreground hover:text-foreground"
      >
        Clear selection
      </button>
    </div>
  );
}

interface SortableHeadProps {
  label: string;
  active: boolean;
  dir?: 'asc' | 'desc';
  onClick: () => void;
  className?: string;
}

function SortableHead({
  label,
  active,
  dir,
  onClick,
  className,
}: SortableHeadProps) {
  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'inline-flex items-center gap-1 transition-colors',
          active ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {label}
        {active &&
          (dir === 'asc' ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          ))}
      </button>
    </TableHead>
  );
}

interface TicketRowProps {
  ticket: MockTicket;
  selected: boolean;
  onToggle: () => void;
  onPreview: () => void;
  isPreviewed: boolean;
  density: Density;
}

function TicketRow({
  ticket,
  selected,
  onToggle,
  onPreview,
  isPreviewed,
  density,
}: TicketRowProps) {
  const compact = density === 'compact';
  return (
    <TableRow
      onClick={onPreview}
      className={cn(
        'cursor-pointer',
        selected && 'bg-primary/5',
        isPreviewed && 'bg-primary/10',
      )}
    >
      <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={selected}
          onCheckedChange={onToggle}
          aria-label={`Select ${ticket.number}`}
        />
      </TableCell>
      <TableCell className={cn(compact && 'py-2')}>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-muted-foreground">
            {ticket.number}
          </span>
          {ticket.slaStatus === 'breached' && (
            <Badge variant="danger" className="h-4 px-1.5 text-[9px]">
              SLA
            </Badge>
          )}
          {ticket.slaStatus === 'at_risk' && (
            <Badge variant="warning" className="h-4 px-1.5 text-[9px]">
              SLA
            </Badge>
          )}
        </div>
        <p className="mt-0.5 max-w-md truncate text-sm font-medium">
          {ticket.subject}
        </p>
        {!compact && (
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            {ticket.category} · {ticket.group}
          </p>
        )}
      </TableCell>
      <TableCell className={cn(compact && 'py-2')}>
        {compact ? (
          <span className="text-xs">{ticket.requester.name}</span>
        ) : (
          <>
            <div className="text-sm">{ticket.requester.name}</div>
            <div className="text-[11px] text-muted-foreground">
              {ticket.requester.email}
            </div>
          </>
        )}
      </TableCell>
      <TableCell className={cn(compact && 'py-2')}>
        <StatusPill status={ticket.status} />
      </TableCell>
      <TableCell className={cn(compact && 'py-2')}>
        <PriorityIndicator priority={ticket.priority} />
      </TableCell>
      <TableCell className={cn(compact && 'py-2')}>
        {ticket.assignee ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>
                    {initials(ticket.assignee.name)}
                  </AvatarFallback>
                </Avatar>
                {!compact && (
                  <span className="text-xs">{ticket.assignee.name}</span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>{ticket.assignee.name}</TooltipContent>
          </Tooltip>
        ) : (
          <span className="text-[11px] text-muted-foreground">Unassigned</span>
        )}
      </TableCell>
      <TableCell
        className={cn('whitespace-nowrap text-[11px] text-muted-foreground', compact && 'py-2')}
      >
        {relativeTime(ticket.updatedAt)}
      </TableCell>
      <TableCell className="pr-3" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Row actions"
              className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>Assign to me</DropdownMenuItem>
            <DropdownMenuItem>Reassign</DropdownMenuItem>
            <DropdownMenuItem>Add tag</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Mark resolved</DropdownMenuItem>
            <DropdownMenuItem>Mark spam</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function Footer({ count }: { count: number }) {
  return (
    <div className="flex shrink-0 items-center justify-between border-t bg-card px-4 py-2 text-xs text-muted-foreground">
      <span>{count} tickets</span>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
          Previous
        </Button>
        <span className="px-2">Page 1 of 1</span>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
          Next
        </Button>
      </div>
    </div>
  );
}

function PreviewPane({
  ticket,
  onClose,
}: {
  ticket: MockTicket | null;
  onClose: () => void;
}) {
  if (!ticket) {
    return (
      <aside className="hidden flex-col items-center justify-center border-l bg-muted/20 p-6 text-center xl:flex">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
          <Inbox className="h-5 w-5" />
        </div>
        <p className="mt-3 text-sm font-medium">Select a ticket</p>
        <p className="mt-1 max-w-[240px] text-xs text-muted-foreground">
          Click a row to preview it here without leaving the queue.
        </p>
      </aside>
    );
  }

  const lastMessage = ticket.conversations[ticket.conversations.length - 1];

  return (
    <aside className="hidden flex-col border-l bg-card xl:flex">
      <div className="flex h-14 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {ticket.number}
          </span>
          <StatusPill status={ticket.status} />
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        <div>
          <h3 className="font-display text-base font-bold leading-tight">
            {ticket.subject}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Opened by {ticket.requester.name} · {relativeTime(ticket.createdAt)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <Property label="Priority" value={<PriorityIndicator priority={ticket.priority} />} />
          <Property label="Category" value={ticket.category} />
          <Property label="Group" value={ticket.group} />
          <Property
            label="Assignee"
            value={
              ticket.assignee ? (
                <div className="flex items-center gap-1.5">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback>
                      {initials(ticket.assignee.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{ticket.assignee.name}</span>
                </div>
              ) : (
                <span className="text-muted-foreground">Unassigned</span>
              )
            }
          />
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Description
          </p>
          <p className="line-clamp-4 text-xs text-foreground">
            {ticket.description}
          </p>
        </div>

        {lastMessage && (
          <div className="space-y-2 rounded-md bg-muted/40 p-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback>
                  {initials(lastMessage.author.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium">
                  {lastMessage.author.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {relativeTime(lastMessage.createdAt)} · Last message
                </p>
              </div>
            </div>
            <p className="line-clamp-3 text-xs text-muted-foreground">
              {lastMessage.body}
            </p>
          </div>
        )}

        {ticket.tags.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Tags
            </p>
            <div className="flex flex-wrap gap-1">
              {ticket.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px]">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2 border-t p-3">
        <Button asChild className="w-full">
          <Link href={`/tickets/${ticket.id}`}>Open full ticket</Link>
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm">
            <Reply className="h-3 w-3" />
            Reply
          </Button>
          <Button variant="outline" size="sm">
            <UserPlus className="h-3 w-3" />
            Assign me
          </Button>
        </div>
      </div>
    </aside>
  );
}

function Property({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-0.5">{value}</div>
    </div>
  );
}
