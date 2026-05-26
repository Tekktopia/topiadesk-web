import { Badge, type BadgeProps } from '@topiadesk/ui';
import type { CustomerTicketStatus } from '@/lib/mock-data';

const META: Record<
  CustomerTicketStatus,
  { label: string; variant: BadgeProps['variant'] }
> = {
  submitted: { label: 'Submitted', variant: 'info' },
  in_progress: { label: 'In progress', variant: 'warning' },
  waiting_on_you: { label: 'Waiting on you', variant: 'danger' },
  resolved: { label: 'Resolved', variant: 'success' },
  closed: { label: 'Closed', variant: 'secondary' },
};

export function PortalStatusBadge({
  status,
}: {
  status: CustomerTicketStatus;
}) {
  const meta = META[status];
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}
