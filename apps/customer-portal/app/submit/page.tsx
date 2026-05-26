'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { ComponentType, FormEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Info,
  Loader2,
  Mail,
  Monitor,
  Paperclip,
  Plug,
  Plus,
  Search,
  Shield,
  Sparkles,
  Wallet,
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
import {
  CURRENT_CUSTOMER,
  TENANT,
  kbArticles,
  kbCategories,
} from '@/lib/mock-data';

type Priority = 'low' | 'medium' | 'high' | 'urgent';

const PRIORITY_OPTIONS: { value: Priority; label: string; description: string }[] = [
  {
    value: 'low',
    label: 'Low',
    description: 'A minor issue, no immediate impact',
  },
  {
    value: 'medium',
    label: 'Medium',
    description: 'Affecting my work but I have a workaround',
  },
  {
    value: 'high',
    label: 'High',
    description: 'Blocking me from completing important work',
  },
  {
    value: 'urgent',
    label: 'Urgent',
    description: 'Outage affecting many people or revenue impact',
  },
];

const CATEGORY_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  'getting-started': HelpCircle,
  security: Shield,
  email: Mail,
  hardware: Monitor,
  integrations: Plug,
  billing: Wallet,
};

export default function SubmitTicketPage() {
  const [categorySlug, setCategorySlug] = useState<string>('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedCategory = kbCategories.find((c) => c.slug === categorySlug);

  const suggestions = useMemo(() => {
    if (!subject || subject.length < 3) return [];
    const q = subject.toLowerCase();
    return kbArticles
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q),
      )
      .slice(0, 3);
  }, [subject]);

  const canSubmit =
    subject.trim().length > 4 &&
    description.trim().length > 10 &&
    categorySlug !== '';

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  }

  if (submitted) {
    return <SubmittedConfirmation subject={subject} />;
  }

  return (
    <div className="bg-muted/20">
      <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <Link
          href="/"
          className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to home
        </Link>

        <header className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Submit a request
          </p>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Tell us what you need help with
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Our team aims to respond within 1 business hour.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>What is this about?</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {kbCategories.map((c) => {
                      const Icon = CATEGORY_ICONS[c.slug] ?? HelpCircle;
                      const active = categorySlug === c.slug;
                      return (
                        <button
                          type="button"
                          key={c.slug}
                          onClick={() => setCategorySlug(c.slug)}
                          className={cn(
                            'flex items-start gap-2 rounded-lg border p-3 text-left text-sm transition-colors',
                            active
                              ? 'border-primary bg-primary/5'
                              : 'border-border bg-card hover:bg-muted',
                          )}
                        >
                          <div
                            className={cn(
                              'grid h-7 w-7 place-items-center rounded-md',
                              active ? 'bg-primary text-white' : 'bg-muted text-foreground',
                            )}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold">{c.label}</p>
                            <p className="line-clamp-1 text-[10px] text-muted-foreground">
                              {c.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="One sentence summary, e.g. &ldquo;Cannot connect to office VPN&rdquo;"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="description">Describe what is happening</Label>
                    <span className="text-[10px] text-muted-foreground">
                      The more detail, the faster we can help
                    </span>
                  </div>
                  <Textarea
                    id="description"
                    placeholder="What were you doing? What did you expect to happen? What actually happened? Include any error messages and how often this occurs."
                    rows={8}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{description.length} characters · Markdown supported</span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 hover:text-foreground"
                    >
                      <Paperclip className="h-3 w-3" />
                      Attach files
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {PRIORITY_OPTIONS.map((p) => (
                      <button
                        type="button"
                        key={p.value}
                        onClick={() => setPriority(p.value)}
                        className={cn(
                          'rounded-lg border p-3 text-left transition-colors',
                          priority === p.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border bg-card hover:bg-muted',
                        )}
                      >
                        <p className="text-xs font-semibold">{p.label}</p>
                        <p className="mt-0.5 line-clamp-2 text-[10px] text-muted-foreground">
                          {p.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Contact preference</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-md border border-input bg-card px-3 py-2 text-sm hover:bg-muted"
                      >
                        Reply by email ({CURRENT_CUSTOMER.email})
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-72">
                      <DropdownMenuLabel>How should we reach you?</DropdownMenuLabel>
                      <DropdownMenuItem>Reply by email</DropdownMenuItem>
                      <DropdownMenuItem>
                        Call me on {CURRENT_CUSTOMER.phone}
                      </DropdownMenuItem>
                      <DropdownMenuItem>WhatsApp me</DropdownMenuItem>
                      <DropdownMenuItem>
                        I&rsquo;ll check the portal myself
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                  <p className="text-[11px] text-muted-foreground">
                    By submitting, you agree to be contacted by the {TENANT.shortName}{' '}
                    support team.
                  </p>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/">Cancel</Link>
                    </Button>
                    <Button type="submit" size="sm" disabled={!canSubmit || submitting}>
                      {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
                      {submitting ? 'Submitting' : 'Submit request'}
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {suggestions.length > 0 && (
              <Card>
                <CardHeader className="border-b py-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-orange" />
                    These might answer your question
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="divide-y">
                    {suggestions.map((a) => (
                      <li key={a.slug}>
                        <Link
                          href={`/kb/${a.slug}`}
                          className="block px-4 py-3 transition-colors hover:bg-muted/40"
                        >
                          <p className="text-sm font-medium leading-snug">{a.title}</p>
                          <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
                            {a.summary}
                          </p>
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            {a.helpfulPct}% found this helpful
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">What happens next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 text-xs">
                <Step number={1} label="Submit" body="Your request enters our helpdesk queue." />
                <Step
                  number={2}
                  label="Triage"
                  body={`An agent reviews and assigns priority — typically within ${
                    priority === 'urgent' ? '15 minutes' : '1 hour'
                  }.`}
                />
                <Step
                  number={3}
                  label="Update"
                  body="You will see progress here and in your inbox."
                />
                <Step
                  number={4}
                  label="Resolve"
                  body="You can rate the resolution to help us improve."
                />
              </CardContent>
            </Card>

            {selectedCategory && (
              <Card>
                <CardHeader className="border-b py-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Info className="h-4 w-4" />
                    Selected category
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 p-4 text-xs">
                  <p className="font-medium text-foreground">{selectedCategory.label}</p>
                  <p className="text-muted-foreground">{selectedCategory.description}</p>
                  <Link
                    href={`/kb?category=${selectedCategory.slug}`}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                  >
                    <Search className="h-3 w-3" />
                    Browse {selectedCategory.articleCount} articles
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({
  number,
  label,
  body,
}: {
  number: number;
  label: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
        {number}
      </span>
      <div>
        <p className="font-semibold text-foreground">{label}</p>
        <p className="text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}

function SubmittedConfirmation({ subject }: { subject: string }) {
  return (
    <div className="bg-muted/20">
      <div className="mx-auto max-w-2xl px-4 py-16 text-center lg:px-8">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold tracking-tight">
          We&rsquo;ve received your request
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ticket{' '}
          <Badge variant="outline" className="font-mono">
            #1025
          </Badge>{' '}
          has been created for &ldquo;{subject}&rdquo;. We&rsquo;ll email you
          when an agent picks it up.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button asChild>
            <Link href="/tickets">
              Track this ticket
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/submit">
              <Plus className="h-3 w-3" />
              Submit another
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
