import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Bell,
  Bot,
  CheckCircle2,
  ChevronRight,
  Headset,
  LayoutDashboard,
  Mail,
  Monitor,
  Shield,
  Smartphone,
  Star,
  Ticket,
  Users,
  Workflow,
  Zap,
} from 'lucide-react';
import { Button, Card, CardContent, cn } from '@topiadesk/ui';

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Ticket,
    title: 'Multi-channel ticketing',
    description:
      'Capture support requests from email, WhatsApp, portal, or voice calls — all in one unified queue.',
    accent: 'blue',
  },
  {
    icon: Monitor,
    title: 'Network & NOC monitoring',
    description:
      'Real-time device health, downtime alerts, SLA tracking and topology maps for your infrastructure.',
    accent: 'violet',
  },
  {
    icon: Workflow,
    title: 'Smart automations',
    description:
      'Auto-assign, escalate, close, and reply based on powerful trigger-action rules — no code needed.',
    accent: 'emerald',
  },
  {
    icon: Bot,
    title: 'AI-assisted responses',
    description:
      'Suggest replies, summarise ticket history, and auto-categorise incoming requests with AI.',
    accent: 'orange',
  },
  {
    icon: BarChart3,
    title: 'Deep analytics',
    description:
      'CSAT scores, first-response times, resolution rates, and agent leaderboards — all live.',
    accent: 'blue',
  },
  {
    icon: Shield,
    title: 'Enterprise security',
    description:
      'SSO, MFA enforcement, role-based access, full audit logs, and IP allow-listing built in.',
    accent: 'violet',
  },
];

const STATS = [
  { value: '12 000+', label: 'Tickets resolved daily' },
  { value: '99.9%',   label: 'Platform uptime SLA' },
  { value: '< 2 min', label: 'Avg. first-response time' },
  { value: '4.9 / 5', label: 'Average CSAT score' },
];

const LOGOS = [
  'ConsomoAfrica', 'Kasi Pay', 'FlairTech', 'CrestBank', 'DataNest', 'WestGrid',
];

const TESTIMONIALS = [
  {
    quote:
      'Topiadesk cut our mean time to resolution by 60% in the first month. The automation engine is genuinely impressive.',
    author: 'Adaeze Nwosu',
    role: 'Head of IT Support, ConsomoAfrica',
    stars: 5,
  },
  {
    quote:
      'We replaced three separate tools with Topiadesk. One platform for helpdesk, monitoring, and assets. It just works.',
    author: 'Kwame Mensah',
    role: 'CTO, FlairTech',
    stars: 5,
  },
  {
    quote:
      "The NOC dashboard is phenomenal — we caught a network outage before customers noticed it. Can't imagine working without it.",
    author: 'Fatima Suleiman',
    role: 'Network Operations Lead, DataNest',
    stars: 5,
  },
];

const PLANS = [
  {
    name: 'Starter',
    price: '₦29 000',
    period: '/mo',
    description: 'Perfect for small teams getting started with helpdesk.',
    features: ['Up to 5 agents', 'Email & portal channel', 'Basic automations', '30-day history'],
    cta: 'Start free trial',
    highlighted: false,
  },
  {
    name: 'Business',
    price: '₦89 000',
    period: '/mo',
    description: 'Everything you need to run a professional support operation.',
    features: [
      'Up to 25 agents',
      'All channels incl. WhatsApp',
      'Advanced automations & SLA',
      'NOC monitoring (100 devices)',
      'AI-assisted responses',
      'Full analytics',
    ],
    cta: 'Start free trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Unlimited scale with dedicated support and custom SLAs.',
    features: [
      'Unlimited agents',
      'Unlimited channels',
      'Unlimited NOC devices',
      'Custom SLA & branding',
      'SSO & advanced security',
      'Dedicated CSM',
    ],
    cta: 'Contact sales',
    highlighted: false,
  },
];

