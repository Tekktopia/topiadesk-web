'use client';

import { useState } from 'react';
import {
  CheckCircle2, Cloud, Database, Download, HardDrive, MoreHorizontal,
  Play, RotateCcw, Shield, XCircle, Clock,
} from 'lucide-react';
import {
  Badge, Button,
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  cn,
} from '@topiadesk/ui';

interface Backup {
  id: string; tenant: string; type: 'full' | 'incremental' | 'snapshot';
  status: 'completed' | 'running' | 'failed';
  size: string; createdAt: string; duration: string;
  region: string; retentionDays: number;
}

const BACKUPS: Backup[] = [
  { id: 'bk-2026-0529-001', tenant: 'Platform-wide',  type: 'full',        status: 'completed', size: '847.2 GB', createdAt: '2026-05-29 03:00', duration: '1h 42m', region: 'eu-west-1',     retentionDays: 90 },
  { id: 'bk-2026-0529-002', tenant: 'Acme Corp',      type: 'incremental', status: 'completed', size: '12.4 GB',  createdAt: '2026-05-29 02:30', duration: '8m 12s', region: 'eu-west-1',     retentionDays: 30 },
  { id: 'bk-2026-0529-003', tenant: 'Globex Inc',     type: 'incremental', status: 'running',   size: '—',        createdAt: '2026-05-29 04:15', duration: 'in progress', region: 'af-south-1', retentionDays: 30 },
  { id: 'bk-2026-0528-001', tenant: 'Platform-wide',  type: 'full',        status: 'completed', size: '843.9 GB', createdAt: '2026-05-28 03:00', duration: '1h 38m', region: 'eu-west-1',     retentionDays: 90 },
  { id: 'bk-2026-0528-002', tenant: 'Initech Ltd',    type: 'snapshot',    status: 'completed', size: '4.2 GB',   createdAt: '2026-05-28 14:22', duration: '2m 04s', region: 'us-east-1',     retentionDays: 7 },
  { id: 'bk-2026-0527-001', tenant: 'Platform-wide',  type: 'full',        status: 'failed',    size: '—',        createdAt: '2026-05-27 03:00', duration: '12m 04s', region: 'eu-west-1',    retentionDays: 90 },
  { id: 'bk-2026-0527-002', tenant: 'Wayne Enterprises', type: 'incremental', status: 'completed', size: '28.1 GB', createdAt: '2026-05-27 02:30', duration: '14m 22s', region: 'us-east-1',  retentionDays: 30 },
  { id: 'bk-2026-0526-001', tenant: 'Platform-wide',  type: 'full',        status: 'completed', size: '841.1 GB', createdAt: '2026-05-26 03:00', duration: '1h 41m', region: 'eu-west-1',     retentionDays: 90 },
];

