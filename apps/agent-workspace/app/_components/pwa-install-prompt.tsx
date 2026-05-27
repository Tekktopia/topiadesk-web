'use client';

import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@topiadesk/ui';
import { usePWAInstall } from '../_hooks/use-pwa-install';

/**
 * Slide-up install prompt that appears once the browser fires
 * the `beforeinstallprompt` event. Dismissed state persists 7 days.
 *
 * Mount this once inside the workspace layout.
 */
export function PWAInstallPrompt() {
  const { canInstall, install, dismiss } = usePWAInstall();

  if (!canInstall) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 animate-in slide-in-from-bottom-4 duration-300 px-4">
      <div className="relative rounded-2xl border border-border bg-background shadow-xl shadow-black/10 p-4">
        <button
          onClick={dismiss}
          className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3 pr-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-md">
            <span className="font-display text-lg font-black text-white">T</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Install Topiadesk</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Add to your home screen for instant access, offline support, and push notifications.
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Button
            size="sm"
            className="flex-1 bg-blue-700 text-white hover:bg-blue-800"
            onClick={() => install()}
          >
            <Download className="mr-1.5 h-3.5 w-3.5" /> Install app
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground"
            onClick={dismiss}
          >
            Not now
          </Button>
        </div>

        <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Smartphone className="h-3 w-3" />
          Works on Android, iOS, Windows and macOS
        </div>
      </div>
    </div>
  );
}
