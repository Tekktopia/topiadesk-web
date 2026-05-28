import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Topiadesk - Credentials',
  description: 'Public certification credential verification',
  icons: {
    icon: [{ url: '/icons/icon.png', type: 'image/png' }],
    apple: [{ url: '/icons/icon.png', type: 'image/png' }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
