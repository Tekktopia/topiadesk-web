'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Loader2,
  Plus,
  Sparkles,
  TestTube2,
  Trash2,
  Workflow,
  X,
  Zap,
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
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Input,
  Label,
  Textarea,
  cn,
} from '@topiadesk/ui';

const TRIGGERS = [
  { id: 'ticket.created', label: 'Ticket created' },
  { id: 'ticket.updated', label: 'Ticket updated' },
  { id: 'ticket.status_changed', label: 'Status changed' },
  { id: 'sla.80', label: 'SLA reaches 80%' },
  { id: 'sla.breached', label: 'SLA breached' },
  { id: 'asset.assigned', label: 'Asset assigned' },
  { id: 'contact.offboarded', label: 'Contact offboarded' },
  { id: 'schedule.daily', label: 'Daily schedule' },
];

const FIELDS = [
  'Status',
  'Priority',
  'Channel',
  'Category',
  'Requester tag',
  'Subject',
  'Group',
  'Asset tag',
  'Business hours',
];

const OPERATORS = ['equals', 'not equals', 'contains', 'is one of', 'is not set'];

const ACTIONS = [
  'Set priority to…',
  'Assign to group…',
  'Assign to agent…',
  'Set status to…',
  'Send canned reply…',
  'Send Slack notification…',
  'Send webhook…',
  'Add tag…',
  'Remove tag…',
  'Run another rule…',
];

interface Condition {
  id: string;
  field: string;
  op: string;
  value: string;
}
interface Action {
  id: string;
  type: string;
  value: string;
}

let n = 0;
const newId = () => `id-${++n}`;

