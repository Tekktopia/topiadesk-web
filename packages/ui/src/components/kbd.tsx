import { cn } from '../lib/cn';

export interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

/** Inline keyboard-shortcut chip, e.g. <Kbd>Ctrl</Kbd> <Kbd>K</Kbd>. */
export function Kbd({ children, className }: KbdProps) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded border border-border bg-card px-1 font-mono text-[10px] font-semibold text-muted-foreground shadow-sm',
        className,
      )}
    >
      {children}
    </kbd>
  );
}
