'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Bookmark,
  Bot,
  ChevronDown,
  ChevronRight,
  Code,
  Database,
  Download,
  Filter,
  Globe,
  Group,
  Inbox,
  LayoutGrid,
  Mail,
  MessageSquare,
  MonitorSmartphone,
  MoreHorizontal,
  Phone,
  Plus,
  Reply,
  Rows3,
  Search,
  Smartphone,
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
import { agentDirectory, mockAISuggestions } from '@/lib/mock-data';
import { PendingBadge } from '@/app/_components/pending-badge';
import type {
  MockTicket,
  Person,
  TicketChannel,
  TicketPriority,
  TicketStatus,
} from '@/lib/mock-data';
import { absoluteDateTime, initials, relativeTime } from '@/lib/format';

interface View {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  source: 'system' | 'personal' | 'shared';
  filter: (t: MockTicket) => boolean;
}

const CURRENT_AGENT_ID = 'a1';

const VIEWS: View[] = [
  {
    id: 'all',
    label: 'All open',
    icon: Inbox,
    source: 'system',
    filter: (t) => !['resolved', 'closed', 'spam'].includes(t.status),
  },
  {
    id: 'my-open',
    label: 'My open',
    icon: Mail,
    source: 'system',
    filter: (t) =>
      t.assignee?.id === CURRENT_AGENT_ID &&
      !['resolved', 'closed', 'spam'].includes(t.status),
  },
  {
    id: 'unassigned',
    label: 'Unassigned',
    icon: UserPlus,
    source: 'system',
    filter: (t) => !t.assignee,
  },
  {
    id: 'attention',
    label: 'Needs attention',
    icon: Sparkles,
    source: 'system',
    filter: (t) =>
      t.slaStatus === 'breached' ||
      t.slaStatus === 'at_risk' ||
      t.status === 'escalated',
  },
  {
    id: 'high-priority',
    label: 'High priority',
    icon: Bookmark,
    source: 'system',
    filter: (t) => t.priority === 'high' || t.priority === 'urgent',
  },
  {
    id: 'vip',
    label: 'VIP requesters',
    icon: Sparkles,
    source: 'personal',
    filter: (t) => t.tags.includes('vip'),
  },
  {
    id: 'resolved',
    label: 'Resolved this week',
    icon: Inbox,
    source: 'shared',
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

const PRIORITY_OPTIONS: TicketPriority[] = ['low', 'medium', 'high', 'urgent'];

const CHANNEL_OPTIONS: TicketChannel[] = [
  'email',
  'portal',
  'whatsapp',
  'voice',
  'sms',
  'widget',
  'api',
];

const CHANNEL_META: Record<TicketChannel, { label: string; icon: ComponentType<{ className?: string }> }> = {
  email: { label: 'Email', icon: Mail },
  portal: { label: 'Customer portal', icon: Globe },
  whatsapp: { label: 'WhatsApp', icon: Smartphone },
  voice: { label: 'Voice call', icon: Phone },
  sms: { label: 'SMS', icon: MessageSquare },
  widget: { label: 'Web widget', icon: MonitorSmartphone },
  api: { label: 'API', icon: Code },
};

const STATUS_LABEL: Record<TicketStatus, string> = {
  new: 'New',
  open: 'Open',
  in_progress: 'In progress',
  pending: 'Pending',
  on_hold: 'On hold',
  escalated: 'Escalated',
  resolved: 'Resolved',
  closed: 'Closed',
};

const PRIORITY_LABEL: Record<TicketPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

type SortKey = 'updated' | 'priority' | 'created' | 'sla';
type Density = 'compact' | 'comfortable';
type GroupKey = 'none' | 'status' | 'priority' | 'assignee' | 'channel';

const PAGE_SIZE = 25;

export default function TicketsPage() {
  const { data: tickets, isLoading, isOfflineCached } = useTickets();

  const [viewId, setViewId] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Set<TicketStatus>>(new Set());
  const [priorityFilter, setPriorityFilter] = useState<Set<TicketPriority>>(new Set());
  const [assigneeFilter, setAssigneeFilter] = useState<Set<string>>(new Set());
  const [channelFilter, setChannelFilter] = useState<Set<TicketChannel>>(new Set());

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({
    key: 'updated',
    dir: 'desc',
  });
  const [density, setDensity] = useState<Density>('comfortable');
  const [groupBy, setGroupBy] = useState<GroupKey>('none');
  const [page, setPage] = useState(1);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

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
        if (priorityFilter.size > 0 && !priorityFilter.has(t.priority)) return false;
        if (channelFilter.size > 0 && !channelFilter.has(t.channel)) return false;
        if (assigneeFilter.size > 0) {
          if (assigneeFilter.has('__unassigned__')) {
            if (t.assignee && !assigneeFilter.has(t.assignee.id)) return false;
            if (!t.assignee) {
              // include unassigned (allowed)
            } else if (!assigneeFilter.has(t.assignee.id)) {
              return false;
            }
          } else {
            if (!t.assignee || !assigneeFilter.has(t.assignee.id)) return false;
          }
        }
        if (search) {
          const q = search.toLowerCase();
          const hay = [
            t.subject,
            t.number,
            t.requester.name,
            t.requester.email,
            t.category,
            ...t.tags,
          ]
            .join(' ')
            .toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const dir = sort.dir === 'asc' ? 1 : -1;
        if (sort.key === 'updated') {
          return (
            (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) *
            dir
          );
        }
        if (sort.key === 'created') {
          return (
            (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) *
            dir
          );
        }
        if (sort.key === 'sla') {
          return (
            (new Date(a.slaDueAt).getTime() - new Date(b.slaDueAt).getTime()) *
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
  }, [
    tickets,
    activeView,
    search,
    statusFilter,
    priorityFilter,
    assigneeFilter,
    channelFilter,
    sort,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageRows = groupBy === 'none' ? filtered.slice(pageStart, pageStart + PAGE_SIZE) : filtered;

  const grouped = useMemo(() => groupTickets(pageRows, groupBy), [pageRows, groupBy]);

  const allSelected =
    pageRows.length > 0 && pageRows.every((t) => selected.has(t.id));
  const someSelected =
    pageRows.some((t) => selected.has(t.id)) && !allSelected;

  function clearAllFilters() {
    setStatusFilter(new Set());
    setPriorityFilter(new Set());
    setAssigneeFilter(new Set());
    setChannelFilter(new Set());
    setSearch('');
  }

  function toggleSelectAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(pageRows.map((t) => t.id)));
  }

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
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

  function toggleGroup(key: string) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const previewTicket = previewId
    ? filtered.find((t) => t.id === previewId) ?? null
    : null;

  const activeFilterCount =
    statusFilter.size +
    priorityFilter.size +
    assigneeFilter.size +
    channelFilter.size +
    (search ? 1 : 0);

  return (
    <div className="grid h-full min-h-[calc(100vh-3.5rem)] grid-cols-1 md:grid-cols-[220px_1fr] xl:grid-cols-[220px_1fr_380px]">
      <ViewsRail
        viewId={viewId}
        onViewChange={(id) => {
          setViewId(id);
          setSelected(new Set());
          setPreviewId(null);
          setPage(1);
        }}
        counts={viewCounts}
      />

      <div className="flex min-w-0 flex-col border-l">
        <ListHeader
          activeView={activeView}
          total={tickets?.length ?? 0}
          showing={filtered.length}
          search={search}
          setSearch={(v) => {
            setSearch(v);
            setPage(1);
          }}
          density={density}
          setDensity={setDensity}
          groupBy={groupBy}
          setGroupBy={(g) => {
            setGroupBy(g);
            setPage(1);
          }}
          isOfflineCached={isOfflineCached}
        />

        <FilterBar
          statusFilter={statusFilter}
          setStatusFilter={(s) => {
            setStatusFilter(s);
            setPage(1);
          }}
          priorityFilter={priorityFilter}
          setPriorityFilter={(s) => {
            setPriorityFilter(s);
            setPage(1);
          }}
          assigneeFilter={assigneeFilter}
          setAssigneeFilter={(s) => {
            setAssigneeFilter(s);
            setPage(1);
          }}
          channelFilter={channelFilter}
          setChannelFilter={(s) => {
            setChannelFilter(s);
            setPage(1);
          }}
        />

        {activeFilterCount > 0 && (
          <ActiveFiltersBar
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            assigneeFilter={assigneeFilter}
            setAssigneeFilter={setAssigneeFilter}
            channelFilter={channelFilter}
            setChannelFilter={setChannelFilter}
            onClear={clearAllFilters}
          />
        )}

        {selected.size > 0 && (
          <BulkActionBar
            count={selected.size}
            onClear={() => setSelected(new Set())}
          />
        )}

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
              action={
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  Clear all filters
                </Button>
              }
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
                      aria-label="Select all on this page"
                    />
                  </TableHead>
                  <TableHead className="w-10" />
                  <TableHead>Ticket</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead>Status</TableHead>
                  <SortableHead
                    label="Priority"
                    active={sort.key === 'priority'}
                    dir={sort.dir}
                    onClick={() => flipSort('priority')}
                  />
                  <SortableHead
                    label="SLA"
                    active={sort.key === 'sla'}
                    dir={sort.dir}
                    onClick={() => flipSort('sla')}
                  />
                  <TableHead>Assignee</TableHead>
                  <SortableHead
                    label="Updated"
                    active={sort.key === 'updated'}
                    dir={sort.dir}
                    onClick={() => flipSort('updated')}
                    className="w-28"
                  />
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupBy === 'none'
                  ? pageRows.map((t) => (
                      <TicketRow
                        key={t.id}
                        ticket={t}
                        selected={selected.has(t.id)}
                        onToggle={() => toggleRow(t.id)}
                        onPreview={() => setPreviewId(t.id)}
                        isPreviewed={previewId === t.id}
                        density={density}
                      />
                    ))
                  : grouped.map((group) => (
                      <GroupedSection
                        key={group.key}
                        group={group}
                        collapsed={collapsedGroups.has(group.key)}
                        onToggle={() => toggleGroup(group.key)}
                        selected={selected}
                        onRowToggle={toggleRow}
                        onRowPreview={(id) => setPreviewId(id)}
                        previewId={previewId}
                        density={density}
                      />
                    ))}
              </TableBody>
            </Table>
          )}
        </div>

        <Footer
          total={filtered.length}
          page={safePage}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          showPager={groupBy === 'none'}
        />
      </div>

      <PreviewPane
        ticket={previewTicket}
        onClose={() => setPreviewId(null)}
      />
    </div>
  );
}

