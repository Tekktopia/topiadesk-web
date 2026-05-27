'use client';

import { useState } from 'react';
import {
  Calendar,
  CalendarOff,
  Clock,
  Globe2,
  Plus,
  Trash2,
} from 'lucide-react';
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
import { BUSINESS_HOURS } from '@/lib/mock-data';

export default function BusinessHoursPage() {
  const [schedule, setSchedule] = useState(BUSINESS_HOURS.schedule);
  const [holidays, setHolidays] = useState(BUSINESS_HOURS.holidays);

  function toggleDay(idx: number) {
    setSchedule((prev) =>
      prev.map((d, i) => (i === idx ? { ...d, open: !d.open } : d)),
    );
  }

  function updateTime(idx: number, key: 'start' | 'end', value: string) {
    setSchedule((prev) =>
      prev.map((d, i) => (i === idx ? { ...d, [key]: value } : d)),
    );
  }

  function deleteHoliday(date: string) {
    setHolidays((prev) => prev.filter((h) => h.date !== date));
  }

  return (
    <div className="space-y-5">
      {/* Gradient header */}
      <div className="relative overflow-hidden bg-navy px-6 py-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Workspace</p>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">Business hours</h1>
          <p className="mt-0.5 text-sm text-white/70">Used by SLA calculations, after-hours automations, and the customer portal status banner.</p>
        </div>
      </div>

      <div className="px-5 pb-5 lg:px-6 lg:pb-6 space-y-5">
      <Card>
        <CardHeader className="border-b py-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Globe2 className="h-4 w-4" />
            Time zone
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
            <div className="space-y-2">
              <Label htmlFor="tz">Tenant time zone</Label>
              <Input id="tz" defaultValue={BUSINESS_HOURS.timezone} />
              <p className="text-[10px] text-muted-foreground">
                SLA timers and dashboards display in this zone unless an agent
                overrides it.
              </p>
            </div>
            <div className="flex items-end">
              <Badge variant="success">
                <Clock className="h-3 w-3" />
                Currently 09:24 (GMT+1)
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              Weekly schedule
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Tickets opened outside business hours follow the &ldquo;After-hours
              holding&rdquo; SLA policy.
            </p>
          </div>
          <Button variant="outline" size="sm">
            Copy from another tenant
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {schedule.map((day, idx) => (
              <li
                key={day.day}
                className="grid grid-cols-1 items-center gap-3 px-4 py-3 sm:grid-cols-[120px_80px_1fr_1fr]"
              >
                <span className="text-sm font-medium">{day.day}</span>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={day.open}
                    onChange={() => toggleDay(idx)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className={day.open ? 'text-foreground' : 'text-muted-foreground'}>
                    {day.open ? 'Open' : 'Closed'}
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`start-${idx}`} className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    From
                  </Label>
                  <Input
                    id={`start-${idx}`}
                    type="time"
                    value={day.start}
                    disabled={!day.open}
                    onChange={(e) => updateTime(idx, 'start', e.target.value)}
                    className="h-8 w-28 text-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`end-${idx}`} className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    To
                  </Label>
                  <Input
                    id={`end-${idx}`}
                    type="time"
                    value={day.end}
                    disabled={!day.open}
                    onChange={(e) => updateTime(idx, 'end', e.target.value)}
                    className="h-8 w-28 text-xs"
                  />
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-sm">
              <CalendarOff className="h-4 w-4" />
              Holidays
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Office closures that pause SLA timers for the day.
            </p>
          </div>
          <Button size="sm" variant="outline">
            <Plus className="h-3 w-3" />
            Add holiday
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {holidays.map((h) => (
              <li
                key={h.date}
                className="flex items-center justify-between gap-3 px-4 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium">{h.name}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {h.date}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteHoliday(h.date)}
                  className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-red-600"
                  aria-label={`Delete ${h.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t bg-muted/20 p-3 text-center">
            <Button variant="outline" size="sm">
              Import from Google Calendar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className={cn('flex flex-wrap items-center justify-end gap-3')}>
        <Button variant="ghost">Discard changes</Button>
        <Button>Save business hours</Button>
      </div>
      </div>
    </div>
  );
}
