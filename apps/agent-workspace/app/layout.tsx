import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Shell } from './_components/shell';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Topiadesk - Agent Workspace',
  description: 'The agent day-to-day helpdesk workspace',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-muted/30 text-foreground antialiased">
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}