// ─── Views rail ──────────────────────────────────────────────────────────────

interface ViewsRailProps {
  viewId: string;
  onViewChange: (id: string) => void;
  counts: Record<string, number>;
}

function ViewsRail({ viewId, onViewChange, counts }: ViewsRailProps) {
  const groups: Array<{ label: string; views: View[] }> = [
    { label: 'System', views: VIEWS.filter((v) => v.source === 'system') },
    { label: 'Personal', views: VIEWS.filter((v) => v.source === 'personal') },
    { label: 'Shared', views: VIEWS.filter((v) => v.source === 'shared') },
  ];

  return (
    <aside className="hidden flex-col bg-[#0B1120] border-r border-white/[0.06] md:flex">
      <div className="flex h-14 items-center justify-between border-b border-white/[0.06] px-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">
          Views
        </p>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="Create view from current filters"
              className="grid h-6 w-6 place-items-center rounded text-gray-500 hover:bg-white/[0.06] hover:text-gray-200"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Save current as view</TooltipContent>
        </Tooltip>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-2">
        {groups.map((g) =>
          g.views.length > 0 ? (
            <div key={g.label}>
              <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-600">
                {g.label}
              </p>
              <ul className="space-y-0.5">
                {g.views.map((v) => {
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
                            ? 'bg-blue-500/12 text-blue-300'
                            : 'text-gray-400 hover:bg-white/[0.05] hover:text-gray-100',
                        )}
                      >
                        <Icon
                          className={cn(
                            'h-3.5 w-3.5 shrink-0',
                            active ? 'text-blue-400' : 'text-gray-500',
                          )}
                        />
                        <span className="flex-1 truncate text-left">
                          {v.label}
                        </span>
                        <span
                          className={cn(
                            'text-[11px] tabular-nums',
                            active ? 'text-blue-300/80' : 'text-gray-600',
                          )}
                        >
                          {counts[v.id] ?? 0}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null,
        )}
      </div>
    </aside>
  );
}

// ─── List header ─────────────────────────────────────────────────────────────

interface ListHeaderProps {
  activeView: View;
  total: number;
  showing: number;
  search: string;
  setSearch: (v: string) => void;
  density: Density;
  setDensity: (d: Density) => void;
  groupBy: GroupKey;
  setGroupBy: (g: GroupKey) => void;
  isOfflineCached?: boolean;
}

function ListHeader({
  activeView,
  total,
  showing,
  search,
  setSearch,
  density,
  setDensity,
  groupBy,
  setGroupBy,
  isOfflineCached,
}: ListHeaderProps) {
  const Icon = activeView.icon;
  return (
    <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-background/80 backdrop-blur-sm px-4">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold leading-tight">
              {activeView.label}
            </h2>
            {isOfflineCached && (
              <span
                className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700"
                title="Showing cached data — you're offline"
              >
                <Database className="h-2.5 w-2.5" />
                Cached
              </span>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground">
            {isOfflineCached
              ? `${showing} tickets from local cache`
              : `Showing ${showing} of ${total}`}
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Group className="h-3.5 w-3.5" />
              {groupBy === 'none' ? 'Group by' : `By ${groupBy}`}
              <ChevronDown className="h-3 w-3 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Group by</DropdownMenuLabel>
            {(['none', 'status', 'priority', 'assignee', 'channel'] as GroupKey[]).map((g) => (
              <DropdownMenuItem
                key={g}
                onSelect={() => setGroupBy(g)}
              >
                <Checkbox checked={groupBy === g} className="pointer-events-none" />
                <span className="capitalize">{g === 'none' ? 'No grouping' : g}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
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

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Bookmark className="h-3.5 w-3.5" />
              Save view
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save current filters as a new view</TooltipContent>
        </Tooltip>

        <Button variant="outline" size="sm" className="h-8 text-xs">
          <Download className="h-3.5 w-3.5" />
          Export
        </Button>
        <Button size="sm" className="h-8 bg-gradient-to-r from-blue-600 to-blue-500 text-xs text-white shadow-blue-600/20 shadow-sm hover:from-blue-500 hover:to-blue-400">
          <Plus className="h-3.5 w-3.5" />
          New ticket
        </Button>
      </div>
    </div>
  );
}

// ─── Filter bar ──────────────────────────────────────────────────────────────

interface FilterBarProps {
  statusFilter: Set<TicketStatus>;
  setStatusFilter: (s: Set<TicketStatus>) => void;
  priorityFilter: Set<TicketPriority>;
  setPriorityFilter: (s: Set<TicketPriority>) => void;
  assigneeFilter: Set<string>;
  setAssigneeFilter: (s: Set<string>) => void;
  channelFilter: Set<TicketChannel>;
  setChannelFilter: (s: Set<TicketChannel>) => void;
}

function FilterBar({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  assigneeFilter,
  setAssigneeFilter,
  channelFilter,
  setChannelFilter,
}: FilterBarProps) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 border-b bg-muted/20 px-4 py-2">
      <Filter className="h-3 w-3 text-muted-foreground" />
      <FilterMenu<TicketStatus>
        label="Status"
        options={STATUS_OPTIONS}
        labelFor={(s) => STATUS_LABEL[s]}
        selected={statusFilter}
        onSelectedChange={setStatusFilter}
      />
      <FilterMenu<TicketPriority>
        label="Priority"
        options={PRIORITY_OPTIONS}
        labelFor={(p) => PRIORITY_LABEL[p]}
        selected={priorityFilter}
        onSelectedChange={setPriorityFilter}
      />
      <FilterMenu<string>
        label="Assignee"
        options={['__unassigned__', ...agentDirectory.map((a) => a.id)]}
        labelFor={(id) =>
          id === '__unassigned__'
            ? 'Unassigned'
            : agentDirectory.find((a) => a.id === id)?.name ?? id
        }
        selected={assigneeFilter}
        onSelectedChange={setAssigneeFilter}
      />
      <FilterMenu<TicketChannel>
        label="Channel"
        options={CHANNEL_OPTIONS}
        labelFor={(c) => CHANNEL_META[c].label}
        selected={channelFilter}
        onSelectedChange={setChannelFilter}
      />
    </div>
  );
}

interface FilterMenuProps<T extends string> {
  label: string;
  options: T[];
  labelFor: (opt: T) => string;
  selected: Set<T>;
  onSelectedChange: (next: Set<T>) => void;
}

function FilterMenu<T extends string>({
  label,
  options,
  labelFor,
  selected,
  onSelectedChange,
}: FilterMenuProps<T>) {
  function toggle(opt: T) {
    const next = new Set(selected);
    if (next.has(opt)) next.delete(opt);
    else next.add(opt);
    onSelectedChange(next);
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-1 rounded-full border border-dashed border-input bg-card px-2.5 py-0.5 text-xs font-medium text-foreground transition-colors hover:bg-muted',
            selected.size > 0 && 'border-solid border-primary/40 bg-primary/5 text-primary',
          )}
        >
          {label}
          {selected.size > 0 && (
            <Badge
              variant="secondary"
              className="h-4 bg-primary/10 px-1.5 text-[9px] text-primary"
            >
              {selected.size}
            </Badge>
          )}
          <ChevronDown className="h-3 w-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Filter by {label.toLowerCase()}</DropdownMenuLabel>
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt}
            onSelect={(e) => {
              e.preventDefault();
              toggle(opt);
            }}
          >
            <Checkbox checked={selected.has(opt)} className="pointer-events-none" />
            {labelFor(opt)}
          </DropdownMenuItem>
        ))}
        {selected.size > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onSelectedChange(new Set())}>
              Clear
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface ActiveFiltersBarProps {
  search: string;
  setSearch: (v: string) => void;
  statusFilter: Set<TicketStatus>;
  setStatusFilter: (s: Set<TicketStatus>) => void;
  priorityFilter: Set<TicketPriority>;
  setPriorityFilter: (s: Set<TicketPriority>) => void;
  assigneeFilter: Set<string>;
  setAssigneeFilter: (s: Set<string>) => void;
  channelFilter: Set<TicketChannel>;
  setChannelFilter: (s: Set<TicketChannel>) => void;
  onClear: () => void;
}

function ActiveFiltersBar(props: ActiveFiltersBarProps) {
  const removeFromSet = <T extends string>(
    set: Set<T>,
    value: T,
    setter: (s: Set<T>) => void,
  ) => {
    const next = new Set(set);
    next.delete(value);
    setter(next);
  };
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b bg-primary/[0.03] px-4 py-1.5 text-xs">
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Active
      </span>
      {props.search && (
        <ActiveChip
          label={`Search: "${props.search}"`}
          onRemove={() => props.setSearch('')}
        />
      )}
      {[...props.statusFilter].map((s) => (
        <ActiveChip
          key={`s-${s}`}
          label={`Status: ${STATUS_LABEL[s]}`}
          onRemove={() => removeFromSet(props.statusFilter, s, props.setStatusFilter)}
        />
      ))}
      {[...props.priorityFilter].map((p) => (
        <ActiveChip
          key={`p-${p}`}
          label={`Priority: ${PRIORITY_LABEL[p]}`}
          onRemove={() => removeFromSet(props.priorityFilter, p, props.setPriorityFilter)}
        />
      ))}
      {[...props.assigneeFilter].map((id) => (
        <ActiveChip
          key={`a-${id}`}
          label={`Assignee: ${
            id === '__unassigned__'
              ? 'Unassigned'
              : agentDirectory.find((a) => a.id === id)?.name ?? id
          }`}
          onRemove={() => removeFromSet(props.assigneeFilter, id, props.setAssigneeFilter)}
        />
      ))}
      {[...props.channelFilter].map((c) => (
        <ActiveChip
          key={`c-${c}`}
          label={`Channel: ${CHANNEL_META[c].label}`}
          onRemove={() => removeFromSet(props.channelFilter, c, props.setChannelFilter)}
        />
      ))}
      <button
        type="button"
        onClick={props.onClear}
        className="ml-1 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        Clear all
      </button>
    </div>
  );
}

function ActiveChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="rounded-full hover:bg-primary/20"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

// ─── Bulk actions ────────────────────────────────────────────────────────────

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
      <Button variant="outline" size="sm" className="h-7 text-xs">
        <Sparkles className="h-3 w-3" />
        Run automation
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

// ─── Sortable header ─────────────────────────────────────────────────────────

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
          active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
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

// ─── Grouped sections ────────────────────────────────────────────────────────

interface TicketGroup {
  key: string;
  label: string;
  tickets: MockTicket[];
}

function groupTickets(tickets: MockTicket[], groupBy: GroupKey): TicketGroup[] {
  if (groupBy === 'none') return [];
  const buckets = new Map<string, MockTicket[]>();
  for (const t of tickets) {
    let key: string;
    if (groupBy === 'status') {
      key = t.status;
    } else if (groupBy === 'priority') {
      key = t.priority;
    } else if (groupBy === 'channel') {
      key = t.channel;
    } else {
      key = t.assignee?.id ?? '__unassigned__';
    }
    const arr = buckets.get(key) ?? [];
    arr.push(t);
    buckets.set(key, arr);
  }
  return [...buckets.entries()]
    .map(([key, arr]) => ({
      key,
      label: groupLabelFor(groupBy, key, arr),
      tickets: arr,
    }))
    .sort((a, b) => {
      if (groupBy === 'priority') {
        const order: Record<string, number> = {
          urgent: 1,
          high: 2,
          medium: 3,
          low: 4,
        };
        return (order[a.key] ?? 9) - (order[b.key] ?? 9);
      }
      return a.label.localeCompare(b.label);
    });
}

