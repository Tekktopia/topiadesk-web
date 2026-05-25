'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  Boxes,
  BookOpen,
  Workflow,
  Users,
  BarChart3,
  Settings,
} from 'lucide-react';
import { cn } from '@topiadesk/ui';

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: number;
};

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tickets', label: 'Tickets', icon: Inbox, badge: 47 },
  { href: '/assets', label: 'Assets', icon: Boxes },
  { href: '/knowledge', label: 'Knowledge base', icon: BookOpen },
  { href: '/automations', label: 'Automations', icon: Workflow },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r bg-background md:flex">
      <div className="flex h-14 items-center gap-3 border-b px-5">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-white">
          <span className="text-sm font-bold">T</span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">Topiadesk</span>
          <span className="text-xs text-muted-foreground">consomoafrica</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary text-white'
                      : 'text-foreground hover:bg-muted',
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                        active
                          ? 'bg-white/20 text-white'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t p-4 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Topiadesk v0.1.0</p>
        <p>Agent workspace</p>
      </div>
    </aside>
  );
}
