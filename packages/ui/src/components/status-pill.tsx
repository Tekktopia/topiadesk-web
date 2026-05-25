import { Badge } from './badge';

type StatusVariant = 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

const statusMeta: Record<string, { label: string; variant: StatusVariant }> = {
  new: { label: 'New', variant: 'info' },
  open: { label: 'Open', variant: 'info' },
  in_progress: { label: 'In progress', variant: 'warning' },
  pending: { label: 'Pending', variant: 'secondary' },
  on_hold: { label: 'On hold', variant: 'secondary' },
  escalated: { label: 'Escalated', variant: 'danger' },
  resolved: { label: 'Resolved', variant: 'success' },
  closed: { label: 'Closed', variant: 'secondary' },
  reopened: { label: 'Reopened', variant: 'warning' },
  spam: { label: 'Spam', variant: 'secondary' },
};

export interface StatusPillProps {
  status: string;
}

export function StatusPill({ status }: StatusPillProps) {
  const meta = statusMeta[status] ?? { label: status, variant: 'secondary' as StatusVariant };
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}
