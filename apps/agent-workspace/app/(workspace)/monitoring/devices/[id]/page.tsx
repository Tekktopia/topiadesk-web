'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock,
  Cpu,
  Globe,
  HardDrive,
  Info,
  Layers,
  MapPin,
  Monitor,
  Network,
  Printer,
  Server,
  Shield,
  Tag,
  Wifi,
  Zap,
} from 'lucide-react';
import type { ComponentType } from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  Sparkline,
  cn,
} from '@topiadesk/ui';
import { useDevice, useMonitoringAlerts } from '@/lib/queries';
import type { DeviceStatus, DeviceType, SensorType } from '@/lib/mock-data';

// ─── Metadata ─────────────────────────────────────────────────────────────────

const STATUS_META: Record<DeviceStatus, { dot: string; badge: 'success' | 'danger' | 'warning' | 'secondary'; label: string }> = {
  up:      { dot: 'bg-emerald-500', badge: 'success',   label: 'Up' },
  down:    { dot: 'bg-red-500',     badge: 'danger',    label: 'Down' },
  warning: { dot: 'bg-amber-500',   badge: 'warning',   label: 'Warning' },
  paused:  { dot: 'bg-slate-400',   badge: 'secondary', label: 'Paused' },
  unknown: { dot: 'bg-slate-300',   badge: 'secondary', label: 'Unknown' },
};

const TYPE_ICONS: Record<DeviceType, ComponentType<{ className?: string }>> = {
  server:       Server,
  switch:       HardDrive,
  router:       HardDrive,
  firewall:     Shield,
  access_point: Wifi,
  nvr:          Camera,
  printer:      Printer,
  ups:          Zap,
};

const TYPE_LABELS: Record<DeviceType, string> = {
  server: 'Server', switch: 'Switch', router: 'Router', firewall: 'Firewall',
  access_point: 'Access Point', nvr: 'NVR', printer: 'Printer', ups: 'UPS',
};

const SENSOR_ICONS: Partial<Record<SensorType, ComponentType<{ className?: string }>>> = {
  ping:        Network,
  cpu:         Cpu,
  memory:      Layers,
  disk:        HardDrive,
  interface:   Activity,
  service:     CheckCircle2,
  http:        Globe,
  temperature: Monitor,
};

function formatAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}

// ─── Sparkline 24h Chart ──────────────────────────────────────────────────────

