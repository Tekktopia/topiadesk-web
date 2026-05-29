'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Copy,
  Crown,
  Edit3,
  Eye,
  Headset,
  Lock,
  MoreHorizontal,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  User,
  Users,
  XCircle,
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
  Switch,
  cn,
} from '@topiadesk/ui';

interface Role {
  id: string;
  name: string;
  description: string;
  builtIn: boolean;
  userCount: number;
  icon: typeof Crown;
  color: string;
  bg: string;
  permissions: { category: string; perms: { key: string; label: string; granted: boolean }[] }[];
}

const PERMISSION_CATEGORIES = [
  { key: 'tenants', label: 'Tenants', perms: [
    { key: 'tenant.view',   label: 'View tenants' },
    { key: 'tenant.create', label: 'Create tenants' },
    { key: 'tenant.edit',   label: 'Edit tenant settings' },
    { key: 'tenant.suspend',label: 'Suspend / reactivate tenants' },
    { key: 'tenant.delete', label: 'Delete tenants' },
  ]},
  { key: 'users', label: 'Users & admins', perms: [
    { key: 'user.view',    label: 'View users' },
    { key: 'user.invite',  label: 'Invite users' },
    { key: 'admin.create', label: 'Create platform admins' },
    { key: 'admin.remove', label: 'Remove platform admins' },
    { key: 'role.manage',  label: 'Manage custom roles' },
  ]},
  { key: 'billing', label: 'Billing', perms: [
    { key: 'billing.view',   label: 'View invoices' },
    { key: 'billing.refund', label: 'Issue refunds' },
    { key: 'billing.edit',   label: 'Edit pricing' },
    { key: 'billing.export', label: 'Export financial data' },
  ]},
  { key: 'support', label: 'Customer support', perms: [
    { key: 'support.view',     label: 'View support tickets' },
    { key: 'support.reply',    label: 'Reply to tickets' },
    { key: 'support.assign',   label: 'Assign / reassign' },
    { key: 'support.escalate', label: 'Escalate to engineering' },
  ]},
  { key: 'platform', label: 'Platform', perms: [
    { key: 'flags.manage',    label: 'Manage feature flags' },
    { key: 'announce.manage', label: 'Manage announcements' },
    { key: 'integrations.manage', label: 'Manage integrations' },
    { key: 'api.manage',      label: 'Manage API keys & webhooks' },
  ]},
  { key: 'ops', label: 'Operations & security', perms: [
    { key: 'audit.view',      label: 'View audit logs' },
    { key: 'security.view',   label: 'View security events' },
    { key: 'security.manage', label: 'Manage security policies' },
    { key: 'backups.manage',  label: 'Manage backups & restore' },
    { key: 'compliance.manage', label: 'Manage compliance' },
  ]},
];

function rolePerms(grants: Record<string, boolean>) {
  return PERMISSION_CATEGORIES.map((cat) => ({
    category: cat.label,
    perms: cat.perms.map((p) => ({ ...p, granted: !!grants[p.key] })),
  }));
}

const allGranted: Record<string, boolean> = Object.fromEntries(
  PERMISSION_CATEGORIES.flatMap((c) => c.perms.map((p) => [p.key, true])),
);

const ROLES: Role[] = [
  {
    id: 'super_admin', name: 'Super Admin', description: 'Full platform control. Reserved for founders + senior engineering.',
    builtIn: true, userCount: 2, icon: Crown, color: 'text-red-600', bg: 'bg-red-50',
    permissions: rolePerms(allGranted),
  },
  {
    id: 'admin', name: 'Admin', description: 'Manages tenants and operations. Cannot create other admins or modify platform settings.',
    builtIn: true, userCount: 4, icon: ShieldCheck, color: 'text-coral-dark', bg: 'bg-coral/10',
    permissions: rolePerms({
      'tenant.view': true, 'tenant.create': true, 'tenant.edit': true, 'tenant.suspend': true,
      'user.view': true, 'user.invite': true,
      'billing.view': true, 'billing.export': true,
      'support.view': true, 'support.reply': true, 'support.assign': true, 'support.escalate': true,
      'audit.view': true, 'security.view': true,
    }),
  },
  {
    id: 'csr', name: 'CSR (Support)', description: 'Customer Service Reps. Full access to support queue + read-only tenant view.',
    builtIn: true, userCount: 12, icon: Headset, color: 'text-blue-600', bg: 'bg-blue-50',
    permissions: rolePerms({
      'tenant.view': true,
      'user.view': true,
      'support.view': true, 'support.reply': true, 'support.assign': true, 'support.escalate': true,
    }),
  },
  {
    id: 'viewer', name: 'Viewer', description: 'Read-only access. For auditors, finance and analysts.',
    builtIn: true, userCount: 6, icon: User, color: 'text-slate-600', bg: 'bg-slate-50',
    permissions: rolePerms({
      'tenant.view': true, 'user.view': true,
      'billing.view': true, 'support.view': true,
      'audit.view': true, 'security.view': true,
    }),
  },
  // Custom roles
  {
    id: 'finance', name: 'Finance Lead', description: 'Custom role — full billing + invoicing access, no tenant management.',
    builtIn: false, userCount: 2, icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50',
    permissions: rolePerms({
      'tenant.view': true,
      'billing.view': true, 'billing.refund': true, 'billing.edit': true, 'billing.export': true,
      'audit.view': true,
    }),
  },
  {
    id: 'sec-officer', name: 'Security Officer', description: 'Custom role — security events, audit logs, compliance.',
    builtIn: false, userCount: 1, icon: ShieldCheck, color: 'text-amber-700', bg: 'bg-amber-50',
    permissions: rolePerms({
      'tenant.view': true, 'user.view': true,
      'audit.view': true, 'security.view': true, 'security.manage': true,
      'compliance.manage': true,
    }),
  },
];

