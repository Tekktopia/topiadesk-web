'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  ArrowLeft,
  AtSign,
  ChevronDown,
  Loader2,
  Paperclip,
  Sparkles,
  X,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  PriorityIndicator,
  Textarea,
  cn,
} from '@topiadesk/ui';
import { agentDirectory, mockAssets, mockTickets } from '@/lib/mock-data';
import type { TicketChannel, TicketPriority } from '@/lib/mock-data';
import { initials } from '@/lib/format';

const CATEGORIES = [
  'Network / VPN',
  'Hardware',
  'Software',
  'Email',
  'Access Request',
  'Security / CCTV',
  'Security / Phishing',
  'Identity',
  'Telephony',
  'Mobile',
  'Procurement',
  'Billing',
  'Onboarding',
  'Helpdesk Channels',
];

const GROUPS = [
  'Tier 1 Support',
  'Tier 2 Support',
  'Field Support',
  'Security Ops',
  'IT Operations',
  'Identity & Access',
  'Billing',
];

const CHANNELS: { id: TicketChannel; label: string }[] = [
  { id: 'email', label: 'Email' },
  { id: 'portal', label: 'Customer portal' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'voice', label: 'Voice call' },
  { id: 'sms', label: 'SMS' },
  { id: 'widget', label: 'Web widget' },
  { id: 'api', label: 'API' },
];

const PRIORITIES: TicketPriority[] = ['low', 'medium', 'high', 'urgent'];
const SUGGESTED_TAGS = ['vpn', 'mfa', 'onboarding', 'hardware', 'billing', 'vip', 'security'];

