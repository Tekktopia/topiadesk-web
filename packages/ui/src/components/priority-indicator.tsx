import { cn } from '../lib/cn';

const priorityClasses: Record<string, string> = {
  low: 'bg-slate-400',
  medium: 'bg-blue-500',
  high: 'bg-amber-500',
  urgent: 'bg-red-500',
};

const priorityLabels: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export interface PriorityIndicatorProps {
  priority: string;
  className?: string;
}

export function PriorityIndicator({ priority, className }: PriorityIndicatorProps) {
  const dot = priorityClasses[priority] ?? 'bg-slate-400';
  const label = priorityLabels[priority] ?? priority;
  return (
    <span className={cn('inline-flex items-center gap-2 text-sm text-foreground', className)}>
      <span className={cn('h-2 w-2 rounded-full', dot)} />
      {label}
    </span>
  );
}
