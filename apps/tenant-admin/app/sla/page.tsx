'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  Plus,
  Search,
  Timer,
  ToggleLeft,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  ProgressRing,
  cn,
} from '@topiadesk/ui';
import { adminSlas } from '@/lib/mock-data';

export default function SlaPage() {
  const [search, setSearch] = useState('');
  const filtered = adminSlas.filter(
    (s) =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.appliesTo.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-5 p-5 lg:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Ticketing
          </p>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            SLA policies
          </h1>
          <p className="text-sm text-muted-foreground">
            Define first-response and resolution targets by priority. Policies
            are evaluated top-to-bottom &mdash; the first matching policy wins.
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-3 w-3" />
          New SLA policy
        </Button>
      </header>

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
          value={adminSlas.filter((s) => s.active).length}
          sub={`${adminSlas.length} total`}
          tone="success"
          pct={
            (adminSlas.filter((s) => s.active).length / adminSlas.length) * 100
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
            {filtered.length} of {adminSlas.length}
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
