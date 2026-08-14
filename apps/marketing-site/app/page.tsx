// app/page.tsx

import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  Clock3,
  Headphones,
  Inbox,
  LayoutDashboard,
  Mail,
  MessageCircle,
  MonitorSmartphone,
  MoreHorizontal,
  PackageCheck,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TicketCheck,
  Users,
  Workflow,
} from 'lucide-react';
import Image from 'next/image';


const TRIAL_URL = '/signup';

const customers = [
  'HEIRESS',
  'TOZO',
  'HELLBESS',
  'cookind',
  'Oxyfresh',
  'DOT & KEY',
  'Skyline',
  'AMAZING LACE',
];

const stats = [
  {
    value: '34.5m',
    label: 'Average resolution time',
  },
  {
    value: '99.9%',
    label: 'SLA compliance',
  },
  {
    value: '2.8B+',
    label: 'Customer interactions',
  },
  {
    value: '4.9/5',
    label: 'Customer satisfaction',
  },
];

const features = [
  {
    icon: Inbox,
    title: 'One intelligent inbox',
    description:
      'Email, WhatsApp, portal requests and voice conversations arrive in one organized workspace.',
    accent: 'bg-[#FFE36D]',
  },
  {
    icon: Workflow,
    title: 'Automate the repetitive',
    description:
      'Route requests, trigger workflows and keep every support process moving without manual follow-up.',
    accent: 'bg-[#E7DEFF]',
  },
  {
    icon: Activity,
    title: 'SLA monitoring',
    description:
      'Watch response and resolution targets in real time before important customer requests fall behind.',
    accent: 'bg-[#DFF4E8]',
  },
  {
    icon: PackageCheck,
    title: 'IT asset management',
    description:
      'Connect incidents to devices, ownership and asset history from the same support platform.',
    accent: 'bg-[#FFD9CB]',
  },
  {
    icon: BarChart3,
    title: 'Clear operational reports',
    description:
      'Understand workload, response quality, team performance and service trends without spreadsheet work.',
    accent: 'bg-[#DDEAFF]',
  },
  {
    icon: ShieldCheck,
    title: 'Built for business',
    description:
      'Role-based access, structured workspaces and controls designed for growing support organizations.',
    accent: 'bg-[#F5E4F1]',
  },
];

const channelRows = [
  {
    icon: Mail,
    channel: 'Email',
    tickets: '124',
    percentage: 78,
    className: 'bg-[#FFE36D]',
  },
  {
    icon: MessageCircle,
    channel: 'WhatsApp',
    tickets: '86',
    percentage: 58,
    className: 'bg-[#DFF4E8]',
  },
  {
    icon: MonitorSmartphone,
    channel: 'Portal',
    tickets: '56',
    percentage: 43,
    className: 'bg-[#E7DEFF]',
  },
  {
    icon: Phone,
    channel: 'Voice',
    tickets: '24',
    percentage: 26,
    className: 'bg-[#FFD9CB]',
  },
];

const testimonials = [
  {
    quote:
      'We finally have one place where the entire support team can see what is happening without switching between tools.',
    author: 'Amaka O.',
    role: 'Head of Customer Experience',
  },
  {
    quote:
      'Topiadesk gives our operations team the visibility we were missing. Escalations are dramatically easier to manage.',
    author: 'David K.',
    role: 'IT Operations Lead',
  },
  {
    quote:
      'The workflow feels simple for agents while still giving management the reporting and controls we need.',
    author: 'Sarah M.',
    role: 'Customer Support Manager',
  },
];

function BrandMark() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <Image
        src="/icons/icon.png"
        alt="Topiadesk"
        width={32}
        height={32}
        priority
        className="h-8 w-8 object-contain"
      />

      <span className="text-[16px] font-bold tracking-[-0.03em] text-[#111111]">
        Topiadesk
      </span>
    </Link>
  );
}

