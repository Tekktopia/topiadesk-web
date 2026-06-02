'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  ArrowLeft,
  AtSign,
  Calendar,
  ChevronDown,
  Clock,
  Globe,
  Loader2,
  Mail,
  MessageSquare,
  Paperclip,
  Phone,
  Send,
  Smartphone,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Input,
  Label,
  Textarea,
  cn,
} from '@topiadesk/ui';

const CHANNELS = [
  { id: 'email', label: 'Email', icon: Mail, max: '5000 recipients' },
  { id: 'sms', label: 'SMS', icon: MessageSquare, max: '500 recipients' },
  { id: 'whatsapp', label: 'WhatsApp', icon: Smartphone, max: '500 recipients' },
  { id: 'voice', label: 'Voice broadcast', icon: Phone, max: 'Manual approval' },
];

const AUDIENCES = [
  { id: 'list', label: 'A contact list', help: 'Pick a saved segment or upload CSV' },
  { id: 'tag', label: 'Tagged contacts', help: 'Everyone with one or more tags' },
  { id: 'tier', label: 'Service tier', help: 'VIP, Gold, etc.' },
  { id: 'single', label: 'One person', help: 'Quick one-off send' },
];

const TEMPLATES = [
  { id: 'tpl-update', label: 'Service update', subject: 'Important update from {{tenant.name}}' },
  { id: 'tpl-survey', label: 'CSAT survey reminder', subject: 'How did we do on ticket {{ticket.number}}?' },
  { id: 'tpl-renewal', label: 'Renewal notice', subject: 'Your {{product}} subscription renews in {{days}} days' },
  { id: 'tpl-maintenance', label: 'Maintenance window', subject: 'Planned maintenance: {{date}}' },
];

