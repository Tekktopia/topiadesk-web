'use client';

import { use, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Brain,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Cpu,
  GraduationCap,
  KeyRound,
  Laptop,
  Lock,
  Mail,
  Send,
  Shield,
  ShieldCheck,
  User,
  UserCheck,
  UserPlus,
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
  useOrgBranches,
  useOrgDepartments,
  useOrgRoleTemplates,
} from '@/lib/queries';
import type {
  OrgRoleTemplate,
  OnboardingTaskCategory,
  SecurityLevel,
} from '@/lib/mock-data';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function securityColor(level: SecurityLevel) {
  if (level <= 1) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (level === 2) return 'text-blue-600 bg-blue-50 border-blue-200';
  if (level === 3) return 'text-amber-600 bg-amber-50 border-amber-200';
  if (level === 4) return 'text-orange-600 bg-orange-50 border-orange-200';
  return 'text-red-600 bg-red-50 border-red-200';
}

function securityLabel(level: SecurityLevel) {
  return ['', 'Public', 'Internal', 'Confidential', 'Restricted', 'Top Secret'][level];
}

const CATEGORY_META: Record<OnboardingTaskCategory, { label: string; icon: typeof Zap; color: string; bg: string }> = {
  asset:    { label: 'Hardware & assets',   icon: Laptop,        color: 'text-blue-600',    bg: 'bg-blue-50'    },
  software: { label: 'Software & licences', icon: Boxes,         color: 'text-indigo-600',  bg: 'bg-indigo-50'  },
  access:   { label: 'Access & permissions',icon: KeyRound,      color: 'text-coral',  bg: 'bg-coral/8'  },
  training: { label: 'Training',            icon: GraduationCap, color: 'text-amber-600',   bg: 'bg-amber-50'   },
  security: { label: 'Security setup',      icon: Lock,          color: 'text-red-600',     bg: 'bg-red-50'     },
  admin:    { label: 'HR & admin',          icon: UserCheck,     color: 'text-emerald-600', bg: 'bg-emerald-50' },
};

const CATEGORY_ORDER: OnboardingTaskCategory[] = ['asset', 'software', 'access', 'training', 'security', 'admin'];

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = [
  { n: 1, label: 'Employee details' },
  { n: 2, label: 'Role & placement' },
  { n: 3, label: 'Review checklist' },
  { n: 4, label: 'Confirm & send' },
];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((s, i) => {
        const done   = s.n < current;
        const active = s.n === current;
        return (
          <div key={s.n} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors',
                done   ? 'border-violet-600 bg-coral text-white'
                       : active ? 'border-violet-600 bg-white text-coral'
                                : 'border-border bg-white text-muted-foreground'
              )}>
                {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : s.n}
              </div>
              <span className={cn('hidden text-[10px] font-semibold uppercase tracking-wide sm:block', active ? 'text-coral' : done ? 'text-coral-light' : 'text-muted-foreground')}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('mx-1 h-0.5 flex-1 rounded-full transition-colors', done ? 'bg-coral' : 'bg-border')} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1 — Employee details ────────────────────────────────────────────────

interface EmployeeForm {
  firstName: string;
  lastName:  string;
  email:     string;
  startDate: string;
  manager:   string;
  personalEmail: string;
}

