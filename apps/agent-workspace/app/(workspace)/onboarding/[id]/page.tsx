'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Boxes,
  Brain,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  GraduationCap,
  KeyRound,
  Laptop,
  Lock,
  Mail,
  Shield,
  ShieldCheck,
  UserCheck,
  UserPlus,
  XCircle,
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
import { useOnboarding, useOrgRoleTemplate } from '@/lib/queries';
import type {
  OnboardingApproval,
  OnboardingStatus,
  OnboardingTaskCategory,
  OnboardingTaskItem,
  SecurityLevel,
} from '@/lib/mock-data';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function relTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  if (mins < 60)   return `${mins}m ago`;
  const hrs  = Math.floor(mins / 60);
  if (hrs < 24)    return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
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

const CATEGORY_META: Record<OnboardingTaskCategory, { label: string; icon: typeof Zap; color: string; bg: string }> = {
  asset:    { label: 'Hardware & assets',    icon: Laptop,        color: 'text-blue-600',    bg: 'bg-blue-50'    },
  software: { label: 'Software & licences',  icon: Boxes,         color: 'text-indigo-600',  bg: 'bg-indigo-50'  },
  access:   { label: 'Access & permissions', icon: KeyRound,      color: 'text-coral',  bg: 'bg-coral/8'  },
  training: { label: 'Training',             icon: GraduationCap, color: 'text-amber-600',   bg: 'bg-amber-50'   },
  security: { label: 'Security setup',       icon: Lock,          color: 'text-red-600',     bg: 'bg-red-50'     },
  admin:    { label: 'HR & admin',           icon: UserCheck,     color: 'text-emerald-600', bg: 'bg-emerald-50' },
};

const CATEGORY_ORDER: OnboardingTaskCategory[] = ['asset', 'software', 'access', 'training', 'security', 'admin'];

// ─── Approval chain stepper ───────────────────────────────────────────────────

