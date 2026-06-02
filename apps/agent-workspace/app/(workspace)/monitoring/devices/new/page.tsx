'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Radar, Server, Sparkles } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  cn,
} from '@topiadesk/ui';
import type { DeviceType, SensorType } from '@/lib/mock-data';

const DEVICE_TYPES: { id: DeviceType; label: string }[] = [
  { id: 'server', label: 'Server' },
  { id: 'switch', label: 'Switch' },
  { id: 'router', label: 'Router' },
  { id: 'firewall', label: 'Firewall' },
  { id: 'access_point', label: 'Access point' },
  { id: 'nvr', label: 'NVR / CCTV' },
  { id: 'printer', label: 'Printer' },
  { id: 'ups', label: 'UPS' },
];

const SENSORS: { id: SensorType; label: string }[] = [
  { id: 'ping', label: 'Ping (ICMP)' },
  { id: 'cpu', label: 'CPU' },
  { id: 'memory', label: 'Memory' },
  { id: 'disk', label: 'Disk' },
  { id: 'interface', label: 'Interface' },
  { id: 'http', label: 'HTTP(S)' },
  { id: 'service', label: 'Service' },
  { id: 'battery', label: 'Battery' },
  { id: 'temperature', label: 'Temperature' },
];

const SITES = ['Lagos HQ', 'Ikeja Branch', 'Nairobi Office'];
const GROUPS = ['Core Network', 'Servers', 'Security / CCTV', 'Branch Network', 'Facilities'];

export default function NewDevicePage() {
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [fqdn, setFqdn] = useState('');
  const [type, setType] = useState<DeviceType>('server');
  const [site, setSite] = useState(SITES[0]!);
  const [group, setGroup] = useState(GROUPS[0]!);
  const [vendor, setVendor] = useState('');
  const [model, setModel] = useState('');
  const [sensors, setSensors] = useState<SensorType[]>(['ping']);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim().length > 1 && /^(\d{1,3}\.){3}\d{1,3}$/.test(ip.trim()) && sensors.length > 0;

  function toggleSensor(s: SensorType) {
    setSensors((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    window.setTimeout(() => setSubmitting(false), 800);
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
        <div className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link href="/monitoring/devices" className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white">
                <ArrowLeft className="h-3 w-3" /> Devices
              </Link>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">Add a monitored device</h1>
              <p className="mt-0.5 text-sm text-white/70">Start probing a device. It becomes an asset in the CMDB automatically.</p>
            </div>
            <Button form="new-device-form" type="submit" size="sm" disabled={!canSubmit || submitting} className="bg-coral text-white hover:bg-coral-dark">
              {submitting && <Loader2 className="h-3 w-3 animate-spin" />} Add device
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <form id="new-device-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="flex items-center gap-2 text-sm"><Server className="h-4 w-4 text-coral" /> Identity</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name">Device name *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. core-sw-01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ip">IP address *</Label>
                  <Input id="ip" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="10.0.0.1" className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fqdn">Hostname / FQDN</Label>
                  <Input id="fqdn" value={fqdn} onChange={(e) => setFqdn(e.target.value)} placeholder="core-sw-01.lan" className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor</Label>
                  <Input id="vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="Cisco" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Catalyst 9300" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Placement</CardTitle></CardHeader>
              <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Device type</Label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {DEVICE_TYPES.map((t) => (
                      <button key={t.id} type="button" onClick={() => setType(t.id)}
                        className={cn('rounded-md border py-2 text-[10px] transition-colors',
                          type === t.id ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card hover:bg-muted')}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="site">Site</Label>
                    <select id="site" value={site} onChange={(e) => setSite(e.target.value)} className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm">
                      {SITES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="group">Group</Label>
                    <select id="group" value={group} onChange={(e) => setGroup(e.target.value)} className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm">
                      {GROUPS.map((g) => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="flex items-center gap-2 text-sm"><Radar className="h-4 w-4 text-coral" /> Sensors to enable *</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-1.5 p-6 sm:grid-cols-3">
                {SENSORS.map((s) => (
                  <label key={s.id} className="flex cursor-pointer items-center gap-2 rounded-md border bg-card px-3 py-2 text-xs hover:bg-muted">
                    <input type="checkbox" checked={sensors.includes(s.id)} onChange={() => toggleSensor(s.id)} className="h-3.5 w-3.5 accent-primary" />
                    {s.label}
                  </label>
                ))}
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Preview</CardTitle></CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <p className="font-semibold">{name || 'unnamed-device'}</p>
                <p className="font-mono text-muted-foreground">{ip || '0.0.0.0'}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  <Badge variant="outline" className="capitalize">{DEVICE_TYPES.find((t) => t.id === type)!.label}</Badge>
                  <Badge variant="outline">{site}</Badge>
                  <Badge variant="outline">{sensors.length} sensors</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Tips</CardTitle></CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <Tip text="Ping is the baseline up/down check — keep it on for every device." />
                <Tip text="A failed probe auto-creates a ticket pre-filled with owner and location." />
              </CardContent>
            </Card>
          </aside>
        </form>
      </div>
    </div>
  );
}

function Tip({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-md bg-muted/40 p-2">
      <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-coral" />
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}
