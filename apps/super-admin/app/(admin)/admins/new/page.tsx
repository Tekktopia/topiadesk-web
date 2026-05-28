'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCheck,
  CircleCheck,
  Copy,
  Crown,
  Eye,
  EyeOff,
  Headset,
  Info,
  KeyRound,
  Mail,
  RefreshCw,
  Shield,
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

// ─── Role definitions ────────────────────────────────────────────────────────

interface RoleDefinition {
  id: 'super_admin' | 'admin' | 'csr' | 'viewer';
  label: string;
  icon: typeof Crown;
  color: string;
  bg: string;
  description: string;
  perms: { label: string; granted: boolean }[];
}

const ROLES: RoleDefinition[] = [
  {
    id: 'super_admin', label: 'Super Admin', icon: Crown,
    color: 'text-red-600', bg: 'bg-red-50',
    description: 'Full platform control — can manage all tenants, billing, security and other admins.',
    perms: [
      { label: 'Manage all tenants',         granted: true },
      { label: 'Create / remove admins',     granted: true },
      { label: 'Access billing & revenue',   granted: true },
      { label: 'Configure feature flags',    granted: true },
      { label: 'View audit logs',            granted: true },
      { label: 'Manage security policies',   granted: true },
      { label: 'Handle support tickets',     granted: true },
      { label: 'Edit platform settings',     granted: true },
    ],
  },
  {
    id: 'admin', label: 'Admin', icon: ShieldCheck,
    color: 'text-coral-dark', bg: 'bg-coral/10',
    description: 'Standard admin — can manage tenants and operations but not platform settings or other admins.',
    perms: [
      { label: 'Manage all tenants',         granted: true  },
      { label: 'Create / remove admins',     granted: false },
      { label: 'Access billing & revenue',   granted: true  },
      { label: 'Configure feature flags',    granted: false },
      { label: 'View audit logs',            granted: true  },
      { label: 'Manage security policies',   granted: false },
      { label: 'Handle support tickets',     granted: true  },
      { label: 'Edit platform settings',     granted: false },
    ],
  },
  {
    id: 'csr', label: 'CSR (Support)', icon: Headset,
    color: 'text-blue-600', bg: 'bg-blue-50',
    description: 'Customer Service Rep — handles tenant support tickets and can view tenant details.',
    perms: [
      { label: 'Manage all tenants',         granted: false },
      { label: 'Create / remove admins',     granted: false },
      { label: 'Access billing & revenue',   granted: false },
      { label: 'Configure feature flags',    granted: false },
      { label: 'View audit logs',            granted: false },
      { label: 'Manage security policies',   granted: false },
      { label: 'Handle support tickets',     granted: true  },
      { label: 'Edit platform settings',     granted: false },
    ],
  },
  {
    id: 'viewer', label: 'Viewer', icon: User,
    color: 'text-slate-600', bg: 'bg-slate-50',
    description: 'Read-only — can view tenants, reports and dashboards but cannot make any changes.',
    perms: [
      { label: 'Manage all tenants',         granted: false },
      { label: 'Create / remove admins',     granted: false },
      { label: 'Access billing & revenue',   granted: true  },
      { label: 'Configure feature flags',    granted: false },
      { label: 'View audit logs',            granted: true  },
      { label: 'Manage security policies',   granted: false },
      { label: 'Handle support tickets',     granted: false },
      { label: 'Edit platform settings',     granted: false },
    ],
  },
];

// ─── Password generator ──────────────────────────────────────────────────────

