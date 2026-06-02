'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, BellRing, Loader2, Sparkles } from 'lucide-react';
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
import type { MonAlertSeverity } from '@/lib/mock-data';

const METRICS = ['CPU', 'Memory', 'Disk', 'Ping latency', 'Packet loss', 'Interface in/out', 'HTTP status', 'Battery', 'Temperature', 'Service state'];
const CONDITIONS = ['is above', 'is below', 'equals', 'not equals', 'is down for'];
const SEVERITIES: MonAlertSeverity[] = ['critical', 'error', 'warning', 'info'];
const CHANNELS = ['Email', 'SMS', 'Helpdesk ticket', 'Slack', 'WhatsApp', 'Push'];

const SEV_STYLE: Record<MonAlertSeverity, string> = {
  critical: 'bg-red-100 text-red-700',
  error: 'bg-orange-100 text-orange-700',
  warning: 'bg-amber-100 text-amber-700',
  info: 'bg-blue-100 text-blue-700',
};

export default function NewAlertRulePage() {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('All devices');
  const [metric, setMetric] = useState(METRICS[0]!);
  const [condition, setCondition] = useState(CONDITIONS[0]!);
  const [threshold, setThreshold] = useState('90');
  const [unit, setUnit] = useState('%');
  const [severity, setSeverity] = useState<MonAlertSeverity>('warning');
  const [channels, setChannels] = useState<string[]>(['Email', 'Helpdesk ticket']);
  const [enabled, setEnabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim().length > 1 && channels.length > 0;

  function toggleChannel(c: string) {
    setChannels((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
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
              <Link href="/monitoring/alerts/rules" className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white">
                <ArrowLeft className="h-3 w-3" /> Alert rules
              </Link>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">New alert rule</h1>
              <p className="mt-0.5 text-sm text-white/70">Trigger notifications and tickets when a metric crosses a threshold.</p>
            </div>
            <Button form="new-rule-form" type="submit" size="sm" disabled={!canSubmit || submitting} className="bg-coral text-white hover:bg-coral-dark">
              {submitting && <Loader2 className="h-3 w-3 animate-spin" />} Save rule
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <form id="new-rule-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Identity</CardTitle></CardHeader>
              <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Rule name *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. High CPU on core servers" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target">Target</Label>
                  <Input id="target" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="All devices · group · single device" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="flex items-center gap-2 text-sm"><BellRing className="h-4 w-4 text-coral" /> Condition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid gap-3 sm:grid-cols-[1fr_1fr_120px_90px]">
                  <Select value={metric} onChange={setMetric} options={METRICS} label="Metric" />
                  <Select value={condition} onChange={setCondition} options={CONDITIONS} label="Condition" />
                  <div className="space-y-2">
                    <Label>Threshold</Label>
                    <Input value={threshold} onChange={(e) => setThreshold(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Input value={unit} onChange={(e) => setUnit(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Severity</Label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {SEVERITIES.map((s) => (
                      <button key={s} type="button" onClick={() => setSeverity(s)}
                        className={cn('rounded-md border py-2 text-[11px] capitalize transition-colors',
                          severity === s ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card hover:bg-muted')}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
                <CardTitle className="text-sm">Notify via *</CardTitle>
                <label className="flex items-center gap-2 text-[11px]">
                  <span className="text-muted-foreground">Enabled</span>
                  <Switch checked={enabled} onCheckedChange={setEnabled} />
                </label>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-1.5 p-6 sm:grid-cols-3">
                {CHANNELS.map((c) => (
                  <label key={c} className="flex cursor-pointer items-center gap-2 rounded-md border bg-card px-3 py-2 text-xs hover:bg-muted">
                    <input type="checkbox" checked={channels.includes(c)} onChange={() => toggleChannel(c)} className="h-3.5 w-3.5 accent-primary" />
                    {c}
                  </label>
                ))}
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Preview</CardTitle></CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <p className="font-semibold">{name || 'Untitled rule'}</p>
                <p className="rounded-md border bg-muted/40 p-2 text-muted-foreground">
                  When <span className="font-medium text-foreground">{metric}</span> {condition}{' '}
                  <span className="font-medium text-foreground">{threshold}{unit}</span> on{' '}
                  <span className="font-medium text-foreground">{target}</span>
                </p>
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize', SEV_STYLE[severity])}>{severity}</span>
                  {channels.map((c) => <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>)}
                </div>
                {!enabled && <Badge variant="outline" className="text-[10px]">Disabled</Badge>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Tips</CardTitle></CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <Tip text="The correlation engine suppresses downstream alerts when a parent is already down." />
                <Tip text="Route critical rules to SMS or Slack so they page on-call." />
              </CardContent>
            </Card>
          </aside>
        </form>
      </div>
    </div>
  );
}

function Select({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: string[]; label: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
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
