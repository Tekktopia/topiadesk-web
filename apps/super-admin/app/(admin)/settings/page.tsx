'use client';

import { useState } from 'react';
import {
  Bell,
  Building2,
  CheckCircle2,
  CreditCard,
  Database,
  Eye,
  EyeOff,
  Globe,
  Key,
  Mail,
  Save,
  Server,
  Shield,
  Smartphone,
  User,
  Webhook,
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
  Switch,
  cn,
} from '@topiadesk/ui';

// ─── Mock platform settings ──────────────────────────────────────────────────

const PLATFORM = {
  name: 'Topiadesk',
  primaryDomain: 'topiadesk.com',
  supportEmail: 'support@topiadesk.com',
  defaultRegion: 'eu-west-1',
  timezone: 'UTC',
  language: 'en-GB',
};

const SECURITY = {
  mfaRequiredForAdmins: true,
  sessionTimeoutMinutes: 60,
  passwordMinLength: 14,
  passwordRotationDays: 90,
  ipAllowlistEnabled: false,
  ssoEnforced: false,
};

const NOTIFICATIONS = {
  systemAlerts:       true,
  newTenantSignups:   true,
  paymentFailures:    true,
  securityIncidents:  true,
  weeklyReports:      false,
  marketingUpdates:   false,
};

const INTEGRATIONS = [
  { id: 'stripe',  name: 'Stripe',        kind: 'Billing',       status: 'connected',   icon: CreditCard },
  { id: 'twilio',  name: 'Twilio',        kind: 'SMS / Voice',   status: 'connected',   icon: Smartphone },
  { id: 'sendgrid',name: 'SendGrid',      kind: 'Email',         status: 'connected',   icon: Mail },
  { id: 'segment', name: 'Segment',       kind: 'Analytics',     status: 'disconnected',icon: Webhook },
  { id: 'datadog', name: 'Datadog',       kind: 'Observability', status: 'connected',   icon: Server },
] as const;

// ─── Section primitive ──────────────────────────────────────────────────────

