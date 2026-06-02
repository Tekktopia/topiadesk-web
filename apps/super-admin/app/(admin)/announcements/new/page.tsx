'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Info, Loader2, Megaphone, Sparkles, TriangleAlert, Wrench } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
  cn,
} from '@topiadesk/ui';
import type { AnnouncementType, TenantPlan } from '@/lib/mock-data';

const TYPES: { id: AnnouncementType; label: string; icon: typeof Info; color: string }[] = [
  { id: 'info', label: 'Info', icon: Info, color: 'text-blue-600' },
  { id: 'feature', label: 'Feature', icon: Sparkles, color: 'text-coral' },
  { id: 'warning', label: 'Warning', icon: TriangleAlert, color: 'text-amber-600' },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench, color: 'text-slate-600' },
];

const PLANS: TenantPlan[] = ['starter', 'business', 'enterprise'];

export default function NewAnnouncementPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState<AnnouncementType>('info');
  const [allPlans, setAllPlans] = useState(true);
  const [plans, setPlans] = useState<TenantPlan[]>([]);
  const [schedule, setSchedule] = useState<'now' | 'later'>('now');
  const [scheduledAt, setScheduledAt] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = title.trim().length > 2 && body.trim().length > 4 && (schedule === 'now' || !!scheduledAt);

  function togglePlan(p: TenantPlan) {
    setPlans((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    window.setTimeout(() => setSubmitting(false), 800);
  }

  const TypeIcon = TYPES.find((t) => t.id === type)!.icon;

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
        <div className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link href="/announcements" className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white">
                <ArrowLeft className="h-3 w-3" /> Announcements
              </Link>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">New announcement</h1>
              <p className="mt-0.5 text-sm text-white/70">Broadcast a platform banner or notice to selected tenants.</p>
            </div>
            <div className="flex gap-2">
              <Button form="new-ann-form" type="submit" size="sm" disabled={!canSubmit || submitting} className="bg-coral text-white hover:bg-coral-dark">
                {submitting && <Loader2 className="h-3 w-3 animate-spin" />} Save draft
              </Button>
              <Button form="new-ann-form" type="submit" size="sm" disabled={!canSubmit || submitting} className="bg-white text-foreground hover:bg-white/90">
                {schedule === 'now' ? 'Publish' : 'Schedule'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <form id="new-ann-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="flex items-center gap-2 text-sm"><Megaphone className="h-4 w-4 text-coral" /> Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Scheduled maintenance this Saturday" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body">Body *</Label>
                  <Textarea id="body" rows={5} value={body} onChange={(e) => setBody(e.target.value)}
                    placeholder="What do tenants need to know? Markdown supported." />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {TYPES.map((t) => {
                      const Icon = t.icon;
                      return (
                        <button key={t.id} type="button" onClick={() => setType(t.id)}
                          className={cn('flex flex-col items-center gap-1 rounded-md border py-2 text-[11px] transition-colors',
                            type === t.id ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card hover:bg-muted')}>
                          <Icon className={cn('h-4 w-4', type === t.id ? 'text-primary' : t.color)} />
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Audience &amp; schedule</CardTitle></CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label>Target plans</Label>
                  <label className="flex cursor-pointer items-center gap-2 text-xs">
                    <input type="checkbox" checked={allPlans} onChange={(e) => setAllPlans(e.target.checked)} className="h-3.5 w-3.5 accent-primary" />
                    All tenants
                  </label>
                  <div className={cn('flex gap-1.5', allPlans && 'opacity-50 pointer-events-none')}>
                    {PLANS.map((p) => (
                      <button key={p} type="button" onClick={() => togglePlan(p)}
                        className={cn('flex-1 rounded-md border py-2 text-[11px] capitalize transition-colors',
                          plans.includes(p) ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card hover:bg-muted')}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Publishing</Label>
                  <div className="flex gap-1.5">
                    {(['now', 'later'] as const).map((s) => (
                      <button key={s} type="button" onClick={() => setSchedule(s)}
                        className={cn('flex-1 rounded-md border py-2 text-[11px] capitalize transition-colors',
                          schedule === s ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card hover:bg-muted')}>
                        {s === 'now' ? 'Publish now' : 'Schedule'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {schedule === 'later' && (
                    <div className="space-y-2">
                      <Label htmlFor="sched">Publish at</Label>
                      <Input id="sched" type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="exp">Expires (optional)</Label>
                    <Input id="exp" type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Banner preview</CardTitle></CardHeader>
              <CardContent className="p-4">
                <div className="flex items-start gap-2 rounded-md border bg-muted/40 p-3 text-xs">
                  <TypeIcon className={cn('mt-0.5 h-4 w-4 shrink-0', TYPES.find((t) => t.id === type)!.color)} />
                  <div>
                    <p className="font-semibold">{title || 'Announcement title'}</p>
                    <p className="mt-0.5 text-muted-foreground line-clamp-3">{body || 'Body text appears here.'}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  <Badge variant="outline" className="capitalize">{type}</Badge>
                  <Badge variant="outline">{allPlans ? 'All tenants' : plans.length ? plans.join(', ') : 'No plans'}</Badge>
                  <Badge variant="outline">{schedule === 'now' ? 'Publish now' : 'Scheduled'}</Badge>
                </div>
              </CardContent>
            </Card>
          </aside>
        </form>
      </div>
    </div>
  );
}
