'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Search,
  Eye,
  ThumbsUp,
  Edit3,
  Archive,
  Send,
  FileText,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Skeleton,
  cn,
} from '@topiadesk/ui';
import { useKBArticles } from '@/lib/queries';
import type { KBStatus } from '@/lib/mock-data';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function statusBadge(status: KBStatus) {
  switch (status) {
    case 'published': return <Badge variant="default" className="text-[10px] bg-emerald-100 text-emerald-700 border-emerald-200">Published</Badge>;
    case 'draft':     return <Badge variant="outline" className="text-[10px]">Draft</Badge>;
    case 'archived':  return <Badge variant="outline" className="text-[10px] text-muted-foreground">Archived</Badge>;
  }
}

function helpfulPct(helpful: number, total: number) {
  if (total === 0) return null;
  const pct = Math.round((helpful / total) * 100);
  return (
    <span className={cn('text-xs font-medium', pct >= 80 ? 'text-emerald-600' : pct >= 60 ? 'text-amber-600' : 'text-red-500')}>
      {pct}%
    </span>
  );
}

function timeAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KnowledgePage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | KBStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const articles = useKBArticles();

  const categories = useMemo(() => {
    const cats = new Set(['All', ...(articles.data?.map((a) => a.category) ?? [])]);
    return [...cats];
  }, [articles.data]);

  const counts = useMemo(() => ({
    all: articles.data?.length ?? 0,
    published: articles.data?.filter((a) => a.status === 'published').length ?? 0,
    draft: articles.data?.filter((a) => a.status === 'draft').length ?? 0,
    archived: articles.data?.filter((a) => a.status === 'archived').length ?? 0,
  }), [articles.data]);

  const filtered = useMemo(() => {
    return (articles.data ?? []).filter((a) => {
      const q = search.toLowerCase();
      const matchSearch = !q || a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || a.author.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchCat = categoryFilter === 'All' || a.category === categoryFilter;
      return matchSearch && matchStatus && matchCat;
    });
  }, [articles.data, search, statusFilter, categoryFilter]);

  const topArticles = useMemo(
    () => [...(articles.data ?? [])].filter((a) => a.status === 'published').sort((a, b) => b.views - a.views).slice(0, 3),
    [articles.data],
  );

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
      {/* ── Gradient header ── */}
      <div
        className="relative overflow-hidden rounded-2xl bg-navy px-6 py-5 shadow-lg shadow-navy/15"
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
              Helpdesk
            </p>
            <h1 className="font-display mt-0.5 text-2xl font-bold tracking-tight text-white">
              Knowledge Base
            </h1>
            <p className="mt-0.5 text-sm text-white/70">
              {counts.published} published · {counts.draft} drafts
            </p>
          </div>
          <Button size="sm" className="bg-coral text-white hover:bg-white/90">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New article
          </Button>
        </div>
      </div>
      </div>

      <div className="flex-1 min-h-0 space-y-5 overflow-y-auto p-5 pt-5">

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Published articles', value: counts.published, icon: FileText },
          { label: 'Total views (30d)', value: articles.data?.reduce((s, a) => s + a.views, 0).toLocaleString() ?? '—', icon: Eye },
          { label: 'Helpful votes', value: articles.data?.reduce((s, a) => s + a.helpfulVotes, 0).toLocaleString() ?? '—', icon: ThumbsUp },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-3 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="font-display text-xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-4">
        {/* ── Sidebar: top articles + categories ── */}
        <div className="space-y-4 lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Top articles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {topArticles.map((a, i) => (
                <div key={a.id} className="flex gap-2">
                  <span className="mt-0.5 text-xs font-bold text-muted-foreground/50">#{i + 1}</span>
                  <div>
                    <p className="text-xs font-medium text-foreground leading-snug">{a.title}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <Eye className="h-2.5 w-2.5" /> {a.views.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 pt-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs transition-colors',
                    categoryFilter === cat
                      ? 'bg-blue-50 font-semibold text-blue-700'
                      : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground',
                  )}
                >
                  <span>{cat}</span>
                  {cat !== 'All' && (
                    <span className="text-[10px] text-muted-foreground/60">
                      {articles.data?.filter((a) => a.category === cat).length}
                    </span>
                  )}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ── Article list ── */}
        <div className="space-y-4 lg:col-span-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search articles…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/30 p-0.5">
              {(['all', 'published', 'draft', 'archived'] as const).map((f) => (
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
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {articles.isPending
              ? Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                    </CardContent>
                  </Card>
                ))
              : filtered.map((a) => (
                  <Card key={a.id} className="transition-shadow hover:shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/50">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-0.5">
                            <p className="text-sm font-medium text-foreground">{a.title}</p>
                            {statusBadge(a.status)}
                            <Badge variant="outline" className="text-[10px]">{a.category}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">{a.excerpt}</p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
                            {a.status === 'published' && (
                              <>
                                <span className="flex items-center gap-1">
                                  <Eye className="h-2.5 w-2.5" /> {a.views.toLocaleString()} views
                                </span>
                                <span className="flex items-center gap-1">
                                  <ThumbsUp className="h-2.5 w-2.5" /> {helpfulPct(a.helpfulVotes, a.totalVotes)} helpful
                                </span>
                              </>
                            )}
                            <span>By {a.author}</span>
                            <span>Updated {timeAgo(a.updatedAt)}</span>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>
                          {a.status === 'draft' && (
                            <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                              <Send className="mr-1 h-3 w-3" /> Publish
                            </Button>
                          )}
                          {a.status === 'published' && (
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                              <Archive className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            {!articles.isPending && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <BookOpen className="mb-2 h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm font-medium text-foreground">No articles found</p>
                <p className="text-xs text-muted-foreground">Adjust your filters or create a new article.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
