'use client';

import { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  MapPin,
  Mail,
  Phone,
  Ticket,
  ExternalLink,
  Building2,
  Filter,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Skeleton,
  cn,
} from '@topiadesk/ui';
import { useContacts } from '@/lib/queries';
import type { MockContact, ContactStatus } from '@/lib/mock-data';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function statusInfo(status: ContactStatus) {
  switch (status) {
    case 'vip':       return { label: 'VIP',      cls: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 'active':    return { label: 'Active',   cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'inactive':  return { label: 'Inactive', cls: 'bg-muted text-muted-foreground border-border' };
  }
}

function timeAgo(iso?: string) {
  if (!iso) return 'Never';
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function ContactRow({ c, onClick }: { c: MockContact; onClick: () => void }) {
  const st = statusInfo(c.status);
  const initials = c.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
  return (
    <tr
      className="border-b border-border/40 last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-blue-100 text-xs font-bold text-blue-700">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-foreground">{c.name}</p>
            {c.title && <p className="text-xs text-muted-foreground">{c.title}</p>}
          </div>
        </div>
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-1.5 text-xs text-foreground">
          <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate max-w-[140px]">{c.company}</span>
        </div>
        {c.department && <p className="text-[10px] text-muted-foreground mt-0.5">{c.department}</p>}
      </td>
      <td className="px-3 py-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Mail className="h-3 w-3 shrink-0" />{c.email}
          </div>
          {c.phone && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="h-3 w-3 shrink-0" />{c.phone}
            </div>
          )}
        </div>
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />{c.location}
        </div>
      </td>
      <td className="px-3 py-3 text-center">
        <div className="flex flex-col items-center">
          <span className="text-sm font-semibold text-foreground">{c.totalTickets}</span>
          {c.openTickets > 0 && (
            <Badge variant="warning" className="text-[9px] px-1 py-0">{c.openTickets} open</Badge>
          )}
        </div>
      </td>
      <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
        {timeAgo(c.lastTicketAt)}
      </td>
      <td className="px-3 pr-5 py-3">
        <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold', st.cls)}>
          {st.label}
        </span>
      </td>
    </tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ContactStatus>('all');
  const [selected, setSelected] = useState<MockContact | null>(null);

  const contacts = useContacts();

  const filtered = useMemo(() => {
    return (contacts.data ?? []).filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [contacts.data, search, statusFilter]);

  const counts = useMemo(() => {
    const data = contacts.data ?? [];
    return {
      all: data.length,
      active: data.filter((c) => c.status === 'active').length,
      vip: data.filter((c) => c.status === 'vip').length,
      inactive: data.filter((c) => c.status === 'inactive').length,
    };
  }, [contacts.data]);

  return (
    <div className="space-y-5 p-5">
      {/* ── Gradient header ── */}
      <div
        className="relative -mx-5 -mt-5 mb-1 overflow-hidden px-5 py-6"
        style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
              Workspace
            </p>
            <h1 className="font-display mt-0.5 text-2xl font-bold tracking-tight text-white">
              Contacts
            </h1>
            <p className="mt-0.5 text-sm text-white/70">
              {contacts.data ? `${counts.all} contacts · ${counts.vip} VIP` : 'Loading…'}
            </p>
          </div>
          <Button size="sm" className="bg-coral text-white hover:bg-white/90">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add contact
          </Button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search contacts, companies…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/30 p-0.5">
          {(['all', 'active', 'vip', 'inactive'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={cn(
                'rounded-md px-3 py-1 text-xs font-medium capitalize transition-all',
                statusFilter === f
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {f} <span className="ml-1 text-muted-foreground/60">{counts[f]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-5">
        {/* ── Table ── */}
        <Card className={cn('min-w-0 flex-1 overflow-hidden', selected ? 'hidden lg:block' : '')}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/20">
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-muted-foreground">Name</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Company</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Contact</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Location</th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-muted-foreground">Tickets</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Last ticket</th>
                  <th className="px-3 pr-5 py-2.5 text-left text-xs font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {contacts.isPending
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="border-b border-border/40">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        </td>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <td key={j} className="px-3 py-3"><Skeleton className="h-4 w-20" /></td>
                        ))}
                      </tr>
                    ))
                  : filtered.map((c) => (
                      <ContactRow key={c.id} c={c} onClick={() => setSelected(c)} />
                    ))}
              </tbody>
            </table>
            {!contacts.isPending && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Users className="mb-2 h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm font-medium text-foreground">No contacts found</p>
                <p className="text-xs text-muted-foreground">Try adjusting your search or filter.</p>
              </div>
            )}
          </div>
        </Card>

        {/* ── Detail panel ── */}
        {selected && (
          <Card className="w-72 shrink-0 self-start">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <button
                  onClick={() => setSelected(null)}
                  className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
                >
                  ← Back
                </button>
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  <ExternalLink className="mr-1 h-3 w-3" /> View
                </Button>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-blue-100 text-lg font-bold text-blue-700">
                    {selected.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{selected.name}</p>
                  {selected.title && <p className="text-xs text-muted-foreground">{selected.title}</p>}
                  <p className="text-xs text-muted-foreground">{selected.company}</p>
                </div>
                <span className={cn(
                  'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                  statusInfo(selected.status).cls,
                )}>
                  {statusInfo(selected.status).label}
                </span>
              </div>
              <div className="space-y-2 border-t border-border/60 pt-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 shrink-0" /> {selected.email}
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0" /> {selected.phone}
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" /> {selected.location}
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2.5">
                <span className="text-xs text-muted-foreground">Total tickets</span>
                <span className="text-sm font-bold text-foreground">{selected.totalTickets}</span>
              </div>
              {selected.openTickets > 0 && (
                <div className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2.5 border border-amber-100">
                  <span className="text-xs text-amber-700">Open tickets</span>
                  <Badge variant="warning">{selected.openTickets}</Badge>
                </div>
              )}
              {selected.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selected.tags.map((t) => (
                    <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                  ))}
                </div>
              )}
              <Button size="sm" className="w-full" variant="outline">
                <Ticket className="mr-1.5 h-3.5 w-3.5" /> Create ticket
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
