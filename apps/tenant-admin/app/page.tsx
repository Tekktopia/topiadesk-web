'use client';

import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Plug,
  ShieldCheck,
  Users,
  Workflow,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ProgressRing,
  Sparkline,
  cn,
} from '@topiadesk/ui';
import {
  TENANT,
  adminAgents,
  adminAutomations,
  adminIntegrations,
  auditEvents,
} from '@/lib/mock-data';
import { initials } from '@/lib/format';

export default function AdminOverview() {
  const activeAgents = adminAgents.filter((a) => a.status === 'active').length;
  const seatPct = Math.round(
    (TENANT.seatsUsed / TENANT.seatsTotal) * 100,
  );
  const activeAutomations = adminAutomations.filter((a) => a.active).length;
  const connectedIntegrations = adminIntegrations.filter(
    (i) => i.status === 'connected',
  ).length;

  return (
    <div className="space-y-5 p-5 lg:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Admin overview
          </p>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            {TENANT.name} workspace
          </h1>
          <p className="text-sm text-muted-foreground">
            Health, usage, and recent admin activity at a glance.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/agents">
              <Users className="h-3 w-3" />
              Invite agent
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/settings">Open settings</Link>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Active agents"
          value={activeAgents}
          sub={`of ${TENANT.seatsTotal} seats`}
          trend={[18, 19, 21, 22, 22, 23, 24, 24]}
        />
        <Stat
          label="Automations active"
          value={activeAutomations}
          sub={`${adminAutomations.length - activeAutomations} drafts`}
          trend={[3, 3, 4, 4, 4, 5, 5, 4]}
          tone="success"
        />
        <Stat
          label="Integrations connected"
          value={connectedIntegrations}
          sub={`${adminIntegrations.length - connectedIntegrations} available`}
          trend={[3, 3, 4, 4, 4, 4, 4, 4]}
        />
        <Stat
          label="Tickets this month"
          value="1.2k"
          sub="+8% vs last month"
          trend={[820, 870, 910, 940, 1020, 1080, 1140, 1213]}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b py-3">
            <CardTitle className="text-sm">Operational health</CardTitle>
            <p className="text-xs text-muted-foreground">
              Things to keep an eye on as a tenant admin
            </p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
            <HealthCard
              tone="success"
              icon={ShieldCheck}
              title="MFA enrolment"
              metric={`${adminAgents.filter((a) => a.mfa).length}/${adminAgents.length}`}
              detail="agents have 2FA enabled"
              action="Enforce"
            />
            <HealthCard
              tone="warning"
              icon={AlertTriangle}
              title="Suspended accounts"
              metric={`${adminAgents.filter((a) => a.status === 'suspended').length}`}
              detail="account suspended — review access"
              action="Review"
            />
            <HealthCard
              tone="success"
              icon={CheckCircle2}
              title="Webhook deliveries"
              metric="99.4%"
              detail="success rate, last 7 days"
              action="View"
            />
            <HealthCard
              tone="info"
              icon={Plug}
              title="Pending invitations"
              metric={`${adminAgents.filter((a) => a.status === 'invited').length}`}
              detail="invitations awaiting acceptance"
              action="Manage"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b py-3">
            <CardTitle className="text-sm">Seat usage</CardTitle>
            <p className="text-xs text-muted-foreground">
              {TENANT.plan} plan ·{' '}
              <span className="font-medium">{TENANT.seatsUsed}/{TENANT.seatsTotal}</span>{' '}
              seats
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            <div className="flex items-center gap-5">
              <ProgressRing
                value={seatPct}
                size={88}
                strokeWidth={8}
                className={cn(
                  seatPct >= 90 && 'text-red-500',
                  seatPct >= 75 && seatPct < 90 && 'text-amber-500',
                  seatPct < 75 && 'text-emerald-500',
                )}
              >
                <div className="text-center">
                  <p className="text-base font-semibold">{seatPct}%</p>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
                    Used
                  </p>
                </div>
              </ProgressRing>
              <div className="space-y-1 text-xs">
                <p className="text-muted-foreground">
                  {TENANT.seatsTotal - TENANT.seatsUsed} seats free
                </p>
                <p className="text-muted-foreground">
                  Next renewal{' '}
                  <span className="font-medium text-foreground">2 Aug 2026</span>
                </p>
                <Button asChild variant="outline" size="sm" className="mt-2 h-7 text-xs">
                  <Link href="#">
                    <CreditCard className="h-3 w-3" />
                    Add seats
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
            <div>
              <CardTitle className="text-sm">Recent admin activity</CardTitle>
              <p className="text-xs text-muted-foreground">
                The last 7 actions taken against this tenant&rsquo;s configuration
              </p>
            </div>
            <Link
              href="/audit"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Audit log
              <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y">
              {auditEvents.slice(0, 5).map((e) => (
                <li key={e.id} className="flex items-start gap-3 px-4 py-2.5 text-sm">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                    {e.actor === 'System' ? 'SY' : initials(e.actor)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p>
                      <span className="font-medium">{e.actor}</span>{' '}
                      <span className="text-muted-foreground">{e.action}</span>{' '}
                      <span className="font-medium">{e.target}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {e.occurredAt}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b py-3">
            <CardTitle className="text-sm">Top automations</CardTitle>
            <p className="text-xs text-muted-foreground">
              Rules running in this tenant
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y">
              {adminAutomations.slice(0, 4).map((a) => (
                <li key={a.id}>
                  <Link
                    href="/automations"
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-muted/40"
                  >
                    <Workflow
                      className={cn(
                        'mt-0.5 h-4 w-4 shrink-0',
                        a.active ? 'text-emerald-600' : 'text-muted-foreground',
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium">{a.name}</p>
                        {a.dryRun && (
                          <Badge variant="outline" className="h-4 px-1.5 text-[9px]">
                            Dry-run
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {a.runs7d} runs / 7d · {a.lastRun}
                      </p>
                    </div>
                    <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  trend,
  tone = 'default',
}: {
  label: string;
  value: number | string;
  sub: string;
  trend: number[];
  tone?: 'default' | 'success';
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight">
              {value}
            </p>
            <p className="text-[11px] text-muted-foreground">{sub}</p>
          </div>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </div>
        <Sparkline
          data={trend}
          width={220}
          height={28}
          className={cn(
            'mt-2',
            tone === 'success' ? 'text-emerald-500' : 'text-primary',
          )}
        />
      </CardContent>
    </Card>
  );
}

function HealthCard({
  tone,
  icon: Icon,
  title,
  metric,
  detail,
  action,
}: {
  tone: 'success' | 'warning' | 'info';
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  metric: string;
  detail: string;
  action: string;
}) {
  const toneClass =
    tone === 'success'
      ? 'bg-emerald-50 text-emerald-700'
      : tone === 'warning'
        ? 'bg-amber-50 text-amber-700'
        : 'bg-blue-50 text-blue-700';
  return (
    <div className="flex items-start gap-3 rounded-lg border p-3">
      <div
        className={cn(
          'grid h-9 w-9 shrink-0 place-items-center rounded-md',
          toneClass,
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
        <p className="mt-0.5 text-sm">
          <span className="text-base font-bold">{metric}</span>{' '}
          <span className="text-muted-foreground">{detail}</span>
        </p>
      </div>
      <button
        type="button"
        className="rounded-md border border-input bg-card px-2 py-1 text-[10px] font-medium hover:bg-muted"
      >
        {action}
      </button>
    </div>
  );
}