export default function NewTicketPage() {
  const [requester, setRequester] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [group, setGroup] = useState('Tier 1 Support');
  const [assignee, setAssignee] = useState<string | null>(null);
  const [channel, setChannel] = useState<TicketChannel>('portal');
  const [linkedAssetId, setLinkedAssetId] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const kbSuggestions = useMemo(() => {
    if (subject.length < 4) return [];
    const q = subject.toLowerCase();
    return mockTickets
      .filter((t) => t.subject.toLowerCase().includes(q.slice(0, 4)))
      .slice(0, 3)
      .map((t) => ({ id: t.id, title: t.subject }));
  }, [subject]);

  const canSubmit = !!requester && subject.length > 4 && !!category && description.length > 10;

  function addTag(t: string) {
    const clean = t.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!clean || tags.includes(clean)) return;
    setTags([...tags, clean]);
    setTagInput('');
  }
  function removeTag(t: string) {
    setTags(tags.filter((x) => x !== t));
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
                href="/tickets"
                className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white"
              >
                <ArrowLeft className="h-3 w-3" />
                Tickets
              </Link>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">
                New ticket
              </h1>
              <p className="mt-0.5 text-sm text-white/70">
                Open a ticket on behalf of a customer. They will be notified once you save.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link href="/tickets">Cancel</Link>
              </Button>
              <Button
                form="new-ticket-form"
                type="submit"
                size="sm"
                disabled={!canSubmit || submitting}
                className="bg-coral text-white hover:bg-coral-dark"
              >
                {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
                Save draft
              </Button>
              <Button
                form="new-ticket-form"
                type="submit"
                size="sm"
                disabled={!canSubmit || submitting}
                className="bg-white text-foreground hover:bg-white/90"
              >
                Create ticket
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <form
          id="new-ticket-form"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]"
        >
          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Requester & subject</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label htmlFor="requester">Requester *</Label>
                  <div className="relative">
                    <AtSign className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="requester"
                      value={requester}
                      onChange={(e) => setRequester(e.target.value)}
                      placeholder="Search by name, email, or paste an address"
                      className="pl-8"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    A new contact will be created automatically if the email is not on file.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Short one-line summary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    rows={8}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What was the customer trying to do? What happened? Include any error messages."
                  />
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{description.length} characters · Markdown supported</span>
                    <button type="button" className="inline-flex items-center gap-1 hover:text-foreground">
                      <Paperclip className="h-3 w-3" />
                      Attach files
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Classification</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <SelectField value={category} onChange={setCategory} placeholder="Select a category" options={CATEGORIES} />
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {PRIORITIES.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={cn(
                          'flex items-center justify-center gap-1 rounded-md border py-2 text-[11px] capitalize transition-colors',
                          priority === p
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border bg-card hover:bg-muted',
                        )}
                      >
                        <PriorityIndicator priority={p} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Channel</Label>
                  <SelectField
                    value={channel}
                    onChange={(v) => setChannel(v as TicketChannel)}
                    options={CHANNELS.map((c) => c.id)}
                    formatLabel={(v) => CHANNELS.find((c) => c.id === v)?.label ?? v}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Linked asset</Label>
                  <SelectField
                    value={linkedAssetId ?? ''}
                    onChange={(v) => setLinkedAssetId(v || null)}
                    placeholder="No asset linked"
                    options={['', ...mockAssets.map((a) => a.id)]}
                    formatLabel={(v) => {
                      if (!v) return 'No asset linked';
                      const a = mockAssets.find((x) => x.id === v);
                      return a ? `${a.tag} · ${a.name}` : v;
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Assignment</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Group</Label>
                  <SelectField value={group} onChange={setGroup} options={GROUPS} />
                </div>
                <div className="space-y-2">
                  <Label>Assignee</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-md border border-input bg-card px-3 py-2 text-sm hover:bg-muted"
                      >
                        {assignee ? (
                          <span className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback>
                                {initials(agentDirectory.find((a) => a.id === assignee)?.name ?? '')}
                              </AvatarFallback>
                            </Avatar>
                            {agentDirectory.find((a) => a.id === assignee)?.name}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Auto-assign by group</span>
                        )}
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64">
                      <DropdownMenuLabel>Pick an agent</DropdownMenuLabel>
                      <DropdownMenuItem onSelect={() => setAssignee(null)}>
                        Auto-assign by group
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {agentDirectory.map((a) => (
                        <DropdownMenuItem key={a.id} onSelect={() => setAssignee(a.id)}>
                          <Avatar className="h-5 w-5">
                            <AvatarFallback>{initials(a.name)}</AvatarFallback>
                          </Avatar>
                          {a.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-6">
                <div className="flex flex-wrap items-center gap-1">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                    >
                      #{t}
                      <button type="button" onClick={() => removeTag(t)} aria-label={`Remove ${t}`}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(tagInput);
                      }
                    }}
                    placeholder="Add a tag, press Enter"
                    className="h-7 w-48 text-xs"
                  />
                </div>
                <div className="flex flex-wrap gap-1 text-[10px]">
                  <span className="text-muted-foreground">Suggested:</span>
                  {SUGGESTED_TAGS.filter((s) => !tags.includes(s)).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addTag(s)}
                      className="rounded-full bg-muted px-2 py-0.5 hover:bg-muted/70"
                    >
                      + #{s}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            {kbSuggestions.length > 0 && (
              <Card>
                <CardHeader className="border-b py-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-coral" />
                    Possible matches
                  </CardTitle>
                  <p className="text-[10px] text-muted-foreground">
                    These tickets look similar — check for duplicates
                  </p>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="divide-y">
                    {kbSuggestions.map((s) => (
                      <li key={s.id} className="px-4 py-2 text-xs">
                        <p className="line-clamp-2 font-medium">{s.title}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Before you save</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <Tip text="Use a clear, specific subject. It becomes the email subject the customer sees." />
                <Tip text="Set a category — automations and SLA policies depend on it." />
                <Tip text="If the issue is about a specific device, link the asset for context." />
                <Tip text="VIP customers get the VIP fast-track automatically when tagged correctly." />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 text-xs">
                <label className="flex cursor-pointer items-start gap-2">
                  <input type="checkbox" defaultChecked className="mt-0.5 h-3.5 w-3.5 accent-primary" />
                  <div>
                    <p className="font-medium">Notify the requester</p>
                    <p className="text-[10px] text-muted-foreground">
                      Send confirmation email with ticket number
                    </p>
                  </div>
                </label>
                <label className="flex cursor-pointer items-start gap-2">
                  <input type="checkbox" className="mt-0.5 h-3.5 w-3.5 accent-primary" />
                  <div>
                    <p className="font-medium">Mark as internal-only</p>
                    <p className="text-[10px] text-muted-foreground">
                      Customer cannot see this ticket
                    </p>
                  </div>
                </label>
              </CardContent>
            </Card>

            <p className="text-center text-[10px] text-muted-foreground">
              <Badge variant="outline" className="text-[10px]">Draft</Badge> · auto-saved every 30s
            </p>
          </aside>
        </form>
      </div>
    </div>
  );
}

function SelectField({
  value,
  onChange,
  options,
  placeholder,
  formatLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  formatLabel?: (v: string) => string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-md border border-input bg-card px-3 py-2 text-sm hover:bg-muted"
        >
          <span className={!value && placeholder ? 'text-muted-foreground' : ''}>
            {value ? (formatLabel ? formatLabel(value) : value) : placeholder ?? 'Select…'}
          </span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-64 w-64 overflow-y-auto">
        {options.map((o) => (
          <DropdownMenuItem key={o || 'none'} onSelect={() => onChange(o)}>
            {formatLabel ? formatLabel(o) : o || '—'}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
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
