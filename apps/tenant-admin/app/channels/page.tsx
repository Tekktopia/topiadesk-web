'use client';
/* fixed-jsx-structure */
/* end-fix-applied */

import { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCopy,
  Info,
  Loader2,
  Mail,
  Pause,
  Play,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
  cn,
} from '@topiadesk/ui';
import { adminEmailInboxes } from '@/lib/mock-data';
import type { EmailInbox } from '@/lib/mock-data';

// ─── Constants ────────────────────────────────────────────────────────────────

const PRIORITY_OPTIONS: Array<EmailInbox['defaultPriority']> = [
  'low',
  'medium',
  'high',
  'urgent',
];

const STATUS_META: Record<
  EmailInbox['status'],
  { label: string; pill: string }
> = {
  active:  { label: 'Active',         pill: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  pending: { label: 'Pending setup',  pill: 'bg-amber-100  text-amber-700  border-amber-200'  },
  paused:  { label: 'Paused',         pill: 'bg-muted      text-muted-foreground border-border' },
};

const PRIORITY_META: Record<
  EmailInbox['defaultPriority'],
  { label: string; pill: string }
> = {
  low:    { label: 'Low',    pill: 'bg-slate-100  text-slate-600  border-slate-200'  },
  medium: { label: 'Medium', pill: 'bg-blue-100   text-blue-700   border-blue-200'   },
  high:   { label: 'High',   pill: 'bg-orange-100 text-orange-700 border-orange-200' },
  urgent: { label: 'Urgent', pill: 'bg-red-100    text-red-700    border-red-200'    },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy to clipboard"
      className="shrink-0 rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {copied ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
      ) : (
        <ClipboardCopy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChannelsPage() {
  const [inboxes, setInboxes]       = useState<EmailInbox[]>(adminEmailInboxes);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedId, setExpandedId]   = useState<string | null>(null);

  // ── Add-inbox form state ─────────────────────────────────────────────────────
  const [newName,     setNewName]     = useState('');
  const [newEmail,    setNewEmail]    = useState('');
  const [newPriority, setNewPriority] = useState<EmailInbox['defaultPriority']>('medium');
  const [newTeam,     setNewTeam]     = useState('');
  const [newAutoReply, setNewAutoReply] = useState(false);
  const [adding,      setAdding]      = useState(false);

  const canAdd =
    newName.trim().length >= 2 &&
    newEmail.trim().includes('@') &&
    newEmail.trim().includes('.');

  function handleAdd() {
    if (!canAdd || adding) return;
    setAdding(true);
    window.setTimeout(() => {
      const rand = Math.random().toString(36).slice(2, 8);
      const created: EmailInbox = {
        id:                `inbox-${Date.now()}`,
        name:              newName.trim(),
        email:             newEmail.trim().toLowerCase(),
        forwardingAddress: `consomoafrica-${rand}@in.topiadesk.com`,
        status:            'pending',
        defaultPriority:   newPriority,
        defaultTeam:       newTeam.trim() || null,
        autoReply:         newAutoReply,
        autoReplyMessage:  newAutoReply
          ? "Thanks for reaching out! We've received your message and will reply shortly."
          : '',
        ticketCount:    0,
        lastReceivedAt: null,
        createdAt:      'just now',
      };
      setInboxes((prev) => [created, ...prev]);
      setExpandedId(created.id);
      // Reset form
      setNewName('');
      setNewEmail('');
      setNewPriority('medium');
      setNewTeam('');
      setNewAutoReply(false);
      setShowAddForm(false);
      setAdding(false);
    }, 800);
  }

  function toggleStatus(id: string) {
    setInboxes((prev) =>
      prev.map((inbox) =>
        inbox.id === id
          ? {
              ...inbox,
              status: inbox.status === 'active' ? 'paused' : 'active',
            }
          : inbox,
      ),
    );
  }

  function removeInbox(id: string) {
    setInboxes((prev) => prev.filter((inbox) => inbox.id !== id));
    if (expandedId === id) setExpandedId(null);
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
      {/* Orange gradient header */}
      <div className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Connect</p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">Email channels</h1>
            <p className="mt-0.5 text-sm text-white/70">
              Add email addresses that automatically create tickets when customers write in.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
              <Link href="/channels/new">
                <Plus className="h-3.5 w-3.5" />
                Other channel
              </Link>
            </Button>
            <Button
              size="sm"
              variant={showAddForm ? 'outline' : 'default'}
              className={showAddForm
                ? 'border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white'
                : 'bg-coral text-white hover:bg-white/90'}
              onClick={() => setShowAddForm((v) => !v)}
            >
              {showAddForm ? (
                <>
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  Add inbox
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      </div>

      <div className="flex-1 min-h-0 space-y-5 overflow-y-auto p-5 pt-5">

      <div className="mx-auto max-w-4xl px-5 pb-5 lg:px-6 lg:pb-6 space-y-6">

      {/* ── How it works banner ── */}
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50/60 p-4">
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-800">
          <Info className="h-3.5 w-3.5" />
          How email-to-ticket works
        </p>
        <ol className="space-y-2">
          {[
            {
              n: '1',
              text: 'Add an email address your customers already know, e.g. support@yourcompany.com.',
            },
            {
              n: '2',
              text: 'Copy the Topiadesk forwarding address and create a forwarding rule in your email provider (Gmail, Outlook, Zoho, cPanel, etc.).',
            },
            {
              n: '3',
              text: 'Every email sent to that address is forwarded to Topiadesk, which creates a ticket, assigns it to your team, and can send an automatic acknowledgement to the customer.',
            },
          ].map(({ n, text }) => (
            <li key={n} className="flex items-start gap-2.5 text-sm text-blue-900">
              <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 text-[11px] font-bold text-blue-900">
                {n}
              </span>
              {text}
            </li>
          ))}
        </ol>
      </div>

      {/* ── Add-inbox form ── */}
      {showAddForm && (
        <Card className="mb-5 border-dashed border-primary/40 bg-primary/5">
          <CardContent className="p-5">
            <p className="mb-4 text-sm font-semibold">New email inbox</p>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Display name */}
              <div className="space-y-2">
                <Label htmlFor="newName">Display name</Label>
                <Input
                  id="newName"
                  placeholder="e.g. General Support"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  Shown to agents when they view the ticket.
                </p>
              </div>

              {/* Email address */}
              <div className="space-y-2">
                <Label htmlFor="newEmail">Email address</Label>
                <Input
                  id="newEmail"
                  type="email"
                  placeholder="support@yourcompany.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  The address your customers will write to.
                </p>
              </div>

              {/* Default priority */}
              <div className="space-y-2">
                <Label htmlFor="newPriority">Default ticket priority</Label>
                <select
                  id="newPriority"
                  value={newPriority}
                  onChange={(e) =>
                    setNewPriority(e.target.value as EmailInbox['defaultPriority'])
                  }
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {PRIORITY_META[p].label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Team */}
              <div className="space-y-2">
                <Label htmlFor="newTeam">
                  Assign to team{' '}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="newTeam"
                  placeholder="e.g. Support, Engineering"
                  value={newTeam}
                  onChange={(e) => setNewTeam(e.target.value)}
                />
              </div>
            </div>

            {/* Auto-reply toggle */}
            <div className="mt-4 flex items-start gap-3 rounded-md border bg-background p-3">
              <input
                type="checkbox"
                id="newAutoReply"
                checked={newAutoReply}
                onChange={(e) => setNewAutoReply(e.target.checked)}
                className="mt-0.5 h-4 w-4 cursor-pointer rounded border accent-primary"
              />
              <div>
                <label
                  htmlFor="newAutoReply"
                  className="cursor-pointer text-sm font-medium"
                >
                  Send automatic acknowledgement
                </label>
                <p className="text-[11px] text-muted-foreground">
                  When enabled, customers receive a confirmation email when their
                  ticket is created, including the ticket reference number.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                size="sm"
                disabled={!canAdd || adding}
                onClick={handleAdd}
              >
                {adding ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Adding…
                  </>
                ) : (
                  'Add inbox'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Inbox list ── */}
      {inboxes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-muted">
            <Mail className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">No email inboxes configured</p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Add your first inbox to start receiving tickets by email.
          </p>
          <Button
            size="sm"
            className="mt-4"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            Add inbox
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {inboxes.length} inbox{inboxes.length !== 1 ? 'es' : ''} configured
          </p>

          {inboxes.map((inbox) => {
            const isExpanded = expandedId === inbox.id;
            const sm = STATUS_META[inbox.status];
            const pm = PRIORITY_META[inbox.defaultPriority];

            return (
              <Card
                key={inbox.id}
                className={cn(
                  'overflow-hidden transition-shadow',
                  isExpanded && 'ring-2 ring-primary/20',
                )}
              >
                <CardContent className="p-0">
                  {/* ── Collapsed row (always visible) ── */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : inbox.id)
                    }
                    className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/30"
                  >
                    {/* Icon */}
                    <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-100 text-blue-600">
                      <Mail className="h-4 w-4" />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">{inbox.name}</span>
                        <span
                          className={cn(
                            'rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                            sm.pill,
                          )}
                        >
                          {sm.label}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {inbox.email}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-muted-foreground">
                        <span>{inbox.ticketCount.toLocaleString()} tickets received</span>
                        {inbox.lastReceivedAt ? (
                          <span>Last: {inbox.lastReceivedAt}</span>
                        ) : (
                          <span>No emails received yet</span>
                        )}
                        <span>Added {inbox.createdAt}</span>
                      </div>
                    </div>

                    {/* Chevron */}
                    <span className="mt-1 shrink-0 text-muted-foreground">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </span>
                  </button>

                  {/* ── Expanded detail panel ── */}
                  {isExpanded && (
                    <div className="border-t px-5 pb-5 pt-4">

                      {/* Forwarding address */}
                      <div className="mb-5 rounded-lg border bg-muted/30 p-4">
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          Topiadesk forwarding address
                        </p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 truncate rounded-md border bg-background px-3 py-2 font-mono text-xs">
                            {inbox.forwardingAddress}
                          </code>
                          <CopyButton text={inbox.forwardingAddress} />
                        </div>
                        <p className="mt-2 text-[11px] text-muted-foreground">
                          In your email provider, create a rule to forward all
                          mail from{' '}
                          <span className="font-medium text-foreground">
                            {inbox.email}
                          </span>{' '}
                          to this address. Each forwarded email will become a new
                          ticket.
                        </p>
                      </div>

                      {/* Settings summary */}
                      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Default priority
                          </p>
                          <span
                            className={cn(
                              'mt-1.5 inline-block rounded-full border px-2 py-0.5 text-xs font-semibold',
                              pm.pill,
                            )}
                          >
                            {pm.label}
                          </span>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Assigned team
                          </p>
                          <p className="mt-1.5 text-sm">
                            {inbox.defaultTeam ?? (
                              <span className="text-muted-foreground">
                                Unassigned
                              </span>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Auto-reply
                          </p>
                          <p className="mt-1.5 text-sm">
                            {inbox.autoReply ? (
                              <span className="text-emerald-600">Enabled</span>
                            ) : (
                              <span className="text-muted-foreground">Disabled</span>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Status
                          </p>
                          <p className="mt-1.5 text-sm">{sm.label}</p>
                        </div>
                      </div>

                      {/* Pending instructions */}
                      {inbox.status === 'pending' && (
                        <div className="mb-4 flex items-start gap-2.5 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                          <Info className="mt-0.5 h-4 w-4 shrink-0" />
                          <div>
                            <span className="font-medium">Setup required — </span>
                            copy the forwarding address above and configure it in your
                            email provider. Topiadesk will activate this inbox once the
                            first forwarded email arrives.
                          </div>
                        </div>
                      )}

                      {/* Action row */}
                      <div className="flex flex-wrap items-center gap-2 border-t pt-4">
                        {/* Pause / Resume */}
                        {inbox.status !== 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleStatus(inbox.id)}
                          >
                            {inbox.status === 'active' ? (
                              <>
                                <Pause className="h-3.5 w-3.5" />
                                Pause inbox
                              </>
                            ) : (
                              <>
                                <Play className="h-3.5 w-3.5" />
                                Resume inbox
                              </>
                            )}
                          </Button>
                        )}

                        {/* Remove */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:border-destructive/40 hover:bg-destructive/10"
                          onClick={() => removeInbox(inbox.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove inbox
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      </div>

      </div>
    </div>
  );
}
