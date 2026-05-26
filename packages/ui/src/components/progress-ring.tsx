import { cn } from '../lib/cn';

export interface ProgressRingProps {
  /** Progress value in 0-100. */
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  /** Tailwind text color for the progress arc. */
  trackClassName?: string;
  children?: React.ReactNode;
}

/**
 * Compact circular progress indicator. Pure SVG.
 * The colour comes from `text-{color}` on the wrapper.
 */
export function ProgressRing({
  value,
  size = 48,
  strokeWidth = 4,
  className,
  trackClassName,
  children,
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center text-primary',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeOpacity={0.15}
          strokeWidth={strokeWidth}
          fill="none"
          className={trackClassName}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          fill="none"
        />
      </svg>
      {children !== undefined && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-foreground">
          {children}
        </div>
      )}
    </div>
  );
}
