import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './providers';
import { AdminShell } from './_components/admin-shell';
import './globals.css';

export const metadata: Metadata = {
  title: 'Admin · ConsomoAfrica · Topiadesk',
  description: 'Per-tenant administration for the Topiadesk platform',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="light">
      <body className="antialiased">
        <Providers>
          <AdminShell>{children}</AdminShell>
        </Providers>
      </body>
    </html>
  );
}
