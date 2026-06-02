'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  ArrowLeft,
  AtSign,
  Building2,
  ChevronDown,
  Info,
  Loader2,
  MapPin,
  Phone,
  Sparkles,
  Tag as TagIcon,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Label,
  Textarea,
  cn,
} from '@topiadesk/ui';
import { initials } from '@/lib/format';

const TIERS = [
  { id: 'standard', label: 'Standard', description: 'Default for new customers' },
  { id: 'gold', label: 'Gold', description: 'Premium SLA + named CSM' },
  { id: 'vip', label: 'VIP', description: 'White-glove + fast-track automation' },
  { id: 'internal', label: 'Internal staff', description: 'Internal employee, free' },
];

const TAG_PRESETS = ['decision-maker', 'champion', 'finance', 'security', 'do-not-call'];

export default function NewContactPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [tier, setTier] = useState('standard');
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('Africa/Lagos');
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fullName = `${firstName} ${lastName}`.trim();
  const canSubmit = firstName && email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  function toggleTag(t: string) {
    if (tags.includes(t)) setTags(tags.filter((x) => x !== t));
    else setTags([...tags, t]);
  }
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    window.setTimeout(() => setSubmitting(false), 800);
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
        <div className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link
                href="/contacts"
                className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white"
              >
                <ArrowLeft className="h-3 w-3" />
                Contacts
              </Link>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">
                New contact
              </h1>
              <p className="mt-0.5 text-sm text-white/70">
                Add a customer or end user to the contact directory.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link href="/contacts">Cancel</Link>
              </Button>
              <Button
                form="new-contact-form"
                type="submit"
                size="sm"
                disabled={!canSubmit || submitting}
                className="bg-coral text-white hover:bg-coral-dark"
              >
                {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
                Save contact
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <form
          id="new-contact-form"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]"
        >
          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Identity</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first">First name *</Label>
                  <Input id="first" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last">Last name</Label>
                  <Input id="last" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="email">Work email *</Label>
                  <div className="relative">
                    <AtSign className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="someone@company.com"
                      className="pl-8"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    We use this for ticket notifications and verification.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 803 …"
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job">Job title</Label>
                  <Input id="job" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Company & locale</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <div className="relative">
                    <Building2 className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Bank"
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Lagos, Nigeria"
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lang">Preferred language</Label>
                  <Input id="lang" value={language} onChange={(e) => setLanguage(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tz">Time zone</Label>
                  <Input id="tz" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Tier & tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label>Service tier</Label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {TIERS.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTier(t.id)}
                        className={cn(
                          'rounded-md border p-3 text-left transition-colors',
                          tier === t.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border bg-card hover:bg-muted',
                        )}
                      >
                        <p className="text-sm font-semibold">{t.label}</p>
                        <p className="text-[10px] text-muted-foreground">{t.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {TAG_PRESETS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleTag(t)}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
                          tags.includes(t)
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-input bg-card text-muted-foreground hover:bg-muted',
                        )}
                      >
                        <TagIcon className="h-3 w-3" />
                        #{t}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Internal notes</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything other agents should know. Customers cannot see this."
                />
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{fullName ? initials(fullName) : <User className="h-5 w-5" />}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">
                      {fullName || 'New contact'}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {email || 'No email yet'}
                    </p>
                    {company && (
                      <p className="text-[10px] text-muted-foreground">{company}</p>
                    )}
                  </div>
                </div>
                {tier !== 'standard' && (
                  <Badge variant={tier === 'vip' ? 'warning' : 'success'} className="text-[10px]">
                    {TIERS.find((x) => x.id === tier)?.label}
                  </Badge>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <Tip text="If this person already exists, we will warn you instead of creating a duplicate." />
                <Tip text="VIP tier customers are routed to the VIP fast-track automation by default." />
                <Tip text="Set the time zone — it changes when reply SLA timers tick." />
              </CardContent>
            </Card>

            <Badge variant="outline" className="mx-auto block w-fit text-[10px]">
              <Info className="h-3 w-3" />
              You can also bulk-import contacts via CSV
            </Badge>
          </aside>
        </form>
      </div>
    </div>
  );
}

function Tip({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-md bg-muted/40 p-2">
      <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-coral" />
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}

// keep used
const _UnusedChevron = ChevronDown;
void _UnusedChevron;
const _UnusedDD = DropdownMenu;
void _UnusedDD;
const _UnusedDDC = DropdownMenuContent;
void _UnusedDDC;
const _UnusedDDI = DropdownMenuItem;
void _UnusedDDI;
const _UnusedDDT = DropdownMenuTrigger;
void _UnusedDDT;