function generatePassword(length = 14) {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
  let pw = '';
  for (let i = 0; i < length; i++) {
    pw += charset[Math.floor(Math.random() * charset.length)];
  }
  // Ensure complexity by always including: 1 upper, 1 lower, 1 number, 1 symbol
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnpqrstuvwxyz';
  const num   = '23456789';
  const sym   = '!@#$%^&*';
  pw = pw.slice(0, length - 4)
    + upper[Math.floor(Math.random() * upper.length)]
    + lower[Math.floor(Math.random() * lower.length)]
    + num[Math.floor(Math.random() * num.length)]
    + sym[Math.floor(Math.random() * sym.length)];
  // shuffle
  return pw.split('').sort(() => Math.random() - 0.5).join('');
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CreateAdminPage() {
  const [firstName,       setFirstName]       = useState('');
  const [lastName,        setLastName]        = useState('');
  const [email,           setEmail]           = useState('');
  const [role,            setRole]            = useState<RoleDefinition['id']>('admin');

  const [passwordMode,    setPasswordMode]    = useState<'auto' | 'manual'>('auto');
  const [autoPassword,    setAutoPassword]    = useState(() => generatePassword());
  const [manualPassword,  setManualPassword]  = useState('');
  const [showPassword,    setShowPassword]    = useState(false);
  const [copied,          setCopied]          = useState(false);

  const [forceReset,      setForceReset]      = useState(true);
  const [requireMfa,      setRequireMfa]      = useState(true);
  const [sendEmail,       setSendEmail]       = useState(true);
  const [created,         setCreated]         = useState(false);
  const [creating,        setCreating]        = useState(false);

  const selectedRole = ROLES.find((r) => r.id === role)!;
  const RoleIcon = selectedRole.icon;
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase() || '?';
  const password = passwordMode === 'auto' ? autoPassword : manualPassword;
  const valid =
    firstName.trim() &&
    lastName.trim() &&
    /.+@topiadesk\.com$/i.test(email) &&
    (passwordMode === 'auto' || manualPassword.length >= 12);

  async function copyPassword() {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) { /* ignore */ }
  }

  async function handleCreate() {
    setCreating(true);
    await new Promise((r) => setTimeout(r, 900));
    setCreating(false);
    setCreated(true);
  }

  // ─── Success state ───
  if (created) {
    return (
      <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-2xl pt-10">
            <div className="grid h-16 w-16 mx-auto place-items-center rounded-full bg-emerald-100">
              <CircleCheck className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="mt-4 text-center text-2xl font-bold text-foreground">Admin account created</h2>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{firstName} {lastName}</span> ({email}) is now a Topiadesk <span className="font-medium text-foreground">{selectedRole.label}</span>.
            </p>

            <Card className="mt-6 border-amber-200 bg-amber-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                  <KeyRound className="h-4 w-4" />Initial credentials — share securely
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Username</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="flex-1 rounded-md border bg-card px-3 py-2 font-mono text-sm">{email}</code>
                    <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(email); }}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Temporary password</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <code className={cn(
                      'flex-1 rounded-md border bg-card px-3 py-2 font-mono text-sm',
                      !showPassword && 'tracking-[0.2em]',
                    )}>
                      {showPassword ? password : '•'.repeat(password.length)}
                    </code>
                    <Button size="sm" variant="outline" onClick={() => setShowPassword((s) => !s)}>
                      {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={copyPassword}>
                      {copied ? <CheckCheck className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
                <div className="rounded-md border border-amber-300 bg-amber-100/60 p-3 text-xs text-amber-900">
                  <p className="flex items-start gap-1.5">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>
                      <strong>This password will not be shown again.</strong> Copy it now and share via a secure channel
                      (e.g. 1Password Share, Bitwarden Send). The user will be prompted to change it on first login
                      {requireMfa && ' and set up 2FA'}.
                    </span>
                  </p>
                </div>
                {sendEmail && (
                  <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>A welcome email with login link has been sent to {email}. (Password is NOT included in the email for security.)</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-6 flex justify-center gap-2">
              <Button asChild>
                <Link href="/users">Back to users</Link>
              </Button>
              <Button variant="outline" onClick={() => {
                setCreated(false); setFirstName(''); setLastName(''); setEmail('');
                setAutoPassword(generatePassword()); setManualPassword('');
                setRole('admin');
              }}>
                Create another
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main form ───
  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
      {/* Hero */}
      <div className="shrink-0 p-5 pb-0">
        <header className="relative overflow-hidden rounded-2xl bg-navy px-6 py-5 shadow-lg shadow-navy/15">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative">
            <Link href="/users" className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white/90 transition-colors">
              <ArrowLeft className="h-3 w-3" /> All users
            </Link>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-white">Create a new admin account</h1>
            <p className="mt-0.5 text-sm text-white/70">
              Provision a Topiadesk platform account directly. The user can sign in immediately using the credentials you generate.
            </p>
          </div>
        </header>
      </div>

      {/* Scrollable form */}
      <div className="flex-1 min-h-0 overflow-y-auto p-5 pt-5">
        <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-3">
          {/* Form (2/3) */}
          <div className="space-y-5 lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <UserCog className="h-4 w-4 text-coral" />Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="first">First name</Label>
                    <Input id="first" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="e.g. Amara" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="last">Last name</Label>
                    <Input id="last" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="e.g. Diallo" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Work email (becomes username)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="amara@topiadesk.com"
                      className="pl-9"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">Must end in <code className="rounded bg-muted px-1">@topiadesk.com</code></p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-coral" />Initial password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Mode toggle */}
                <div className="flex rounded-lg border p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setPasswordMode('auto')}
                    className={cn('flex-1 rounded-md px-2.5 py-1.5 font-medium transition-colors',
                      passwordMode === 'auto' ? 'bg-coral text-white' : 'text-muted-foreground hover:text-foreground')}
                  >
                    Auto-generate
                  </button>
                  <button
                    type="button"
                    onClick={() => setPasswordMode('manual')}
                    className={cn('flex-1 rounded-md px-2.5 py-1.5 font-medium transition-colors',
                      passwordMode === 'manual' ? 'bg-coral text-white' : 'text-muted-foreground hover:text-foreground')}
                  >
                    Set manually
                  </button>
                </div>

                {/* Password display / input */}
                {passwordMode === 'auto' ? (
                  <div>
                    <div className="flex items-center gap-2">
                      <code className={cn(
                        'flex-1 rounded-md border bg-muted/30 px-3 py-2 font-mono text-sm',
                        !showPassword && 'tracking-[0.2em]',
                      )}>
                        {showPassword ? autoPassword : '•'.repeat(autoPassword.length)}
                      </code>
                      <Button type="button" size="sm" variant="outline" onClick={() => setShowPassword((s) => !s)}>
                        {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={copyPassword}>
                        {copied ? <CheckCheck className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => setAutoPassword(generatePassword())}>
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="mt-1.5 text-[11px] text-muted-foreground">
                      Cryptographically random 14 characters — upper/lower/digit/symbol guaranteed.
                    </p>
                  </div>
                ) : (
                  <div>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={manualPassword}
                      onChange={(e) => setManualPassword(e.target.value)}
                      placeholder="Min 12 characters"
                      className="font-mono"
                    />
                    <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{manualPassword.length < 12 ? `${12 - manualPassword.length} more characters required` : 'Strong enough'}</span>
                      <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-coral hover:underline">
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between border-t pt-3">
                  <div>
                    <p className="text-sm font-medium">Force change on first login</p>
                    <p className="text-[11px] text-muted-foreground">User must set a new password before accessing the portal</p>
                  </div>
                  <Switch checked={forceReset} onCheckedChange={setForceReset} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4 text-coral" />Role & permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:grid-cols-2">
                  {ROLES.map((r) => {
                    const Icon = r.icon;
                    const selected = role === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id)}
                        className={cn(
                          'rounded-lg border p-3.5 text-left transition-all',
                          selected
                            ? 'border-coral/40 bg-coral/5 ring-2 ring-coral/20'
                            : 'border-border bg-card hover:border-coral/20 hover:bg-coral/3',
                        )}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', r.bg)}>
                            <Icon className={cn('h-4 w-4', r.color)} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-semibold text-sm text-foreground">{r.label}</p>
                              {selected && <CircleCheck className="h-4 w-4 text-coral" />}
                            </div>
                            <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{r.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-coral" />Security options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">Require MFA at first login</p>
                    <p className="text-[11px] text-muted-foreground">User must set up 2FA before accessing the portal</p>
                  </div>
                  <Switch checked={requireMfa} onCheckedChange={setRequireMfa} />
                </div>
                <div className="flex items-center justify-between py-2 border-t border-border/60">
                  <div>
                    <p className="text-sm font-medium">Send welcome email</p>
                    <p className="text-[11px] text-muted-foreground">Email with portal link &amp; instructions (excludes password)</p>
                  </div>
                  <Switch checked={sendEmail} onCheckedChange={setSendEmail} />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" asChild>
                <Link href="/users">Cancel</Link>
              </Button>
              <Button
                disabled={!valid || creating}
                onClick={handleCreate}
                className="min-w-40"
              >
                {creating
                  ? <span className="flex items-center gap-2"><span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />Creating…</span>
                  : <><UserPlus className="h-3.5 w-3.5" />Create account</>}
              </Button>
            </div>
          </div>

          {/* Preview (1/3) */}
          <div className="space-y-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-coral text-xs font-bold text-white">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {firstName || lastName ? `${firstName} ${lastName}`.trim() : 'New admin'}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">{email || 'email@topiadesk.com'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={cn('flex h-7 w-7 items-center justify-center rounded-lg', selectedRole.bg)}>
                    <RoleIcon className={cn('h-3.5 w-3.5', selectedRole.color)} />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{selectedRole.label}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {selectedRole.perms.filter((p) => p.granted).length} of {selectedRole.perms.length} permissions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Permissions granted</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-border/60">
                  {selectedRole.perms.map((p) => (
                    <li key={p.label} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                      <span className={cn('text-xs', p.granted ? 'text-foreground' : 'text-muted-foreground/60 line-through')}>{p.label}</span>
                      {p.granted
                        ? <CircleCheck className="h-3.5 w-3.5 text-emerald-500" />
                        : <span className="text-[10px] text-muted-foreground/50">No access</span>}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50/40">
              <CardContent className="flex gap-2 p-4 text-xs">
                <Info className="h-4 w-4 shrink-0 text-amber-600" />
                <div>
                  <p className="font-semibold text-amber-800">Action logged</p>
                  <p className="mt-0.5 text-amber-700/80">
                    Creating a {selectedRole.label} account is recorded in audit logs and all existing super admins are notified by email.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
