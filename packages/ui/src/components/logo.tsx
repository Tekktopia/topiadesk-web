import * as React from 'react';
import { cn } from '../lib/cn';

/**
 * Topiadesk brand mark — two interlocking T-letter outlines.
 *
 * Inline SVG so it renders without an extra network request and inherits
 * size/colour from CSS. The path data is kept in sync with
 * `packages/ui/src/assets/topiadesk-logo.svg` — update both if the design
 * changes.
 */
export interface LogoProps extends React.SVGAttributes<SVGSVGElement> {
  /** Visual size in px. Renders square. Defaults to 24. */
  size?: number | string;
  /** Optional accessible label. Defaults to "Topiadesk". */
  label?: string;
}

export const Logo = React.forwardRef<SVGSVGElement, LogoProps>(
  ({ size = 24, label = 'Topiadesk', className, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
      className={cn('shrink-0', className)}
      {...props}
    >
      {/* Orange T outline (upper-left) — stroked perimeter of a T-shape */}
      <path
        d="M 28 24 H 138 V 60 H 95 V 134 H 71 V 60 H 28 Z"
        fill="none"
        stroke="#F18B23"
        strokeWidth="14"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
      {/* Blue T outline (lower-right) — mirrored stem for interlocking effect */}
      <path
        d="M 62 66 H 172 V 102 H 129 V 176 H 105 V 102 H 62 Z"
        fill="none"
        stroke="#1E8FE0"
        strokeWidth="14"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
    </svg>
  ),
);
Logo.displayName = 'Logo';
