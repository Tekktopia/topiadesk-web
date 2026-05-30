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
  Logo,
  cn,
} from '@topiadesk/ui';
import { TENANT } from '@/lib/mock-data';
import { useRole, TENANT_ROLES, ROLE_META, type Capability, type TenantRole } from '@/lib/role-context';

interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  /** Required capability — if the current user lacks it, the link is hidden. */
  capability: Capability;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    label: 'Overview',
    items: [{ href: '/', label: 'Dashboard', icon: LayoutDashboard, capability: 'view_dashboard' }],
  },
  {
    label: 'Workspace',
    items: [
      { href: '/settings',       label: 'Tenant settings', icon: Settings, capability: 'view_settings' },
      { href: '/branding',       label: 'Branding',        icon: Brush,    capability: 'view_branding' },
      { href: '/business-hours', label: 'Business hours',  icon: Calendar, capability: 'view_business_hours' },
      { href: '/migration',      label: 'Migration tool',  icon: History,  capability: 'view_migration' },
    ],
  },
  {
    label: 'Ticketing',
    items: [
      { href: '/ticket-fields', label: 'Ticket fields', icon: Ticket,   capability: 'view_ticket_fields' },
      { href: '/sla',           label: 'SLA policies',  icon: Timer,    capability: 'view_sla' },
      { href: '/automations',   label: 'Automations',   icon: Workflow, capability: 'view_automations' },
    ],
  },
  {
    label: 'People',
    items: [
      { href: '/agents', label: 'Agents & users',     icon: Users,  capability: 'view_agents' },
      { href: '/roles',  label: 'Roles & permissions', icon: Shield, capability: 'view_roles' },
    ],
  },
  {
    label: 'Connect',
    items: [
      { href: '/channels',     label: 'Email channels',          icon: Mail,        capability: 'view_channels' },
      { href: '/integrations', label: 'Integrations',            icon: Plug,        capability: 'view_integrations' },
      { href: '/device-sync',  label: 'Device sync (Entra/MDM)', icon: Smartphone,  capability: 'view_integrations' },
    ],
  },
  {
    label: 'Security',
    items: [{ href: '/audit', label: 'Audit log', icon: History, capability: 'view_audit_log' }],
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
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
  const { can } = useRole();

  // Drop nav items the current role lacks; drop sections that go empty as a result.
  const visibleSections = SECTIONS
    .map((s) => ({ ...s, items: s.items.filter((it) => can(it.capability)) }))
    .filter((s) => s.items.length > 0);

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
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border/70 sidebar-cream transition-transform lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo / brand — defaults to the Topiadesk "T" until a tenant uploads
            their own logo via /branding, in which case we'd pass src here. */}
        <div className="flex h-14 items-center gap-2.5 border-b border-border/60 px-4">
          <Logo size={36} className="shrink-0" />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold text-foreground">
              {TENANT.name}
            </p>
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-coral">
              Tenant Admin
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-cream-deep/50 hover:text-foreground lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {visibleSections.map((section) => (
            <div key={section.label} className="mb-4">
              <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
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
                          'group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-all',
                          active
                            ? 'nav-pill-active text-foreground'
                            : 'text-foreground/70 hover:bg-cream-deep/40 hover:text-foreground',
                        )}
                      >
                        <Icon
                          className={cn(
                            'h-4 w-4 shrink-0',
                            active
                              ? 'text-coral'
                              : 'text-muted-foreground group-hover:text-foreground',
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
        <div className="border-t border-border/60 p-3 text-[11px]">
          <Link
            href="https://app.topiadesk.com"
            className="flex items-center justify-between rounded-md p-2 text-muted-foreground hover:bg-cream-deep/40 hover:text-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <ExternalLink className="h-3 w-3" />
              Switch to workspace
            </span>
          </Link>
          <Link
            href="https://docs.topiadesk.com"
            className="flex items-center justify-between rounded-md p-2 text-muted-foreground hover:bg-cream-deep/40 hover:text-foreground"
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
  const { user, setRole, signOut } = useRole();
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/60 bg-card/70 px-4 backdrop-blur-xl lg:px-6">
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
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-coral text-[11px] font-bold text-white">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium md:inline">
              {user.name}
            </span>
            <ChevronDown className="hidden h-3 w-3 text-muted-foreground md:inline" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuLabel>
            <div className="text-sm font-medium text-foreground">{user.name}</div>
            <div className="text-xs font-normal text-muted-foreground">{user.email}</div>
            <div className="mt-1.5">
              <span className={cn(
                'inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                ROLE_META[user.role].tone.bg,
                ROLE_META[user.role].tone.text,
              )}>
                {ROLE_META[user.role].label}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-[9px] uppercase tracking-wider text-muted-foreground">
            Switch role (dev)
          </DropdownMenuLabel>
          {TENANT_ROLES.map((r: TenantRole) => (
            <DropdownMenuItem key={r} onClick={() => setRole(r)} className={cn(user.role === r && 'bg-muted')}>
              {user.role === r ? '● ' : '○ '}
              <span>{ROLE_META[r].label}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile preferences</DropdownMenuItem>
          <DropdownMenuItem>Switch tenant</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut} className="text-red-600 focus:text-red-600">
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
