'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { getOpsForEntity } from '../_lib/pending-ops';
import { cn } from '@topiadesk/ui';

interface PendingBadgeProps {
  /** The ticket or asset ID to check for pending ops */
  entityId: string;
  className?: string;
}

/**
 * Small inline badge shown on tickets/assets that have queued offline changes.
 * Disappears automatically once ops are synced.
 */
export function PendingBadge({ entityId, className }: PendingBadgeProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function check() {
      try {
        const ops = await getOpsForEntity(entityId);
        if (mounted) setCount(ops.length);
      } catch { /* IDB not available */ }
    }

    check();
    const interval = setInterval(check, 5000);
    return () => { mounted = false; clearInterval(interval); };
  }, [entityId]);

  if (count === 0) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700',
        className,
      )}
      title={`${count} pending change${count !== 1 ? 's' : ''} — will sync when online`}
    >
      <Clock className="h-2.5 w-2.5" />
      {count} pending
    </span>
  );
}
