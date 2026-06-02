'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ChevronRight,
  CreditCard,
  Edit3,
  Eye,
  FileText,
  Inbox,
  KeyRound,
  Lock,
  Mail,
  Plus,
  Receipt,
  Search,
  Send,
  Shield,
  Sparkles,
  Trash2,
  UserPlus,
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
  Switch,
  cn,
} from '@topiadesk/ui';

type Category = 'auth' | 'billing' | 'product' | 'tenant' | 'support';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: Category;
  icon: typeof Mail;
  iconColor: string;
  iconBg: string;
  description: string;
  enabled: boolean;
  lastEditedBy: string;
  lastEditedAt: string;
  sentLast30d: number;
  openRate?: number;
  variables: string[];
}

const TEMPLATES: EmailTemplate[] = [
  // Auth
  {
    id: 'welcome',  name: 'Welcome email',
    subject: 'Welcome to Topiadesk, {{firstName}} 👋',
    category: 'auth', icon: Sparkles, iconColor: 'text-coral', iconBg: 'bg-coral/10',
    description: 'Sent when a new tenant signs up. Includes quickstart links and CSM intro.',
    enabled: true, lastEditedBy: 'Daniel Oshinubi', lastEditedAt: '2026-04-12',
    sentLast30d: 142, openRate: 78.4,
    variables: ['firstName', 'tenantName', 'subdomain', 'csmName', 'csmEmail'],
  },
  {
    id: 'password-reset', name: 'Password reset',
    subject: 'Reset your Topiadesk password',
    category: 'auth', icon: KeyRound, iconColor: 'text-amber-600', iconBg: 'bg-amber-50',
    description: 'Sent when a user requests a password reset link. Link expires in 1 hour.',
    enabled: true, lastEditedBy: 'Amara Diallo', lastEditedAt: '2026-02-21',
    sentLast30d: 312, openRate: 92.1,
    variables: ['firstName', 'resetLink', 'expiryTime', 'ipAddress'],
  },
  {
    id: 'mfa-setup', name: 'MFA setup required',
    subject: 'Action required: set up two-factor authentication',
    category: 'auth', icon: Shield, iconColor: 'text-blue-600', iconBg: 'bg-blue-50',
    description: 'Sent to admins who haven\'t enabled MFA within 24h of first login.',
    enabled: true, lastEditedBy: 'Daniel Oshinubi', lastEditedAt: '2026-03-08',
    sentLast30d: 24, openRate: 88.0,
    variables: ['firstName', 'mfaSetupLink'],
  },
  {
    id: 'admin-invite', name: 'Admin account created',
    subject: 'Your Topiadesk admin account is ready',
    category: 'auth', icon: UserPlus, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50',
    description: 'Notifies a newly-created admin with login link (password sent separately).',
    enabled: true, lastEditedBy: 'Daniel Oshinubi', lastEditedAt: '2026-05-18',
    sentLast30d: 4, openRate: 100,
    variables: ['firstName', 'email', 'role', 'loginUrl', 'invitedBy'],
  },

  // Billing
  {
    id: 'invoice', name: 'Monthly invoice',
    subject: 'Your Topiadesk invoice for {{month}}',
    category: 'billing', icon: Receipt, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50',
    description: 'Auto-sent on billing date with PDF invoice attached.',
    enabled: true, lastEditedBy: 'Amara Diallo', lastEditedAt: '2026-01-30',
    sentLast30d: 118, openRate: 81.4,
    variables: ['tenantName', 'amount', 'invoiceNumber', 'dueDate', 'pdfLink'],
  },
  {
    id: 'payment-failed', name: 'Payment failed',
    subject: 'Your Topiadesk payment couldn\'t be processed',
    category: 'billing', icon: AlertCircle, iconColor: 'text-red-600', iconBg: 'bg-red-50',
    description: 'Sent when a Stripe charge fails. Includes retry link and dunning schedule.',
    enabled: true, lastEditedBy: 'Daniel Oshinubi', lastEditedAt: '2026-03-15',
    sentLast30d: 7, openRate: 95.3,
    variables: ['firstName', 'amount', 'retryDate', 'updatePaymentLink'],
  },
  {
    id: 'trial-ending', name: 'Trial ending in 3 days',
    subject: '{{daysLeft}} days left in your trial',
    category: 'billing', icon: CreditCard, iconColor: 'text-amber-600', iconBg: 'bg-amber-50',
    description: 'Sent on day 11 of a 14-day trial. Includes upgrade CTAs and CSM contact.',
    enabled: true, lastEditedBy: 'Amara Diallo', lastEditedAt: '2026-04-02',
    sentLast30d: 24, openRate: 67.8,
    variables: ['firstName', 'daysLeft', 'upgradeLink', 'csmName'],
  },
  {
    id: 'subscription-canceled', name: 'Subscription cancelled',
    subject: 'Sorry to see you go, {{firstName}}',
    category: 'billing', icon: AlertCircle, iconColor: 'text-slate-600', iconBg: 'bg-slate-100',
    description: 'Confirmation email when a tenant cancels. Includes data export link.',
    enabled: true, lastEditedBy: 'Daniel Oshinubi', lastEditedAt: '2026-02-08',
    sentLast30d: 5, openRate: 88.0,
    variables: ['firstName', 'tenantName', 'effectiveDate', 'dataExportLink'],
  },

  // Product / Announcements
  {
    id: 'new-feature', name: 'Product announcement',
    subject: 'New in Topiadesk: {{featureName}}',
    category: 'product', icon: Sparkles, iconColor: 'text-violet-600', iconBg: 'bg-violet-50',
    description: 'Monthly product announcement — opt-in. Generated from /announcements module.',
    enabled: true, lastEditedBy: 'Daniel Oshinubi', lastEditedAt: '2026-05-22',
    sentLast30d: 118, openRate: 42.3,
    variables: ['firstName', 'featureName', 'description', 'learnMoreLink'],
  },
  {
    id: 'maintenance', name: 'Scheduled maintenance',
    subject: 'Planned maintenance: {{startTime}}',
    category: 'product', icon: AlertCircle, iconColor: 'text-amber-600', iconBg: 'bg-amber-50',
    description: 'Notifies all tenants of upcoming maintenance windows (sent 48h in advance).',
    enabled: true, lastEditedBy: 'Amara Diallo', lastEditedAt: '2025-12-14',
    sentLast30d: 0, openRate: 0,
    variables: ['startTime', 'duration', 'affectedServices'],
  },

  // Tenant lifecycle
  {
    id: 'tenant-suspended', name: 'Tenant suspended',
    subject: 'Your Topiadesk workspace has been suspended',
    category: 'tenant', icon: Lock, iconColor: 'text-red-600', iconBg: 'bg-red-50',
    description: 'Sent when a tenant is suspended (manual or auto via payment failure).',
    enabled: true, lastEditedBy: 'Daniel Oshinubi', lastEditedAt: '2026-01-18',
    sentLast30d: 2, openRate: 100,
    variables: ['tenantName', 'reason', 'contactEmail'],
  },
  {
    id: 'tenant-reactivated', name: 'Tenant reactivated',
    subject: 'Welcome back — your workspace is active again',
    category: 'tenant', icon: Sparkles, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50',
    description: 'Confirmation email when a suspended tenant is reactivated.',
    enabled: true, lastEditedBy: 'Daniel Oshinubi', lastEditedAt: '2026-01-18',
    sentLast30d: 1, openRate: 100,
    variables: ['tenantName', 'loginUrl'],
  },

  // Support
  {
    id: 'csr-reply', name: 'CSR reply received',
    subject: 'Re: {{ticketSubject}}',
    category: 'support', icon: Inbox, iconColor: 'text-blue-600', iconBg: 'bg-blue-50',
    description: 'Auto-sent when a CSR replies to a tenant support ticket.',
    enabled: true, lastEditedBy: 'Tunde Bakare', lastEditedAt: '2026-04-30',
    sentLast30d: 412, openRate: 89.7,
    variables: ['firstName', 'ticketSubject', 'replyBody', 'csrName', 'ticketLink'],
  },
  {
    id: 'csr-resolved', name: 'Ticket resolved',
    subject: 'Your support ticket has been resolved',
    category: 'support', icon: Mail, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50',
    description: 'Confirmation + CSAT survey link when a CSR marks a ticket resolved.',
    enabled: true, lastEditedBy: 'Daniel Oshinubi', lastEditedAt: '2026-03-22',
    sentLast30d: 198, openRate: 76.4,
    variables: ['firstName', 'ticketNumber', 'csatLink'],
  },
];

