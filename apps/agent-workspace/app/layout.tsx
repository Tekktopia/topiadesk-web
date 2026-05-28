import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './providers';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#1d4ed8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Topiadesk — Agent Workspace',
  description: 'Your helpdesk, asset management and monitoring command centre.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Topiadesk',
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192.png', sizes: '192x192' },
    ],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#1d4ed8',
    'msapplication-tap-highlight': 'no',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    /*
     * suppressHydrationWarning is required at the <html> and <body> level because
     * browser extensions (Grammarly, QuillBot, Dark Reader, etc.) inject attributes
     * like `data-qb-installed` before React hydrates, which would otherwise produce
     * a console hydration mismatch warning.
     */
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        {/* PWA splash screens for iOS */}
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