export default function NewOutreachPage() {
  const [channel, setChannel] = useState('email');
  const [audience, setAudience] = useState('list');
  const [recipients, setRecipients] = useState('');
  const [template, setTemplate] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [whenMode, setWhenMode] = useState<'now' | 'schedule'>('now');
  const [scheduleAt, setScheduleAt] = useState('');
  const [trackOpens, setTrackOpens] = useState(true);
  const [trackClicks, setTrackClicks] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const currentChannel = CHANNELS.find((c) => c.id === channel)!;
  const ChannelIcon = currentChannel.icon;
  const requiresSubject = channel === 'email';
  const canSubmit =
    recipients.length > 2 &&
    body.length > 10 &&
    (!requiresSubject || subject.length > 3);

  function applyTemplate(id: string) {
    setTemplate(id);
    const tpl = TEMPLATES.find((t) => t.id === id);
    if (tpl) {
      setSubject(tpl.subject);
      setBody(`Hi {{contact.first_name}},\n\n[Replace this with the body of "${tpl.label}".]\n\nThanks,\n${'ConsomoAfrica Support'}`);
    }
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
                Outreach
              </Link>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">
                New outreach
              </h1>
              <p className="mt-0.5 text-sm text-white/70">
                Send a one-time email, SMS or WhatsApp message to your contacts.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link href="/contacts">Cancel</Link>
              </Button>
              <Button
                form="new-outreach-form"
                type="submit"
                size="sm"
                disabled={!canSubmit || submitting}
                className="bg-coral text-white hover:bg-coral-dark"
              >
                {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
                Save draft
              </Button>
              <Button
                form="new-outreach-form"
                type="submit"
                size="sm"
                disabled={!canSubmit || submitting}
                className="bg-white text-foreground hover:bg-white/90"
              >
                <Send className="h-3 w-3" />
                {whenMode === 'now' ? 'Send now' : 'Schedule'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <form
          id="new-outreach-form"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]"
        >
          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Channel</CardTitle>
                <p className="text-[10px] text-muted-foreground">
                  Each channel has different deliverability and cost.
                </p>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-4">
                {CHANNELS.map((c) => {
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setChannel(c.id)}
                      className={cn(
                        'flex flex-col items-start gap-1 rounded-md border p-3 text-left transition-colors',
                        channel === c.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-card hover:bg-muted',
                      )}
                    >
                      <div
                        className={cn(
                          'grid h-7 w-7 place-items-center rounded-md',
                          channel === c.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground',
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-xs font-semibold">{c.label}</p>
                      <p className="text-[10px] text-muted-foreground">{c.max}</p>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Recipients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label>How do you pick recipients?</Label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {AUDIENCES.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setAudience(a.id)}
                        className={cn(
                          'rounded-md border p-3 text-left transition-colors',
                          audience === a.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border bg-card hover:bg-muted',
                        )}
                      >
                        <p className="text-sm font-semibold">{a.label}</p>
                        <p className="text-[10px] text-muted-foreground">{a.help}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipients">
                    {audience === 'list' && 'Contact list or CSV'}
                    {audience === 'tag' && 'Tags'}
                    {audience === 'tier' && 'Service tier'}
                    {audience === 'single' && 'Email / phone'}
                  </Label>
                  <div className="relative">
                    {audience === 'single' ? (
                      <AtSign className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    ) : (
                      <Users className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    )}
                    <Input
                      id="recipients"
                      value={recipients}
                      onChange={(e) => setRecipients(e.target.value)}
                      placeholder={
                        audience === 'list'
                          ? 'Pick a saved list or paste CSV'
                          : audience === 'tag'
                            ? '#vip, #onboarding'
                            : audience === 'tier'
                              ? 'VIP, Gold'
                              : 'someone@company.com'
                      }
                      className="pl-8"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Estimated audience: <span className="font-medium text-foreground">~1,243 contacts</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label>Template (optional)</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-md border border-input bg-card px-3 py-2 text-sm hover:bg-muted"
                      >
                        {template ? TEMPLATES.find((t) => t.id === template)?.label : 'Start from blank'}
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64">
                      <DropdownMenuLabel>Templates</DropdownMenuLabel>
                      <DropdownMenuItem onSelect={() => setTemplate(null)}>Start from blank</DropdownMenuItem>
                      {TEMPLATES.map((t) => (
                        <DropdownMenuItem key={t.id} onSelect={() => applyTemplate(t.id)}>
                          {t.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {requiresSubject && (
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Use {{contact.first_name}}, {{tenant.name}}, {{ticket.number}}…"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="body">Body *</Label>
                  <Textarea
                    id="body"
                    rows={10}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Hi {{contact.first_name}},\n\nWe wanted to let you know…\n\nThanks,\nConsomoAfrica"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-muted-foreground">
                    <span>
                      {channel === 'sms'
                        ? `${body.length} / 160 characters (SMS may split)`
                        : `${body.length} characters · Variables supported`}
                    </span>
                    <div className="flex gap-1">
                      <button type="button" className="rounded bg-muted px-2 py-0.5 font-mono hover:bg-muted/70">
                        contact.first_name
                      </button>
                      <button type="button" className="rounded bg-muted px-2 py-0.5 font-mono hover:bg-muted/70">
                        tenant.name
                      </button>
                      <button type="button" className="rounded bg-muted px-2 py-0.5 font-mono hover:bg-muted/70">
                        ticket.number
                      </button>
                    </div>
                  </div>
                </div>
                {channel === 'email' && (
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-muted/30 p-2 text-[11px]">
                    <span className="text-muted-foreground inline-flex items-center gap-1">
                      <Paperclip className="h-3 w-3" />
                      Attach files
                    </span>
                    <div className="flex gap-3">
                      <label className="inline-flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={trackOpens}
                          onChange={(e) => setTrackOpens(e.target.checked)}
                          className="h-3 w-3 accent-primary"
                        />
                        Track opens
                      </label>
                      <label className="inline-flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={trackClicks}
                          onChange={(e) => setTrackClicks(e.target.checked)}
                          className="h-3 w-3 accent-primary"
                        />
                        Track clicks
                      </label>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">When</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-6">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setWhenMode('now')}
                    className={cn(
                      'flex items-start gap-2 rounded-md border p-3 text-left',
                      whenMode === 'now'
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card hover:bg-muted',
                    )}
                  >
                    <Send className="mt-0.5 h-3.5 w-3.5" />
                    <div>
                      <p className="text-xs font-semibold">Send now</p>
                      <p className="text-[10px] text-muted-foreground">Starts within 1 minute</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWhenMode('schedule')}
                    className={cn(
                      'flex items-start gap-2 rounded-md border p-3 text-left',
                      whenMode === 'schedule'
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card hover:bg-muted',
                    )}
                  >
                    <Calendar className="mt-0.5 h-3.5 w-3.5" />
                    <div>
                      <p className="text-xs font-semibold">Schedule</p>
                      <p className="text-[10px] text-muted-foreground">Pick a date and time</p>
                    </div>
                  </button>
                </div>
                {whenMode === 'schedule' && (
                  <div className="space-y-2">
                    <Label htmlFor="when">Send at (tenant time zone)</Label>
                    <div className="relative">
                      <Clock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="when"
                        type="datetime-local"
                        value={scheduleAt}
                        onChange={(e) => setScheduleAt(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <ChannelIcon className="h-4 w-4" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {currentChannel.label}
                </p>
                {requiresSubject && (
                  <p className="font-semibold">{subject || 'Subject preview…'}</p>
                )}
                <p className="line-clamp-6 whitespace-pre-wrap rounded-md bg-muted/40 p-2 text-[11px]">
                  {body || 'Body preview…'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <Tip text="Recipients who opted out are automatically excluded." />
                <Tip text="WhatsApp & SMS need pre-approved templates for some regions." />
                <Tip text="Include an unsubscribe link in marketing email by law (UK / EU / NDPR)." />
              </CardContent>
            </Card>

            <Badge variant="outline" className="mx-auto block w-fit text-[10px]">
              <Globe className="h-3 w-3" />
              Sends honour quiet-hours per contact time zone
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

// Unused-X eaten by void marker
const _X = X;
void _X;