export default function RolesPage() {
  const [selectedId, setSelectedId] = useState(ROLES[0]!.id);
  const [search, setSearch] = useState('');

  const filtered = ROLES.filter((r) =>
    !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()),
  );
  const selected = ROLES.find((r) => r.id === selectedId)!;
  const grantedCount = selected.permissions.flatMap((c) => c.perms).filter((p) => p.granted).length;
  const totalCount = PERMISSION_CATEGORIES.flatMap((c) => c.perms).length;

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
        <header className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Super Admin</p>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">Roles &amp; Permissions</h1>
              <p className="mt-0.5 text-sm text-white/70">
                {ROLES.length} roles · {ROLES.filter((r) => !r.builtIn).length} custom · {ROLES.reduce((s, r) => s + r.userCount, 0)} users assigned
              </p>
            </div>
            <Button size="sm" className="bg-coral text-white hover:bg-coral-dark">
              <Plus className="h-3 w-3" />New role
            </Button>
          </div>
        </header>
      </div>

      <div className="flex-1 min-h-0 grid gap-5 overflow-hidden p-5 pt-5 lg:grid-cols-[360px_1fr]">
        {/* Roles list */}
        <div className="flex min-h-0 flex-col rounded-xl border border-border/70 bg-card overflow-hidden">
          <div className="shrink-0 border-b border-border/60 p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search roles…" className="h-8 pl-8 text-xs" />
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <ul className="divide-y">
              {filtered.map((r) => {
                const Icon = r.icon;
                const isSel = selectedId === r.id;
                return (
                  <li key={r.id}>
                    <button
                      onClick={() => setSelectedId(r.id)}
                      className={cn(
                        'flex w-full items-start gap-3 px-3 py-3 text-left transition-colors',
                        isSel ? 'bg-coral/5 border-l-2 border-coral' : 'hover:bg-muted/40 border-l-2 border-transparent',
                      )}
                    >
                      <span className={cn('mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg', r.bg)}>
                        <Icon className={cn('h-4 w-4', r.color)} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-sm font-semibold">{r.name}</p>
                          {r.builtIn && <Badge variant="secondary" className="text-[9px]">Built-in</Badge>}
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">{r.description}</p>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          <Users className="mr-0.5 inline h-2.5 w-2.5" />{r.userCount} users
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Permissions detail */}
        <div className="flex min-h-0 flex-col rounded-xl border border-border/70 bg-card overflow-hidden">
          <div className="shrink-0 border-b border-border/60 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={cn('grid h-10 w-10 place-items-center rounded-lg', selected.bg)}>
                  <selected.icon className={cn('h-5 w-5', selected.color)} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold">{selected.name}</h2>
                    {selected.builtIn && <Badge variant="secondary" className="text-[10px]">Built-in</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{selected.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  <Copy className="h-3 w-3" />Clone
                </Button>
                {!selected.builtIn && (
                  <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 hover:border-red-200 hover:bg-red-50">
                    <Trash2 className="h-3 w-3" />Delete
                  </Button>
                )}
                <Button size="sm" className="h-7 bg-coral text-white hover:bg-coral-dark text-xs" disabled={selected.builtIn}>
                  <Edit3 className="h-3 w-3" />Edit
                </Button>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-lg border bg-muted/30 px-3 py-1.5">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Permissions</p>
                <p className="text-sm font-bold tabular-nums">{grantedCount} / {totalCount}</p>
              </div>
              <div className="rounded-lg border bg-muted/30 px-3 py-1.5">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Users assigned</p>
                <p className="text-sm font-bold tabular-nums">{selected.userCount}</p>
              </div>
              <div className="rounded-lg border bg-muted/30 px-3 py-1.5">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Type</p>
                <p className="text-sm font-bold">{selected.builtIn ? 'System' : 'Custom'}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
            {selected.permissions.map((cat) => (
              <div key={cat.category}>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{cat.category}</p>
                <div className="rounded-lg border bg-muted/20">
                  {cat.perms.map((p, i) => (
                    <div key={p.key} className={cn('flex items-center justify-between px-3 py-2 text-xs', i > 0 && 'border-t border-border/40')}>
                      <span className={cn(p.granted ? 'text-foreground' : 'text-muted-foreground/60')}>{p.label}</span>
                      <div className="flex items-center gap-2">
                        {p.granted
                          ? <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600"><CheckCircle2 className="h-3 w-3" />Granted</span>
                          : <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><XCircle className="h-3 w-3" />No access</span>}
                        <Switch checked={p.granted} disabled={selected.builtIn} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