const accentMap: Record<string, string> = {
  blue:   'bg-blue-500/10 text-blue-500',
  violet: 'bg-violet-500/10 text-violet-500',
  emerald:'bg-emerald-500/10 text-emerald-500',
  orange: 'bg-orange/10 text-orange',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MarketingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">

      {/* ── Topbar ── */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 shadow-md shadow-blue-600/25">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Topiadesk
            </span>
          </Link>

          <nav className="ml-4 hidden items-center gap-0.5 md:flex">
            {['Features', 'Monitoring', 'Pricing', 'Docs', 'Blog'].map((item) => (
              <Link
                key={item}
                href="#"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 md:inline"
            >
              Sign in
            </Link>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-blue-500 shadow-md shadow-blue-600/20 hover:from-blue-500 hover:to-blue-400"
            >
              <Link href="/signup">
                Start free trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#050C1A] pt-20 pb-28">
        {/* Gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-violet-600/15 blur-[100px]" />
          <div className="absolute left-0 bottom-0 h-[300px] w-[400px] rounded-full bg-blue-800/10 blur-[80px]" />
        </div>

        {/* Dot grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(#ffffff0a 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative mx-auto max-w-5xl px-4 text-center lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-400" />
            </span>
            Now with AI-assisted responses
            <ChevronRight className="h-3.5 w-3.5 opacity-70" />
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            The helpdesk built for{' '}
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              African teams
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
            Topiadesk unifies your support tickets, network monitoring, and IT
            assets in one platform — with automation, AI, and analytics that
            actually work in low-bandwidth environments.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 bg-gradient-to-r from-blue-600 to-blue-500 px-8 text-base shadow-xl shadow-blue-600/30 hover:from-blue-500 hover:to-blue-400"
            >
              <Link href="/signup">
                Start free — no credit card
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-white/10 bg-white/5 px-8 text-base text-white hover:bg-white/10 hover:border-white/20"
            >
              <Link href="#">Watch 3-min demo</Link>
            </Button>
          </div>

          <p className="mt-4 text-xs text-slate-600">
            14-day trial · No setup fees · Cancel anytime
          </p>
        </div>

        {/* Fake dashboard preview */}
        <div className="relative mx-auto mt-16 max-w-5xl px-4 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B1120] shadow-2xl shadow-black/60">
            <div className="flex h-10 items-center gap-2 border-b border-white/5 bg-[#070D1A] px-4">
              <span className="h-3 w-3 rounded-full bg-red-500/70" />
              <span className="h-3 w-3 rounded-full bg-amber-400/70" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
              <span className="ml-4 text-xs text-slate-600">app.topiadesk.com — Dashboard</span>
            </div>
            <div className="grid grid-cols-4 gap-3 p-5">
              {[
                { label: 'Open tickets', val: '47', color: 'text-blue-400' },
                { label: 'SLA at risk',  val: '4',  color: 'text-amber-400' },
                { label: 'Resolved today', val: '18', color: 'text-emerald-400' },
                { label: 'Avg response',   val: '12m', color: 'text-violet-400' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                  <p className="text-[10px] font-medium text-slate-600 uppercase tracking-wider">{s.label}</p>
                  <p className={cn('mt-1 text-2xl font-bold tabular-nums', s.color)}>{s.val}</p>
                  <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                    <div className={cn('h-full rounded-full bg-current opacity-30', s.color)} style={{ width: '65%' }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 pb-5">
              <div className="h-32 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-slate-500">Ticket volume — last 7 days</p>
                  <span className="text-[10px] text-emerald-400 font-medium">↑ 8% vs last week</span>
                </div>
                <div className="flex items-end gap-1.5 h-14">
                  {[42, 51, 47, 55, 60, 28, 22, 18].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm bg-blue-500/20 transition-all" style={{ height: `${(h / 60) * 100}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Gradient fade at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050C1A] to-transparent" />
        </div>
      </section>

      {/* ── Social proof bar ── */}
      <section className="border-y bg-slate-50 py-10">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="mb-8 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Trusted by leading African businesses
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {LOGOS.map((logo) => (
              <span
                key={logo}
                className="text-sm font-bold tracking-tight text-slate-400 transition-colors hover:text-slate-700"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-4xl font-bold text-transparent">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-600">
              Everything in one platform
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900">
              Built for modern support teams
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">
              From first contact to resolution, Topiadesk covers every step of
              your support and IT operations workflow.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <Card
                  key={f.title}
                  className="group border-slate-200 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <CardContent className="p-6">
                    <div
                      className={cn(
                        'mb-4 grid h-10 w-10 place-items-center rounded-xl',
                        accentMap[f.accent],
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mb-2 font-semibold text-slate-900">{f.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {f.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Channels highlight ── */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-600">
                Meet customers where they are
              </p>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900">
                Every channel, one inbox
              </h2>
              <p className="mt-4 text-slate-500 leading-relaxed">
                Whether customers reach out via email, WhatsApp, your branded
                portal, or a phone call — all conversations land in the same
                unified queue for your team.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  { icon: Mail,       label: 'Email-to-ticket via forwarding rules' },
                  { icon: Smartphone, label: 'WhatsApp via Twilio or Meta Cloud API' },
                  { icon: Headset,    label: 'Voice calls with automatic note-logging' },
                  { icon: Users,      label: 'Self-service customer portal' },
                ].map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                      <Icon className="h-4 w-4" />
                    </div>
                    {label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="space-y-3">
                {[
                  { channel: 'Email',     bg: 'bg-blue-100 text-blue-700',    count: '124 tickets',    pct: 48 },
                  { channel: 'Portal',    bg: 'bg-violet-100 text-violet-700', count: '56 tickets',     pct: 22 },
                  { channel: 'WhatsApp',  bg: 'bg-emerald-100 text-emerald-700', count: '41 tickets',  pct: 16 },
                  { channel: 'Voice',     bg: 'bg-orange/10 text-orange',      count: '24 tickets',     pct: 9 },
                ].map((c) => (
                  <div key={c.channel} className="flex items-center gap-3">
                    <span className={cn('rounded-lg px-2 py-0.5 text-xs font-semibold w-20 text-center shrink-0', c.bg)}>
                      {c.channel}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
                        style={{ width: `${c.pct}%` }}
                      />
                    </div>
                    <span className="w-16 text-right text-xs text-slate-500">{c.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900">
              Loved by support teams
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.author} className="border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mb-4 text-sm text-slate-600 leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.author}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-600">Transparent pricing</p>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900">
              Simple plans, powerful features
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-slate-500">
              All plans include a 14-day free trial. No credit card required to start.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'relative rounded-2xl border p-7 transition-shadow',
                  plan.highlighted
                    ? 'border-blue-600 bg-gradient-to-b from-blue-600 to-blue-700 shadow-xl shadow-blue-600/30 text-white'
                    : 'border-slate-200 bg-white shadow-sm hover:shadow-md',
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-amber-400 to-orange px-4 py-1 text-[11px] font-bold text-white shadow-md">
                      Most popular
                    </span>
                  </div>
                )}
                <p className={cn('text-sm font-semibold', plan.highlighted ? 'text-blue-200' : 'text-slate-500')}>
                  {plan.name}
                </p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className={cn('text-4xl font-bold', plan.highlighted ? 'text-white' : 'text-slate-900')}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={cn('text-sm', plan.highlighted ? 'text-blue-300' : 'text-slate-400')}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className={cn('mt-2 text-sm', plan.highlighted ? 'text-blue-200' : 'text-slate-500')}>
                  {plan.description}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2
                        className={cn(
                          'h-4 w-4 shrink-0',
                          plan.highlighted ? 'text-blue-200' : 'text-emerald-500',
                        )}
                      />
                      <span className={plan.highlighted ? 'text-blue-100' : 'text-slate-600'}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button
                    asChild
                    className={cn(
                      'w-full',
                      plan.highlighted
                        ? 'bg-white text-blue-700 hover:bg-blue-50 font-semibold'
                        : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-md shadow-blue-600/20',
                    )}
                  >
                    <Link href={plan.name === 'Enterprise' ? '/contact' : '/signup'}>
                      {plan.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-[#050C1A] py-24 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/15 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4">
          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Ready to transform your support?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-400">
            Join hundreds of African businesses delivering faster, smarter
            support with Topiadesk.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 bg-gradient-to-r from-blue-600 to-blue-500 px-10 text-base shadow-xl shadow-blue-600/30"
            >
              <Link href="/signup">
                Start your free trial
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-white/10 bg-white/5 px-10 text-base text-white hover:bg-white/10"
            >
              <Link href="/contact">Talk to sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-100 bg-slate-50 py-12">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-slate-900">Topiadesk</span>
            </div>
            <p className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} Tekktopia Ltd. All rights reserved.
            </p>
            <div className="flex gap-5 text-xs text-slate-500">
              {['Privacy', 'Terms', 'Security', 'Status'].map((l) => (
                <Link key={l} href="#" className="hover:text-slate-900">
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
