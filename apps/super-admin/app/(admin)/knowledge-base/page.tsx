'use client';

import { useState } from 'react';
import {
  BookOpen, Edit3, Eye, FileText, Filter, MoreHorizontal, Plus, Search, ThumbsUp,
} from 'lucide-react';
import {
  Badge, Button, Card, CardContent, CardHeader, CardTitle,
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  Input, cn,
} from '@topiadesk/ui';

interface Article {
  id: string; title: string; slug: string; category: string; author: string;
  status: 'published' | 'draft' | 'archived'; views: number; helpful: number;
  updatedAt: string; locale: string;
}

const ARTICLES: Article[] = [
  { id: 'kb-001', title: 'Getting started with Topiadesk', slug: 'getting-started', category: 'Onboarding', author: 'Daniel O.', status: 'published', views: 8_421, helpful: 96, updatedAt: '2026-05-22', locale: 'en-GB' },
  { id: 'kb-002', title: 'Setting up your first email channel', slug: 'email-channel', category: 'Channels', author: 'Amara D.', status: 'published', views: 5_212, helpful: 92, updatedAt: '2026-04-18', locale: 'en-GB' },
  { id: 'kb-003', title: 'Configuring WhatsApp Business', slug: 'whatsapp-setup', category: 'Channels', author: 'Tunde B.', status: 'published', views: 3_892, helpful: 88, updatedAt: '2026-04-02', locale: 'en-GB' },
  { id: 'kb-004', title: 'Asset management overview', slug: 'asset-management', category: 'Features', author: 'Amara D.', status: 'published', views: 2_104, helpful: 84, updatedAt: '2026-03-22', locale: 'en-GB' },
  { id: 'kb-005', title: 'SLA policies and escalation rules', slug: 'sla-policies', category: 'Features', author: 'Daniel O.', status: 'published', views: 1_842, helpful: 79, updatedAt: '2026-03-08', locale: 'en-GB' },
  { id: 'kb-006', title: 'Single Sign-On (SSO) with Google Workspace', slug: 'sso-google', category: 'Security', author: 'Tunde B.', status: 'published', views: 1_482, helpful: 94, updatedAt: '2026-02-14', locale: 'en-GB' },
  { id: 'kb-007', title: 'Custom branding for your customer portal', slug: 'branding', category: 'Customization', author: 'Amara D.', status: 'draft', views: 0, helpful: 0, updatedAt: '2026-05-30', locale: 'en-GB' },
  { id: 'kb-008', title: 'API rate limits and best practices', slug: 'api-rate-limits', category: 'API', author: 'Daniel O.', status: 'published', views: 924, helpful: 71, updatedAt: '2026-01-18', locale: 'en-GB' },
  { id: 'kb-009', title: 'Migrating from Zendesk', slug: 'migration-zendesk', category: 'Migration', author: 'Daniel O.', status: 'draft', views: 0, helpful: 0, updatedAt: '2026-05-28', locale: 'en-GB' },
  { id: 'kb-010', title: 'Pricing FAQ', slug: 'pricing-faq', category: 'Billing', author: 'Amara D.', status: 'published', views: 6_421, helpful: 82, updatedAt: '2026-05-12', locale: 'en-GB' },
  { id: 'kb-011', title: 'Comment configurer un canal email (FR)', slug: 'email-channel-fr', category: 'Channels', author: 'Amara D.', status: 'published', views: 412, helpful: 88, updatedAt: '2026-04-22', locale: 'fr-FR' },
  { id: 'kb-012', title: 'Old asset import guide (deprecated)', slug: 'old-asset-import', category: 'Migration', author: 'Tunde B.', status: 'archived', views: 184, helpful: 0, updatedAt: '2025-08-12', locale: 'en-GB' },
];

const CATEGORIES = ['All', 'Onboarding', 'Channels', 'Features', 'Security', 'Customization', 'API', 'Migration', 'Billing'];

