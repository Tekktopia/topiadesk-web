'use client';

import { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Globe,
  Key,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  Smartphone,
  Trash2,
  Upload,
  User,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
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
import { CURRENT_CUSTOMER } from '@/lib/mock-data';
import { initials, shortDate } from '@/lib/format';

const CONNECTED_ACCOUNTS = [
  {
    id: 'google',
    name: 'Google',
    email: CURRENT_CUSTOMER.email,
    connected: true,
  },
  { id: 'microsoft', name: 'Microsoft', email: '', connected: false },
];

export default function ProfilePage() {
  const [name, setName] = useState(CURRENT_CUSTOMER.name);
  const [email] = useState(CURRENT_CUSTOMER.email);
  const [phone, setPhone] = useState(CURRENT_CUSTOMER.phone);
  const [jobTitle, setJobTitle] = useState(CURRENT_CUSTOMER.jobTitle);
  const [timezone, setTimezone] = useState(CURRENT_CUSTOMER.timezone);
  const [language, setLanguage] = useState(CURRENT_CUSTOMER.preferredLanguage);
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
    <div className="bg-muted/20">
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 lg:px-8">
        <header>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Profile
          </p>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Your profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage how the support team sees you. Member since{' '}
            {shortDate(CURRENT_CUSTOMER.joinedAt)}.
          </p>
        </header>

        <Card>
          <CardHeader className="border-b py-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              Personal details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 text-base">
                <AvatarFallback>{initials(name)}</AvatarFallback>
              </Avatar>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="h-3 w-3" />
                  Upload photo
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600">
                  <Trash2 className="h-3 w-3" />
                  Remove
                </Button>
              </div>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email">Email</Label>
                  <Badge variant="success" className="text-[9px]">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    Verified
                  </Badge>
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  readOnly
                  className="cursor-not-allowed bg-muted text-muted-foreground"
                />
                <p className="text-[10px] text-muted-foreground">
                  To change your email, contact support.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job">Job title</Label>
                <Input
                  id="job"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="company"
                    value={CURRENT_CUSTOMER.company}
                    readOnly
                    className="cursor-not-allowed bg-muted pl-9 text-muted-foreground"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tz">Time zone</Label>
                <Input
                  id="tz"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lang">Preferred language</Label>
                <Input
                  id="lang"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-end gap-2 sm:col-span-2">
                {saved && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" />
                    Saved
                  </span>
                )}
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="h-3 w-3 animate-spin" />}
                  {saving ? 'Saving' : 'Save changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b py-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4" />
              Sign-in & security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <Row
              icon={Key}
              title="Password"
              description="Last changed 84 days ago"
              action={
                <Button variant="outline" size="sm">
                  Change password
                </Button>
              }
            />
            <Separator />
            <Row
              icon={Smartphone}
              title="Two-factor authentication"
              description="Authenticator app and SMS fallback enabled"
              action={
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              }
              badge={
                <Badge variant="success" className="text-[9px]">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  On
                </Badge>
              }
            />
            <Separator />
            <Row
              icon={Globe}
              title="Active sessions"
              description="2 devices currently signed in"
              action={
                <Button variant="outline" size="sm">
                  Sign out other devices
                </Button>
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b py-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4" />
              Connected accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-6">
            {CONNECTED_ACCOUNTS.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between rounded-md border bg-card p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-md bg-muted">
                    {a.id === 'google' ? '🔵' : '🟦'}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{a.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {a.connected ? a.email : 'Not connected'}
                    </p>
                  </div>
                </div>
                <Button variant={a.connected ? 'outline' : 'default'} size="sm">
                  {a.connected ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b py-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4" />
              Contact preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-6 text-sm">
            <p className="text-xs text-muted-foreground">
              How should the support team reach you when working on your
              tickets?
            </p>
            <div className="space-y-2">
              {[
                { label: 'Email replies', enabled: true },
                { label: 'SMS for urgent updates', enabled: true },
                { label: 'WhatsApp', enabled: false },
                { label: 'Phone callback offered', enabled: true },
              ].map((p) => (
                <label
                  key={p.label}
                  className="flex cursor-pointer items-center justify-between rounded-md border bg-card p-3"
                >
                  <span>{p.label}</span>
                  <input
                    type="checkbox"
                    defaultChecked={p.enabled}
                    className="h-4 w-4 accent-primary"
                  />
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface RowProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action: React.ReactNode;
  badge?: React.ReactNode;
}

function Row({ icon: Icon, title, description, action, badge }: RowProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-md bg-muted text-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{title}</p>
          {badge}
        </div>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
