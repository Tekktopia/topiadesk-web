'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Camera,
  ChevronDown,
  Filter,
  HardDrive,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Server,
  Shield,
  Wifi,
  X,
  Zap,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Skeleton,
  Sparkline,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from '@topiadesk/ui';
import { useDevices } from '@/lib/queries';
import type { MockDevice, DeviceStatus, DeviceType } from '@/lib/mock-data';
import type { ComponentType } from 'react';

// ─── Metadata maps ────────────────────────────────────────────────────────────

const STATUS_META: Record<
  DeviceStatus,
  { dot: string; badge: 'success' | 'danger' | 'warning' | 'secondary'; label: string }
> = {
  up: { dot: 'bg-emerald-500', badge: 'success', label: 'Up' },
  down: { dot: 'bg-red-500', badge: 'danger', label: 'Down' },
  warning: { dot: 'bg-amber-500', badge: 'warning', label: 'Warning' },
  paused: { dot: 'bg-slate-400', badge: 'secondary', label: 'Paused' },
  unknown: { dot: 'bg-slate-300', badge: 'secondary', label: 'Unknown' },
};

const TYPE_ICONS: Record<DeviceType, ComponentType<{ className?: string }>> = {
  server: Server,
  switch: HardDrive,
  router: HardDrive,
  firewall: Shield,
  access_point: Wifi,
  nvr: Camera,
  printer: Printer,
  ups: Zap,
};

const TYPE_LABELS: Record<DeviceType, string> = {
  server: 'Server',
  switch: 'Switch',
  router: 'Router',
  firewall: 'Firewall',
  access_point: 'Access Point',
  nvr: 'NVR',
  printer: 'Printer',
  ups: 'UPS',
};

function formatAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type StatusTab = 'all' | DeviceStatus;
type SiteFilter = 'all' | string;

const BUILTIN_SITES = ['Lagos HQ', 'Ikeja Branch', 'Nairobi Office'];
const CUSTOM_SITES_KEY = 'topiadesk.topology.custom-sites';
const DEVICE_TYPES: DeviceType[] = ['server', 'switch', 'router', 'firewall', 'access_point', 'nvr', 'printer', 'ups'];

type DraftDevice = MockDevice;

