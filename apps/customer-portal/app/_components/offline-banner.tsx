'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

/**
 * Slim offline banner for the customer portal.
 * Mounts just above the main content area when the portal user loses connectivity.
 */
export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [justCameOnline, setJustCameOnline] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    const handleOnline = () => {
      setIsOffline(false);
      setJustCameOnline(true);
      setTimeout(() => setJustCameOnline(false), 4000);
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline && !justCameOnline) return null;

  return (
    <div className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium ${
      isOffline ? 'bg-amber-50 text-amber-800 border-b border-amber-200' : 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
    }`}>
      {isOffline ? (
        <>
          <WifiOff className="h-4 w-4 shrink-0 text-amber-500" />
          You&apos;re offline — browsing cached content. Requests will be sent when you reconnect.
        </>
      ) : (
        <>
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          You&apos;re back online.
        </>
      )}
    </div>
  );
}
