'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  ChevronDown,
  ChevronsUpDown,
  DatabaseBackup,
  Flag,
  Globe2,
  LayoutDashboard,
  Lock,
  LogOut,
  FileText,
  Headset,
  KeyRound,
  LineChart,
  Mail,
  Plug,
  Rocket,
  ScrollText,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  SquareStack,
  Ticket,
  UserPlus,
  Users,
  Webhook,
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
  Logo,
  cn,
} from '@topiadesk/ui';

import { useRole, type Capability } from '@/lib/role-context';

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string | number;
  badgeVariant?: 'danger' | 'warning' | 'secondary';
  exactMatch?: boolean;
  /** Required capability — if missing, item is hidden for this role */
  capability: Capability;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard',     label: 'Dashboard',     icon: LayoutDashboard, exactMatch: true, capability: 'view_dashboard' },
      { href: '/notifications', label: 'Notifications', icon: Bell,            badge: 3, badgeVariant: 'danger', capability: 'view_notifications' },
    ],
  },
  {
    label: 'Tenants',
    items: [
      { href: '/tenants',           label: 'All tenants',      icon: Building2, capability: 'view_tenants' },
      { href: '/users',             label: 'All users',        icon: Users,     capability: 'manage_users' },
      { href: '/admins/new',        label: 'Create admin',     icon: UserPlus,  capability: 'create_admins' },
      { href: '/tenant-onboarding', label: 'Onboarding flow',  icon: Rocket,    capability: 'view_tenant_onboarding' },
    ],
  },
  {
    label: 'Customer support',
    items: [
      { href: '/support', label: 'Support tickets', icon: Headset, badge: 4, badgeVariant: 'warning', capability: 'view_support' },
    ],
  },
  {
    label: 'Revenue',
    items: [
      { href: '/billing',   label: 'Billing & revenue', icon: BarChart3,   capability: 'view_billing' },
      { href: '/plans',     label: 'Plans & pricing',   icon: SquareStack, capability: 'view_plans' },
      { href: '/analytics', label: 'Analytics',         icon: LineChart,   capability: 'view_analytics' },
    ],
  },
  {
    label: 'Platform',
    items: [
      { href: '/feature-flags',   label: 'Feature flags',   icon: Flag,     capability: 'manage_feature_flags' },
      { href: '/announcements',   label: 'Announcements',   icon: Bell,     capability: 'manage_announcements' },
      { href: '/email-templates', label: 'Email templates', icon: Mail,     capability: 'view_email_templates' },
      { href: '/integrations',    label: 'Integrations',    icon: Plug,     capability: 'view_integrations' },
      { href: '/api-keys',        label: 'API & webhooks',  icon: Webhook,  capability: 'view_api_keys' },
      { href: '/knowledge-base',  label: 'Knowledge base',  icon: BookOpen, capability: 'view_knowledge_base' },
      { href: '/changelog',       label: 'Changelog',       icon: ScrollText, capability: 'view_changelog' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/system',      label: 'System health', icon: Server,         badge: '!', badgeVariant: 'warning', capability: 'view_system' },
      { href: '/status-page', label: 'Status page',   icon: Globe2,         capability: 'view_status_page' },
      { href: '/audit-logs',  label: 'Audit logs',    icon: ScrollText,     capability: 'view_audit_logs' },
      { href: '/security',    label: 'Security',      icon: Shield,         badge: 2,   badgeVariant: 'danger',  capability: 'view_security' },
      { href: '/roles',       label: 'Roles & perms', icon: KeyRound,       capability: 'view_roles' },
      { href: '/backups',     label: 'Backups & DR',  icon: DatabaseBackup, capability: 'view_backups' },
      { href: '/compliance',  label: 'Compliance',    icon: FileText,       capability: 'view_compliance' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, can, signOut, setRole } = useRole();
  const CURRENT_ADMIN = { name: user.name, email: user.email, initials: user.initials };

  // Filter NAV groups based on role capabilities — drop empty groups
  const filteredNav = NAV
    .map((group) => ({ ...group, items: group.items.filter((it) => can(it.capability)) }))
    .filter((g) => g.items.length > 0);

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-border/70 sidebar-cream">

      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-border/60 px-4">
        <Logo size={32} className="shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-bold tracking-tight text-foreground">Topiadesk</p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-coral">
            Super Admin
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {filteredNav.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
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
                        'flex items-center justify-between gap-2.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-all',
                        active
                          ? 'nav-pill-active text-foreground'
                          : 'text-foreground/70 hover:bg-cream-deep/40 hover:text-foreground',
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            'h-4 w-4 shrink-0',
                            active ? 'text-coral' : 'text-muted-foreground',
                          )}
                        />
                        {item.label}
                      </span>
                      {item.badge !== undefined && (
                        <Badge
                          variant={item.badgeVariant ?? 'secondary'}
                          className="h-4 min-w-5 px-1.5 text-[10px]"
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
      <div className="space-y-0.5 border-t border-border/60 px-3 py-3">
        <Link
          href="/settings"
          className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-foreground/70 transition-colors hover:bg-cream-deep/40 hover:text-foreground"
        >
          <Settings className="h-4 w-4 text-muted-foreground" />
          Settings
        </Link>
        <Link
          href="/security"
          className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-foreground/70 transition-colors hover:bg-cream-deep/40 hover:text-foreground"
        >
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          Security
        </Link>
      </div>

      {/* User */}
      <div className="border-t border-border/60 p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors hover:bg-cream-deep/40"
            >
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarFallback className="bg-coral text-[10px] font-bold text-white">
                  {CURRENT_ADMIN.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">
                  {CURRENT_ADMIN.name}
                </p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {CURRENT_ADMIN.email}
                </p>
              </div>
              <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56">
            <DropdownMenuLabel>
              <p className="text-xs font-semibold">{CURRENT_ADMIN.name}</p>
              <p className="text-[10px] font-normal text-muted-foreground">
                {CURRENT_ADMIN.email}
              </p>
              <p className="mt-1 inline-block rounded-full bg-coral/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-coral-dark">
                {user.role.replace('_', ' ')}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
              Switch role (dev)
            </DropdownMenuLabel>
            {(['super_admin', 'admin', 'csr', 'viewer'] as const).map((r) => (
              <DropdownMenuItem
                key={r}
                onClick={() => setRole(r)}
                className={cn(user.role === r && 'bg-muted')}
              >
                {user.role === r ? '● ' : '○ '}
                <span className="capitalize">{r.replace('_', ' ')}</span>
              </DropdownMenuItem>
            ))}
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
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={signOut}
            >
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
        className="flex w-full items-center justify-between px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
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