function SensorChart({
  label, data, unit, color, thresholdPct,
}: {
  label: string;
  data: readonly number[];
  unit: string;
  color: string;
  thresholdPct?: number;
}) {
  const w = 320;
  const h = 80;
  const pad = { t: 8, r: 8, b: 20, l: 36 };
  const xs = w - pad.l - pad.r;
  const ys = h - pad.t - pad.b;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data.map((v, i) => ({
    x: pad.l + (i / (data.length - 1)) * xs,
    y: pad.t + (1 - (v - min) / range) * ys,
  }));

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaD = `${pathD} L${pts[pts.length - 1]!.x.toFixed(1)},${(pad.t + ys).toFixed(1)} L${pts[0]!.x.toFixed(1)},${(pad.t + ys).toFixed(1)} Z`;

  const thY = thresholdPct !== undefined
    ? pad.t + (1 - (thresholdPct - min) / range) * ys
    : null;

  const labels = ['24h', '18h', '12h', '6h', 'Now'];

  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold text-muted-foreground">{label}</p>
      <svg viewBox={`0 0 ${w} ${h}`} className={cn('w-full', color)}>
        {/* Y-axis labels */}
        {[0, 0.5, 1].map((t) => {
          const val = (min + t * range).toFixed(0);
          const y = pad.t + (1 - t) * ys;
          return (
            <g key={t}>
              <text x={pad.l - 4} y={y + 3} textAnchor="end" fontSize={8} fill="currentColor" opacity={0.5}>{val}</text>
              <line x1={pad.l} y1={y} x2={pad.l + xs} y2={y} stroke="currentColor" strokeOpacity={0.08} strokeWidth={1} />
            </g>
          );
        })}

        {/* Threshold line */}
        {thY !== null && (
          <line x1={pad.l} y1={thY} x2={pad.l + xs} y2={thY}
            stroke="currentColor" strokeWidth={1} strokeDasharray="4 3" strokeOpacity={0.4} />
        )}

        {/* Area fill */}
        <path d={areaD} fill="currentColor" fillOpacity={0.1} />

        {/* Line */}
        <path d={pathD} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />

        {/* X-axis labels */}
        {labels.map((lbl, i) => {
          const x = pad.l + (i / (labels.length - 1)) * xs;
          return (
            <text key={lbl} x={x} y={h - 4} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.5}>{lbl}</text>
          );
        })}

        {/* Last value dot */}
        <circle cx={pts[pts.length - 1]!.x} cy={pts[pts.length - 1]!.y} r={3} fill="currentColor" />
      </svg>
      <p className="text-right text-[11px] font-semibold tabular-nums">{data[data.length - 1]}{unit}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DeviceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const device = useDevice(id);
  const alerts = useMonitoringAlerts();

  const d = device.data;
  const deviceAlerts = (alerts.data ?? []).filter((a) => a.deviceId === id && a.state !== 'resolved');

  if (device.isLoading) {
    return (
      <div className="space-y-5 p-5">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
        <Skeleton className="h-64" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!d) {
    return (
      <div className="flex flex-col items-center gap-3 p-16 text-muted-foreground">
        <Info className="h-8 w-8" />
        <p className="text-sm">Device not found.</p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/monitoring/devices"><ArrowLeft className="h-3 w-3" />Back to devices</Link>
        </Button>
      </div>
    );
  }

  const meta = STATUS_META[d.status];
  const Icon = TYPE_ICONS[d.type] ?? Server;
  const cpuSensor    = d.sensors.find((s) => s.type === 'cpu');
  const memSensor    = d.sensors.find((s) => s.type === 'memory');
  const pingSensor   = d.sensors.find((s) => s.type === 'ping');
  const activeSensorAlerts = d.sensors.filter((s) => s.status === 'down' || s.status === 'warning').length;

  return (
    <div className="space-y-5 p-5">
      {/* Gradient header */}
      <div className="relative -mx-5 -mt-5 mb-1 overflow-hidden bg-navy px-5 py-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative">
          <Link href="/monitoring/devices" className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white/90">
            <ArrowLeft className="h-3 w-3" />Monitoring · Devices
          </Link>
          <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10">
                <Icon className="h-5 w-5 text-white/80" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-white">{d.name}</h1>
                  {d.status === 'down' ? (
                    <span className="relative flex h-2.5 w-2.5 mt-1">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                    </span>
                  ) : (
                    <span className={cn('mt-1 h-2.5 w-2.5 rounded-full', meta.dot)} />
                  )}
                  <Badge variant={meta.badge}>{meta.label}</Badge>
                  <Badge variant="secondary" className="bg-white/15 text-white border-0">{TYPE_LABELS[d.type]}</Badge>
                </div>
                <p className="mt-0.5 font-mono text-sm text-white/60">{d.ip}{d.fqdn ? ` · ${d.fqdn}` : ''}</p>
                {d.tags.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-1">
                    <Tag className="h-3 w-3 text-white/50" />
                    {d.tags.map((t) => (
                      <span key={t} className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] text-white/70">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" asChild>
                <Link href="/monitoring/alerts">View alerts</Link>
              </Button>
              <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">Pause monitoring</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: 'Uptime (30d)',
            value: `${d.uptimePct.toFixed(2)}%`,
            icon: <CheckCircle2 className="h-4 w-4" />,
            color: d.uptimePct >= 99.5 ? 'text-emerald-600' : d.uptimePct >= 98 ? 'text-amber-600' : 'text-red-600',
          },
          {
            label: 'Active alerts',
            value: deviceAlerts.length,
            icon: <AlertTriangle className="h-4 w-4" />,
            color: deviceAlerts.length > 0 ? 'text-red-600' : 'text-emerald-600',
          },
          {
            label: 'Sensors',
            value: `${d.sensors.length - activeSensorAlerts} / ${d.sensors.length} OK`,
            icon: <Activity className="h-4 w-4" />,
            color: activeSensorAlerts > 0 ? 'text-amber-600' : 'text-emerald-600',
          },
          {
            label: 'Last check',
            value: formatAgo(d.lastCheck),
            icon: <Clock className="h-4 w-4" />,
            color: 'text-foreground',
          },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</p>
              <span className={cn('opacity-50', s.color)}>{s.icon}</span>
            </div>
            <p className={cn('mt-1.5 text-xl font-bold tabular-nums', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Left column — sensors + charts */}
        <div className="space-y-5 lg:col-span-2">
          {/* Sensor table */}
          <Card>
            <CardHeader className="border-b py-3">
              <CardTitle className="text-sm">Sensors ({d.sensors.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                      <th className="px-4 py-2.5 font-semibold">Sensor</th>
                      <th className="px-3 py-2.5 font-semibold">Status</th>
                      <th className="px-3 py-2.5 font-semibold">Current</th>
                      <th className="px-3 py-2.5 font-semibold">24h trend</th>
                      <th className="px-3 py-2.5 text-right font-semibold">Uptime</th>
                      <th className="px-3 py-2.5 font-semibold">Last check</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {d.sensors.map((sensor) => {
                      const sm = STATUS_META[sensor.status];
                      const SensorIcon = SENSOR_ICONS[sensor.type] ?? Activity;
                      const sparkColor =
                        sensor.status === 'down' ? 'text-red-500' :
                        sensor.status === 'warning' ? 'text-amber-500' :
                        'text-emerald-500';
                      const rowBg =
                        sensor.status === 'down' ? 'bg-red-50/30 dark:bg-red-950/10' :
                        sensor.status === 'warning' ? 'bg-amber-50/20 dark:bg-amber-950/10' : '';

                      return (
                        <tr key={sensor.id} className={cn('transition-colors hover:bg-muted/40', rowBg)}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <SensorIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                              <span className="font-medium">{sensor.name}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1.5">
                              {sensor.status === 'down' ? (
                                <span className="relative flex h-2 w-2">
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                                </span>
                              ) : (
                                <span className={cn('h-2 w-2 rounded-full', sm.dot)} />
                              )}
                              <Badge variant={sm.badge} className="text-[10px]">{sm.label}</Badge>
                            </div>
                          </td>
                          <td className="px-3 py-3 font-mono font-semibold tabular-nums">
                            {sensor.type === 'service'
                              ? (sensor.value === 1 ? 'Running' : 'Stopped')
                              : `${sensor.value}${sensor.unit ? ` ${sensor.unit}` : ''}`}
                          </td>
                          <td className="px-3 py-3">
                            <Sparkline data={[...sensor.sparkline]} width={72} height={16} className={sparkColor} />
                          </td>
                          <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">{sensor.uptime.toFixed(1)}%</td>
                          <td className="px-3 py-3 tabular-nums text-muted-foreground">{formatAgo(sensor.lastCheck)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 24h Charts */}
          {(cpuSensor || memSensor || pingSensor) && (
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">24-hour activity</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 py-4 sm:grid-cols-2 lg:grid-cols-3">
                {pingSensor && (
                  <SensorChart
                    label="Ping response (ms)"
                    data={pingSensor.sparkline}
                    unit=" ms"
                    color={d.status === 'down' ? 'text-red-500' : 'text-emerald-500'}
                    thresholdPct={50}
                  />
                )}
                {cpuSensor && (
                  <SensorChart
                    label="CPU load (%)"
                    data={cpuSensor.sparkline}
                    unit="%"
                    color={cpuSensor.value > 80 ? 'text-red-500' : cpuSensor.value > 60 ? 'text-amber-500' : 'text-blue-500'}
                    thresholdPct={80}
                  />
                )}
                {memSensor && (
                  <SensorChart
                    label="Memory usage (%)"
                    data={memSensor.sparkline}
                    unit="%"
                    color={memSensor.value > 85 ? 'text-red-500' : memSensor.value > 70 ? 'text-amber-500' : 'text-coral'}
                    thresholdPct={85}
                  />
                )}
              </CardContent>
            </Card>
          )}

          {/* Active alerts for this device */}
          {deviceAlerts.length > 0 && (
            <Card>
              <CardHeader className="border-b py-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                  <CardTitle className="text-sm text-red-600 dark:text-red-400">
                    Active alerts ({deviceAlerts.length})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y">
                  {deviceAlerts.map((a) => (
                    <li key={a.id} className="px-4 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium">{a.title}</p>
                          <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                            {a.sensorName} · {formatAgo(a.triggeredAt)}
                          </p>
                        </div>
                        <Badge
                          variant={a.severity === 'critical' ? 'danger' : a.severity === 'error' ? 'warning' : 'secondary'}
                          className="shrink-0 text-[10px]"
                        >
                          {a.severity}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column — device info */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="border-b py-3">
              <CardTitle className="text-sm">Device information</CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <dl className="space-y-3 text-xs">
                {[
                  { icon: Server,   label: 'Vendor / Model', value: `${d.vendor} ${d.model}` },
                  { icon: Monitor,  label: 'OS / Firmware',  value: d.os ?? '—' },
                  { icon: MapPin,   label: 'Location',       value: d.location },
                  { icon: Network,  label: 'Site',           value: d.site },
                  { icon: Layers,   label: 'Group',          value: d.group },
                  { icon: Globe,    label: 'FQDN',           value: d.fqdn ?? '—' },
                ].map(({ icon: DtIcon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <DtIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground">{label}</p>
                      <p className="truncate font-medium text-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          {/* Uptime breakdown */}
          <Card>
            <CardHeader className="border-b py-3">
              <CardTitle className="text-sm">Uptime summary</CardTitle>
            </CardHeader>
            <CardContent className="py-4 space-y-3">
              {[
                { label: '24 hours', pct: Math.min(100, d.uptimePct + (Math.random() * 0.2 - 0.1)) },
                { label: '7 days',   pct: Math.min(100, d.uptimePct + (Math.random() * 0.4 - 0.2)) },
                { label: '30 days',  pct: d.uptimePct },
              ].map((row) => (
                <div key={row.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className={cn('font-semibold tabular-nums',
                      row.pct >= 99.5 ? 'text-emerald-600' : row.pct >= 98 ? 'text-amber-600' : 'text-red-600',
                    )}>
                      {row.pct.toFixed(2)}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn('h-full rounded-full',
                        row.pct >= 99.5 ? 'bg-emerald-500' : row.pct >= 98 ? 'bg-amber-500' : 'bg-red-500',
                      )}
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
              <Link href="/monitoring/alerts">
                <AlertTriangle className="h-3.5 w-3.5" />View all alerts
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
              <Link href="/monitoring/incidents">
                <Activity className="h-3.5 w-3.5" />Related incidents
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
              <Link href="/monitoring/reports">
                <CheckCircle2 className="h-3.5 w-3.5" />Availability report
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
