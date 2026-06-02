'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Copy,
  Loader2,
  Shield,
  ShieldCheck,
  Sparkles,
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
  Label,
  Textarea,
} from '@topiadesk/ui';
import { adminRoles } from '@/lib/mock-data';

const PERMISSION_GROUPS = [
  {
    label: 'Tickets',
    permissions: [
      { id: 'tickets.view.own', label: 'View own tickets' },
      { id: 'tickets.view.group', label: 'View team tickets' },
      { id: 'tickets.view.all', label: 'View all tickets' },
      { id: 'tickets.edit', label: 'Edit tickets' },
      { id: 'tickets.delete', label: 'Delete tickets' },
      { id: 'tickets.merge', label: 'Merge / split tickets' },
    ],
  },
  {
    label: 'Assets',
    permissions: [
      { id: 'assets.view', label: 'View assets' },
      { id: 'assets.edit', label: 'Add & edit assets' },
      { id: 'assets.bulk', label: 'Run bulk actions' },
      { id: 'assets.retire', label: 'Retire assets' },
    ],
  },
  {
    label: 'Automations',
    permissions: [
      { id: 'automations.view', label: 'View automation rules' },
      { id: 'automations.edit', label: 'Create & edit rules' },
      { id: 'automations.dryrun', label: 'Toggle dry-run' },
    ],
  },
  {
    label: 'Settings',
    permissions: [
      { id: 'settings.tenant', label: 'Edit tenant settings' },
      { id: 'settings.branding', label: 'Manage branding' },
      { id: 'settings.business_hours', label: 'Manage business hours' },
      { id: 'settings.sla', label: 'Manage SLA policies' },
      { id: 'settings.billing', label: 'Manage billing' },
    ],
  },
  {
    label: 'People',
    permissions: [
      { id: 'people.view', label: 'View agents & users' },
      { id: 'people.invite', label: 'Invite agents' },
      { id: 'people.role.assign', label: 'Assign roles' },
      { id: 'people.suspend', label: 'Suspend & reactivate' },
    ],
  },
  {
    label: 'Integrations & API',
    permissions: [
      { id: 'integrations.view', label: 'View integrations' },
      { id: 'integrations.connect', label: 'Connect & disconnect' },
      { id: 'webhooks.manage', label: 'Manage webhooks' },
      { id: 'api.token.create', label: 'Create API tokens' },
    ],
  },
];

export default function NewRolePage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cloneFrom, setCloneFrom] = useState<string | null>(null);
  const [granted, setGranted] = useState<Set<string>>(
    new Set(['tickets.view.own', 'tickets.view.group', 'assets.view']),
  );
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.length > 2;

  function togglePerm(id: string) {
    setGranted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function toggleGroup(groupLabel: string, on: boolean) {
    const group = PERMISSION_GROUPS.find((g) => g.label === groupLabel);
    if (!group) return;
    setGranted((prev) => {
      const next = new Set(prev);
      for (const p of group.permissions) {
        if (on) next.add(p.id);
        else next.delete(p.id);
      }
      return next;
    });
  }
  function applyClone(id: string) {
    setCloneFrom(id);
    // pretend to seed from a system role
    setGranted(new Set(['tickets.view.own', 'tickets.view.group', 'assets.view', 'people.view']));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    window.setTimeout(() => setSubmitting(false), 800);
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
        <div className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link
                href="/roles"
                className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white"
              >
                <ArrowLeft className="h-3 w-3" />
                Roles
              </Link>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">
                New role
              </h1>
              <p className="mt-0.5 text-sm text-white/70">
                Group permissions into a reusable role that agents can be assigned.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link href="/roles">Cancel</Link>
              </Button>
              <Button
                form="new-role-form"
                type="submit"
                size="sm"
                disabled={!canSubmit || submitting}
                className="bg-white text-foreground hover:bg-white/90"
              >
                {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
                Create role
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <form
          id="new-role-form"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]"
        >
          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4" />
                  Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 p-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Role name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Senior CSAT analyst"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea
                    id="desc"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="One sentence so other admins know who this role is for."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Clone permissions from (optional)</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-md border border-input bg-card px-3 py-2 text-sm hover:bg-muted"
                      >
                        <span className="flex items-center gap-2">
                          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                          {cloneFrom
                            ? adminRoles.find((r) => r.id === cloneFrom)?.name
                            : 'Start with no permissions'}
                        </span>
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-72">
                      <DropdownMenuItem onSelect={() => setCloneFrom(null)}>
                        Start with no permissions
                      </DropdownMenuItem>
                      {adminRoles.map((r) => (
                        <DropdownMenuItem key={r.id} onSelect={() => applyClone(r.id)}>
                          <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                          {r.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Permissions
                  </CardTitle>
                  <p className="text-[10px] text-muted-foreground">
                    {granted.size} of{' '}
                    {PERMISSION_GROUPS.reduce((s, g) => s + g.permissions.length, 0)}{' '}
                    granted
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {PERMISSION_GROUPS.map((g) => {
                    const groupCount = g.permissions.filter((p) => granted.has(p.id)).length;
                    const all = groupCount === g.permissions.length;
                    const some = groupCount > 0 && !all;
                    return (
                      <details key={g.label} open className="group">
                        <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 hover:bg-muted/40">
                          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-0 [details:not([open])>summary>&]:rotate-[-90deg]" />
                            {g.label}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground">
                              {groupCount}/{g.permissions.length}
                            </span>
                            <Checkbox
                              checked={all ? true : some ? 'indeterminate' : false}
                              onCheckedChange={(v) => toggleGroup(g.label, v === true)}
                            />
                          </div>
                        </summary>
                        <ul className="divide-y bg-card">
                          {g.permissions.map((p) => (
                            <li
                              key={p.id}
                              className="flex items-start gap-3 px-4 py-2.5 text-sm"
                            >
                              <div className="pt-0.5">
                                <Checkbox
                                  checked={granted.has(p.id)}
                                  onCheckedChange={() => togglePerm(p.id)}
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium">{p.label}</p>
                              </div>
                              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                                {p.id}
                              </code>
                            </li>
                          ))}
                        </ul>
                      </details>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                <div>
                  <p className="text-xs font-semibold">{name || 'Untitled role'}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {description || 'No description yet.'}
                  </p>
                </div>
                {cloneFrom && (
                  <p className="text-[10px] text-muted-foreground">
                    Cloned from{' '}
                    <Badge variant="outline" className="text-[10px]">
                      {adminRoles.find((r) => r.id === cloneFrom)?.name}
                    </Badge>
                  </p>
                )}
                <div className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-xs">
                  <span className="text-muted-foreground">Permissions</span>
                  <span className="inline-flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    {granted.size}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <Tip text="Smaller roles are easier to audit. Make one for each job — Agent, Senior Agent, Billing Lead — not one giant role." />
                <Tip text="Always clone from a known-good role rather than starting blank." />
                <Tip text="System roles cannot be edited — duplicate first if you need a variation." />
              </CardContent>
            </Card>
          </aside>
        </form>
      </div>
    </div>
  );
}

function Tip({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-md bg-muted/40 p-2">
      <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-coral" />
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}
