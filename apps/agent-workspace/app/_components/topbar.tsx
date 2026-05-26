'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Bell,
  BookOpen,
  ChevronRight,
  Home,
  LifeBuoy,
  MessageSquareText,
  Moon,
  Search,
  Sun,
  Ticket,
  Users,
  Boxes,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Input,
  Kbd,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from '@topiadesk/ui';

const ROUTE_LABELS: Record<string, { label: string; icon: typeof Home }> = {
  '/': { label: 'Dashboard', icon: Home },
  '/tickets': { label: 'Tickets', icon: Ticket },
  '/assets': { label: 'Assets', icon: Boxes },
  '/contacts': { label: 'Contacts', icon: Users },
  '/knowledge': { label: 'Knowledge base', icon: BookOpen },
};

interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  icon: typeof Ticket;
  tone: 'default' | 'warning' | 'danger';
}

const NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'SLA breached',
    body: '#1021 — Two CCTV cameras at Ikeja branch are offline',
    time: '12m ago',
    unread: true,
    icon: Ticket,
    tone: 'danger',
  },
  {
    id: 'n2',
    title: 'New mention',
    body: '@Adaeze tagged you on #1024 (Cannot connect to office VPN)',
    time: '38m ago',
    unread: true,
    icon: MessageSquareText,
    tone: 'default',
  },
  {
    id: 'n3',
    title: 'Asset warranty expiring',
    body: 'CON-CCTV-042 warranty ends in 14 days',
    time: '2h ago',
    unread: false,
    icon: Boxes,
    tone: 'warning',
  },
];

export function Topbar() {
  const [commandOpen, setCommandOpen] = useState(false);

  // Cmd/Ctrl+K to open command palette
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen(true);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
        <Breadcrumbs />

        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="group ml-auto flex h-9 w-72 items-center gap-2 rounded-md border border-input bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 text-left">
            Search tickets, assets, contacts...
          </span>
          <span className="flex items-center gap-1">
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd>
          </span>
        </button>

        <div className="ml-auto flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="What's new"
                className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Sparkles className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>What&rsquo;s new</TooltipContent>
          </Tooltip>

          <NotificationsMenu unreadCount={unreadCount} />

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="Help and resources"
                className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <LifeBuoy className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Help · F1</TooltipContent>
          </Tooltip>

          <ThemeToggle />
        </div>
      </header>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}