function Navigation() {
  return (
    <header className="relative z-50 border-b border-black/[0.045] bg-[#FCFBF8]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5 sm:px-8">
        <BrandMark />

        <nav className="hidden items-center gap-7 lg:flex">
          <Link
            href="#product"
            className="flex items-center gap-1 text-[13px] font-medium text-black/65 transition hover:text-black"
          >
            Product
            <ChevronDown className="h-3.5 w-3.5" />
          </Link>

          <Link
            href="#channels"
            className="text-[13px] font-medium text-black/65 transition hover:text-black"
          >
            Channels
          </Link>

          <Link
            href="#customers"
            className="text-[13px] font-medium text-black/65 transition hover:text-black"
          >
            Customers
          </Link>

          <Link
            href="#resources"
            className="text-[13px] font-medium text-black/65 transition hover:text-black"
          >
            Resources
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden text-[12px] font-semibold text-black/75 transition hover:text-black sm:block"
          >
            Book a demo
          </Link>

          <Link
            href={TRIAL_URL}
            className="rounded-full bg-[#111111] px-5 py-2.5 text-[12px] font-semibold text-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] transition hover:-translate-y-0.5 hover:bg-black"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

function DashboardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[680px]">
      <div className="relative overflow-hidden rounded-[30px] border border-black/[0.08] bg-[#F2F0EC] p-2 shadow-[0_35px_100px_rgba(37,29,17,0.13)]">
        <div className="overflow-hidden rounded-[24px] border border-black/[0.07] bg-white">
          <div className="flex h-11 items-center justify-between border-b border-black/[0.06] px-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF7965]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FFD968]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#8BD5A8]" />
            </div>

            <div className="flex h-6 w-44 items-center gap-2 rounded-full bg-[#F5F4F1] px-3">
              <Search className="h-3 w-3 text-black/30" />
              <span className="text-[8px] text-black/30">Search tickets...</span>
            </div>

            <MoreHorizontal className="h-4 w-4 text-black/30" />
          </div>

          <div className="flex h-[390px] sm:h-[430px]">
            <aside className="hidden w-[148px] shrink-0 border-r border-black/[0.06] bg-[#FBFAF8] p-3 sm:block">
              <div className="mb-5 flex items-center gap-2 px-1">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-black text-[10px] font-bold text-white">
                  T
                </span>

                <div>
                  <p className="text-[9px] font-bold text-black">Topiadesk</p>
                  <p className="text-[7px] text-black/35">Acme workspace</p>
                </div>
              </div>

              <div className="space-y-1">
                {[
                  {
                    icon: LayoutDashboard,
                    label: 'Overview',
                    active: false,
                  },
                  {
                    icon: Inbox,
                    label: 'Inbox',
                    active: true,
                  },
                  {
                    icon: TicketCheck,
                    label: 'Tickets',
                    active: false,
                  },
                  {
                    icon: Users,
                    label: 'Customers',
                    active: false,
                  },
                  {
                    icon: Activity,
                    label: 'SLA monitor',
                    active: false,
                  },
                  {
                    icon: PackageCheck,
                    label: 'Assets',
                    active: false,
                  },
                ].map(({ icon: Icon, label, active }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2 rounded-lg px-2 py-2 text-[8px] font-medium ${
                      active
                        ? 'bg-black text-white'
                        : 'text-black/45 hover:bg-black/[0.04]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </div>
                ))}
              </div>

              <div className="mt-7 rounded-xl bg-[#FFE36D] p-3">
                <Sparkles className="mb-2 h-4 w-4 text-black/65" />
                <p className="text-[8px] font-bold text-black">
                  Automations are working
                </p>
                <p className="mt-1 text-[7px] leading-relaxed text-black/50">
                  18 tickets routed today
                </p>
              </div>
            </aside>

            <main className="min-w-0 flex-1 bg-white p-4 sm:p-5">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="text-[9px] font-medium text-black/35">
                    Friday, 14 August
                  </p>
                  <h3 className="mt-1 text-[16px] font-bold tracking-[-0.04em] text-black">
                    Good afternoon, Ada
                  </h3>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label="Notifications"
                    className="grid h-8 w-8 place-items-center rounded-full border border-black/[0.08] bg-white"
                  >
                    <Bell className="h-3.5 w-3.5 text-black/50" />
                  </button>

                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#E7DEFF] text-[9px] font-bold">
                    AO
                  </span>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-3 gap-2">
                {[
                  {
                    label: 'Open tickets',
                    value: '248',
                    delta: '+12%',
                  },
                  {
                    label: 'Avg. response',
                    value: '4.8m',
                    delta: '-18%',
                  },
                  {
                    label: 'SLA met',
                    value: '99.9%',
                    delta: '+2.1%',
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-black/[0.06] bg-[#FBFAF8] p-3"
                  >
                    <p className="truncate text-[7px] font-medium text-black/35">
                      {item.label}
                    </p>
                    <div className="mt-2 flex flex-wrap items-end justify-between gap-1">
                      <p className="text-[15px] font-bold tracking-[-0.04em] text-black">
                        {item.value}
                      </p>

                      <span className="rounded-full bg-[#DFF4E8] px-1.5 py-0.5 text-[6px] font-bold text-[#36794F]">
                        {item.delta}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 lg:grid-cols-[1.15fr_.85fr]">
                <div className="rounded-2xl border border-black/[0.06] p-3.5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold text-black">
                        Ticket volume
                      </p>
                      <p className="text-[7px] text-black/35">
                        Last 7 days
                      </p>
                    </div>

                    <BarChart3 className="h-3.5 w-3.5 text-black/30" />
                  </div>

                  <div className="flex h-[108px] items-end gap-2">
                    {[36, 58, 44, 72, 53, 84, 68].map((height, index) => (
                      <div
                        key={`${height}-${index}`}
                        className="flex flex-1 flex-col justify-end"
                      >
                        <div
                          className={`rounded-t-md ${
                            index === 5 ? 'bg-[#111111]' : 'bg-[#E7DEFF]'
                          }`}
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 grid grid-cols-7 text-center text-[6px] text-black/30">
                    <span>M</span>
                    <span>T</span>
                    <span>W</span>
                    <span>T</span>
                    <span>F</span>
                    <span>S</span>
                    <span>S</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-black/[0.06] p-3.5">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold text-black">
                        Priority inbox
                      </p>
                      <p className="text-[7px] text-black/35">
                        Needs attention
                      </p>
                    </div>

                    <span className="rounded-full bg-[#FFD9CB] px-2 py-1 text-[6px] font-bold text-[#A6452F]">
                      4 urgent
                    </span>
                  </div>

                  <div className="space-y-2">
                    {[
                      {
                        initials: 'AK',
                        subject: 'Cannot access account',
                        channel: 'Email',
                        time: '2m',
                        bg: 'bg-[#FFE36D]',
                      },
                      {
                        initials: 'MO',
                        subject: 'Payment verification',
                        channel: 'WhatsApp',
                        time: '7m',
                        bg: 'bg-[#DFF4E8]',
                      },
                      {
                        initials: 'TN',
                        subject: 'Laptop replacement',
                        channel: 'Portal',
                        time: '14m',
                        bg: 'bg-[#E7DEFF]',
                      },
                    ].map((ticket) => (
                      <div
                        key={ticket.subject}
                        className="flex items-center gap-2 rounded-xl bg-[#FBFAF8] p-2"
                      >
                        <span
                          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${ticket.bg} text-[7px] font-bold`}
                        >
                          {ticket.initials}
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[7.5px] font-bold text-black/75">
                            {ticket.subject}
                          </p>
                          <p className="text-[6px] text-black/30">
                            {ticket.channel}
                          </p>
                        </div>

                        <span className="text-[6px] text-black/30">
                          {ticket.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 hidden rounded-2xl border border-black/[0.06] p-3 sm:block">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[8px] font-bold text-black">
                    Recent activity
                  </p>
                  <span className="text-[7px] font-medium text-black/35">
                    View all
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    'Ticket #2481 resolved',
                    'SLA policy updated',
                    'New agent invited',
                  ].map((activity, index) => (
                    <div
                      key={activity}
                      className="flex items-center gap-2 rounded-lg bg-[#FBFAF8] px-2 py-2"
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          index === 0
                            ? 'bg-[#8BD5A8]'
                            : index === 1
                              ? 'bg-[#FFE36D]'
                              : 'bg-[#C9B8FF]'
                        }`}
                      />
                      <p className="truncate text-[6.5px] text-black/45">
                        {activity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FCFBF8] pb-20 pt-16 sm:pb-28 sm:pt-20 lg:pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[450px] h-[420px] w-[720px] -translate-x-1/2 rounded-[50%] bg-[#E7DEFF]/70 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-[1180px] px-5 sm:px-8">
        <div className="mx-auto max-w-[790px] text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/[0.07] bg-white px-3 py-1.5 shadow-sm">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#FFE36D]">
              <Sparkles className="h-3 w-3" />
            </span>
            <span className="text-[11px] font-semibold text-black/65">
              Support operations, simplified
            </span>
          </div>

          <h1 className="text-balance text-[44px] font-semibold leading-[0.98] tracking-[-0.065em] text-[#111111] sm:text-[62px] lg:text-[72px]">
            Meet the super-fast
            <br />
            customer support platform
          </h1>

          <p className="mx-auto mt-6 max-w-[620px] text-balance text-[14px] leading-6 text-black/48 sm:text-[15px]">
            Helpdesk, WhatsApp, SLA monitoring and IT assets in one beautifully
            simple workspace built for modern African teams.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={TRIAL_URL}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#111111] px-6 text-[12px] font-semibold text-white shadow-[0_8px_25px_rgba(0,0,0,0.14)] transition hover:-translate-y-0.5 hover:bg-black"
            >
              Get started — for free
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full border border-black/20 bg-white px-6 text-[12px] font-semibold text-[#111111] transition hover:bg-black/[0.03]"
            >
              Book a demo
            </Link>
          </div>

          <p className="mt-3 text-[10px] font-medium text-black/30">
            14-day free trial · No credit card required
          </p>
        </div>

        <div className="relative mx-auto mt-14 max-w-[1040px] lg:mt-16">
          <div className="pointer-events-none absolute left-1/2 top-[55%] h-[380px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-t-full bg-[#E7DEFF]/85" />

          <div className="absolute left-0 top-5 z-20 hidden w-[184px] rounded-[16px] border border-black/[0.07] bg-[#FFE36D] p-4 shadow-[0_15px_40px_rgba(0,0,0,0.09)] lg:block">
            <Clock3 className="h-5 w-5 stroke-[1.7]" />
            <p className="mt-4 text-[25px] font-semibold tracking-[-0.06em] text-black">
              34.5 Min
            </p>
            <p className="mt-1 text-[8px] font-semibold text-black/55">
              Average resolution time
            </p>
          </div>

          <div className="absolute right-0 top-0 z-20 hidden w-[168px] rounded-[16px] border border-black/[0.07] bg-white p-3 shadow-[0_15px_40px_rgba(0,0,0,0.08)] lg:block">
            <div className="grid h-[92px] place-items-center rounded-[12px] bg-[#E7DEFF]">
              <Headphones className="h-11 w-11 stroke-[1.2] text-black/75" />
            </div>

            <p className="mt-3 text-[9px] font-semibold text-black">
              Priority ticket
            </p>
            <p className="mt-0.5 text-[8px] text-black/40">
              Enterprise customer
            </p>
          </div>

          <div className="absolute bottom-16 left-2 z-20 hidden w-[190px] items-center gap-3 rounded-[16px] border border-black/[0.07] bg-white p-3 shadow-[0_15px_40px_rgba(0,0,0,0.09)] lg:flex">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-[#F3F1ED]">
              <CircleUserRound className="h-6 w-6 text-black/65" />
            </span>

            <div className="min-w-0">
              <p className="text-[8px] font-semibold leading-3 text-black/60">
                Customer replied on WhatsApp
              </p>
              <span className="mt-1.5 inline-flex rounded-full bg-black px-2 py-1 text-[6px] font-bold text-white">
                View ticket
              </span>
            </div>
          </div>

          <div className="absolute bottom-5 right-5 z-20 hidden w-[154px] rounded-[16px] border border-black/[0.06] bg-[#FF7C58] p-4 shadow-[0_15px_40px_rgba(0,0,0,0.09)] lg:block">
            <CheckCircle2 className="h-5 w-5 text-black/80" />
            <p className="mt-4 text-[22px] font-semibold tracking-[-0.05em] text-black">
              99.9%
            </p>
            <p className="mt-0.5 text-[8px] font-semibold text-black/60">
              SLA compliance
            </p>
          </div>

          <div className="relative z-10 mx-auto max-w-[690px] px-0 lg:px-5">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function CustomerStrip() {
  return (
    <section
      id="customers"
      className="border-y border-black/[0.06] bg-[#FCFBF8]"
    >
      <div className="mx-auto max-w-[1180px] px-5 py-8 sm:px-8">
        <p className="mb-6 text-center text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
          Trusted by ambitious teams
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:gap-x-12">
          {customers.map((customer, index) => (
            <span
              key={customer}
              className={`font-semibold tracking-[-0.04em] text-black/55 ${
                index % 3 === 0
                  ? 'font-serif text-[16px] italic'
                  : index % 2 === 0
                    ? 'text-[13px]'
                    : 'text-[15px]'
              }`}
            >
              {customer}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center ${
                index !== 0 ? 'sm:border-l sm:border-black/[0.07]' : ''
              }`}
            >
              <p className="text-[36px] font-semibold tracking-[-0.065em] text-[#111111] sm:text-[42px]">
                {stat.value}
              </p>
              <p className="mt-1 text-[11px] font-medium text-black/38">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section
      id="product"
      className="bg-[#F5F3EF] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
        <div className="mx-auto max-w-[650px] text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/35">
            One platform
          </p>

          <h2 className="mt-4 text-balance text-[38px] font-semibold leading-[1.02] tracking-[-0.055em] text-[#111111] sm:text-[50px]">
            The support stack your team actually wants to use
          </h2>

          <p className="mx-auto mt-5 max-w-[520px] text-[14px] leading-6 text-black/45">
            Everything your agents need, with none of the clutter that makes
            enterprise helpdesk software painful.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description, accent }) => (
            <article
              key={title}
              className="group rounded-[24px] border border-black/[0.065] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.07)]"
            >
              <div
                className={`grid h-11 w-11 place-items-center rounded-[14px] ${accent}`}
              >
                <Icon className="h-5 w-5 stroke-[1.7] text-black/75" />
              </div>

              <h3 className="mt-8 text-[17px] font-semibold tracking-[-0.035em] text-black">
                {title}
              </h3>

              <p className="mt-2 text-[12px] leading-5 text-black/42">
                {description}
              </p>

              <div className="mt-6 flex items-center gap-1.5 text-[10px] font-bold text-black/60">
                Learn more
                <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Channels() {
  return (
    <section id="channels" className="bg-white py-24 sm:py-28">
      <div className="mx-auto grid max-w-[1120px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
        <div className="max-w-[480px]">
          <span className="inline-flex rounded-full bg-[#E7DEFF] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-black/55">
            Omnichannel
          </span>

          <h2 className="mt-5 text-[40px] font-semibold leading-[1.02] tracking-[-0.055em] text-[#111111] sm:text-[50px]">
            Every conversation.
            <br />
            One calm inbox.
          </h2>

          <p className="mt-5 max-w-[440px] text-[14px] leading-6 text-black/45">
            Customers can contact you however they prefer. Your team still gets
            one queue, one customer history and one source of truth.
          </p>

          <div className="mt-8 space-y-3">
            {[
              'Shared customer context across every channel',
              'Automatic routing and prioritization',
              'Unified SLA tracking',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-[12px] font-medium text-black/65"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#DFF4E8]">
                  <Check className="h-3.5 w-3.5 text-[#39734D]" />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[30px] bg-[#F5F3EF] p-3">
            <div className="rounded-[24px] border border-black/[0.07] bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-7">
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-black">
                    Conversations by channel
                  </p>
                  <p className="mt-1 text-[9px] text-black/35">
                    This week
                  </p>
                </div>

                <span className="rounded-full border border-black/[0.08] px-3 py-1.5 text-[8px] font-semibold text-black/45">
                  290 total
                </span>
              </div>

              <div className="space-y-5">
                {channelRows.map(
                  ({
                    icon: Icon,
                    channel,
                    tickets,
                    percentage,
                    className,
                  }) => (
                    <div key={channel}>
                      <div className="mb-2 flex items-center gap-3">
                        <span
                          className={`grid h-8 w-8 place-items-center rounded-[10px] ${className}`}
                        >
                          <Icon className="h-3.5 w-3.5 text-black/70" />
                        </span>

                        <span className="flex-1 text-[11px] font-semibold text-black/65">
                          {channel}
                        </span>

                        <span className="text-[9px] font-medium text-black/35">
                          {tickets} tickets
                        </span>
                      </div>

                      <div className="ml-11 h-1.5 overflow-hidden rounded-full bg-[#F0EEEA]">
                        <div
                          className="h-full rounded-full bg-[#111111]"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>

              <div className="mt-8 grid grid-cols-3 gap-2">
                {[
                  ['4.8m', 'First reply'],
                  ['34.5m', 'Resolution'],
                  ['96%', 'CSAT'],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-[14px] bg-[#F8F7F4] px-3 py-4 text-center"
                  >
                    <p className="text-[17px] font-semibold tracking-[-0.04em]">
                      {value}
                    </p>
                    <p className="mt-1 text-[7px] font-medium text-black/35">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute -bottom-5 -left-5 hidden items-center gap-3 rounded-[15px] border border-black/[0.07] bg-[#FFE36D] p-3 shadow-[0_15px_40px_rgba(0,0,0,0.08)] sm:flex">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white/70">
              <MessageCircle className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[8px] font-bold">WhatsApp connected</p>
              <p className="mt-0.5 text-[7px] text-black/45">
                Messages syncing live
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section
      id="resources"
      className="bg-[#F5F3EF] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/35">
            Customer stories
          </p>

          <h2 className="mt-4 text-[38px] font-semibold tracking-[-0.055em] text-black sm:text-[48px]">
            Support teams move faster with Topiadesk
          </h2>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.author}
              className="rounded-[24px] border border-black/[0.065] bg-white p-6"
            >
              <div
                className={`mb-7 flex h-10 w-10 items-center justify-center rounded-full ${
                  index === 0
                    ? 'bg-[#FFE36D]'
                    : index === 1
                      ? 'bg-[#E7DEFF]'
                      : 'bg-[#DFF4E8]'
                }`}
              >
                <span className="text-[10px] font-black">
                  {testimonial.author
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </span>
              </div>

              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    className="h-3.5 w-3.5 fill-black text-black"
                  />
                ))}
              </div>

              <blockquote className="mt-5 text-[14px] leading-6 tracking-[-0.01em] text-black/65">
                “{testimonial.quote}”
              </blockquote>

              <div className="mt-8 border-t border-black/[0.06] pt-4">
                <p className="text-[11px] font-bold text-black">
                  {testimonial.author}
                </p>
                <p className="mt-1 text-[9px] text-black/35">
                  {testimonial.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-white px-5 py-20 sm:px-8 sm:py-24">
      <div className="relative mx-auto max-w-[1120px] overflow-hidden rounded-[32px] bg-[#111111] px-6 py-16 text-center sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute -left-20 -top-28 h-72 w-72 rounded-full bg-[#E7DEFF]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-10 h-80 w-80 rounded-full bg-[#FFE36D]/15 blur-3xl" />

        <div className="relative mx-auto max-w-[660px]">
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white/60">
            Start today
          </span>

          <h2 className="mt-5 text-balance text-[40px] font-semibold leading-[1.02] tracking-[-0.055em] text-white sm:text-[54px]">
            Make customer support feel effortless.
          </h2>

          <p className="mx-auto mt-5 max-w-[510px] text-[13px] leading-6 text-white/48">
            Create your workspace in minutes and give your team one beautiful
            place to manage every customer conversation.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={TRIAL_URL}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[11px] font-bold text-black transition hover:-translate-y-0.5"
            >
              Start free trial
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-[11px] font-bold text-white transition hover:bg-white/10"
            >
              Book a demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-black/[0.06] bg-[#FCFBF8]">
      <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-[290px]">
            <BrandMark />
            <p className="mt-4 text-[11px] leading-5 text-black/38">
              Unified customer support, monitoring and IT operations for modern
              teams.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-14 gap-y-8 sm:grid-cols-3">
            {[
              {
                heading: 'Product',
                links: ['Helpdesk', 'WhatsApp', 'SLA', 'Assets'],
              },
              {
                heading: 'Company',
                links: ['About', 'Customers', 'Contact', 'Security'],
              },
              {
                heading: 'Legal',
                links: ['Privacy', 'Terms', 'Status'],
              },
            ].map((column) => (
              <div key={column.heading}>
                <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.13em] text-black/45">
                  {column.heading}
                </p>

                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-[10px] font-medium text-black/35 transition hover:text-black"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-black/[0.06] pt-6 text-[9px] text-black/30 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} Tekktopia Ltd. All rights reserved.
          </span>

          <span>Built for support teams that care about the experience.</span>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#111111]">
      <Navigation />
      <main>
        <Hero />
        <CustomerStrip />
        <Stats />
        <Features />
        <Channels />
        <Testimonials />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}