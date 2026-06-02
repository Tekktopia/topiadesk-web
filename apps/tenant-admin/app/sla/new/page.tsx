'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  Loader2,
  Plus,
  Sparkles,
  Timer,
  X,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Label,
  Textarea,
  cn,
} from '@topiadesk/ui';

type Priority = 'urgent' | 'high' | 'medium' | 'low';

const PRIORITIES: Priority[] = ['urgent', 'high', 'medium', 'low'];

const UNITS = ['min', 'hours', 'business hours', 'business days'];

interface Target {
  priority: Priority;
  firstResponse: { value: string; unit: string };
  resolution: { value: string; unit: string };
}

const DEFAULT_TARGETS: Target[] = [
  { priority: 'urgent', firstResponse: { value: '15', unit: 'min' }, resolution: { value: '4', unit: 'hours' } },
  { priority: 'high', firstResponse: { value: '1', unit: 'hours' }, resolution: { value: '1', unit: 'business days' } },
  { priority: 'medium', firstResponse: { value: '4', unit: 'hours' }, resolution: { value: '3', unit: 'business days' } },
  { priority: 'low', firstResponse: { value: '1', unit: 'business days' }, resolution: { value: '5', unit: 'business days' } },
];

interface Escalation {
  id: string;
  at: number;
  actions: string[];
}

let escId = 0;
const newEscId = () => `esc-${++escId}`;

