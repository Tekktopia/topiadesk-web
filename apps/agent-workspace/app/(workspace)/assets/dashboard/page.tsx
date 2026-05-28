'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import type { ComponentType } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  Camera,
  CheckCircle2,
  Download,
  HardDrive,
  Key,
  Laptop,
  Monitor,
  Plus,
  Printer,
  RefreshCw,
  Server,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ProgressRing,
  Skeleton,
  Sparkline,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from '@topiadesk/ui';
import {
  useAssetDashboard,
  useLicenses,
  useAssetCategories,
  useWarrantyAlerts,
} from '@/lib/queries';
import type { MockLicense, AssetCategory, WarrantyAlert } from '@/lib/mock-data';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function licenseInfo(renewalDate: string) {
  const daysLeft = Math.round(
    (new Date(renewalDate).getTime() - Date.now()) / 86_400_000,
  );
  const status =
    daysLeft < 0
      ? ('expired' as const)
      : daysLeft <= 7
        ? ('critical' as const)
        : daysLeft <= 30
          ? ('expiring_soon' as const)
          : ('active' as const);
  return { daysLeft, status };
}

function warrantyInfo(warrantyEnd: string) {
  const daysLeft = Math.round(
    (new Date(warrantyEnd).getTime() - Date.now()) / 86_400_000,
  );
  const status =
    daysLeft < 0
      ? ('expired' as const)
      : daysLeft <= 14
        ? ('critical' as const)
        : daysLeft <= 60
          ? ('warning' as const)
          : ('ok' as const);
  return { daysLeft, status };
}

// ─── Static chart data ────────────────────────────────────────────────────────

const ASSET_TREND_TOTAL = [220, 225, 230, 232, 238, 241, 243, 244, 245, 246, 247, 247] as const;
const ASSET_TREND_IN_USE = [175, 178, 182, 185, 188, 190, 192, 193, 195, 196, 198, 198] as const;
const WARRANTY_TREND = [3, 4, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12] as const;
const LICENSE_TREND = [1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 5, 5] as const;

const LIFECYCLE_DATA = [
  { range: '< 1 yr', count: 48, color: 'bg-emerald-500' },
  { range: '1–2 yr', count: 71, color: 'bg-emerald-400' },
  { range: '2–3 yr', count: 62, color: 'bg-blue-400' },
  { range: '3–4 yr', count: 41, color: 'bg-amber-400' },
  { range: '4–5 yr', count: 18, color: 'bg-orange-400' },
  { range: '> 5 yr', count: 7, color: 'bg-red-400' },
];

