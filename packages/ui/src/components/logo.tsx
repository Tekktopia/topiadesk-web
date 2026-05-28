import * as React from 'react';
import { cn } from '../lib/cn';

/**
 * Topiadesk brand mark.
 *
 * Renders the PNG logo from `/icons/icon.png` (each app is expected to have
 * that file in its public directory). Falls back to the brand initial if the
 * image fails to load (e.g. file not yet copied to a new app).
 */
export interface LogoProps {
  /** Visual size in px. Renders square. Defaults to 24. */
  size?: number;
  /** Optional accessible label. Defaults to "Topiadesk". */
  label?: string;
  /** Extra classes applied to the wrapper. */
  className?: string;
}

export function Logo({ size = 24, label = 'Topiadesk', className }: LogoProps) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/icons/icon.png"
      alt={label}
      width={size}
      height={size}
      className={cn('inline-block shrink-0 object-contain', className)}
      style={{ width: size, height: size }}
    />
  );
}
Logo.displayName = 'Logo';
