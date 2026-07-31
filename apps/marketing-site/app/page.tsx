import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  Headset,
  Layers,
  Mail,
  Monitor,
  Phone,
  Shield,
  ShieldCheck,
  Star,
  Ticket,
  Users,
  Workflow,
} from 'lucide-react';
import { Button, Card, CardContent, Logo, cn } from '@topiadesk/ui';
import { WaitlistForm } from './_components/waitlist-form';

// Pricing is hidden while the product is pre-launch (coming-soon page).
// Flip to `true` to restore the pricing section and its nav link.
const SHOW_PRICING = false;

// ─── Brand icons ───────────────────────────────────────────────────────────────
// Lucide no longer ships brand marks, so the WhatsApp glyph is inlined here.
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Ticket,
    title: 'Multi-channel ticketing',
    description:
      'Capture support requests from email, WhatsApp, portal, or voice calls — all in one unified queue.',
    accent: 'coral',
  },
  {
    icon: Monitor,
    title: 'Network & NOC monitoring',
    description:
      'Real-time device health, downtime alerts, SLA tracking and topology maps for your infrastructure.',
    accent: 'navy',
  },
  {
    icon: Workflow,
    title: 'Smart automations',
    description:
      'Auto-assign, escalate, close, and reply based on powerful trigger-action rules — no code needed.',
    accent: 'lavender',
  },
  {
    icon: Bot,
    title: 'AI-assisted responses',
    description:
      'Suggest replies, summarise ticket history, and auto-categorise incoming requests with AI.',
    accent: 'coral',
  },
  {
    icon: BarChart3,
    title: 'Deep analytics',
    description:
      'CSAT scores, first-response times, resolution rates, and agent leaderboards — all live.',
    accent: 'navy',
  },
  {
    icon: Shield,
    title: 'Enterprise security',
    description:
      'SSO, MFA enforcement, role-based access, full audit logs, and IP allow-listing built in.',
    accent: 'lavender',
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

// Mirrors mockPlans in super-admin (/tenants/new): USD, per-agent/month.
const PLANS = [
  {
    name: 'Starter',
    price: '$149',
    period: '/agent/mo',
    description: 'Everything a small team needs to start resolving tickets fast.',
    features: [
      'Up to 5 agents',
      'Email channel',
      'Portal channel',
      'Basic reports',
      'Knowledge base',
      '1 automation · 10 GB storage',
    ],
    cta: 'Start free trial',
    highlighted: false,
  },
  {
    name: 'Business',
    price: '$499',
    period: '/agent/mo',
    description: 'Everything you need to run a professional support operation.',
    features: [
      'Up to 20 agents',
      'WhatsApp, SMS & Voice channels',
      'SLA policies',
      'Advanced reports & custom automations',
      'Asset management',
      'Monitoring & NOC (basic) · 30 GB storage',
    ],
    cta: 'Start free trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '$999',
    period: '/agent/mo',
    description: 'Unlimited scale with dedicated support and custom SLAs.',
    features: [
      'Unlimited agents',
      'Full monitoring & NOC',
      'Custom integrations',
      'SSO / SAML & audit-log export',
      'Custom branding',
      '99.9% uptime guarantee · 100 GB storage',
    ],
    cta: 'Contact sales',
    highlighted: false,
  },
];

const FOOTER_COLUMNS = [
  {
    heading: 'Product',
    links: [
      { label: 'Ticketing', href: '#' },
      { label: 'Monitoring & NOC', href: '#' },
      { label: 'Automations', href: '#' },
      { label: 'AI assist', href: '#' },
      { label: 'Analytics', href: '#' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'Learn', href: '#' },
      { label: 'System status', href: '#' },
      { label: 'API reference', href: '#' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Security', href: '#' },
      { label: 'DPA', href: '#' },
    ],
  },
];

const accentMap: Record<string, string> = {
  coral:    'bg-coral/10 text-coral',
  navy:     'bg-navy/10 text-navy',
  lavender: 'bg-lavender text-navy',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MarketingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">

      {/* ── Floating pill nav ── */}
      <header className="fixed inset-x-0 top-4 z-50 px-3 sm:px-4">
        <div className="relative mx-auto flex h-14 max-w-6xl items-center gap-6 rounded-full border border-white/10 bg-navy/95 pl-6 pr-3 shadow-xl shadow-coral/20 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={28} className="shrink-0" />
            <span className="text-lg font-bold tracking-tight text-white">
              Topiadesk
            </span>
          </Link>

          <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 md:flex">
            {[
              { label: 'Features', href: '#features' },
              { label: 'Monitoring', href: '#channels' },
              { label: 'Docs', href: '#' },
              { label: 'Blog', href: '#' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full px-3.5 py-1.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <Button
              asChild
              className="rounded-full bg-white text-navy shadow-sm hover:bg-white/90"
            >
              <Link href="#waitlist">
                Notify me
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero (framed, fob.ng-style rounded card) ── */}
      <section className="relative mx-3 mt-3 overflow-hidden rounded-[2rem] bg-navy pt-32 pb-24 sm:mx-4">
        {/* Gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-coral/20 blur-[120px]" />
          <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-lavender/10 blur-[100px]" />
          <div className="absolute left-0 bottom-0 h-[300px] w-[400px] rounded-full bg-coral/10 blur-[80px]" />
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
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-coral/20 bg-coral/10 px-4 py-1.5 text-sm font-medium text-coral-light">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-coral" />
            </span>
            Launching soon
          </div>

          <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            The helpdesk built for{' '}
            <span className="bg-gradient-to-r from-coral-light via-coral to-coral-light bg-clip-text text-transparent">
              African teams
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
            Topiadesk unifies your support tickets, network monitoring, and IT
            assets in one platform — with automation, AI, and analytics that
            actually work in low-bandwidth environments.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3">
            <WaitlistForm />
            <p className="text-xs text-white/40">
              Be the first to know when we launch — no spam, ever.
            </p>
          </div>

          {/* Feature callouts */}
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { icon: Layers,      title: 'One unified platform', sub: 'Helpdesk, monitoring & assets in a single tenant.' },
              { icon: Headset,     title: 'Built for 24/7 support', sub: 'Multi-channel queue that never drops a request.' },
              { icon: ShieldCheck, title: '99.9% uptime SLA', sub: 'Resilient by design, even on low bandwidth.' },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex flex-col items-center text-center">
                <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-coral/10 text-coral">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/50">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Product preview — layered dashboard panels (mirrors tenant-admin /admin) */}
        <div className="relative mx-auto mt-16 max-w-5xl px-4 lg:px-8">
          <div className="relative">

            {/* ── Main panel: tenant-admin dashboard replica ── */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-card shadow-2xl shadow-black/60">
              {/* Browser chrome */}
              <div className="flex h-10 items-center gap-2 border-b border-border bg-cream px-4">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                <span className="ml-4 truncate text-xs text-muted-foreground">
                  consomoafrica.topiadesk.com/admin
                </span>
              </div>

              {/* Workspace header strip */}
              <div className="m-4 mb-0 overflow-hidden rounded-xl bg-navy p-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
                  Admin overview
                </p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-base font-bold text-white sm:text-lg">
                      ConsomoAfrica workspace
                    </p>
                    <p className="truncate text-xs text-white/50">
                      Health, usage, and recent admin activity at a glance.
                    </p>
                  </div>
                  <span className="hidden shrink-0 rounded-lg bg-coral px-3 py-1.5 text-xs font-semibold text-white sm:inline-block">
                    Open settings
                  </span>
                </div>
              </div>

              {/* KPI cards */}
              <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
                {[
                  { label: 'Active agents',      val: '5',    sub: 'of 35 seats' },
                  { label: 'Automations active', val: '4',    sub: '3 drafts' },
                  { label: 'Integrations',       val: '5',    sub: '9 available' },
                  { label: 'Tickets this month', val: '1.2k', sub: '+8% vs last month' },
                ].map((k) => (
                  <div key={k.label} className="rounded-xl border border-border bg-background p-3">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {k.label}
                    </p>
                    <p className="mt-1 font-display text-2xl font-bold tabular-nums text-foreground">
                      {k.val}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{k.sub}</p>
                    <div className="mt-2 h-6 text-coral">
                      <svg viewBox="0 0 100 24" className="h-full w-full" preserveAspectRatio="none">
                        <polyline
                          points="0,20 20,16 40,18 60,9 80,11 100,4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              {/* Activity feed */}
              <div className="px-4 pb-4">
                <div className="rounded-xl border border-border bg-background p-3">
                  <p className="mb-2 text-[11px] font-semibold text-foreground">
                    Recent admin activity
                  </p>
                  <div className="space-y-2">
                    {[
                      { who: 'AN', text: 'updated SLA policy — VIP fast-track', t: '12 min' },
                      { who: 'AN', text: 'invited a new agent to the workspace', t: '38 min' },
                      { who: 'SY', text: 'rotated webhook secret — Slack alerts', t: '1 hr' },
                    ].map((a, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-coral/10 text-[9px] font-bold text-coral">
                          {a.who}
                        </span>
                        <p className="flex-1 truncate text-[11px] text-foreground/70">{a.text}</p>
                        <span className="shrink-0 text-[10px] text-muted-foreground">{a.t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Floating panel: seat usage ── */}
            <div className="absolute -bottom-8 -left-3 hidden w-56 rounded-2xl border border-border bg-card p-4 shadow-2xl shadow-black/40 sm:block lg:-left-10">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Seat usage
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div
                  className="grid h-16 w-16 shrink-0 place-items-center rounded-full"
                  style={{
                    background:
                      'conic-gradient(var(--coral) 0% 69%, var(--cream-deep) 69% 100%)',
                  }}
                >
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-card">
                    <span className="text-sm font-bold text-foreground">69%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">24 / 35 seats</p>
                  <p className="text-[10px] text-muted-foreground">11 seats free</p>
                  <p className="mt-1 text-[10px] font-medium text-coral">Business plan</p>
                </div>
              </div>
            </div>

            {/* ── Floating accent chip: SLA toast ── */}
            <div className="absolute -right-2 -top-4 hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-xl shadow-black/30 sm:flex lg:-right-8">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[11px] font-semibold text-foreground">SLA met</p>
                <p className="text-[10px] text-muted-foreground">99.9% this week</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Social proof bar ── */}
      <section className="border-y border-border bg-cream py-10">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="mb-8 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Trusted by leading African businesses
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {LOGOS.map((logo) => (
              <span
                key={logo}
                className="text-sm font-bold tracking-tight text-muted-foreground transition-colors hover:text-foreground"
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
                <p className="bg-gradient-to-r from-coral to-coral-dark bg-clip-text text-4xl font-bold text-transparent">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="scroll-mt-20 bg-cream py-20">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-coral">
              Everything in one platform
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-foreground">
              Built for modern support teams
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
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
                  className="group border-border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
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
                    <h3 className="mb-2 font-semibold text-foreground">{f.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
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
      <section id="channels" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-coral">
                Meet customers where they are
              </p>
              <h2 className="font-display text-4xl font-bold tracking-tight text-foreground">
                Every channel, one inbox
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Whether customers reach out via email, WhatsApp, your branded
                portal, or a phone call — all conversations land in the same
                unified queue for your team.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  { icon: Mail,         label: 'Email-to-ticket via forwarding rules' },
                  { icon: WhatsAppIcon, label: 'WhatsApp via Twilio or Meta Cloud API' },
                  { icon: Phone,        label: 'Voice calls with automatic note-logging' },
                  { icon: Users,        label: 'Self-service customer portal' },
                ].map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3 text-sm text-foreground/80">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-coral/10 text-coral">
                      <Icon className="h-4 w-4" />
                    </div>
                    {label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-cream p-6 shadow-sm">
              <div className="space-y-3">
                {[
                  { channel: 'Email',     bg: 'bg-coral/10 text-coral',          count: '124 tickets', pct: 48 },
                  { channel: 'Portal',    bg: 'bg-lavender text-navy',           count: '56 tickets',  pct: 22 },
                  { channel: 'WhatsApp',  bg: 'bg-emerald-100 text-emerald-700', count: '41 tickets',  pct: 16 },
                  { channel: 'Voice',     bg: 'bg-navy/10 text-navy',            count: '24 tickets',  pct: 9 },
                ].map((c) => (
                  <div key={c.channel} className="flex items-center gap-3">
                    <span className={cn('w-20 shrink-0 rounded-lg px-2 py-0.5 text-center text-xs font-semibold', c.bg)}>
                      {c.channel}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream-deep">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-coral to-coral-light"
                        style={{ width: `${c.pct}%` }}
                      />
                    </div>
                    <span className="w-16 text-right text-xs text-muted-foreground">{c.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-display text-4xl font-bold tracking-tight text-foreground">
              Loved by support teams
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.author} className="border-border shadow-sm">
                <CardContent className="p-6">
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-coral text-coral" />
                    ))}
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-foreground/70">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.author}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing (hidden pre-launch — see SHOW_PRICING) ── */}
      {SHOW_PRICING && (
      <section id="pricing" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-coral">Transparent pricing</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-foreground">
              Simple plans, powerful features
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
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
                    ? 'border-navy bg-navy text-white shadow-xl shadow-navy/30'
                    : 'border-border bg-card shadow-sm hover:shadow-md',
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-coral px-4 py-1 text-[11px] font-bold text-white shadow-md">
                      Most popular
                    </span>
                  </div>
                )}
                <p className={cn('text-sm font-semibold', plan.highlighted ? 'text-coral-light' : 'text-muted-foreground')}>
                  {plan.name}
                </p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className={cn('text-4xl font-bold', plan.highlighted ? 'text-white' : 'text-foreground')}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={cn('text-sm', plan.highlighted ? 'text-white/50' : 'text-muted-foreground')}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className={cn('mt-2 text-sm', plan.highlighted ? 'text-white/70' : 'text-muted-foreground')}>
                  {plan.description}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2
                        className={cn(
                          'h-4 w-4 shrink-0',
                          plan.highlighted ? 'text-coral-light' : 'text-coral',
                        )}
                      />
                      <span className={plan.highlighted ? 'text-white/90' : 'text-foreground/70'}>
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
                        ? 'bg-coral font-semibold text-white hover:bg-coral-dark'
                        : 'bg-navy text-white shadow-md shadow-navy/20 hover:bg-navy-mid',
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
      )}

      {/* ── Waitlist / notify block ── */}
      <section id="waitlist" className="relative scroll-mt-20 overflow-hidden bg-navy py-24 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-coral/15 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-2xl px-4">
          <h2 className="font-display text-4xl font-bold text-white sm:text-5xl">
            Be the first to know
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/60">
            Topiadesk is launching soon. Leave your email and we&rsquo;ll let you
            know the moment early access opens.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3">
            <WaitlistForm className="mx-auto" />
            <p className="text-xs text-white/40">
              No spam · Unsubscribe anytime
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
            {/* Brand */}
            <div className="max-w-xs">
              <Link href="/" className="flex items-center gap-2.5">
                <Logo size={32} className="shrink-0" />
                <span className="text-lg font-bold tracking-tight text-foreground">
                  Topiadesk
                </span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                The unified helpdesk, monitoring and IT-asset platform built for
                African teams — one tenant, one source of truth.
              </p>
              <div className="mt-6">
                <Button
                  asChild
                  size="sm"
                  className="bg-coral text-white shadow-sm shadow-coral/20 hover:bg-coral-dark"
                >
                  <Link href="#waitlist">
                    Notify me at launch
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Link columns */}
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.heading}>
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground">
                  {col.heading}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-coral"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Tekktopia Ltd. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Powered by{' '}
              <a
                href="https://www.tekktopia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-coral transition-colors hover:text-coral-dark"
              >
                Tekktopia
              </a>
            </p>
            <div className="flex gap-5 text-xs text-muted-foreground">
              {['Privacy', 'Terms', 'Security', 'Status'].map((l) => (
                <Link key={l} href="#" className="transition-colors hover:text-foreground">
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
