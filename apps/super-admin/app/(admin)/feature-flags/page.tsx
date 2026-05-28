'use client';

import { useMemo, useState } from 'react';
import { Search, X, ToggleLeft, ToggleRight, ChevronDown, ChevronUp, Users, Globe } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
  Skeleton,
  cn,
} from '@topiadesk/ui';
import { useFeatureFlags } from '@/lib/queries';
import type { TenantPlan } from '@/lib/mock-data';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

const PLAN_STYLES: Record<TenantPlan, string> = {
  enterprise: 'bg-coral/12 text-coral-dark',
  business:   'bg-blue-100 text-blue-700',
  starter:    'bg-slate-100 text-slate-700',
};

type ScopeFilter = 'all' | 'global' | 'plan' | 'override' | 'off';

export default function FeatureFlagsPage() {
  const flags = useFeatureFlags();
  const [search, setSearch] = useState('');
  const [scope, setScope] = useState<ScopeFilter>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = flags.data ?? [];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((f) =>
        f.name.toLowerCase().includes(q) ||
        f.key.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q),
      );
    }
    if (scope === 'global')   list = list.filter((f) => f.enabledGlobally);
    if (scope === 'plan')     list = list.filter((f) => !f.enabledGlobally && f.enabledForPlans.length > 0);
    if (scope === 'override') list = list.filter((f) => f.tenantOverrides.length > 0);
    if (scope === 'off')      list = list.filter((f) => !f.enabledGlobally && f.enabledForPlans.length === 0 && f.tenantOverrides.length === 0);
    return list;
  }, [flags.data, search, scope]);

  const counts = useMemo(() => {
    const all = flags.data ?? [];
    return {
      all: all.length,
      global: all.filter((f) => f.enabledGlobally).length,
      plan: all.filter((f) => !f.enabledGlobally && f.enabledForPlans.length > 0).length,
      override: all.filter((f) => f.tenantOverrides.length > 0).length,
      off: all.filter((f) => !f.enabledGlobally && f.enabledForPlans.length === 0 && f.tenantOverrides.length === 0).length,
    };
  }, [flags.data]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
      {/* Gradient header */}
      <div className="relative overflow-hidden rounded-2xl bg-navy px-6 py-5 shadow-lg shadow-navy/15">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Super Admin</p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">Feature Flags</h1>
            <p className="mt-0.5 text-sm text-white/70">Control feature availability per plan, tenant, and rollout percentage.</p>
          </div>
          <Button size="sm" className="bg-coral text-white hover:bg-white/90">New flag</Button>
        </div>
      </div>
      </div>

      {/* ── Pinned KPI + filter strip ── */}
      <div className="shrink-0 space-y-5 px-5 pt-5">

      {/* Summary strip */}
      <div className="flex flex-wrap gap-3 text-xs">
        {[
          { label: 'Total flags',   value: counts.all,      color: 'text-foreground' },
          { label: 'Global on',     value: counts.global,   color: 'text-emerald-600' },
          { label: 'Plan-gated',    value: counts.plan,     color: 'text-blue-600' },
          { label: 'Has overrides', value: counts.override, color: 'text-amber-600' },
          { label: 'Fully off',     value: counts.off,      color: 'text-slate-400' },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border bg-card px-4 py-2.5">
            <p className={cn('text-lg font-bold tabular-nums', s.color)}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter strip styled as card top */}
      <div className="rounded-t-xl border border-b-0 border-border/70 bg-card px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Scope tabs */}
          <div className="flex rounded-lg border p-0.5 text-xs">
            {([
              { key: 'all',      label: `All (${counts.all})` },
              { key: 'global',   label: 'Global on' },
              { key: 'plan',     label: 'Plan-gated' },
              { key: 'override', label: 'Has overrides' },
              { key: 'off',      label: 'Off' },
            ] as { key: ScopeFilter; label: string }[]).map((s) => (
              <button key={s.key} type="button" onClick={() => setScope(s.key)}
                className={cn('rounded-md px-2.5 py-1 font-medium transition-colors',
                  scope === s.key ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground')}>
                {s.label}
              </button>
            ))}
          </div>

          <div className="relative ml-auto">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search flags…" className="h-8 w-56 pl-8 text-xs" />
            {search && (
              <button type="button" onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* ── Scroll body ── */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-5">
        <div className="rounded-b-xl border border-t-0 border-border/70 bg-card">
          {flags.isLoading ? (
            <div className="space-y-2 p-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
          ) : (
            <div className="divide-y">
              {filtered.map((flag) => {
                const isExpanded = expanded === flag.id;
                const isOn = flag.enabledGlobally || flag.enabledForPlans.length > 0 || flag.tenantOverrides.some((o) => o.enabled);

                return (
                  <div key={flag.id}>
                    {/* Main row */}
                    <div className="flex items-center gap-4 px-4 py-3 hover:bg-muted/30 transition-colors">
                      {/* Toggle icon */}
                      <button type="button" className="shrink-0">
                        {flag.enabledGlobally ? (
                          <ToggleRight className="h-6 w-6 text-emerald-500" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-muted-foreground/40" />
                        )}
                      </button>

                      {/* Name & key */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold">{flag.name}</p>
                          <code className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">{flag.key}</code>
                          {flag.enabledGlobally && (
                            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                              <Globe className="h-2.5 w-2.5" />Global
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{flag.description}</p>
                      </div>

                      {/* Plan pills */}
                      <div className="hidden shrink-0 items-center gap-1 sm:flex">
                        {flag.enabledGlobally ? (
                          <span className="text-[10px] text-muted-foreground">All plans</span>
                        ) : flag.enabledForPlans.length > 0 ? (
                          flag.enabledForPlans.map((p) => (
                            <span key={p} className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize', PLAN_STYLES[p])}>{p}</span>
                          ))
                        ) : (
                          <span className="text-[10px] text-muted-foreground/50">No plans</span>
                        )}
                      </div>

                      {/* Rollout */}
                      <div className="hidden shrink-0 sm:block">
                        <div className="flex items-center gap-1.5 text-xs">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${flag.rolloutPct}%` }} />
                          </div>
                          <span className="tabular-nums text-muted-foreground">{flag.rolloutPct}%</span>
                        </div>
                      </div>

                      {/* Overrides count */}
                      {flag.tenantOverrides.length > 0 && (
                        <div className="flex shrink-0 items-center gap-1 text-[10px] text-amber-600">
                          <Users className="h-3 w-3" />
                          {flag.tenantOverrides.length} override{flag.tenantOverrides.length !== 1 ? 's' : ''}
                        </div>
                      )}

                      {/* Status badge */}
                      <Badge variant={isOn ? 'success' : 'secondary'} className="shrink-0 text-[10px]">
                        {isOn ? 'Active' : 'Off'}
                      </Badge>

                      {/* Expand */}
                      <button type="button" onClick={() => setExpanded(isExpanded ? null : flag.id)}
                        className="shrink-0 text-muted-foreground hover:text-foreground">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="border-t bg-muted/10 px-4 py-4 space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {/* Description */}
                          <div className="space-y-1">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Description</p>
                            <p className="text-xs">{flag.description}</p>
                          </div>

                          {/* Enabled for plans */}
                          <div className="space-y-1">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Plan availability</p>
                            {flag.enabledGlobally ? (
                              <p className="text-xs text-emerald-600 font-medium">Enabled for all tenants globally</p>
                            ) : flag.enabledForPlans.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {flag.enabledForPlans.map((p) => (
                                  <span key={p} className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize', PLAN_STYLES[p])}>{p}</span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground">Not enabled for any plan</p>
                            )}
                          </div>

                          {/* Rollout */}
                          <div className="space-y-1">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Rollout percentage</p>
                            <div className="flex items-center gap-2">
                              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${flag.rolloutPct}%` }} />
                              </div>
                              <span className="tabular-nums text-sm font-semibold">{flag.rolloutPct}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Tenant overrides */}
                        {flag.tenantOverrides.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Tenant overrides</p>
                            <div className="flex flex-wrap gap-2">
                              {flag.tenantOverrides.map((o) => (
                                <div key={o.id} className={cn(
                                  'flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium',
                                  o.enabled ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700',
                                )}>
                                  <span className={cn('h-1.5 w-1.5 rounded-full', o.enabled ? 'bg-emerald-500' : 'bg-red-500')} />
                                  {o.name}
                                  <span className="text-[10px] opacity-70">{o.enabled ? 'ON' : 'OFF'}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t pt-3">
                          <p className="text-[10px] text-muted-foreground">
                            Created {formatDate(flag.createdAt)} · Updated {formatDate(flag.updatedAt)}
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="h-7 text-[11px]">Edit flag</Button>
                            <Button size="sm" variant="outline" className="h-7 text-[11px]">Add override</Button>
                            <Button size="sm" variant={flag.enabledGlobally ? 'outline' : 'default'} className="h-7 text-[11px]">
                              {flag.enabledGlobally ? 'Disable globally' : 'Enable globally'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <p className="p-8 text-center text-sm text-muted-foreground">No flags match your search.</p>
              )}
            </div>
          )}
          <div className="border-t bg-muted/20 px-4 py-2.5">
            <p className="text-xs text-muted-foreground">Showing {filtered.length} of {flags.data?.length ?? 0} flags</p>
          </div>
        </div>
      </div>
    </div>
  );
}
