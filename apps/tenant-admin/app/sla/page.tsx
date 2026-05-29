'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  Plus,
  Search,
  Target,
  Timer,
  ToggleLeft,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  ProgressRing,
  cn,
} from '@topiadesk/ui';
import { adminSlas, type AdminSla } from '@/lib/mock-data';

export default function SlaPage() {
  const [search, setSearch] = useState('');
  const [policies, setPolicies] = useState<AdminSla[]>(adminSlas);
  const [editing, setEditing] = useState<AdminSla | null>(null);

  const filtered = policies.filter(
    (s) =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.appliesTo.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSaveTargets = (id: string, firstResponseSla: number, resolutionSla: number) => {
    setPolicies((prev) => prev.map((p) =>
      p.id === id ? { ...p, targets: { firstResponseSla, resolutionSla } } : p,
    ));
    setEditing(null);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
      {/* Gradient header */}
      <div className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Ticketing</p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">SLA policies</h1>
            <p className="mt-0.5 text-sm text-white/70">
              Define first-response and resolution targets by priority. Policies are evaluated top-to-bottom — the first matching policy wins.
            </p>
          </div>
          <Button size="sm" className="bg-coral text-white hover:bg-white/90">
            <Plus className="h-3 w-3" />
            New SLA policy
          </Button>
        </div>
      </div>
      </div>

      <div className="flex-1 min-h-0 space-y-5 overflow-y-auto p-5 pt-5">

      <div className="px-5 pb-5 lg:px-6 lg:pb-6 space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryStat
          label="Compliance"
          value="94%"
          sub="rolling 30 days"
          tone="success"
          pct={94}
        />
        <SummaryStat
          label="Tickets evaluated"
          value="442"
          sub="this month"
          tone="info"
          pct={88}
        />
        <SummaryStat
          label="Active policies"
          value={policies.filter((s) => s.active).length}
          sub={`${policies.length} total`}
          tone="success"
          pct={
            (policies.filter((s) => s.active).length / policies.length) * 100
          }
        />
      </div>

      <Card>
        <div className="flex items-center gap-2 border-b p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search policies"
              className="h-8 w-64 pl-8 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="text-[11px] text-muted-foreground">
            {filtered.length} of {policies.length}
          </span>
        </div>
        <CardContent className="p-0">
          <ul className="divide-y">
            {filtered.map((s) => (
              <li key={s.id}>
                <article className="px-4 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold">{s.name}</h3>
                        {s.active ? (
                          <Badge variant="success" className="text-[9px]">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[9px]">
                            Paused
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-[10px]">
                          {s.ticketsThisMonth} tickets / month
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Applies to: {s.appliesTo}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tooltip label={`${s.complianceRate}% compliance`}>
                        <ProgressRing
                          value={s.complianceRate}
                          size={40}
                          strokeWidth={4}
                          className={cn(
                            s.complianceRate >= 95
                              ? 'text-emerald-500'
                              : s.complianceRate >= 90
                                ? 'text-amber-500'
                                : 'text-red-500',
                          )}
                        >
                          <span className="text-[10px] font-semibold">
                            {s.complianceRate}
                          </span>
                        </ProgressRing>
                      </Tooltip>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        Edit
                      </Button>
                      <button
                        type="button"
                        aria-label="Toggle"
                        className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <ToggleLeft className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {(['urgent', 'high', 'medium', 'low'] as const).map(
                      (p) => (
                        <SlaCell
                          key={p}
                          priority={p}
                          firstResponse={s.firstResponse[p]}
                          resolution={s.resolution[p]}
                        />
                      ),
                    )}
                  </div>

                  {/* SLA TARGETS — what the team commits to hit */}
                  <div className="mt-3 rounded-md border bg-coral/5 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Target className="h-3.5 w-3.5 text-coral" />
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-coral-dark">
                          SLA targets
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]" onClick={() => setEditing(s)}>
                        Edit targets
                      </Button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <SlaTargetRow
                        label="First response SLA"
                        target={s.targets.firstResponseSla}
                        actual={s.actuals?.firstResponseSla}
                      />
                      <SlaTargetRow
                        label="Resolution SLA"
                        target={s.targets.resolutionSla}
                        actual={s.actuals?.resolutionSla}
                      />
                    </div>
                    <p className="mt-2 text-[10px] text-muted-foreground">
                      Agents will see "Achieved" pills when actual ≥ target, "Missed" when below.
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b py-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Timer className="h-4 w-4" />
            Escalations
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Notifications and reassignments fired as a ticket approaches its SLA
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <ol className="space-y-3 text-sm">
            <EscalationStep
              at="50%"
              actions={['Notify the assignee']}
            />
            <EscalationStep
              at="80%"
              actions={['Notify the assignee', 'Notify the group lead']}
            />
            <EscalationStep
              at="100%"
              actions={[
                'Reassign to "Tier 2 Support"',
                'Tag the ticket "sla-breached"',
                'Notify the tenant admin',
              ]}
            />
          </ol>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm">
              <Plus className="h-3 w-3" />
              Add escalation step
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
      </div>

      {/* Edit-targets dialog */}
      <EditTargetsDialog
        policy={editing}
        onClose={() => setEditing(null)}
        onSave={handleSaveTargets}
      />
    </div>
  );
}

function SlaTargetRow({
  label, target, actual,
}: { label: string; target: number; actual?: number }) {
  const achieved = actual !== undefined && actual >= target;
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] font-medium text-foreground/80">{label}</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs font-bold tabular-nums">{target}%</span>
          <span className="text-[10px] text-muted-foreground">target</span>
        </div>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-muted">
        {/* Target marker */}
        <div
          className="absolute top-0 bottom-0 z-10 w-px bg-coral"
          style={{ left: `${target}%` }}
        />
        {/* Actual bar */}
        {actual !== undefined && (
          <div
            className={cn(
              'h-full rounded-full transition-all',
              achieved ? 'bg-emerald-500' : 'bg-red-500',
            )}
            style={{ width: `${Math.min(100, actual)}%` }}
          />
        )}
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] text-muted-foreground">
          Actual: <span className="font-semibold tabular-nums text-foreground">{actual?.toFixed(1) ?? '—'}%</span>
        </span>
        {actual !== undefined && (
          <span className={cn(
            'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide',
            achieved
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-red-100 text-red-700',
          )}>
            {achieved ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
            {achieved ? `+${(actual - target).toFixed(1)}` : `−${(target - actual).toFixed(1)}`}
            {achieved ? ' achieved' : ' missed'}
          </span>
        )}
      </div>
    </div>
  );
}

function EditTargetsDialog({
  policy, onClose, onSave,
}: {
  policy: AdminSla | null;
  onClose: () => void;
  onSave: (id: string, frt: number, rst: number) => void;
}) {
  return (
    <Dialog open={!!policy} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>SLA targets — {policy?.name}</DialogTitle>
          <DialogDescription>
            Set the % of tickets you commit to handling within SLA. The agent workspace will badge each ticket as <strong className="text-emerald-600">achieved</strong> or <strong className="text-red-600">missed</strong> against these targets.
          </DialogDescription>
        </DialogHeader>
        {policy && (
          <TargetForm
            key={policy.id}
            initialFrt={policy.targets.firstResponseSla}
            initialRst={policy.targets.resolutionSla}
            onSubmit={(f, r) => onSave(policy.id, f, r)}
            onCancel={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function TargetForm({
  initialFrt, initialRst, onSubmit, onCancel,
}: {
  initialFrt: number; initialRst: number;
  onSubmit: (frt: number, rst: number) => void;
  onCancel: () => void;
}) {
  const [frt, setFrt] = useState(initialFrt);
  const [rst, setRst] = useState(initialRst);

  return (
    <>
      <div className="space-y-4 py-2">
        <TargetSlider label="First response SLA target" value={frt} onChange={setFrt} />
        <TargetSlider label="Resolution SLA target" value={rst} onChange={setRst} />
        <div className="rounded-md border bg-muted/30 p-3 text-[11px] text-muted-foreground">
          Industry benchmarks: <span className="font-semibold text-foreground">90%</span> is typical for B2B SaaS,
          <span className="ml-1 font-semibold text-foreground">95%+</span> for enterprise contracts.
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" className="bg-coral text-white hover:bg-coral-dark" onClick={() => onSubmit(frt, rst)}>
          Save targets
        </Button>
      </DialogFooter>
    </>
  );
}

function TargetSlider({
  label, value, onChange,
}: { label: string; value: number; onChange: (v: number) => void }) {
  const tone = value >= 95 ? 'text-emerald-600' : value >= 90 ? 'text-amber-600' : 'text-red-600';
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs">{label}</Label>
        <span className={cn('text-2xl font-bold tabular-nums', tone)}>{value}%</span>
      </div>
      <input
        type="range"
        min={50}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-coral"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  sub,
  tone,
  pct,
}: {
  label: string;
  value: number | string;
  sub: string;
  tone: 'success' | 'info';
  pct: number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <ProgressRing
          value={pct}
          size={56}
          strokeWidth={5}
          className={tone === 'success' ? 'text-emerald-500' : 'text-primary'}
        >
          <span className="text-[10px] font-semibold">
            {Math.round(pct)}%
          </span>
        </ProgressRing>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-bold tracking-tight">{value}</p>
          <p className="text-[10px] text-muted-foreground">{sub}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function SlaCell({
  priority,
  firstResponse,
  resolution,
}: {
  priority: 'urgent' | 'high' | 'medium' | 'low';
  firstResponse: string;
  resolution: string;
}) {
  const dotClass =
    priority === 'urgent'
      ? 'bg-red-500'
      : priority === 'high'
        ? 'bg-amber-500'
        : priority === 'medium'
          ? 'bg-blue-500'
          : 'bg-slate-400';

  return (
    <div className="rounded-md border bg-muted/20 p-2.5">
      <div className="flex items-center gap-1.5">
        <span className={cn('h-1.5 w-1.5 rounded-full', dotClass)} />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {priority}
        </span>
      </div>
      <div className="mt-1.5 space-y-1 text-[11px]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">First reply</span>
          <span className="font-medium">{firstResponse}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">Resolve</span>
          <span className="font-medium">{resolution}</span>
        </div>
      </div>
    </div>
  );
}

function EscalationStep({
  at,
  actions,
}: {
  at: string;
  actions: string[];
}) {
  return (
    <li className="flex gap-3 rounded-md border p-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700">
        {at}
      </div>
      <div className="flex-1">
        <p className="font-medium">SLA reaches {at} of allowed time</p>
        <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
          {actions.map((a) => (
            <li key={a} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3" />
              {a}
            </li>
          ))}
        </ul>
      </div>
      <Button variant="ghost" size="sm" className="self-start text-xs">
        Edit
      </Button>
    </li>
  );
}

function Tooltip({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <span title={label} className="inline-block">
      {children}
    </span>
  );
}
