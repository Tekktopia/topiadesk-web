'use client';

import { useState } from 'react';
import {
  Bug, Edit3, Eye, MoreHorizontal, Plus, Rocket, Shield, Sparkles, Wrench, Zap,
} from 'lucide-react';
import {
  Badge, Button,
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  cn,
} from '@topiadesk/ui';

type ReleaseType = 'major' | 'minor' | 'patch';
type ChangeType = 'feature' | 'improvement' | 'fix' | 'security' | 'performance';
type Status = 'published' | 'draft' | 'scheduled';

interface Change { type: ChangeType; text: string; }
interface Release {
  id: string; version: string; title: string; type: ReleaseType;
  status: Status; publishedAt: string; author: string;
  changes: Change[]; views: number;
}

const RELEASES: Release[] = [
  {
    id: 'r-2026-05-1', version: '4.8.0', title: 'AI-assisted reply drafting', type: 'minor',
    status: 'published', publishedAt: '2026-05-26', author: 'Daniel O.', views: 2_104,
    changes: [
      { type: 'feature', text: 'AI suggests reply drafts based on ticket context and tenant tone-of-voice settings' },
      { type: 'feature', text: 'New `/api/v1/ai/suggest` endpoint for programmatic access' },
      { type: 'improvement', text: 'Faster ticket list rendering (40% improvement on 10k+ ticket queues)' },
      { type: 'fix', text: 'Fixed CSV export missing UTF-8 BOM for Excel compatibility' },
    ],
  },
  {
    id: 'r-2026-05-2', version: '4.7.3', title: 'Security & stability patch', type: 'patch',
    status: 'published', publishedAt: '2026-05-19', author: 'Tunde B.', views: 891,
    changes: [
      { type: 'security', text: 'Patched XSS vulnerability in ticket comment rendering (CVE-2026-1142)' },
      { type: 'security', text: 'Enforced SAML response signature validation for all SSO providers' },
      { type: 'fix', text: 'Resolved race condition in webhook retry queue' },
    ],
  },
  {
    id: 'r-2026-05-3', version: '4.7.2', title: 'WhatsApp media improvements', type: 'patch',
    status: 'published', publishedAt: '2026-05-08', author: 'Amara D.', views: 1_241,
    changes: [
      { type: 'improvement', text: 'WhatsApp media attachments up to 100MB (previously 16MB)' },
      { type: 'fix', text: 'Fixed voice note transcription failing for messages > 30 seconds' },
      { type: 'performance', text: 'Reduced WhatsApp webhook processing latency by 60%' },
    ],
  },
  {
    id: 'r-2026-04-1', version: '4.7.0', title: 'Advanced SLA policies', type: 'minor',
    status: 'published', publishedAt: '2026-04-28', author: 'Daniel O.', views: 3_421,
    changes: [
      { type: 'feature', text: 'Multi-tier SLA policies with business-hour calendars per tenant' },
      { type: 'feature', text: 'SLA breach notifications via Slack and Microsoft Teams' },
      { type: 'improvement', text: 'Redesigned SLA dashboard with cohort breakdown' },
      { type: 'fix', text: 'Fixed timezone drift in scheduled SLA reports' },
    ],
  },
  {
    id: 'r-2026-04-2', version: '4.6.1', title: 'Compliance updates', type: 'patch',
    status: 'published', publishedAt: '2026-04-12', author: 'Tunde B.', views: 612,
    changes: [
      { type: 'feature', text: 'NDPR (Nigeria Data Protection Regulation) audit report generator' },
      { type: 'improvement', text: 'Expanded data residency options: added Lagos and Cape Town regions' },
      { type: 'security', text: 'Hardened TLS configuration (now A+ on SSLLabs)' },
    ],
  },
  {
    id: 'r-2026-03-1', version: '4.6.0', title: 'Agent workspace redesign', type: 'minor',
    status: 'published', publishedAt: '2026-03-22', author: 'Daniel O.', views: 5_812,
    changes: [
      { type: 'feature', text: 'Brand-new agent workspace with command palette (Cmd+K)' },
      { type: 'feature', text: 'Inline asset preview on tickets — no more tab switching' },
      { type: 'improvement', text: 'Dark mode for the agent workspace' },
      { type: 'performance', text: 'Initial load time down to under 800ms (p95)' },
    ],
  },
  {
    id: 'r-2026-06-1', version: '4.9.0', title: 'Voice channel (BETA)', type: 'major',
    status: 'scheduled', publishedAt: '2026-06-15', author: 'Daniel O.', views: 0,
    changes: [
      { type: 'feature', text: 'Voice channel powered by Twilio Programmable Voice' },
      { type: 'feature', text: 'Real-time call transcription and sentiment analysis' },
      { type: 'feature', text: 'Voicemail-to-ticket automation' },
    ],
  },
  {
    id: 'r-2026-06-d', version: '4.8.1', title: 'May hotfix bundle', type: 'patch',
    status: 'draft', publishedAt: '2026-05-30', author: 'Tunde B.', views: 0,
    changes: [
      { type: 'fix', text: 'Fixed asset checkout button not appearing for archived assets' },
      { type: 'fix', text: 'Resolved CSV import truncating long custom field values' },
    ],
  },
];

