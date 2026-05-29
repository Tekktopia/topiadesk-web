'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  User,
  Mail,
  Phone,
  Lock,
  ShieldCheck,
  Bell,
  Palette,
  LogOut,
  Camera,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  Globe,
  Clock,
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
  Switch,
  cn,
} from '@topiadesk/ui';

// ─── Mock current user ────────────────────────────────────────────────────────

const ME = {
  id: 'a1',
  name: 'Tunde Bakare',
  email: 'tunde@consomoafrica.com',
  phone: '+234 801 234 5678',
  role: 'Senior Agent',
  group: 'Tier 1 Support',
  timezone: 'Africa/Lagos',
  language: 'en-GB',
  mfaEnabled: true,
  joinedAt: '1 Sep 2024',
  lastLogin: '2 minutes ago',
  avatar: 'TB',
};

type Tab = 'profile' | 'security' | 'notifications' | 'appearance';

// ─── Notification prefs ────────────────────────────────────────────────────────

const NOTIF_PREFS = [
  { key: 'new_ticket',      label: 'New ticket assigned to me',     email: true,  push: true  },
  { key: 'sla_warning',     label: 'SLA warning (30 min before)',   email: true,  push: true  },
  { key: 'sla_breach',      label: 'SLA breach',                    email: true,  push: true  },
  { key: 'customer_reply',  label: 'Customer replied to my ticket', email: true,  push: true  },
  { key: 'mention',         label: 'Someone mentioned me',          email: true,  push: true  },
  { key: 'ticket_resolved', label: 'Ticket resolved by someone',    email: false, push: false },
  { key: 'weekly_digest',   label: 'Weekly performance digest',     email: true,  push: false },
];

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS: { key: Tab; label: string; icon: typeof User }[] = [
  { key: 'profile',       label: 'Profile',        icon: User       },
  { key: 'security',      label: 'Security',       icon: ShieldCheck },
  { key: 'notifications', label: 'Notifications',  icon: Bell       },
  { key: 'appearance',    label: 'Appearance',     icon: Palette    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>('profile');

  // profile form
  const [name,  setName]  = useState(ME.name);
  const [phone, setPhone] = useState(ME.phone);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  function handleProfileSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    window.setTimeout(() => { setSaving(false); setSaved(true); window.setTimeout(() => setSaved(false), 2500); }, 700);
  }

  // password form
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [currentPw,   setCurrentPw]   = useState('');
  const [newPw,       setNewPw]       = useState('');
  const [confirmPw,   setConfirmPw]   = useState('');
  const [pwSaving,    setPwSaving]    = useState(false);
  const [pwSaved,     setPwSaved]     = useState(false);

  function handlePasswordSave(e: FormEvent) {
    e.preventDefault();
    setPwSaving(true);
    window.setTimeout(() => { setPwSaving(false); setPwSaved(true); setCurrentPw(''); setNewPw(''); setConfirmPw(''); window.setTimeout(() => setPwSaved(false), 2500); }, 800);
  }

  // notification prefs
  const [notifPrefs, setNotifPrefs] = useState(NOTIF_PREFS);
  function toggleNotif(key: string, channel: 'email' | 'push') {
    setNotifPrefs((p) => p.map((n) => n.key === key ? { ...n, [channel]: !n[channel] } : n));
  }

  // appearance
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [density, setDensity] = useState<'compact' | 'default' | 'comfortable'>('default');

  return (
    <div className="space-y-5 p-5">
      {/* ── Gradient header ── */}
      <div
        className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5"
      >
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="relative flex flex-wrap items-center gap-5">
          {/* Avatar */}
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-2 ring-white/20">
              <span className="font-display text-2xl font-bold text-white">{ME.avatar}</span>
            </div>
            <button className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md">
              <Camera className="h-3 w-3 text-blue-700" />
            </button>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">My account</p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">{ME.name}</h1>
            <div className="mt-0.5 flex flex-wrap items-center gap-2">
              <span className="text-sm text-white/70">{ME.role}</span>
              <span className="text-white/40">·</span>
              <span className="text-sm text-white/70">{ME.group}</span>
              <Badge className="border-white/20 bg-white/10 text-white text-[10px]">
                {ME.mfaEnabled ? '🔒 MFA on' : 'MFA off'}
              </Badge>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
              <LogOut className="mr-1.5 h-3.5 w-3.5" /> Sign out
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* ── Sidebar tabs ── */}
        <nav className="hidden w-44 shrink-0 flex-col gap-1 md:flex">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all text-left',
                tab === key
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}

          {/* Meta info */}
          <div className="mt-4 space-y-2 border-t border-border/60 pt-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Joined {ME.joinedAt}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Globe className="h-3 w-3" />
              <span>{ME.timezone}</span>
            </div>
          </div>
        </nav>

        {/* ── Tab content ── */}
        <div className="min-w-0 flex-1 space-y-5">
          {/* Mobile tab bar */}
          <div className="flex gap-1 overflow-x-auto rounded-lg border border-border/60 bg-muted/30 p-0.5 md:hidden">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cn(
                  'shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                  tab === key ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── Profile tab ── */}
          {tab === 'profile' && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Personal information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullname">Full name</Label>
                      <Input id="fullname" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Work email</Label>
                      <Input id="email" type="email" value={ME.email} disabled className="bg-muted/40" />
                      <p className="text-[10px] text-muted-foreground">Managed by your organization. Contact an admin to change.</p>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone number</Label>
                      <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="timezone">Timezone</Label>
                      <select id="timezone" defaultValue={ME.timezone} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                        <option>Africa/Lagos</option>
                        <option>Africa/Nairobi</option>
                        <option>Africa/Johannesburg</option>
                        <option>Africa/Accra</option>
                        <option>Europe/London</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button type="submit" size="sm" disabled={saving}>
                      {saving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                      {saving ? 'Saving…' : 'Save changes'}
                    </Button>
                    {saved && (
                      <span className="flex items-center gap-1 text-sm text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" /> Saved
                      </span>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* ── Security tab ── */}
          {tab === 'security' && (
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Change password</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSave} className="max-w-sm space-y-4">
                    {[
                      { id: 'current-pw', label: 'Current password', value: currentPw, set: setCurrentPw, show: showCurrent, toggle: () => setShowCurrent((s) => !s) },
                      { id: 'new-pw',     label: 'New password',     value: newPw,     set: setNewPw,     show: showNew,     toggle: () => setShowNew((s) => !s) },
                      { id: 'confirm-pw', label: 'Confirm new password', value: confirmPw, set: setConfirmPw, show: showNew, toggle: () => setShowNew((s) => !s) },
                    ].map(({ id, label, value, set, show, toggle }) => (
                      <div key={id} className="space-y-1.5">
                        <Label htmlFor={id}>{label}</Label>
                        <div className="relative">
                          <Input id={id} type={show ? 'text' : 'password'} value={value} onChange={(e) => set(e.target.value)} className="pr-10" required />
                          <button type="button" onClick={toggle} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    ))}
                    {newPw && confirmPw && newPw !== confirmPw && (
                      <p className="text-xs text-red-500">Passwords don't match.</p>
                    )}
                    <div className="flex items-center gap-3">
                      <Button type="submit" size="sm" disabled={pwSaving || !currentPw || !newPw || newPw !== confirmPw}>
                        {pwSaving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                        {pwSaving ? 'Updating…' : 'Update password'}
                      </Button>
                      {pwSaved && <span className="flex items-center gap-1 text-sm text-emerald-600"><CheckCircle2 className="h-4 w-4" /> Password updated</span>}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Two-factor authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-foreground">{ME.mfaEnabled ? 'MFA is enabled' : 'MFA is disabled'}</p>
                      <p className="text-xs text-muted-foreground">Using an authenticator app (TOTP). Last verified 2 days ago.</p>
                    </div>
                    <Button size="sm" variant={ME.mfaEnabled ? 'outline' : 'default'}>
                      {ME.mfaEnabled ? 'Manage MFA' : 'Enable MFA'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Active sessions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { device: 'Chrome on macOS', location: 'Lagos, Nigeria', time: 'Active now', current: true },
                    { device: 'Safari on iPhone 15 Pro', location: 'Lagos, Nigeria', time: '3 hours ago', current: false },
                  ].map((s) => (
                    <div key={s.device} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{s.device} {s.current && <Badge className="ml-1 text-[9px]">Current</Badge>}</p>
                        <p className="text-xs text-muted-foreground">{s.location} · {s.time}</p>
                      </div>
                      {!s.current && <Button size="sm" variant="ghost" className="h-7 text-xs text-red-500 hover:text-red-600">Revoke</Button>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ── Notifications tab ── */}
          {tab === 'notifications' && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Notification preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 z-10 bg-[#F4EFE6] shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
                      <tr className="border-b border-border/60">
                        <th className="pb-2 text-left text-xs font-semibold text-muted-foreground">Event</th>
                        <th className="pb-2 text-center text-xs font-semibold text-muted-foreground">Email</th>
                        <th className="pb-2 text-center text-xs font-semibold text-muted-foreground">Push</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {notifPrefs.map((n) => (
                        <tr key={n.key}>
                          <td className="py-3 text-sm text-foreground">{n.label}</td>
                          <td className="py-3 text-center">
                            <Switch checked={n.email} onCheckedChange={() => toggleNotif(n.key, 'email')} />
                          </td>
                          <td className="py-3 text-center">
                            <Switch checked={n.push} onCheckedChange={() => toggleNotif(n.key, 'push')} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Button size="sm" className="mt-4">Save preferences</Button>
              </CardContent>
            </Card>
          )}

          {/* ── Appearance tab ── */}
          {tab === 'appearance' && (
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Theme</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3 max-w-sm">
                    {(['light', 'dark', 'system'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={cn(
                          'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all capitalize',
                          theme === t ? 'border-blue-600 bg-blue-50' : 'border-border hover:border-border/80 hover:bg-muted/30',
                        )}
                      >
                        <div className={cn('h-8 w-8 rounded-lg', t === 'light' ? 'bg-white border border-border' : t === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-white to-slate-900')} />
                        <span className="text-xs font-medium text-foreground">{t}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Interface density</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 max-w-sm">
                    {(['compact', 'default', 'comfortable'] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDensity(d)}
                        className={cn(
                          'flex-1 rounded-lg border py-2.5 text-xs font-medium capitalize transition-all',
                          density === d ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-border text-muted-foreground hover:bg-muted/30',
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
