'use client';

import { useMemo, useState } from 'react';
import {
  ArrowDown,
  CheckCircle2,
  ChevronDown,
  Filter,
  Loader2,
  Mail,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Upload,
  UserPlus,
  X,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from '@topiadesk/ui';
import { adminAgents, type AdminAgent } from '@/lib/mock-data';
import { initials } from '@/lib/format';

const STATUS_META: Record<AdminAgent['status'], { label: string; color: string }> = {
  active: { label: 'Active', color: 'bg-emerald-500' },
  invited: { label: 'Invited', color: 'bg-amber-500' },
  suspended: { label: 'Suspended', color: 'bg-red-500' },
};

export default function AgentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Set<AdminAgent['status']>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return adminAgents.filter((a) => {
      if (statusFilter.size > 0 && !statusFilter.has(a.status)) return false;
      if (
        search &&
        !(a.name + a.email + a.role + a.group)
          .toLowerCase()
          .includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [search, statusFilter]);

  const allSelected =
    filtered.length > 0 && filtered.every((a) => selected.has(a.id));
  const someSelected =
    filtered.some((a) => selected.has(a.id)) && !allSelected;

  function toggleSelectAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map((a) => a.id)));
  }
  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function toggleStatus(s: AdminAgent['status']) {
    setStatusFilter((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
      {/* Gradient header */}
      <div className="relative overflow-hidden rounded-2xl bg-navy px-6 py-5 shadow-lg shadow-navy/15">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">People</p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">Agents & users</h1>
            <p className="mt-0.5 text-sm text-white/70">
              {adminAgents.filter((a) => a.status === 'active').length} active ·{' '}
              {adminAgents.filter((a) => a.status === 'invited').length} invited ·{' '}
              {adminAgents.filter((a) => a.status === 'suspended').length} suspended
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
              <Upload className="h-3 w-3" />
              Bulk import CSV
            </Button>
            <Button size="sm" className="bg-coral text-white hover:bg-white/90">
              <UserPlus className="h-3 w-3" />
              Invite agent
            </Button>
          </div>
        </div>
      </div>
      </div>
      </div>

      <div className="flex-1 min-h-0 space-y-5 overflow-y-auto p-5 pt-5">

      <div className="px-5 pb-5 lg:px-6 lg:pb-6">

      <Card>
        <div className="flex flex-wrap items-center gap-2 border-b p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, role"
              className="h-8 w-72 pl-8 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Filter className="h-3 w-3 text-muted-foreground" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  'inline-flex items-center gap-1 rounded-full border border-dashed border-input bg-card px-2.5 py-0.5 text-xs hover:bg-muted',
                  statusFilter.size > 0 && 'border-solid border-primary/40 text-primary',
                )}
              >
                Status
                {statusFilter.size > 0 && (
                  <Badge variant="secondary" className="h-4 px-1.5 text-[9px]">
                    {statusFilter.size}
                  </Badge>
                )}
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              {(['active', 'invited', 'suspended'] as const).map((s) => (
                <DropdownMenuItem
                  key={s}
                  onSelect={(e) => {
                    e.preventDefault();
                    toggleStatus(s);
                  }}
                >
                  <Checkbox checked={statusFilter.has(s)} className="pointer-events-none" />
                  {STATUS_META[s].label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {[...statusFilter].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleStatus(s)}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
            >
              {STATUS_META[s].label}
              <X className="h-3 w-3" />
            </button>
          ))}
        </div>

        {selected.size > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b bg-primary/5 px-4 py-2 text-sm">
            <span className="font-medium">{selected.size} selected</span>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <Mail className="h-3 w-3" />
              Resend invite
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <ShieldCheck className="h-3 w-3" />
              Change role
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              Move to group
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs text-red-600">
              Suspend
            </Button>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="ml-auto text-xs text-muted-foreground hover:text-foreground"
            >
              Clear selection
            </button>
          </div>
        )}

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10 pl-4">
                  <Checkbox
                    checked={
                      allSelected ? true : someSelected ? 'indeterminate' : false
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="inline-flex items-center gap-1">
                    Resolved
                    <ArrowDown className="h-3 w-3" />
                  </span>
                </TableHead>
                <TableHead>Last seen</TableHead>
                <TableHead>MFA</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id} className={selected.has(a.id) ? 'bg-primary/5' : undefined}>
                  <TableCell className="pl-4">
                    <Checkbox
                      checked={selected.has(a.id)}
                      onCheckedChange={() => toggleRow(a.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{initials(a.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{a.name}</p>
                        <p className="text-[11px] text-muted-foreground">{a.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{a.role}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {a.group}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          STATUS_META[a.status].color,
                        )}
                      />
                      {STATUS_META[a.status].label}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm tabular-nums">
                    {a.ticketsResolved}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {a.lastSeen ?? '—'}
                  </TableCell>
                  <TableCell>
                    {a.mfa ? (
                      <Badge variant="success" className="text-[9px]">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        On
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="text-[9px]">
                        Off
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="pr-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          aria-label="Agent actions"
                          className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem>Edit profile</DropdownMenuItem>
                        <DropdownMenuItem>Change role</DropdownMenuItem>
                        <DropdownMenuItem>Move to group</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          {a.mfa ? 'Disable MFA' : 'Require MFA'}
                        </DropdownMenuItem>
                        <DropdownMenuItem>Reset password</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          {a.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
          <span>
            Showing {filtered.length} of {adminAgents.length}
          </span>
          <Button variant="ghost" size="sm" className="h-7 text-xs" disabled>
            <Loader2 className="hidden h-3 w-3 animate-spin" />
            Load more
          </Button>
        </div>
      </Card>
      </div>
    </div>
  );
}
