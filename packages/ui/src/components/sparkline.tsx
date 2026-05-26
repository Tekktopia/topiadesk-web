import { cn } from '../lib/cn';

export interface SparklineProps {
  /** Data points (ordered, oldest to newest). */
  data: number[];
  width?: number;
  height?: number;
  /** Tailwind color utility class for the stroke (e.g. "text-primary"). */
  className?: string;
  /** Render a soft area fill under the line. */
  area?: boolean;
}

/**
 * Lightweight inline sparkline — pure SVG, no chart library.
 * Designed for at-a-glance trends inside metric cards.
 */
export function Sparkline({
  data,
  width = 96,
  height = 32,
  className,
  area = true,
}: SparklineProps) {
  if (data.length < 2) {
    return null;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;

  const step = width / (data.length - 1);
  const points = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / span) * (height - 4) - 2;
    return [x, y] as const;
  });

  const linePath = points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(' ');

  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  const areaPath =
    firstPoint && lastPoint
      ? `${linePath} L ${lastPoint[0].toFixed(2)} ${height} L ${firstPoint[0].toFixed(2)} ${height} Z`
      : '';

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn('text-primary', className)}
      aria-hidden
    >
      {area && (
        <path
          d={areaPath}
          fill="currentColor"
          fillOpacity={0.12}
        />
      )}
      <path
        d={linePath}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {lastPoint && (
        <circle
          cx={lastPoint[0]}
          cy={lastPoint[1]}
          r={2}
          fill="currentColor"
        />
      )}
    </svg>
  );
}