// ─── Category icon map ────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  laptop: Laptop,
  desktop: Monitor,
  mobile: Smartphone,
  cctv: Camera,
  network: Server,
  monitor: Monitor,
  printer: Printer,
  other: HardDrive,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AssetDashboardPage() {
  const metrics = useAssetDashboard();
  const licenses = useLicenses();
  const categories = useAssetCategories();
  const warranty = useWarrantyAlerts();

  const sortedLicenses = useMemo(
    () =>
      [...(licenses.data ?? [])].sort(
        (a, b) =>
          licenseInfo(a.renewalDate).daysLeft - licenseInfo(b.renewalDate).daysLeft,
      ),
    [licenses.data],
  );

  const criticalCount = useMemo(
    () =>
      sortedLicenses.filter((l) => licenseInfo(l.renewalDate).status === 'critical').length,
    [sortedLicenses],
  );

  const expiringCount = useMemo(
    () =>
      sortedLicenses.filter((l) => {
        const { daysLeft } = licenseInfo(l.renewalDate);
        return daysLeft >= 0 && daysLeft <= 30;
      }).length,
    [sortedLicenses],
  );

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 px-5 pt-5">
        <PageHeader />
      </div>

      <div className="flex-1 min-h-0 space-y-5 overflow-y-auto p-5 pt-4">

      {/* Critical license alert banner */}
      {!licenses.isLoading && criticalCount > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950/30">
          <ShieldAlert className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-700 dark:text-red-400">
            <span className="font-semibold">
              {criticalCount} license{criticalCount > 1 ? 's' : ''} expiring within 7 days.
            </span>{' '}
            Renew now to avoid service interruption.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto shrink-0 border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-400"
            asChild
          >
            <a href="#license-manager">Review</a>
          </Button>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Boxes}
          label="Total assets"
          value={metrics.data?.totalAssets}
          sub={`${metrics.data?.inStock ?? 0} in stock · ${metrics.data?.lost ?? 0} lost`}
          accent="default"
          trend={ASSET_TREND_TOTAL}
          loading={metrics.isLoading}
        />
        <MetricCard
          icon={CheckCircle2}
          label="In use"
          value={metrics.data?.inUse}
          sub={`${metrics.data?.underRepair ?? 0} under repair`}
          accent="success"
          trend={ASSET_TREND_IN_USE}
          loading={metrics.isLoading}
        />
        <MetricCard
          icon={AlertTriangle}
          label="Warranty expiring"
          value={metrics.data?.warrantyExpiringIn90Days}
          sub={`${metrics.data?.warrantyExpiringIn30Days ?? 0} within 30 days`}
          accent="warning"
          trend={WARRANTY_TREND}
          loading={metrics.isLoading}
        />
        <MetricCard
          icon={Key}
          label="Licenses expiring"
          value={expiringCount}
          sub={`${criticalCount} need immediate action`}
          accent={criticalCount > 0 ? 'danger' : 'warning'}
          trend={LICENSE_TREND}
          loading={licenses.isLoading}
        />
      </div>

      {/* Category distribution + Warranty alerts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
            <div>
              <CardTitle className="text-sm">Category breakdown</CardTitle>
              <p className="text-xs text-muted-foreground">
                Utilisation across {metrics.data?.totalAssets ?? '—'} registered assets
              </p>
            </div>
            <Link
              href="/assets"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Full inventory
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            {categories.isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-7" />
                ))}
              </div>
            ) : (
              <CategoryChart categories={categories.data ?? []} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
            <div>
              <CardTitle className="text-sm">Warranty alerts</CardTitle>
              <p className="text-xs text-muted-foreground">Expiring or expired</p>
            </div>
            <Badge variant="warning" className="text-[10px]">
              {(warranty.data ?? []).filter(
                (w) => warrantyInfo(w.warrantyEnd).daysLeft <= 60,
              ).length}{' '}
              alerts
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            {warranty.isLoading ? (
              <div className="space-y-2 p-4">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            ) : (
              <WarrantyList alerts={warranty.data ?? []} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* License Manager */}
      <section id="license-manager">
        <LicenseManager licenses={sortedLicenses} loading={licenses.isLoading} />
      </section>

      {/* Audit progress + Asset lifecycle */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="border-b py-3">
            <CardTitle className="text-sm">Audit progress</CardTitle>
            <p className="text-xs text-muted-foreground">Current audit cycle</p>
          </CardHeader>
          <CardContent className="pt-5">
            {metrics.isLoading ? (
              <Skeleton className="mx-auto h-24 w-24 rounded-full" />
            ) : (
              <AuditProgress
                completed={metrics.data?.auditsCompleted ?? 0}
                total={metrics.data?.auditsTotal ?? 0}
              />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
            <div>
              <CardTitle className="text-sm">Asset lifecycle</CardTitle>
              <p className="text-xs text-muted-foreground">
                Age distribution across all registered assets
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <LegendDot color="bg-emerald-500" label="New" />
              <LegendDot color="bg-amber-400" label="Aging" />
              <LegendDot color="bg-red-400" label="Old" />
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <LifecycleChart data={LIFECYCLE_DATA} />
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}

// ─── PageHeader ───────────────────────────────────────────────────────────────

function PageHeader() {
  return (
    <header className="relative overflow-hidden rounded-2xl bg-navy px-6 py-5 shadow-lg shadow-navy/15">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Infrastructure</p>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">Asset Management</h1>
          <p className="mt-0.5 text-sm text-white/70">
            Asset health, warranty status, license renewals and audit tracking
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
            <Download className="h-3 w-3" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
            <RefreshCw className="h-3 w-3" />
            Scan network
          </Button>
          <Button size="sm" className="bg-coral text-white hover:bg-coral-dark">
            <Plus className="h-3 w-3" />
            Add asset
          </Button>
        </div>
      </div>
    </header>
  );
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

type Accent = 'default' | 'info' | 'warning' | 'success' | 'danger';

const ACCENT_CLASSES: Record<Accent, { bg: string; spark: string }> = {
  default: { bg: 'bg-muted text-muted-foreground', spark: 'text-muted-foreground' },
  info: { bg: 'bg-blue-100 text-blue-700', spark: 'text-blue-500' },
  warning: { bg: 'bg-amber-100 text-amber-700', spark: 'text-amber-500' },
  success: { bg: 'bg-emerald-100 text-emerald-700', spark: 'text-emerald-500' },
  danger: { bg: 'bg-red-100 text-red-700', spark: 'text-red-500' },
};

interface MetricCardProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: number | string | undefined;
  sub: string;
  accent: Accent;
  trend: readonly number[];
  loading?: boolean;
}

function MetricCard({ icon: Icon, label, value, sub, accent, trend, loading }: MetricCardProps) {
  const cls = ACCENT_CLASSES[accent];
  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
            {loading ? (
              <Skeleton className="mt-1 h-7 w-16" />
            ) : (
              <p className="mt-0.5 text-2xl font-bold tracking-tight">{value ?? '—'}</p>
            )}
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{sub}</p>
          </div>
          <div className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-lg', cls.bg)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <Sparkline data={[...trend]} width={240} height={28} className={cls.spark} />
      </CardContent>
    </Card>
  );
}

// ─── CategoryChart ────────────────────────────────────────────────────────────

function CategoryChart({ categories }: { categories: AssetCategory[] }) {
  const max = Math.max(...categories.map((c) => c.total), 1);
  return (
    <div className="space-y-3">
      {categories.map((cat) => {
        const Icon = CATEGORY_ICONS[cat.iconKey] ?? HardDrive;
        const pctInUse = Math.round((cat.inUse / cat.total) * 100);
        return (
          <div key={cat.category} className="flex items-center gap-3 text-xs">
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
              <Icon className="h-3.5 w-3.5" />
            </div>
            <span className="w-36 shrink-0 truncate font-medium">{cat.category}</span>
            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-primary/25"
                style={{ width: `${(cat.total / max) * 100}%` }}
              />
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-primary"
                style={{ width: `${(cat.inUse / max) * 100}%` }}
              />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="w-20 shrink-0 text-right tabular-nums text-muted-foreground">
                  {cat.inUse}/{cat.total}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {cat.inUse} in use of {cat.total} total · {pctInUse}% utilisation
              </TooltipContent>
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
}

// ─── WarrantyList ─────────────────────────────────────────────────────────────

const WARRANTY_STATUS_META = {
  expired: { cls: 'text-red-600 dark:text-red-400', label: 'Expired' },
  critical: { cls: 'text-red-600 dark:text-red-400', label: 'Expiring' },
  warning: { cls: 'text-amber-600 dark:text-amber-400', label: 'Expiring' },
  ok: { cls: 'text-emerald-600 dark:text-emerald-400', label: 'OK' },
} as const;

function WarrantyList({ alerts }: { alerts: WarrantyAlert[] }) {
  const sorted = [...alerts].sort(
    (a, b) => warrantyInfo(a.warrantyEnd).daysLeft - warrantyInfo(b.warrantyEnd).daysLeft,
  );
  return (
    <ul className="divide-y">
      {sorted.map((alert) => {
        const { daysLeft, status } = warrantyInfo(alert.warrantyEnd);
        const meta = WARRANTY_STATUS_META[status];
        return (
          <li key={alert.id} className="px-4 py-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-xs font-medium">{alert.name}</p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {alert.tag} · {alert.category}
                </p>
                {alert.assignedTo && (
                  <p className="truncate text-[10px] text-muted-foreground">{alert.assignedTo}</p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <p className={cn('text-xs font-semibold tabular-nums', meta.cls)}>
                  {daysLeft < 0 ? `${Math.abs(daysLeft)}d ago` : `${daysLeft}d left`}
                </p>
                <p className={cn('text-[10px] font-medium', meta.cls)}>{meta.label}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ─── LicenseManager ──────────────────────────────────────────────────────────

const LICENSE_CATEGORY_LABELS: Record<string, string> = {
  productivity: 'Productivity',
  security: 'Security',
  network: 'Network',
  finance: 'Finance',
  communication: 'Comms',
  design: 'Design',
  crm: 'CRM',
};

const LICENSE_STATUS_CONFIG = {
  critical: { label: 'Critical', variant: 'danger' as const },
  expiring_soon: { label: 'Expiring soon', variant: 'warning' as const },
  active: { label: 'Active', variant: 'success' as const },
  expired: { label: 'Expired', variant: 'danger' as const },
};

function LicenseManager({
  licenses,
  loading,
}: {
  licenses: MockLicense[];
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b py-3">
        <div>
          <CardTitle className="text-sm">License manager</CardTitle>
          <p className="text-xs text-muted-foreground">
            All software and infrastructure licenses — sorted by renewal urgency
          </p>
        </div>
        <Button size="sm" variant="outline">
          <Plus className="h-3 w-3" />
          Add license
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                  <th className="px-4 py-2.5 font-semibold">License</th>
                  <th className="px-3 py-2.5 font-semibold">Category</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Seats</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Cost / yr</th>
                  <th className="px-3 py-2.5 font-semibold">Renewal date</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Days left</th>
                  <th className="px-3 py-2.5 font-semibold">Status</th>
                  <th className="px-3 py-2.5 font-semibold">Owner</th>
                  <th className="px-3 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {licenses.map((lic) => (
                  <LicenseRow key={lic.id} license={lic} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LicenseRow({ license: lic }: { license: MockLicense }) {
  const { daysLeft, status } = licenseInfo(lic.renewalDate);
  const renewalFmt = new Date(lic.renewalDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const costFmt = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(lic.costPerYear);
  const seatsFmt =
    lic.seats === null ? 'Device-based' : `${lic.seatsUsed ?? '—'} / ${lic.seats}`;
  const seatsAtCap = lic.seats !== null && lic.seatsUsed === lic.seats;
  const cfg = LICENSE_STATUS_CONFIG[status];

  const rowBg =
    status === 'critical'
      ? 'bg-red-50/50 dark:bg-red-950/20'
      : status === 'expired'
        ? 'bg-red-50/30 dark:bg-red-950/10'
        : '';

  return (
    <tr className={cn('transition-colors hover:bg-muted/40', rowBg)}>
      {/* License name */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          {status === 'critical' && (
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
          )}
          <div>
            <p className="font-medium text-foreground">{lic.name}</p>
            <p className="text-muted-foreground">{lic.vendor}</p>
            {lic.notes && (
              <p className="mt-0.5 text-[10px] italic text-muted-foreground">{lic.notes}</p>
            )}
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-3 py-3">
        <Badge variant="secondary" className="text-[10px]">
          {LICENSE_CATEGORY_LABELS[lic.category] ?? lic.category}
        </Badge>
      </td>

      {/* Seats */}
      <td className="px-3 py-3 text-right tabular-nums">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn(seatsAtCap && 'font-semibold text-amber-600 dark:text-amber-400')}>
              {seatsFmt}
            </span>
          </TooltipTrigger>
          {lic.seats !== null && (
            <TooltipContent>
              {seatsAtCap
                ? 'All seats in use'
                : `${lic.seats - (lic.seatsUsed ?? 0)} seats available`}
            </TooltipContent>
          )}
        </Tooltip>
      </td>

      {/* Cost */}
      <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">{costFmt}</td>

      {/* Renewal date */}
      <td className="px-3 py-3 text-muted-foreground">{renewalFmt}</td>

      {/* Days left */}
      <td className="px-3 py-3 text-right">
        <span
          className={cn(
            'font-semibold tabular-nums',
            (status === 'critical' || status === 'expired') && 'text-red-600 dark:text-red-400',
            status === 'expiring_soon' && 'text-amber-600 dark:text-amber-400',
            status === 'active' && 'text-muted-foreground',
          )}
        >
          {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d`}
        </span>
      </td>

      {/* Status badge */}
      <td className="px-3 py-3">
        <Badge variant={cfg.variant} className="text-[10px]">
          {cfg.label}
        </Badge>
      </td>

      {/* Owner */}
      <td className="px-3 py-3 text-muted-foreground">{lic.owner}</td>

      {/* Actions */}
      <td className="px-3 py-3">
        <Button
          size="sm"
          variant={status === 'active' ? 'outline' : 'default'}
          className={cn(
            'h-7 px-2.5 text-[11px]',
            status === 'critical' &&
              'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800',
          )}
        >
          Renew
        </Button>
      </td>
    </tr>
  );
}

// ─── AuditProgress ────────────────────────────────────────────────────────────

function AuditProgress({ completed, total }: { completed: number; total: number }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const pending = total - completed;
  const overdue = 12;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-5">
        <ProgressRing value={pct} size={88} strokeWidth={8} className="text-emerald-500">
          <div className="text-center">
            <p className="text-base font-semibold">{pct}%</p>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Audited</p>
          </div>
        </ProgressRing>
        <div className="space-y-2 text-xs">
          <StatRow label="Audited" count={completed} dotClass="bg-emerald-500" />
          <StatRow label="Pending" count={pending} dotClass="bg-amber-500" />
          <StatRow label="Overdue" count={overdue} dotClass="bg-red-500" />
        </div>
      </div>
      <div className="space-y-1 text-xs text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">{completed}</span> of{' '}
          <span className="font-medium text-foreground">{total}</span> assets audited
        </p>
        <p>Last scan: Today at 08:14</p>
      </div>
      <Button variant="outline" size="sm" className="w-full text-xs" asChild>
        <Link href="/audits">
          <ShieldCheck className="h-3 w-3" />
          View full audit log
        </Link>
      </Button>
    </div>
  );
}

// ─── LifecycleChart ───────────────────────────────────────────────────────────

interface LifecyclePoint {
  range: string;
  count: number;
  color: string;
}

function LifecycleChart({ data }: { data: LifecyclePoint[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="space-y-2">
      <div className="flex h-40 items-end gap-3">
        {data.map((d) => (
          <Tooltip key={d.range}>
            <TooltipTrigger asChild>
              <div className="group flex flex-1 cursor-default flex-col items-center gap-1">
                <p className="text-[10px] font-medium tabular-nums text-muted-foreground transition-colors group-hover:text-foreground">
                  {d.count}
                </p>
                <div
                  className={cn('w-full rounded-t-sm transition-opacity group-hover:opacity-80', d.color)}
                  style={{ height: `${Math.max((d.count / max) * 128, 4)}px` }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {d.count} assets aged {d.range}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <div className="flex gap-3">
        {data.map((d) => (
          <p key={d.range} className="flex-1 text-center text-[10px] text-muted-foreground">
            {d.range}
          </p>
        ))}
      </div>
    </div>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function StatRow({ label, count, dotClass }: { label: string; count: number; dotClass: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn('h-1.5 w-1.5 rounded-full', dotClass)} />
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-auto font-medium tabular-nums">{count}</span>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className={cn('h-2 w-2 rounded-full', color)} />
      {label}
    </span>
  );
}
