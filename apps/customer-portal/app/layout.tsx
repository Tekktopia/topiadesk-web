import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './providers';
import { PortalHeader } from './_components/portal-header';
import { PortalFooter } from './_components/portal-footer';
import { OfflineBanner } from './_components/offline-banner';
import { PWAInstallPrompt } from './_components/pwa-install-prompt';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#1A1B2E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'ConsomoAfrica Support — powered by Topiadesk',
  description: 'Find answers, submit a request, and track your support tickets.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CA Support',
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [{ url: '/icons/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icons/icon.svg', type: 'image/svg+xml' }],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#1A1B2E',
    'msapplication-tap-highlight': 'no',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <PortalHeader />
            {/* Spacer so content starts below the fixed h-16 header */}
            <div className="h-16 shrink-0" aria-hidden />
            <OfflineBanner />
            <main className="flex-1">{children}</main>
            <PortalFooter />
            <PWAInstallPrompt />
          </div>
        </Providers>
      </body>
    </html>
  );
}
