'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Mail, MessageSquare, User } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Textarea,
  cn,
} from '@topiadesk/ui';
import { TENANT } from '@/lib/mock-data';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateRef() {
  return `#${Math.floor(1000 + Math.random() * 9000)}`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SubmitTicketPage() {
  const [fullName,    setFullName]    = useState('');
  const [email,       setEmail]       = useState('');
  const [subject,     setSubject]     = useState('');
  const [description, setDescription] = useState('');
  const [submitting,  setSubmitting]  = useState(false);
  const [ref,         setRef]         = useState('');

  const canSubmit =
    fullName.trim().length >= 2 &&
    email.trim().includes('@') &&
    subject.trim().length >= 4 &&
    description.trim().length >= 10;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    window.setTimeout(() => {
      setRef(generateRef());
      setSubmitting(false);
    }, 900);
  }

  // ── Success state ────────────────────────────────────────────────────────────
  if (ref) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold tracking-tight text-foreground">
          Request received!
        </h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Ticket <span className="font-mono font-semibold text-foreground">{ref}</span> has been
          created for <span className="font-semibold text-foreground">&ldquo;{subject}&rdquo;</span>.
          We will reach out to <span className="font-semibold text-foreground">{email}</span> as soon as
          possible — typically within 1 business hour.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/submit" onClick={() => {
              setFullName(''); setEmail(''); setSubject('');
              setDescription(''); setRef('');
            }}>
              Submit another request
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-muted/20 min-h-[70vh]">
      <div className="mx-auto max-w-2xl px-4 py-10 lg:px-8">

        {/* Back link */}
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to home
        </Link>

        {/* Page header */}
        <header className="mb-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {TENANT.shortName} Support
          </p>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Submit a support request
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill in the details below and our team will get back to you as soon
            as possible.
          </p>
        </header>

        <Card>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* Contact information */}
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Your contact information
                </p>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">

                  {/* Full name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      Full name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Ada Okonkwo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      autoComplete="name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      Email address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ada@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t" />

              {/* Request details */}
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Your request
                </p>

                {/* Subject */}
                <div className="mt-3 space-y-2">
                  <Label htmlFor="subject">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder={'Brief summary of your issue, e.g. "Cannot reset my password"'}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">
                    One sentence that describes the problem.
                  </p>
                </div>

                {/* Description */}
                <div className="mt-4 space-y-2">
                  <Label htmlFor="description" className="flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Please describe your issue in as much detail as possible. Include:&#10;• What were you trying to do?&#10;• What did you expect to happen?&#10;• What actually happened?&#10;• Any error messages you saw."
                    rows={7}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{description.length} characters</span>
                    <span>The more detail, the faster we can help.</span>
                  </div>
                </div>
              </div>

              {/* Submit row */}
              <div className={cn(
                'flex flex-wrap items-center justify-between gap-3 border-t pt-5',
              )}>
                <p className="text-[11px] text-muted-foreground">
                  By submitting, you agree to be contacted by the{' '}
                  <span className="font-medium text-foreground">{TENANT.shortName}</span>{' '}
                  support team regarding this request.
                </p>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!canSubmit || submitting}
                  className="min-w-[140px]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      Submit request
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>

        {/* Footer note */}
        <p className="mt-5 text-center text-xs text-muted-foreground">
          Need immediate help?{' '}
          {TENANT.supportPhone && (
            <>
              Call us at{' '}
              <a href={`tel:${TENANT.supportPhone}`} className="font-medium text-primary hover:underline">
                {TENANT.supportPhone}
              </a>{' '}
              or{' '}
            </>
          )}
          <Link href="/kb" className="font-medium text-primary hover:underline">
            browse our help centre
          </Link>
          .
        </p>

      </div>
    </div>
  );
}
