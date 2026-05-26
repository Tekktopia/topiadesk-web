'use client';

import { useState } from 'react';
import {
  Building2,
  Check,
  Globe2,
  Info,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
} from '@topiadesk/ui';
import { TENANT } from '@/lib/mock-data';

export default function TenantSettingsPage() {
  const [name, setName] = useState(TENANT.name);
  const [subdomain, setSubdomain] = useState(TENANT.subdomain);
  const [supportEmail, setSupportEmail] = useState(TENANT.supportEmail);
  const [language, setLanguage] = useState(TENANT.language);
  const [timezone, setTimezone] = useState(TENANT.timezone);
  const [currency, setCurrency] = useState(TENANT.currency);
  const [region, setRegion] = useState(TENANT.region);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    }, 700);
  }

  return (
    <div className="space-y-5 p-5 lg:p-6">
      <header>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Workspace
        </p>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Tenant settings
        </h1>
        <p className="text-sm text-muted-foreground">
          General configuration that applies across this Topiadesk tenant.
        </p>
      </header>

      <form
        onSubmit={handleSave}
        className="space-y-5"
      >
        <Card>
          <CardHeader className="border-b py-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4" />
              Tenant identity
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Tenant name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">
                Shown to your agents and customers across the portal.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="subdomain">Subdomain</Label>
                <Badge variant="success" className="text-[9px]">
                  <Check className="h-2.5 w-2.5" />
                  Verified
                </Badge>
              </div>
              <div className="flex overflow-hidden rounded-md border border-input bg-card text-sm">
                <input
                  id="subdomain"
                  value={subdomain}
                  onChange={(e) =>
                    setSubdomain(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                    )
                  }
                  className="flex-1 bg-transparent px-3 py-2 outline-none"
                />
                <div className="flex items-center bg-muted px-3 font-mono text-xs text-muted-foreground">
                  .topiadesk.com
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Changing the subdomain breaks existing email-channel routes.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Support email</Label>
              <Input
                id="support-email"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">
                Default reply-from address on agent replies.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b py-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Globe2 className="h-4 w-4" />
              Locale & region
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lang">Default language</Label>
              <Input
                id="lang"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tz">Default time zone</Label>
              <Input
                id="tz"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">
                Used in time-tracking, billing and asset-cost reports.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Data residency region</Label>
              <Input
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                readOnly
                className="cursor-not-allowed bg-muted"
              />
              <p className="text-[10px] text-muted-foreground">
                Region is fixed at provisioning. Contact your Account Officer
                to migrate.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b py-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4" />
              Privacy & data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-6 text-sm">
            <Toggle
              label="Auto-delete resolved tickets after 24 months"
              description="GDPR / NDPR retention. Resolved tickets are anonymised then purged."
              defaultChecked
            />
            <Separator />
            <Toggle
              label="Allow customer data export by tenant admins"
              description="Tenant admins can export ticket and contact data on request."
              defaultChecked
            />
            <Separator />
            <Toggle
              label="Allow Topiadesk Managed Tenant Admins to impersonate"
              description="When enabled, our managed admin team can act on your behalf. Every action is logged in the audit trail."
            />
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center justify-end gap-3">
          {saved && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
              <Check className="h-3 w-3" />
              Saved
            </span>
          )}
          <Button variant="ghost" type="button">
            Discard changes
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="h-3 w-3 animate-spin" />}
            {saving ? 'Saving' : 'Save changes'}
          </Button>
        </div>
      </form>

      <Card className="border-red-300/60 bg-red-50/40">
        <CardHeader className="border-b border-red-200/40 py-3">
          <CardTitle className="flex items-center gap-2 text-sm text-red-700">
            <Info className="h-4 w-4" />
            Danger zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-6 text-sm">
          <DangerRow
            title="Export tenant data"
            description="Download every ticket, asset and contact in this tenant as a ZIP."
            action="Request export"
          />
          <Separator />
          <DangerRow
            title="Suspend tenant"
            description="Read-only mode for all users until reactivated."
            action="Suspend"
            destructive
          />
          <Separator />
          <DangerRow
            title="Delete tenant"
            description="Schedules tenant deletion in 30 days. All data is purged after that."
            action="Delete tenant"
            destructive
          />
        </CardContent>
      </Card>
    </div>
  );
}

function Toggle({
  label,
  description,
  defaultChecked = false,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-3">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 accent-primary"
      />
    </label>
  );
}

function DangerRow({
  title,
  description,
  action,
  destructive,
}: {
  title: string;
  description: string;
  action: string;
  destructive?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
      <Button
        type="button"
        variant={destructive ? 'destructive' : 'outline'}
        size="sm"
      >
        {action}
      </Button>
    </div>
  );
}
