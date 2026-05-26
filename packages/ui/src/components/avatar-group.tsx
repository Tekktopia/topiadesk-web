import type { ReactElement } from 'react';
import { Children, cloneElement, isValidElement } from 'react';
import { cn } from '../lib/cn';

export interface AvatarGroupProps {
  children: React.ReactNode;
  /** Maximum visible avatars before collapsing into "+N". */
  max?: number;
  className?: string;
}

/**
 * Overlapping cluster of avatars with a "+N" tail.
 * Pass `Avatar` children; they will be rendered with a ring and negative
 * margin to overlap.
 */
export function AvatarGroup({ children, max = 3, className }: AvatarGroupProps) {
  const items = Children.toArray(children).filter(isValidElement);
  const visible = items.slice(0, max);
  const overflow = items.length - visible.length;

  return (
    <div className={cn('flex items-center -space-x-2', className)}>
      {visible.map((child, i) => {
        const element = child as ReactElement<{ className?: string }>;
        return cloneElement(element, {
          key: i,
          className: cn(
            'ring-2 ring-background',
            element.props.className,
          ),
        });
      })}
      {overflow > 0 && (
        <span className="grid h-7 w-7 place-items-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground ring-2 ring-background">
          +{overflow}
        </span>
      )}
    </div>
  );
}