const CHANGE_ICON: Record<ChangeType, { icon: typeof Sparkles; color: string; label: string }> = {
  feature:     { icon: Sparkles, color: 'text-violet-600',  label: 'New' },
  improvement: { icon: Zap,      color: 'text-blue-600',    label: 'Improved' },
  fix:         { icon: Bug,      color: 'text-emerald-600', label: 'Fixed' },
  security:    { icon: Shield,   color: 'text-red-600',     label: 'Security' },
  performance: { icon: Wrench,   color: 'text-amber-600',   label: 'Perf' },
};

export default function ChangelogPage() {
  const [filter, setFilter] = useState<'all' | Status>('all');
  const visible = RELEASES.filter((r) => filter === 'all' || r.status === filter)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const counts = {
    published: RELEASES.filter((r) => r.status === 'published').length,
    scheduled: RELEASES.filter((r) => r.status === 'scheduled').length,
    draft:     RELEASES.filter((r) => r.status === 'draft').length,
    totalViews: RELEASES.reduce((s, r) => s + r.views, 0),
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
        <header className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Super Admin</p>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">Changelog & Releases</h1>
              <p className="mt-0.5 text-sm text-white/70">
                {counts.published} published · {counts.scheduled} scheduled · {counts.draft} drafts · {counts.totalViews.toLocaleString()} reads
              </p>
            </div>
            <Button size="sm" className="bg-coral text-white hover:bg-coral-dark">
              <Plus className="h-3 w-3" />New release
            </Button>
          </div>
        </header>
      </div>

      <div className="shrink-0 px-5 pt-5">
        <div className="rounded-xl border border-border/70 bg-card px-4 py-2.5">
          <div className="flex items-center gap-1 text-xs">
            {(['all', 'published', 'scheduled', 'draft'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn('rounded-md px-3 py-1 font-medium capitalize transition-colors',
                  filter === f ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground')}>
                {f}{f !== 'all' && ` (${counts[f as keyof typeof counts]})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5 pt-5">
        <div className="relative space-y-5">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
          {visible.map((r) => (
            <div key={r.id} className="relative pl-7">
              <div className={cn('absolute left-0 top-3 h-3.5 w-3.5 rounded-full border-2 border-card',
                r.status === 'published' ? 'bg-emerald-500' : r.status === 'scheduled' ? 'bg-blue-500' : 'bg-muted-foreground/40')} />
              <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                      r.type === 'major' ? 'bg-violet-100 text-violet-700' :
                      r.type === 'minor' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700')}>
                      <Rocket className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-base font-bold">v{r.version}</h3>
                        <Badge variant="secondary" className="text-[10px] capitalize">{r.type}</Badge>
                        <Badge variant={r.status === 'published' ? 'success' : r.status === 'scheduled' ? 'default' : 'warning'} className="text-[10px] capitalize">{r.status}</Badge>
                      </div>
                      <p className="mt-0.5 text-sm font-semibold text-foreground/90">{r.title}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {r.status === 'scheduled' ? 'Scheduled for' : r.status === 'draft' ? 'Drafted' : 'Published'} {r.publishedAt} · by {r.author}
                        {r.views > 0 && ` · ${r.views.toLocaleString()} reads`}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Eye className="h-3.5 w-3.5" />Preview public page</DropdownMenuItem>
                      <DropdownMenuItem><Edit3 className="h-3.5 w-3.5" />Edit</DropdownMenuItem>
                      <DropdownMenuItem>Send via email digest</DropdownMenuItem>
                      <DropdownMenuItem>Pin to in-app banner</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Unpublish</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <ul className="mt-4 space-y-2 border-t pt-3">
                  {r.changes.map((c, i) => {
                    const meta = CHANGE_ICON[c.type];
                    const Icon = meta.icon;
                    return (
                      <li key={i} className="flex items-start gap-2.5 text-xs">
                        <span className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-muted', meta.color)}>
                          <Icon className="h-3 w-3" />
                        </span>
                        <span><span className={cn('mr-1.5 font-semibold', meta.color)}>{meta.label}</span>{c.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
