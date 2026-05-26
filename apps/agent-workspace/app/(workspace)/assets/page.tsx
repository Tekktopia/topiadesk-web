'use client';

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Download,
  Filter,
  Loader2,
  MapPin,
  MoreHorizontal,
  Plus,
  QrCode,
  Search,
  ShieldCheck,
  Tag,
  Trash2,
  Upload,
  Wrench,
  X,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  type BadgeProps,
  cn,
} from '@topiadesk/ui';
import { useAssets } from '@/lib/queries';
import type { MockAsset } from '@/lib/mock-data';
import { initials } from '@/lib/format';

type AssetStatus = MockAsset['status'];

const statusVariant: Record<AssetStatus, BadgeProps['variant']> = {
  in_use: 'success',
  in_stock: 'secondary',
  under_repair: 'warning',
  lost: 'danger',
};

const statusLabel: Record<AssetStatus, string> = {
  in_use: 'In use',
  in_stock: 'In stock',
  under_repair: 'Under repair',
  lost: 'Lost / Stolen',
};

interface ViewTab {
  id: string;
  label: string;
  filter: (a: MockAsset) => boolean;
}

const VIEW_TABS: ViewTab[] = [
  { id: 'all', label: 'All assets', filter: () => true },
  { id: 'laptops', label: 'Laptops', filter: (a) => a.category === 'Laptop' },
  { id: 'desktops', label: 'Desktops', filter: (a) => a.category === 'Desktop' },
  { id: 'cctv', label: 'CCTV', filter: (a) => a.category === 'CCTV Camera' },
  { id: 'peripherals', label: 'Peripherals', filter: (a) => ['Monitor', 'Printer'].includes(a.category) },
  { id: 'mobile', label: 'Mobile', filter: (a) => a.category === 'Mobile Device' },
  { id: 'unassigned', label: 'Unassigned', filter: (a) => !a.assignedTo },
];

type SortKey = 'tag' | 'category' | 'warranty';

export default function AssetsPage() {
  const { data: assets, isLoading } = useAssets();
  const [tabId, setTabId] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Set<AssetStatus>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({
    key: 'tag',
    dir: 'asc',
  });

  const activeTab = VIEW_TABS.find((v) => v.id === tabId) ?? VIEW_TABS[0]!;

  const tabCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const v of VIEW_TABS) map[v.id] = 0;
    for (const a of assets ?? []) {
      for (const v of VIEW_TABS) if (v.filter(a)) map[v.id] = (map[v.id] ?? 0) + 1;
    }
    return map;
  }, [assets]);

  const filtered = useMemo(() => {
    const list = (assets ?? []).filter(activeTab.filter);
    return list
      .filter((a) => {
        if (statusFilter.size > 0 && !statusFilter.has(a.status)) return false;
        if (search) {
          const q = search.toLowerCase();
          if (
            !a.name.toLowerCase().includes(q) &&
            !a.tag.toLowerCase().includes(q) &&
            !a.category.toLowerCase().includes(q) &&
            !a.location.toLowerCase().includes(q) &&
            !(a.assignedTo?.name ?? '').toLowerCase().includes(q)
          ) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const dir = sort.dir === 'asc' ? 1 : -1;
        if (sort.key === 'tag') return a.tag.localeCompare(b.tag) * dir;
        if (sort.key === 'category') return a.category.localeCompare(b.category) * dir;
        return (
          (new Date(a.warrantyEnd).getTime() -
            new Date(b.warrantyEnd).getTime()) *
          dir
        );
      });
  }, [assets, activeTab, search, statusFilter, sort]);

  const allSelected =
    filtered.length > 0 && filtered.every((a) => selected.has(a.id));
  const someSelected =
    filtered.some((a) => selected.has(a.id)) && !allSelected;

  function toggleSelectAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((a) => a.id)));
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

  function toggleStatusFilter(s: AssetStatus) {
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
        : { key, dir: 'asc' },
    );
  }

  const expiringSoon = (assets ?? []).filter((a) => warrantyHealth(a).status === 'expiring').length;
  const outOfWarranty = (assets ?? []).filter((a) => warrantyHealth(a).status === 'expired').length;

  return (
    <div className="space-y-4 p-5">
      <PageHeader
        total={assets?.length ?? 0}
        expiringSoon={expiringSoon}
        outOfWarranty={outOfWarranty}
      />

      <Card>
        <ViewTabs tabId={tabId} setTabId={setTabId} counts={tabCounts} setSelected={setSelected} />

        <Toolbar
          search={search}
          setSearch={setSearch}
          selectedCount={selected.size}
          onClearSelection={() => setSelected(new Set())}
        />

        <FilterChips
          statusFilter={statusFilter}
          onToggle={toggleStatusFilter}
          onClear={() => setStatusFilter(new Set())}
        />

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4">
              <Skeleton className="h-96" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="p-12 text-center text-sm text-muted-foreground">
              No assets match your filters.
            </p>
          ) : (
            <Table>
              <TableHeader>
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
                    label="Tag"
                    active={sort.key === 'tag'}
                    dir={sort.dir}
                    onClick={() => flipSort('tag')}
                  />
                  <TableHead>Asset</TableHead>
                  <SortableHead
                    label="Category"
                    active={sort.key === 'category'}
                    dir={sort.dir}
                    onClick={() => flipSort('category')}
                  />
                  <TableHead>Status</TableHead>
                  <SortableHead
                    label="Warranty"
                    active={sort.key === 'warranty'}
                    dir={sort.dir}
                    onClick={() => flipSort('warranty')}
                  />
                  <TableHead>Assigned to</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <AssetRow
                    key={a.id}
                    asset={a}
                    selected={selected.has(a.id)}
                    onToggle={() => toggleRow(a.id)}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>

        <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
          <span>{filtered.length} assets</span>
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
      </Card>
    </div>
  );
}

