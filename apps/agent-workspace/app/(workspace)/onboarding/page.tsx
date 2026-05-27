'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Boxes,
  Brain,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  KeyRound,
  Laptop,
  Lock,
  Plus,
  Shield,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  cn,
} from '@topiadesk/ui';
import {
  useOnboardings,
  useOrgMetrics,
  useOrgRoleTemplates,
} from '@/lib/queries';
import type { OnboardingRequest, OnboardingStatus, OrgRoleTemplate, SecurityLevel } from '@/lib/mock-data';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function statusMeta(s: OnboardingStatus) {
  switch (s) {
    case 'pending-approval': return { label: 'Pending approval', cls: 'bg-amber-50 text-amber-700 border-amber-200',      dot: 'bg-amber-400' };
    case 'approved':         return { label: 'Approved',         cls: 'bg-blue-50 text-blue-700 border-blue-200',          dot: 'bg-blue-400' };
    case 'in-progress':      return { label: 'In progress',      cls: 'bg-coral/8 text-coral-dark border-coral/25',    dot: 'bg-coral/80' };
    case 'completed':        return { label: 'Completed',        cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
    case 'blocked':          return { label: 'Blocked',          cls: 'bg-red-50 text-red-700 border-red-200',             dot: 'bg-red-500' };
  }
}

function securityColor(level: SecurityLevel) {
  if (level <= 1) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (level === 2) return 'text-blue-600 bg-blue-50 border-blue-200';
  if (level === 3) return 'text-amber-600 bg-amber-50 border-amber-200';
  if (level === 4) return 'text-orange-600 bg-orange-50 border-orange-200';
  return 'text-red-600 bg-red-50 border-red-200';
}

function taskProgress(onb: OnboardingRequest) {
  const total = onb.tasks.length;
  const done  = onb.tasks.filter((t) => t.status === 'done').length;
  return { total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
}

function categoryIcon(cat: string) {
  switch (cat) {
    case 'asset':    return Laptop;
    case 'software': return Boxes;
    case 'access':   return KeyRound;
    case 'training': return GraduationCap;
    case 'security': return Lock;
    case 'admin':    return UserCheck;
    default:         return Zap;
  }
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  tone = 'default',
}: {
  label: string;
  value: number | string;
  sub?: string;
  icon: typeof Users;
  tone?: 'default' | 'emerald' | 'amber' | 'red' | 'violet';
}) {
  const tones = {
    default: 'from-navy to-navy-mid',
    emerald: 'from-emerald-500 to-emerald-700',
    amber:   'from-amber-500 to-amber-600',
    red:     'from-red-500 to-red-600',
    violet:  'from-coral to-coral-dark',
  };
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-1 text-3xl font-bold text-foreground tabular-nums">{value}</p>
            {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
          </div>
          <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br shadow-sm', tones[tone])}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Onboarding card ──────────────────────────────────────────────────────────

function OnboardingCard({ onb }: { onb: OnboardingRequest }) {
  const st = statusMeta(onb.status);
  const { done, total, pct } = taskProgress(onb);
  const blocked = onb.tasks.filter((t) => t.status === 'blocked').length;

  return (
    <Link href={`/onboarding/${onb.id}`}>
      <Card className="group cursor-pointer transition-shadow hover:shadow-md">
        <CardContent className="p-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-coral/8">
                <UserPlus className="h-5 w-5 text-coral" />
              </div>
              <div>
                <p className="font-semibold text-foreground leading-tight">{onb.employeeName}</p>
                <p className="text-xs text-muted-foreground">{onb.roleTitle}</p>
              </div>
            </div>
            <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold shrink-0', st.cls)}>
              <span className={cn('h-1.5 w-1.5 rounded-full', st.dot)} />
              {st.label}
            </span>
          </div>

          {/* Meta */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Building2 className="h-3 w-3" />{onb.departmentName}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />Start {fmtDate(onb.startDate)}
            </span>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{done} / {total} tasks</span>
              <span className="font-semibold text-foreground">{pct}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn('h-full rounded-full transition-all', pct === 100 ? 'bg-emerald-500' : 'bg-coral/80')}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {blocked > 0 && (
                <span className="flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-600">
                  <Shield className="h-2.5 w-2.5" />{blocked} blocked
                </span>
              )}
              {onb.approvals.some((a) => a.status === 'pending') && (
                <span className="flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600">
                  <Clock className="h-2.5 w-2.5" />Awaiting approval
                </span>
              )}
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// ─── Role template card ───────────────────────────────────────────────────────

const CATEGORY_ORDER = ['asset', 'software', 'access', 'training', 'security', 'admin'] as const;

function RoleTemplateCard({ tpl }: { tpl: OrgRoleTemplate }) {
  const tasksByCategory = CATEGORY_ORDER.map((cat) => ({
    cat,
    count: tpl.tasks.filter((t) => t.category === cat).length,
  })).filter((c) => c.count > 0);

  return (
    <Link href={`/onboarding/new?role=${tpl.id}`}>
      <Card className="group cursor-pointer transition-shadow hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground leading-tight">{tpl.title}</p>
              <p className="text-xs text-muted-foreground capitalize">{tpl.level} · {tpl.departmentId.replace('dept-', '')}</p>
            </div>
            <span className={cn('shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold tabular-nums', securityColor(tpl.securityLevel))}>
              L{tpl.securityLevel}
            </span>
          </div>

          {/* Category breakdown */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tasksByCategory.map(({ cat, count }) => {
              const Icon = categoryIcon(cat);
              return (
                <span key={cat} className="flex items-center gap-1 rounded-md border border-border bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground capitalize">
                  <Icon className="h-2.5 w-2.5" />{count} {cat}
                </span>
              );
            })}
          </div>

          {/* Approval chain preview */}
          <div className="mt-3 flex items-center gap-1 overflow-hidden">
            {tpl.approvalChain.slice(0, 4).map((step, i) => (
              <div key={step.approverRole} className="flex items-center gap-1 min-w-0">
                {i > 0 && <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/40" />}
                <span className="truncate rounded bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{step.approverRole}</span>
              </div>
            ))}
            {tpl.approvalChain.length > 4 && (
              <span className="text-[10px] text-muted-foreground/60">+{tpl.approvalChain.length - 4}</span>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>{tpl.tasks.length} tasks · {tpl.approvalChain.length} approvers</span>
            <span className="flex items-center gap-1 font-medium text-coral opacity-0 transition-opacity group-hover:opacity-100">
              Use template <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OnboardingHubPage() {
  const { data: metrics,   isPending: metricsLoading   } = useOrgMetrics();
  const { data: onboardings, isPending: onbLoading     } = useOnboardings();
  const { data: templates, isPending: templatesLoading } = useOrgRoleTemplates();

  const active    = onboardings?.filter((o) => o.status !== 'completed') ?? [];
  const completed = onboardings?.filter((o) => o.status === 'completed') ?? [];

  return (
    <div className="space-y-6 p-6">

      {/* ── Gradient header ── */}
      <div className="relative -mx-6 -mt-6 mb-1 overflow-hidden bg-navy px-6 py-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.1),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">Smart Onboarding</h1>
            </div>
            <p className="mt-1 text-sm text-white/70">
              Role-aware onboarding — assets, software, access, approvals and training prepared automatically.
            </p>
          </div>
          <Link href="/onboarding/new">
            <Button className="bg-coral text-white hover:bg-coral-dark font-semibold">
              <Plus className="mr-1.5 h-4 w-4" />
              New onboarding
            </Button>
          </Link>
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
        ) : metrics ? (
          <>
            <KpiCard label="Active onboardings"  value={metrics.activeOnboardings}  icon={UserPlus}    tone="violet"  sub="Currently running" />
            <KpiCard label="Pending approvals"   value={metrics.pendingApprovals}   icon={Clock}       tone="amber"   sub="Needs attention" />
            <KpiCard label="Completing this week" value={metrics.completingThisWeek} icon={CheckCircle2} tone="emerald" sub="Almost done" />
            <KpiCard label="Done this month"     value={metrics.completedThisMonth} icon={ShieldCheck} tone="default" sub={`Avg ${metrics.avgCompletionDays}d to complete`} />
          </>
        ) : null}
      </div>

      {/* ── What Topiadesk auto-prepares ── */}
      <Card className="border-coral/15 bg-linear-to-br from-coral/5 to-white">
        <CardContent className="p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-coral-dark">What gets prepared automatically</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { icon: Laptop,       label: 'Hardware assets',  desc: 'Laptop, peripherals, SIM' },
              { icon: Boxes,        label: 'Software licences', desc: 'All tools for the role' },
              { icon: KeyRound,     label: 'Access rights',    desc: 'Systems & permissions' },
              { icon: GraduationCap,label: 'Training',         desc: 'Certifications & courses' },
              { icon: Lock,         label: 'Security setup',   desc: 'MFA, YubiKey, policies' },
              { icon: UserCheck,    label: 'HR admin',         desc: 'Contracts, check-ins' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center rounded-lg border border-coral/15 bg-white p-3 text-center">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-coral/8">
                  <Icon className="h-4 w-4 text-coral" />
                </div>
                <p className="text-xs font-semibold text-foreground">{label}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Active onboardings ── */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Active onboardings</h2>
          <Badge variant="secondary" className="tabular-nums">{active.length}</Badge>
        </div>
        {onbLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
          </div>
        ) : active.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <UserPlus className="mb-2 h-8 w-8 text-muted-foreground/30" />
              <p className="font-medium text-foreground">No active onboardings</p>
              <p className="text-sm text-muted-foreground">Start one from a role template below.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {active.map((onb) => <OnboardingCard key={onb.id} onb={onb} />)}
          </div>
        )}
      </div>

      {/* ── Completed ── */}
      {completed.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Completed</h2>
            <Badge variant="secondary" className="tabular-nums">{completed.length}</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completed.map((onb) => <OnboardingCard key={onb.id} onb={onb} />)}
          </div>
        </div>
      )}

      {/* ── Role templates browser ── */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground">Role templates</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Select a role to auto-generate the full onboarding checklist.</p>
          </div>
        </div>
        {templatesLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(templates ?? []).map((tpl) => <RoleTemplateCard key={tpl.id} tpl={tpl} />)}
          </div>
        )}
      </div>

    </div>
  );
}
