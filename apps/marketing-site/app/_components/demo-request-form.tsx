'use client';

import * as React from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { Button, Input, Label, Textarea, cn } from '@topiadesk/ui';

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Enter a valid work email'),
  phone: z
    .string()
    .min(7, 'Enter a valid phone number')
    .regex(/^[+()\-\s\d]+$/, 'Enter a valid phone number'),
  company: z.string().min(2, 'Please enter your company'),
  teamSize: z.string().optional(),
  message: z.string().max(1000).optional(),
});

type Fields = z.infer<typeof schema>;
type FieldName = keyof Fields;

const EMPTY: Fields = { name: '', email: '', phone: '', company: '', teamSize: '', message: '' };

/**
 * Demo-request capture. No public submission endpoint is wired yet, so a valid
 * submission hands off to the sales inbox (mailto) and reveals a success state —
 * mirroring the app's simple state-driven form pattern.
 */
export function DemoRequestForm() {
  const [values, setValues] = React.useState<Fields>(EMPTY);
  const [errors, setErrors] = React.useState<Partial<Record<FieldName, string>>>({});
  const [state, setState] = React.useState<'idle' | 'loading' | 'done'>('idle');

  function update(name: FieldName, value: string) {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === 'loading') return;

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<FieldName, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as FieldName;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setState('loading');
    const { name, email, phone, company, teamSize, message } = parsed.data;
    const subject = encodeURIComponent(`Demo request — ${company}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Company: ${company}`,
        teamSize ? `Team size: ${teamSize}` : null,
        '',
        message ?? '',
      ]
        .filter(Boolean)
        .join('\n'),
    );
    await new Promise((r) => setTimeout(r, 600));
    window.location.href = `mailto:sales@tekktopia.com?subject=${subject}&body=${body}`;
    setState('done');
  }

  if (state === 'done') {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-10 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <h3 className="font-display text-xl font-bold text-foreground">Thanks — we&rsquo;re on it</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Your request is on its way to our team. We&rsquo;ll reach out to book
          your demo shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Full name" error={errors.name}>
            <Input
              placeholder="Ada Obi"
              value={values.name}
              onChange={(e) => update('name', e.target.value)}
            />
          </Field>
        </div>
        <Field label="Work email" error={errors.email}>
          <Input
            type="email"
            placeholder="ada@topiadesk.com"
            value={values.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </Field>
        <Field label="Phone number" error={errors.phone}>
          <Input
            type="tel"
            placeholder="+234 800 000 0000"
            value={values.phone}
            onChange={(e) => update('phone', e.target.value)}
          />
        </Field>
        <Field label="Company" error={errors.company}>
          <Input
            placeholder="Topiadesk Inc."
            value={values.company}
            onChange={(e) => update('company', e.target.value)}
          />
        </Field>
        <Field label="Team size" hint="Optional">
          <Input
            placeholder="e.g. 25"
            value={values.teamSize}
            onChange={(e) => update('teamSize', e.target.value)}
          />
        </Field>
      </div>
      <div className="mt-5">
        <Field label="What would you like to see?" hint="Optional">
          <Textarea
            rows={4}
            placeholder="Tell us a little about your book and what you'd like to cover."
            value={values.message}
            onChange={(e) => update('message', e.target.value)}
          />
        </Field>
      </div>

      <Button
        type="submit"
        variant="coral"
        size="lg"
        disabled={state === 'loading'}
        className="mt-6 w-full font-semibold cursor-pointer"
      >
        {state === 'loading' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          'Request a demo'
        )}
      </Button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        We&rsquo;ll only use your details to arrange your demo.
      </p>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <Label>{label}</Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p className={cn('text-xs text-red-500')}>{error}</p>}
    </div>
  );
}
