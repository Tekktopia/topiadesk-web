// apps/marketing-site/app/page.tsx

'use client';

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
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { ReactLenis } from 'lenis/react';
import { useState, type ReactNode } from 'react';

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

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_IN = [0.4, 0, 1, 1] as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  amount?: number;
  x?: number;
  y?: number;
  scale?: number;
};

function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.62,
  amount = 0.22,
  x = 0,
  y = 24,
  scale = 0.985,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount }}
      variants={{
        hidden: {
          opacity: 0,
          x,
          y,
          scale,
          transition: {
            duration: 0.32,
            ease: EASE_IN,
          },
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          transition: {
            delay,
            duration,
            ease: EASE_OUT,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

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

      <span className="text-[16px] font-bold tracking-[-0.03em] text-[#111111]">Topiadesk</span>
    </Link>
  );
}

function Navigation() {
  return (
    <motion.header
      className="relative z-50 border-b border-black/[0.045] bg-[#FCFBF8]/95"
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE_OUT }}
    >
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
    </motion.header>
  );
}

type DashboardView =
  | 'overview'
  | 'inbox'
  | 'tickets'
  | 'customers'
  | 'sla'
  | 'assets';

const DASHBOARD_NAV_ITEMS: Array<{
  id: DashboardView;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'tickets', label: 'Tickets', icon: TicketCheck },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'sla', label: 'SLA monitor', icon: Activity },
  { id: 'assets', label: 'Assets', icon: PackageCheck },
];

const DASHBOARD_VIEW_META: Record<
  DashboardView,
  { eyebrow: string; title: string }
> = {
  overview: {
    eyebrow: 'Friday, 14 August',
    title: 'Good afternoon, Ada',
  },
  inbox: {
    eyebrow: 'Unified workspace',
    title: 'Inbox',
  },
  tickets: {
    eyebrow: '248 open requests',
    title: 'Tickets',
  },
  customers: {
    eyebrow: 'Customer directory',
    title: 'Customers',
  },
  sla: {
    eyebrow: 'Service performance',
    title: 'SLA monitor',
  },
  assets: {
    eyebrow: 'IT inventory',
    title: 'Assets',
  },
};

const DASHBOARD_SEARCH_ITEMS: Array<{
  label: string;
  meta: string;
  view: DashboardView;
}> = [
  { label: 'Cannot access account', meta: 'Ticket #2481', view: 'tickets' },
  { label: 'Payment verification', meta: 'Ticket #2478', view: 'tickets' },
  { label: 'Laptop replacement', meta: 'Ticket #2472', view: 'tickets' },
  { label: 'Ada Obi', meta: 'Customer', view: 'customers' },
  { label: 'Musa Okafor', meta: 'Customer', view: 'customers' },
  { label: 'MacBook Pro — TD-1482', meta: 'Asset', view: 'assets' },
  { label: 'ThinkPad X1 — TD-1491', meta: 'Asset', view: 'assets' },
];

const DASHBOARD_TICKETS = [
  {
    id: '2481',
    initials: 'AK',
    subject: 'Cannot access account',
    channel: 'Email',
    time: '2m',
    status: 'Urgent',
    bg: 'bg-[#FFE36D]',
  },
  {
    id: '2478',
    initials: 'MO',
    subject: 'Payment verification',
    channel: 'WhatsApp',
    time: '7m',
    status: 'Open',
    bg: 'bg-[#DFF4E8]',
  },
  {
    id: '2472',
    initials: 'TN',
    subject: 'Laptop replacement',
    channel: 'Portal',
    time: '14m',
    status: 'Pending',
    bg: 'bg-[#E7DEFF]',
  },
  {
    id: '2469',
    initials: 'AA',
    subject: 'Update billing contact',
    channel: 'Email',
    time: '22m',
    status: 'Open',
    bg: 'bg-[#FFD9CB]',
  },
];

function DashboardStat({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta: string;
}) {
  return (
    <div className="rounded-xl border border-black/[0.06] bg-[#FBFAF8] p-3">
      <p className="truncate text-[7px] font-medium text-black/35">{label}</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-1">
        <p className="text-[15px] font-bold tracking-[-0.04em] text-black">
          {value}
        </p>
        <span className="rounded-full bg-[#DFF4E8] px-1.5 py-0.5 text-[6px] font-bold text-[#36794F]">
          {delta}
        </span>
      </div>
    </div>
  );
}