function Section({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: typeof User;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-coral/10">
            <Icon className="h-4 w-4 text-coral" />
          </span>
          <div>
            <CardTitle className="text-sm font-semibold">{title}</CardTitle>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">{children}</CardContent>
    </Card>
  );
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [platform, setPlatform]           = useState(PLATFORM);
  const [security, setSecurity]           = useState(SECURITY);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [showApiKey, setShowApiKey]       = useState(false);

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
      {/* Fixed header */}
      <div className="shrink-0 p-5 pb-0">
        <header className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Super Admin</p>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">Platform Settings</h1>
              <p className="mt-0.5 text-sm text-white/70">Configure platform-wide defaults, security, notifications and integrations.</p>
            </div>
            <Button size="sm" className="bg-coral text-white hover:bg-coral-dark">
              <Save className="h-3 w-3" />Save changes
            </Button>
          </div>
        </header>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 grid gap-5 overflow-y-auto p-5 pt-5 lg:grid-cols-2">

        {/* ─── Platform ─── */}
        <Section
          title="Platform"
          description="Branding, domains and regional defaults"
          icon={Globe}
        >
          <div className="space-y-3">
            <SettingRow label="Platform name">
              <Input
                value={platform.name}
                onChange={(e) => setPlatform({ ...platform, name: e.target.value })}
                className="h-8 w-44 text-xs"
              />
            </SettingRow>
            <SettingRow label="Primary domain">
              <Input
                value={platform.primaryDomain}
                onChange={(e) => setPlatform({ ...platform, primaryDomain: e.target.value })}
                className="h-8 w-44 font-mono text-xs"
              />
            </SettingRow>
            <SettingRow label="Support email">
              <Input
                value={platform.supportEmail}
                onChange={(e) => setPlatform({ ...platform, supportEmail: e.target.value })}
                type="email"
                className="h-8 w-56 text-xs"
              />
            </SettingRow>
            <SettingRow label="Default region">
              <select
                value={platform.defaultRegion}
                onChange={(e) => setPlatform({ ...platform, defaultRegion: e.target.value })}
                className="h-8 rounded-md border border-input bg-card px-2 text-xs"
              >
                <option value="eu-west-1">EU West (Ireland)</option>
                <option value="us-east-1">US East (N. Virginia)</option>
                <option value="ap-south-1">Asia Pacific (Mumbai)</option>
                <option value="af-south-1">Africa (Cape Town)</option>
              </select>
            </SettingRow>
            <SettingRow label="Default timezone">
              <select
                value={platform.timezone}
                onChange={(e) => setPlatform({ ...platform, timezone: e.target.value })}
                className="h-8 rounded-md border border-input bg-card px-2 text-xs"
              >
                <option value="UTC">UTC</option>
                <option value="Europe/London">Europe/London</option>
                <option value="Africa/Lagos">Africa/Lagos</option>
                <option value="America/New_York">America/New_York</option>
              </select>
            </SettingRow>
            <SettingRow label="Default language">
              <select
                value={platform.language}
                onChange={(e) => setPlatform({ ...platform, language: e.target.value })}
                className="h-8 rounded-md border border-input bg-card px-2 text-xs"
              >
                <option value="en-GB">English (UK)</option>
                <option value="en-US">English (US)</option>
                <option value="fr-FR">French</option>
                <option value="ar-SA">Arabic</option>
              </select>
            </SettingRow>
          </div>
        </Section>

        {/* ─── Security ─── */}
        <Section
          title="Security"
          description="Authentication, sessions and access controls"
          icon={Shield}
        >
          <div className="space-y-1">
            <SettingRow
              label="Require MFA for admins"
              description="Force two-factor authentication for all admin-level users"
            >
              <Switch
                checked={security.mfaRequiredForAdmins}
                onCheckedChange={(v) => setSecurity({ ...security, mfaRequiredForAdmins: v })}
              />
            </SettingRow>
            <SettingRow
              label="Enforce SSO"
              description="All logins must go through configured SSO provider"
            >
              <Switch
                checked={security.ssoEnforced}
                onCheckedChange={(v) => setSecurity({ ...security, ssoEnforced: v })}
              />
            </SettingRow>
            <SettingRow
              label="IP allowlist"
              description="Restrict admin portal access to specific IPs"
            >
              <Switch
                checked={security.ipAllowlistEnabled}
                onCheckedChange={(v) => setSecurity({ ...security, ipAllowlistEnabled: v })}
              />
            </SettingRow>
            <SettingRow
              label="Session timeout"
              description="Auto-logout after period of inactivity"
            >
              <select
                value={security.sessionTimeoutMinutes}
                onChange={(e) => setSecurity({ ...security, sessionTimeoutMinutes: Number(e.target.value) })}
                className="h-8 rounded-md border border-input bg-card px-2 text-xs"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={240}>4 hours</option>
                <option value={480}>8 hours</option>
              </select>
            </SettingRow>
            <SettingRow
              label="Password minimum length"
              description="Required minimum character count"
            >
              <Input
                type="number"
                value={security.passwordMinLength}
                onChange={(e) => setSecurity({ ...security, passwordMinLength: Number(e.target.value) })}
                className="h-8 w-20 text-xs tabular-nums"
              />
            </SettingRow>
            <SettingRow
              label="Password rotation"
              description="Force password change after N days"
            >
              <Input
                type="number"
                value={security.passwordRotationDays}
                onChange={(e) => setSecurity({ ...security, passwordRotationDays: Number(e.target.value) })}
                className="h-8 w-20 text-xs tabular-nums"
              />
            </SettingRow>
          </div>
        </Section>

        {/* ─── Notifications ─── */}
        <Section
          title="Notifications"
          description="Email and in-app alerts for platform events"
          icon={Bell}
        >
          <div className="space-y-1">
            <SettingRow label="System alerts" description="Critical platform health events">
              <Switch
                checked={notifications.systemAlerts}
                onCheckedChange={(v) => setNotifications({ ...notifications, systemAlerts: v })}
              />
            </SettingRow>
            <SettingRow label="New tenant signups" description="When a tenant first registers">
              <Switch
                checked={notifications.newTenantSignups}
                onCheckedChange={(v) => setNotifications({ ...notifications, newTenantSignups: v })}
              />
            </SettingRow>
            <SettingRow label="Payment failures" description="Failed charge or chargebacks">
              <Switch
                checked={notifications.paymentFailures}
                onCheckedChange={(v) => setNotifications({ ...notifications, paymentFailures: v })}
              />
            </SettingRow>
            <SettingRow label="Security incidents" description="Suspicious logins, lockouts">
              <Switch
                checked={notifications.securityIncidents}
                onCheckedChange={(v) => setNotifications({ ...notifications, securityIncidents: v })}
              />
            </SettingRow>
            <SettingRow label="Weekly reports" description="Platform usage summary every Monday">
              <Switch
                checked={notifications.weeklyReports}
                onCheckedChange={(v) => setNotifications({ ...notifications, weeklyReports: v })}
              />
            </SettingRow>
            <SettingRow label="Marketing updates" description="Product news, blog posts and tips">
              <Switch
                checked={notifications.marketingUpdates}
                onCheckedChange={(v) => setNotifications({ ...notifications, marketingUpdates: v })}
              />
            </SettingRow>
          </div>
        </Section>

        {/* ─── API access ─── */}
        <Section
          title="API access"
          description="Tokens and webhooks for programmatic access"
          icon={Key}
        >
          <div className="space-y-3">
            <SettingRow
              label="Master API key"
              description="Full platform read/write — keep secret"
            >
              <div className="flex items-center gap-2">
                <code className="rounded-md border border-input bg-muted/40 px-2.5 py-1 font-mono text-xs tabular-nums">
                  {showApiKey ? 'sk_live_4e8a91dcf2b6c0a3e8f74d5c9b1a2e8d' : '•'.repeat(36)}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => setShowApiKey((s) => !s)}
                >
                  {showApiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
            </SettingRow>
            <SettingRow
              label="Webhook endpoint"
              description="POST URL for platform events"
            >
              <Input
                placeholder="https://api.example.com/webhooks/topiadesk"
                className="h-8 w-64 text-xs"
              />
            </SettingRow>
            <SettingRow
              label="Rate limit"
              description="Maximum API calls per minute, per tenant"
            >
              <Input
                type="number"
                defaultValue={1000}
                className="h-8 w-20 text-xs tabular-nums"
              />
            </SettingRow>
            <div className="mt-3 flex gap-2 border-t border-border/60 pt-3">
              <Button variant="outline" size="sm">
                <Key className="h-3 w-3" />Rotate key
              </Button>
              <Button variant="outline" size="sm">
                <Webhook className="h-3 w-3" />Test webhook
              </Button>
            </div>
          </div>
        </Section>

        {/* ─── Integrations ─── */}
        <Section
          title="Connected integrations"
          description="Third-party services wired into the platform"
          icon={Webhook}
        >
          <ul className="divide-y divide-border/60">
            {INTEGRATIONS.map((int) => {
              const Icon = int.icon;
              const connected = int.status === 'connected';
              return (
                <li
                  key={int.id}
                  className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card">
                      <Icon className="h-3.5 w-3.5 text-foreground/80" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{int.name}</p>
                      <p className="text-[11px] text-muted-foreground">{int.kind}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={connected ? 'success' : 'secondary'}
                      className={cn(
                        'h-5 text-[10px]',
                        connected
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {connected
                        ? <><CheckCircle2 className="mr-1 h-2.5 w-2.5" />Connected</>
                        : 'Disconnected'}
                    </Badge>
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                      {connected ? 'Configure' : 'Connect'}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </Section>

        {/* ─── Data & retention ─── */}
        <Section
          title="Data & retention"
          description="Backup, export and compliance windows"
          icon={Database}
        >
          <div className="space-y-1">
            <SettingRow
              label="Daily backups"
              description="Snapshots retained for 35 days"
            >
              <Switch defaultChecked />
            </SettingRow>
            <SettingRow
              label="Ticket retention"
              description="Closed tickets are archived after this period"
            >
              <select className="h-8 rounded-md border border-input bg-card px-2 text-xs">
                <option>90 days</option>
                <option>180 days</option>
                <option>1 year</option>
                <option>3 years</option>
                <option>Indefinite</option>
              </select>
            </SettingRow>
            <SettingRow
              label="Audit log retention"
              description="Compliance / forensics window"
            >
              <select className="h-8 rounded-md border border-input bg-card px-2 text-xs">
                <option>1 year</option>
                <option>3 years</option>
                <option>7 years</option>
              </select>
            </SettingRow>
            <div className="mt-3 flex gap-2 border-t border-border/60 pt-3">
              <Button variant="outline" size="sm">Export platform data</Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:border-red-200 hover:bg-red-50">
                Schedule deletion
              </Button>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
