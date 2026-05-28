'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, Bell, Calendar, CheckCircle2, Clock, Info, Megaphone, Plus, Wrench, X } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  cn,
} from '@topiadesk/ui';
import { useAnnouncements } from '@/lib/queries';
import type { AnnouncementStatus, AnnouncementType, TenantPlan } from '@/lib/mock-data';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

function formatAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}

const TYPE_META: Record<AnnouncementType, {
  icon: React.ElementType;
  label: string;
  iconColor: string;
  badgeCls: string;
  bannerCls: string;
}> = {
  info:        { icon: Info,          label: 'Info',        iconColor: 'text-blue-500',   badgeCls: 'bg-blue-100 text-blue-700',    bannerCls: 'border-blue-200 bg-blue-50 dark:bg-blue-950/30' },
  warning:     { icon: AlertTriangle, label: 'Warning',     iconColor: 'text-amber-500',  badgeCls: 'bg-amber-100 text-amber-700',  bannerCls: 'border-amber-200 bg-amber-50 dark:bg-amber-950/30' },
  maintenance: { icon: Wrench,        label: 'Maintenance', iconColor: 'text-slate-500',  badgeCls: 'bg-slate-100 text-slate-700',  bannerCls: 'border-slate-200 bg-slate-50 dark:bg-slate-900/30' },
  feature:     { icon: Bell,          label: 'Feature',     iconColor: 'text-coral', badgeCls: 'bg-coral/12 text-coral-dark',bannerCls: 'border-coral/25 bg-coral/8 dark:bg-violet-950/30' },
};

const STATUS_META: Record<AnnouncementStatus, { variant: 'success' | 'warning' | 'secondary' | 'danger'; label: string }> = {
  published:  { variant: 'success',   label: 'Published' },
  scheduled:  { variant: 'warning',   label: 'Scheduled' },
  draft:      { variant: 'secondary', label: 'Draft' },
  expired:    { variant: 'secondary', label: 'Expired' },
};

const PLAN_STYLES: Record<TenantPlan, string> = {
  enterprise: 'bg-coral/12 text-coral-dark',
  business:   'bg-blue-100 text-blue-700',
  starter:    'bg-slate-100 text-slate-700',
};