export default function KnowledgeBasePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState<'all' | 'published' | 'draft' | 'archived'>('all');

  const filtered = ARTICLES.filter((a) => {
    if (category !== 'All' && a.category !== category) return false;
    if (status !== 'all' && a.status !== status) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.slug.includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    total: ARTICLES.length,
    published: ARTICLES.filter((a) => a.status === 'published').length,
    draft: ARTICLES.filter((a) => a.status === 'draft').length,
    views30d: ARTICLES.reduce((s, a) => s + a.views, 0),
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
        <header className="relative overflow-hidden rounded-2xl bg-navy px-6 py-5 shadow-lg shadow-navy/15">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Super Admin</p>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">Knowledge Base</h1>
              <p className="mt-0.5 text-sm text-white/70">
                {counts.published} published · {counts.draft} drafts · {counts.views30d.toLocaleString()} views (30d)
              </p>
            </div>
            <Button size="sm" className="bg-coral text-white hover:bg-coral-dark">
              <Plus className="h-3 w-3" />New article
            </Button>
          </div>
        </header>
      </div>

      <div className="shrink-0 space-y-5 px-5 pt-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Total articles', value: counts.total, color: 'text-foreground' },
            { label: 'Published', value: counts.published, color: 'text-emerald-600' },
            { label: 'Drafts', value: counts.draft, color: 'text-amber-600' },
            { label: 'Views (30d)', value: counts.views30d.toLocaleString(), color: 'text-foreground' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border bg-card px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</p>
              <p className={cn('mt-1 text-xl font-bold tabular-nums', s.color)}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border/70 bg-card px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap rounded-lg border p-0.5 text-xs">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCategory(c)}
                  className={cn('rounded-md px-2.5 py-1 font-medium transition-colors',
                    category === c ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground')}>
                  {c}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)}
                className="h-8 rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="all">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="relative ml-auto">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles…" className="h-8 w-60 pl-8 text-xs" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5 pt-5">
        <div className="rounded-xl border border-border/70 bg-card overflow-hidden">
          <table className="w-full text-xs">
            <thead className="sticky top-0 z-10 bg-[#F4EFE6] shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
              <tr className="border-b text-left text-muted-foreground">
                <th className="px-4 py-2.5 font-semibold">Article</th>
                <th className="px-3 py-2.5 font-semibold">Category</th>
                <th className="px-3 py-2.5 font-semibold">Locale</th>
                <th className="px-3 py-2.5 font-semibold">Status</th>
                <th className="px-3 py-2.5 font-semibold">Author</th>
                <th className="px-3 py-2.5 font-semibold text-right">Views</th>
                <th className="px-3 py-2.5 font-semibold text-right">Helpful</th>
                <th className="px-3 py-2.5 font-semibold">Updated</th>
                <th className="px-3 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{a.title}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">/kb/{a.slug}</p>
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant="secondary" className="text-[10px]">{a.category}</Badge>
                  </td>
                  <td className="px-3 py-3 font-mono text-[10px] text-muted-foreground">{a.locale}</td>
                  <td className="px-3 py-3">
                    <Badge variant={a.status === 'published' ? 'success' : a.status === 'draft' ? 'warning' : 'secondary'} className="text-[10px] capitalize">{a.status}</Badge>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{a.author}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{a.views.toLocaleString()}</td>
                  <td className="px-3 py-3 text-right">
                    {a.helpful > 0 ? (
                      <span className={cn('inline-flex items-center gap-0.5 tabular-nums font-semibold',
                        a.helpful >= 85 ? 'text-emerald-600' : a.helpful >= 70 ? 'text-amber-600' : 'text-red-600')}>
                        <ThumbsUp className="h-2.5 w-2.5" />{a.helpful}%
                      </span>
                    ) : <span className="text-muted-foreground/50">—</span>}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{a.updatedAt}</td>
                  <td className="px-3 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-3.5 w-3.5" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="h-3.5 w-3.5" />Preview</DropdownMenuItem>
                        <DropdownMenuItem><Edit3 className="h-3.5 w-3.5" />Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate as translation</DropdownMenuItem>
                        <DropdownMenuItem>View analytics</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Archive</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
