'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  CheckCheck,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Headset,
  Info,
  KeyRound,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
  User,
  UserCog,
  UserPlus,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
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
import { ROLE_META, TENANT_ROLES, useRole, type TenantRole } from '@/lib/role-context';
import { adminAgents } from '@/lib/mock-data';

// ─── Role metadata + cosmetic helpers ────────────────────────────────────────

const ROLE_ICONS: Record<TenantRole, typeof UserCog> = {
  tenant_admin: ShieldCheck,
  manager:      UserCog,
  agent:        Headset,
  viewer:       User,
};

const ROLE_PERMS: Record<TenantRole, { label: string; granted: boolean }[]> = {
  tenant_admin: [
    { label: 'Manage tenant settings, branding & business hours', granted: true },
    { label: 'Create / edit / disable agents in any group',       granted: true },
    { label: 'Edit SLA policies, automations, ticket fields',     granted: true },
    { label: 'Configure channels & integrations',                  granted: true },
    { label: 'Run data migration from other helpdesks',           granted: true },
    { label: 'View audit log',                                     granted: true },
  ],
  manager: [
    { label: 'Manage agents within own group',                    granted: true },
    { label: 'Edit SLA policies, automations, ticket fields',     granted: true },
    { label: 'View tenant settings, branding & business hours',   granted: true },
    { label: 'Create new agents',                                  granted: false },
    { label: 'Edit tenant-wide settings or branding',             granted: false },
    { label: 'Run data migration',                                 granted: false },
  ],
  agent: [
    { label: 'Handle tickets in the agent workspace',             granted: true },
    { label: 'View SLA targets and automations they\'re held to', granted: true },
    { label: 'Read team list',                                     granted: true },
    { label: 'Edit any tenant configuration',                     granted: false },
    { label: 'Manage other agents',                                granted: false },
  ],
  viewer: [
    { label: 'Read tickets, dashboards and reports',              granted: true },
    { label: 'Read every configuration page',                     granted: true },
    { label: 'Audit history & compliance reports',                granted: true },
    { label: 'Take any action that mutates data',                 granted: false },
  ],
};

const GROUP_OPTIONS = [
  'Tier 1 Support',
  'Tier 2 Support',
  'Field Support',
  'IT Operations',
  'Security Ops',
  'Billing',
  'Identity & Access',
];

