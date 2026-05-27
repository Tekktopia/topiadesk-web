'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { WifiOff, CloudUpload, RefreshCw, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { cn } from '@topiadesk/ui';
import { getAllOps, flushOps, type PendingOp } from '../_lib/pending-ops';

type SyncState = 'idle' | 'syncing' | 'done' | 'error';

/**
 * Sticky top-of-workspace offline banner.
 * Shows:
 *  - amber bar when offline with a collapsible list of queued operations
 *  - blue bar when back online with pending-op count + sync button
 *  - green flash after a successful sync
 */
export function OfflineBanner() {
  const [isOnline, setIsOnline]       = useState(true);
  const [ops, setOps]                 = useState<PendingOp[]>([]);
  const [expanded, setExpanded]       = useState(false);
  const [syncState, setSyncState]     = useState<SyncState>('idle');
  const [syncResult, setSyncResult]   = useState<{ synced: number; failed: number } | null>(null);
  const [justCameOnline, setJustCameOnline] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refreshOps = useCallback(async () => {
    try { setOps(await getAllOps()); } catch { /* IDB not available */ }
  }, []);

  const sync = useCallback(async () => {
    if (syncState === 'syncing') return;
    setSyncState('syncing');
    try {
      const result = await flushOps();
      setSyncResult(result);
      setSyncState(result.failed === 0 ? 'done' : 'error');
      await refreshOps();
      setTimeout(() => setSyncState('idle'), 4000);
    } catch {
      setSyncState('error');
    }
  }, [syncState, refreshOps]);

  useEffect(() => {
    // Initialise
    setIsOnline(navigator.onLine);
    refreshOps();

    const goOnline = async () => {
      setIsOnline(true);
      setJustCameOnline(true);
      await sync();
      setTimeout(() => setJustCameOnline(false), 5000);
    };
    const goOffline = () => {
      setIsOnline(false);
      setJustCameOnline(false);
      setSyncState('idle');
    };

    window.addEventListener('online',  goOnline);
    window.addEventListener('offline', goOffline);

    // Poll the pending-ops count every 10s so the banner stays accurate
    pollRef.current = setInterval(refreshOps, 10_000);

    return () => {
      window.removeEventListener('online',  goOnline);
      window.removeEventListener('offline', goOffline);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Nothing to show
  if (isOnline && !justCameOnline && ops.length === 0) return null;

  const isOffline = !isOnline;

  return (
    <div className="w-full">
      {/* ── Main bar ── */}
      <div
        className={cn(
          'flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium',
          isOffline
            ? 'bg-amber-50 text-amber-800 border-b border-amber-200'
            : syncState === 'done'
            ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
            : syncState === 'error'
            ? 'bg-red-50 text-red-800 border-b border-red-200'
            : ops.length > 0
            ? 'bg-blue-50 text-blue-800 border-b border-blue-200'
            : 'bg-emerald-50 text-emerald-800 border-b border-emerald-200',
        )}
      >
        {/* Left icon */}
        {isOffline ? (
          <WifiOff className="h-4 w-4 shrink-0 text-amber-500" />
        ) : syncState === 'syncing' ? (
          <RefreshCw className="h-4 w-4 shrink-0 animate-spin text-blue-500" />
        ) : (
          <CloudUpload className={cn('h-4 w-4 shrink-0', syncState === 'done' ? 'text-emerald-500' : 'text-blue-500')} />
        )}

        {/* Message */}
        <span className="flex-1 text-xs">
          {isOffline && ops.length > 0
            ? `You're offline — ${ops.length} change${ops.length !== 1 ? 's' : ''} queued. Will sync automatically when connected.`
            : isOffline
            ? "You're offline. Your work is saved locally and will sync when you reconnect."
            : syncState === 'syncing'
            ? 'Syncing queued changes…'
            : syncState === 'done'
            ? `Sync complete — ${syncResult?.synced} change${syncResult?.synced !== 1 ? 's' : ''} saved to server.`
            : syncState === 'error'
            ? `Partial sync — ${syncResult?.synced} synced, ${syncResult?.failed} failed. Will retry automatically.`
            : ops.length > 0
            ? `${ops.length} change${ops.length !== 1 ? 's' : ''} pending sync`
            : "Back online — all changes synced."}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sync now button (online + pending) */}
          {!isOffline && ops.length > 0 && syncState === 'idle' && (
            <button
              onClick={sync}
              className="rounded-md border border-blue-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
            >
              Sync now
            </button>
          )}

          {/* Expand/collapse queue list */}
          {ops.length > 0 && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="flex items-center gap-0.5 text-[11px] font-medium opacity-70 hover:opacity-100 transition-opacity"
            >
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              {expanded ? 'Hide' : 'Show'}
            </button>
          )}
        </div>
      </div>

      {/* ── Expanded queue ── */}
      {expanded && ops.length > 0 && (
        <div className="border-b border-amber-200 bg-amber-50/60 px-4 pb-3 pt-1">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
            Pending operations
          </p>
          <ul className="space-y-1.5">
            {ops.map((op) => (
              <li key={op.id} className="flex items-start gap-2">
                <Clock className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-amber-900">{op.label}</p>
                  <p className="text-[10px] text-amber-600">
                    Queued {new Date(op.queuedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {op.attempts > 0 ? ` · ${op.attempts} attempt${op.attempts !== 1 ? 's' : ''}` : ''}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