export default function BackupsPage() {
  const [view, setView] = useState<'list' | 'policies'>('list');

  const stats = {
    successRate: 96.4,
    lastBackup: '2 hours ago',
    totalStorage: '8.4 TB',
    rpoTarget: '15 min',
    rtoTarget: '1 hour',
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
        <header className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Super Admin</p>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">Backups & Disaster Recovery</h1>
              <p className="mt-0.5 text-sm text-white/70">
                Last backup {stats.lastBackup} · {stats.totalStorage} total · {stats.successRate}% success (30d)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline"><Download className="h-3 w-3" />Export manifest</Button>
              <Button size="sm" className="bg-coral text-white hover:bg-coral-dark">
                <Play className="h-3 w-3" />Run backup now
              </Button>
            </div>
          </div>
        </header>
      </div>

      <div className="shrink-0 space-y-5 px-5 pt-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Success rate (30d)', value: `${stats.successRate}%`, icon: CheckCircle2, color: 'text-emerald-600' },
            { label: 'Total storage', value: stats.totalStorage, icon: HardDrive, color: 'text-foreground' },
            { label: 'RPO target', value: stats.rpoTarget, icon: Clock, color: 'text-blue-600' },
            { label: 'RTO target', value: stats.rtoTarget, icon: RotateCcw, color: 'text-violet-600' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-xl border bg-card px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</p>
                  <Icon className={cn('h-3.5 w-3.5', s.color)} />
                </div>
                <p className={cn('mt-1 text-xl font-bold tabular-nums', s.color)}>{s.value}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-border/70 bg-card px-4 py-2.5">
          <div className="flex items-center gap-1 text-xs">
            {(['list', 'policies'] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={cn('rounded-md px-3 py-1 font-medium capitalize transition-colors',
                  view === v ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground')}>
                {v === 'list' ? 'Backup history' : 'Schedule & policies'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5 pt-5">
        {view === 'list' ? (
          <div className="rounded-xl border border-border/70 bg-card overflow-hidden">
            <table className="w-full text-xs">
              <thead className="sticky top-0 z-10 bg-[#F4EFE6] shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
                <tr className="border-b text-left text-muted-foreground">
                  <th className="px-4 py-2.5 font-semibold">Backup ID</th>
                  <th className="px-3 py-2.5 font-semibold">Scope</th>
                  <th className="px-3 py-2.5 font-semibold">Type</th>
                  <th className="px-3 py-2.5 font-semibold">Status</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Size</th>
                  <th className="px-3 py-2.5 font-semibold">Duration</th>
                  <th className="px-3 py-2.5 font-semibold">Region</th>
                  <th className="px-3 py-2.5 font-semibold">Created</th>
                  <th className="px-3 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {BACKUPS.map((b) => (
                  <tr key={b.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">{b.id}</td>
                    <td className="px-3 py-3 font-semibold">{b.tenant}</td>
                    <td className="px-3 py-3"><Badge variant="secondary" className="text-[10px] capitalize">{b.type}</Badge></td>
                    <td className="px-3 py-3">
                      <span className={cn('inline-flex items-center gap-1 text-[11px] font-medium capitalize',
                        b.status === 'completed' ? 'text-emerald-600' : b.status === 'running' ? 'text-blue-600' : 'text-red-600')}>
                        {b.status === 'completed' ? <CheckCircle2 className="h-3 w-3" /> :
                         b.status === 'running' ? <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" /> :
                         <XCircle className="h-3 w-3" />}
                        {b.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">{b.size}</td>
                    <td className="px-3 py-3 text-muted-foreground">{b.duration}</td>
                    <td className="px-3 py-3 font-mono text-[10px] text-muted-foreground">{b.region}</td>
                    <td className="px-3 py-3 text-muted-foreground">{b.createdAt}</td>
                    <td className="px-3 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-3.5 w-3.5" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem disabled={b.status !== 'completed'}><RotateCcw className="h-3.5 w-3.5" />Restore from this point</DropdownMenuItem>
                          <DropdownMenuItem disabled={b.status !== 'completed'}><Download className="h-3.5 w-3.5" />Download archive</DropdownMenuItem>
                          <DropdownMenuItem>Verify integrity</DropdownMenuItem>
                          <DropdownMenuItem>View manifest</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete backup</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-border/70 bg-card p-5">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-coral" />
                <h3 className="font-display text-sm font-bold">Backup schedule</h3>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { name: 'Platform-wide full backup', cadence: 'Daily at 03:00 UTC', retention: '90 days', next: '2026-05-30 03:00' },
                  { name: 'Per-tenant incremental',     cadence: 'Every 15 minutes',  retention: '30 days', next: 'in 8 minutes' },
                  { name: 'Database snapshot',          cadence: 'Hourly',            retention: '7 days',  next: 'in 22 minutes' },
                  { name: 'Object storage replication', cadence: 'Continuous',        retention: 'Indefinite', next: 'streaming' },
                ].map((p) => (
                  <div key={p.name} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-background px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground">{p.cadence} · Retained {p.retention}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Next run</p>
                      <p className="text-xs font-medium tabular-nums">{p.next}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border/70 bg-card p-5">
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-coral" />
                <h3 className="font-display text-sm font-bold">Storage destinations</h3>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { name: 'AWS S3 (eu-west-1)',  used: '4.8 TB', encryption: 'AES-256 + KMS' },
                  { name: 'AWS S3 (af-south-1)', used: '2.1 TB', encryption: 'AES-256 + KMS' },
                  { name: 'GCS (us-central1)',   used: '1.5 TB', encryption: 'Customer-managed' },
                ].map((d) => (
                  <div key={d.name} className="rounded-lg border bg-background p-3">
                    <p className="text-xs font-semibold">{d.name}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">{d.used} · {d.encryption}</p>
                    <Badge variant="success" className="mt-2 text-[10px]"><Shield className="h-2.5 w-2.5" />Healthy</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
