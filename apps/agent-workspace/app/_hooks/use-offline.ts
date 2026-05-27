'use client';

import { useEffect, useState, useCallback } from 'react';

/**
 * Tracks the browser's online/offline state.
 * Returns `isOnline`, `isOffline`, and a `lastOnlineAt` timestamp.
 */
export function useOffline() {
  const [isOnline, setIsOnline] = useState(true);
  const [lastOnlineAt, setLastOnlineAt] = useState<Date | null>(null);

  const goOnline = useCallback(() => {
    setIsOnline(true);
    setLastOnlineAt(new Date());
  }, []);

  const goOffline = useCallback(() => {
    setIsOnline(false);
  }, []);

  useEffect(() => {
    // Set initial state from browser
    setIsOnline(navigator.onLine);
    if (navigator.onLine) setLastOnlineAt(new Date());

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, [goOnline, goOffline]);

  return { isOnline, isOffline: !isOnline, lastOnlineAt };
}
