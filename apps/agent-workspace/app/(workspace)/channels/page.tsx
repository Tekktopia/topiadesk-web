'use client';

import {
  Headset,
  Plus,
  Mail,
  MessageCircle,
  Phone,
  Zap,
  Smartphone,
  Code2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Settings,
  Ticket,
  Clock,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Skeleton,
  cn,
} from '@topiadesk/ui';
import { useAgentChannels } from '@/lib/queries';
import type { ChannelType, ChannelStatus } from '@/lib/mock-data';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function channelIcon(type: ChannelType) {
  switch (type) {
    case 'email':    return Mail;
    case 'whatsapp': return MessageCircle;
    case 'voice':    return Phone;
    case 'sms':      return Smartphone;
    case 'widget':   return Zap;
    case 'api':      return Code2;
  }
}

function channelColor(type: ChannelType) {
  switch (type) {
    case 'email':    return 'bg-blue-50 text-blue-600';
    case 'whatsapp': return 'bg-emerald-50 text-emerald-600';
    case 'voice':    return 'bg-coral/8 text-coral';
    case 'sms':      return 'bg-cyan-50 text-cyan-600';
    case 'widget':   return 'bg-amber-50 text-amber-600';
    case 'api':      return 'bg-slate-50 text-slate-600';
  }
}

function statusInfo(status: ChannelStatus) {
  switch (status) {
    case 'connected':    return { label: 'Connected',    icon: CheckCircle2, cls: 'text-emerald-600', dotCls: 'bg-emerald-500' };
    case 'warning':      return { label: 'Warning',      icon: AlertTriangle, cls: 'text-amber-600',   dotCls: 'bg-amber-500 animate-pulse' };
    case 'disconnected': return { label: 'Disconnected', icon: XCircle,       cls: 'text-red-600',     dotCls: 'bg-red-500' };
  }
}

function timeAgo(iso?: string) {
  if (!iso) return 'Never';
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChannelsPage() {
  const channels = useAgentChannels();

  const counts = {
    connected: channels.data?.filter((c) => c.status === 'connected').length ?? 0,
    warning: channels.data?.filter((c) => c.status === 'warning').length ?? 0,
    disconnected: channels.data?.filter((c) => c.status === 'disconnected').length ?? 0,
    totalOpen: channels.data?.reduce((s, c) => s + c.openTickets, 0) ?? 0,
    totalPending: channels.data?.reduce((s, c) => s + c.pendingTickets, 0) ?? 0,
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
      {/* ── Gradient header ── */}
      <div
        className="relative overflow-hidden rounded-2xl bg-navy px-6 py-5 shadow-lg shadow-navy/15"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
              Helpdesk
            </p>
            <h1 className="font-display mt-0.5 text-2xl font-bold tracking-tight text-white">
              Channels
            </h1>
            <p className="mt-0.5 text-sm text-white/70">
              {counts.connected} connected · {counts.totalOpen} open tickets · {counts.totalPending} pending
            </p>
          </div>
          <Button size="sm" className="bg-coral text-white hover:bg-white/90">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add channel
          </Button>
        </div>
      </div>
      </div>

      <div className="flex-1 min-h-0 space-y-5 overflow-y-auto p-5 pt-5">

      {/* ── Status summary ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Connected',    value: counts.connected,    icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Warning',      value: counts.warning,      icon: AlertTriangle,color: counts.warning > 0 ? 'bg-amber-50 text-amber-600' : 'bg-muted text-muted-foreground' },
          { label: 'Disconnected', value: counts.disconnected, icon: XCircle,      color: counts.disconnected > 0 ? 'bg-red-50 text-red-600' : 'bg-muted text-muted-foreground' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-3 p-4">
              <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', color)}>
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="font-display text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Channel cards ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {channels.isPending
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full rounded-lg" />
                </CardContent>
              </Card>
            ))
          : channels.data?.map((ch) => {
              const Icon = channelIcon(ch.type);
              const iconColor = channelColor(ch.type);
              const st = statusInfo(ch.status);
              const StatusIcon = st.icon;
              return (
                <Card
                  key={ch.id}
                  className={cn(
                    'transition-shadow hover:shadow-sm',
                    ch.status === 'disconnected' && 'border-red-200 opacity-80',
                    ch.status === 'warning' && 'border-amber-200',
                  )}
                >
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', iconColor)}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-foreground">{ch.name}</p>
                            <span className={cn('flex h-1.5 w-1.5 rounded-full', st.dotCls)} />
                          </div>
                          <p className="text-xs text-muted-foreground font-mono">{ch.address}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="h-7 w-7 shrink-0 p-0">
                        <Settings className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Status + team */}
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className={cn('flex items-center gap-1 text-xs font-medium', st.cls)}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {st.label}
                      </span>
                      <Badge variant="outline" className="text-[10px] capitalize">{ch.type}</Badge>
                      <Badge variant="outline" className="text-[10px]">{ch.team}</Badge>
                    </div>

                    {/* Warning/error note */}
                    {ch.notes && (
                      <div className={cn(
                        'mb-3 flex items-start gap-2 rounded-lg px-3 py-2 text-xs',
                        ch.status === 'disconnected' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700',
                      )}>
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        {ch.notes}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 rounded-lg bg-muted/30 px-3 py-2">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-foreground">{ch.openTickets}</span>
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Ticket className="h-2.5 w-2.5" /> Open
                        </span>
                      </div>
                      <div className="h-8 w-px bg-border/60" />
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-foreground">{ch.pendingTickets}</span>
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="h-2.5 w-2.5" /> Pending
                        </span>
                      </div>
                      {ch.type !== 'api' && (
                        <>
                          <div className="h-8 w-px bg-border/60" />
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-bold text-foreground">
                              {ch.avgResponseMin > 0 ? `${ch.avgResponseMin}m` : '—'}
                            </span>
                            <span className="text-[10px] text-muted-foreground">Avg resp.</span>
                          </div>
                        </>
                      )}
                      <div className="ml-auto">
                        <span className="text-[10px] text-muted-foreground">
                          Active {timeAgo(ch.lastActivityAt)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex items-center gap-2">
                      {ch.status === 'disconnected' && (
                        <Button size="sm" className="h-7 flex-1 text-xs bg-blue-600 text-white hover:bg-blue-700">
                          Reconnect
                        </Button>
                      )}
                      {ch.openTickets > 0 && (
                        <Button size="sm" variant="outline" className="h-7 flex-1 text-xs">
                          View tickets
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>
      </div>
    </div>
  );
}
