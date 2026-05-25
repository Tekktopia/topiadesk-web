'use client';

import { Search, Bell, ChevronDown } from 'lucide-react';
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
} from '@topiadesk/ui';
import { initials } from '../../lib/format';

const currentAgent = { name: 'Tunde Bakare', email: 'tunde@consomoafrica.com' };

export function Topbar() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-6">
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tickets, assets, contacts..."
          className="pl-9"
          aria-label="Global search"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="relative grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md p-1 pr-2 transition-colors hover:bg-muted"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback>{initials(currentAgent.name)}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline">
                {currentAgent.name}
              </span>
              <ChevronDown className="hidden h-3 w-3 text-muted-foreground md:inline" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="text-sm font-medium text-foreground">
                {currentAgent.name}
              </div>
              <div className="text-xs font-normal text-muted-foreground">
                {currentAgent.email}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>My tickets</DropdownMenuItem>
            <DropdownMenuItem>Notification settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
