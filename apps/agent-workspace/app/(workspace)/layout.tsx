import type { ReactNode } from 'react';
import { Shell } from '../_components/shell';
import { OfflineBanner } from '../_components/offline-banner';
import { PWAInstallPrompt } from '../_components/pwa-install-prompt';

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <Shell>
      <OfflineBanner />
      {children}
      <PWAInstallPrompt />
    </Shell>
  );
}
