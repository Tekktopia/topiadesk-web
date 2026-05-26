import type { ComponentType, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface EmptyStateProps {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card/40 p-10 text-center',
        className,
      )}
    >
      {Icon && (
        <div className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="max-w-md text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
