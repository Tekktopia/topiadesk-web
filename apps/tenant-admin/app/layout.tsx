import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './providers';
import { AdminShell } from './_components/admin-shell';
import './globals.css';

export const metadata: Metadata = {
  title: 'Admin · ConsomoAfrica · Topiadesk',
  description: 'Per-tenant administration for the Topiadesk platform',
  icons: {
    icon: [{ url: '/icons/icon.png', type: 'image/png' }],
    apple: [{ url: '/icons/icon.png', type: 'image/png' }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>
          <AdminShell>{children}</AdminShell>
        </Providers>
      </body>
    </html>
  );
}
