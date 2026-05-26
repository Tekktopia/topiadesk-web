'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Bell,
  BookOpen,
  ChevronDown,
  Headset,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Search,
  Settings,
  Ticket,
  User,
  X,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  cn,
} from '@topiadesk/ui';
import { CURRENT_CUSTOMER, TENANT, mockNotifications } from '@/lib/mock-data';
import { initials } from '@/lib/format';

const NAV = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/tickets', label: 'My tickets', icon: Ticket },
  { href: '/kb', label: 'Help center', icon: BookOpen },
  { href: '/notifications', label: 'Updates', icon: Bell },
];

export function PortalHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const unreadCount = mockNotifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-navy text-2xl">
            {TENANT.emoji}
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="font-display text-base font-bold tracking-tight">
              {TENANT.name}
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Support
            </span>
          </div>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-muted',
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {item.href === '/notifications' && unreadCount > 0 && (
                  <span className="grid h-4 min-w-[16px] place-items-center rounded-full bg-orange px-1 text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/kb"
            className="hidden h-9 w-48 items-center gap-2 rounded-md border border-input bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted md:flex lg:w-64"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="flex-1 truncate text-left">Search help</span>
          </Link>

          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/submit">
              <Plus className="h-3.5 w-3.5" />
              New request
            </Link>
          </Button>

          <Link
            href="/notifications"
            aria-label={`Notifications (${unreadCount} unread)`}
            className="relative grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-orange" />
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <ProfileMenu />
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t bg-card md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 p-3">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <Button asChild className="mt-2">
              <Link href="/submit" onClick={() => setMobileOpen(false)}>
                <Plus className="h-4 w-4" />
                New request
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

function ProfileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md p-1 pr-2 transition-colors hover:bg-muted"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials(CURRENT_CUSTOMER.name)}</AvatarFallback>
          </Avatar>
          <ChevronDown className="hidden h-3 w-3 text-muted-foreground md:inline" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          <div className="text-sm font-medium text-foreground">
            {CURRENT_CUSTOMER.name}
          </div>
          <div className="text-xs font-normal text-muted-foreground">
            {CURRENT_CUSTOMER.email}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/notifications">
            <Settings className="h-4 w-4" />
            Notification preferences
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <HelpCircle className="h-4 w-4" />
          Visit help center
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MessageCircle className="h-4 w-4" />
          Chat with support
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Headset className="h-4 w-4" />
          Call {TENANT.supportPhone}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
