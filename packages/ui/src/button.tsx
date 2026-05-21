import { clsx } from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[#1d3a5f] text-white hover:bg-[#22436e]',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
  ghost: 'bg-transparent text-slate-900 hover:bg-slate-100',
};

/** The primary call-to-action button used across Topiadesk surfaces. */
export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-md px-4 py-2',
        'text-sm font-medium transition-colors focus:outline-none',
        'focus-visible:ring-2 focus-visible:ring-[#1d3a5f] disabled:opacity-50',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
