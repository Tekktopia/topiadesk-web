'use client';

import * as React from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Button, cn } from '@topiadesk/ui';

/**
 * Coming-soon waitlist capture. No backend yet — mirrors the app's mock-form
 * pattern (simulated ~800ms submit) and reveals a success state.
 */
export function WaitlistForm({ className }: { className?: string }) {
  const [email, setEmail] = React.useState('');
  const [state, setState] = React.useState<'idle' | 'loading' | 'done'>('idle');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || state === 'loading') return;
    setState('loading');
    await new Promise((r) => setTimeout(r, 800));
    setState('done');
  }

  if (state === 'done') {
    return (
      <div
        className={cn(
          'flex items-center justify-center gap-2 rounded-xl border border-coral/30 bg-coral/10 px-5 py-3 text-sm font-medium text-coral-light',
          className,
        )}
      >
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        Thanks — we&rsquo;ll email you the moment we launch.
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn('flex w-full max-w-md flex-col gap-3 sm:flex-row', className)}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        aria-label="Work email"
        className="h-12 flex-1 rounded-lg border border-white/15 bg-white/5 px-4 text-base text-white outline-none placeholder:text-white/40 focus:border-coral focus:ring-2 focus:ring-coral/30"
      />
      <Button
        type="submit"
        size="lg"
        disabled={state === 'loading'}
        className="h-12 shrink-0 bg-coral px-6 text-base text-white shadow-xl shadow-coral/30 hover:bg-coral-dark"
      >
        {state === 'loading' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            Notify me at launch
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