function OverviewDashboardPanel() {
  return (
    <div>
      <div className="mb-4 grid grid-cols-3 gap-2">
        <DashboardStat label="Open tickets" value="248" delta="+12%" />
        <DashboardStat label="Avg. response" value="4.8m" delta="-18%" />
        <DashboardStat label="SLA met" value="99.9%" delta="+2.1%" />
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-2xl border border-black/[0.06] p-3.5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold text-black">Ticket volume</p>
              <p className="text-[7px] text-black/35">Last 7 days</p>
            </div>
            <BarChart3 className="h-3.5 w-3.5 text-black/30" />
          </div>

          <div className="flex h-[108px] items-end gap-2">
            {[36, 58, 44, 72, 53, 84, 68].map((height, index) => (
              <div
                key={`${height}-${index}`}
                className="flex flex-1 flex-col justify-end"
              >
                <motion.div
                  className={`rounded-t-md ${
                    index === 5 ? 'bg-[#111111]' : 'bg-[#E7DEFF]'
                  }`}
                  initial={{ scaleY: 0.25, opacity: 0.55 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{
                    delay: index * 0.025,
                    duration: 0.34,
                    ease: EASE_OUT,
                  }}
                  style={{
                    height: `${height}%`,
                    transformOrigin: 'bottom',
                  }}
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
              <p className="text-[9px] font-bold text-black">Priority inbox</p>
              <p className="text-[7px] text-black/35">Needs attention</p>
            </div>
            <span className="rounded-full bg-[#FFD9CB] px-2 py-1 text-[6px] font-bold text-[#A6452F]">
              4 urgent
            </span>
          </div>

          <div className="space-y-2">
            {DASHBOARD_TICKETS.slice(0, 3).map((ticket) => (
              <div
                key={ticket.id}
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
                  <p className="text-[6px] text-black/30">{ticket.channel}</p>
                </div>
                <span className="text-[6px] text-black/30">{ticket.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 hidden rounded-2xl border border-black/[0.06] p-3 sm:block">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[8px] font-bold text-black">Recent activity</p>
          <span className="text-[7px] font-medium text-black/35">View all</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {['Ticket #2481 resolved', 'SLA policy updated', 'New agent invited'].map(
            (activity, index) => (
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
                <p className="truncate text-[6.5px] text-black/45">{activity}</p>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function InboxDashboardPanel({
  selectedTicketId,
  onSelectTicket,
}: {
  selectedTicketId: string;
  onSelectTicket: (ticketId: string) => void;
}) {
  const selectedTicket =
    DASHBOARD_TICKETS.find((ticket) => ticket.id === selectedTicketId) ??
    DASHBOARD_TICKETS[0];

  if (!selectedTicket) {
    return (
      <div className="grid min-h-[270px] place-items-center rounded-2xl border border-black/[0.06] bg-[#FBFAF8]">
        <div className="text-center">
          <p className="text-[9px] font-bold text-black/60">
            No conversations available
          </p>
          <p className="mt-1 text-[7px] text-black/30">
            New conversations will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-[270px] gap-3 lg:grid-cols-[0.88fr_1.12fr]">
      <div className="rounded-2xl border border-black/[0.06] p-2">
        <div className="mb-2 px-2 pt-1">
          <p className="text-[8px] font-bold text-black">
            Recent conversations
          </p>

          <p className="mt-0.5 text-[6.5px] text-black/35">
            12 unread
          </p>
        </div>

        <div className="space-y-1.5">
          {DASHBOARD_TICKETS.slice(0, 3).map((ticket) => {
            const active = selectedTicket.id === ticket.id;

            return (
              <button
                key={ticket.id}
                type="button"
                onClick={() => onSelectTicket(ticket.id)}
                className={`flex w-full items-center gap-2 rounded-xl p-2 text-left transition-colors ${
                  active ? 'bg-[#F0ECE6]' : 'hover:bg-[#FBFAF8]'
                }`}
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${ticket.bg} text-[7px] font-bold`}
                >
                  {ticket.initials}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[7.5px] font-bold text-black/75">
                    {ticket.subject}
                  </span>

                  <span className="mt-0.5 block text-[6px] text-black/30">
                    {ticket.channel} · {ticket.time}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-black/[0.06] bg-[#FBFAF8] p-3.5">
        <div className="flex items-center justify-between border-b border-black/[0.05] pb-3">
          <div>
            <p className="text-[9px] font-bold text-black">
              {selectedTicket.subject}
            </p>

            <p className="mt-0.5 text-[6.5px] text-black/35">
              Ticket #{selectedTicket.id} · {selectedTicket.channel}
            </p>
          </div>

          <span className="rounded-full bg-[#FFE9E2] px-2 py-1 text-[6px] font-bold text-[#9A4B3A]">
            {selectedTicket.status}
          </span>
        </div>

        <div className="mt-3 space-y-2.5">
          <div className="max-w-[88%] rounded-xl rounded-tl-sm bg-white p-2.5">
            <p className="text-[7px] leading-3.5 text-black/55">
              Hi, I&rsquo;m having trouble with this request and need some help
              getting it resolved today.
            </p>
          </div>

          <div className="ml-auto max-w-[88%] rounded-xl rounded-tr-sm bg-[#E7DEFF] p-2.5">
            <p className="text-[7px] leading-3.5 text-black/60">
              I can help with that. I&rsquo;ve checked your account and
              I&rsquo;m reviewing the issue now.
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-xl border border-black/[0.06] bg-white px-3 py-2">
          <span className="flex-1 text-[7px] text-black/25">
            Write a reply...
          </span>

          <span className="rounded-full bg-black px-2 py-1 text-[6px] font-bold text-white">
            Send
          </span>
        </div>
      </div>
    </div>
  );
}

function TicketsDashboardPanel() {
  return (
    <div className="rounded-2xl border border-black/[0.06]">
      <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-black/[0.05] px-3 py-2.5 text-[6.5px] font-bold uppercase tracking-[0.08em] text-black/30">
        <span>Request</span>
        <span>Status</span>
        <span>Age</span>
      </div>

      <div className="divide-y divide-black/[0.045]">
        {DASHBOARD_TICKETS.map((ticket) => (
          <div
            key={ticket.id}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-3 py-3"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${ticket.bg} text-[7px] font-bold`}
              >
                {ticket.initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[8px] font-bold text-black/70">
                  {ticket.subject}
                </p>
                <p className="mt-0.5 text-[6px] text-black/30">
                  #{ticket.id} · {ticket.channel}
                </p>
              </div>
            </div>

            <span
              className={`rounded-full px-2 py-1 text-[6px] font-bold ${
                ticket.status === 'Urgent'
                  ? 'bg-[#FFE3DB] text-[#9A4B3A]'
                  : ticket.status === 'Pending'
                    ? 'bg-[#FFF3C7] text-[#80691A]'
                    : 'bg-[#DFF4E8] text-[#36794F]'
              }`}
            >
              {ticket.status}
            </span>

            <span className="w-6 text-right text-[6.5px] text-black/30">
              {ticket.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomersDashboardPanel() {
  const customersList = [
    ['AO', 'Ada Obi', 'ada@company.com', '24 tickets', 'bg-[#E7DEFF]'],
    ['MO', 'Musa Okafor', 'musa@acme.com', '17 tickets', 'bg-[#DFF4E8]'],
    ['TN', 'Teni Nwosu', 'teni@northstar.io', '11 tickets', 'bg-[#FFE36D]'],
    ['AA', 'Ayo Adeleke', 'ayo@atlas.co', '8 tickets', 'bg-[#FFD9CB]'],
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {customersList.map(([initials, name, email, ticketCount, bg]) => (
        <div
          key={email}
          className="rounded-2xl border border-black/[0.06] bg-[#FBFAF8] p-3"
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${bg} text-[8px] font-bold`}
            >
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[8.5px] font-bold text-black/70">{name}</p>
              <p className="mt-0.5 truncate text-[6.5px] text-black/30">{email}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-black/[0.05] pt-2.5">
            <span className="text-[6.5px] text-black/35">{ticketCount}</span>
            <span className="flex items-center gap-1 text-[6.5px] font-bold text-black/55">
              <Star className="h-2.5 w-2.5 fill-black text-black" />
              4.9
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function SlaDashboardPanel() {
  const policies = [
    { label: 'Priority response', value: '99.9%', progress: 99, tone: 'bg-[#111111]' },
    { label: 'Standard resolution', value: '97.2%', progress: 97, tone: 'bg-[#8BD5A8]' },
    { label: 'VIP customers', value: '94.8%', progress: 95, tone: 'bg-[#C9B8FF]' },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-[0.72fr_1.28fr]">
      <div className="rounded-2xl bg-[#111111] p-4 text-white">
        <Activity className="h-5 w-5 text-white/65" />
        <p className="mt-6 text-[28px] font-semibold tracking-[-0.06em]">99.9%</p>
        <p className="mt-1 text-[7px] font-medium text-white/45">SLA compliance</p>
        <div className="mt-5 rounded-xl bg-white/10 p-2.5">
          <p className="text-[7px] font-semibold text-white/65">2 at risk</p>
          <p className="mt-0.5 text-[6px] text-white/35">Across 248 open tickets</p>
        </div>
      </div>

      <div className="rounded-2xl border border-black/[0.06] p-3.5">
        <p className="text-[9px] font-bold text-black">Policies</p>
        <p className="mt-0.5 text-[6.5px] text-black/35">Performance this week</p>

        <div className="mt-4 space-y-4">
          {policies.map((policy) => (
            <div key={policy.label}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[7.5px] font-semibold text-black/55">
                  {policy.label}
                </span>
                <span className="text-[7px] font-bold text-black/65">{policy.value}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#F0EEEA]">
                <motion.div
                  className={`h-full rounded-full ${policy.tone}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.42, ease: EASE_OUT }}
                  style={{
                    width: `${policy.progress}%`,
                    transformOrigin: 'left',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AssetsDashboardPanel() {
  const assets = [
    ['MacBook Pro 14"', 'TD-1482', 'Ada Obi', 'Healthy', 'bg-[#DFF4E8]'],
    ['ThinkPad X1', 'TD-1491', 'Musa Okafor', 'Healthy', 'bg-[#DFF4E8]'],
    ['Dell Latitude 7440', 'TD-1407', 'Teni Nwosu', 'Review', 'bg-[#FFF3C7]'],
    ['iPhone 15', 'TD-1398', 'Ayo Adeleke', 'Healthy', 'bg-[#DFF4E8]'],
  ];

  return (
    <div className="rounded-2xl border border-black/[0.06]">
      <div className="flex items-center justify-between border-b border-black/[0.05] px-3 py-2.5">
        <div>
          <p className="text-[8px] font-bold text-black">Assigned devices</p>
          <p className="mt-0.5 text-[6px] text-black/30">1,284 assets tracked</p>
        </div>
        <span className="rounded-full bg-[#F5F3EF] px-2 py-1 text-[6px] font-bold text-black/40">
          Inventory
        </span>
      </div>

      <div className="divide-y divide-black/[0.045]">
        {assets.map(([name, assetId, owner, health, bg]) => (
          <div
            key={assetId}
            className="grid grid-cols-[1fr_auto] items-center gap-3 px-3 py-3"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#F5F3EF]">
                <MonitorSmartphone className="h-3.5 w-3.5 text-black/45" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[8px] font-bold text-black/70">{name}</p>
                <p className="mt-0.5 text-[6px] text-black/30">
                  {assetId} · {owner}
                </p>
              </div>
            </div>

            <span className={`rounded-full px-2 py-1 text-[6px] font-bold ${bg} text-black/55`}>
              {health}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardMockup() {
  const [activeView, setActiveView] = useState<DashboardView>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState('2481');

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const searchResults = normalizedQuery
    ? DASHBOARD_SEARCH_ITEMS.filter((item) =>
        `${item.label} ${item.meta}`.toLowerCase().includes(normalizedQuery),
      ).slice(0, 5)
    : [];

  const activeMeta = DASHBOARD_VIEW_META[activeView];

  function selectSearchResult(view: DashboardView) {
    setActiveView(view);
    setSearchQuery('');
  }

  function renderActivePanel() {
    switch (activeView) {
      case 'inbox':
        return (
          <InboxDashboardPanel
            selectedTicketId={selectedTicketId}
            onSelectTicket={setSelectedTicketId}
          />
        );
      case 'tickets':
        return <TicketsDashboardPanel />;
      case 'customers':
        return <CustomersDashboardPanel />;
      case 'sla':
        return <SlaDashboardPanel />;
      case 'assets':
        return <AssetsDashboardPanel />;
      case 'overview':
      default:
        return <OverviewDashboardPanel />;
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-[680px]">
      <div className="relative overflow-hidden rounded-[30px] border border-black/[0.08] bg-[#F2F0EC] p-2 shadow-[0_16px_45px_rgba(37,29,17,0.06)]">
        <div className="overflow-hidden rounded-[24px] border border-black/[0.07] bg-white">
          <div className="relative z-30 flex h-11 items-center justify-between border-b border-black/[0.06] px-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF7965]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FFD968]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#8BD5A8]" />
            </div>

            <div className="relative">
              <label className="flex h-6 w-44 items-center gap-2 rounded-full bg-[#F5F4F1] px-3 transition-colors focus-within:bg-[#EFEEE9]">
                <Search className="h-3 w-3 shrink-0 text-black/30" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && searchResults[0]) {
                      selectSearchResult(searchResults[0].view);
                    }
                  }}
                  placeholder="Search tickets..."
                  aria-label="Search dashboard"
                  className="min-w-0 flex-1 bg-transparent text-[8px] text-black/60 outline-none placeholder:text-black/30"
                />
              </label>

              {normalizedQuery ? (
                <div className="absolute left-1/2 top-8 z-50 w-56 -translate-x-1/2 overflow-hidden rounded-xl border border-black/[0.08] bg-white p-1.5">
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <button
                        key={`${result.view}-${result.label}`}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => selectSearchResult(result.view)}
                        className="flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-[#F5F3EF]"
                      >
                        <span className="truncate text-[7.5px] font-semibold text-black/65">
                          {result.label}
                        </span>
                        <span className="shrink-0 text-[6px] text-black/30">
                          {result.meta}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="px-2.5 py-3 text-center text-[7px] text-black/35">
                      No matching tickets, customers or assets.
                    </p>
                  )}
                </div>
              ) : null}
            </div>

            <button
              type="button"
              aria-label="More dashboard options"
              className="grid h-7 w-7 place-items-center rounded-full transition-colors hover:bg-black/[0.04]"
            >
              <MoreHorizontal className="h-4 w-4 text-black/30" />
            </button>
          </div>

          <div className="flex h-[390px] sm:h-[430px]">
            <aside className="hidden w-[148px] shrink-0 border-r border-black/[0.06] bg-[#FBFAF8] p-3 sm:block">
              <div className="mb-5 flex items-center gap-2 px-1">
                <Image
                  src="/icons/icon.png"
                  alt="Topiadesk"
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                />

                <div>
                  <p className="text-[9px] font-bold text-black">Topiadesk</p>
                  <p className="text-[7px] text-black/35">Acme workspace</p>
                </div>
              </div>

              <nav className="space-y-1" aria-label="Dashboard sections">
                {DASHBOARD_NAV_ITEMS.map(({ id, icon: Icon, label }) => {
                  const active = activeView === id;

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActiveView(id)}
                      aria-pressed={active}
                      className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[8px] font-medium transition-colors ${
                        active
                          ? 'bg-black text-white'
                          : 'text-black/45 hover:bg-black/[0.04] hover:text-black/65'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-7 rounded-xl bg-[#FFE36D] p-3">
                <Sparkles className="mb-2 h-4 w-4 text-black/65" />
                <p className="text-[8px] font-bold text-black">Automations are working</p>
                <p className="mt-1 text-[7px] leading-relaxed text-black/50">
                  18 tickets routed today
                </p>
              </div>
            </aside>

            <main className="flex min-w-0 flex-1 flex-col bg-white p-4 sm:p-5">
              <div className="mb-3 flex gap-1 overflow-x-auto sm:hidden">
                {DASHBOARD_NAV_ITEMS.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveView(id)}
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[7px] font-semibold ${
                      activeView === id
                        ? 'bg-black text-white'
                        : 'bg-[#F5F3EF] text-black/45'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-[9px] font-medium text-black/35">{activeMeta.eyebrow}</p>
                  <h3 className="mt-1 text-[16px] font-bold tracking-[-0.04em] text-black">
                    {activeMeta.title}
                  </h3>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label="Notifications"
                    className="grid h-8 w-8 place-items-center rounded-full border border-black/[0.08] bg-white transition-colors hover:bg-[#F8F7F4]"
                  >
                    <Bell className="h-3.5 w-3.5 text-black/50" />
                  </button>

                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#E7DEFF] text-[9px] font-bold">
                    AO
                  </span>
                </div>
              </div>

              <div className="min-h-0 flex-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeView}
                    initial={{ opacity: 0, y: 7 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.18, ease: EASE_OUT }}
                  >
                    {renderActivePanel()}
                  </motion.div>
                </AnimatePresence>
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
        <div className="absolute left-1/2 top-[420px] h-[460px] w-[760px] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(circle_at_center,rgba(231,222,255,0.82)_0%,rgba(231,222,255,0.35)_48%,rgba(231,222,255,0)_74%)]" />
      </div>

      <div className="relative mx-auto max-w-[1180px] px-5 sm:px-8">
        <Reveal className="mx-auto max-w-[790px] text-center" y={22} amount={0.15}>
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
            Helpdesk, WhatsApp, SLA monitoring and IT assets in one beautifully simple workspace
            built for modern African teams.
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
        </Reveal>

        <div className="relative mx-auto mt-14 max-w-[1040px] lg:mt-16">
          <div className="pointer-events-none absolute left-1/2 top-[55%] h-[380px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-t-full bg-[#E7DEFF]/85" />

          <Reveal
            className="absolute left-0 top-5 z-20 hidden w-[184px] rounded-[16px] border border-black/[0.07] bg-[#FFE36D] p-4 shadow-[0_15px_40px_rgba(0,0,0,0.09)] lg:block"
            x={-28}
            y={0}
            delay={0.12}
            amount={0.3}
          >
            <Clock3 className="h-5 w-5 stroke-[1.7]" />
            <p className="mt-4 text-[25px] font-semibold tracking-[-0.06em] text-black">34.5 Min</p>
            <p className="mt-1 text-[8px] font-semibold text-black/55">Average resolution time</p>
          </Reveal>

          <Reveal
            className="absolute right-0 top-0 z-20 hidden w-[168px] rounded-[16px] border border-black/[0.07] bg-white p-3 shadow-[0_15px_40px_rgba(0,0,0,0.08)] lg:block"
            x={28}
            y={0}
            delay={0.18}
            amount={0.3}
          >
            <div className="grid h-[92px] place-items-center rounded-[12px] bg-[#E7DEFF]">
              <Headphones className="h-11 w-11 stroke-[1.2] text-black/75" />
            </div>

            <p className="mt-3 text-[9px] font-semibold text-black">Priority ticket</p>
            <p className="mt-0.5 text-[8px] text-black/40">Enterprise customer</p>
          </Reveal>

          <Reveal
            className="absolute bottom-16 left-2 z-20 hidden w-[190px] items-center gap-3 rounded-[16px] border border-black/[0.07] bg-white p-3 shadow-[0_15px_40px_rgba(0,0,0,0.09)] lg:flex"
            x={-24}
            y={0}
            delay={0.24}
            amount={0.3}
          >
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
          </Reveal>

          <Reveal
            className="absolute bottom-5 right-5 z-20 hidden w-[154px] rounded-[16px] border border-black/[0.06] bg-[#FF7C58] p-4 shadow-[0_15px_40px_rgba(0,0,0,0.09)] lg:block"
            x={24}
            y={0}
            delay={0.3}
            amount={0.3}
          >
            <CheckCircle2 className="h-5 w-5 text-black/80" />
            <p className="mt-4 text-[22px] font-semibold tracking-[-0.05em] text-black">99.9%</p>
            <p className="mt-0.5 text-[8px] font-semibold text-black/60">SLA compliance</p>
          </Reveal>

          <Reveal
            className="relative z-10 mx-auto max-w-[690px] px-0 lg:px-5"
            y={20}
            scale={1}
            amount={0.12}
          >
            <DashboardMockup />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function CustomerStrip() {
  return (
    <section id="customers" className="border-y border-black/[0.06] bg-[#FCFBF8]">
      <div className="mx-auto max-w-[1180px] px-5 py-8 sm:px-8">
        <Reveal y={14} amount={0.4}>
          <p className="mb-6 text-center text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
            Trusted by ambitious teams
          </p>
        </Reveal>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:gap-x-12">
          {customers.map((customer, index) => (
            <Reveal key={customer} delay={index * 0.045} y={12} scale={0.97} amount={0.5}>
              <span
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
            </Reveal>
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
            <Reveal
              key={stat.label}
              className={`text-center ${index !== 0 ? 'sm:border-l sm:border-black/[0.07]' : ''}`}
              delay={index * 0.07}
              y={20}
              amount={0.45}
            >
              <p className="text-[36px] font-semibold tracking-[-0.065em] text-[#111111] sm:text-[42px]">
                {stat.value}
              </p>
              <p className="mt-1 text-[11px] font-medium text-black/38">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="product" className="bg-[#F5F3EF] py-24 sm:py-28">
      <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
        <Reveal className="mx-auto max-w-[650px] text-center" y={24} amount={0.3}>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/35">
            One platform
          </p>

          <h2 className="mt-4 text-balance text-[38px] font-semibold leading-[1.02] tracking-[-0.055em] text-[#111111] sm:text-[50px]">
            The support stack your team actually wants to use
          </h2>

          <p className="mx-auto mt-5 max-w-[520px] text-[14px] leading-6 text-black/45">
            Everything your agents need, with none of the clutter that makes enterprise helpdesk
            software painful.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description, accent }, index) => (
            <Reveal
              key={title}
              className="h-full"
              delay={(index % 3) * 0.07}
              y={28}
              scale={0.975}
              amount={0.28}
            >
              <article className="group h-full rounded-[24px] border border-black/[0.065] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.07)]">
                <div className={`grid h-11 w-11 place-items-center rounded-[14px] ${accent}`}>
                  <Icon className="h-5 w-5 stroke-[1.7] text-black/75" />
                </div>

                <h3 className="mt-8 text-[17px] font-semibold tracking-[-0.035em] text-black">
                  {title}
                </h3>

                <p className="mt-2 text-[12px] leading-5 text-black/42">{description}</p>

                <div className="mt-6 flex items-center gap-1.5 text-[10px] font-bold text-black/60">
                  Learn more
                  <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
                </div>
              </article>
            </Reveal>
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
        <Reveal className="max-w-[480px]" x={-34} y={0} amount={0.28}>
          <span className="inline-flex rounded-full bg-[#E7DEFF] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-black/55">
            Omnichannel
          </span>

          <h2 className="mt-5 text-[40px] font-semibold leading-[1.02] tracking-[-0.055em] text-[#111111] sm:text-[50px]">
            Every conversation.
            <br />
            One calm inbox.
          </h2>

          <p className="mt-5 max-w-[440px] text-[14px] leading-6 text-black/45">
            Customers can contact you however they prefer. Your team still gets one queue, one
            customer history and one source of truth.
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
        </Reveal>

        <Reveal className="relative" x={34} y={0} amount={0.22}>
          <div className="rounded-[30px] bg-[#F5F3EF] p-3">
            <div className="rounded-[24px] border border-black/[0.07] bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-7">
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-black">Conversations by channel</p>
                  <p className="mt-1 text-[9px] text-black/35">This week</p>
                </div>

                <span className="rounded-full border border-black/[0.08] px-3 py-1.5 text-[8px] font-semibold text-black/45">
                  290 total
                </span>
              </div>

              <div className="space-y-5">
                {channelRows.map(({ icon: Icon, channel, tickets, percentage, className }) => (
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
                      <motion.div
                        className="h-full rounded-full bg-[#111111]"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: false, amount: 0.8 }}
                        transition={{
                          duration: 0.72,
                          ease: EASE_OUT,
                        }}
                        style={{
                          width: `${percentage}%`,
                          transformOrigin: 'left',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-3 gap-2">
                {[
                  ['4.8m', 'First reply'],
                  ['34.5m', 'Resolution'],
                  ['96%', 'CSAT'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-[14px] bg-[#F8F7F4] px-3 py-4 text-center">
                    <p className="text-[17px] font-semibold tracking-[-0.04em]">{value}</p>
                    <p className="mt-1 text-[7px] font-medium text-black/35">{label}</p>
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
              <p className="mt-0.5 text-[7px] text-black/45">Messages syncing live</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="resources" className="bg-[#F5F3EF] py-24 sm:py-28">
      <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
        <Reveal className="text-center" y={24} amount={0.3}>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/35">
            Customer stories
          </p>

          <h2 className="mt-4 text-[38px] font-semibold tracking-[-0.055em] text-black sm:text-[48px]">
            Support teams move faster with Topiadesk
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal
              key={testimonial.author}
              className="h-full"
              delay={index * 0.075}
              y={26}
              scale={0.98}
              amount={0.3}
            >
              <article className="h-full rounded-[24px] border border-black/[0.065] bg-white p-6">
                <div
                  className={`mb-7 flex h-10 w-10 items-center justify-center rounded-full ${
                    index === 0 ? 'bg-[#FFE36D]' : index === 1 ? 'bg-[#E7DEFF]' : 'bg-[#DFF4E8]'
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
                    <Star key={starIndex} className="h-3.5 w-3.5 fill-black text-black" />
                  ))}
                </div>

                <blockquote className="mt-5 text-[14px] leading-6 tracking-[-0.01em] text-black/65">
                  “{testimonial.quote}”
                </blockquote>

                <div className="mt-8 border-t border-black/[0.06] pt-4">
                  <p className="text-[11px] font-bold text-black">{testimonial.author}</p>
                  <p className="mt-1 text-[9px] text-black/35">{testimonial.role}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-white px-5 py-20 sm:px-8 sm:py-24">
      <Reveal
        className="relative mx-auto max-w-[1120px] overflow-hidden rounded-[32px] bg-[#111111] px-6 py-16 text-center sm:px-12 sm:py-20"
        y={28}
        scale={0.975}
        amount={0.25}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(231,222,255,0.16),transparent_30%),radial-gradient(circle_at_92%_100%,rgba(255,227,109,0.12),transparent_32%)]" />

        <div className="relative mx-auto max-w-[660px]">
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white/60">
            Start today
          </span>

          <h2 className="mt-5 text-balance text-[40px] font-semibold leading-[1.02] tracking-[-0.055em] text-white sm:text-[54px]">
            Make customer support feel effortless.
          </h2>

          <p className="mx-auto mt-5 max-w-[510px] text-[13px] leading-6 text-white/48">
            Create your workspace in minutes and give your team one beautiful place to manage every
            customer conversation.
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
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-black/[0.06] bg-[#FCFBF8]">
      <Reveal className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8" y={18} amount={0.15}>
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-[290px]">
            <BrandMark />
            <p className="mt-4 text-[11px] leading-5 text-black/38">
              Unified customer support, monitoring and IT operations for modern teams.
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
          <span>© {new Date().getFullYear()} Tekktopia Ltd. All rights reserved.</span>

          <span>Built for support teams that care about the experience.</span>
        </div>
      </Reveal>
    </footer>
  );
}

export default function HomePage() {
  return (
    <>
      <ReactLenis
        root
        options={{
          anchors: true,
          lerp: 0.14,
          smoothWheel: true,
          wheelMultiplier: 0.9,
          syncTouch: false,
          stopInertiaOnNavigate: true,
          respectReducedMotion: true,
        }}
      />

      <MotionConfig reducedMotion="user">
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
      </MotionConfig>
    </>
  );
}