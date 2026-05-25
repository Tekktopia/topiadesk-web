'use client';

import type { ReactNode } from 'react';

interface SsoButtonProps {
  provider: 'google' | 'microsoft';
  onClick?: () => void;
}

const labels: Record<SsoButtonProps['provider'], string> = {
  google: 'Continue with Google',
  microsoft: 'Continue with Microsoft',
};

const icons: Record<SsoButtonProps['provider'], ReactNode> = {
  google: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h5.92a5.05 5.05 0 0 1-2.2 3.31v2.77h3.56c2.08-1.92 3.22-4.74 3.22-8.32z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.99 7.28-2.41l-3.56-2.77c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.35a6.6 6.6 0 0 1 0-4.2V7.31H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.31l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  ),
  microsoft: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#F25022" d="M2 2h9.5v9.5H2z" />
      <path fill="#7FBA00" d="M12.5 2H22v9.5h-9.5z" />
      <path fill="#00A4EF" d="M2 12.5h9.5V22H2z" />
      <path fill="#FFB900" d="M12.5 12.5H22V22h-9.5z" />
    </svg>
  ),
};

export function SsoButton({ provider, onClick }: SsoButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-md border border-input bg-card px-3 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {icons[provider]}
      <span>{labels[provider]}</span>
    </button>
  );
}
