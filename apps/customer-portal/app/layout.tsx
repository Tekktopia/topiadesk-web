import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Providers } from './providers';
import { PortalHeader } from './_components/portal-header';
import { PortalFooter } from './_components/portal-footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ConsomoAfrica Support - powered by Topiadesk',
  description: 'Find answers, submit a request, and track support tickets.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`light ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <PortalHeader />
            <main className="flex-1">{children}</main>
            <PortalFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
