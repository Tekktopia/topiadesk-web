'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  Eye,
  Globe,
  Loader2,
  Lock,
  Sparkles,
  Tag as TagIcon,
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
  DropdownMenuTrigger,
  Input,
  Label,
  Textarea,
  cn,
} from '@topiadesk/ui';

const CATEGORIES = [
  { slug: 'getting-started', label: 'Getting started' },
  { slug: 'security', label: 'Security & MFA' },
  { slug: 'email', label: 'Email & calendars' },
  { slug: 'hardware', label: 'Laptops & devices' },
  { slug: 'integrations', label: 'Apps & integrations' },
  { slug: 'billing', label: 'Billing & expenses' },
];

const VISIBILITY = [
  { id: 'public', label: 'Public', description: 'Anyone on the help centre', icon: Globe },
  { id: 'logged-in', label: 'Signed-in customers', description: 'Customer portal only', icon: Lock },
  { id: 'internal', label: 'Internal agents only', description: 'Hidden from customers', icon: Lock },
];

const STATUSES = [
  { id: 'draft', label: 'Draft', description: 'Not visible to anyone yet' },
  { id: 'review', label: 'In review', description: 'Pending edit approval' },
  { id: 'published', label: 'Published', description: 'Live in the help centre' },
];

const TAG_PRESETS = ['how-to', 'troubleshooting', 'policy', 'fast-answer', 'video'];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export default function NewArticlePage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('getting-started');
  const [visibility, setVisibility] = useState('public');
  const [status, setStatus] = useState('draft');
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const effectiveSlug = useMemo(() => slug || slugify(title), [slug, title]);
  const canSubmit = title.length > 4 && summary.length > 10 && body.length > 20;

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
                href="/knowledge"
                className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white"
              >
                <ArrowLeft className="h-3 w-3" />
                Knowledge base
              </Link>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">
                New article
              </h1>
              <p className="mt-0.5 text-sm text-white/70">
                Help customers self-serve — fewer tickets, faster answers.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPreview((v) => !v)}
                className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                <Eye className="h-3 w-3" />
                {showPreview ? 'Hide preview' : 'Preview'}
              </Button>
              <Button
                form="new-article-form"
                type="submit"
                size="sm"
                disabled={!canSubmit || submitting}
                className="bg-coral text-white hover:bg-coral-dark"
              >
                {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
                Save draft
              </Button>
              <Button
                form="new-article-form"
                type="submit"
                size="sm"
                disabled={!canSubmit || submitting}
                className="bg-white text-foreground hover:bg-white/90"
              >
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <form
          id="new-article-form"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]"
        >
          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Title & summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. How to connect to the corporate VPN on macOS"
                    className="text-base font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL slug</Label>
                  <div className="flex items-center gap-2 rounded-md border border-input bg-muted px-3 py-2 text-xs">
                    <span className="text-muted-foreground">consomoafrica.topiadesk.com/portal/kb/</span>
                    <input
                      id="slug"
                      value={effectiveSlug}
                      onChange={(e) => setSlug(slugify(e.target.value))}
                      className="flex-1 bg-transparent font-mono outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Auto-generated from title. Edit only if you need a custom URL.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="summary">Summary *</Label>
                  <Textarea
                    id="summary"
                    rows={3}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="A one-sentence summary used in search results and help centre cards."
                  />
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{summary.length} / 160 characters</span>
                    <span>Aim for {'<'}160 for best search snippet</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Body</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-6">
                <Textarea
                  rows={16}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder={'# Connect to the corporate VPN\n\nFollow these steps to connect from a freshly imaged MacBook.\n\n1. Install Cisco AnyConnect from the Self-Service portal.\n2. Launch the app and enter `vpn.consomoafrica.com` as the gateway.\n3. Sign in with your corporate email and password.\n\n## Troubleshooting\n\nIf you see "AnyConnect was unable to establish a connection..." open a ticket.'}
                  className="font-mono text-xs leading-relaxed"
                />
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{body.split(' ').filter(Boolean).length} words · Markdown supported</span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    <Sparkles className="h-3 w-3 text-coral" />
                    Rewrite with AI
                  </button>
                </div>
              </CardContent>
            </Card>

            {showPreview && (
              <Card>
                <CardHeader className="border-b py-3">
                  <CardTitle className="text-sm">Live preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-6">
                  <h2 className="font-display text-xl font-bold">{title || 'Untitled article'}</h2>
                  <p className="text-sm text-muted-foreground">{summary || 'Summary appears here…'}</p>
                  <div className="prose-sm whitespace-pre-wrap rounded-md border bg-muted/30 p-4 text-sm">
                    {body || 'Body appears here…'}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Categorisation</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-md border border-input bg-card px-3 py-2 text-sm hover:bg-muted"
                      >
                        {CATEGORIES.find((c) => c.slug === category)?.label}
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64">
                      {CATEGORIES.map((c) => (
                        <DropdownMenuItem key={c.slug} onSelect={() => setCategory(c.slug)}>
                          {c.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                        {tags.includes(t) ? <X className="h-3 w-3" /> : <TagIcon className="h-3 w-3" />}
                        #{t}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Status</Label>
                  <div className="space-y-1.5">
                    {STATUSES.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setStatus(s.id)}
                        className={cn(
                          'flex w-full items-start gap-2 rounded-md border p-2 text-left text-xs transition-colors',
                          status === s.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border bg-card hover:bg-muted',
                        )}
                      >
                        <span
                          className={cn(
                            'mt-1 h-1.5 w-1.5 shrink-0 rounded-full',
                            s.id === 'draft' && 'bg-muted-foreground/40',
                            s.id === 'review' && 'bg-amber-500',
                            s.id === 'published' && 'bg-emerald-500',
                          )}
                        />
                        <div>
                          <p className="font-medium">{s.label}</p>
                          <p className="text-[10px] text-muted-foreground">{s.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4">
                {VISIBILITY.map((v) => {
                  const Icon = v.icon;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVisibility(v.id)}
                      className={cn(
                        'flex w-full items-start gap-2 rounded-md border p-2 text-left text-xs transition-colors',
                        visibility === v.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-card hover:bg-muted',
                      )}
                    >
                      <Icon className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{v.label}</p>
                        <p className="text-[10px] text-muted-foreground">{v.description}</p>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">SEO hints</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <Tip text={`Title length: ${title.length} chars (aim for 40–60).`} />
                <Tip text={`Summary length: ${summary.length} chars (aim for under 160).`} />
                <Tip text="Use H2 (##) for sub-headings — search engines rank them higher." />
              </CardContent>
            </Card>

            <Badge variant="outline" className="mx-auto block w-fit text-[10px]">
              <BookOpen className="h-3 w-3" />
              Articles auto-tagged for related-suggestions in tickets
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
