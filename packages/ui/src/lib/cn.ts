import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Compose Tailwind class names. Merges conflicting utilities (later wins)
 * and lets you write conditional class arrays/objects without boilerplate.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
