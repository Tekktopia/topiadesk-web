import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './providers';
import { AdminShell } from './_components/admin-shell';
import './globals.css';

export const metadata: Metadata = {
  title: 'Admin · ConsomoAfrica · Topiadesk',
  description: 'Per-tenant administration for the Topiadesk platform',
  // Favicon is served by Next.js's `app/icon.png` file-convention — it
  // auto-prefixes the basePath ("/admin") so the browser tab gets the T mark
  // even though this app is mounted at a sub-path. Do NOT manually declare
  // `icons` here or Next will double-emit conflicting links.
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