export default function AnnouncementsPage() {
  const announcements = useAnnouncements();
  const [statusFilter, setStatusFilter] = useState<'all' | AnnouncementStatus>('all');
  const [typeFilter, setTypeFilter]     = useState<'all' | AnnouncementType>('all');
  const [preview, setPreview]           = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...(announcements.data ?? [])].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    if (statusFilter !== 'all') list = list.filter((a) => a.status === statusFilter);
    if (typeFilter !== 'all')   list = list.filter((a) => a.type === typeFilter);
    return list;
  }, [announcements.data, statusFilter, typeFilter]);

  const counts = useMemo(() => {
    const all = announcements.data ?? [];
    return {
      all:       all.length,
      published: all.filter((a) => a.status === 'published').length,
      scheduled: all.filter((a) => a.status === 'scheduled').length,
      draft:     all.filter((a) => a.status === 'draft').length,
      expired:   all.filter((a) => a.status === 'expired').length,
    };
  }, [announcements.data]);

  const previewAnn = preview ? (announcements.data ?? []).find((a) => a.id === preview) : null;

  return (
    <div className="space-y-5 p-6">
      {/* Gradient header */}
      <div className="relative overflow-hidden rounded-2xl bg-navy px-6 py-5 shadow-lg shadow-navy/15">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Super Admin</p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">Announcements</h1>
            <p className="mt-0.5 text-sm text-white/70">Broadcast messages to tenants by plan or globally.</p>
          </div>
          <Button size="sm" className="bg-coral text-white hover:bg-white/90">
            <Plus className="h-3.5 w-3.5" />New announcement
          </Button>
        </div>
      </div>

      {/* Published/live banners */}
      {(announcements.data ?? []).filter((a) => a.status === 'published').length > 0 && (
        <div className="space-y-2">
          {(announcements.data ?? []).filter((a) => a.status === 'published').map((ann) => {
            const tm = TYPE_META[ann.type];
            const Icon = tm.icon;
            return (
              <div key={ann.id} className={cn('flex items-start gap-3 rounded-xl border px-4 py-3', tm.bannerCls)}>
                <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', tm.iconColor)} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{ann.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{ann.body}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Published {ann.publishedAt ? formatAgo(ann.publishedAt) : ''}
                    {ann.expiresAt ? ` · Expires ${formatDate(ann.expiresAt)}` : ''}
                    {' · '}Target: {ann.targetPlans === 'all' ? 'All tenants' : ann.targetPlans.join(', ')}
                  </p>
                </div>
                <Button size="sm" variant="outline" className="h-6 shrink-0 px-2 text-[10px]">Edit</Button>
              </div>
            );
          })}
        </div>
      )}

      <div className={cn('grid gap-5', previewAnn ? 'lg:grid-cols-[1fr_380px]' : '')}>
        {/* Main list */}
        <Card>
          <CardHeader className="border-b py-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Status tabs */}
              <div className="flex rounded-lg border p-0.5 text-xs">
                {([
                  { key: 'all',       label: `All (${counts.all})` },
                  { key: 'published', label: `Live (${counts.published})` },
                  { key: 'scheduled', label: `Scheduled (${counts.scheduled})` },
                  { key: 'draft',     label: `Draft (${counts.draft})` },
                ] as { key: 'all' | AnnouncementStatus; label: string }[]).map((s) => (
                  <button key={s.key} type="button" onClick={() => setStatusFilter(s.key)}
                    className={cn('rounded-md px-2.5 py-1 font-medium transition-colors',
                      statusFilter === s.key ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground')}>
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Type filter */}
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
                className="ml-auto h-8 rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="all">All types</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="maintenance">Maintenance</option>
                <option value="feature">Feature</option>
              </select>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {announcements.isLoading ? (
              <div className="space-y-2 p-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
            ) : (
              <div className="divide-y">
                {filtered.map((ann) => {
                  const tm = TYPE_META[ann.type];
                  const sm = STATUS_META[ann.status];
                  const Icon = tm.icon;
                  const isActive = preview === ann.id;

                  return (
                    <div key={ann.id}
                      className={cn('cursor-pointer px-4 py-3 transition-colors hover:bg-muted/30', isActive && 'bg-muted/40')}
                      onClick={() => setPreview(isActive ? null : ann.id)}>
                      <div className="flex items-start gap-3">
                        <div className={cn('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md', tm.badgeCls)}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold">{ann.title}</p>
                            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', tm.badgeCls)}>{tm.label}</span>
                            <Badge variant={sm.variant} className="text-[10px]">{sm.label}</Badge>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{ann.body}</p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
                            <span>By {ann.createdBy}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5" />{formatAgo(ann.createdAt)}
                            </span>
                            {ann.scheduledAt && (
                              <span className="flex items-center gap-1 text-amber-600">
                                <Calendar className="h-2.5 w-2.5" />Scheduled {formatDateTime(ann.scheduledAt)}
                              </span>
                            )}
                            {/* Target plans */}
                            <span className="flex items-center gap-1">
                              <Megaphone className="h-2.5 w-2.5" />
                              {ann.targetPlans === 'all' ? (
                                <span className="text-foreground font-medium">All tenants</span>
                              ) : (
                                ann.targetPlans.map((p) => (
                                  <span key={p} className={cn('rounded-full px-1.5 py-0 font-semibold capitalize', PLAN_STYLES[p])}>{p}</span>
                                ))
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="flex shrink-0 gap-1">
                          <Button size="sm" variant="outline" className="h-6 px-2 text-[10px]" onClick={(e) => e.stopPropagation()}>Edit</Button>
                          {ann.status === 'draft' && (
                            <Button size="sm" className="h-6 px-2 text-[10px]" onClick={(e) => e.stopPropagation()}>Publish</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filtered.length === 0 && (
                  <p className="p-8 text-center text-sm text-muted-foreground">No announcements match your filters.</p>
                )}
              </div>
            )}
            <div className="border-t bg-muted/20 px-4 py-2.5">
              <p className="text-xs text-muted-foreground">Showing {filtered.length} of {announcements.data?.length ?? 0} announcements</p>
            </div>
          </CardContent>
        </Card>

        {/* Preview panel */}
        {previewAnn && (
          <div className="space-y-4">
            <Card className="sticky top-4">
              <CardHeader className="border-b py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Tenant preview</CardTitle>
                  <button type="button" onClick={() => setPreview(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="py-4">
                {(() => {
                  const tm = TYPE_META[previewAnn.type];
                  const Icon = tm.icon;
                  return (
                    <div className={cn('rounded-xl border p-4 space-y-2', tm.bannerCls)}>
                      <div className="flex items-start gap-2">
                        <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', tm.iconColor)} />
                        <div>
                          <p className="text-sm font-semibold">{previewAnn.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{previewAnn.body}</p>
                        </div>
                      </div>
                      {previewAnn.expiresAt && (
                        <p className="text-[10px] text-muted-foreground pl-6">Expires {formatDate(previewAnn.expiresAt)}</p>
                      )}
                    </div>
                  );
                })()}

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={STATUS_META[previewAnn.status].variant} className="text-[10px]">{STATUS_META[previewAnn.status].label}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Audience</span>
                    <span className="font-medium capitalize">
                      {previewAnn.targetPlans === 'all' ? 'All tenants' : previewAnn.targetPlans.join(' + ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Created by</span>
                    <span className="font-medium">{previewAnn.createdBy}</span>
                  </div>
                  {previewAnn.publishedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Published</span>
                      <span className="font-medium">{formatDateTime(previewAnn.publishedAt)}</span>
                    </div>
                  )}
                  {previewAnn.scheduledAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Scheduled for</span>
                      <span className="font-medium text-amber-600">{formatDateTime(previewAnn.scheduledAt)}</span>
                    </div>
                  )}
                  {previewAnn.expiresAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Expires</span>
                      <span className="font-medium">{formatDate(previewAnn.expiresAt)}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2 border-t pt-3">
                  {previewAnn.status === 'draft' && <Button size="sm" className="flex-1 text-xs">Publish now</Button>}
                  {previewAnn.status === 'published' && (
                    <Button size="sm" variant="outline" className="flex-1 text-xs">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />Mark expired
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="flex-1 text-xs">Edit</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