function ApprovalChain({ approvals }: { approvals: OnboardingApproval[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <ShieldCheck className="h-4 w-4 text-coral" />
          Approval chain
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative space-y-0">
          {approvals.map((approval, i) => {
            const isLast = i === approvals.length - 1;
            return (
              <div key={approval.id} className="flex gap-3">
                {/* Timeline spine */}
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2',
                    approval.status === 'approved'
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : approval.status === 'rejected'
                        ? 'border-red-500 bg-red-500 text-white'
                        : 'border-border bg-white text-muted-foreground',
                  )}>
                    {approval.status === 'approved' ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : approval.status === 'rejected' ? (
                      <XCircle className="h-3.5 w-3.5" />
                    ) : (
                      <Clock className="h-3 w-3 animate-pulse" />
                    )}
                  </div>
                  {!isLast && (
                    <div className={cn('w-0.5 flex-1 my-1', approval.status === 'approved' ? 'bg-emerald-200' : 'bg-border')} style={{ minHeight: '1.5rem' }} />
                  )}
                </div>

                {/* Content */}
                <div className="pb-4 flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{approval.approverName}</p>
                      <p className="text-xs text-muted-foreground">{approval.approverRole}</p>
                    </div>
                    <Badge
                      variant={
                        approval.status === 'approved' ? 'default'
                        : approval.status === 'rejected' ? 'danger'
                        : 'secondary'
                      }
                      className={cn(
                        'shrink-0 text-[10px] border',
                        approval.status === 'approved'   ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : approval.status === 'rejected' ? 'border-red-200 bg-red-50 text-red-700'
                                                         : 'border-amber-200 bg-amber-50 text-amber-700',
                      )}
                    >
                      {approval.status === 'approved' ? 'Approved' : approval.status === 'rejected' ? 'Rejected' : 'Pending'}
                    </Badge>
                  </div>
                  {approval.respondedAt && (
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{relTime(approval.respondedAt)}</p>
                  )}
                  {approval.notes && (
                    <p className="mt-1.5 rounded-lg bg-muted/40 px-2.5 py-1.5 text-xs text-foreground italic">
                      "{approval.notes}"
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Task checklist section ───────────────────────────────────────────────────

function taskStatusMeta(s: OnboardingTaskItem['status']) {
  switch (s) {
    case 'done':        return { label: 'Done',        cls: 'border-emerald-200 bg-emerald-50 text-emerald-600',     dot: 'bg-emerald-500' };
    case 'in-progress': return { label: 'In progress', cls: 'border-blue-200 bg-blue-50 text-blue-600',              dot: 'bg-blue-400' };
    case 'blocked':     return { label: 'Blocked',     cls: 'border-red-200 bg-red-50 text-red-600',                 dot: 'bg-red-500' };
    case 'pending':     return { label: 'Pending',     cls: 'border-border bg-muted/40 text-muted-foreground',       dot: 'bg-muted-foreground' };
  }
}

function TaskChecklist({ tasks }: { tasks: OnboardingTaskItem[] }) {
  const tasksByCategory = CATEGORY_ORDER.map((cat) => ({
    cat,
    meta: CATEGORY_META[cat],
    tasks: tasks.filter((t) => t.category === cat),
  })).filter((g) => g.tasks.length > 0);

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  function toggle(cat: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  }

  return (
    <div className="space-y-3">
      {tasksByCategory.map(({ cat, meta, tasks: catTasks }) => {
        const Icon  = meta.icon;
        const done  = catTasks.filter((t) => t.status === 'done').length;
        const open  = !collapsed.has(cat);
        const hasBlocked = catTasks.some((t) => t.status === 'blocked');

        return (
          <Card key={cat}>
            <button
              type="button"
              onClick={() => toggle(cat)}
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className={cn('flex h-6 w-6 items-center justify-center rounded-md', meta.bg)}>
                  <Icon className={cn('h-3.5 w-3.5', meta.color)} />
                </span>
                <span className="text-sm font-semibold text-foreground">{meta.label}</span>
                <Badge variant="secondary" className="tabular-nums text-[10px]">{done}/{catTasks.length}</Badge>
                {hasBlocked && (
                  <span className="flex items-center gap-1 rounded border border-red-200 bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-600">
                    <Shield className="h-2.5 w-2.5" />Blocked
                  </span>
                )}
              </div>
              <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', !open && '-rotate-90')} />
            </button>

            {open && (
              <div className="border-t border-border">
                <ul className="divide-y divide-border/60 px-4">
                  {catTasks.map((task) => {
                    const ts = taskStatusMeta(task.status);
                    return (
                      <li key={task.id} className="flex items-start gap-3 py-3">
                        <div className={cn(
                          'mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border-2',
                          task.status === 'done'
                            ? 'border-emerald-500 bg-emerald-500'
                            : task.status === 'blocked'
                              ? 'border-red-400 bg-red-50'
                              : task.status === 'in-progress'
                                ? 'border-blue-400 bg-blue-50'
                                : 'border-border bg-white',
                        )}>
                          {task.status === 'done' && <CheckCircle2 className="h-2.5 w-2.5 text-white" />}
                          {task.status === 'blocked' && <Shield className="h-2.5 w-2.5 text-red-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn('text-sm', task.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground')}>
                              {task.title}
                            </p>
                            <div className="flex shrink-0 items-center gap-1.5">
                              {task.canAutomate && task.status !== 'done' && (
                                <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600">
                                  <Zap className="h-2.5 w-2.5" />Auto
                                </span>
                              )}
                              <span className={cn('rounded-full border px-1.5 py-0.5 text-[10px] font-semibold', ts.cls)}>
                                {ts.label}
                              </span>
                            </div>
                          </div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                            <span>{task.assignedTeam}</span>
                            <span>Due {fmtDate(task.dueDate)}</span>
                            {task.completedAt && <span className="text-emerald-600">Completed {relTime(task.completedAt)}</span>}
                          </div>
                          {task.notes && (
                            <p className="mt-1.5 rounded-lg border border-amber-100 bg-amber-50 px-2.5 py-1 text-xs text-amber-700">
                              {task.notes}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OnboardingDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id }    = use(props.params);
  const { data: onb, isPending } = useOnboarding(id);
  const { data: roleTemplate }   = useOrgRoleTemplate(onb?.roleId ?? '');

  const st = onb ? statusMeta(onb.status) : null;

  const totalTasks  = onb?.tasks.length ?? 0;
  const doneTasks   = onb?.tasks.filter((t) => t.status === 'done').length ?? 0;
  const pct         = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const pendingApprovals = onb?.approvals.filter((a) => a.status === 'pending').length ?? 0;

  return (
    <div className="space-y-5 p-6">

      {/* ── Gradient header ── */}
      <div className="relative -mx-6 -mt-6 mb-1 overflow-hidden bg-navy px-6 py-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.1),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative">
          <Link href="/onboarding" className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white/90 transition-colors">
            <ArrowLeft className="h-3 w-3" /> Onboarding
          </Link>

          {isPending ? (
            <div className="mt-2 space-y-1.5">
              <Skeleton className="h-7 w-48 bg-white/20" />
              <Skeleton className="h-4 w-64 bg-white/10" />
            </div>
          ) : onb ? (
            <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-white">{onb.employeeName}</h1>
                  <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold', st?.cls)}>
                    <span className={cn('h-1.5 w-1.5 rounded-full', st?.dot)} />
                    {st?.label}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-white/70">
                  {onb.roleTitle} · {onb.departmentName} · {onb.branchName}
                </p>
                {/* Progress bar */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-1.5 w-48 overflow-hidden rounded-full bg-white/20">
                    <div className="h-full rounded-full bg-white/80 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-white/80">{doneTasks}/{totalTasks} tasks · {pct}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {pendingApprovals > 0 && (
                  <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                    <Clock className="h-3.5 w-3.5" />{pendingApprovals} approval{pendingApprovals !== 1 ? 's' : ''} pending
                  </span>
                )}
                <Button size="sm" className="bg-coral text-white hover:bg-coral-dark font-semibold">
                  <Mail className="mr-1.5 h-3.5 w-3.5" />Notify employee
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-white/70">Onboarding not found.</p>
          )}
        </div>
      </div>

      {/* Not found */}
      {!onb && !isPending && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <UserPlus className="mb-2 h-8 w-8 text-muted-foreground/30" />
            <p className="font-medium text-foreground">Onboarding not found</p>
            <Link href="/onboarding" className="mt-3">
              <Button size="sm" variant="outline">Back to onboarding</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {(isPending || onb) && (
        <div className="grid gap-5 lg:grid-cols-3">

          {/* ── Main column: approval chain + tasks ── */}
          <div className="space-y-5 lg:col-span-2">
            {isPending ? (
              <Skeleton className="h-48 rounded-xl" />
            ) : onb ? (
              <ApprovalChain approvals={onb.approvals} />
            ) : null}

            {/* Task checklist */}
            <div>
              <p className="mb-3 text-sm font-semibold text-foreground">Onboarding checklist</p>
              {isPending ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
                </div>
              ) : onb ? (
                <TaskChecklist tasks={onb.tasks} />
              ) : null}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">

            {/* Employee info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Employee</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {isPending ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i}><Skeleton className="mb-1 h-3 w-20" /><Skeleton className="h-4 w-36" /></div>
                  ))
                ) : onb ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-coral/8">
                        <UserPlus className="h-5 w-5 text-coral" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{onb.employeeName}</p>
                        <p className="text-xs text-muted-foreground">{onb.employeeEmail}</p>
                      </div>
                    </div>
                    {[
                      { icon: Building2,   label: 'Department', value: onb.departmentName },
                      { icon: Building2,   label: 'Branch',     value: onb.branchName     },
                      { icon: Calendar,    label: 'Start date', value: fmtDate(onb.startDate) },
                      { icon: UserCheck,   label: 'Manager',    value: onb.managerName     },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-2">
                        <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                          <p className="text-sm text-foreground">{value}</p>
                        </div>
                      </div>
                    ))}
                  </>
                ) : null}
              </CardContent>
            </Card>

            {/* Role summary */}
            {onb && roleTemplate && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Brain className="h-4 w-4 text-coral" />
                    Role profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">{roleTemplate.title}</p>
                    <span className={cn('rounded-full border px-2 py-0.5 text-xs font-bold', securityColor(roleTemplate.securityLevel))}>
                      L{roleTemplate.securityLevel}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(roleTemplate.requiredSoftware ?? []).slice(0, 6).map((sw) => (
                      <span key={sw} className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{sw}</span>
                    ))}
                    {(roleTemplate.requiredSoftware ?? []).length > 6 && (
                      <span className="text-[10px] text-muted-foreground">+{(roleTemplate.requiredSoftware ?? []).length - 6} more</span>
                    )}
                  </div>
                  <div className="border-t border-border/60 pt-2 space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Required training</p>
                    {(roleTemplate.requiredTraining ?? []).slice(0, 3).map((tr) => (
                      <p key={tr} className="flex items-center gap-1.5 text-xs text-foreground">
                        <GraduationCap className="h-3 w-3 text-amber-500 shrink-0" />{tr}
                      </p>
                    ))}
                    {(roleTemplate.requiredTraining ?? []).length > 3 && (
                      <p className="text-xs text-muted-foreground">+{(roleTemplate.requiredTraining ?? []).length - 3} more</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick stats */}
            {onb && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Progress breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {CATEGORY_ORDER.map((cat) => {
                    const catTasks = onb.tasks.filter((t) => t.category === cat);
                    if (catTasks.length === 0) return null;
                    const m = CATEGORY_META[cat];
                    const Icon = m.icon;
                    const done = catTasks.filter((t) => t.status === 'done').length;
                    const catPct = Math.round((done / catTasks.length) * 100);
                    return (
                      <div key={cat} className="flex items-center gap-2">
                        <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded', m.bg)}>
                          <Icon className={cn('h-3 w-3', m.color)} />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between text-[10px] mb-0.5">
                            <span className="text-muted-foreground capitalize">{cat}</span>
                            <span className="font-semibold text-foreground tabular-nums">{done}/{catTasks.length}</span>
                          </div>
                          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn('h-full rounded-full', catPct === 100 ? 'bg-emerald-500' : m.color.replace('text-', 'bg-'))}
                              style={{ width: `${catPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            {onb && onb.status !== 'completed' && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <Button variant="outline" className="w-full justify-start text-sm" size="sm">
                    <Mail className="mr-2 h-3.5 w-3.5" />Send welcome email
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm" size="sm">
                    <Zap className="mr-2 h-3.5 w-3.5" />Run automated tasks
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm" size="sm">
                    <ShieldCheck className="mr-2 h-3.5 w-3.5" />Nudge pending approvers
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700" size="sm">
                    <XCircle className="mr-2 h-3.5 w-3.5" />Cancel onboarding
                  </Button>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
