import { formatDistanceToNowStrict, format } from 'date-fns';

/** Returns a compact relative time string, e.g. "12m ago", "3h ago". */
export function relativeTime(iso: string): string {
  return `${formatDistanceToNowStrict(new Date(iso))} ago`;
}

/** Returns a formatted absolute date string, e.g. "21 May 2026, 14:32". */
export function absoluteDateTime(iso: string): string {
  return format(new Date(iso), "d MMM yyyy, HH:mm");
}

/** Returns initials from a person's display name. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return (parts[0] ?? '').slice(0, 2).toUpperCase();
  const first = parts[0] ?? '';
  const last = parts[parts.length - 1] ?? '';
  return (first.charAt(0) + last.charAt(0)).toUpperCase();
}
