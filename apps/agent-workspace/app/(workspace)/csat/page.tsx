'use client';

import { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, TrendingUp, Download, Filter } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  cn,
} from '@topiadesk/ui';
import { useCSATMetrics, useCSATSurveys } from '@/lib/queries';
import type { CSATRating } from '@/lib/mock-data';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StarRow({ rating, count, pct }: { rating: CSATRating; count: number; pct: number }) {
  const filled = Array.from({ length: 5 }, (_, i) => i < rating);
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center gap-0.5">
        {filled.map((f, i) => (
          <Star key={i} className={cn('h-3 w-3', f ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30')} />
        ))}
      </div>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/50">
        <div
          className={cn(
            'h-full rounded-full',
            rating >= 4 ? 'bg-emerald-500' : rating === 3 ? 'bg-amber-400' : 'bg-red-400',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-12 text-right text-xs text-muted-foreground">{count} ({pct}%)</span>
    </div>
  );
}

function RatingBadge({ rating }: { rating: CSATRating }) {
  const cls =
    rating >= 4 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
    rating === 3 ? 'bg-amber-50 text-amber-700 border-amber-200' :
    'bg-red-50 text-red-700 border-red-200';
  return (
    <div className={cn('flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold', cls)}>
      <Star className="h-3 w-3 fill-current" />
      {rating}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CSATPage() {
  const [filter, setFilter] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');
  const metrics = useCSATMetrics();
  const surveys = useCSATSurveys();

  const m = metrics.data;

  const filtered = surveys.data?.filter((s) => {
    if (filter === 'positive') return s.rating >= 4;
    if (filter === 'neutral') return s.rating === 3;
    if (filter === 'negative') return s.rating <= 2;
    return true;
  });

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
              Insights
            </p>
            <h1 className="font-display mt-0.5 text-2xl font-bold tracking-tight text-white">
              CSAT &amp; Quality
            </h1>
            <p className="mt-0.5 text-sm text-white/70">
              {m ? `${m.totalResponses} responses · ${m.responsePct}% response rate` : 'Loading…'}
            </p>
          </div>
          <Button
            size="sm"
            className="border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            variant="outline"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.isPending
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}><CardContent className="p-5"><Skeleton className="mb-2 h-4 w-24" /><Skeleton className="h-8 w-16" /></CardContent></Card>
            ))
          : [
              { label: 'CSAT score', value: `${m?.avgScore.toFixed(1)} / 5`, icon: Star },
              { label: 'Responses', value: m?.totalResponses, icon: MessageSquare },
              { label: 'Response rate', value: `${m?.responsePct}%`, icon: ThumbsUp },
              { label: 'Trend', value: '+0.1 vs last month', icon: TrendingUp },
            ].map(({ label, value, icon: Icon }) => (
              <Card key={label}>
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">{label}</span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <p className="font-display text-2xl font-bold tracking-tight text-foreground">{value}</p>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* ── Score distribution ── */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Score distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-0">
            {metrics.isPending
              ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)
              : [...(m?.dist ?? [])].reverse().map((d) => (
                  <StarRow key={d.rating} rating={d.rating} count={d.count} pct={d.pct} />
                ))}
          </CardContent>
        </Card>

        {/* ── Monthly trend ── */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Monthly score trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {metrics.isPending ? (
              <Skeleton className="h-28 w-full" />
            ) : (
              <div className="flex h-28 items-end gap-3">
                {m?.trend.map((t) => {
                  const h = ((t.score - 1) / 4) * 100;
                  return (
                    <div key={t.label} className="flex flex-1 flex-col items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-foreground">{t.score.toFixed(1)}</span>
                      <div className="flex w-full flex-1 items-end">
                        <div
                          className="w-full rounded-t bg-blue-500 transition-all"
                          style={{ height: `${h}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{t.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Survey results ── */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-sm font-semibold">Recent survey responses</CardTitle>
            <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/30 p-0.5">
              {(['all', 'positive', 'neutral', 'negative'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'rounded-md px-3 py-1 text-xs font-medium capitalize transition-all',
                    filter === f
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-2">
          <div className="divide-y divide-border/60">
            {surveys.isPending
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-3 p-4">
                    <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))
              : filtered?.map((s) => (
                  <div key={s.id} className="flex gap-3 p-4 hover:bg-muted/20 transition-colors">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-blue-100 text-[10px] font-bold text-blue-700">
                        {s.customer.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-foreground">{s.customer}</span>
                        <RatingBadge rating={s.rating} />
                        <Badge variant="outline" className="text-[10px]">{s.ticketNumber}</Badge>
                        <span className="text-xs text-muted-foreground truncate">{s.subject}</span>
                      </div>
                      {s.comment && (
                        <p className="text-xs text-muted-foreground line-clamp-2">&ldquo;{s.comment}&rdquo;</p>
                      )}
                      <p className="mt-1 text-[10px] text-muted-foreground/60">
                        Agent: {s.agent} · {s.category}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
          {filtered?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="mb-2 h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm font-medium text-foreground">No results</p>
              <p className="text-xs text-muted-foreground">No responses match the selected filter.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
