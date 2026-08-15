// apps/marketing-site/app/_components/hand-drawn-underline.tsx

'use client';

import { motion } from 'motion/react';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_IN = [0.4, 0, 1, 1] as const;

type HandDrawnUnderlineProps = {
  color?: string;
  strokeWidth?: number;
  className?: string;
  path?: string;
  delay?: number;
};

const DEFAULT_PATH = 'M2 12 C 40 4, 70 17, 100 9 C 130 2, 160 15, 198 7';

/**
 * A signature squiggle accent that draws itself in on scroll-into-view and
 * draws back out on scroll-away, meant to recur under key words across the
 * marketing site as a light, consistent brand motif.
 */
export function HandDrawnUnderline({
  color = '#FF7965',
  strokeWidth = 5,
  className,
  path = DEFAULT_PATH,
  delay = 0.1,
}: HandDrawnUnderlineProps) {
  return (
    <svg
      viewBox="0 0 200 20"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className ?? 'pointer-events-none absolute -bottom-1 left-0 h-[0.22em] w-full'}
    >
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.6 }}
        variants={{
          hidden: {
            pathLength: 0,
            opacity: 0,
            transition: { duration: 0.4, ease: EASE_IN },
          },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 0.85, ease: EASE_OUT, delay },
          },
        }}
      />
    </svg>
  );
}
