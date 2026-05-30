'use client';

/**
 * Device-sync inbox — agent-side counterpart to the tenant-admin Device sync
 * page. When Topiadesk's reconciliation worker detects that a user has signed
 * into a different device than the one on their asset record, it lands here as
 * a "reassignment event" awaiting an IT engineer's decision.
 *
 * Four actions per event (per Daniel's spec):
 *   ① Yes, update the asset
 *   ② Yes, update the asset & open a ticket
 *   ③ No, ignore (audit-log only)
 *   ④ Open a ticket instead (defer the decision)
 */

import { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Cloud,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  Filter,
  Inbox,
  Laptop,
  Mail,
  RefreshCw,
  Smartphone,
  Ticket,
  User as UserIcon,
  XCircle,
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
  cn,
} from '@topiadesk/ui';

type Provider = 'Entra ID' | 'Google Workspace' | 'Intune' | 'Jamf' | 'Kandji';
type EventStatus = 'pending' | 'approved' | 'ignored' | 'ticketed';

interface DeviceSnapshot {
  model: string;
  serial: string;
  hostname: string;
  os: string;
  aadDeviceId?: string;
  lastSeen: string;
}

interface SyncEvent {
  id: string;
  user: { name: string; email: string; initials: string; department: string };
  provider: Provider;
  detectedAt: string;
  oldDevice: DeviceSnapshot;
  newDevice: DeviceSnapshot;
  status: EventStatus;
  outcome?: { type: 'asset-updated' | 'ignored' | 'ticket-opened' | 'asset-updated-and-ticket'; ticketId?: string; at: string };
}

const EVENTS: SyncEvent[] = [
  {
    id: 'ds-2026-0530-1',
    user: { name: 'Daniel Oshinubi', email: 'd.oshinubi@netcomafrica.com', initials: 'DO', department: 'IT' },
    provider: 'Entra ID',
    detectedAt: '2026-05-30T09:42:00Z',
    oldDevice: {
      model: 'MacBook Pro 14" M3', serial: 'C02XYZ7HJL', hostname: 'NCM-MBP-014',
      os: 'macOS 14.5', aadDeviceId: 'd7d2c4f1-8e3f-4d6a-9b1e-001', lastSeen: '2026-05-12T17:21:00Z',
    },
    newDevice: {
      model: 'Dell Latitude 5440', serial: 'JK7Y8N3', hostname: 'NCM-LAP-088',
      os: 'Windows 11 Pro 23H2', aadDeviceId: '2a4c5b6e-1d8a-4f3c-bbb1-099', lastSeen: '2026-05-30T09:42:00Z',
    },
    status: 'pending',
  },
  {
    id: 'ds-2026-0530-2',
    user: { name: 'Amara Diallo', email: 'amara@consomoafrica.com', initials: 'AD', department: 'Sales' },
    provider: 'Google Workspace',
    detectedAt: '2026-05-30T08:14:00Z',
    oldDevice: {
      model: 'HP EliteBook 840 G9', serial: 'CND2470FX1', hostname: 'CSA-HP-021',
      os: 'Windows 11 Pro', lastSeen: '2026-05-26T12:04:00Z',
    },
    newDevice: {
      model: 'Lenovo ThinkPad X1 Carbon Gen 11', serial: 'PF4BVRSQ', hostname: 'CSA-LT-104',
      os: 'Windows 11 Pro 23H2', lastSeen: '2026-05-30T08:14:00Z',
    },
    status: 'pending',
  },
  {
    id: 'ds-2026-0530-3',
    user: { name: 'Tunde Bakare', email: 'tunde@consomoafrica.com', initials: 'TB', department: 'IT' },
    provider: 'Intune',
    detectedAt: '2026-05-30T06:55:00Z',
    oldDevice: {
      model: 'iPhone 14', serial: 'F4LNXQ8GHF', hostname: 'tunde-iphone',
      os: 'iOS 17.4', lastSeen: '2026-05-29T19:30:00Z',
    },
    newDevice: {
      model: 'iPhone 15 Pro', serial: 'H7VKR9MMQ7', hostname: 'tunde-iphone15',
      os: 'iOS 17.5', lastSeen: '2026-05-30T06:55:00Z',
    },
    status: 'pending',
  },
  {
    id: 'ds-2026-0529-1',
    user: { name: 'Adaeze Nwosu', email: 'adaeze@consomoafrica.com', initials: 'AN', department: 'Support' },
    provider: 'Entra ID',
    detectedAt: '2026-05-29T14:21:00Z',
    oldDevice: { model: 'Dell Latitude 5420', serial: 'BX2K7N3', hostname: 'CSA-LT-041', os: 'Windows 11', lastSeen: '2026-05-24T11:00:00Z' },
    newDevice: { model: 'Dell Latitude 7440', serial: 'CB7N8K9', hostname: 'CSA-LT-097', os: 'Windows 11 Pro', lastSeen: '2026-05-29T14:21:00Z' },
    status: 'approved',
    outcome: { type: 'asset-updated', at: '2026-05-29T14:25:00Z' },
  },
];