export default function NewSlaPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [matchMode, setMatchMode] = useState<'all' | 'any'>('all');
  const [appliesTo, setAppliesTo] = useState('Tickets tagged #vip OR from premium contacts');
  const [businessHoursOnly, setBusinessHoursOnly] = useState(true);
  const [targets, setTargets] = useState<Target[]>(DEFAULT_TARGETS);
  const [escalations, setEscalations] = useState<Escalation[]>([
    { id: newEscId(), at: 50, actions: ['Notify assignee'] },
    { id: newEscId(), at: 80, actions: ['Notify assignee', 'Notify group lead'] },
    { id: newEscId(), at: 100, actions: ['Reassign to Tier 2', 'Tag sla-breached', 'Notify tenant admin'] },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.length > 2;

  function updateTarget(p: Priority, field: 'firstResponse' | 'resolution', key: 'value' | 'unit', v: string) {
    setTargets((prev) =>
      prev.map((t) => (t.priority === p ? { ...t, [field]: { ...t[field], [key]: v } } : t)),
    );
  }

  function addEscalation() {
    setEscalations([...escalations, { id: newEscId(), at: 70, actions: ['Notify assignee'] }]);
  }
  function removeEscalation(id: string) {
    setEscalations(escalations.filter((e) => e.id !== id));
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
              <Link
                href="/sla"
                className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white"
              >
                <ArrowLeft className="h-3 w-3" />
                SLA policies
              </Link>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">
                New SLA policy
              </h1>
              <p className="mt-0.5 text-sm text-white/70">
                Targets per priority, escalation chain, and conditions that decide when it applies.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link href="/sla">Cancel</Link>
              </Button>
              <Button
                form="new-sla-form"
                type="submit"
                size="sm"
                disabled={!canSubmit || submitting}
                className="bg-coral text-white hover:bg-coral-dark"
              >
                {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
                Save policy
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <form
          id="new-sla-form"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]"
        >
          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Identity</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 p-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. VIP fast-track"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea
                    id="desc"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
                <div>
                  <CardTitle className="text-sm">Applies to</CardTitle>
                  <p className="text-[10px] text-muted-foreground">
                    Which tickets does this policy cover?
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-muted-foreground">Match</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-md border border-input bg-card px-2 py-1 font-medium hover:bg-muted"
                      >
                        {matchMode === 'all' ? 'All' : 'Any'}
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={() => setMatchMode('all')}>All</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setMatchMode('any')}>Any</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <Textarea
                  rows={3}
                  value={appliesTo}
                  onChange={(e) => setAppliesTo(e.target.value)}
                  placeholder="e.g. Requester tag contains &quot;vip&quot; OR contact tier is &quot;VIP&quot;"
                />
                <label className="flex cursor-pointer items-start gap-2 rounded-md border p-3 text-xs">
                  <input
                    type="checkbox"
                    checked={businessHoursOnly}
                    onChange={(e) => setBusinessHoursOnly(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 accent-primary"
                  />
                  <div>
                    <p className="font-medium">Pause SLA timer outside business hours</p>
                    <p className="text-[10px] text-muted-foreground">
                      Tickets that arrive at 18:00 don&rsquo;t breach overnight.
                    </p>
                  </div>
                </label>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Targets</CardTitle>
                <p className="text-[10px] text-muted-foreground">
                  First-response and resolution targets per priority
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="hidden border-b bg-muted/30 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:grid sm:grid-cols-[100px_1fr_1fr]">
                  <span>Priority</span>
                  <span>First response</span>
                  <span>Resolution</span>
                </div>
                {targets.map((t) => (
                  <TargetRow
                    key={t.priority}
                    target={t}
                    onChange={(field, key, v) => updateTarget(t.priority, field, key, v)}
                  />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Timer className="h-4 w-4" />
                    Escalation chain
                  </CardTitle>
                  <p className="text-[10px] text-muted-foreground">
                    What happens as the SLA clock ticks down
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addEscalation}>
                  <Plus className="h-3 w-3" />
                  Add step
                </Button>
              </CardHeader>
              <CardContent className="space-y-2 p-4">
                {escalations.map((e) => (
                  <div key={e.id} className="flex items-start gap-3 rounded-md border bg-card p-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700">
                      {e.at}%
                    </div>
                    <div className="flex-1 space-y-1 text-xs">
                      <p className="font-medium">SLA reaches {e.at}% of allowed time</p>
                      <ul className="space-y-0.5 text-muted-foreground">
                        {e.actions.map((a, i) => (
                          <li key={i}>· {a}</li>
                        ))}
                      </ul>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEscalation(e.id)}
                      aria-label="Remove step"
                      className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 text-xs">
                <p className="font-semibold text-foreground">{name || 'Untitled policy'}</p>
                <p className="text-muted-foreground">{appliesTo || 'No conditions yet'}</p>
                <div className="space-y-1.5">
                  {targets.map((t) => (
                    <div key={t.priority} className="flex items-center justify-between text-[10px]">
                      <span className="capitalize text-muted-foreground">{t.priority}</span>
                      <span className="font-medium">
                        {t.firstResponse.value} {t.firstResponse.unit} →{' '}
                        {t.resolution.value} {t.resolution.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <Tip text="Specific policies (VIP, after-hours) should be ordered above the standard one." />
                <Tip text="Pausing outside business hours is the easiest way to keep your team sane." />
                <Tip text="Escalation steps fire only once per ticket — they don&rsquo;t loop." />
              </CardContent>
            </Card>

            <Badge variant="outline" className="mx-auto block w-fit text-[10px]">
              Active policies run against new tickets immediately
            </Badge>
          </aside>
        </form>
      </div>
    </div>
  );
}

function TargetRow({
  target,
  onChange,
}: {
  target: Target;
  onChange: (
    field: 'firstResponse' | 'resolution',
    key: 'value' | 'unit',
    v: string,
  ) => void;
}) {
  const dotClass =
    target.priority === 'urgent'
      ? 'bg-red-500'
      : target.priority === 'high'
        ? 'bg-amber-500'
        : target.priority === 'medium'
          ? 'bg-blue-500'
          : 'bg-slate-400';
  return (
    <div className="grid grid-cols-[100px_1fr_1fr] items-center gap-3 border-b px-4 py-3 last:border-b-0">
      <span className="inline-flex items-center gap-2 text-xs capitalize">
        <span className={cn('h-1.5 w-1.5 rounded-full', dotClass)} />
        {target.priority}
      </span>
      <ValueUnit
        value={target.firstResponse.value}
        unit={target.firstResponse.unit}
        onValue={(v) => onChange('firstResponse', 'value', v)}
        onUnit={(v) => onChange('firstResponse', 'unit', v)}
      />
      <ValueUnit
        value={target.resolution.value}
        unit={target.resolution.unit}
        onValue={(v) => onChange('resolution', 'value', v)}
        onUnit={(v) => onChange('resolution', 'unit', v)}
      />
    </div>
  );
}

function ValueUnit({
  value,
  unit,
  onValue,
  onUnit,
}: {
  value: string;
  unit: string;
  onValue: (v: string) => void;
  onUnit: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Input
        value={value}
        onChange={(e) => onValue(e.target.value)}
        className="h-8 w-20 text-xs"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-input bg-card px-2 py-1 text-xs hover:bg-muted"
          >
            {unit}
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          {UNITS.map((u) => (
            <DropdownMenuItem key={u} onSelect={() => onUnit(u)}>
              {u}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
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

// Keep PRIORITIES referenced (used in default targets)
const _P = PRIORITIES;
void _P;
