'use client';

import Link from 'next/link';
import type { ComponentType } from 'react';
import {
  ArrowRight,
  BookOpen,
  Clock,
  Headset,
  HelpCircle,
  Info,
  LifeBuoy,
  Mail,
  Monitor,
  Plug,
  Plus,
  Search,
  Shield,
  Sparkles,
  Ticket,
  Wallet,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
} from '@topiadesk/ui';
import {
  CURRENT_CUSTOMER,
  TENANT,
  kbArticles,
  kbCategories,
  mockPortalTickets,
} from '@/lib/mock-data';
import { relativeTime } from '@/lib/format';
import { PortalStatusBadge } from './_components/status-badge';

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  help: HelpCircle,
  shield: Shield,
  mail: Mail,
  monitor: Monitor,
  plug: Plug,
  wallet: Wallet,
};

export default function PortalHome() {
  const openTickets = mockPortalTickets.filter(
    (t) => t.status !== 'resolved' && t.status !== 'closed',
  );
  const waitingOnYou = openTickets.filter((t) => t.status === 'waiting_on_you');
  const popularArticles = [...kbArticles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);
  const firstName = CURRENT_CUSTOMER.name.split(' ')[0] ?? '';

  return (
    <div className="bg-muted/20">
      <section className="border-b bg-card">
        <div className="mx-auto max-w-5xl px-4 py-12 text-center lg:py-16">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {TENANT.name} support
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Hi {firstName}, how can we help today?
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Search our help centre, submit a request, or track an existing ticket.
          </p>

          <form
            action="/kb"
            method="GET"
            className="mx-auto mt-6 flex max-w-2xl items-center gap-2 rounded-xl border border-input bg-card p-1.5 shadow-sm focus-within:border-primary"
          >
            <Search className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              name="q"
              type="text"
              placeholder="Try &ldquo;reset password&rdquo; or &ldquo;new laptop&rdquo;..."
              className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <Button type="submit" size="sm" className="h-9">
              Search
            </Button>
          </form>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <span>Popular:</span>
            {['reset password', 'new laptop', 'VPN', 'shared mailbox'].map((q) => (
              <Link
                key={q}
                href={`/kb?q=${encodeURIComponent(q)}`}
                className="rounded-full bg-muted px-2.5 py-0.5 hover:bg-muted/70"
              >
                {q}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 lg:px-8">
        <StatusBanner />

        <section>
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-display text-lg font-bold">What would you like to do?</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ActionCard
              icon={Plus}
              title="Submit a request"
              description="Get help from our team via a new ticket"
              href="/submit"
              accent="primary"
            />
            <ActionCard
              icon={Ticket}
              title="Track a ticket"
              description={`You have ${openTickets.length} open tickets`}
              href="/tickets"
              badge={
                waitingOnYou.length > 0
                  ? { label: `${waitingOnYou.length} waiting on you`, tone: 'danger' }
                  : undefined
              }
            />
            <ActionCard
              icon={BookOpen}
              title="Browse the help centre"
              description={`${kbArticles.length}+ how-to articles and guides`}
              href="/kb"
            />
            <ActionCard
              icon={Headset}
              title="Talk to us"
              description={`Email ${TENANT.supportEmail} or call ${TENANT.supportPhone}`}
              href={`mailto:${TENANT.supportEmail}`}
            />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
              <div>
                <CardTitle className="text-sm">Your recent tickets</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Tickets you have raised with {TENANT.shortName} support
                </p>
              </div>
              <Link
                href="/tickets"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                View all
                <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y">
                {mockPortalTickets.slice(0, 5).map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/tickets/${t.id}`}
                      className="block px-4 py-3 transition-colors hover:bg-muted/40"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-muted-foreground">
                              {t.number}
                            </span>
                            <PortalStatusBadge status={t.status} />
                          </div>
                          <p className="mt-1 truncate text-sm font-medium">
                            {t.subject}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {t.category}
                            {t.agentName && (
                              <span> · Assigned to {t.agentName}</span>
                            )}
                          </p>
                        </div>
                        <div className="text-right text-[11px] text-muted-foreground">
                          <Clock className="ml-auto mr-0 inline-block h-3 w-3" />
                          <p className="mt-0.5">{relativeTime(t.updatedAt)}</p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t bg-muted/20 p-3 text-center">
                <Button asChild variant="outline" size="sm">
                  <Link href="/submit">
                    <Plus className="h-3 w-3" />
                    Submit a new request
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b py-3">
              <CardTitle className="text-sm">Popular help articles</CardTitle>
              <p className="text-xs text-muted-foreground">
                Resolved by our community this month
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y">
                {popularArticles.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/kb/${a.slug}`}
                      className="flex items-start gap-3 px-4 py-2.5 transition-colors hover:bg-muted/40"
                    >
                      <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange" />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-medium leading-snug">
                          {a.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {a.views.toLocaleString()} views · {a.helpfulPct}% found
                          this helpful
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t bg-muted/20 p-3 text-center">
                <Link
                  href="/kb"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Browse all articles
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-display text-lg font-bold">Browse by category</h2>
            <Link
              href="/kb"
              className="text-xs font-medium text-primary hover:underline"
            >
              All categories
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {kbCategories.map((c) => {
              const Icon = ICON_MAP[c.icon] ?? HelpCircle;
              return (
                <Link
                  key={c.slug}
                  href={`/kb?category=${c.slug}`}
                  className="group rounded-lg border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="mt-3 text-sm font-semibold">{c.label}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {c.description}
                  </p>
                  <p className="mt-2 text-[11px] font-medium text-muted-foreground">
                    {c.articleCount} articles ·{' '}
                    <span className="text-primary group-hover:underline">
                      Browse
                    </span>
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

interface ActionCardProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  accent?: 'primary';
  badge?: { label: string; tone: 'danger' | 'warning' };
}

function ActionCard({
  icon: Icon,
  title,
  description,
  href,
  accent,
  badge,
}: ActionCardProps) {
  const isPrimary = accent === 'primary';
  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col gap-2 rounded-lg border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md',
        isPrimary
          ? 'border-primary/40 bg-primary/5 hover:border-primary'
          : 'border-border bg-card hover:border-primary/40',
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            'grid h-9 w-9 place-items-center rounded-md',
            isPrimary
              ? 'bg-primary text-white'
              : 'bg-primary/10 text-primary',
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        {badge && (
          <Badge
            variant={badge.tone === 'danger' ? 'danger' : 'warning'}
            className="h-5 px-1.5 text-[10px]"
          >
            {badge.label}
          </Badge>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <span className="mt-auto inline-flex items-center gap-1 text-[11px] font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
        Open
        <ArrowRight className="h-3 w-3" />
      </span>
    </Link>
  );
}

function StatusBanner() {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
      <Info className="h-4 w-4 shrink-0" />
      <p className="flex-1">
        <strong>Planned maintenance.</strong> The customer portal will be
        unavailable on Saturday 02:00&ndash;02:30 UTC.
      </p>
      <Link
        href="#"
        className="inline-flex items-center gap-1 text-xs font-medium underline-offset-2 hover:underline"
      >
        Read more
        <LifeBuoy className="h-3 w-3" />
      </Link>
    </div>
  );
}
