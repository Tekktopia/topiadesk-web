// apps/marketing-site/app/layout.tsx

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import 'lenis/dist/lenis.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Topiadesk - The unified support and infrastructure platform',
  description:
    'Helpdesk, asset management, monitoring and operations - one tenant, one source of truth.',
  icons: {
    icon: [{ url: '/icons/icon.png', type: 'image/png' }],
    apple: [{ url: '/icons/icon.png', type: 'image/png' }],
  },
};

const THEME_INIT_SCRIPT = `
  (function () {
    try {
      var stored = localStorage.getItem('topiadesk-theme');
      var theme =
        stored === 'dark' || stored === 'light'
          ? stored
          : window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased">
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {children}
      </body>
    </html>
  );
}