export default function DeviceListPage() {
  const devices = useDevices();
  const searchParams = useSearchParams();
  const [statusTab, setStatusTab] = useState<StatusTab>('all');
  const [siteFilter, setSiteFilter] = useState<SiteFilter>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<{ col: string; dir: 'asc' | 'desc' }>({
    col: 'status',
    dir: 'asc',
  });
  const [addOpen, setAddOpen] = useState(false);
  const [customSites, setCustomSites] = useState<string[]>([]);
  const [draftDevices, setDraftDevices] = useState<DraftDevice[]>([]);
  const [form, setForm] = useState({
    name: '',
    type: 'server' as DeviceType,
    ip: '',
    site: 'Lagos HQ',
    group: '',
    vendor: '',
    model: '',
  });

  // Hydrate custom sites and open dialog if ?add=1 is in URL
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = JSON.parse(window.localStorage.getItem(CUSTOM_SITES_KEY) ?? '[]');
      if (Array.isArray(stored)) setCustomSites(stored.filter((s) => typeof s === 'string'));
    } catch {}
    if (searchParams.get('add') === '1') setAddOpen(true);
  }, [searchParams]);

  const allSites = useMemo(
    () =>
      Array.from(
        new Set([...BUILTIN_SITES, ...customSites, ...(devices.data ?? []).map((d) => d.site)]),
      ),
    [customSites, devices.data],
  );

  const sites = useMemo(
    () => [
      'all',
      ...Array.from(
        new Set([...(devices.data ?? []).map((d) => d.site), ...draftDevices.map((d) => d.site)]),
      ),
    ],
    [devices.data, draftDevices],
  );

  const handleAddDevice = () => {
    if (!form.name.trim() || !form.ip.trim()) return;
    const next: DraftDevice = {
      id: `dev-new-${Date.now()}`,
      name: form.name.trim(),
      ip: form.ip.trim(),
      type: form.type,
      site: form.site,
      location: form.site,
      group: form.group.trim() || 'Unassigned',
      status: 'unknown',
      lastCheck: new Date().toISOString(),
      uptimePct: 100,
      sensors: [],
      vendor: form.vendor.trim() || 'Unknown',
      model: form.model.trim() || '—',
      tags: ['new'],
    };
    setDraftDevices((prev) => [next, ...prev]);
    setForm({ name: '', type: 'server', ip: '', site: form.site, group: '', vendor: '', model: '' });
    setAddOpen(false);
  };

  const allDeviceData = useMemo(
    () => [...draftDevices, ...(devices.data ?? [])],
    [draftDevices, devices.data],
  );

  const tabCounts = useMemo(() => {
    const all = allDeviceData;
    return {
      all: all.length,
      up: all.filter((d) => d.status === 'up').length,
      down: all.filter((d) => d.status === 'down').length,
      warning: all.filter((d) => d.status === 'warning').length,
      paused: all.filter((d) => d.status === 'paused').length,
    };
  }, [allDeviceData]);

  const filtered = useMemo(() => {
    let list = allDeviceData;
    if (statusTab !== 'all') list = list.filter((d) => d.status === statusTab);
    if (siteFilter !== 'all') list = list.filter((d) => d.site === siteFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) || d.ip.includes(q) || d.group.toLowerCase().includes(q),
      );
    }
    const statusOrder: Record<DeviceStatus, number> = {
      down: 0,
      warning: 1,
      unknown: 2,
      paused: 3,
      up: 4,
    };
    return [...list].sort((a, b) => {
      const dir = sort.dir === 'asc' ? 1 : -1;
      if (sort.col === 'status') return (statusOrder[a.status] - statusOrder[b.status]) * dir;
      if (sort.col === 'name') return a.name.localeCompare(b.name) * dir;
      if (sort.col === 'uptime') return (a.uptimePct - b.uptimePct) * dir;
      if (sort.col === 'site') return a.site.localeCompare(b.site) * dir;
      return 0;
    });
  }, [allDeviceData, statusTab, siteFilter, search, sort]);

  const handleSort = (col: string) =>
    setSort((s) => ({ col, dir: s.col === col && s.dir === 'asc' ? 'desc' : 'asc' }));

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
        {/* Gradient header */}
        <div className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
                Monitoring
              </p>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">
                Device List
              </h1>
              <p className="mt-0.5 text-sm text-white/70">
                All {devices.data?.length ?? '—'} monitored devices across {sites.length - 1} site
                {sites.length > 2 ? 's' : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                <RefreshCw className="h-3 w-3" />
                Refresh
              </Button>
              <Button
                size="sm"
                className="bg-coral text-white hover:bg-coral-dark"
                onClick={() => setAddOpen(true)}
              >
                <Plus className="h-3 w-3" />
                Add device
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 space-y-5 overflow-y-auto p-5 pt-5">
        <Card>
          {/* Filter bar */}
          <CardHeader className="border-b py-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Status tabs */}
              <div className="flex rounded-lg border p-0.5 text-xs">
                {(['all', 'up', 'down', 'warning', 'paused'] as const).map((s) => {
                  const count = tabCounts[s] ?? tabCounts.all;
                  const active = statusTab === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatusTab(s)}
                      className={cn(
                        'flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium capitalize transition-colors',
                        active
                          ? 'bg-primary text-white'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {s !== 'all' && (
                        <span
                          className={cn(
                            'h-1.5 w-1.5 rounded-full',
                            STATUS_META[s as DeviceStatus]?.dot,
                            active && 'opacity-60',
                          )}
                        />
                      )}
                      {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                      <span
                        className={cn(
                          'tabular-nums',
                          active ? 'text-white/70' : 'text-muted-foreground',
                        )}
                      >
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Site filter */}
              <div className="flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  value={siteFilter}
                  onChange={(e) => setSiteFilter(e.target.value)}
                  className="h-8 rounded-md border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {sites.map((s) => (
                    <option key={s} value={s}>
                      {s === 'all' ? 'All sites' : s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div className="relative ml-auto">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, IP, group…"
                  className="h-8 w-52 pl-8 text-xs"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {devices.isLoading ? (
              <div className="space-y-2 p-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 z-10 bg-[#F4EFE6] shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
                    <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                      <SortTh
                        col="status"
                        label="Status"
                        onSort={handleSort}
                        sort={sort}
                        className="px-4"
                      />
                      <SortTh col="name" label="Device" onSort={handleSort} sort={sort} />
                      <th className="px-3 py-2.5 font-semibold">Type</th>
                      <SortTh col="site" label="Site" onSort={handleSort} sort={sort} />
                      <th className="px-3 py-2.5 font-semibold">IP Address</th>
                      <th className="px-3 py-2.5 font-semibold">Group</th>
                      <th className="px-3 py-2.5 text-center font-semibold">Sensors</th>
                      <SortTh
                        col="uptime"
                        label="Uptime (30d)"
                        onSort={handleSort}
                        sort={sort}
                        className="text-right"
                      />
                      <th className="px-3 py-2.5 font-semibold">Last check</th>
                      <th className="px-3 py-2.5" />
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filtered.map((d) => (
                      <DeviceRow key={d.id} device={d} />
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <p className="p-8 text-center text-sm text-muted-foreground">
                    No devices match your filters.
                  </p>
                )}
              </div>
            )}
            <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-2.5">
              <p className="text-xs text-muted-foreground">
                Showing {filtered.length} of {allDeviceData.length} devices
                {draftDevices.length > 0 && (
                  <span className="ml-1 text-coral">
                    · {draftDevices.length} added this session
                  </span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add device dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add a device</DialogTitle>
            <DialogDescription>
              Register a new device for monitoring. After saving, configure sensors (ping, SNMP,
              HTTP) from the device detail page.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="dev-name" className="text-xs">
                Device name *
              </Label>
              <Input
                id="dev-name"
                autoFocus
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. core-sw-01"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Type</Label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as DeviceType })}
                className="h-8 w-full rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {DEVICE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dev-ip" className="text-xs">
                IP address *
              </Label>
              <Input
                id="dev-ip"
                value={form.ip}
                onChange={(e) => setForm({ ...form, ip: e.target.value })}
                placeholder="10.0.1.5"
                className="h-8 font-mono text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Site</Label>
              <select
                value={form.site}
                onChange={(e) => setForm({ ...form, site: e.target.value })}
                className="h-8 w-full rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {allSites.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-muted-foreground">
                Add a new site from the Topology page.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dev-group" className="text-xs">
                Group
              </Label>
              <Input
                id="dev-group"
                value={form.group}
                onChange={(e) => setForm({ ...form, group: e.target.value })}
                placeholder="Core Switches"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dev-vendor" className="text-xs">
                Vendor
              </Label>
              <Input
                id="dev-vendor"
                value={form.vendor}
                onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                placeholder="Cisco"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dev-model" className="text-xs">
                Model
              </Label>
              <Input
                id="dev-model"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                placeholder="Catalyst 9300"
                className="h-8 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-coral text-white hover:bg-coral-dark"
              disabled={!form.name.trim() || !form.ip.trim()}
              onClick={handleAddDevice}
            >
              <Plus className="h-3 w-3" />
              Add device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── DeviceRow ────────────────────────────────────────────────────────────────

function DeviceRow({ device: d }: { device: MockDevice }) {
  const meta = STATUS_META[d.status];
  const Icon = TYPE_ICONS[d.type] ?? Server;
  const upSensors = d.sensors.filter((s) => s.status === 'up').length;
  const downSensors = d.sensors.filter((s) => s.status === 'down' || s.status === 'warning').length;
  const pingSensor = d.sensors.find((s) => s.type === 'ping');
  const rowBg =
    d.status === 'down'
      ? 'bg-red-50/30 dark:bg-red-950/10'
      : d.status === 'warning'
        ? 'bg-amber-50/20 dark:bg-amber-950/10'
        : '';

  return (
    <tr className={cn('transition-colors hover:bg-muted/40', rowBg)}>
      {/* Status */}
      <td className="px-4 py-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              {d.status === 'down' ? (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                </span>
              ) : (
                <span className={cn('h-2.5 w-2.5 rounded-full', meta.dot)} />
              )}
              <Badge variant={meta.badge} className="text-[10px]">
                {meta.label}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {d.status === 'up'
              ? 'All sensors OK'
              : `Status: ${meta.label} — ${d.status === 'down' ? 'device unreachable' : 'sensor threshold exceeded'}`}
          </TooltipContent>
        </Tooltip>
      </td>

      {/* Device */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-muted">
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div>
            <Link
              href={`/monitoring/devices/${d.id}`}
              className="font-medium text-foreground hover:text-primary hover:underline"
            >
              {d.name}
            </Link>
            <p className="text-muted-foreground">
              {d.vendor} {d.model}
            </p>
          </div>
        </div>
      </td>

      {/* Type */}
      <td className="px-3 py-3 text-muted-foreground">{TYPE_LABELS[d.type]}</td>

      {/* Site */}
      <td className="px-3 py-3 text-muted-foreground">{d.site}</td>

      {/* IP */}
      <td className="px-3 py-3 font-mono text-muted-foreground">{d.ip}</td>

      {/* Group */}
      <td className="px-3 py-3 text-muted-foreground">{d.group}</td>

      {/* Sensors */}
      <td className="px-3 py-3 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <span className="font-medium tabular-nums text-emerald-600">{upSensors}</span>
          <span className="text-muted-foreground">/</span>
          <span className="tabular-nums text-muted-foreground">{d.sensors.length}</span>
          {downSensors > 0 && (
            <Badge variant="danger" className="text-[9px]">
              {downSensors} ↓
            </Badge>
          )}
        </div>
      </td>

      {/* Uptime */}
      <td className="px-3 py-3 text-right">
        <div className="flex flex-col items-end gap-0.5">
          <span
            className={cn(
              'font-semibold tabular-nums',
              d.uptimePct >= 99.5
                ? 'text-emerald-600'
                : d.uptimePct >= 98
                  ? 'text-amber-600'
                  : 'text-red-600',
            )}
          >
            {d.uptimePct.toFixed(1)}%
          </span>
          {pingSensor && (
            <Sparkline
              data={[...pingSensor.sparkline]}
              width={60}
              height={12}
              className={
                d.status === 'down'
                  ? 'text-red-500'
                  : d.status === 'warning'
                    ? 'text-amber-500'
                    : 'text-emerald-500'
              }
            />
          )}
        </div>
      </td>

      {/* Last check */}
      <td className="px-3 py-3 tabular-nums text-muted-foreground">{formatAgo(d.lastCheck)}</td>

      {/* Actions */}
      <td className="px-3 py-3">
        <Button size="sm" variant="outline" className="h-7 px-2 text-[11px]" asChild>
          <Link href={`/monitoring/devices/${d.id}`}>Detail</Link>
        </Button>
      </td>
    </tr>
  );
}

// ─── SortTh ───────────────────────────────────────────────────────────────────

function SortTh({
  col,
  label,
  onSort,
  sort,
  className,
}: {
  col: string;
  label: string;
  onSort: (col: string) => void;
  sort: { col: string; dir: 'asc' | 'desc' };
  className?: string;
}) {
  const active = sort.col === col;
  return (
    <th className={cn('px-3 py-2.5', className)}>
      <button
        type="button"
        onClick={() => onSort(col)}
        className={cn(
          'flex items-center gap-1 font-semibold transition-colors hover:text-foreground',
          active ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {label}
        <ChevronDown
          className={cn(
            'h-3 w-3 transition-transform',
            active && sort.dir === 'asc' && 'rotate-180',
          )}
        />
      </button>
    </th>
  );
}
