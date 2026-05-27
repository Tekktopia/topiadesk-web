'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  ChevronsUpDown,
  Flag,
  LayoutDashboard,
  Lock,
  LogOut,
  ScrollText,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  SquareStack,
  Users,
  Zap,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  cn,
} from '@topiadesk/ui';

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string | number;
  badgeVariant?: 'danger' | 'warning' | 'secondary';
  exactMatch?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exactMatch: true },
    ],
  },
  {
    label: 'Tenants',
    items: [
      { href: '/tenants', label: 'All tenants', icon: Building2 },
      { href: '/users',   label: 'All users',   icon: Users },
    ],
  },
  {
    label: 'Revenue',
    items: [
      { href: '/billing', label: 'Billing & revenue', icon: BarChart3 },
      { href: '/plans',   label: 'Plans & pricing',   icon: SquareStack },
    ],
  },
  {
    label: 'Platform',
    items: [
      { href: '/feature-flags',  label: 'Feature flags',  icon: Flag },
      { href: '/announcements',  label: 'Announcements',  icon: Bell },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/system',     label: 'System health', icon: Server,     badge: '!', badgeVariant: 'warning' },
      { href: '/audit-logs', label: 'Audit logs',    icon: ScrollText },
      { href: '/security',   label: 'Security',      icon: Shield,     badge: 2,   badgeVariant: 'danger' },
    ],
  },
];

const CURRENT_ADMIN = { name: 'Daniel Oshinubi', email: 'daniel@topiadesk.com', initials: 'DO' };

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-white/6 bg-[#070D1A]">

      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-white/[0.07] px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold tracking-tight text-white">Topiadesk</p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-500">
            Super Admin
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {NAV.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-700">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
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
                        'flex items-center justify-between gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium transition-all',
                        active
                          ? 'bg-emerald-400/10 text-emerald-300'
                          : 'text-gray-500 hover:bg-white/5 hover:text-gray-200',
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            'h-4 w-4 shrink-0',
                            active ? 'text-emerald-400' : 'text-gray-700',
                          )}
                        />
                        {item.label}
                      </span>
                      {item.badge !== undefined && (
                        <Badge
                          variant={active ? 'secondary' : (item.badgeVariant ?? 'secondary')}
                          className={cn(
                            'h-4 min-w-4 border px-1 text-[10px]',
                            active
                              ? 'border-emerald-400/20 bg-emerald-400/15 text-emerald-300'
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
          </div>
        ))}
      </nav>

      {/* Bottom quick actions */}
      <div className="space-y-0.5 border-t border-white/[0.07] px-3 py-3">
        <Link
          href="/settings"
          className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-gray-600 transition-colors hover:bg-white/5 hover:text-gray-300"
        >
          <Settings className="h-4 w-4 text-gray-700" />
          Settings
        </Link>
        <Link
          href="/security"
          className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-gray-600 transition-colors hover:bg-white/5 hover:text-gray-300"
        >
          <ShieldCheck className="h-4 w-4 text-gray-700" />
          Security
        </Link>
      </div>

      {/* User */}
      <div className="border-t border-white/[0.07] p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors hover:bg-white/5"
            >
              <Avatar className="h-7 w-7 shrink-0 ring-2 ring-emerald-500/20">
                <AvatarFallback className="bg-linear-to-br from-emerald-500 to-emerald-700 text-[10px] font-bold text-white">
                  {CURRENT_ADMIN.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-gray-200">
                  {CURRENT_ADMIN.name}
                </p>
                <p className="truncate text-[10px] text-gray-600">
                  {CURRENT_ADMIN.email}
                </p>
              </div>
              <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-gray-700" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-52">
            <DropdownMenuLabel>
              <p className="text-xs font-semibold">{CURRENT_ADMIN.name}</p>
              <p className="text-[10px] font-normal text-muted-foreground">
                {CURRENT_ADMIN.email}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Lock className="h-3.5 w-3.5" />
              Change password
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Shield className="h-3.5 w-3.5" />
              Security settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600">
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}

// Collapsible section helper (exported for future use)
export function NavSection({
  label,
  defaultOpen = true,
  children,
}: {
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-gray-700 transition-colors hover:text-gray-400"
      >
        {label}
        <ChevronDown
          className={cn('h-3 w-3 transition-transform', !open && '-rotate-90')}
        />
      </button>
      {open && children}
    </div>
  );
}
