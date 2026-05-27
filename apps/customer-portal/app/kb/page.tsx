'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import {
  ArrowRight,
  BookOpen,
  Clock,
  HelpCircle,
  Mail,
  Monitor,
  Plug,
  Search,
  Shield,
  Sparkles,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Input,
} from '@topiadesk/ui';
import { kbArticles, kbCategories } from '@/lib/mock-data';
import { shortDate } from '@/lib/format';

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  help: HelpCircle,
  shield: Shield,
  mail: Mail,
  monitor: Monitor,
  plug: Plug,
  wallet: Wallet,
};

export default function KbHome() {
  const [query, setQuery] = useState('');
  const [categorySlug, setCategorySlug] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return kbArticles.filter((a) => {
      if (categorySlug && a.category !== categorySlug) return false;
      if (
        q &&
        !a.title.toLowerCase().includes(q) &&
        !a.summary.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [query, categorySlug]);

  const popular = [...kbArticles].sort((a, b) => b.views - a.views).slice(0, 5);
  const recent = [...kbArticles]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5);

  const selectedCategory = categorySlug
    ? kbCategories.find((c) => c.slug === categorySlug)
    : null;

  return (
    <div className="bg-[#F1F5FA] min-h-screen">
      {/* Dark hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1529] to-[#0F2044]">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute -left-32 top-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-48 w-48 rounded-full bg-blue-400/8 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 py-12 text-center lg:py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-300">
            <BookOpen className="h-3 w-3" />
            Help centre
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Find an answer in seconds
          </h1>
          <p className="mt-2 text-sm text-white/60">
            {kbArticles.length}+ articles, guides and how-tos for everything we support.
          </p>

          <div className="mx-auto mt-8 max-w-2xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                placeholder="Search articles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-12 border-white/10 bg-white/[0.06] pl-11 text-base text-white placeholder:text-white/40 focus-visible:border-blue-400/40 focus-visible:ring-blue-400/20"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 lg:px-8">
        {!query && !categorySlug && (
          <section>
            <div className="mb-3 flex items-end justify-between">
              <h2 className="font-display text-lg font-bold">Categories</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
              {kbCategories.map((c) => {
                const Icon = ICON_MAP[c.icon] ?? HelpCircle;
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => setCategorySlug(c.slug)}
                    className="group flex items-start gap-3 rounded-lg border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{c.label}</p>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {c.description}
                      </p>
                      <p className="mt-1 text-[11px] font-medium text-primary group-hover:underline">
                        Browse {c.articleCount} articles
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {(query || categorySlug) && (
          <section>
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {selectedCategory ? selectedCategory.label : 'Search results'}
                </p>
                <h2 className="font-display text-lg font-bold">
                  {filtered.length} article{filtered.length === 1 ? '' : 's'}
                  {query && (
                    <span className="text-muted-foreground">
                      {' '}
                      for &ldquo;{query}&rdquo;
                    </span>
                  )}
                </h2>
              </div>
              {(query || categorySlug) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setQuery('');
                    setCategorySlug(null);
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="No articles match"
                description="Try a different search or browse a category."
                action={
                  <Button asChild variant="outline" size="sm">
                    <Link href="/submit">Submit a request instead</Link>
                  </Button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filtered.map((a) => {
                  const cat = kbCategories.find((c) => c.slug === a.category);
                  return (
                    <Link
                      key={a.slug}
                      href={`/kb/${a.slug}`}
                      className="group flex items-start gap-4 rounded-lg border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/40"
                    >
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {cat && (
                            <Badge variant="outline" className="text-[10px]">
                              {cat.label}
                            </Badge>
                          )}
                          <span className="text-[11px] text-muted-foreground">
                            Updated {shortDate(a.updatedAt)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-semibold group-hover:text-primary">
                          {a.title}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                          {a.summary}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {a.views.toLocaleString()} views ·{' '}
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {a.helpfulPct}% helpful
                          </span>
                        </p>
                      </div>
                      <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {!query && !categorySlug && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-orange" />
                    Most popular
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Articles solving the most tickets this month
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y">
                  {popular.map((a, idx) => (
                    <li key={a.slug}>
                      <Link
                        href={`/kb/${a.slug}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40"
                      >
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-orange/10 text-[10px] font-bold text-orange">
                          {idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium leading-snug">
                            {a.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {a.views.toLocaleString()} views
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Recently updated
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Fresh content from our team
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y">
                  {recent.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/kb/${a.slug}`}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-muted/40"
                      >
                        <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-medium leading-snug">
                            {a.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            Updated {shortDate(a.updatedAt)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="rounded-lg border bg-card p-6 text-center">
          <p className="font-display text-lg font-bold">
            Still need help?
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Can&rsquo;t find what you&rsquo;re looking for? Our team is ready.
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Button asChild>
              <Link href="/submit">Submit a request</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tickets">Track an existing ticket</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
