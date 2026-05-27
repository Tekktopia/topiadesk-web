'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpen,
  Boxes,
  Building2,
  CalendarClock,
  ChevronDown,
  ChevronsUpDown,
  CircleHelp,
  Cog,
  Filter,
  Headset,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  Network,
  Phone,
  Plus,
  Search,
  Server,
  ShieldCheck,
  Star,
  Ticket,
  Users,
  Workflow,
  Zap,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from '@topiadesk/ui';

interface NavLink {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: number;
  badgeVariant?: 'default' | 'danger' | 'warning';
  exactMatch?: boolean;
}

interface NavSection {
  id: string;
  label: string;
  links: NavLink[];
  defaultOpen?: boolean;
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    defaultOpen: true,
    links: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/tickets', label: 'Tickets', icon: Ticket, badge: 47 },
      { href: '/assets/dashboard', label: 'Assets', icon: Boxes },
      { href: '/contacts', label: 'Contacts', icon: Users },
    ],
  },
  {
    id: 'helpdesk',
    label: 'Helpdesk',
    defaultOpen: true,
    links: [
      { href: '/knowledge', label: 'Knowledge base', icon: BookOpen },
      { href: '/automations', label: 'Automations', icon: Workflow },
      { href: '/sla', label: 'SLA policies', icon: ShieldCheck },
      { href: '/channels', label: 'Channels', icon: Headset },
    ],
  },
  {
    id: 'monitoring',
    label: 'Monitoring & NOC',
    defaultOpen: false,
    links: [
      { href: '/monitoring',             label: 'NOC Dashboard',   icon: LayoutDashboard, exactMatch: true },
      { href: '/monitoring/devices',     label: 'Device list',     icon: Server },
      { href: '/monitoring/down',        label: 'Down & problems', icon: AlertTriangle,   badge: 3, badgeVariant: 'danger' },
      { href: '/monitoring/alerts',      label: 'Alerts feed',     icon: Bell,            badge: 6, badgeVariant: 'danger' },
      { href: '/monitoring/incidents',   label: 'Incidents',       icon: Activity },
      { href: '/monitoring/topology',    label: 'Topology',        icon: Network },
      { href: '/monitoring/maintenance', label: 'Maintenance',     icon: CalendarClock },
      { href: '/monitoring/reports',     label: 'Availability',    icon: BarChart3 },
    ],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    defaultOpen: false,
    links: [
      { href: '/assets',     label: 'Asset inventory', icon: Boxes },
      { href: '/inventory',  label: 'Inventory',       icon: Server },
      { href: '/audits',     label: 'Audits',          icon: Filter },
    ],
  },
  {
    id: 'insights',
    label: 'Insights',
    defaultOpen: false,
    links: [
      { href: '/reports', label: 'Reports',      icon: BarChart3 },
      { href: '/csat',    label: 'CSAT & quality', icon: Star },
    ],
  },
];

interface PinnedView {
  href: string;
  label: string;
  count: number;
  tone?: 'default' | 'warning' | 'danger';
}

const PINNED_VIEWS: PinnedView[] = [
  { href: '/tickets?view=my-open',    label: 'My open',        count: 14 },
  { href: '/tickets?view=unassigned', label: 'Unassigned',     count: 6 },
  { href: '/tickets?view=overdue',    label: 'Overdue',        count: 1, tone: 'danger' },
  { href: '/tickets?view=today',      label: 'Closing today',  count: 9, tone: 'warning' },
];

const CURRENT_TENANT = {
  name:      'ConsomoAfrica',
  subdomain: 'consomoafrica',
  plan:      'Business',
  emoji:     '🌍',
};

const CURRENT_USER = {
  name:   'Tunde Bakare',
  email:  'tunde@consomoafrica.com',
  role:   'Helpdesk Agent',
  status: 'available' as const,
};

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/[0.06] bg-[#0B1120] md:flex">
      <TenantSwitcher />
      <NewButton />
      <NavSections />
      <UserBox />
    </aside>
  );
}

function TenantSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-14 items-center gap-2.5 border-b border-white/[0.07] px-3 text-left transition-colors hover:bg-white/[0.04]"
        >
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-sm shadow-lg shadow-blue-500/30">
            {CURRENT_TENANT.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-100">
              {CURRENT_TENANT.name}
            </p>
            <p className="truncate font-mono text-[10px] text-gray-500">
              {CURRENT_TENANT.subdomain}.topiadesk.com
            </p>
          </div>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-gray-600" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Current tenant</DropdownMenuLabel>
        <DropdownMenuItem>
          <Building2 className="h-4 w-4" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{CURRENT_TENANT.name}</span>
            <span className="text-[10px] text-muted-foreground">
              {CURRENT_TENANT.plan} plan
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Switch tenant</DropdownMenuLabel>
        <DropdownMenuItem>
          <span className="text-base">💳</span>
          Kasi Pay
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="text-base">⚡</span>
          FlairTech
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/organizations">
            <Users className="h-4 w-4" />
            View all tenants
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Plus className="h-4 w-4" />
          Create new tenant
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NewButton() {
  return (
    <div className="px-3 pb-2 pt-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full justify-center bg-gradient-to-r from-blue-600 to-blue-500 shadow-md shadow-blue-600/30 hover:from-blue-500 hover:to-blue-400">
            <Plus className="h-4 w-4" />
            New
            <ChevronDown className="h-3 w-3 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Create</DropdownMenuLabel>
          <DropdownMenuItem>
            <Ticket className="h-4 w-4" />
            Ticket
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Mail className="h-4 w-4" />
            Email outreach
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Phone className="h-4 w-4" />
            Voice call note
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Boxes className="h-4 w-4" />
            Asset
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Users className="h-4 w-4" />
            Contact
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BookOpen className="h-4 w-4" />
            KB article
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Workflow className="h-4 w-4" />
            Automation rule
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function NavSections() {
  const pathname = usePathname();
  return (
    <nav className="flex-1 overflow-y-auto px-3 pb-3">
      <PinnedSection pathname={pathname} />
      {NAV_SECTIONS.map((section) => (
        <Section key={section.id} section={section} pathname={pathname} />
      ))}
    </nav>
  );
}

function PinnedSection({ pathname }: { pathname: string }) {
  return (
    <div className="mb-4">
      <p className="px-2 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-600">
        Pinned views
      </p>
      <ul className="space-y-0.5">
        {PINNED_VIEWS.map((v) => {
          const active =
            pathname + (typeof window !== 'undefined' ? window.location.search : '') === v.href;
          return (
            <li key={v.href}>
              <Link
                href={v.href}
                className={cn(
                  'group flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition-all',
                  active
                    ? 'bg-blue-500/10 text-blue-300'
                    : 'text-gray-400 hover:bg-white/[0.05] hover:text-gray-200',
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      'h-1.5 w-1.5 shrink-0 rounded-full',
                      v.tone === 'danger'  && 'bg-red-400',
                      v.tone === 'warning' && 'bg-amber-400',
                      !v.tone             && 'bg-gray-600',
                    )}
                  />
                  {v.label}
                </span>
                <span
                  className={cn(
                    'rounded px-1.5 py-0.5 text-[10px] font-semibold tabular-nums',
                    v.tone === 'danger'
                      ? 'bg-red-500/15 text-red-400'
                      : v.tone === 'warning'
                        ? 'bg-amber-500/15 text-amber-400'
                        : 'text-gray-600',
                  )}
                >
                  {v.count}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Section({
  section,
  pathname,
}: {
  section: NavSection;
  pathname: string;
}) {
  const [open, setOpen] = useState(section.defaultOpen ?? true);
  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-600 transition-colors hover:text-gray-400"
      >
        {section.label}
        <ChevronDown
          className={cn('h-3 w-3 transition-transform', !open && '-rotate-90')}
        />
      </button>
      {open && (
        <ul className="space-y-0.5">
          {section.links.map((item) => {
            const active = item.exactMatch
              ? pathname === item.href
              : pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-all',
                    active
                      ? 'bg-blue-500/12 text-blue-300'
                      : 'text-gray-400 hover:bg-white/[0.05] hover:text-gray-100',
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0',
                        active
                          ? 'text-blue-400'
                          : 'text-gray-600 group-hover:text-gray-300',
                      )}
                    />
                    {item.label}
                  </span>
                  {item.badge !== undefined && (
                    <Badge
                      variant={
                        item.badgeVariant === 'danger'
                          ? 'danger'
                          : item.badgeVariant === 'warning'
                            ? 'warning'
                            : 'secondary'
                      }
                      className={cn(
                        'h-4 min-w-[1.25rem] border px-1.5 text-[10px]',
                        active
                          ? 'border-blue-400/20 bg-blue-400/15 text-blue-300'
                          : item.badgeVariant === 'danger'
                            ? 'border-red-500/20 bg-red-500/15 text-red-400'
                            : item.badgeVariant === 'warning'
                              ? 'border-amber-500/20 bg-amber-500/15 text-amber-400'
                              : 'border-white/10 bg-white/8 text-gray-500',
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function UserBox() {
  return (
    <div className="border-t border-white/[0.07] p-3">
      <div className="mb-2 flex items-center justify-around rounded-lg bg-white/[0.04] p-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="Search"
              className="grid h-7 w-7 place-items-center rounded-md text-gray-600 transition-colors hover:bg-white/10 hover:text-gray-200"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">Search · Ctrl K</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="Inbox"
              className="grid h-7 w-7 place-items-center rounded-md text-gray-600 transition-colors hover:bg-white/10 hover:text-gray-200"
            >
              <Inbox className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">My inbox</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="Help"
              className="grid h-7 w-7 place-items-center rounded-md text-gray-600 transition-colors hover:bg-white/10 hover:text-gray-200"
            >
              <LifeBuoy className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">Help & support</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="Settings"
              className="grid h-7 w-7 place-items-center rounded-md text-gray-600 transition-colors hover:bg-white/10 hover:text-gray-200"
            >
              <Cog className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">Settings</TooltipContent>
        </Tooltip>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md p-1 transition-colors hover:bg-white/[0.06]"
          >
            <div className="relative">
              <Avatar className="h-8 w-8 ring-2 ring-blue-500/20">
                <AvatarFallback className="bg-blue-600 text-xs font-semibold text-white">
                  {CURRENT_USER.name
                    .split(' ')
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <span
                className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0B1120]"
                aria-label="Available"
              />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-xs font-semibold text-gray-200">
                {CURRENT_USER.name}
              </p>
              <p className="truncate text-[10px] text-gray-500">
                {CURRENT_USER.role}
              </p>
            </div>
            <ChevronsUpDown className="h-3 w-3 shrink-0 text-gray-600" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="text-sm font-medium text-foreground">
              {CURRENT_USER.name}
            </div>
            <div className="text-xs font-normal text-muted-foreground">
              {CURRENT_USER.email}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Set status</DropdownMenuItem>
          <DropdownMenuItem>Profile preferences</DropdownMenuItem>
          <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <CircleHelp className="h-4 w-4" />
            Help center
          </DropdownMenuItem>
          <DropdownMenuItem>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
