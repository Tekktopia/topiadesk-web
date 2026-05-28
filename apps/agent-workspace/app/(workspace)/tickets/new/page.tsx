'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  User,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  Ticket,
  Tag,
  Paperclip,
  X,
  Loader2,
  HelpCircle,
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
  cn,
} from '@topiadesk/ui';
import { useContacts, useAssets } from '@/lib/queries';
import type { TicketPriority, TicketChannel } from '@/lib/mock-data';

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 'requester' | 'details' | 'classify' | 'review';

interface FormState {
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  subject: string;
  description: string;
  category: string;
  priority: TicketPriority;
  channel: TicketChannel;
  assetId: string;
  assetName: string;
  tags: string[];
  tagInput: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS: { key: Step; label: string }[] = [
  { key: 'requester', label: 'Requester' },
  { key: 'details',   label: 'Details'   },
  { key: 'classify',  label: 'Classify'  },
  { key: 'review',    label: 'Review'    },
];

const CATEGORIES = [
  'Network / VPN', 'Hardware', 'Software', 'Access Request', 'Email',
  'Security / CCTV', 'Telephony', 'Identity', 'Mobile', 'Onboarding',
  'Procurement', 'AV / Meeting Rooms', 'Billing', 'Other',
];

const PRIORITIES: { value: TicketPriority; label: string; color: string; desc: string }[] = [
  { value: 'low',    label: 'Low',    color: 'bg-blue-50 border-blue-200 text-blue-700',   desc: 'No time sensitivity' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-50 border-amber-200 text-amber-700', desc: 'Standard SLA applies'  },
  { value: 'high',   label: 'High',   color: 'bg-orange-50 border-orange-200 text-orange-700', desc: 'Expedite handling' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-50 border-red-200 text-red-700',       desc: 'Critical / P1'     },
];

const CHANNELS: { value: TicketChannel; label: string }[] = [
  { value: 'portal',   label: 'Portal'   },
  { value: 'email',    label: 'Email'    },
  { value: 'voice',    label: 'Voice'    },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'sms',      label: 'SMS'      },
  { value: 'widget',   label: 'Widget'   },
  { value: 'api',      label: 'API'      },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewTicketPage() {
  const router = useRouter();
  const contacts = useContacts();
  const assets = useAssets();

  const [step, setStep] = useState<Step>('requester');
  const [contactSearch, setContactSearch] = useState('');
  const [assetSearch, setAssetSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [newTicketNumber, setNewTicketNumber] = useState('');

  const [form, setForm] = useState<FormState>({
    requesterId: '',
    requesterName: '',
    requesterEmail: '',
    subject: '',
    description: '',
    category: '',
    priority: 'medium',
    channel: 'portal',
    assetId: '',
    assetName: '',
    tags: [],
    tagInput: '',
  });

  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  const filteredContacts = contacts.data?.filter((c) =>
    !contactSearch ||
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(contactSearch.toLowerCase())
  ) ?? [];

  const filteredAssets = assets.data?.filter((a) =>
    !assetSearch ||
    a.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
    a.tag.toLowerCase().includes(assetSearch.toLowerCase())
  ) ?? [];

  function selectContact(id: string, name: string, email: string) {
    set({ requesterId: id, requesterName: name, requesterEmail: email });
    setContactSearch('');
  }

  function selectAsset(id: string, name: string) {
    set({ assetId: id, assetName: name });
    setAssetSearch('');
  }

  function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === 'Enter' || e.key === ',') && form.tagInput.trim()) {
      e.preventDefault();
      const tag = form.tagInput.trim().replace(/,/g, '');
      if (tag && !form.tags.includes(tag)) set({ tags: [...form.tags, tag], tagInput: '' });
    }
  }

  function removeTag(tag: string) {
    set({ tags: form.tags.filter((t) => t !== tag) });
  }

  function canAdvance() {
    if (step === 'requester') return !!form.requesterName && !!form.requesterEmail;
    if (step === 'details')   return !!form.subject && !!form.description;
    if (step === 'classify')  return !!form.category;
    return true;
  }

  function advance() {
    const idx = STEPS.findIndex((s) => s.key === step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1].key);
  }

  function back() {
    const idx = STEPS.findIndex((s) => s.key === step);
    if (idx > 0) setStep(STEPS[idx - 1].key);
  }

