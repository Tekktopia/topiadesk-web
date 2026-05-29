'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@topiadesk/ui';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { RoleProvider } from '@/lib/role-context';

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      <RoleProvider>
        <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
      </RoleProvider>
    </QueryClientProvider>
  );
}