function groupLabelFor(groupBy: GroupKey, key: string, items: MockTicket[]): string {
  if (groupBy === 'status') return STATUS_LABEL[key as TicketStatus] ?? key;
  if (groupBy === 'priority') return PRIORITY_LABEL[key as TicketPriority] ?? key;
  if (groupBy === 'channel') return CHANNEL_META[key as TicketChannel]?.label ?? key;
  return items[0]?.assignee?.name ?? 'Unassigned';
}

interface GroupedSectionProps {
  group: TicketGroup;
  collapsed: boolean;
  onToggle: () => void;
  selected: Set<string>;
  onRowToggle: (id: string) => void;
  onRowPreview: (id: string) => void;
  previewId: string | null;
  density: Density;
}

function GroupedSection({
  group,
  collapsed,
  onToggle,
  selected,
  onRowToggle,
  onRowPreview,
  previewId,
  density,
}: GroupedSectionProps) {
  return (
    <>
      <TableRow className="bg-muted/30 hover:bg-muted/40">
        <TableCell colSpan={10} className="py-2">
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground"
          >
            <ChevronRight
              className={cn(
                'h-3 w-3 transition-transform',
                !collapsed && 'rotate-90',
              )}
            />
            {group.label}
            <Badge variant="secondary" className="h-4 px-1.5 text-[9px]">
              {group.tickets.length}
            </Badge>
          </button>
        </TableCell>
      </TableRow>
      {!collapsed &&
        group.tickets.map((t) => (
          <TicketRow
            key={t.id}
            ticket={t}
            selected={selected.has(t.id)}
            onToggle={() => onRowToggle(t.id)}
            onPreview={() => onRowPreview(t.id)}
            isPreviewed={previewId === t.id}
            density={density}
          />
        ))}
    </>
  );
}