const CATEGORY_META: Record<Category, { label: string; color: string }> = {
  auth:    { label: 'Authentication', color: 'text-blue-700'    },
  billing: { label: 'Billing',        color: 'text-emerald-700' },
  product: { label: 'Product',        color: 'text-violet-700'  },
  tenant:  { label: 'Tenant lifecycle', color: 'text-amber-700' },
  support: { label: 'Support',        color: 'text-coral-dark'  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtNum(n: number) {
  return new Intl.NumberFormat('en-US').format(n);
}

export default function EmailTemplatesPage() {
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState<'all' | Category>('all');
  const [enabled,  setEnabled]  = useState<Record<string, boolean>>(
    Object.fromEntries(TEMPLATES.map((t) => [t.id, t.enabled])),
  );
  const [selectedId, setSelectedId] = useState<string | null>(TEMPLATES[0]?.id ?? null);

  const filtered = TEMPLATES.filter((t) => {
    if (category !== 'all' && t.category !== category) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.subject.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selected = TEMPLATES.find((t) => t.id === selectedId);

  const counts = {
    all:     TEMPLATES.length,
    enabled: TEMPLATES.filter((t) => enabled[t.id]).length,
    sent30d: TEMPLATES.reduce((s, t) => s + t.sentLast30d, 0),
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
      {/* Hero */}
      <div className="shrink-0 p-5 pb-0">
        <header className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Super Admin</p>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">Email Templates</h1>
              <p className="mt-0.5 text-sm text-white/70">
                {counts.enabled} active · {fmtNum(counts.sent30d)} sent in last 30 days · {counts.all} templates
              </p>
            </div>
            <Button asChild size="sm" className="bg-coral text-white hover:bg-coral-dark">
              <Link href="/email-templates/new"><Plus className="h-3 w-3" />New template</Link>
            </Button>
          </div>
        </header>
      </div>

      {/* Body — 2 column: list + preview */}
      <div className="flex-1 min-h-0 grid gap-5 overflow-hidden p-5 pt-5 lg:grid-cols-[420px_1fr]">
        {/* ── Template list (pinned filter + scroll body) ── */}
        <div className="flex min-h-0 flex-col rounded-xl border border-border/70 bg-card overflow-hidden">
          {/* Filter strip */}
          <div className="shrink-0 border-b border-border/60 p-3 space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates…" className="h-8 pl-8 text-xs" />
            </div>
            <div className="flex flex-wrap gap-1 text-[10px]">
              <button onClick={() => setCategory('all')}
                className={cn('rounded-full px-2 py-0.5 font-medium transition-colors',
                  category === 'all' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/70')}>
                All ({counts.all})
              </button>
              {(Object.keys(CATEGORY_META) as Category[]).map((c) => (
                <button key={c} onClick={() => setCategory(c)}
                  className={cn('rounded-full px-2 py-0.5 font-medium transition-colors',
                    category === c ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/70')}>
                  {CATEGORY_META[c].label}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <ul className="divide-y">
              {filtered.map((t) => {
                const Icon = t.icon;
                const isSelected = selectedId === t.id;
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(t.id)}
                      className={cn(
                        'flex w-full items-start gap-2.5 px-3 py-3 text-left transition-colors',
                        isSelected ? 'bg-coral/5 border-l-2 border-coral' : 'hover:bg-muted/40 border-l-2 border-transparent',
                      )}
                    >
                      <span className={cn('mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md', t.iconBg)}>
                        <Icon className={cn('h-3.5 w-3.5', t.iconColor)} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-xs font-semibold">{t.name}</p>
                          {!enabled[t.id] && <Badge variant="secondary" className="text-[8px]">Off</Badge>}
                        </div>
                        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{t.subject}</p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {CATEGORY_META[t.category].label} · {t.sentLast30d} sent
                        </p>
                      </div>
                      <ChevronRight className="mt-1 h-3 w-3 shrink-0 text-muted-foreground/60" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* ── Preview pane ── */}
        {selected ? (
          <div className="flex min-h-0 flex-col rounded-xl border border-border/70 bg-card overflow-hidden">
            {/* Header */}
            <div className="shrink-0 border-b border-border/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={cn('grid h-6 w-6 place-items-center rounded-md', selected.iconBg)}>
                      <selected.icon className={cn('h-3.5 w-3.5', selected.iconColor)} />
                    </span>
                    <h2 className="font-semibold">{selected.name}</h2>
                    <Badge variant="secondary" className={cn('text-[10px]', CATEGORY_META[selected.category].color)}>
                      {CATEGORY_META[selected.category].label}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{selected.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-muted-foreground">{enabled[selected.id] ? 'Enabled' : 'Disabled'}</span>
                    <Switch
                      checked={enabled[selected.id]}
                      onCheckedChange={(v) => setEnabled((p) => ({ ...p, [selected.id]: v }))}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div className="rounded-lg border bg-muted/30 px-3 py-1.5">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Sent (30d)</p>
                  <p className="text-sm font-bold tabular-nums">{fmtNum(selected.sentLast30d)}</p>
                </div>
                <div className="rounded-lg border bg-muted/30 px-3 py-1.5">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Open rate</p>
                  <p className="text-sm font-bold tabular-nums text-emerald-600">{selected.openRate?.toFixed(1) ?? '—'}%</p>
                </div>
                <div className="rounded-lg border bg-muted/30 px-3 py-1.5">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Edited</p>
                  <p className="text-sm font-bold">{formatDate(selected.lastEditedAt)}</p>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="flex-1 min-h-0 overflow-y-auto p-5">
              {/* Email shell */}
              <div className="mx-auto max-w-2xl rounded-xl border bg-white shadow-sm">
                {/* From / To */}
                <div className="border-b px-5 py-3 text-xs">
                  <p><span className="text-muted-foreground">From:</span> <span className="font-medium">Topiadesk &lt;hello@topiadesk.com&gt;</span></p>
                  <p><span className="text-muted-foreground">To:</span> <span className="font-medium">{'{{userEmail}}'}</span></p>
                  <p><span className="text-muted-foreground">Subject:</span> <span className="font-semibold">{selected.subject}</span></p>
                </div>
                {/* Body */}
                <div className="space-y-4 px-5 py-6 text-sm">
                  <p className="text-base font-semibold">Hi {'{{firstName}}'},</p>
                  {selected.id === 'welcome' && (
                    <>
                      <p>Thanks for choosing Topiadesk! Your workspace at <span className="font-mono text-coral">{'{{subdomain}}'}.topiadesk.com</span> is ready.</p>
                      <p>Here&apos;s what to do next:</p>
                      <ul className="ml-4 list-disc space-y-1.5 text-sm">
                        <li>Invite your agents</li>
                        <li>Connect your first channel (email or WhatsApp)</li>
                        <li>Customise your branding</li>
                      </ul>
                      <div className="rounded-lg bg-coral px-4 py-2 text-center text-sm font-semibold text-white">
                        Open my workspace →
                      </div>
                    </>
                  )}
                  {selected.id !== 'welcome' && (
                    <p className="text-muted-foreground italic">[Email body content — edit this template to customize the message]</p>
                  )}
                  <p>— Your Topiadesk team</p>
                </div>
                {/* Footer */}
                <div className="border-t bg-muted/30 px-5 py-3 text-center text-[10px] text-muted-foreground">
                  Topiadesk · Lagos · Nigeria · <a href="#" className="text-coral">Unsubscribe</a>
                </div>
              </div>

              {/* Variables */}
              <div className="mx-auto mt-5 max-w-2xl">
                <p className="mb-2 text-xs font-semibold text-foreground">Available variables</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.variables.map((v) => (
                    <code key={v} className="rounded-md border bg-muted/50 px-2 py-0.5 font-mono text-[10px]">
                      {`{{${v}}}`}
                    </code>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="shrink-0 flex items-center justify-between border-t border-border/60 bg-muted/20 px-4 py-2.5">
              <p className="text-[11px] text-muted-foreground">
                Last edited by <span className="font-semibold">{selected.lastEditedBy}</span> · {formatDate(selected.lastEditedAt)}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  <Send className="h-3 w-3" />Send test
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  <Eye className="h-3 w-3" />Preview
                </Button>
                <Button size="sm" className="h-7 bg-coral text-white hover:bg-coral-dark text-xs">
                  <Edit3 className="h-3 w-3" />Edit template
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden items-center justify-center rounded-xl border border-border/70 bg-card text-sm text-muted-foreground lg:flex">
            Select a template to preview
          </div>
        )}
      </div>
    </div>
  );
}
