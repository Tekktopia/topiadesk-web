import Link from 'next/link';
import { TENANT } from '@/lib/mock-data';

export function PortalFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <span className="text-base">{TENANT.emoji}</span>
          <span>
            {TENANT.name} support &middot; powered by{' '}
            <span className="font-semibold text-foreground">Topiadesk</span>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/kb" className="hover:text-foreground">
            Help center
          </Link>
          <Link href={`mailto:${TENANT.supportEmail}`} className="hover:text-foreground">
            {TENANT.supportEmail}
          </Link>
          <Link href="#" className="hover:text-foreground">
            Status
          </Link>
          <Link href="#" className="hover:text-foreground">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
