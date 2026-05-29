'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { AlertTriangle, ArrowUpRight, ChevronRight, ServerCrash, WifiOff } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  cn,
} from '@topiadesk/ui';
import { useDevices, useMonitoringAlerts } from '@/lib/queries';
import type { MockDevice } from '@/lib/mock-data';

function formatAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60) return `${mins}m`;
  if (mins < 1440) return `${Math.round(mins / 60)}h`;
  return `${Math.round(mins / 1440)}d`;
}

const DEVICE_TYPE_LABEL: Record<string, string> = {
  server: 'Server', switch: 'Switch', router: 'Router', firewall: 'Firewall',
  access_point: 'Access Point', nvr: 'NVR', printer: 'Printer', ups: 'UPS',
};

export default function DownAndProblemsPage() {
  const devices = useDevices();
  const alerts  = useMonitoringAlerts();

  const down = useMemo(
    () => (devices.data ?? []).filter((d) => d.status === 'down').sort(
      (a, b) => new Date(a.lastCheck).getTime() - new Date(b.lastCheck).getTime(),
    ),
    [devices.data],
  );

  const warning = useMemo(
    () => (devices.data ?? []).filter((d) => d.status === 'warning'),
    [devices.data],
  );

  const criticalAlerts = useMemo(
    () => (alerts.data ?? []).filter((a) => a.severity === 'critical' && a.state !== 'resolved'),
    [alerts.data],
  );

  const isLoading = devices.isLoading || alerts.isLoading;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
      {/* Gradient header */}
      <div className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Monitoring</p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">Down &amp; Problems</h1>
            <p className="mt-0.5 text-sm text-white/70">Everything currently offline, degraded, or triggering critical alerts</p>
          </div>
          <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" asChild>
            <Link href="/monitoring"><ArrowUpRight className="h-3 w-3" />NOC Dashboard</Link>
          </Button>
        </div>
      </div>
      </div>

      <div className="flex-1 min-h-0 space-y-5 overflow-y-auto p-5 pt-5">

      {/* Summary strip */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 dark:border-red-900 dark:bg-red-950/30">
          <WifiOff className="h-4 w-4 text-red-600" />
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">{down.length} device{down.length !== 1 ? 's' : ''} down</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 dark:border-amber-900 dark:bg-amber-950/30">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">{warning.length} device{warning.length !== 1 ? 's' : ''} warning</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 dark:border-red-900 dark:bg-red-950/30">
          <ServerCrash className="h-4 w-4 text-red-600" />
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">{criticalAlerts.length} critical alert{criticalAlerts.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* DOWN devices */}
      <Card>
        <CardHeader className="border-b py-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            <CardTitle className="text-sm text-red-600 dark:text-red-400">
              Devices DOWN ({down.length})
            </CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">Ping failing — no response from device</p>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
          ) : down.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No devices currently down.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 z-10 bg-[#F4EFE6] shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
                  <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                    <th className="px-4 py-2.5 font-semibold">Device</th>
                    <th className="px-3 py-2.5 font-semibold">Type</th>
                    <th className="px-3 py-2.5 font-semibold">Site</th>
                    <th className="px-3 py-2.5 font-semibold">IP</th>
                    <th className="px-3 py-2.5 font-semibold">Uptime (30d)</th>
                    <th className="px-3 py-2.5 font-semibold">Last seen</th>
                    <th className="px-3 py-2.5 font-semibold">Down sensors</th>
                    <th className="px-3 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {down.map((d) => <DeviceRow key={d.id} device={d} status="down" />)}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* WARNING devices */}
      <Card>
        <CardHeader className="border-b py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <CardTitle className="text-sm text-amber-600 dark:text-amber-400">
              Devices WARNING ({warning.length})
            </CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">Reachable but one or more sensors are degraded</p>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-4">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
          ) : warning.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No devices in warning state.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 z-10 bg-[#F4EFE6] shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
                  <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                    <th className="px-4 py-2.5 font-semibold">Device</th>
                    <th className="px-3 py-2.5 font-semibold">Type</th>
                    <th className="px-3 py-2.5 font-semibold">Site</th>
                    <th className="px-3 py-2.5 font-semibold">IP</th>
                    <th className="px-3 py-2.5 font-semibold">Uptime (30d)</th>
                    <th className="px-3 py-2.5 font-semibold">Last seen</th>
                    <th className="px-3 py-2.5 font-semibold">Down sensors</th>
                    <th className="px-3 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {warning.map((d) => <DeviceRow key={d.id} device={d} status="warning" />)}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Critical alerts */}
      <Card>
        <CardHeader className="border-b py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <CardTitle className="text-sm">Critical alerts ({criticalAlerts.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-4"><Skeleton className="h-12" /><Skeleton className="h-12" /></div>
          ) : criticalAlerts.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No critical alerts.</p>
          ) : (
            <ul className="divide-y">
              {criticalAlerts.map((a) => (
                <li key={a.id}>
                  <Link href="/monitoring/alerts" className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50">
                    <span className="relative mt-1 flex h-2 w-2 shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{a.title}</p>
                      <p className="truncate text-[10px] text-muted-foreground">
                        {a.deviceName} · {a.site} · {a.sensorName} · {formatAgo(a.triggeredAt)} ago
                      </p>
                    </div>
                    <Badge variant="danger" className="shrink-0 text-[10px]">
                      {a.state === 'acknowledged' ? 'Acknowledged' : 'Active'}
                    </Badge>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

// ─── DeviceRow ────────────────────────────────────────────────────────────────

function DeviceRow({ device: d, status }: { device: MockDevice; status: 'down' | 'warning' }) {
  const downSensors = d.sensors.filter((s) => s.status === 'down' || s.status === 'warning');
  const rowBg = status === 'down' ? 'bg-red-50/30 dark:bg-red-950/10' : '';
  return (
    <tr className={cn('transition-colors hover:bg-muted/40', rowBg)}>
      <td className="px-4 py-3">
        <p className="font-medium text-foreground">{d.name}</p>
        <p className="text-muted-foreground">{d.vendor} {d.model}</p>
      </td>
      <td className="px-3 py-3 text-muted-foreground">{DEVICE_TYPE_LABEL[d.type] ?? d.type}</td>
      <td className="px-3 py-3 text-muted-foreground">{d.site}</td>
      <td className="px-3 py-3 font-mono text-muted-foreground">{d.ip}</td>
      <td className="px-3 py-3">
        <span className={cn('font-semibold tabular-nums', d.uptimePct < 90 ? 'text-red-600' : d.uptimePct < 99 ? 'text-amber-600' : 'text-emerald-600')}>
          {d.uptimePct.toFixed(1)}%
        </span>
      </td>
      <td className="px-3 py-3 tabular-nums text-muted-foreground">{formatAgo(d.lastCheck)} ago</td>
      <td className="px-3 py-3">
        {downSensors.length > 0 ? (
          <span className="text-red-600 dark:text-red-400">{downSensors.map((s) => s.name).join(', ')}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-3 py-3">
        <Button size="sm" variant="outline" className="h-7 px-2 text-[11px]" asChild>
          <Link href={`/monitoring/devices/${d.id}`}>View device</Link>
        </Button>
      </td>
    </tr>
  );
}