function PageHeader({
  total,
  expiringSoon,
  outOfWarranty,
}: {
  total: number;
  expiringSoon: number;
  outOfWarranty: number;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Infrastructure
        </p>
        <h1 className="font-display text-2xl font-bold tracking-tight">Assets</h1>
        <p className="text-sm text-muted-foreground">
          {total} assets · {expiringSoon} warranty expiring soon ·{' '}
          {outOfWarranty} out of warranty
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Upload className="h-3 w-3" />
          Import CSV
        </Button>
        <Button variant="outline" size="sm">
          <QrCode className="h-3 w-3" />
          Scan
        </Button>
        <Button size="sm">
          <Plus className="h-3 w-3" />
          Add asset
        </Button>
      </div>
    </header>
  );
}

function ViewTabs({
  tabId,
  setTabId,
  counts,
  setSelected,
}: {
  tabId: string;
  setTabId: (id: string) => void;
  counts: Record<string, number>;
  setSelected: (s: Set<string>) => void;
}) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b px-2 pt-2">
      {VIEW_TABS.map((v) => {
        const active = v.id === tabId;
        return (
          <button
            key={v.id}
            type="button"
            onClick={() => {
              setTabId(v.id);
              setSelected(new Set());
            }}
            className={cn(
              'group inline-flex shrink-0 items-center gap-2 rounded-t-md border-b-2 px-3 pb-2 pt-1.5 text-xs font-medium transition-colors',
              active
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {v.label}
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-[9px] tabular-nums',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              {counts[v.id] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}

interface ToolbarProps {
  search: string;
  setSearch: (v: string) => void;
  selectedCount: number;
  onClearSelection: () => void;
}

function Toolbar({
  search,
  setSearch,
  selectedCount,
  onClearSelection,
}: ToolbarProps) {
  if (selectedCount > 0) {
    return (
      <div className="flex flex-wrap items-center gap-2 border-b bg-primary/5 px-4 py-2 text-sm">
        <span className="font-medium text-foreground">
          {selectedCount} selected
        </span>
        <Button variant="outline" size="sm" className="h-7 text-xs">
          <ShieldCheck className="h-3 w-3" />
          Reassign
        </Button>
        <Button variant="outline" size="sm" className="h-7 text-xs">
          <MapPin className="h-3 w-3" />
          Change location
        </Button>
        <Button variant="outline" size="sm" className="h-7 text-xs">
          <Tag className="h-3 w-3" />
          Tag
        </Button>
        <Button variant="outline" size="sm" className="h-7 text-xs">
          <Download className="h-3 w-3" />
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs text-red-600"
        >
          <Trash2 className="h-3 w-3" />
          Retire
        </Button>
        <button
          type="button"
          onClick={onClearSelection}
          className="ml-auto text-xs text-muted-foreground hover:text-foreground"
        >
          Clear
        </button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 border-b bg-muted/20 px-4 py-2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by tag, name, location, custodian..."
          className="h-8 w-72 pl-8 text-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Button variant="outline" size="sm" className="h-8 text-xs">
        <Filter className="h-3 w-3" />
        Saved filters
        <ChevronDown className="h-3 w-3 opacity-70" />
      </Button>
    </div>
  );
}

interface FilterChipsProps {
  statusFilter: Set<AssetStatus>;
  onToggle: (s: AssetStatus) => void;
  onClear: () => void;
}

function FilterChips({ statusFilter, onToggle, onClear }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b bg-muted/10 px-4 py-2">
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Filters
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-input bg-card px-2.5 py-0.5 text-xs hover:bg-muted"
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
          {(Object.keys(statusLabel) as AssetStatus[]).map((s) => (
            <DropdownMenuItem
              key={s}
              onSelect={(e) => {
                e.preventDefault();
                onToggle(s);
              }}
            >
              <Checkbox checked={statusFilter.has(s)} />
              {statusLabel[s]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {[...statusFilter].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onToggle(s)}
          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
        >
          {statusLabel[s]}
          <X className="h-3 w-3" />
        </button>
      ))}
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-full border border-dashed border-input bg-card px-2.5 py-0.5 text-xs hover:bg-muted"
      >
        Category
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-full border border-dashed border-input bg-card px-2.5 py-0.5 text-xs hover:bg-muted"
      >
        Location
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-full border border-dashed border-input bg-card px-2.5 py-0.5 text-xs hover:bg-muted"
      >
        Warranty
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

interface SortableHeadProps {
  label: string;
  active: boolean;
  dir: 'asc' | 'desc';
  onClick: () => void;
}

function SortableHead({ label, active, dir, onClick }: SortableHeadProps) {
  return (
    <TableHead>
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

function AssetRow({
  asset,
  selected,
  onToggle,
}: {
  asset: MockAsset;
  selected: boolean;
  onToggle: () => void;
}) {
  const warranty = warrantyHealth(asset);

  return (
    <TableRow className={cn('group', selected && 'bg-primary/5')}>
      <TableCell className="pl-4">
        <Checkbox
          checked={selected}
          onCheckedChange={onToggle}
          aria-label={`Select ${asset.tag}`}
        />
      </TableCell>
      <TableCell>
        <span className="font-mono text-[11px] text-muted-foreground">
          {asset.tag}
        </span>
      </TableCell>
      <TableCell>
        <p className="text-sm font-medium">{asset.name}</p>
        <p className="text-[11px] text-muted-foreground">
          {asset.specifications}
        </p>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="text-[10px]">
          {asset.category}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={statusVariant[asset.status]} className="text-[10px]">
          {asset.status === 'under_repair' && <Wrench className="h-2.5 w-2.5" />}
          {statusLabel[asset.status]}
        </Badge>
      </TableCell>
      <TableCell>
        <WarrantyBadge health={warranty} end={asset.warrantyEnd} />
      </TableCell>
      <TableCell>
        {asset.assignedTo ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>
                    {initials(asset.assignedTo.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs">{asset.assignedTo.name}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>{asset.assignedTo.email}</TooltipContent>
          </Tooltip>
        ) : (
          <span className="text-[11px] text-muted-foreground">&mdash;</span>
        )}
      </TableCell>
      <TableCell>
        <span className="inline-flex items-center gap-1 text-xs">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          {asset.location}
        </span>
      </TableCell>
      <TableCell className="pr-3">
        <div className="flex items-center justify-end gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="Print label"
                className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <QrCode className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Print QR label</TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="More actions"
                className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem>Reassign</DropdownMenuItem>
              <DropdownMenuItem>Change location</DropdownMenuItem>
              <DropdownMenuItem>Open work order</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Mark under repair</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Retire</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}

interface WarrantyHealth {
  status: 'healthy' | 'expiring' | 'expired';
  days: number;
}

function warrantyHealth(asset: MockAsset): WarrantyHealth {
  const end = new Date(asset.warrantyEnd).getTime();
  const now = Date.now();
  const days = Math.round((end - now) / (24 * 60 * 60 * 1000));
  if (days < 0) return { status: 'expired', days };
  if (days < 90) return { status: 'expiring', days };
  return { status: 'healthy', days };
}

function WarrantyBadge({ health, end }: { health: WarrantyHealth; end: string }) {
  const endDate = new Date(end).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  if (health.status === 'expired') {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-800">
            <AlertTriangle className="h-2.5 w-2.5" />
            Expired
          </span>
        </TooltipTrigger>
        <TooltipContent>Ended {endDate}</TooltipContent>
      </Tooltip>
    );
  }
  if (health.status === 'expiring') {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800">
            <Loader2 className="h-2.5 w-2.5" />
            {health.days}d left
          </span>
        </TooltipTrigger>
        <TooltipContent>Ends {endDate}</TooltipContent>
      </Tooltip>
    );
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-2.5 w-2.5 text-emerald-500" />
          {Math.round(health.days / 30)} mo left
        </span>
      </TooltipTrigger>
      <TooltipContent>Ends {endDate}</TooltipContent>
    </Tooltip>
  );
}
