'use client';

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarClock, Loader2, Sparkles } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
  cn,
} from '@topiadesk/ui';
import { mockDevices } from '@/lib/mock-data';

const RECURRENCE = [
  { id: 'none', label: 'One-off' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
] as const;

type Recurrence = (typeof RECURRENCE)[number]['id'];

export default function NewMaintenancePage() {
  const [name, setName] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [recurrence, setRecurrence] = useState<Recurrence>('none');
  const [deviceIds, setDeviceIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim().length > 1 && !!startAt && !!endAt && endAt > startAt && deviceIds.length > 0;
  const selectedSites = useMemo(
    () => Array.from(new Set(mockDevices.filter((d) => deviceIds.includes(d.id)).map((d) => d.site))),
    [deviceIds],
  );

  function toggleDevice(id: string) {
    setDeviceIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
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
              <Link href="/monitoring/maintenance" className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white">
                <ArrowLeft className="h-3 w-3" /> Maintenance
              </Link>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">Schedule a maintenance window</h1>
              <p className="mt-0.5 text-sm text-white/70">Pause alerting for selected devices during planned work.</p>
            </div>
            <Button form="new-mw-form" type="submit" size="sm" disabled={!canSubmit || submitting} className="bg-coral text-white hover:bg-coral-dark">
              {submitting && <Loader2 className="h-3 w-3 animate-spin" />} Schedule window
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <form id="new-mw-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="flex items-center gap-2 text-sm"><CalendarClock className="h-4 w-4 text-coral" /> Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Window name *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Quarterly switch firmware upgrade" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="start">Starts *</Label>
                    <Input id="start" type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end">Ends *</Label>
                    <Input id="end" type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
                  </div>
                </div>
                {startAt && endAt && endAt <= startAt && (
                  <p className="text-[11px] text-red-600">End time must be after the start time.</p>
                )}
                <div className="space-y-2">
                  <Label>Recurrence</Label>
                  <div className="flex gap-1.5">
                    {RECURRENCE.map((r) => (
                      <button key={r.id} type="button" onClick={() => setRecurrence(r.id)}
                        className={cn('flex-1 rounded-md border py-2 text-[11px] transition-colors',
                          recurrence === r.id ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card hover:bg-muted')}>
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
                <CardTitle className="text-sm">Affected devices *</CardTitle>
                <span className="text-[10px] text-muted-foreground">{deviceIds.length} selected</span>
              </CardHeader>
              <CardContent className="max-h-72 space-y-1 overflow-y-auto p-4">
                {mockDevices.map((d) => (
                  <label key={d.id} className="flex cursor-pointer items-center gap-2 rounded-md border bg-card px-3 py-2 text-xs hover:bg-muted">
                    <input type="checkbox" checked={deviceIds.includes(d.id)} onChange={() => toggleDevice(d.id)} className="h-3.5 w-3.5 accent-primary" />
                    <span className="flex-1 font-medium">{d.name}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{d.ip}</span>
                    <Badge variant="outline" className="text-[10px]">{d.site}</Badge>
                  </label>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Notes</CardTitle></CardHeader>
              <CardContent className="p-6">
                <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What work is happening? Who is the change owner?" />
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Preview</CardTitle></CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <p className="font-semibold">{name || 'Untitled window'}</p>
                <p className="text-muted-foreground">
                  {startAt ? new Date(startAt).toLocaleString() : 'Start —'} → {endAt ? new Date(endAt).toLocaleString() : 'End —'}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  <Badge variant="outline">{RECURRENCE.find((r) => r.id === recurrence)!.label}</Badge>
                  <Badge variant="outline">{deviceIds.length} devices</Badge>
                  {selectedSites.map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Tips</CardTitle></CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <Tip text="Alerts for these devices are suppressed for the whole window — no false pages." />
                <Tip text="Recurring windows are great for weekly server reboots or UPS tests." />
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
