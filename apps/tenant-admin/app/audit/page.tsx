'use client';

import { useMemo, useState } from 'react';
import {
  ChevronDown,
  Download,
  Filter,
  History,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Input,
  cn,
} from '@topiadesk/ui';
import { auditEvents, type AuditEvent } from '@/lib/mock-data';
import { initials } from '@/lib/format';

const CATEGORY_META: Record<
  AuditEvent['category'],
  { label: string; tone: string }
> = {
  auth: { label: 'Auth', tone: 'bg-blue-100 text-blue-700' },
  config: { label: 'Config', tone: 'bg-coral/12 text-coral-dark' },
  data: { label: 'Data', tone: 'bg-emerald-100 text-emerald-700' },
  security: { label: 'Security', tone: 'bg-amber-100 text-amber-700' },
};

export default function AuditLogPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<
    Set<AuditEvent['category']>
  >(new Set());

  const filtered = useMemo(() => {
    return auditEvents.filter((e) => {
      if (categoryFilter.size > 0 && !categoryFilter.has(e.category)) return false;
      if (
        search &&
        !(e.actor + e.action + e.target + e.ip)
          .toLowerCase()
          .includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [search, categoryFilter]);

  function toggleCategory(c: AuditEvent['category']) {
    setCategoryFilter((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }

  return (
    <div className="space-y-5">
      {/* Gradient header */}
      <div className="relative overflow-hidden rounded-2xl bg-navy px-6 py-5 shadow-lg shadow-navy/15">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Security</p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">Audit log</h1>
            <p className="mt-0.5 text-sm text-white/70">Every admin action against this tenant is recorded and retained for 13 months.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
              <Download className="h-3 w-3" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
              <ShieldCheck className="h-3 w-3" />
              Stream to SIEM
            </Button>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 lg:px-6 lg:pb-6 space-y-5">
      <Card>
        <div className="flex flex-wrap items-center gap-2 border-b p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search actor, action, target, IP"
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
                  categoryFilter.size > 0 &&
                    'border-solid border-primary/40 text-primary',
                )}
              >
                Category
                {categoryFilter.size > 0 && (
                  <Badge variant="secondary" className="h-4 px-1.5 text-[9px]">
                    {categoryFilter.size}
                  </Badge>
                )}
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              <DropdownMenuLabel>Category</DropdownMenuLabel>
              {(['auth', 'config', 'data', 'security'] as const).map((c) => (
                <DropdownMenuItem
                  key={c}
                  onSelect={(e) => {
                    e.preventDefault();
                    toggleCategory(c);
                  }}
                >
                  <Checkbox
                    checked={categoryFilter.has(c)}
                    className="pointer-events-none"
                  />
                  {CATEGORY_META[c].label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-input bg-card px-2.5 py-0.5 text-xs hover:bg-muted"
          >
            Actor
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-input bg-card px-2.5 py-0.5 text-xs hover:bg-muted"
          >
            Date range
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>
          {[...categoryFilter].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggleCategory(c)}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
            >
              {CATEGORY_META[c].label}
              <X className="h-3 w-3" />
            </button>
          ))}
        </div>
        <CardContent className="p-0">
          <ol className="divide-y">
            {filtered.map((e) => (
              <li key={e.id} className="flex items-start gap-3 px-4 py-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                  {e.actor === 'System' ? 'SY' : initials(e.actor)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[9px]',
                        CATEGORY_META[e.category].tone,
                        'border-transparent',
                      )}
                    >
                      {CATEGORY_META[e.category].label}
                    </Badge>
                    <p className="text-sm">
                      <span className="font-medium">{e.actor}</span>{' '}
                      <span className="text-muted-foreground">{e.action}</span>{' '}
                      <span className="font-medium">{e.target}</span>
                    </p>
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground">
                    <span>{e.actorEmail}</span>
                    <span aria-hidden>·</span>
                    <span className="font-mono">{e.ip}</span>
                    <span aria-hidden>·</span>
                    <span>{e.occurredAt}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  Inspect
                </Button>
              </li>
            ))}
          </ol>
        </CardContent>
        <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
          <span>
            <History className="mr-1 inline-block h-3 w-3" />
            Showing {filtered.length} of {auditEvents.length} events
          </span>
          <Button variant="ghost" size="sm" className="h-7 text-xs" disabled>
            Older events
          </Button>
        </div>
      </Card>
      </div>
    </div>
  );
}
