'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarClock, Loader2, Plus, Sparkles, X } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Switch,
  cn,
} from '@topiadesk/ui';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
type Day = (typeof DAYS)[number];

const TIMEZONES = [
  'Africa/Lagos', 'Africa/Accra', 'Africa/Nairobi', 'Africa/Johannesburg',
  'Europe/London', 'Europe/Paris', 'America/New_York',
];

interface DayConfig {
  open: boolean;
  start: string;
  end: string;
}

const DEFAULT: Record<Day, DayConfig> = {
  Monday: { open: true, start: '08:00', end: '17:00' },
  Tuesday: { open: true, start: '08:00', end: '17:00' },
  Wednesday: { open: true, start: '08:00', end: '17:00' },
  Thursday: { open: true, start: '08:00', end: '17:00' },
  Friday: { open: true, start: '08:00', end: '17:00' },
  Saturday: { open: false, start: '09:00', end: '13:00' },
  Sunday: { open: false, start: '09:00', end: '13:00' },
};

export default function NewBusinessHoursPage() {
  const [name, setName] = useState('');
  const [timezone, setTimezone] = useState('Africa/Lagos');
  const [days, setDays] = useState<Record<Day, DayConfig>>(DEFAULT);
  const [holidays, setHolidays] = useState<string[]>([]);
  const [holidayInput, setHolidayInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim().length > 1;
  const openCount = DAYS.filter((d) => days[d].open).length;

  function updateDay(d: Day, patch: Partial<DayConfig>) {
    setDays((prev) => ({ ...prev, [d]: { ...prev[d], ...patch } }));
  }
  function addHoliday(v: string) {
    const t = v.trim();
    if (!t || holidays.includes(t)) return;
    setHolidays([...holidays, t]);
    setHolidayInput('');
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
              <Link href="/business-hours" className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white">
                <ArrowLeft className="h-3 w-3" /> Business hours
              </Link>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">New business calendar</h1>
              <p className="mt-0.5 text-sm text-white/70">Working hours and holidays that SLA timers respect.</p>
            </div>
            <Button form="new-bh-form" type="submit" size="sm" disabled={!canSubmit || submitting} className="bg-coral text-white hover:bg-coral-dark">
              {submitting && <Loader2 className="h-3 w-3 animate-spin" />} Save calendar
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <form id="new-bh-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Identity</CardTitle></CardHeader>
              <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Calendar name *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Lagos HQ hours" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tz">Timezone</Label>
                  <select id="tz" value={timezone} onChange={(e) => setTimezone(e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm">
                    {TIMEZONES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
                <CardTitle className="flex items-center gap-2 text-sm"><CalendarClock className="h-4 w-4 text-coral" /> Weekly hours</CardTitle>
                <span className="text-[10px] text-muted-foreground">{openCount} working days</span>
              </CardHeader>
              <CardContent className="space-y-1 p-4">
                {DAYS.map((d) => {
                  const cfg = days[d];
                  return (
                    <div key={d} className="flex items-center gap-3 rounded-md border bg-card px-3 py-2">
                      <Switch checked={cfg.open} onCheckedChange={(v) => updateDay(d, { open: v })} />
                      <span className="w-24 text-xs font-medium">{d}</span>
                      {cfg.open ? (
                        <div className="flex items-center gap-2 text-xs">
                          <Input type="time" value={cfg.start} onChange={(e) => updateDay(d, { start: e.target.value })} className="h-8 w-28 text-xs" />
                          <span className="text-muted-foreground">to</span>
                          <Input type="time" value={cfg.end} onChange={(e) => updateDay(d, { end: e.target.value })} className="h-8 w-28 text-xs" />
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Closed</span>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Holidays</CardTitle></CardHeader>
              <CardContent className="space-y-3 p-6">
                {holidays.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {holidays.map((h) => (
                      <span key={h} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {h}
                        <button type="button" onClick={() => setHolidays(holidays.filter((x) => x !== h))} aria-label={`Remove ${h}`}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Input value={holidayInput} onChange={(e) => setHolidayInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addHoliday(holidayInput); } }}
                    placeholder="e.g. 2026-10-01 Independence Day" className="h-8 text-xs" />
                  <Button type="button" variant="outline" size="sm" onClick={() => addHoliday(holidayInput)}><Plus className="h-3 w-3" /></Button>
                </div>
                <p className="text-[11px] text-muted-foreground">SLA timers pause on holidays just like outside working hours.</p>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Preview</CardTitle></CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <p className="font-semibold">{name || 'Untitled calendar'}</p>
                <Badge variant="outline">{timezone}</Badge>
                <div className="space-y-1 pt-1">
                  {DAYS.map((d) => (
                    <div key={d} className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">{d.slice(0, 3)}</span>
                      <span className="font-medium">{days[d].open ? `${days[d].start}–${days[d].end}` : 'Closed'}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Tips</CardTitle></CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <Tip text="Attach this calendar to an SLA policy so timers pause overnight." />
                <Tip text="You can keep separate calendars per region or team." />
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
