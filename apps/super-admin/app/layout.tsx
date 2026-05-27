import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Topiadesk — Super Admin',
  description: 'Internal platform administration portal',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="light">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