const PROVIDER_META: Record<Provider, { color: string; icon: typeof Cloud }> = {
  'Entra ID':         { color: '#0078d4', icon: Cloud },
  'Google Workspace': { color: '#34a853', icon: Cloud },
  'Intune':           { color: '#0078d4', icon: Smartphone },
  'Jamf':             { color: '#ff5300', icon: Smartphone },
  'Kandji':           { color: '#5f50e8', icon: Smartphone },
};

function formatAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 1)    return 'just now';
  if (mins < 60)   return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}

export default function DeviceSyncInboxPage() {
  const [events, setEvents] = useState<SyncEvent[]>(EVENTS);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [expanded, setExpanded] = useState<string | null>(EVENTS[0]?.id ?? null);

  const shown = filter === 'pending' ? events.filter((e) => e.status === 'pending') : events;
  const pendingCount = events.filter((e) => e.status === 'pending').length;

  const resolve = (id: string, type: NonNullable<SyncEvent['outcome']>['type'], status: EventStatus) => {
    setEvents((prev) => prev.map((e) =>
      e.id === id
        ? { ...e, status, outcome: { type, at: new Date().toISOString(), ticketId: type.includes('ticket') ? `#${1024 + prev.indexOf(e)}` : undefined } }
        : e,
    ));
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
        <header className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Asset management</p>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">Device sync inbox</h1>
              <p className="mt-0.5 text-sm text-white/70">
                Users whose primary device has changed in Entra ID / Google Workspace / Intune / Jamf / Kandji. Decide whether to update the asset register, open a ticket, or ignore.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-white/20 bg-white/10 text-white">
                {pendingCount} pending
              </Badge>
              <Button size="sm" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                <RefreshCw className="h-3 w-3" />Sync now
              </Button>
            </div>
          </div>
        </header>
      </div>

      <div className="shrink-0 px-5 pt-5">
        <div className="rounded-xl border border-border/70 bg-card px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            {(['pending', 'all'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn('rounded-md px-2.5 py-1 font-medium capitalize transition-colors',
                  filter === f ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground')}>
                {f === 'pending' ? `Pending (${pendingCount})` : `All (${events.length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 space-y-3 overflow-y-auto p-5 pt-5">
        {shown.map((ev) => {
          const meta = PROVIDER_META[ev.provider];
          const ProviderIcon = meta.icon;
          const isOpen = expanded === ev.id;
          return (
            <Card key={ev.id} className={cn('overflow-hidden transition-shadow', isOpen && 'shadow-md')}>
              {/* Compact header — always visible */}
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : ev.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/30"
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="bg-coral text-[11px] font-bold text-white">{ev.user.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{ev.user.name}</p>
                    <span className="text-[11px] text-muted-foreground">appears to have switched devices</span>
                    <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white"
                      style={{ background: meta.color }}>
                      <ProviderIcon className="h-2.5 w-2.5" />
                      via {ev.provider}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {ev.user.email} · {ev.user.department} · detected {formatAgo(ev.detectedAt)}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Laptop className="h-3 w-3" />
                  <span className="font-medium">{ev.oldDevice.model.split(' ').slice(0, 3).join(' ')}</span>
                  <ChevronRight className="h-3 w-3" />
                  <Smartphone className="h-3 w-3" />
                  <span className="font-medium text-foreground">{ev.newDevice.model.split(' ').slice(0, 3).join(' ')}</span>
                </div>
                {ev.status === 'pending' ? (
                  <Badge variant="warning" className="text-[10px]">Awaiting decision</Badge>
                ) : ev.status === 'approved' ? (
                  <Badge variant="success" className="text-[10px]"><CheckCircle2 className="h-2.5 w-2.5" />Updated</Badge>
                ) : ev.status === 'ignored' ? (
                  <Badge variant="secondary" className="text-[10px]"><XCircle className="h-2.5 w-2.5" />Ignored</Badge>
                ) : (
                  <Badge variant="default" className="text-[10px]"><Ticket className="h-2.5 w-2.5" />Ticket {ev.outcome?.ticketId}</Badge>
                )}
              </button>

              {/* Expanded body */}
              {isOpen && (
                <div className="border-t border-border/60 bg-muted/10 px-4 py-4">
                  {/* Side-by-side device comparison */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <DeviceCard label="Old device — on file" tone="muted" device={ev.oldDevice} />
                    <DeviceCard label="New device — detected" tone="active" device={ev.newDevice} />
                  </div>

                  {/* The 4 actions */}
                  {ev.status === 'pending' ? (
                    <div className="mt-4 space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        What should Topiadesk do?
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        <ActionBtn
                          tone="primary"
                          icon={CheckCircle2}
                          title="Yes, update the asset"
                          sub="Reassign the new device to this user. Old device goes to 'Returned / Pending pickup'."
                          onClick={() => resolve(ev.id, 'asset-updated', 'approved')}
                        />
                        <ActionBtn
                          tone="primary"
                          icon={Ticket}
                          title="Yes, update & open a ticket"
                          sub="Same as above, plus a linked ticket so support can confirm with the user."
                          onClick={() => resolve(ev.id, 'asset-updated-and-ticket', 'approved')}
                        />
                        <ActionBtn
                          tone="secondary"
                          icon={Ticket}
                          title="Open a ticket instead"
                          sub="Defer the decision — assign a support agent to investigate before touching the register."
                          onClick={() => resolve(ev.id, 'ticket-opened', 'ticketed')}
                        />
                        <ActionBtn
                          tone="danger"
                          icon={XCircle}
                          title="No, ignore"
                          sub="False positive (shared device, temporary loaner, etc.). Audit-log entry only."
                          onClick={() => resolve(ev.id, 'ignored', 'ignored')}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-md border bg-card p-3 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="font-semibold">
                          {ev.outcome?.type === 'asset-updated'             && 'Asset register updated'}
                          {ev.outcome?.type === 'asset-updated-and-ticket'  && 'Asset register updated · linked ticket opened'}
                          {ev.outcome?.type === 'ticket-opened'             && 'Ticket opened for investigation'}
                          {ev.outcome?.type === 'ignored'                   && 'Event ignored — audit log entry written'}
                        </span>
                        {ev.outcome?.ticketId && (
                          <Link href={`/tickets/${ev.outcome.ticketId.replace('#', 't-')}`}
                            className="ml-auto inline-flex items-center gap-1 text-primary hover:underline">
                            View {ev.outcome.ticketId}
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {formatAgo(ev.outcome?.at ?? new Date().toISOString())} · by you
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
        {shown.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Inbox className="mx-auto h-8 w-8 text-muted-foreground/40" />
              <p className="mt-2 text-sm font-medium">No pending device-sync events</p>
              <p className="text-[11px] text-muted-foreground">
                You're all caught up. New events from Entra / Google / MDM will land here automatically.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// ─── Device side-by-side card ────────────────────────────────────────────────

function DeviceCard({
  label, tone, device,
}: {
  label: string;
  tone: 'muted' | 'active';
  device: DeviceSnapshot;
}) {
  return (
    <div className={cn(
      'rounded-lg border p-3 text-xs',
      tone === 'active' ? 'border-coral/40 bg-coral/5' : 'border-border bg-card',
    )}>
      <div className="flex items-center justify-between">
        <p className={cn('text-[10px] font-semibold uppercase tracking-wide',
          tone === 'active' ? 'text-coral-dark' : 'text-muted-foreground')}>
          {label}
        </p>
        <Cpu className={cn('h-3.5 w-3.5', tone === 'active' ? 'text-coral' : 'text-muted-foreground/50')} />
      </div>
      <p className="mt-1.5 text-sm font-bold">{device.model}</p>
      <p className="text-[10px] text-muted-foreground">{device.os}</p>
      <div className="mt-2 space-y-1 border-t pt-2">
        <Row label="Hostname" value={device.hostname} mono />
        <Row label="Serial"   value={device.serial}   mono />
        {device.aadDeviceId && <Row label="AAD device ID" value={device.aadDeviceId} mono />}
        <Row label="Last seen" value={new Date(device.lastSeen).toLocaleString()} />
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className={cn('text-[11px]', mono && 'font-mono')}>{value}</span>
    </div>
  );
}

// ─── Action button ──────────────────────────────────────────────────────────

function ActionBtn({
  icon: Icon, title, sub, tone, onClick,
}: {
  icon: typeof CheckCircle2;
  title: string;
  sub: string;
  tone: 'primary' | 'secondary' | 'danger';
  onClick: () => void;
}) {
  const toneClasses = {
    primary:   'border-coral/30 bg-coral/5 hover:bg-coral/10 hover:border-coral text-foreground',
    secondary: 'border-border bg-card hover:bg-muted/40 text-foreground',
    danger:    'border-red-200 bg-red-50/50 hover:bg-red-50 hover:border-red-300 text-foreground dark:border-red-900 dark:bg-red-950/20',
  }[tone];
  const iconColor = {
    primary:   'text-coral',
    secondary: 'text-muted-foreground',
    danger:    'text-red-600',
  }[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex items-start gap-2 rounded-lg border p-3 text-left transition-all',
        toneClasses,
      )}
    >
      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0 transition-transform group-hover:scale-110', iconColor)} />
      <div className="min-w-0">
        <p className="text-xs font-semibold leading-tight">{title}</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">{sub}</p>
      </div>
    </button>
  );
}
