import { clsx } from 'clsx';
import type { HTMLAttributes } from 'react';

export type CardProps = HTMLAttributes<HTMLDivElement>;

/** A simple surface container with border, radius, and padding. */
export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-lg border border-slate-200 bg-white p-6 shadow-sm',
        className,
      )}
      {...props}
    />
  );
}