function Breadcrumbs() {
  const pathname = usePathname();
  const params = useParams() as Record<string, string | string[] | undefined>;

  // Build a breadcrumb trail from the pathname.
  const parts = pathname.split('/').filter(Boolean);
  const trail: Array<{ href: string; label: string; icon?: typeof Home }> = [];

  if (parts.length === 0) {
    trail.push({ href: '/', label: 'Dashboard', icon: Home });
  } else {
    let cumulative = '';
    for (const part of parts) {
      cumulative += `/${part}`;
      // dynamic param like [id] becomes the actual id
      const meta = ROUTE_LABELS[cumulative];
      const fallback =
        params['id'] && cumulative.endsWith(String(params['id']))
          ? `#${String(params['id']).replace(/^t-/, '').toUpperCase()}`
          : capitalize(part);
      trail.push({
        href: cumulative,
        label: meta?.label ?? fallback,
        icon: meta?.icon,
      });
    }
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex min-w-0 items-center gap-1 text-sm"
    >
      {trail.map((node, i) => {
        const isLast = i === trail.length - 1;
        const Icon = node.icon;
        return (
          <div key={node.href} className="flex min-w-0 items-center gap-1">
            {i > 0 && (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
            )}
            <Link
              href={node.href}
              className={cn(
                'inline-flex shrink-0 items-center gap-1.5 rounded px-1.5 py-1 transition-colors hover:bg-muted',
                isLast ? 'font-semibold text-foreground' : 'text-muted-foreground',
              )}
            >
              {Icon && i === 0 && <Icon className="h-3.5 w-3.5" />}
              <span className="max-w-[200px] truncate">{node.label}</span>
            </Link>
          </div>
        );
      })}
    </nav>
  );
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function NotificationsMenu({ unreadCount }: { unreadCount: number }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Notifications (${unreadCount} unread)`}
          className="relative grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b p-3">
          <DropdownMenuLabel className="px-0 py-0">Notifications</DropdownMenuLabel>
          <button
            type="button"
            className="text-xs font-medium text-primary hover:underline"
          >
            Mark all as read
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {NOTIFICATIONS.map((n) => {
            const Icon = n.icon;
            return (
              <button
                key={n.id}
                type="button"
                className="flex w-full items-start gap-3 border-b p-3 text-left transition-colors last:border-b-0 hover:bg-muted"
              >
                <div
                  className={cn(
                    'mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full',
                    n.tone === 'danger' && 'bg-red-100 text-red-700',
                    n.tone === 'warning' && 'bg-amber-100 text-amber-700',
                    n.tone === 'default' && 'bg-blue-100 text-blue-700',
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{n.title}</p>
                    {n.unread && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {n.body}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {n.time}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="border-t p-2">
          <Link
            href="#"
            className="flex items-center justify-center gap-1 rounded-md py-2 text-xs font-medium text-primary hover:bg-muted"
          >
            View all notifications
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    setIsDark(html.classList.contains('dark'));
  }, []);

  function toggle() {
    const html = document.documentElement;
    const next = !isDark;
    html.classList.toggle('dark', next);
    html.classList.toggle('light', !next);
    setIsDark(next);
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={toggle}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        {isDark ? 'Light theme' : 'Dark theme'}
      </TooltipContent>
    </Tooltip>
  );
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COMMAND_GROUPS = [
  {
    label: 'Tickets',
    items: [
      { id: 't-1024', label: '#1024 · Cannot connect to office VPN', icon: Ticket },
      { id: 't-1021', label: '#1021 · Two CCTV cameras offline', icon: Ticket },
      { id: 't-1020', label: '#1020 · Outlook keeps asking for password', icon: Ticket },
    ],
  },
  {
    label: 'Assets',
    items: [
      { id: 'as-mbp-014', label: 'CON-LT-014 · MacBook Pro 14"', icon: Boxes },
      { id: 'as-cct-041', label: 'CON-CCTV-041 · Hikvision DS-2CD2363G2', icon: Boxes },
    ],
  },
  {
    label: 'Quick actions',
    items: [
      { id: 'new-ticket', label: 'Create new ticket', icon: Ticket },
      { id: 'new-asset', label: 'Add new asset', icon: Boxes },
      { id: 'new-contact', label: 'Create new contact', icon: Users },
    ],
  },
];

function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  const filteredGroups = COMMAND_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((it) =>
      query
        ? it.label.toLowerCase().includes(query.toLowerCase())
        : true,
    ),
  })).filter((g) => g.items.length > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl gap-0 p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Command palette</DialogTitle>
          <DialogDescription>
            Search tickets, assets, contacts and quick actions.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tickets, assets, contacts and actions..."
            className="h-8 border-0 px-0 shadow-none focus-visible:ring-0"
          />
          <Kbd>Esc</Kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filteredGroups.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No matches for &ldquo;{query}&rdquo;.
            </p>
          )}
          {filteredGroups.map((g) => (
            <div key={g.label} className="mb-3 last:mb-0">
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {g.label}
              </p>
              <ul className="space-y-0.5">
                {g.items.map((it) => {
                  const Icon = it.icon;
                  return (
                    <li key={it.id}>
                      <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
                      >
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="flex-1 truncate text-left">
                          {it.label}
                        </span>
                        <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t bg-muted/40 px-3 py-2 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd> navigate
            </span>
            <span className="flex items-center gap-1">
              <Kbd>↵</Kbd> open
            </span>
            <span className="flex items-center gap-1">
              <Kbd>Esc</Kbd> close
            </span>
          </div>
          <Badge variant="outline" className="text-[9px]">
            Topiadesk
          </Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
}
