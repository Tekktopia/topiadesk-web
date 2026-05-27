'use client';

import { useState } from 'react';
import {
  ArrowRight,
  ChevronRight,
  CircleCheck,
  Copy,
  Filter,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Search,
  Sparkles,
  TestTube2,
  Trash2,
  Workflow,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  cn,
} from '@topiadesk/ui';
import { adminAutomations, type AdminAutomation } from '@/lib/mock-data';

const TEMPLATES = [
  {
    name: 'VIP fast-track',
    description: 'Bump tickets from premium customers and notify a dedicated channel',
    icon: Zap,
  },
  {
    name: 'Outside-hours holding reply',
    description: 'Send a friendly auto-reply when tickets come in out of hours',
    icon: Workflow,
  },
  {
    name: 'Warranty expiry watcher',
    description: 'Tag assets and raise a task when warranty is ending soon',
    icon: CircleCheck,
  },
  {
    name: 'Asset offboarding cascade',
    description: 'Recover gear when a contact is offboarded',
    icon: Workflow,
  },
];

export default function AutomationsPage() {
  const [rules, setRules] = useState(adminAutomations);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'dryrun'>('all');

  function toggle(id: string) {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)),
    );
  }

  function toggleDryRun(id: string) {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, dryRun: !r.dryRun } : r)),
    );
  }

  const filtered = rules
    .filter((r) => {
      if (filter === 'active') return r.active;
      if (filter === 'dryrun') return r.dryRun;
      return true;
    })
    .filter((r) =>
      !search
        ? true
        : (r.name + r.description).toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <div className="space-y-5">
      {/* Gradient header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 px-6 py-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Ticketing</p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">Automations</h1>
            <p className="mt-0.5 text-sm text-white/70">
              Trigger → Conditions → Actions. {rules.filter((r) => r.active).length}{' '}
              active &middot; {rules.filter((r) => r.dryRun).length} in dry-run.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
              Import rule
            </Button>
            <Button size="sm" className="bg-white text-orange-600 hover:bg-white/90">
              <Plus className="h-3 w-3" />
              New rule
            </Button>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 lg:px-6 lg:pb-6 space-y-5">
      <Card>
        <CardHeader className="border-b py-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-orange" />
            Ready-made templates
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Pre-built rules used by similar tenants. Each can be customised
            after cloning.
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATES.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.name}
                type="button"
                className="group rounded-lg border bg-card p-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="mt-2 text-sm font-semibold">{t.name}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                  {t.description}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Use template
                  <ArrowRight className="h-3 w-3" />
                </span>
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center gap-2 border-b p-3">
          <div className="flex items-center gap-1">
            {(['all', 'active', 'dryrun'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                  filter === f
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {f === 'dryrun' ? 'Dry-run' : f}
              </button>
            ))}
          </div>
          <Filter className="h-3 w-3 text-muted-foreground" />
          <div className="relative ml-auto">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search rules"
              className="h-8 w-64 pl-8 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0">
          <ul className="divide-y">
            {filtered.map((r) => (
              <RuleCard
                key={r.id}
                rule={r}
                onToggle={() => toggle(r.id)}
                onToggleDryRun={() => toggleDryRun(r.id)}
              />
            ))}
          </ul>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

function RuleCard({
  rule,
  onToggle,
  onToggleDryRun,
}: {
  rule: AdminAutomation;
  onToggle: () => void;
  onToggleDryRun: () => void;
}) {
  return (
    <li className="px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">{rule.name}</h3>
            {rule.active ? (
              <Badge variant="success" className="text-[9px]">
                <CircleCheck className="h-2.5 w-2.5" />
                Active
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-[9px]">
                Paused
              </Badge>
            )}
            {rule.dryRun && (
              <Badge variant="warning" className="text-[9px]">
                <TestTube2 className="h-2.5 w-2.5" />
                Dry-run
              </Badge>
            )}
            <span className="text-[11px] text-muted-foreground">
              {rule.runs7d} runs / 7d · last {rule.lastRun}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {rule.description}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggle}
            aria-label={rule.active ? 'Pause' : 'Resume'}
            className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {rule.active ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={onToggleDryRun}
            aria-label="Toggle dry-run"
            className={cn(
              'grid h-7 w-7 place-items-center rounded-md hover:bg-muted',
              rule.dryRun ? 'text-amber-600' : 'text-muted-foreground',
            )}
          >
            <TestTube2 className="h-3.5 w-3.5" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="More actions"
                className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem>Edit rule</DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>View run history</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <FlowStep
          label="Trigger"
          tone="info"
          items={[rule.trigger]}
        />
        <FlowStep
          label="Conditions"
          tone="warning"
          items={rule.conditions}
        />
        <FlowStep label="Actions" tone="success" items={rule.actions} />
      </div>
    </li>
  );
}

function FlowStep({
  label,
  tone,
  items,
}: {
  label: string;
  tone: 'info' | 'warning' | 'success';
  items: string[];
}) {
  const toneClass =
    tone === 'info'
      ? 'border-blue-200/60 bg-blue-50/40'
      : tone === 'warning'
        ? 'border-amber-200/60 bg-amber-50/40'
        : 'border-emerald-200/60 bg-emerald-50/40';
  const labelClass =
    tone === 'info'
      ? 'text-blue-700'
      : tone === 'warning'
        ? 'text-amber-700'
        : 'text-emerald-700';

  return (
    <div className={cn('rounded-md border p-2.5', toneClass)}>
      <p
        className={cn(
          'text-[10px] font-semibold uppercase tracking-[0.14em]',
          labelClass,
        )}
      >
        {label}
      </p>
      <ul className="mt-1.5 space-y-1 text-xs">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
