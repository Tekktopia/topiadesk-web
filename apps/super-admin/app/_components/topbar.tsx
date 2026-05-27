'use client';

import { Bell, Search, Shield } from 'lucide-react';
import { Badge, Button, Input, Tooltip, TooltipContent, TooltipTrigger } from '@topiadesk/ui';
import Link from 'next/link';

export function Topbar() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border/50 bg-white/80 px-4 backdrop-blur-xl">
      {/* Search */}
      <div className="relative w-72">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search tenants, users, logs…" className="h-8 pl-8 text-xs" />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Env badge */}
        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:bg-amber-900/40 dark:text-amber-400">
          Production
        </span>

        {/* Security alerts */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/security" className="relative grid h-8 w-8 place-items-center rounded-md transition-colors hover:bg-muted">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>2 unresolved security events</TooltipContent>
        </Tooltip>

        {/* Notifications */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="relative grid h-8 w-8 place-items-center rounded-md transition-colors hover:bg-muted"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4 text-muted-foreground" />
              <Badge variant="danger" className="absolute -right-1 -top-1 h-4 min-w-[1rem] px-1 text-[10px]">3</Badge>
            </button>
          </TooltipTrigger>
          <TooltipContent>3 platform notifications</TooltipContent>
        </Tooltip>

        <div className="h-5 w-px bg-border" />

        <Button size="sm" variant="outline" className="text-xs" asChild>
          <Link href="https://app.topiadesk.com" target="_blank" rel="noopener">Agent workspace ↗</Link>
        </Button>
      </div>
    </header>
  );
}
