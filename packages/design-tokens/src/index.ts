/**
 * Topiadesk design tokens.
 * The single source of truth for brand colour, spacing, radius, and type.
 */

export const colors = {
  brand: {
    navy: '#1d3a5f',
    green: '#22c55e',
  },
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    500: '#64748b',
    700: '#334155',
    900: '#0f172a',
  },
  status: {
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
  },
} as const;

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '3rem',
} as const;

export const radius = {
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  full: '9999px',
} as const;

export const typography = {
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    mono: 'JetBrains Mono, ui-monospace, monospace',
  },
} as const;

export type Colors = typeof colors;
export type Spacing = typeof spacing;
