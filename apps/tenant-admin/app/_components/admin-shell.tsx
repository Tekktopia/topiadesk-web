'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { ComponentType } from 'react';
import {
  Activity,
  Bell,
  Brush,
  Building2,
  Calendar,
  ChevronDown,
  ChevronsUpDown,
  Code,
  CreditCard,
  ExternalLink,
  Globe,
  Headset,
  HelpCircle,
  History,
  Key,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Plug,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Ticket,
  Timer,
  Users,
  Webhook,
  Workflow,
  X,
  Zap,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  cn,
} from '@topiadesk/ui';
import { CURRENT_ADMIN, TENANT } from '@/lib/mock-data';
import { initials } from '@/lib/format';

interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    label: 'Overview',
    items: [{ href: '/', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Workspace',
    items: [
      { href: '/settings',       label: 'Tenant settings', icon: Settings },
      { href: '/branding',       label: 'Branding',        icon: Brush },
      { href: '/business-hours', label: 'Business hours',  icon: Calendar },
    ],
  },
  {
    label: 'Ticketing',
    items: [
      { href: '/sla',         label: 'SLA policies', icon: Timer },
      { href: '/automations', label: 'Automations',  icon: Workflow },
    ],
  },
  {
    label: 'People',
    items: [
      { href: '/agents', label: 'Agents & users',     icon: Users },
      { href: '/roles',  label: 'Roles & permissions', icon: Shield },
    ],
  },
  {
    label: 'Connect',
    items: [
      { href: '/channels',     label: 'Email channels', icon: Mail },
      { href: '/integrations', label: 'Integrations',   icon: Plug },
    ],
  },
  {
    label: 'Security',
    items: [{ href: '/audit', label: 'Audit log', icon: History }],
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden bg-[#F1F5FA]">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onToggleMobile={() => setMobileOpen((v) => !v)} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/[0.06] bg-[#0B1120] transition-transform lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo / brand */}
        <div className="flex h-14 items-center gap-3 border-b border-white/[0.07] px-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-orange to-orange-light text-xl shadow-lg shadow-orange/20">
            {TENANT.emoji}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold text-gray-100">
              {TENANT.name}
            </p>
            <p className="truncate text-[10px] uppercase tracking-[0.18em] text-gray-500">
              Admin · {TENANT.plan}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-md text-gray-600 hover:bg-white/10 hover:text-gray-200 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {SECTIONS.map((section) => (
            <div key={section.label} className="mb-4">
              <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-600">
                {section.label}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium transition-all',
                          active
                            ? 'bg-orange/10 text-orange'
                            : 'text-gray-400 hover:bg-white/[0.05] hover:text-gray-100',
                        )}
                      >
                        <Icon
                          className={cn(
                            'h-4 w-4 shrink-0',
                            active
                              ? 'text-orange'
                              : 'text-gray-600 group-hover:text-gray-300',
                          )}
                        />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer links */}
        <div className="border-t border-white/[0.07] p-3 text-[11px]">
          <Link
            href="https://app.topiadesk.com"
            className="flex items-center justify-between rounded-md p-2 text-gray-600 hover:bg-white/[0.05] hover:text-gray-300"
          >
            <span className="inline-flex items-center gap-2">
              <ExternalLink className="h-3 w-3" />
              Switch to workspace
            </span>
          </Link>
          <Link
            href="https://docs.topiadesk.com"
            className="flex items-center justify-between rounded-md p-2 text-gray-600 hover:bg-white/[0.05] hover:text-gray-300"
          >
            <span className="inline-flex items-center gap-2">
              <HelpCircle className="h-3 w-3" />
              Admin documentation
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}

function Topbar({ onToggleMobile }: { onToggleMobile: () => void }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/50 bg-white/80 px-4 backdrop-blur-xl lg:px-6">
      <button
        type="button"
        onClick={onToggleMobile}
        className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="relative ml-auto hidden md:block">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search settings, agents, integrations..."
          className="h-9 w-72 rounded-lg border-border/60 bg-muted/50 pl-8 text-xs shadow-sm focus-visible:border-primary/50"
        />
      </div>

      <button
        type="button"
        aria-label="Notifications"
        className="relative grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange ring-2 ring-white" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-muted"
          >
            <Avatar className="h-7 w-7 ring-2 ring-orange/20">
              <AvatarFallback className="bg-gradient-to-br from-orange to-orange-light text-[11px] font-bold text-white">
                {initials(CURRENT_ADMIN.name)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium md:inline">
              {CURRENT_ADMIN.name}
            </span>
            <ChevronDown className="hidden h-3 w-3 text-muted-foreground md:inline" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="text-sm font-medium text-foreground">
              {CURRENT_ADMIN.name}
            </div>
            <div className="text-xs font-normal text-muted-foreground">
              {CURRENT_ADMIN.email} · {CURRENT_ADMIN.role}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile preferences</DropdownMenuItem>
          <DropdownMenuItem>Switch tenant</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

// Re-export common icons for admin pages (used by other components).
export const ADMIN_ICONS = {
  Building2,
  Activity,
  Shield,
  ShieldCheck,
  Ticket,
  Users,
  Webhook,
  Workflow,
  Mail,
  Smartphone,
  Globe,
  MessageSquare,
  Headset,
  Sparkles,
  Plug,
  Code,
  Key,
  CreditCard,
  ChevronsUpDown,
};
