'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  ChevronRight,
  LogOut,
  Plus,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { Button, Input, cn } from '@topiadesk/ui';

interface Organization {
  id: string;
  name: string;
  subdomain: string;
  role: string;
  logoEmoji: string;
  memberCount: number;
  lastActive: string;
}

const MOCK_ORGS: Organization[] = [
  {
    id: 'consomoafrica',
    name: 'ConsomoAfrica',
    subdomain: 'consomoafrica',
    role: 'Helpdesk Agent',
    logoEmoji: '🌍',
    memberCount: 24,
    lastActive: 'Active today',
  },
  {
    id: 'kasi-pay',
    name: 'Kasi Pay',
    subdomain: 'kasi-pay',
    role: 'Tenant Admin',
    logoEmoji: '💳',
    memberCount: 8,
    lastActive: 'Active yesterday',
  },
  {
    id: 'flairtech',
    name: 'FlairTech',
    subdomain: 'flairtech',
    role: 'Account Officer (read-only)',
    logoEmoji: '⚡',
    memberCount: 42,
    lastActive: 'Last seen 3 days ago',
  },
];

const CURRENT_USER = {
  name: 'Tunde Bakare',
  email: 'tunde@consomoafrica.com',
};

export default function OrganizationsPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string>(
    MOCK_ORGS[0]?.id ?? '',
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return MOCK_ORGS;
    return MOCK_ORGS.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.subdomain.includes(q) ||
        o.role.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Signed in as {CURRENT_USER.email}
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Choose a tenant
        </h1>
        <p className="text-sm text-muted-foreground">
          You belong to {MOCK_ORGS.length} Topiadesk tenants. Pick one to
          continue.
        </p>
      </header>

      {MOCK_ORGS.length > 4 && (
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by tenant, subdomain or role"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      <ul className="space-y-2">
        {filtered.map((org) => {
          const active = selected === org.id;
          return (
            <li key={org.id}>
              <button
                type="button"
                onClick={() => setSelected(org.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors',
                  active
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:bg-muted',
                )}
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-muted text-xl">
                  {org.logoEmoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {org.name}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {org.subdomain}.topiadesk.com
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {org.role} · {org.memberCount} members · {org.lastActive}
                  </p>
                </div>
                <ChevronRight
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors',
                    active ? 'text-primary' : 'text-muted-foreground',
                  )}
                />
              </button>
            </li>
          );
        })}

        {filtered.length === 0 && (
          <li className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No tenants match &ldquo;{search}&rdquo;.
          </li>
        )}
      </ul>

      <Button className="w-full" disabled={!selected}>
        Continue to {selectedTenantName(selected)}
        <ArrowRight className="h-4 w-4" />
      </Button>

      <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-border p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-muted-foreground">
            <Plus className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">Start a new tenant</p>
            <p className="text-xs text-muted-foreground">
              Spin up another Topiadesk instance for a different team or brand.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href="https://topiadesk.com/signup">
            <Building2 className="h-3 w-3" />
            Create tenant
          </a>
        </Button>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="inline-flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" />
          Sessions are scoped per tenant.
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-1 font-medium text-foreground hover:underline"
        >
          <LogOut className="h-3 w-3" />
          Sign out
        </Link>
      </div>
    </div>
  );
}

function selectedTenantName(id: string): string {
  return MOCK_ORGS.find((o) => o.id === id)?.name ?? '...';
}
