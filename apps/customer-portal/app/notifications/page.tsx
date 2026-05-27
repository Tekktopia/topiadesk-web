'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  Bell,
  BookOpen,
  CheckCheck,
  ExternalLink,
  Megaphone,
  Ticket,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Separator,
  cn,
} from '@topiadesk/ui';
import { mockNotifications, type PortalNotification } from '@/lib/mock-data';

const TYPE_META: Record<
  PortalNotification['type'],
  { icon: React.ComponentType<{ className?: string }>; tone: string; label: string }
> = {
  ticket: {
    icon: Ticket,
    tone: 'bg-blue-100 text-blue-700',
    label: 'Ticket',
  },
  kb: {
    icon: BookOpen,
    tone: 'bg-orange/15 text-orange',
    label: 'Knowledge base',
  },
  announcement: {
    icon: Megaphone,
    tone: 'bg-amber-100 text-amber-700',
    label: 'Announcement',
  },
};

type FilterKey = 'all' | 'unread' | PortalNotification['type'];

const FILTERS: { id: FilterKey; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'ticket', label: 'Tickets' },
  { id: 'kb', label: 'Knowledge base' },
  { id: 'announcement', label: 'Announcements' },
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [items, setItems] = useState(mockNotifications);

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    if (filter === 'unread') return items.filter((n) => n.unread);
    return items.filter((n) => n.type === filter);
  }, [filter, items]);

  const unreadCount = items.filter((n) => n.unread).length;

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  function markRead(id: string) {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  }

  return (
    <div className="bg-[#F1F5FA] min-h-screen">
      {/* Dark hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1529] to-[#0F2044]">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute -left-32 top-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-48 w-48 rounded-full bg-blue-400/8 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 py-10 lg:px-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-300/70">Updates</p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white">Notifications</h1>
            <p className="mt-2 text-sm text-white/60">
              {unreadCount} unread &middot; {items.length} total
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" onClick={markAllRead}>
              <CheckCheck className="h-3 w-3" />
              Mark all read
            </Button>
            <Button variant="ghost" size="sm" className="text-white/70 hover:bg-white/10 hover:text-white" asChild>
              <a href="#preferences">Preferences</a>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-5 px-4 py-8 lg:px-8">
        <Card>
          <div className="flex flex-wrap items-center gap-1 border-b p-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  filter === f.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <EmptyState
                icon={Bell}
                title="You're all caught up"
                description="Nothing to see in this view."
                className="m-6"
              />
            ) : (
              <ul className="divide-y">
                {filtered.map((n) => {
                  const meta = TYPE_META[n.type];
                  const Icon = meta.icon;
                  const body = (
                    <div className="flex items-start gap-3 px-4 py-3">
                      <div
                        className={cn(
                          'mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full',
                          meta.tone,
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold">{n.title}</p>
                          {n.unread && (
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          )}
                          <Badge variant="outline" className="text-[9px]">
                            {meta.label}
                          </Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {n.body}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {n.time}
                        </p>
                      </div>
                      {n.link && (
                        <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      )}
                    </div>
                  );
                  return (
                    <li
                      key={n.id}
                      className={cn(
                        'transition-colors hover:bg-muted/40',
                        n.unread && 'bg-primary/[0.02]',
                      )}
                      onClick={() => markRead(n.id)}
                    >
                      {n.link ? (
                        <Link href={n.link} className="block">
                          {body}
                        </Link>
                      ) : (
                        <div>{body}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <PreferencesCard />
      </div>
    </div>
  );
}

const EVENT_TYPES = [
  { id: 'ticket-reply', label: 'When an agent replies to my ticket', email: true, inapp: true, sms: false },
  { id: 'ticket-resolved', label: 'When my ticket is marked resolved', email: true, inapp: true, sms: false },
  { id: 'ticket-stalled', label: 'When I need to reply to keep things moving', email: true, inapp: true, sms: true },
  { id: 'kb-update', label: 'Knowledge base updates in my categories', email: false, inapp: true, sms: false },
  { id: 'announcement', label: 'Planned maintenance and announcements', email: true, inapp: true, sms: false },
];

function PreferencesCard() {
  return (
    <Card id="preferences">
      <CardHeader className="border-b py-3">
        <CardTitle className="text-sm">Notification preferences</CardTitle>
        <p className="text-xs text-muted-foreground">
          Choose how we should reach you for each kind of update.
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="hidden border-b bg-muted/30 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:grid sm:grid-cols-[1fr_60px_60px_60px]">
          <span>Event</span>
          <span className="text-center">Email</span>
          <span className="text-center">In-app</span>
          <span className="text-center">SMS</span>
        </div>
        <ul className="divide-y">
          {EVENT_TYPES.map((et, i) => (
            <li
              key={et.id}
              className="grid grid-cols-[1fr_60px_60px_60px] items-center gap-2 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium">{et.label}</p>
              </div>
              <input
                type="checkbox"
                defaultChecked={et.email}
                className="mx-auto h-4 w-4 accent-primary"
                aria-label="Email"
              />
              <input
                type="checkbox"
                defaultChecked={et.inapp}
                className="mx-auto h-4 w-4 accent-primary"
                aria-label="In-app"
              />
              <input
                type="checkbox"
                defaultChecked={et.sms}
                className="mx-auto h-4 w-4 accent-primary"
                aria-label="SMS"
              />
              {i === 0 && <Separator className="col-span-4 hidden" />}
            </li>
          ))}
        </ul>
        <div className="flex justify-end border-t bg-muted/20 p-3">
          <Button size="sm">Save preferences</Button>
        </div>
      </CardContent>
    </Card>
  );
}