// Generate a memorable but secure password — 4 word-chunks + 4-digit number
function generatePassword(): string {
  const adjectives  = ['swift','calm','brave','sharp','bright','quiet','bold','keen','warm','cool'];
  const nouns       = ['lion','river','peak','grove','flame','wave','cloud','dawn','storm','breeze'];
  const a = adjectives[Math.floor(Math.random() * adjectives.length)]!;
  const n = nouns[Math.floor(Math.random() * nouns.length)]!;
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${a.charAt(0).toUpperCase()}${a.slice(1)}-${n.charAt(0).toUpperCase()}${n.slice(1)}-${num}`;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function NewAgentPage() {
  const { user, can } = useRole();
  const guarded = !can('create_agents');

  // Form state
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [role, setRole]         = useState<TenantRole>('agent');
  const [group, setGroup]       = useState<string>(user.group ?? GROUP_OPTIONS[0]!);
  const [password, setPassword] = useState(generatePassword);
  const [showPwd, setShowPwd]   = useState(false);
  const [sendInvite, setSendInvite] = useState(true);
  const [requireReset, setRequireReset] = useState(true);

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [createdAgent, setCreatedAgent] = useState<null | {
    name: string; email: string; password: string; role: TenantRole; group: string;
  }>(null);

  const initials = useMemo(
    () => name.split(' ').map((s) => s.charAt(0).toUpperCase()).slice(0, 2).join(''),
    [name],
  );

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailTaken = adminAgents.some((a) => a.email.toLowerCase() === email.toLowerCase());
  const formValid  = name.trim() && emailValid && !emailTaken;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid) return;
    setSubmitting(true);
    // Simulate API call
    window.setTimeout(() => {
      setCreatedAgent({ name: name.trim(), email: email.trim(), password, role, group });
      setSubmitting(false);
    }, 700);
  };

  const reset = () => {
    setCreatedAgent(null);
    setName(''); setEmail(''); setRole('agent');
    setGroup(user.group ?? GROUP_OPTIONS[0]!);
    setPassword(generatePassword());
    setShowPwd(false);
  };

  // ─── Guard: only tenant_admins can hit this page ──────────────────────────
  if (guarded) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-3 p-8">
        <Lock className="h-10 w-10 text-muted-foreground/40" />
        <h1 className="font-display text-xl font-bold">You don't have permission</h1>
        <p className="max-w-md text-center text-sm text-muted-foreground">
          Creating new agents is reserved for the Tenant Admin role. Ask your tenant admin to invite you, or switch your dev role from the top-right menu.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/agents"><ArrowLeft className="h-3 w-3" />Back to agents</Link>
        </Button>
      </div>
    );
  }

  // ─── Success screen ───────────────────────────────────────────────────────
  if (createdAgent) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
        <div className="shrink-0 p-5 pb-0">
          <header className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
            <div className="relative">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">People</p>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">Agent created</h1>
              <p className="mt-0.5 text-sm text-white/80">
                Share the credentials below — the agent will be prompted to change their password on first sign-in.
              </p>
            </div>
          </header>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-5">
          <div className="mx-auto max-w-xl space-y-4">
            <Card className="border-emerald-300">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-900">{createdAgent.name} has access</p>
                    <p className="text-[11px] text-emerald-800/80">
                      {sendInvite
                        ? `An email with login details has been sent to ${createdAgent.email}.`
                        : 'Account created without sending an email — share the credentials manually.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 rounded-lg border bg-background p-3 text-sm">
                  <CredRow label="Sign-in URL"  value={`https://workspace.topiadesk.com`} />
                  <CredRow label="Email"        value={createdAgent.email} />
                  <CredRow label="Temp password" value={createdAgent.password} mono />
                  <CredRow label="Role"         value={ROLE_META[createdAgent.role].label} />
                  <CredRow label="Group"        value={createdAgent.group} />
                </div>

                {requireReset && (
                  <div className="mt-3 flex items-start gap-2 rounded-md bg-amber-50 p-3 text-[11px] text-amber-900">
                    <Info className="h-3.5 w-3.5 shrink-0" />
                    The agent must reset this temporary password on first sign-in.
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={reset}>
                <UserPlus className="h-3 w-3" />Create another
              </Button>
              <Button asChild size="sm" className="bg-coral text-white hover:bg-coral-dark">
                <Link href="/agents">Back to agent list</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Create form ──────────────────────────────────────────────────────────
  const RoleIcon = ROLE_ICONS[role];

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
        <header className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">People</p>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">Create a new agent</h1>
              <p className="mt-0.5 text-sm text-white/80">
                Set their identity, role, group, and an auto-generated temporary password.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
              <Link href="/agents"><ArrowLeft className="h-3 w-3" />Back to agents</Link>
            </Button>
          </div>
        </header>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <form onSubmit={handleSubmit} className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1fr_360px]">
          {/* LEFT — main form */}
          <div className="space-y-4">
            {/* Identity */}
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-coral" />
                  Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-5">
                <div className="space-y-1.5">
                  <Label htmlFor="ag-name" className="text-xs">Full name *</Label>
                  <Input id="ag-name" autoFocus value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Adaeze Nwosu" className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ag-email" className="text-xs">Work email *</Label>
                  <Input id="ag-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="adaeze@consomoafrica.com" className="h-9 text-sm" />
                  {email && !emailValid && <p className="text-[11px] text-red-600">Enter a valid email address.</p>}
                  {emailTaken && <p className="text-[11px] text-red-600">An agent with this email already exists.</p>}
                </div>
              </CardContent>
            </Card>

            {/* Role */}
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="h-4 w-4 text-coral" />
                  Role
                </CardTitle>
                <p className="text-[11px] text-muted-foreground">
                  Controls what the agent can do in the tenant admin portal and agent workspace.
                </p>
              </CardHeader>
              <CardContent className="grid gap-2 p-5 sm:grid-cols-2">
                {TENANT_ROLES.map((r) => {
                  const Icon = ROLE_ICONS[r];
                  const meta = ROLE_META[r];
                  const active = role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={cn(
                        'flex items-start gap-3 rounded-lg border p-3 text-left transition-all',
                        active
                          ? 'border-coral bg-coral/5 ring-2 ring-coral/20'
                          : 'border-border hover:border-coral/40 hover:bg-muted/30',
                      )}
                    >
                      <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg', meta.tone.bg, meta.tone.text)}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold">{meta.label}</p>
                          {active && <CheckCircle2 className="h-3.5 w-3.5 text-coral" />}
                        </div>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">{meta.description}</p>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Group */}
            {(role === 'manager' || role === 'agent') && (
              <Card>
                <CardHeader className="border-b py-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-coral" />
                    Group / Team
                  </CardTitle>
                  <p className="text-[11px] text-muted-foreground">
                    {role === 'manager'
                      ? 'Managers see and manage the agents in the group they lead.'
                      : 'Tickets are routed to this team by default.'}
                  </p>
                </CardHeader>
                <CardContent className="p-5">
                  <select value={group} onChange={(e) => setGroup(e.target.value)}
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                    {GROUP_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    Configure groups in <Link href="/ticket-fields" className="text-primary hover:underline">Ticket fields → Groups</Link>.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Credentials */}
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <KeyRound className="h-4 w-4 text-coral" />
                  Temporary password
                </CardTitle>
                <p className="text-[11px] text-muted-foreground">
                  Auto-generated. The agent will be required to change it on first sign-in.
                </p>
              </CardHeader>
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center gap-2">
                  <Input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-9 flex-1 font-mono text-sm"
                  />
                  <Button type="button" variant="outline" size="icon" className="h-9 w-9"
                    onClick={() => setShowPwd((v) => !v)} title={showPwd ? 'Hide' : 'Show'}>
                    {showPwd ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                  <Button type="button" variant="outline" size="icon" className="h-9 w-9"
                    onClick={() => setPassword(generatePassword())} title="Generate new">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                  <Button type="button" variant="outline" size="icon" className="h-9 w-9"
                    onClick={() => navigator.clipboard?.writeText(password)} title="Copy">
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="flex items-center justify-between rounded-md border bg-muted/30 p-3">
                  <div className="pr-3">
                    <p className="text-xs font-semibold">Require password reset on first sign-in</p>
                    <p className="text-[10px] text-muted-foreground">Strongly recommended for shared temp passwords.</p>
                  </div>
                  <Switch checked={requireReset} onCheckedChange={setRequireReset} />
                </div>

                <div className="flex items-center justify-between rounded-md border bg-muted/30 p-3">
                  <div className="pr-3">
                    <p className="text-xs font-semibold">Email an invitation</p>
                    <p className="text-[10px] text-muted-foreground">
                      Sends a welcome email with sign-in link + temporary password. Turn off to share manually.
                    </p>
                  </div>
                  <Switch checked={sendInvite} onCheckedChange={setSendInvite} />
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap justify-end gap-2">
              <Button asChild variant="outline" size="sm" type="button">
                <Link href="/agents">Cancel</Link>
              </Button>
              <Button type="submit" size="sm" disabled={!formValid || submitting}
                className="bg-coral text-white hover:bg-coral-dark">
                {submitting
                  ? <><RefreshCw className="h-3 w-3 animate-spin" />Creating…</>
                  : <><CheckCheck className="h-3 w-3" />Create agent</>}
              </Button>
            </div>
          </div>

          {/* RIGHT — live preview + permission summary */}
          <aside className="space-y-4 lg:sticky lg:top-5 lg:self-start">
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className={cn('text-sm font-bold', ROLE_META[role].tone.bg, ROLE_META[role].tone.text)}>
                      {initials || '··'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{name || 'New agent'}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{email || 'no-email@example.com'}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <Badge variant="secondary" className="gap-1 text-[10px]">
                    <RoleIcon className="h-2.5 w-2.5" />
                    {ROLE_META[role].label}
                  </Badge>
                  {(role === 'manager' || role === 'agent') && (
                    <Badge variant="outline" className="text-[10px]">{group}</Badge>
                  )}
                </div>
                <div className="mt-3 grid gap-2 rounded-lg border bg-muted/20 p-3 text-[11px]">
                  <CredRowMini label="Sign-in" value="workspace.topiadesk.com" />
                  <CredRowMini label="Email" value={email || '—'} />
                  <CredRowMini label="Password" value={password} mono />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">What this role can do</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 p-5">
                {ROLE_PERMS[role].map((p, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px]">
                    {p.granted
                      ? <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
                      : <span className="mt-0.5 grid h-3 w-3 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">×</span>}
                    <span className={cn(p.granted ? 'text-foreground' : 'text-muted-foreground line-through decoration-1')}>
                      {p.label}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </form>
      </div>
    </div>
  );
}

// ─── Bits ────────────────────────────────────────────────────────────────────

function CredRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="w-28 shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className={cn('flex-1 truncate', mono && 'font-mono')}>{value}</span>
      <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={copy}>
        {copied ? <CheckCircle2 className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
      </Button>
    </div>
  );
}

function CredRowMini({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className={cn('truncate', mono && 'font-mono')}>{value}</span>
    </div>
  );
}