  async function submit() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    const num = `#${Math.floor(1100 + Math.random() * 900)}`;
    setNewTicketNumber(num);
    setSubmitting(false);
    setSubmitted(true);
  }

  // ── Success state ────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="space-y-5 p-5">
        <div
          className="relative overflow-hidden rounded-2xl bg-navy px-6 py-5 shadow-lg shadow-navy/15"
        >
          <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="relative">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Helpdesk · Tickets</p>
            <h1 className="font-display mt-0.5 text-2xl font-bold tracking-tight text-white">New Ticket</h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Ticket created!</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ticket <span className="font-semibold text-foreground">{newTicketNumber}</span> has been opened for <span className="font-semibold text-foreground">{form.requesterName}</span>.
          </p>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={() => { setSubmitted(false); setStep('requester'); setForm({ requesterId: '', requesterName: '', requesterEmail: '', subject: '', description: '', category: '', priority: 'medium', channel: 'portal', assetId: '', assetName: '', tags: [], tagInput: '' }); }}>
              Create another
            </Button>
            <Button className="bg-blue-700 text-white hover:bg-blue-800" onClick={() => router.push('/tickets')}>
              <Ticket className="mr-1.5 h-3.5 w-3.5" /> View queue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-5">
      {/* ── Gradient header ── */}
      <div
        className="relative overflow-hidden rounded-2xl bg-navy px-6 py-5 shadow-lg shadow-navy/15"
      >
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link href="/tickets" className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white/90 transition-colors">
              Helpdesk · Tickets
            </Link>
            <h1 className="font-display mt-0.5 text-2xl font-bold tracking-tight text-white">New Ticket</h1>
            <p className="mt-0.5 text-sm text-white/70">Step {stepIndex + 1} of {STEPS.length} — {STEPS[stepIndex].label}</p>
          </div>
          <Button size="sm" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" onClick={() => router.push('/tickets')}>
            Cancel
          </Button>
        </div>
      </div>

      {/* ── Stepper ── */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => {
          const done = i < stepIndex;
          const active = i === stepIndex;
          return (
            <div key={s.key} className="flex items-center flex-1">
              <div
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors',
                  done   ? 'bg-blue-600 text-white'             : '',
                  active ? 'bg-blue-700 text-white ring-4 ring-blue-100' : '',
                  !done && !active ? 'bg-muted text-muted-foreground' : '',
                )}
              >
                {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={cn('ml-1.5 hidden text-xs font-medium sm:block', active ? 'text-blue-700' : done ? 'text-foreground' : 'text-muted-foreground')}>
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={cn('mx-2 h-px flex-1 transition-colors', done ? 'bg-blue-400' : 'bg-border')} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Step content ── */}
      <Card>
        <CardContent className="p-6">
          {/* STEP 1 — Requester */}
          {step === 'requester' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-semibold text-foreground">Who is this ticket for?</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">Search for an existing contact or enter details manually.</p>
              </div>
              {/* Contact search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search contacts by name or email…"
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                />
              </div>
              {contactSearch && (
                <div className="rounded-lg border border-border bg-background shadow-sm">
                  {contacts.isPending ? (
                    <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Searching…</div>
                  ) : filteredContacts.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground">No contacts found.</div>
                  ) : (
                    filteredContacts.slice(0, 6).map((c) => (
                      <button
                        key={c.id}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        onClick={() => selectContact(c.id, c.name, c.email)}
                      >
                        <Avatar className="h-7 w-7 shrink-0">
                          <AvatarFallback className="bg-blue-100 text-[10px] font-bold text-blue-700">{initials(c.name)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                        </div>
                        {c.company && <Badge variant="outline" className="ml-auto shrink-0 text-[10px]">{c.company}</Badge>}
                      </button>
                    ))
                  )}
                </div>
              )}
              {/* Manual fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="req-name">Full name <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="req-name"
                      className="pl-9"
                      placeholder="e.g. Emeka Okafor"
                      value={form.requesterName}
                      onChange={(e) => set({ requesterName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="req-email">Email address <span className="text-red-500">*</span></Label>
                  <Input
                    id="req-email"
                    type="email"
                    placeholder="e.g. emeka@company.com"
                    value={form.requesterEmail}
                    onChange={(e) => set({ requesterEmail: e.target.value })}
                  />
                </div>
              </div>
              {form.requesterName && (
                <div className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-blue-200 text-sm font-bold text-blue-700">{initials(form.requesterName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-blue-900">{form.requesterName}</p>
                    <p className="text-xs text-blue-600">{form.requesterEmail}</p>
                  </div>
                  {form.requesterId && <Badge variant="outline" className="ml-auto border-blue-200 bg-coral text-white text-[10px]">Existing contact</Badge>}
                </div>
              )}
            </div>
          )}

          {/* STEP 2 — Details */}
          {step === 'details' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-semibold text-foreground">Ticket details</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">Describe the issue clearly so it can be resolved quickly.</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject <span className="text-red-500">*</span></Label>
                <Input
                  id="subject"
                  placeholder="Brief description of the issue…"
                  value={form.subject}
                  onChange={(e) => set({ subject: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                <textarea
                  id="description"
                  rows={5}
                  className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                  placeholder="Provide full details — steps to reproduce, error messages, impact…"
                  value={form.description}
                  onChange={(e) => set({ description: e.target.value })}
                />
              </div>
              {/* Attachment placeholder */}
              <div className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:border-blue-300 hover:bg-blue-50/50 transition-colors">
                <Paperclip className="h-4 w-4" />
                <span>Attach files (screenshots, logs, etc.) — drag &amp; drop or click</span>
              </div>
              {/* Linked asset */}
              <div className="space-y-1.5">
                <Label>Linked asset <span className="text-xs text-muted-foreground font-normal">(optional)</span></Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Search assets by name or tag…"
                    value={form.assetName || assetSearch}
                    onChange={(e) => {
                      setAssetSearch(e.target.value);
                      if (form.assetId) set({ assetId: '', assetName: '' });
                    }}
                  />
                  {form.assetId && (
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => set({ assetId: '', assetName: '' })}>
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {assetSearch && !form.assetId && (
                  <div className="rounded-lg border border-border bg-background shadow-sm">
                    {filteredAssets.slice(0, 5).map((a) => (
                      <button
                        key={a.id}
                        className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-muted/50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        onClick={() => { selectAsset(a.id, `${a.name} (${a.tag})`); setAssetSearch(''); }}
                      >
                        <span className="text-sm font-medium text-foreground">{a.name}</span>
                        <span className="text-xs text-muted-foreground">{a.tag}</span>
                        <Badge variant="outline" className="ml-auto text-[10px]">{a.category}</Badge>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3 — Classify */}
          {step === 'classify' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-semibold text-foreground">Classify ticket</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">Set category, priority, and channel so routing and SLAs are applied correctly.</p>
              </div>
              {/* Category */}
              <div className="space-y-2">
                <Label>Category <span className="text-red-500">*</span></Label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => set({ category: cat })}
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                        form.category === cat
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-border bg-muted/30 text-foreground hover:border-blue-300 hover:bg-blue-50',
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              {/* Priority */}
              <div className="space-y-2">
                <Label>Priority</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => set({ priority: p.value })}
                      className={cn(
                        'rounded-lg border-2 px-3 py-2.5 text-left transition-all',
                        form.priority === p.value ? p.color + ' ring-2 ring-offset-1 ring-blue-400' : 'border-border bg-background hover:border-muted-foreground/30',
                      )}
                    >
                      <p className={cn('text-xs font-bold', form.priority === p.value ? '' : 'text-foreground')}>{p.label}</p>
                      <p className={cn('text-[10px] mt-0.5', form.priority === p.value ? 'opacity-80' : 'text-muted-foreground')}>{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              {/* Channel */}
              <div className="space-y-2">
                <Label>Channel</Label>
                <div className="flex flex-wrap gap-2">
                  {CHANNELS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => set({ channel: c.value })}
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs font-medium transition-colors capitalize',
                        form.channel === c.value
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-border bg-muted/30 text-foreground hover:border-blue-300 hover:bg-blue-50',
                      )}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags <span className="text-xs font-normal text-muted-foreground">(optional — press Enter or comma to add)</span></Label>
                <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 min-h-[38px]">
                  {form.tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                      <Tag className="h-2.5 w-2.5" />{t}
                      <button onClick={() => removeTag(t)} className="ml-0.5 text-blue-500 hover:text-blue-800"><X className="h-2.5 w-2.5" /></button>
                    </span>
                  ))}
                  <input
                    className="flex-1 min-w-[120px] bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    placeholder="Add tags…"
                    value={form.tagInput}
                    onChange={(e) => set({ tagInput: e.target.value })}
                    onKeyDown={addTag}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 — Review */}
          {step === 'review' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-semibold text-foreground">Review &amp; submit</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">Check all details before creating the ticket.</p>
              </div>
              <div className="divide-y divide-border/60 rounded-xl border border-border overflow-hidden">
                {[
                  { label: 'Requester', value: `${form.requesterName} (${form.requesterEmail})` },
                  { label: 'Subject',   value: form.subject },
                  { label: 'Category', value: form.category },
                  { label: 'Priority', value: form.priority.charAt(0).toUpperCase() + form.priority.slice(1) },
                  { label: 'Channel',  value: form.channel.charAt(0).toUpperCase() + form.channel.slice(1) },
                  ...(form.assetName ? [{ label: 'Linked asset', value: form.assetName }] : []),
                  ...(form.tags.length ? [{ label: 'Tags', value: form.tags.join(', ') }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start gap-4 bg-background px-4 py-3">
                    <span className="w-28 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
                    <span className="text-sm text-foreground">{value}</span>
                  </div>
                ))}
              </div>
              {/* Description preview */}
              <div className="rounded-xl border border-border bg-muted/20 px-4 py-3">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Description</p>
                <p className="text-sm text-foreground whitespace-pre-wrap">{form.description}</p>
              </div>
              {form.priority === 'urgent' && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Urgent tickets trigger immediate SLA timers and escalation rules upon creation.</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Navigation ── */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={back} disabled={stepIndex === 0}>
          <ChevronLeft className="mr-1.5 h-4 w-4" /> Back
        </Button>
        {step !== 'review' ? (
          <Button
            className="bg-blue-700 text-white hover:bg-blue-800"
            disabled={!canAdvance()}
            onClick={advance}
          >
            Continue <ChevronRight className="ml-1.5 h-4 w-4" />
          </Button>
        ) : (
          <Button
            className="bg-blue-700 text-white hover:bg-blue-800 min-w-[140px]"
            disabled={submitting}
            onClick={submit}
          >
            {submitting ? (
              <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Creating…</>
            ) : (
              <><Plus className="mr-1.5 h-4 w-4" /> Create ticket</>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
