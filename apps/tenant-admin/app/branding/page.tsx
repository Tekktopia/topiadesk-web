'use client';

import { useState } from 'react';
import {
  Brush,
  Check,
  CheckCircle2,
  Copy,
  Globe,
  Loader2,
  Mail,
  Palette,
  Upload,
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
  cn,
} from '@topiadesk/ui';
import { TENANT } from '@/lib/mock-data';

const PRESET_COLORS = [
  '#1D3A5F',
  '#2563EB',
  '#0EA5E9',
  '#10B981',
  '#F59E0B',
  '#F97316',
  '#EF4444',
  '#A855F7',
];

export default function BrandingPage() {
  const [primary, setPrimary] = useState(TENANT.primaryColor);
  const [accent, setAccent] = useState(TENANT.accentColor);
  const [fromName, setFromName] = useState(TENANT.fromName);
  const [customDomain, setCustomDomain] = useState(TENANT.customDomain);

  return (
    <div className="space-y-5">
      {/* Gradient header */}
      <div className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Workspace</p>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">Branding</h1>
          <p className="mt-0.5 text-sm text-white/70">Control how your tenant looks to customers and in outbound email.</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 space-y-5 overflow-y-auto p-5 pt-5">

      <div className="px-5 pb-5 lg:px-6 lg:pb-6 space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <Card>
            <CardHeader className="border-b py-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Brush className="h-4 w-4" />
                Logo and favicon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <UploadSlot
                  label="Tenant logo"
                  description="Shown in the customer portal header and emails. SVG or 512×128 px PNG."
                  current={TENANT.emoji}
                />
                <UploadSlot
                  label="Favicon"
                  description="Tab icon in the browser. 32×32 px or 64×64 px PNG, or an SVG."
                  current="🌍"
                  square
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b py-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Palette className="h-4 w-4" />
                Colours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 p-6">
              <ColorRow
                label="Primary"
                description="Buttons, links and active states in the portal"
                value={primary}
                onChange={setPrimary}
              />
              <Separator />
              <ColorRow
                label="Accent"
                description="Highlights, badges and the call-to-action ribbon"
                value={accent}
                onChange={setAccent}
              />
              <Separator />
              <div className="space-y-2">
                <Label className="text-xs">Quick presets</Label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-label={`Use ${c}`}
                      onClick={() => setPrimary(c)}
                      className={cn(
                        'h-7 w-7 rounded-md border-2 transition-transform hover:scale-110',
                        primary.toLowerCase() === c.toLowerCase()
                          ? 'border-foreground'
                          : 'border-transparent',
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b py-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                Outbound email
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="from-name">From name</Label>
                <Input
                  id="from-name"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground">
                  Shown in the inbox sender column.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="from-email">From email</Label>
                <Input
                  id="from-email"
                  value={TENANT.supportEmail}
                  readOnly
                  className="cursor-not-allowed bg-muted"
                />
                <p className="text-[10px] text-muted-foreground">
                  Set in tenant settings.
                </p>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="signature">Default email signature</Label>
                <textarea
                  id="signature"
                  rows={3}
                  defaultValue={`The ${TENANT.shortName} support team\n${TENANT.supportEmail}`}
                  className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b py-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4" />
                Custom domain
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-muted/30 p-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'grid h-8 w-8 place-items-center rounded-full',
                      TENANT.customDomainStatus === 'verified'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700',
                    )}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-mono text-sm font-semibold">
                      {TENANT.customDomain}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Status:{' '}
                      <span className="font-medium text-foreground capitalize">
                        {TENANT.customDomainStatus}
                      </span>{' '}
                      · TLS managed by Topiadesk
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Re-verify
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">Set a different custom domain</Label>
                <Input
                  id="domain"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground">
                  Add a CNAME record pointing{' '}
                  <code className="rounded bg-muted px-1">{customDomain}</code>{' '}
                  to{' '}
                  <code className="rounded bg-muted px-1">
                    {TENANT.subdomain}.topiadesk.com
                  </code>
                  .
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <Button variant="ghost">Discard changes</Button>
            <Button>
              <Loader2 className="hidden h-3 w-3 animate-spin" />
              Save branding
            </Button>
          </div>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader className="border-b py-3">
              <CardTitle className="text-sm">Live preview</CardTitle>
              <p className="text-xs text-muted-foreground">
                Customer portal preview
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-3 border-b p-4 text-center">
                <div
                  className="mx-auto grid h-12 w-12 place-items-center rounded-lg text-2xl"
                  style={{ backgroundColor: primary }}
                >
                  {TENANT.emoji}
                </div>
                <p className="font-display text-sm font-bold">
                  {TENANT.name} support
                </p>
              </div>
              <div className="space-y-2 p-4">
                <button
                  type="button"
                  className="w-full rounded-md px-3 py-2 text-sm font-medium text-white"
                  style={{ backgroundColor: primary }}
                >
                  Submit a request
                </button>
                <button
                  type="button"
                  className="w-full rounded-md border px-3 py-2 text-sm font-medium"
                  style={{ borderColor: primary, color: primary }}
                >
                  Track a ticket
                </button>
                <span
                  className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                  style={{ backgroundColor: accent }}
                >
                  Accent badge
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b py-3">
              <CardTitle className="text-sm">Embed code</CardTitle>
              <p className="text-xs text-muted-foreground">
                Add the help widget to your website
              </p>
            </CardHeader>
            <CardContent className="space-y-2 p-4">
              <pre className="overflow-x-auto rounded-md border bg-muted p-2 font-mono text-[10px]">
{`<script
  src="https://${TENANT.subdomain}.topiadesk.com/embed.js"
  async
></script>`}
              </pre>
              <Button variant="outline" size="sm" className="w-full">
                <Copy className="h-3 w-3" />
                Copy snippet
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
      </div>
      </div>
    </div>
  );
}

function UploadSlot({
  label,
  description,
  current,
  square,
}: {
  label: string;
  description: string;
  current: string;
  square?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
        <div
          className={cn(
            'grid place-items-center rounded-md bg-muted text-2xl',
            square ? 'h-14 w-14' : 'h-14 w-24',
          )}
        >
          {current}
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-[11px] text-muted-foreground">{description}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <Upload className="h-3 w-3" />
              Upload
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="h-8 w-10 cursor-pointer rounded-md border border-input bg-card"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-28 rounded-md border border-input bg-card px-2 font-mono text-xs uppercase"
        />
        <Badge variant="outline" className="font-mono text-[10px]">
          <Check className="h-2.5 w-2.5" /> AA contrast
        </Badge>
      </div>
    </div>
  );
}
