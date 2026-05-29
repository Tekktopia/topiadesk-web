'use client';

import { useEffect, useState, useCallback } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { Logo } from '@topiadesk/ui';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // @ts-expect-error — iOS safari
      window.navigator.standalone === true;
    setIsInstalled(isStandalone);

    const snap = localStorage.getItem('portal-pwa-dismissed');
    if (snap && Date.now() - Number(snap) < 7 * 24 * 60 * 60 * 1000) {
      setDismissed(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setIsInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = useCallback(async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    setPrompt(null);
    if (outcome === 'accepted') setIsInstalled(true);
  }, [prompt]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    localStorage.setItem('portal-pwa-dismissed', String(Date.now()));
  }, []);

  if (!prompt || isInstalled || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 px-4">
      <div className="relative rounded-2xl border border-border bg-background shadow-xl shadow-black/10 p-4">
        <button
          onClick={dismiss}
          className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-muted"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-start gap-3 pr-6">
          <Logo size={40} className="shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Install Support Portal</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Get instant access to your tickets and notifications — even offline.
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={install}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800 transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> Install app
          </button>
          <button
            onClick={dismiss}
            className="rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            Not now
          </button>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Smartphone className="h-3 w-3" />
          Works on Android, iOS, Windows and macOS
        </div>
      </div>
    </div>
  );
}