function Step1({
  form,
  setForm,
  onNext,
}: {
  form: EmployeeForm;
  setForm: (f: EmployeeForm) => void;
  onNext: () => void;
}) {
  const valid = form.firstName && form.lastName && form.email && form.startDate;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First name" required>
          <input
            className={inputCls}
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            placeholder="e.g. John"
          />
        </Field>
        <Field label="Last name" required>
          <input
            className={inputCls}
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            placeholder="e.g. Adesanya"
          />
        </Field>
        <Field label="Work email" required hint="Will be created automatically">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className={cn(inputCls, 'pl-9')}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="john.adesanya@company.com"
              type="email"
            />
          </div>
        </Field>
        <Field label="Personal email" hint="For pre-start communication">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className={cn(inputCls, 'pl-9')}
              value={form.personalEmail}
              onChange={(e) => setForm({ ...form, personalEmail: e.target.value })}
              placeholder="personal@gmail.com"
              type="email"
            />
          </div>
        </Field>
        <Field label="Start date" required>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className={cn(inputCls, 'pl-9')}
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              type="date"
            />
          </div>
        </Field>
        <Field label="Reporting manager">
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className={cn(inputCls, 'pl-9')}
              value={form.manager}
              onChange={(e) => setForm({ ...form, manager: e.target.value })}
              placeholder="Manager name"
            />
          </div>
        </Field>
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={onNext} disabled={!valid} className="bg-coral hover:bg-coral-dark text-white">
          Next <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── Step 2 — Role & Placement ────────────────────────────────────────────────

interface PlacementForm {
  roleId:     string;
  branchId:   string;
  departmentId: string;
}

function Step2({
  placement,
  setPlacement,
  templates,
  onNext,
  onBack,
}: {
  placement: PlacementForm;
  setPlacement: (p: PlacementForm) => void;
  templates: OrgRoleTemplate[];
  onNext: () => void;
  onBack: () => void;
}) {
  const { data: branches }    = useOrgBranches();
  const { data: departments } = useOrgDepartments();

  const selectedRole = useMemo(
    () => templates.find((t) => t.id === placement.roleId),
    [templates, placement.roleId],
  );

  const valid = placement.roleId && placement.branchId;

  return (
    <div className="space-y-6">
      {/* Role picker */}
      <div>
        <p className="mb-2 text-sm font-semibold text-foreground">Select role <span className="text-red-500">*</span></p>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => setPlacement({ ...placement, roleId: tpl.id, departmentId: tpl.departmentId })}
              className={cn(
                'rounded-xl border p-3.5 text-left transition-all',
                placement.roleId === tpl.id
                  ? 'border-coral bg-coral/8 ring-2 ring-coral/40 ring-offset-1'
                  : 'border-border bg-white hover:border-coral/25 hover:bg-coral/8/50',
              )}
            >
              <div className="flex items-start justify-between gap-1 mb-2">
                <p className="text-sm font-semibold text-foreground leading-tight">{tpl.title}</p>
                <span className={cn('shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-bold', securityColor(tpl.securityLevel))}>
                  L{tpl.securityLevel}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground capitalize">{tpl.level} · {tpl.tasks.length} tasks</p>
              {placement.roleId === tpl.id && (
                <CheckCircle2 className="mt-2 h-3.5 w-3.5 text-coral" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Branch picker */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Branch / office" required>
          <select
            className={selectCls}
            value={placement.branchId}
            onChange={(e) => setPlacement({ ...placement, branchId: e.target.value })}
          >
            <option value="">Select a branch…</option>
            {(branches ?? []).map((b) => (
              <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
            ))}
          </select>
        </Field>
        <Field label="Department" hint="Auto-filled from role">
          <select
            className={selectCls}
            value={placement.departmentId}
            onChange={(e) => setPlacement({ ...placement, departmentId: e.target.value })}
          >
            <option value="">Select department…</option>
            {(departments ?? []).map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* Smart preview panel */}
      {selectedRole && (
        <Card className="border-coral/15 bg-linear-to-br from-coral/5 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Brain className="h-4 w-4 text-coral" />
              Smart preview — {selectedRole.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Security:</span>
                <span className={cn('rounded-full border px-2 py-0.5 text-xs font-semibold', securityColor(selectedRole.securityLevel))}>
                  Level {selectedRole.securityLevel} — {securityLabel(selectedRole.securityLevel)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{selectedRole.tasks.filter((t) => t.canAutomate).length} tasks can be automated</span>
              </div>
            </div>

            {/* Approval chain */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Approval chain</p>
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedRole.approvalChain.map((step, i) => (
                  <div key={step.approverRole} className="flex items-center gap-1.5">
                    {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />}
                    <span className={cn(
                      'rounded-lg border px-2.5 py-1 text-xs font-medium',
                      step.minSecurityLevel
                        ? 'border-red-200 bg-red-50 text-red-700'
                        : 'border-border bg-white text-foreground',
                    )}>
                      {step.approverRole}
                      {step.minSecurityLevel && <Shield className="ml-1 inline h-3 w-3" />}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Task count by category */}
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {CATEGORY_ORDER.map((cat) => {
                const m = CATEGORY_META[cat];
                const Icon = m.icon;
                const count = selectedRole.tasks.filter((t) => t.category === cat).length;
                if (count === 0) return null;
                return (
                  <div key={cat} className={cn('flex flex-col items-center rounded-lg p-2 text-center', m.bg)}>
                    <Icon className={cn('h-4 w-4 mb-1', m.color)} />
                    <p className="text-xs font-bold text-foreground tabular-nums">{count}</p>
                    <p className={cn('text-[10px] font-medium', m.color)}>{m.label.split(' ')[0]}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack}><ArrowLeft className="mr-1.5 h-4 w-4" /> Back</Button>
        <Button onClick={onNext} disabled={!valid} className="bg-coral hover:bg-coral-dark text-white">
          Next <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── Step 3 — Review checklist ────────────────────────────────────────────────

function Step3({
  employee,
  placement,
  templates,
  onNext,
  onBack,
}: {
  employee: EmployeeForm;
  placement: PlacementForm;
  templates: OrgRoleTemplate[];
  onNext: () => void;
  onBack: () => void;
}) {
  const role = templates.find((t) => t.id === placement.roleId);
  if (!role) return null;

  const tasksByCategory = CATEGORY_ORDER.map((cat) => ({
    cat,
    meta: CATEGORY_META[cat],
    tasks: role.tasks.filter((t) => t.category === cat),
  })).filter((g) => g.tasks.length > 0);

  return (
    <div className="space-y-6">
      {/* Summary banner */}
      <div className="rounded-xl border border-coral/25 bg-coral/8 px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-coral" />
            <strong>{employee.firstName} {employee.lastName}</strong>
          </span>
          <span className="flex items-center gap-2 text-muted-foreground">
            <Zap className="h-4 w-4 text-coral" /> {role.title}
          </span>
          <span className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" /> Starts {employee.startDate || '(not set)'}
          </span>
          <span className={cn('rounded-full border px-2 py-0.5 text-xs font-semibold', securityColor(role.securityLevel))}>
            Security L{role.securityLevel}
          </span>
        </div>
      </div>

      {/* Task checklist grouped by category */}
      <div className="space-y-4">
        {tasksByCategory.map(({ cat, meta, tasks }) => {
          const Icon = meta.icon;
          const automated = tasks.filter((t) => t.canAutomate).length;
          return (
            <Card key={cat}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className={cn('flex h-6 w-6 items-center justify-center rounded-md', meta.bg)}>
                      <Icon className={cn('h-3.5 w-3.5', meta.color)} />
                    </span>
                    {meta.label}
                    <Badge variant="secondary" className="tabular-nums text-[10px]">{tasks.length}</Badge>
                  </span>
                  {automated > 0 && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                      <Zap className="h-3 w-3" />{automated} automated
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="divide-y divide-border/60">
                  {tasks.map((task) => (
                    <li key={task.id} className="flex items-start justify-between gap-3 py-2.5">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 h-4 w-4 shrink-0 rounded border-2 border-border bg-muted/30" />
                        <div>
                          <p className="text-sm text-foreground">{task.title}</p>
                          <p className="text-xs text-muted-foreground">{task.assignedTeam} · Day +{task.dueDaysFromStart}</p>
                        </div>
                      </div>
                      {task.canAutomate && (
                        <span className="shrink-0 flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600">
                          <Zap className="h-2.5 w-2.5" />Auto
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Approval chain review */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-coral" /> Approval chain
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col gap-2">
            {role.approvalChain.map((step, i) => (
              <div key={step.approverRole} className="flex items-center gap-3">
                <div className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold',
                  'border-coral/25 bg-coral/8 text-coral',
                )}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-foreground">{step.approverRole}</span>
                  {step.minSecurityLevel && (
                    <span className="ml-2 rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-600">
                      Requires L{step.minSecurityLevel}+ clearance
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack}><ArrowLeft className="mr-1.5 h-4 w-4" /> Back</Button>
        <Button onClick={onNext} className="bg-coral hover:bg-coral-dark text-white">
          Confirm & send for approval <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── Step 4 — Confirm & send ──────────────────────────────────────────────────

function Step4({
  employee,
  placement,
  templates,
  onBack,
}: {
  employee: EmployeeForm;
  placement: PlacementForm;
  templates: OrgRoleTemplate[];
  onBack: () => void;
}) {
  const router  = useRouter();
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const role = templates.find((t) => t.id === placement.roleId);

  async function handleSend() {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSending(false);
    setSent(true);
    setTimeout(() => router.push('/onboarding'), 1500);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Onboarding submitted!</h2>
        <p className="mt-1 text-muted-foreground">Redirecting to the onboarding hub…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-muted/20 p-5 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Summary</p>
        {[
          ['Employee',  `${employee.firstName} ${employee.lastName}`],
          ['Work email', employee.email],
          ['Start date', employee.startDate],
          ['Manager',   employee.manager || '(not specified)'],
          ['Role',      role?.title ?? '—'],
          ['Security level', role ? `Level ${role.securityLevel} — ${securityLabel(role.securityLevel)}` : '—'],
          ['Tasks',     role ? `${role.tasks.length} tasks (${role.tasks.filter((t) => t.canAutomate).length} automated)` : '—'],
          ['Approvers', role ? `${role.approvalChain.length} approvers` : '—'],
        ].map(([label, value]) => (
          <div key={label} className="flex items-start justify-between gap-4 border-b border-border/50 pb-2 last:border-0 last:pb-0">
            <span className="text-xs font-semibold text-muted-foreground">{label}</span>
            <span className="text-sm text-foreground text-right">{value}</span>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-coral/25 bg-coral/8 px-4 py-3 text-sm text-coral-dark">
        <div className="flex gap-2">
          <Brain className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
          <div>
            <p className="font-semibold">What happens next</p>
            <ul className="mt-1 space-y-0.5 text-xs text-coral">
              <li>1. Approval requests sent to the full chain automatically</li>
              <li>2. Hardware ordered once HR approves</li>
              <li>3. Software provisioned automatically on approval</li>
              <li>4. New employee notified via personal email before start</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack} disabled={sending}><ArrowLeft className="mr-1.5 h-4 w-4" /> Back</Button>
        <Button onClick={handleSend} disabled={sending} className="bg-coral hover:bg-coral-dark text-white min-w-36">
          {sending
            ? <span className="flex items-center gap-2"><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />Submitting…</span>
            : <span className="flex items-center gap-2"><Send className="h-4 w-4" />Send for approval</span>
          }
        </Button>
      </div>
    </div>
  );
}

// ─── Field + Input helpers ────────────────────────────────────────────────────

const inputCls  = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral transition-colors';
const selectCls = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral transition-colors';

function Field({ label, children, required, hint }: { label: string; children: React.ReactNode; required?: boolean; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1 text-sm font-semibold text-foreground">
        {label}{required && <span className="text-red-500">*</span>}
        {hint && <span className="ml-1 text-xs font-normal text-muted-foreground">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewOnboardingPage() {
  const searchParams  = useSearchParams();
  const preselectedRole = searchParams.get('role') ?? '';

  const { data: templates = [], isPending } = useOrgRoleTemplates();

  const [step, setStep] = useState(1);
  const [employee, setEmployee] = useState<EmployeeForm>({
    firstName: '', lastName: '', email: '', startDate: '', manager: '', personalEmail: '',
  });
  const [placement, setPlacement] = useState<PlacementForm>({
    roleId: preselectedRole, branchId: '', departmentId: '',
  });

  return (
    <div className="mx-auto max-w-4xl space-y-0 p-6">
      {/* Header */}
      <div className="relative -mx-6 -mt-6 mb-8 overflow-hidden bg-navy px-6 py-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.1),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative">
          <Link href="/onboarding" className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white/90 transition-colors">
            <ArrowLeft className="h-3 w-3" /> Onboarding
          </Link>
          <div className="mt-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">New onboarding</h1>
            <p className="mt-0.5 text-sm text-white/70">Select a role — Topiadesk prepares everything automatically.</p>
          </div>
        </div>
      </div>

      {isPending ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : (
        <>
          <StepBar current={step} />
          {step === 1 && <Step1 form={employee}     setForm={setEmployee}   onNext={() => setStep(2)} />}
          {step === 2 && <Step2 placement={placement} setPlacement={setPlacement} templates={templates} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <Step3 employee={employee} placement={placement} templates={templates} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
          {step === 4 && <Step4 employee={employee} placement={placement} templates={templates} onBack={() => setStep(3)} />}
        </>
      )}
    </div>
  );
}
