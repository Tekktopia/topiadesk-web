'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Smile, Sparkles, Star, ThumbsUp } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Switch,
  Textarea,
  cn,
} from '@topiadesk/ui';

type Scale = 'stars' | 'thumbs' | 'nps';

const SCALES: { id: Scale; label: string; icon: typeof Star; desc: string }[] = [
  { id: 'stars', label: '1–5 stars', icon: Star, desc: 'Classic rating' },
  { id: 'thumbs', label: 'Thumbs up/down', icon: ThumbsUp, desc: 'Simple binary' },
  { id: 'nps', label: 'NPS (0–10)', icon: Smile, desc: 'Net Promoter Score' },
];

const DELAYS = [
  { id: 'immediate', label: 'Immediately' },
  { id: '1h', label: 'After 1 hour' },
  { id: '1d', label: 'After 1 day' },
];

export default function NewCsatSurveyPage() {
  const [name, setName] = useState('');
  const [scale, setScale] = useState<Scale>('stars');
  const [question, setQuestion] = useState('How would you rate the support you received?');
  const [followUp, setFollowUp] = useState('What could we have done better?');
  const [delay, setDelay] = useState('1h');
  const [firstResolutionOnly, setFirstResolutionOnly] = useState(true);
  const [flagLowScores, setFlagLowScores] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim().length > 1 && question.trim().length > 4;

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
              <Link href="/csat" className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white">
                <ArrowLeft className="h-3 w-3" /> CSAT
              </Link>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">New satisfaction survey</h1>
              <p className="mt-0.5 text-sm text-white/70">Auto-sent when tickets resolve to measure how your team is doing.</p>
            </div>
            <Button form="new-csat-form" type="submit" size="sm" disabled={!canSubmit || submitting} className="bg-coral text-white hover:bg-coral-dark">
              {submitting && <Loader2 className="h-3 w-3 animate-spin" />} Save survey
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <form id="new-csat-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Survey</CardTitle></CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Survey name *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Post-resolution CSAT" />
                </div>
                <div className="space-y-2">
                  <Label>Rating scale</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {SCALES.map((s) => {
                      const Icon = s.icon;
                      const selected = scale === s.id;
                      return (
                        <button key={s.id} type="button" onClick={() => setScale(s.id)}
                          className={cn('rounded-lg border p-3 text-left transition-all',
                            selected ? 'border-coral/40 bg-coral/5 ring-2 ring-coral/20' : 'border-border bg-card hover:border-coral/20')}>
                          <Icon className={cn('h-4 w-4', selected ? 'text-coral' : 'text-muted-foreground')} />
                          <p className="mt-1.5 text-xs font-semibold">{s.label}</p>
                          <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="q">Rating question *</Label>
                  <Input id="q" value={question} onChange={(e) => setQuestion(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fu">Follow-up comment prompt</Label>
                  <Input id="fu" value={followUp} onChange={(e) => setFollowUp(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Delivery</CardTitle></CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label>Send</Label>
                  <div className="flex gap-1.5">
                    {DELAYS.map((d) => (
                      <button key={d.id} type="button" onClick={() => setDelay(d.id)}
                        className={cn('flex-1 rounded-md border py-2 text-[11px] transition-colors',
                          delay === d.id ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card hover:bg-muted')}>
                        {d.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground">After a ticket is marked resolved.</p>
                </div>
                <label className="flex cursor-pointer items-center justify-between border-t py-2">
                  <div>
                    <p className="text-sm font-medium">Only on first resolution</p>
                    <p className="text-[11px] text-muted-foreground">Don&rsquo;t re-survey if a ticket is reopened and resolved again.</p>
                  </div>
                  <Switch checked={firstResolutionOnly} onCheckedChange={setFirstResolutionOnly} />
                </label>
                <label className="flex cursor-pointer items-center justify-between border-t py-2">
                  <div>
                    <p className="text-sm font-medium">Flag low scores for review</p>
                    <p className="text-[11px] text-muted-foreground">Auto-create a follow-up task for the team lead.</p>
                  </div>
                  <Switch checked={flagLowScores} onCheckedChange={setFlagLowScores} />
                </label>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Preview</CardTitle></CardHeader>
              <CardContent className="space-y-3 p-4 text-xs">
                <p className="font-medium">{question || 'Your rating question'}</p>
                {scale === 'stars' && (
                  <div className="flex gap-1">{[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-5 w-5 text-amber-400" />)}</div>
                )}
                {scale === 'thumbs' && (
                  <div className="flex gap-3"><ThumbsUp className="h-5 w-5 text-emerald-500" /><ThumbsUp className="h-5 w-5 rotate-180 text-red-500" /></div>
                )}
                {scale === 'nps' && (
                  <div className="flex flex-wrap gap-1">{Array.from({ length: 11 }, (_, i) => (
                    <span key={i} className="grid h-6 w-6 place-items-center rounded border text-[10px]">{i}</span>
                  ))}</div>
                )}
                {followUp && <p className="border-t pt-2 text-muted-foreground">{followUp}</p>}
                <div className="flex flex-wrap gap-1 pt-1">
                  <Badge variant="outline">{DELAYS.find((d) => d.id === delay)!.label}</Badge>
                  {firstResolutionOnly && <Badge variant="outline">First resolution</Badge>}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Tips</CardTitle></CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <Tip text="Sending after 1 hour gets higher response rates than immediately." />
                <Tip text="Scores attach to the agent for performance dashboards." />
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
