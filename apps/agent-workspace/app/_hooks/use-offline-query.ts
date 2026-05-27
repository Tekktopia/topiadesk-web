'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';
import { idbGetAll, idbPutMany, stampCache } from '../_lib/idb';
import type { StoreName } from '../_lib/idb';

/**
 * Offline-aware wrapper around react-query.
 *
 * Behaviour:
 *  • Online + data fresh:  normal react-query fetch, result cached to IDB
 *  • Online + IDB stale:   react-query fetches, result refreshes IDB
 *  • Offline:              returns IDB data, marks `isOfflineCached: true`
 *
 * @param options.idbStore  — which IndexedDB store to cache this query's data in
 * @param options.cacheKey  — stable string used for cache-freshness tracking
 */
export function useOfflineQuery<T extends { id: string }>(
  queryOptions: UseQueryOptions<T[]>,
  offlineOptions: {
    idbStore: StoreName;
    cacheKey: string;
  }
): UseQueryResult<T[]> & { isOfflineCached: boolean } {
  const isOnline = useIsOnline();
  const idbStore = offlineOptions.idbStore;
  const cacheKey = offlineOptions.cacheKey;

  // When online: run normal query but also write results to IDB
  const result = useQuery<T[]>({
    ...queryOptions,
    enabled: isOnline && (queryOptions.enabled !== false),
    // Stale time is more generous when we have offline fallback
    staleTime: queryOptions.staleTime ?? 2 * 60 * 1000,
  });

  // Write successful results to IDB
  const dataRef = useRef<T[] | undefined>(undefined);
  useEffect(() => {
    if (result.data && result.data !== dataRef.current) {
      dataRef.current = result.data;
      idbPutMany(idbStore, result.data).then(() => stampCache(cacheKey));
    }
  }, [result.data, idbStore, cacheKey]);

  // When offline: run a separate query that reads from IDB
  const offlineResult = useQuery<T[]>({
    queryKey: [cacheKey, 'offline-cache'],
    queryFn: () => idbGetAll<T>(idbStore),
    enabled: !isOnline,
    staleTime: Infinity,
  });

  if (!isOnline) {
    return {
      ...offlineResult,
      isOfflineCached: (offlineResult.data?.length ?? 0) > 0,
    } as UseQueryResult<T[]> & { isOfflineCached: boolean };
  }

  return {
    ...result,
    isOfflineCached: false,
  } as UseQueryResult<T[]> & { isOfflineCached: boolean };
}

// ─── Internal helper ──────────────────────────────────────────────────────────

function useIsOnline() {
  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const on  = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online',  on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online',  on);
      window.removeEventListener('offline', off);
    };
  }, []);

  return online;
}
