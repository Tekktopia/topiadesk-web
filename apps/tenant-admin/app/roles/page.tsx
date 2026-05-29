'use client';
/* fixed-jsx-structure */
/* end-fix-applied */

import { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  Lock,
  MoreHorizontal,
  Plus,
  Shield,
  ShieldCheck,
  Users,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  cn,
} from '@topiadesk/ui';
import { adminRoles, type AdminRole } from '@/lib/mock-data';

interface PermissionGroup {
  label: string;
  permissions: Array<{ id: string; label: string; description: string }>;
}

const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    label: 'Tickets',
    permissions: [
      {
        id: 'tickets.view.own',
        label: 'View own tickets',
        description: 'See tickets assigned to themselves',
      },
      {
        id: 'tickets.view.group',
        label: 'View team tickets',
        description: 'See tickets in their group',
      },
      {
        id: 'tickets.view.all',
        label: 'View all tickets',
        description: 'See every ticket in the tenant',
      },
      {
        id: 'tickets.delete',
        label: 'Delete tickets',
        description: 'Permanently remove tickets',
      },
    ],
  },
  {
    label: 'Automations',
    permissions: [
      {
        id: 'automations.view',
        label: 'View automation rules',
        description: 'Read-only access to the automation builder',
      },
      {
        id: 'automations.edit',
        label: 'Create & edit rules',
        description: 'Author and modify automation rules',
      },
    ],
  },
  {
    label: 'Settings',
    permissions: [
      {
        id: 'settings.tenant',
        label: 'Edit tenant settings',
        description: 'Change subdomain, locale, region',
      },
      {
        id: 'settings.branding',
        label: 'Manage branding',
        description: 'Logo, colours, custom domain',
      },
      {
        id: 'settings.billing',
        label: 'Manage billing',
        description: 'Plan, seats, invoices',
      },
    ],
  },
  {
    label: 'People',
    permissions: [
      {
        id: 'people.invite',
        label: 'Invite agents',
        description: 'Send invitations to new agents',
      },
      {
        id: 'people.role.assign',
        label: 'Assign roles',
        description: 'Change role on existing agents',
      },
    ],
  },
];

export default function RolesPage() {
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<AdminRole>(adminRoles[1]!);
  const [granted, setGranted] = useState<Set<string>>(
    new Set(['tickets.view.own', 'tickets.view.group', 'automations.view']),
  );

  function togglePerm(id: string) {
    setGranted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const filtered = adminRoles.filter(
    (r) => !search || r.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
      {/* Gradient header */}
      <div className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">People</p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">Roles & permissions</h1>
            <p className="mt-0.5 text-sm text-white/70">Group fine-grained permissions into roles, then assign roles to agents.</p>
          </div>
          <Button size="sm" className="bg-coral text-white hover:bg-white/90">
            <Plus className="h-3 w-3" />
            New role
          </Button>
        </div>
      </div>
      </div>

      <div className="flex-1 min-h-0 space-y-5 overflow-y-auto p-5 pt-5">

      <div className="px-5 pb-5 lg:px-6 lg:pb-6 space-y-5">

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardHeader className="border-b py-3">
            <CardTitle className="text-sm">Roles</CardTitle>
            <p className="text-xs text-muted-foreground">
              {filtered.length} of {adminRoles.length}
            </p>
          </CardHeader>
          <div className="border-b p-2">
            <Input
              placeholder="Search"
              className="h-8 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <CardContent className="p-0">
            <ul className="divide-y">
              {filtered.map((r) => {
                const active = r.id === selectedRole.id;
                return (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedRole(r)}
                      className={cn(
                        'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors',
                        active ? 'bg-primary/5' : 'hover:bg-muted/40',
                      )}
                    >
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                        <Shield className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold">{r.name}</p>
                          {r.system && (
                            <Badge variant="outline" className="text-[9px]">
                              <Lock className="h-2.5 w-2.5" />
                              System
                            </Badge>
                          )}
                        </div>
                        <p className="line-clamp-1 text-[11px] text-muted-foreground">
                          {r.description}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {r.agentCount} agent{r.agentCount === 1 ? '' : 's'} ·{' '}
                          {r.permissionCount} permissions
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 border-b py-3">
            <div className="min-w-0">
              <CardTitle className="flex items-center gap-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-primary" />
                {selectedRole.name}
                {selectedRole.system && (
                  <Badge variant="outline" className="text-[9px]">
                    <Lock className="h-2.5 w-2.5" />
                    System role
                  </Badge>
                )}
              </CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {selectedRole.description}
              </p>
              <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {selectedRole.agentCount} agents
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {selectedRole.permissionCount} permissions granted
                </span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Role actions"
                  className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled={selectedRole.system}>
                  Rename role
                </DropdownMenuItem>
                <DropdownMenuItem>Duplicate role</DropdownMenuItem>
                <DropdownMenuItem
                  disabled={selectedRole.system}
                  className="text-red-600"
                >
                  Delete role
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>

          <CardContent className="p-0">
            <div className="border-b bg-muted/20 px-4 py-2 text-[11px] text-muted-foreground">
              {selectedRole.system
                ? 'System roles are read-only. Duplicate to customise.'
                : 'Toggle permissions below. Changes apply to every agent with this role.'}
            </div>
            <div className="divide-y">
              {PERMISSION_GROUPS.map((g) => (
                <PermissionGroupSection
                  key={g.label}
                  group={g}
                  granted={granted}
                  onToggle={togglePerm}
                  readonly={selectedRole.system}
                />
              ))}
            </div>
            <div className="flex items-center justify-end gap-2 border-t bg-muted/20 p-3">
              <Button variant="ghost" size="sm">
                Discard
              </Button>
              <Button size="sm" disabled={selectedRole.system}>
                Save permissions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>

      </div>
    </div>
  );
}

function PermissionGroupSection({
  group,
  granted,
  onToggle,
  readonly,
}: {
  group: PermissionGroup;
  granted: Set<string>;
  onToggle: (id: string) => void;
  readonly: boolean;
}) {
  const [open, setOpen] = useState(true);
  const grantedCount = group.permissions.filter((p) => granted.has(p.id)).length;
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-muted/40"
      >
        <div className="flex items-center gap-2">
          <ChevronDown
            className={cn(
              'h-3 w-3 transition-transform',
              !open && '-rotate-90',
            )}
          />
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {group.label}
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground">
          {grantedCount}/{group.permissions.length}
        </span>
      </button>
      {open && (
        <ul className="divide-y bg-card">
          {group.permissions.map((p) => (
            <li
              key={p.id}
              className="flex items-start gap-3 px-4 py-2.5 text-sm"
            >
              <div className="pt-0.5">
                <Checkbox
                  checked={granted.has(p.id)}
                  disabled={readonly}
                  onCheckedChange={() => onToggle(p.id)}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{p.label}</p>
                <p className="text-[11px] text-muted-foreground">
                  {p.description}
                </p>
              </div>
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                {p.id}
              </code>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
