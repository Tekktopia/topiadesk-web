'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Mail, Sparkles } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
  cn,
} from '@topiadesk/ui';

type Category = 'auth' | 'billing' | 'product' | 'tenant' | 'support';

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'auth', label: 'Auth' },
  { id: 'billing', label: 'Billing' },
  { id: 'product', label: 'Product' },
  { id: 'tenant', label: 'Tenant' },
  { id: 'support', label: 'Support' },
];

const MERGE_TAGS = ['{{firstName}}', '{{tenantName}}', '{{subdomain}}', '{{daysLeft}}', '{{month}}', '{{amount}}', '{{loginUrl}}'];

export default function NewEmailTemplatePage() {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<Category>('product');
  const [body, setBody] = useState('Hi {{firstName}},\n\n');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim().length > 1 && subject.trim().length > 2 && body.trim().length > 10;

  function insertTag(tag: string) {
    setBody((b) => `${b}${tag}`);
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    window.setTimeout(() => setSubmitting(false), 800);
  }

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
        <div className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link href="/email-templates" className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white">
                <ArrowLeft className="h-3 w-3" /> Email templates
              </Link>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">New email template</h1>
              <p className="mt-0.5 text-sm text-white/70">Transactional email with merge tags, sent by the platform.</p>
            </div>
            <Button form="new-tpl-form" type="submit" size="sm" disabled={!canSubmit || submitting} className="bg-coral text-white hover:bg-coral-dark">
              {submitting && <Loader2 className="h-3 w-3 animate-spin" />} Save template
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <form id="new-tpl-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-coral" /> Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Template name *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Trial ending reminder" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {CATEGORIES.map((c) => (
                      <button key={c.id} type="button" onClick={() => setCategory(c.id)}
                        className={cn('rounded-md border py-2 text-[11px] transition-colors',
                          category === c.id ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card hover:bg-muted')}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject line *</Label>
                  <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Your trial ends in {{daysLeft}} days" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Body</CardTitle></CardHeader>
              <CardContent className="space-y-3 p-6">
                <Textarea rows={12} value={body} onChange={(e) => setBody(e.target.value)} className="font-mono text-xs" />
                <div className="flex flex-wrap gap-1 text-[10px]">
                  <span className="text-muted-foreground">Insert merge tag:</span>
                  {MERGE_TAGS.map((t) => (
                    <button key={t} type="button" onClick={() => insertTag(t)} className="rounded-full bg-muted px-2 py-0.5 font-mono hover:bg-muted/70">{t}</button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Preview</CardTitle></CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <Badge variant="outline" className="capitalize">{category}</Badge>
                <div className="rounded-md border bg-card p-3">
                  <p className="border-b pb-2 font-semibold">{subject || 'Subject line'}</p>
                  <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{body || 'Email body…'}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Tips</CardTitle></CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <Tip text="Merge tags resolve at send time against the recipient and tenant context." />
                <Tip text="Subject lines under 50 characters render fully on mobile clients." />
              </CardContent>
            </Card>
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
