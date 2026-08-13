'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeftRight,
  ArrowRight,
  Banknote,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Gauge,
  History,
  Lock,
  MapPin,
  Plug,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { Button, cn } from '@topiadesk/ui';

type Capability = {
  key: string;
  tab: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
};

// The three named pillars lead, followed by the platform capabilities.
const CAPABILITIES: Capability[] = [
  {
    key: 'multitenant',
    tab: 'Multitenant software',
    icon: Building2,
    eyebrow: 'Built to scale',
    title: 'One platform, isolated tenants',
    description:
      'Onboard unlimited brokers on a single, secure platform — every tenant fully isolated, no new infrastructure to stand up.',
    points: ['Per-tenant isolation', 'Central administration', 'Scales with your book'],
  },
  {
    key: 'integration',
    tab: 'Seamless integration',
    icon: Plug,
    eyebrow: 'Connected',
    title: 'Plug into the tools you already run',
    description:
      'Connect your existing systems and workflows in minutes, not sprints — data flows where it needs to, automatically.',
    points: ['Prebuilt connectors', 'Open API & webhooks', 'Minutes to connect'],
  },
  {
    key: 'migration',
    tab: 'Procedural migration',
    icon: ArrowLeftRight,
    eyebrow: 'Move with confidence',
    title: 'A guided path for your whole book',
    description:
      'Bring everything across with a structured, step-by-step migration — nothing left behind, no surprises on go-live day.',
    points: ['Step-by-step flow', 'Validated at every stage', 'Zero data loss'],
  },
  {
    key: 'insurance-model',
    tab: 'Insurance model',
    icon: ShieldCheck,
    eyebrow: 'Purpose-built',
    title: '80+ native insurance objects',
    description:
      'Policies, claims, producers and commissions are first-class data — not bolted onto a generic CRM.',
    points: ['Policies & claims', 'Producers & commissions', 'First-class data model'],
  },
  {
    key: 'access-control',
    tab: 'Access control',
    icon: Lock,
    eyebrow: 'Secure by default',
    title: 'Row-level security at the database',
    description:
      'Access is enforced at the data layer, so every broker sees only their own book — never anyone else’s.',
    points: ['Database-enforced', 'Per-broker visibility', 'No accidental exposure'],
  },
  {
    key: 'audit-trail',
    tab: 'Audit trail',
    icon: History,
    eyebrow: 'Provable',
    title: 'A tamper-evident audit trail',
    description:
      'A hash-chained log captures every compliance-relevant change — provably intact and ready for any review.',
    points: ['Hash-chained log', 'Tamper-evident', 'Audit-ready'],
  },
  {
    key: 'claims',
    tab: 'Claims',
    icon: ClipboardCheck,
    eyebrow: 'End to end',
    title: 'Full FNOL-to-payment flow',
    description:
      'A dedicated claims engine that carries each claim from first notice of loss all the way through to payment.',
    points: ['Distinct claim entity', 'FNOL to payment', 'Nothing falls through'],
  },
  {
    key: 'ai-cost',
    tab: 'AI cost control',
    icon: Gauge,
    eyebrow: 'Predictable',
    title: 'A hard cap on AI spend',
    description:
      'Every AI call is checked against a hard spend cap before it runs — powerful automation with no runaway bills.',
    points: ['Hard spend cap', 'Checked per call', 'No bill surprises'],
  },
  {
    key: 'billing',
    tab: 'Billing',
    icon: Banknote,
    eyebrow: 'Local-first',
    title: 'Naira-native pricing',
    description:
      'Fixed pricing in Naira with zero exposure to exchange-rate movements — budget with confidence.',
    points: ['Fixed Naira pricing', 'No FX exposure', 'Predictable costs'],
  },
  {
    key: 'data-residency',
    tab: 'Data residency',
    icon: MapPin,
    eyebrow: 'Compliant',
    title: 'In-country data residency',
    description:
      'Hosted in Nigeria and aligned with the Nigeria Data Protection Act (NDPA) — your data stays home.',
    points: ['In-country hosting', 'NDPA-aligned', 'Data sovereignty'],
  },
];

export function CapabilitiesShowcase() {
  const [active, setActive] = useState(0);
  const current = CAPABILITIES[active] ?? CAPABILITIES[0]!;
  const Icon = current.icon;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-6">
      {/* ── Tab rail ── */}
      <div
        role="tablist"
        aria-label="Platform capabilities"
        className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:pb-0"
      >
        {CAPABILITIES.map((cap, i) => {
          const selected = i === active;
          const TabIcon = cap.icon;
          return (
            <button
              key={cap.key}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(i)}
              className={cn(
                'group flex shrink-0 items-center gap-3 rounded-xl border-l-2 px-4 py-3 text-left text-sm font-medium transition-all lg:shrink',
                selected
                  ? 'border-coral bg-white/10 text-white'
                  : 'border-transparent text-white/55 hover:bg-white/5 hover:text-white/80',
              )}
            >
              <TabIcon
                className={cn(
                  'h-4 w-4 shrink-0 transition-colors',
                  selected ? 'text-coral' : 'text-white/40 group-hover:text-white/70',
                )}
              />
              <span className="whitespace-nowrap lg:whitespace-normal">{cap.tab}</span>
            </button>
          );
        })}
      </div>

      {/* ── Preview panel ── */}
      <div
        role="tabpanel"
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-7 sm:p-10"
      >
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-coral/20 blur-[90px]" />

        <div className="relative flex flex-col gap-6">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-coral/15 text-coral">
            <Icon className="h-7 w-7" />
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-coral-light">
              {current.eyebrow}
            </p>
            <h3 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {current.title}
            </h3>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-white/60">
              {current.description}
            </p>
          </div>

          <ul className="flex flex-wrap gap-2.5">
            {current.points.map((p) => (
              <li
                key={p}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-coral" />
                {p}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button
              asChild
              variant="coral"
              size="lg"
              className="font-semibold shadow-lg shadow-coral/20"
            >
              <Link href="/signup">
                Start free trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="border border-white/20 bg-white/5 text-white hover:bg-white/10"
            >
              <Link href="/contact">Request a demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