// ─── Ticket row ──────────────────────────────────────────────────────────────

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
  const ChannelIcon = CHANNEL_META[ticket.channel].icon;
  const hasSuggestion = mockAISuggestions.some(
    (s) => s.ticketId === ticket.id && s.status === 'pending',
  );
  return (
    <TableRow
      onClick={onPreview}
      className={cn(
        'group cursor-pointer',
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
      <TableCell className="w-10 text-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <ChannelIcon className="h-3.5 w-3.5 text-muted-foreground" />
            </span>
          </TooltipTrigger>
          <TooltipContent>{CHANNEL_META[ticket.channel].label}</TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell className={cn(compact && 'py-2')}>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-muted-foreground">
            {ticket.number}
          </span>
          {ticket.slaStatus === 'breached' && (
            <Badge variant="danger" className="h-4 px-1.5 text-[9px]">
              Breached
            </Badge>
          )}
          {ticket.slaStatus === 'at_risk' && (
            <Badge variant="warning" className="h-4 px-1.5 text-[9px]">
              At risk
            </Badge>
          )}
          {ticket.status === 'escalated' && (
            <Badge variant="outline" className="h-4 px-1.5 text-[9px]">
              Escalated
            </Badge>
          )}
          {hasSuggestion && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center gap-0.5 rounded-full border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[9px] font-semibold text-violet-600">
                  <Bot className="h-2.5 w-2.5" />
                  AI
                </span>
              </TooltipTrigger>
              <TooltipContent>AI suggestion ready — click to review</TooltipContent>
            </Tooltip>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5">
          <p className="max-w-md truncate text-sm font-medium">
            {ticket.subject}
          </p>
          <PendingBadge entityId={ticket.id} />
        </div>
        {!compact && ticket.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap items-center gap-1">
            {ticket.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
            <span className="text-[10px] text-muted-foreground">
              · {ticket.category}
            </span>
          </div>
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
        <SlaTimer ticket={ticket} />
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
        className={cn(
          'whitespace-nowrap text-[11px] text-muted-foreground',
          compact && 'py-2',
        )}
      >
        {relativeTime(ticket.updatedAt)}
      </TableCell>
      <TableCell className="pr-3" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Row actions"
              className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
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

// ─── SLA timer ───────────────────────────────────────────────────────────────

function SlaTimer({ ticket }: { ticket: MockTicket }) {
  const due = new Date(ticket.slaDueAt).getTime();
  const created = new Date(ticket.createdAt).getTime();
  const now = Date.now();
  const total = Math.max(due - created, 1);
  const remainingMs = due - now;
  const pct = Math.max(0, Math.min(100, (remainingMs / total) * 100));

  let label: string;
  if (remainingMs < 0) {
    label = `${Math.abs(Math.round(remainingMs / 60_000))}m late`;
  } else if (remainingMs < 60 * 60 * 1000) {
    label = `${Math.round(remainingMs / 60_000)}m`;
  } else if (remainingMs < 24 * 60 * 60 * 1000) {
    label = `${Math.round(remainingMs / (60 * 60 * 1000))}h`;
  } else {
    label = `${Math.round(remainingMs / (24 * 60 * 60 * 1000))}d`;
  }

  let tone: 'ok' | 'warning' | 'danger' = 'ok';
  if (ticket.slaStatus === 'breached' || remainingMs < 0) tone = 'danger';
  else if (ticket.slaStatus === 'at_risk' || pct < 30) tone = 'warning';

  const fillClass =
    tone === 'danger'
      ? 'bg-red-500'
      : tone === 'warning'
        ? 'bg-amber-500'
        : 'bg-emerald-500';
  const textClass =
    tone === 'danger'
      ? 'text-red-600'
      : tone === 'warning'
        ? 'text-amber-600'
        : 'text-muted-foreground';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2">
          <div className="h-1 w-14 overflow-hidden rounded-full bg-muted">
            <div
              className={cn('h-full rounded-full', fillClass)}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span
            className={cn(
              'font-mono text-[10px] tabular-nums font-medium',
              textClass,
            )}
          >
            {label}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        Resolution due {absoluteDateTime(ticket.slaDueAt)}
      </TooltipContent>
    </Tooltip>
  );
}

// ─── Footer / pagination ─────────────────────────────────────────────────────

function Footer({
  total,
  page,
  totalPages,
  onPrev,
  onNext,
  showPager,
}: {
  total: number;
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  showPager: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center justify-between border-t bg-card px-4 py-2 text-xs text-muted-foreground">
      <span>{total} tickets</span>
      {showPager && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            disabled={page <= 1}
            onClick={onPrev}
          >
            Previous
          </Button>
          <span className="px-2 tabular-nums">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            disabled={page >= totalPages}
            onClick={onNext}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Preview pane ────────────────────────────────────────────────────────────

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
  const ChannelIcon = CHANNEL_META[ticket.channel].icon;

  return (
    <aside className="hidden flex-col border-l bg-card xl:flex">
      <div className="flex h-14 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <ChannelIcon className="h-3.5 w-3.5 text-muted-foreground" />
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
          <div className="flex items-start gap-2">
            <h3 className="font-display text-base font-bold leading-tight">
              {ticket.subject}
            </h3>
            <PendingBadge entityId={ticket.id} className="mt-0.5 shrink-0" />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Opened by {ticket.requester.name} via{' '}
            {CHANNEL_META[ticket.channel].label.toLowerCase()} ·{' '}
            {relativeTime(ticket.createdAt)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <Property
            label="Priority"
            value={<PriorityIndicator priority={ticket.priority} />}
          />
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
          <Property label="SLA" value={<SlaTimer ticket={ticket} />} />
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

// Re-export markers to keep types referenced.
export type _Markers = Person;
