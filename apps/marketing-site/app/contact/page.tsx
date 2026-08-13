import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Clock, Mail, MapPin, Sparkles } from 'lucide-react';
import { Button, Logo } from '@topiadesk/ui';
import { DemoRequestForm } from '../_components/demo-request-form';

export const metadata: Metadata = {
  title: 'Request a demo — Topiadesk',
  description:
    'Book a personalised Topiadesk demo, or talk to us about migrating your book to the platform.',
};

const HIGHLIGHTS = [
  {
    icon: Sparkles,
    title: 'See it on your data',
    body: 'A walkthrough tailored to how your team actually works — policies, claims and all.',
  },
  {
    icon: MapPin,
    title: 'Built for the region',
    body: 'In-country hosting, Naira-native billing and NDPA-aligned by design.',
  },
  {
    icon: Clock,
    title: 'Up and running fast',
    body: 'Guided, procedural migration means go-live in days, not quarters.',
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Simple header ── */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={28} className="shrink-0" />
            <span className="text-lg font-bold tracking-tight text-foreground">Topiadesk</span>
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* ── Left: pitch ── */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-coral">
              Request a demo
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              See Topiadesk in action
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
              Tell us a little about your team and we&rsquo;ll set up a
              personalised walkthrough — no obligation, no pressure.
            </p>

            <ul className="mt-10 space-y-6">
              {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-coral/10 text-coral">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex items-center gap-3 rounded-xl border border-border bg-cream p-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-navy text-white">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Prefer email?</p>
                <a
                  href="mailto:sales@tekktopia.com"
                  className="text-sm font-semibold text-foreground transition-colors hover:text-coral"
                >
                  sales@tekktopia.com
                </a>
              </div>
            </div>
          </div>

          {/* ── Right: form ── */}
          <div id="demo">
            <DemoRequestForm />
          </div>
        </div>
      </main>

      {/* ── Footer strip ── */}
      <footer className="border-t border-border bg-cream">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-xs text-muted-foreground sm:flex-row lg:px-8">
          <p>&copy; {new Date().getFullYear()} Tekktopia Ltd. All rights reserved.</p>
          <Link href="/" className="transition-colors hover:text-coral">
            Back to topiadesk.com
          </Link>
        </div>
      </footer>
    </div>
  );
}