export default function NewAutomationPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [trigger, setTrigger] = useState('ticket.created');
  const [conditions, setConditions] = useState<Condition[]>([
    { id: newId(), field: 'Requester tag', op: 'contains', value: 'vip' },
  ]);
  const [actions, setActions] = useState<Action[]>([
    { id: newId(), type: 'Set priority to…', value: 'Urgent' },
  ]);
  const [matchMode, setMatchMode] = useState<'all' | 'any'>('all');
  const [dryRun, setDryRun] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.length > 2 && conditions.length > 0 && actions.length > 0;

  function addCondition() {
    setConditions([
      ...conditions,
      { id: newId(), field: FIELDS[0]!, op: OPERATORS[0]!, value: '' },
    ]);
  }
  function updateCondition(id: string, patch: Partial<Condition>) {
    setConditions(conditions.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }
  function removeCondition(id: string) {
    setConditions(conditions.filter((c) => c.id !== id));
  }
  function addAction() {
    setActions([...actions, { id: newId(), type: ACTIONS[0]!, value: '' }]);
  }
  function updateAction(id: string, patch: Partial<Action>) {
    setActions(actions.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }
  function removeAction(id: string) {
    setActions(actions.filter((a) => a.id !== id));
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
                href="/automations"
                className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white"
              >
                <ArrowLeft className="h-3 w-3" />
                Automations
              </Link>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">
                New automation rule
              </h1>
              <p className="mt-0.5 text-sm text-white/70">
                Triggers → Conditions → Actions. Test in dry-run before going live.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link href="/automations">Cancel</Link>
              </Button>
              <Button
                form="new-rule-form"
                type="submit"
                size="sm"
                disabled={!canSubmit || submitting}
                className="bg-coral text-white hover:bg-coral-dark"
              >
                {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
                Save as draft
              </Button>
              <Button
                form="new-rule-form"
                type="submit"
                size="sm"
                disabled={!canSubmit || submitting}
                className="bg-white text-foreground hover:bg-white/90"
              >
                Activate rule
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <form
          id="new-rule-form"
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
                  <Label htmlFor="name">Rule name *</Label>
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
                    placeholder="One sentence so other admins know what this rule does."
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200/60 bg-blue-50/30">
              <CardHeader className="border-b border-blue-200/40 py-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                    1
                  </span>
                  Trigger
                </CardTitle>
                <p className="text-[10px] text-muted-foreground">When should this rule run?</p>
              </CardHeader>
              <CardContent className="p-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-md border border-input bg-card px-3 py-2 text-sm hover:bg-muted"
                    >
                      <span className="flex items-center gap-2">
                        <Zap className="h-3.5 w-3.5 text-blue-600" />
                        {TRIGGERS.find((t) => t.id === trigger)?.label}
                      </span>
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-72">
                    {TRIGGERS.map((t) => (
                      <DropdownMenuItem key={t.id} onSelect={() => setTrigger(t.id)}>
                        {t.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>

            <Card className="border-amber-200/60 bg-amber-50/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-amber-200/40 py-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700">
                      2
                    </span>
                    Conditions
                  </CardTitle>
                  <p className="text-[10px] text-muted-foreground">
                    Apply only when these checks pass
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
                        {matchMode === 'all' ? 'All conditions' : 'Any condition'}
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={() => setMatchMode('all')}>
                        All conditions
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setMatchMode('any')}>
                        Any condition
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 p-4">
                {conditions.map((c) => (
                  <div
                    key={c.id}
                    className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-2 rounded-md border bg-card p-2"
                  >
                    <RowSelect
                      value={c.field}
                      onChange={(v) => updateCondition(c.id, { field: v })}
                      options={FIELDS}
                    />
                    <RowSelect
                      value={c.op}
                      onChange={(v) => updateCondition(c.id, { op: v })}
                      options={OPERATORS}
                      width="w-32"
                    />
                    <Input
                      value={c.value}
                      onChange={(e) => updateCondition(c.id, { value: e.target.value })}
                      placeholder="Value"
                      className="h-8 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => removeCondition(c.id)}
                      aria-label="Remove condition"
                      className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCondition}
                  className="h-7 text-xs"
                >
                  <Plus className="h-3 w-3" />
                  Add condition
                </Button>
              </CardContent>
            </Card>

            <Card className="border-emerald-200/60 bg-emerald-50/30">
              <CardHeader className="border-b border-emerald-200/40 py-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                    3
                  </span>
                  Actions
                </CardTitle>
                <p className="text-[10px] text-muted-foreground">
                  Run these in order when conditions pass
                </p>
              </CardHeader>
              <CardContent className="space-y-2 p-4">
                {actions.map((a, i) => (
                  <div
                    key={a.id}
                    className="grid grid-cols-[auto_1fr_1fr_auto] items-center gap-2 rounded-md border bg-card p-2"
                  >
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                      {i + 1}
                    </span>
                    <RowSelect
                      value={a.type}
                      onChange={(v) => updateAction(a.id, { type: v })}
                      options={ACTIONS}
                    />
                    <Input
                      value={a.value}
                      onChange={(e) => updateAction(a.id, { value: e.target.value })}
                      placeholder="Value"
                      className="h-8 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => removeAction(a.id)}
                      aria-label="Remove action"
                      className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAction}
                  className="h-7 text-xs"
                >
                  <Plus className="h-3 w-3" />
                  Add action
                </Button>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <TestTube2 className="h-4 w-4 text-amber-600" />
                  Dry-run
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 text-xs">
                <label className="flex cursor-pointer items-start gap-2">
                  <input
                    type="checkbox"
                    checked={dryRun}
                    onChange={(e) => setDryRun(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 accent-primary"
                  />
                  <div>
                    <p className="font-medium">Run in dry-run mode</p>
                    <p className="text-[10px] text-muted-foreground">
                      Logs what would happen without performing the actions
                    </p>
                  </div>
                </label>
                <p className="text-muted-foreground">
                  Recommended for the first 24 hours of any new rule.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Workflow className="h-4 w-4" />
                  Flow preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <FlowPill label="Trigger" body={TRIGGERS.find((t) => t.id === trigger)?.label ?? ''} tone="blue" />
                <ArrowRight className="mx-auto h-3 w-3 text-muted-foreground" />
                <FlowPill
                  label={`${matchMode === 'all' ? 'All' : 'Any'} of ${conditions.length}`}
                  body="conditions"
                  tone="amber"
                />
                <ArrowRight className="mx-auto h-3 w-3 text-muted-foreground" />
                <FlowPill label={`${actions.length} actions`} body="" tone="emerald" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <Tip text="Keep rules small. Two simple rules are easier to debug than one big one." />
                <Tip text="Use dry-run for at least 24 hours, then check the audit log before activating." />
                <Tip text="Rules run top-to-bottom in priority order — drag to reorder on the list page." />
              </CardContent>
            </Card>

            {dryRun && (
              <Badge variant="warning" className="mx-auto block w-fit text-[10px]">
                <TestTube2 className="h-3 w-3" />
                Will be saved in dry-run mode
              </Badge>
            )}
          </aside>
        </form>
      </div>
    </div>
  );
}

function RowSelect({
  value,
  onChange,
  options,
  width = 'w-full',
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  width?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex items-center justify-between gap-2 rounded-md border border-input bg-card px-2 py-1.5 text-xs hover:bg-muted',
            width,
          )}
        >
          {value}
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-64 w-56 overflow-y-auto">
        {options.map((o) => (
          <DropdownMenuItem key={o} onSelect={() => onChange(o)}>
            {o}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FlowPill({
  label,
  body,
  tone,
}: {
  label: string;
  body: string;
  tone: 'blue' | 'amber' | 'emerald';
}) {
  const tones = {
    blue: 'border-blue-200 bg-blue-50 text-blue-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  };
  return (
    <div className={cn('rounded-md border px-3 py-2 text-center', tones[tone])}>
      <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70">{label}</p>
      <p className="font-medium">{body}</p>
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

const _Trash = Trash2;
void _Trash;
const _DDL = DropdownMenuLabel;
void _DDL;
