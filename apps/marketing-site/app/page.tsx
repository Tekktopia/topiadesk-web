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
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from 'motion/react';
import { ReactLenis } from 'lenis/react';
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { HandDrawnUnderline } from './_components/hand-drawn-underline';
import { ThemeToggle } from './_components/theme-toggle';

const TRIAL_URL = '/signup';

const MotionLink = motion.create(Link);

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

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  floatDistance?: number;
  floatDuration?: number;
  floatDelay?: number;
  shineDelay?: number;
};

function TiltCard({
  children,
  className,
  floatDistance = 9,
  floatDuration = 4.5,
  floatDelay = 0,
  shineDelay = 0,
}: TiltCardProps) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 220, damping: 16, mass: 0.5 });
  const springRotateY = useSpring(rotateY, { stiffness: 220, damping: 16, mass: 0.5 });

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 22);
    rotateX.set(py * -22);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      className={`relative overflow-hidden ${className ?? ''}`}
      style={{ perspective: 700 }}
      animate={{
        y: [0, -floatDistance, 0],
        rotate: [-1.6, 1.6, -1.6],
      }}
      transition={{
        duration: floatDuration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: floatDelay,
      }}
      whileHover={{ scale: 1.06 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative"
        style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/3 -skew-x-12 bg-gradient-to-r from-white/0 via-white/60 to-white/0 mix-blend-overlay"
        initial={{ x: '-160%' }}
        animate={{ x: ['-160%', '260%'] }}
        transition={{
          duration: 2.6,
          repeat: Infinity,
          repeatDelay: 3.6,
          ease: 'easeInOut',
          delay: shineDelay,
        }}
      />
    </motion.div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 20l1.3-3.9A7.9 7.9 0 1 1 8.6 19L4 20Z" />
      <path d="M9 10.5c0 2.5 2 4.5 4.5 4.5.5 0 1-.6.8-1.1l-.3-.7c-.15-.35-.55-.5-.9-.35-.25.1-.5.15-.6.05-.6-.6-1.4-1.4-2-2-.1-.1-.05-.35.05-.6.15-.35 0-.75-.35-.9l-.7-.3c-.5-.2-1.1.3-1.1.8Z" />
    </svg>
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

      <span className="text-[16px] font-bold tracking-[-0.03em] text-[#111111] dark:text-white">
        Topiadesk
      </span>
    </Link>
  );
}

function Navigation() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const delta = latest - lastScrollY.current;

    if (latest < 90) {
      setHidden(false);
    } else if (delta > 4) {
      setHidden(true);
    } else if (delta < -4) {
      setHidden(false);
    }

    lastScrollY.current = latest;
  });

  return (
    <motion.header
      className="sticky top-0 z-50 border-b border-black/[0.045] bg-[#FCFBF8]/95 backdrop-blur-sm transition-colors duration-300 dark:border-white/[0.08] dark:bg-[#0F0F1A]/95"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: hidden ? -100 : 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
    >
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5 sm:px-8">
        <BrandMark />

        <nav className="hidden items-center gap-7 lg:flex">
          <Link
            href="#product"
            className="flex items-center gap-1 text-[13px] font-medium text-black/65 transition hover:text-black dark:text-white/60 dark:hover:text-white"
          >
            Product
            <ChevronDown className="h-3.5 w-3.5" />
          </Link>

          <Link
            href="#channels"
            className="text-[13px] font-medium text-black/65 transition hover:text-black dark:text-white/60 dark:hover:text-white"
          >
            Channels
          </Link>

          <Link
            href="#customers"
            className="text-[13px] font-medium text-black/65 transition hover:text-black dark:text-white/60 dark:hover:text-white"
          >
            Customers
          </Link>

          <Link
            href="#resources"
            className="text-[13px] font-medium text-black/65 transition hover:text-black dark:text-white/60 dark:hover:text-white"
          >
            Resources
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <MotionLink
            href="/contact"
            initial="rest"
            whileHover="hover"
            whileTap={{ scale: 0.96 }}
            className="relative hidden text-[12px] font-semibold text-black/75 transition-colors hover:text-black sm:block dark:text-white/70 dark:hover:text-white"
          >
            Book a demo
            <HandDrawnUnderline
              trigger="hover"
              color="#FF7965"
              strokeWidth={4}
              className="pointer-events-none absolute -bottom-1.5 left-0 h-[6px] w-full"
            />
          </MotionLink>

          <MotionLink
            href={TRIAL_URL}
            whileTap={{ scale: 0.96 }}
            className="rounded-full bg-[#111111] px-5 py-2.5 text-[12px] font-semibold text-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] transition-colors duration-200 hover:bg-[#2A1712] dark:bg-white dark:text-black dark:shadow-[0_5px_15px_rgba(0,0,0,0.35)] dark:hover:bg-white/85"
          >
            Get started
          </MotionLink>
        </div>
      </div>
    </motion.header>
  );
}

type DashboardView = 'overview' | 'inbox' | 'tickets' | 'customers' | 'sla' | 'assets';

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

const DASHBOARD_VIEW_META: Record<DashboardView, { eyebrow: string; title: string }> = {
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

const DASHBOARD_TOAST_MESSAGES: Array<{ text: string; meta: string }> = [
  { text: 'New ticket via WhatsApp', meta: 'Adaeze O. · just now' },
  { text: 'SLA at risk', meta: 'Ticket #2486 · 4 min left' },
  { text: 'Automation resolved 3 tickets', meta: 'Auto-routing workflow' },
  { text: 'New agent invited', meta: 'Musa Okafor · Support' },
];

const DASHBOARD_ACTION_POPUPS: Record<
  DashboardView,
  { text: string; meta: string; tone: 'success' | 'alert' | 'info' }
> = {
  overview: { text: 'Ticket #2481 resolved', meta: 'Removed from urgent queue', tone: 'success' },
  inbox: { text: 'Reply sent to Musa Okafor', meta: 'Ticket #2478', tone: 'success' },
  tickets: { text: 'Ticket #2481 marked Resolved', meta: 'Ahmed O. · Support', tone: 'success' },
  customers: { text: 'Note added to Ada Obi', meta: 'Customer profile updated', tone: 'info' },
  sla: { text: 'Priority response verified', meta: 'SLA policy check', tone: 'success' },
  assets: {
    text: 'Dell Latitude marked Healthy',
    meta: 'TD-1407 · Review cleared',
    tone: 'success',
  },
};

const DASHBOARD_ACTION_TONE_BG: Record<'success' | 'alert' | 'info', string> = {
  success: 'bg-[#DFF3E6]',
  alert: 'bg-[#FFF1CF]',
  info: 'bg-[#E7DEFF]',
};

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

/**
 * Drives a two-step "press then commit" sequence for demo-driven panel
 * actions: the moment `trigger` changes from its mounted baseline, the
 * target briefly reports 'pressed' (for a tactile zoom/press effect on the
 * clicked element), then settles into 'done' (for the real, visible
 * consequence of that click — status changes, a row leaving a list, etc).
 */
function useDemoAction(trigger: number, pressDuration = 170) {
  const baseline = useRef(trigger);
  const [phase, setPhase] = useState<'idle' | 'pressed' | 'done'>('idle');

  useEffect(() => {
    if (trigger === baseline.current) return;

    setPhase('pressed');
    const timer = setTimeout(() => setPhase('done'), pressDuration);
    return () => clearTimeout(timer);
  }, [trigger, pressDuration]);

  return phase;
}

function DashboardStat({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="rounded-xl border border-black/[0.06] bg-[#FBFAF8] p-3">
      <p className="truncate text-[7px] font-medium text-black/35">{label}</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-1">
        <p className="text-[15px] font-bold tracking-[-0.04em] text-black">{value}</p>
        <span className="rounded-full bg-[#DFF4E8] px-1.5 py-0.5 text-[6px] font-bold text-[#36794F]">
          {delta}
        </span>
      </div>
    </div>
  );
}

function OverviewDashboardPanel({ trigger }: { trigger: number }) {
  const phase = useDemoAction(trigger);
  const pressed = phase === 'pressed';
  const resolved = phase === 'done';

  const targetId = DASHBOARD_TICKETS[0]?.id;
  const inboxTickets = DASHBOARD_TICKETS.slice(0, 3);
  const visibleTickets = resolved
    ? inboxTickets.filter((ticket) => ticket.id !== targetId)
    : inboxTickets;
  const urgentCount = resolved ? 3 : 4;

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
              <div key={`${height}-${index}`} className="flex flex-1 flex-col justify-end">
                <motion.div
                  className={`rounded-t-md ${index === 5 ? 'bg-[#111111]' : 'bg-[#E7DEFF]'}`}
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
            <motion.span
              key={urgentCount}
              initial={{ scale: 1.35 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 14 }}
              className="rounded-full bg-[#FFD9CB] px-2 py-1 text-[6px] font-bold text-[#A6452F]"
            >
              {urgentCount} urgent
            </motion.span>
          </div>

          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {visibleTickets.map((ticket) => {
                const isTarget = ticket.id === targetId;

                return (
                  <motion.div
                    key={ticket.id}
                    data-demo-target={isTarget ? 'true' : undefined}
                    layout
                    animate={{ scale: isTarget && pressed ? 0.94 : 1, opacity: 1 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0, scale: 0.92 }}
                    transition={{ duration: 0.22, ease: EASE_OUT }}
                    className="flex items-center gap-2 overflow-hidden rounded-xl bg-[#FBFAF8] p-2"
                  >
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${ticket.bg} dark:text-black text-[7px] font-bold`}
                    >
                      {ticket.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[7.5px] font-bold text-black/75">
                        {ticket.subject}
                      </p>
                      <p className="text-[6px] text-black/30">{ticket.channel}</p>
                    </div>
                    {isTarget && pressed ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#36794F]" />
                    ) : (
                      <span className="text-[6px] text-black/30">{ticket.time}</span>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="mt-3 hidden rounded-2xl border border-black/[0.06] p-3 sm:block">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[8px] font-bold text-black">Recent activity</p>
          <span className="text-[7px] font-medium text-black/35">View all</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            resolved ? 'Ticket #2481 resolved · just now' : 'Ticket #2481 resolved',
            'SLA policy updated',
            'New agent invited',
          ].map((activity, index) => (
            <div
              key={activity}
              className="flex items-center gap-2 rounded-lg bg-[#FBFAF8] px-2 py-2"
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${
                  index === 0 ? 'bg-[#8BD5A8]' : index === 1 ? 'bg-[#FFE36D]' : 'bg-[#C9B8FF]'
                }`}
              />
              <p className="truncate text-[6.5px] text-black/45">{activity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InboxDashboardPanel({
  selectedTicketId,
  onSelectTicket,
  trigger,
}: {
  selectedTicketId: string;
  onSelectTicket: (ticketId: string) => void;
  trigger: number;
}) {
  const phase = useDemoAction(trigger);
  const pressed = phase === 'pressed';
  const replySent = phase === 'done';

  const selectedTicket =
    DASHBOARD_TICKETS.find((ticket) => ticket.id === selectedTicketId) ?? DASHBOARD_TICKETS[0];

  if (!selectedTicket) {
    return (
      <div className="grid min-h-[270px] place-items-center rounded-2xl border border-black/[0.06] bg-[#FBFAF8]">
        <div className="text-center">
          <p className="text-[9px] font-bold text-black/60">No conversations available</p>
          <p className="mt-1 text-[7px] text-black/30">New conversations will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-[270px] gap-3 lg:grid-cols-[0.88fr_1.12fr]">
      <div className="rounded-2xl border border-black/[0.06] p-2">
        <div className="mb-2 px-2 pt-1">
          <p className="text-[8px] font-bold text-black">Recent conversations</p>

          <p className="mt-0.5 text-[6.5px] text-black/35">12 unread</p>
        </div>

        <div className="space-y-1.5">
          {DASHBOARD_TICKETS.slice(0, 3).map((ticket, index) => {
            const active = selectedTicket.id === ticket.id;
            const isTarget = index === 1;

            return (
              <motion.button
                key={ticket.id}
                type="button"
                data-demo-target={isTarget ? 'true' : undefined}
                onClick={() => onSelectTicket(ticket.id)}
                animate={{ scale: isTarget && pressed ? 0.96 : 1 }}
                transition={{ duration: 0.15, ease: EASE_OUT }}
                className={`flex w-full items-center gap-2 rounded-xl p-2 text-left transition-colors ${
                  active ? 'bg-[#F0ECE6]' : 'hover:bg-[#FBFAF8]'
                }`}
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${ticket.bg} dark:text-black text-[7px] font-bold`}
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
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-black/[0.06] bg-[#FBFAF8] p-3.5">
        <div className="flex items-center justify-between border-b border-black/[0.05] pb-3">
          <div>
            <p className="text-[9px] font-bold text-black">{selectedTicket.subject}</p>

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
              Hi, I&rsquo;m having trouble with this request and need some help getting it resolved
              today.
            </p>
          </div>

          <div className="ml-auto max-w-[88%] rounded-xl rounded-tr-sm bg-[#E7DEFF] p-2.5">
            <p className="text-[7px] leading-3.5 text-black/60">
              I can help with that. I&rsquo;ve checked your account and I&rsquo;m reviewing the
              issue now.
            </p>
          </div>

          <AnimatePresence>
            {replySent ? (
              <motion.div
                key="demo-reply"
                initial={{ opacity: 0, y: 10, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.26, ease: EASE_OUT }}
                className="ml-auto max-w-[88%] rounded-xl rounded-tr-sm bg-[#E7DEFF] p-2.5"
              >
                <p className="text-[7px] leading-3.5 text-black/60">
                  Thanks for confirming — I&rsquo;ve gone ahead and resolved this on our end.
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <motion.div
          animate={{ scale: replySent ? [1, 0.9, 1] : 1 }}
          transition={{ duration: 0.32, ease: EASE_OUT }}
          className="mt-3 flex items-center gap-2 rounded-xl border border-black/[0.06] bg-white px-3 py-2"
        >
          <span className="flex-1 text-[7px] text-black/25">
            {replySent ? 'Reply sent' : 'Write a reply...'}
          </span>

          <span className="rounded-full bg-black px-2 py-1 text-[6px] font-bold text-white">
            Send
          </span>
        </motion.div>
      </div>
    </div>
  );
}

function TicketsDashboardPanel({ trigger }: { trigger: number }) {
  const phase = useDemoAction(trigger);
  const pressed = phase === 'pressed';
  const resolved = phase === 'done';

  return (
    <div className="rounded-2xl border border-black/[0.06]">
      <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-black/[0.05] px-3 py-2.5 text-[6.5px] font-bold uppercase tracking-[0.08em] text-black/30">
        <span>Request</span>
        <span>Status</span>
        <span>Age</span>
      </div>

      <div className="divide-y divide-black/[0.045]">
        {DASHBOARD_TICKETS.map((ticket, index) => {
          const isTarget = index === 0;
          const status = isTarget && resolved ? 'Resolved' : ticket.status;

          return (
            <motion.div
              key={ticket.id}
              data-demo-target={isTarget ? 'true' : undefined}
              animate={{
                scale: isTarget && pressed ? 0.97 : 1,
                backgroundColor:
                  isTarget && resolved ? 'rgba(139,213,168,0.14)' : 'rgba(139,213,168,0)',
              }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-3 py-3"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${ticket.bg} dark:text-black text-[7px] font-bold`}
                >
                  {ticket.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[8px] font-bold text-black/70">{ticket.subject}</p>
                  <p className="mt-0.5 text-[6px] text-black/30">
                    #{ticket.id} · {ticket.channel}
                  </p>
                </div>
              </div>

              <motion.span
                key={status}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className={`rounded-full px-2 py-1 text-[6px] font-bold ${
                  status === 'Resolved'
                    ? 'bg-[#DFF4E8] text-[#36794F]'
                    : status === 'Urgent'
                      ? 'bg-[#FFE3DB] text-[#9A4B3A]'
                      : status === 'Pending'
                        ? 'bg-[#FFF3C7] text-[#80691A]'
                        : 'bg-[#DFF4E8] text-[#36794F]'
                }`}
              >
                {status}
              </motion.span>

              <span className="w-6 text-right text-[6.5px] text-black/30">{ticket.time}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function CustomersDashboardPanel({ trigger }: { trigger: number }) {
  const phase = useDemoAction(trigger);
  const pressed = phase === 'pressed';
  const noted = phase === 'done';

  const customersList = [
    ['AO', 'Ada Obi', 'ada@topiadesk.com', 24, 'bg-[#E7DEFF]'],
    ['MO', 'Musa Okafor', 'musa@topiadesk.com', 17, 'bg-[#DFF4E8]'],
    ['TN', 'Teni Nwosu', 'teni@topiadesk.io', 11, 'bg-[#FFE36D]'],
    ['AA', 'Ayo Adeleke', 'ayo@topiadesk.co', 8, 'bg-[#FFD9CB]'],
  ] as const;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {customersList.map(([initials, name, email, ticketCount, bg], index) => {
        const isTarget = index === 0;
        const count = isTarget && noted ? ticketCount + 1 : ticketCount;

        return (
          <motion.div
            key={email}
            data-demo-target={isTarget ? 'true' : undefined}
            animate={{ scale: isTarget && pressed ? 0.96 : 1 }}
            transition={{ duration: 0.16, ease: EASE_OUT }}
            className="relative rounded-2xl border border-black/[0.06] bg-[#FBFAF8] p-3"
          >
            <AnimatePresence>
              {isTarget && noted ? (
                <motion.span
                  initial={{ opacity: 0, scale: 0.6, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 16 }}
                  className="absolute -right-1.5 -top-1.5 rounded-full bg-black px-2 py-1 text-[6px] font-bold text-white"
                >
                  Note added
                </motion.span>
              ) : null}
            </AnimatePresence>

            <div className="flex items-center gap-2.5">
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${bg} dark:text-black text-[8px] font-bold`}
              >
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[8.5px] font-bold text-black/70">{name}</p>
                <p className="mt-0.5 truncate text-[6.5px] text-black/30">{email}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-black/[0.05] pt-2.5">
              <motion.span
                key={count}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="text-[6.5px] text-black/35"
              >
                {count} tickets
              </motion.span>
              <span className="flex items-center gap-1 text-[6.5px] font-bold text-black/55">
                <Star className="h-2.5 w-2.5 fill-[#FFB800] text-[#FFB800]" />
                4.9
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function SlaDashboardPanel({ trigger }: { trigger: number }) {
  const phase = useDemoAction(trigger);
  const pressed = phase === 'pressed';
  const verified = phase === 'done';

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
          <p className="text-[7px] font-semibold text-white/65">
            {verified ? '1 at risk' : '2 at risk'}
          </p>
          <p className="mt-0.5 text-[6px] text-white/35">Across 248 open tickets</p>
        </div>
      </div>

      <div className="rounded-2xl border border-black/[0.06] p-3.5">
        <p className="text-[9px] font-bold text-black">Policies</p>
        <p className="mt-0.5 text-[6.5px] text-black/35">Performance this week</p>

        <div className="mt-4 space-y-4">
          {policies.map((policy, index) => {
            const isTarget = index === 0;

            return (
              <motion.div
                key={policy.label}
                data-demo-target={isTarget ? 'true' : undefined}
                animate={{ scale: isTarget && pressed ? 0.97 : 1 }}
                transition={{ duration: 0.16, ease: EASE_OUT }}
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[7.5px] font-semibold text-black/55">
                    {policy.label}
                    <AnimatePresence>
                      {isTarget && verified ? (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 16 }}
                          className="inline-flex items-center gap-0.5 rounded-full bg-[#DFF4E8] px-1.5 py-0.5 text-[5.5px] font-bold text-[#36794F]"
                        >
                          <CheckCircle2 className="h-2 w-2" />
                          Verified
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AssetsDashboardPanel({ trigger }: { trigger: number }) {
  const phase = useDemoAction(trigger);
  const pressed = phase === 'pressed';
  const fixed = phase === 'done';

  const assets = [
    ['MacBook Pro 14"', 'TD-1482', 'Ada Obi', 'Healthy', 'bg-[#DFF4E8]'],
    ['ThinkPad X1', 'TD-1491', 'Musa Okafor', 'Healthy', 'bg-[#DFF4E8]'],
    ['Dell Latitude 7440', 'TD-1407', 'Teni Nwosu', 'Review', 'bg-[#FFF3C7]'],
    ['iPhone 15', 'TD-1398', 'Ayo Adeleke', 'Healthy', 'bg-[#DFF4E8]'],
  ] as const;

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
        {assets.map(([name, assetId, owner, health, bg], index) => {
          const isTarget = index === 2;
          const resolvedHealth = isTarget && fixed ? 'Healthy' : health;
          const resolvedBg = isTarget && fixed ? 'bg-[#DFF4E8]' : bg;

          return (
            <motion.div
              key={assetId}
              data-demo-target={isTarget ? 'true' : undefined}
              animate={{ scale: isTarget && pressed ? 0.96 : 1 }}
              transition={{ duration: 0.16, ease: EASE_OUT }}
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

              <motion.span
                key={resolvedHealth}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className={`rounded-full px-2 py-1 text-[6px] font-bold ${resolvedBg} text-black/55`}
              >
                {resolvedHealth}
              </motion.span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function DashboardMockup() {
  const [activeView, setActiveView] = useState<DashboardView>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState('2481');

  const [isPaused, setIsPaused] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [cursorClicking, setCursorClicking] = useState(false);
  const [toastIndex, setToastIndex] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [showActionPopup, setShowActionPopup] = useState(false);
  const [actionTrigger, setActionTrigger] = useState(0);

  const currentIndexRef = useRef(0);
  const navRefs = useRef<Partial<Record<DashboardView, HTMLButtonElement | null>>>({});
  const dashboardBodyRef = useRef<HTMLDivElement | null>(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const searchResults = normalizedQuery
    ? DASHBOARD_SEARCH_ITEMS.filter((item) =>
        `${item.label} ${item.meta}`.toLowerCase().includes(normalizedQuery),
      ).slice(0, 5)
    : [];

  const activeMeta = DASHBOARD_VIEW_META[activeView];

  function selectView(view: DashboardView) {
    setActiveView(view);
    currentIndexRef.current = DASHBOARD_NAV_ITEMS.findIndex((item) => item.id === view);
  }

  function selectSearchResult(view: DashboardView) {
    selectView(view);
    setSearchQuery('');
  }

  useEffect(() => {
    if (isPaused) return;

    let cancelled = false;

    function sleep(ms: number) {
      return new Promise<void>((resolve) => setTimeout(resolve, ms));
    }

    function moveCursorTo(el: HTMLElement) {
      const container = dashboardBodyRef.current;
      if (!container) return;

      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setCursorPos({
        x: elRect.left - containerRect.left + elRect.width / 2,
        y: elRect.top - containerRect.top + elRect.height / 2,
      });
    }

    async function runLoop() {
      while (!cancelled) {
        await sleep(1300);
        if (cancelled) return;

        // Stage 1 — travel to the next nav item and click it
        const nextIndex = (currentIndexRef.current + 1) % DASHBOARD_NAV_ITEMS.length;
        const nextItem = DASHBOARD_NAV_ITEMS[nextIndex];
        if (!nextItem) return;

        const navBtn = navRefs.current[nextItem.id];
        if (navBtn) moveCursorTo(navBtn);

        await sleep(550);
        if (cancelled) return;

        setCursorClicking(true);
        setActiveView(nextItem.id);
        currentIndexRef.current = nextIndex;

        await sleep(260);
        if (cancelled) return;
        setCursorClicking(false);

        // Stage 2 — let the panel finish animating in, then find something real to click
        await sleep(420);
        if (cancelled) return;

        const targetEl = dashboardBodyRef.current?.querySelector<HTMLElement>('[data-demo-target]');

        if (targetEl) {
          moveCursorTo(targetEl);

          await sleep(550);
          if (cancelled) return;

          setCursorClicking(true);
          targetEl.click();
          setShowActionPopup(true);
          setActionTrigger((t) => t + 1);

          await sleep(260);
          if (cancelled) return;
          setCursorClicking(false);

          // Stage 3 — let the resulting popup breathe before moving on
          await sleep(1500);
          if (cancelled) return;
          setShowActionPopup(false);
        }
      }
    }

    runLoop();

    return () => {
      cancelled = true;
    };
  }, [isPaused]);

  useEffect(() => {
    if (isPaused) {
      setShowToast(false);
      return;
    }

    let timerId: ReturnType<typeof setTimeout>;

    function loop() {
      timerId = setTimeout(() => {
        setToastIndex((index) => (index + 1) % DASHBOARD_TOAST_MESSAGES.length);
        setShowToast(true);

        timerId = setTimeout(() => {
          setShowToast(false);
          loop();
        }, 2600);
      }, 5200);
    }

    loop();

    return () => clearTimeout(timerId);
  }, [isPaused]);

  const activeActionPopup = DASHBOARD_ACTION_POPUPS[activeView];

  function renderActivePanel() {
    switch (activeView) {
      case 'inbox':
        return (
          <InboxDashboardPanel
            selectedTicketId={selectedTicketId}
            onSelectTicket={setSelectedTicketId}
            trigger={actionTrigger}
          />
        );
      case 'tickets':
        return <TicketsDashboardPanel trigger={actionTrigger} />;
      case 'customers':
        return <CustomersDashboardPanel trigger={actionTrigger} />;
      case 'sla':
        return <SlaDashboardPanel trigger={actionTrigger} />;
      case 'assets':
        return <AssetsDashboardPanel trigger={actionTrigger} />;
      case 'overview':
      default:
        return <OverviewDashboardPanel trigger={actionTrigger} />;
    }
  }

  return (
    <div
      className="relative mx-auto w-full max-w-[680px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden rounded-[30px] border border-black/[0.08] bg-[#F2F0EC] p-2 shadow-[0_16px_45px_rgba(37,29,17,0.06)]">
        <div className="overflow-hidden rounded-[24px] border border-black/[0.07] bg-white">
          <div className="relative z-30 flex h-11 items-center justify-between border-b border-black/[0.06] px-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF7965] cursor-pointer" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FFD968] cursor-pointer" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#8BD5A8] cursor-pointer" />
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
                        <span className="shrink-0 text-[6px] text-black/30">{result.meta}</span>
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
              className="grid h-7 w-7 place-items-center rounded-full cursor-pointer transition-colors hover:bg-black/[0.04]"
            >
              <MoreHorizontal className="h-4 w-4 text-black/30 cursor-pointer" />
            </button>
          </div>

          <div ref={dashboardBodyRef} className="relative flex h-[390px] sm:h-[430px]">
            <aside className="hidden w-[148px] shrink-0 border-r border-black/[0.06] bg-[#FBFAF8] p-3 sm:block">
              <div className="mb-5 flex items-center gap-2 px-1 cursor-pointer">
                <Image
                  src="/icons/icon.png"
                  alt="Topiadesk"
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                />

                <div>
                  <p className="text-[9px] font-bold text-black">Topiadesk</p>
                  <p className="text-[7px] text-black/35">Topiadesk Workspace</p>
                </div>
              </div>

              <nav className="space-y-1" aria-label="Dashboard sections">
                {DASHBOARD_NAV_ITEMS.map(({ id, icon: Icon, label }) => {
                  const active = activeView === id;

                  return (
                    <button
                      key={id}
                      ref={(el) => {
                        navRefs.current[id] = el;
                      }}
                      type="button"
                      onClick={() => selectView(id)}
                      aria-pressed={active}
                      className={`flex w-full items-center gap-2 cursor-pointer rounded-lg px-2 py-2 text-left text-[8px] font-medium transition-colors ${
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

            <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-white p-4 sm:p-5">
              <AnimatePresence>
                {showToast && DASHBOARD_TOAST_MESSAGES[toastIndex] ? (
                  <motion.div
                    key={toastIndex}
                    initial={{ opacity: 0, y: -14, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.96 }}
                    transition={{ duration: 0.28, ease: EASE_OUT }}
                    className="absolute right-3 top-3 z-40 flex max-w-[168px] items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.14)]"
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center cursor-pointer rounded-full bg-[#E7DEFF]">
                      <Bell className="h-3 w-3 text-black/70 cursor-pointer" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[8px] font-semibold text-black/75">
                        {DASHBOARD_TOAST_MESSAGES[toastIndex].text}
                      </p>
                      <p className="truncate text-[7px] text-black/40">
                        {DASHBOARD_TOAST_MESSAGES[toastIndex].meta}
                      </p>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <AnimatePresence>
                {showActionPopup && activeActionPopup ? (
                  <motion.div
                    key={activeView}
                    initial={{ opacity: 0, y: 14, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.94 }}
                    transition={{ duration: 0.26, ease: EASE_OUT }}
                    className="absolute bottom-3 left-3 z-40 flex max-w-[190px] items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.14)]"
                  >
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${DASHBOARD_ACTION_TONE_BG[activeActionPopup.tone]}`}
                    >
                      <CheckCircle2 className="h-3 w-3 text-black/70" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[8px] font-semibold text-black/75">
                        {activeActionPopup.text}
                      </p>
                      <p className="truncate text-[7px] text-black/40">{activeActionPopup.meta}</p>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="mb-3 flex gap-1 overflow-x-auto sm:hidden">
                {DASHBOARD_NAV_ITEMS.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => selectView(id)}
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[7px] font-semibold ${
                      activeView === id ? 'bg-black text-white' : 'bg-[#F5F3EF] text-black/45'
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
                    className="grid h-8 w-8 place-items-center rounded-full border border-black/[0.08] cursor-pointer bg-white transition-colors hover:bg-[#F8F7F4]"
                  >
                    <Bell className="h-3.5 w-3.5 text-black/50 cursor-pointer" />
                  </button>

                  <span className="grid h-8 w-8 place-items-center cursor-pointer rounded-full bg-[#E7DEFF] text-[9px] dark:text-black font-bold">
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

            {cursorPos ? (
              <motion.div
                className="pointer-events-none absolute left-0 top-0 z-50 hidden sm:block"
                animate={{
                  x: cursorPos.x - 6,
                  y: cursorPos.y - 6,
                  scale: cursorClicking ? 0.7 : 1,
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 22, mass: 0.5 }}
              >
                <span className="relative block h-3 w-3 rounded-full bg-black shadow-[0_0_0_3px_rgba(0,0,0,0.12)]">
                  {cursorClicking ? (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-black/30"
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 2.6, opacity: 0 }}
                      transition={{ duration: 0.42, ease: 'easeOut' }}
                    />
                  ) : null}
                </span>
              </motion.div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FCFBF8] pb-20 pt-16 transition-colors duration-300 sm:pb-28 sm:pt-20 dark:bg-[#0F0F1A] lg:pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[420px] h-[460px] w-[760px] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(circle_at_center,rgba(231,222,255,0.82)_0%,rgba(231,222,255,0.35)_48%,rgba(231,222,255,0)_74%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,107,74,0.22)_0%,rgba(255,107,74,0.08)_48%,rgba(255,107,74,0)_74%)]" />
      </div>

      <div className="relative mx-auto max-w-[1180px] px-5 sm:px-8">
        <Reveal className="mx-auto max-w-[790px] text-center" y={22} amount={0.15}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/[0.07] bg-white px-3 py-1.5 dark:border-white/[0.08] dark:bg-white/[0.06]">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#FFE36D]">
              <Sparkles className="h-3 w-3" />
            </span>
            <span className="text-[11px] font-semibold text-black/65 dark:text-white/70">
              Support operations, simplified
            </span>
          </div>

          <h1 className="text-balance text-[44px] font-semibold leading-[0.98] tracking-[-0.065em] text-[#111111] sm:text-[62px] lg:text-[72px] dark:text-white">
            Meet the{' '}
            <span className="relative inline-block whitespace-nowrap">
              super-fast
              <HandDrawnUnderline
                color="#FF7965"
                delay={0.55}
                className="pointer-events-none absolute -bottom-1 left-0 h-[0.22em] w-full sm:h-[0.2em]"
              />
            </span>
            <br />
            customer support platform
          </h1>

          <p className="mx-auto mt-6 max-w-[620px] text-balance text-[14px] leading-6 text-black/48 sm:text-[15px] dark:text-white/50">
            Helpdesk, WhatsApp, SLA monitoring and IT assets in one beautifully simple workspace
            built for modern African teams.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MotionLink
              href={TRIAL_URL}
              whileTap={{ scale: 0.96 }}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#111111] px-6 text-[12px] font-semibold text-white shadow-[0_8px_25px_rgba(0,0,0,0.14)] transition-colors duration-200 hover:bg-[#2A1712] dark:bg-white dark:text-black dark:shadow-[0_8px_25px_rgba(0,0,0,0.4)] dark:hover:bg-white/85"
            >
              Get started — for free
              <ArrowRight className="h-3.5 w-3.5" />
            </MotionLink>

            <MotionLink
              href="/contact"
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.96 }}
              className="relative inline-flex h-12 items-center justify-center rounded-full border border-black/20 bg-white px-6 text-[12px] font-semibold text-[#111111] transition-colors duration-200 hover:bg-black/[0.03] dark:border-white/20 dark:bg-transparent dark:text-white dark:hover:bg-white/[0.06]"
            >
              Book a demo
              <HandDrawnUnderline
                trigger="hover"
                color="#FF7965"
                strokeWidth={4}
                className="pointer-events-none absolute -bottom-0.5 left-6 right-6 h-[6px]"
              />
            </MotionLink>
          </div>

          <p className="mt-3 text-[10px] font-medium text-black/30 dark:text-white/30">
            14-day free trial · No credit card required
          </p>
        </Reveal>

        <div className="relative mx-auto mt-14 max-w-[1040px] lg:mt-16">
          <div className="pointer-events-none absolute left-1/2 top-[55%] h-[380px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-t-full bg-[#E7DEFF]/85" />

          <Reveal
            className="absolute left-0 top-5 z-20 hidden w-[184px] lg:block"
            x={-28}
            y={0}
            delay={0.12}
            amount={0.3}
          >
            <TiltCard
              className="rounded-[16px] border border-black/[0.07] bg-[#FFE36D] p-4 shadow-[0_15px_40px_rgba(0,0,0,0.09)]"
              floatDistance={9}
              floatDuration={4.4}
              floatDelay={0.2}
              shineDelay={0}
            >
              <motion.div
                className="inline-block"
                animate={{ rotate: [0, -12, 10, 0] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Clock3 className="h-5 w-5 stroke-[1.7] dark:text-black" />
              </motion.div>
              <p className="mt-4 text-[25px] font-semibold tracking-[-0.06em] text-black">
                34.5 Min
              </p>
              <p className="mt-1 text-[8px] font-semibold text-black/55">Average resolution time</p>
            </TiltCard>
          </Reveal>

          <Reveal
            className="absolute right-0 top-0 z-20 hidden w-[168px] lg:block"
            x={28}
            y={0}
            delay={0.18}
            amount={0.3}
          >
            <TiltCard
              className="rounded-[16px] border border-black/[0.07] bg-white p-3 shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
              floatDistance={10}
              floatDuration={5}
              floatDelay={0.5}
              shineDelay={1.4}
            >
              <div className="relative grid h-[92px] place-items-center rounded-[12px] bg-[#E7DEFF]">
                <span className="absolute right-2.5 top-2.5 flex h-2.5 w-2.5">
                  <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF7965] opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FF7965]" />
                </span>
                <Headphones className="h-11 w-11 stroke-[1.2] text-black/75" />
              </div>

              <p className="mt-3 text-[9px] font-semibold text-black">Priority ticket</p>
              <p className="mt-0.5 text-[8px] text-black/40">Enterprise customer</p>
            </TiltCard>
          </Reveal>

          <Reveal
            className="absolute bottom-16 left-2 z-20 hidden w-[190px] lg:block"
            x={-24}
            y={0}
            delay={0.24}
            amount={0.3}
          >
            <TiltCard
              className="flex items-center gap-3 rounded-[16px] border border-black/[0.07] bg-white p-3 shadow-[0_15px_40px_rgba(0,0,0,0.09)]"
              floatDistance={8}
              floatDuration={4.8}
              floatDelay={0.1}
              shineDelay={2.6}
            >
              <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-[#F3F1ED]">
                <CircleUserRound className="h-6 w-6 text-black/65" />
                <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                  <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-[#25D366]" />
                </span>
              </span>

              <div className="min-w-0">
                <p className="text-[8px] font-semibold leading-3 text-black/60">
                  Customer replied on WhatsApp
                </p>
                <span className="mt-1.5 inline-flex rounded-full bg-black px-2 py-1 text-[6px] font-bold text-white">
                  View ticket
                </span>
              </div>
            </TiltCard>
          </Reveal>

          <Reveal
            className="absolute bottom-5 right-5 z-20 hidden w-[154px] lg:block"
            x={24}
            y={0}
            delay={0.3}
            amount={0.3}
          >
            <TiltCard
              className="rounded-[16px] border border-black/[0.06] bg-[#FF7C58] p-4 shadow-[0_15px_40px_rgba(0,0,0,0.09)]"
              floatDistance={10}
              floatDuration={5.2}
              floatDelay={0.35}
              shineDelay={0.8}
            >
              <motion.div
                className="inline-block"
                animate={{ scale: [1, 1.18, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <CheckCircle2 className="h-5 w-5 text-black/80" />
              </motion.div>
              <p className="mt-4 text-[22px] font-semibold tracking-[-0.05em] text-black">99.9%</p>
              <p className="mt-0.5 text-[8px] font-semibold text-black/60">SLA compliance</p>
            </TiltCard>
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
    <section
      id="customers"
      className="border-y border-black/[0.06] bg-[#FCFBF8] transition-colors duration-300 dark:border-white/[0.08] dark:bg-[#0F0F1A]"
    >
      <div className="mx-auto max-w-[1180px] px-5 py-8 sm:px-8">
        <Reveal y={14} amount={0.4}>
          <p className="mb-6 text-center text-[9px] font-bold uppercase tracking-[0.18em] text-black/30 dark:text-white/30">
            Trusted by ambitious teams
          </p>
        </Reveal>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:gap-x-12">
          {customers.map((customer, index) => (
            <Reveal key={customer} delay={index * 0.045} y={12} scale={0.97} amount={0.5}>
              <span
                className={`font-semibold tracking-[-0.04em] text-black/55 dark:text-white/55 ${
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
    <section className="bg-white py-20 transition-colors duration-300 sm:py-24 dark:bg-[#14141F]">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal
              key={stat.label}
              className={`text-center ${index !== 0 ? 'sm:border-l sm:border-black/[0.07] dark:sm:border-white/[0.08]' : ''}`}
              delay={index * 0.07}
              y={20}
              amount={0.45}
            >
              <p className="text-[36px] font-semibold tracking-[-0.065em] text-[#111111] sm:text-[42px] dark:text-white">
                {stat.value}
              </p>
              <p className="mt-1 text-[11px] font-medium text-black/38 dark:text-white/40">
                {stat.label}
              </p>
            </Reveal>
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
      className="bg-[#F5F3EF] py-24 transition-colors duration-300 sm:py-28 dark:bg-[#14141F]"
    >
      <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
        <Reveal className="mx-auto max-w-[650px] text-center" y={24} amount={0.3}>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/35 dark:text-white/35">
            One platform
          </p>

          <h2 className="mt-4 text-balance text-[38px] font-semibold leading-[1.02] tracking-[-0.055em] text-[#111111] sm:text-[50px] dark:text-white">
            The support stack your team actually wants to use
          </h2>

          <p className="mx-auto mt-5 max-w-[520px] text-[14px] leading-6 text-black/45 dark:text-white/45">
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
              <article className="group h-full rounded-[24px] border border-black/[0.065] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.07)] dark:border-white/[0.08] dark:bg-[#1B1B29] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                <div className={`grid h-11 w-11 place-items-center rounded-[14px] ${accent}`}>
                  <Icon className="h-5 w-5 stroke-[1.7] text-black/75" />
                </div>

                <h3 className="mt-8 text-[17px] font-semibold tracking-[-0.035em] text-black dark:text-white">
                  {title}
                </h3>

                <p className="mt-2 text-[12px] leading-5 text-black/42 dark:text-white/45">
                  {description}
                </p>
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
    <section
      id="channels"
      className="bg-white py-24 transition-colors duration-300 sm:py-28 dark:bg-[#0F0F1A]"
    >
      <div className="mx-auto grid max-w-[1120px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
        <Reveal className="max-w-[480px]" x={-34} y={0} amount={0.28}>
          <span className="inline-flex rounded-full bg-[#E7DEFF] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-black/55 dark:bg-[#2D2645] dark:text-white/70">
            Omnichannel
          </span>

          <h2 className="mt-5 text-[40px] font-semibold leading-[1.02] tracking-[-0.055em] text-[#111111] sm:text-[50px] dark:text-white">
            Every conversation.
            <br />
            One{' '}
            <span className="relative inline-block whitespace-nowrap">
              calm
              <HandDrawnUnderline color="#8BD5A8" delay={0.15} />
            </span>{' '}
            inbox.
          </h2>

          <p className="mt-5 max-w-[440px] text-[14px] leading-6 text-black/45 dark:text-white/45">
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
                className="flex items-center gap-3 text-[12px] font-medium text-black/65 dark:text-white/65"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#DFF4E8] dark:bg-[#1E3A2A]">
                  <Check className="h-3.5 w-3.5 text-[#39734D] dark:text-[#7FD8A2]" />
                </span>
                {item}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="relative" x={34} y={0} amount={0.22}>
          <div className="rounded-[30px] bg-[#F5F3EF] p-3 dark:bg-[#1B1B29]">
            <div className="rounded-[24px] border border-black/[0.07] bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-7 dark:border-white/[0.08] dark:bg-[#14141F] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold text-black dark:text-white">
                    Conversations by channel
                  </p>
                  <p className="mt-1 text-[12px] text-black/35 dark:text-white/35">This week</p>
                </div>

                <span className="rounded-full border border-black/[0.08] px-3 py-1.5 text-[8px] font-semibold text-black/45 dark:border-white/[0.12] dark:text-white/45">
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

                      <span className="flex-1 text-[11px] font-semibold text-black/65 dark:text-white/65">
                        {channel}
                      </span>

                      <span className="text-[9px] font-medium text-black/35 dark:text-white/35">
                        {tickets} tickets
                      </span>
                    </div>

                    <div className="ml-11 h-1.5 overflow-hidden rounded-full bg-[#F0EEEA] dark:bg-white/10">
                      <motion.div
                        className="h-full rounded-full bg-[#111111] dark:bg-white"
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
                  <div
                    key={label}
                    className="rounded-[14px] bg-[#F8F7F4] px-3 py-4 text-center dark:bg-white/[0.06]"
                  >
                    <p className="text-[17px] font-semibold tracking-[-0.04em] dark:text-white">
                      {value}
                    </p>
                    <p className="mt-1 text-[7px] font-medium text-black/35 dark:text-white/40">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute -bottom-5 -left-5 hidden items-center gap-3 rounded-[15px] border border-black/[0.07] bg-[#FFE36D] p-3 shadow-[0_15px_40px_rgba(0,0,0,0.08)] sm:flex">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/70">
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
            </span>
            <div>
              <p className="text-[8px] font-bold text-black">WhatsApp connected</p>
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
    <section
      id="resources"
      className="bg-[#F5F3EF] py-24 transition-colors duration-300 sm:py-28 dark:bg-[#14141F]"
    >
      <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
        <Reveal className="text-center" y={24} amount={0.3}>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/35 dark:text-white/35">
            Customer stories
          </p>

          <h2 className="mt-4 text-[38px] font-semibold tracking-[-0.055em] text-black sm:text-[48px] dark:text-white">
            Support teams move{' '}
            <span className="relative inline-block whitespace-nowrap">
              faster
              <HandDrawnUnderline color="#FFD968" delay={0.15} />
            </span>{' '}
            with Topiadesk
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
              <article className="h-full rounded-[24px] border border-black/[0.065] bg-white p-6 dark:border-white/[0.08] dark:bg-[#1B1B29]">
                <div
                  className={`mb-7 flex h-10 w-10 items-center justify-center rounded-full ${
                    index === 0 ? 'bg-[#FFE36D]' : index === 1 ? 'bg-[#E7DEFF]' : 'bg-[#DFF4E8]'
                  }`}
                >
                  <span className="text-[10px] font-black text-black">
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
                      className="h-3.5 w-3.5 fill-[#FFB800] text-[#FFB800]"
                    />
                  ))}
                </div>

                <blockquote className="mt-5 text-[14px] leading-6 tracking-[-0.01em] text-black/65 dark:text-white/65">
                  “{testimonial.quote}”
                </blockquote>

                <div className="mt-8 border-t border-black/[0.06] pt-4 dark:border-white/[0.08]">
                  <p className="text-[11px] font-bold text-black dark:text-white">
                    {testimonial.author}
                  </p>
                  <p className="mt-1 text-[9px] text-black/35 dark:text-white/35">
                    {testimonial.role}
                  </p>
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
    <section className="bg-[#F5F3EF] px-5 py-20 transition-colors duration-300 sm:px-8 sm:py-24 dark:bg-[#14141F]">
      <Reveal
        className="relative mx-auto max-w-[1120px] overflow-hidden rounded-[28px] border border-black/[0.08] bg-[#111111] dark:border-white/[0.1]"
        y={24}
        scale={0.985}
        amount={0.25}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-24 h-52 w-52 rounded-full bg-[#E7DEFF]/10" />
          <div className="absolute -bottom-24 -right-16 h-52 w-52 rounded-full bg-[#FFE36D]/10" />
        </div>

        <div className="relative grid lg:grid-cols-[1.35fr_0.65fr]">
          <div className="px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#8BD5A8]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">
                Start today
              </span>
            </div>

            <h2 className="mt-6 max-w-[650px] text-balance text-[38px] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[48px] lg:text-[54px]">
              Give your support team <br className="hidden sm:block" />a{' '}
              <span className="relative inline-block whitespace-nowrap">
                calmer
                <HandDrawnUnderline color="#FFE36D" delay={0.15} />
              </span>{' '}
              place to work.
            </h2>

            <p className="mt-5 max-w-[540px] text-[13px] leading-6 text-white/45 sm:text-[14px]">
              Bring customer conversations, SLAs, support workflows and operations into one
              beautifully simple workspace.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {['14-day free trial', 'No credit card', 'Setup in minutes'].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-[10px] font-medium text-white/45"
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      index === 0 ? 'bg-[#FFE36D]' : index === 1 ? 'bg-[#E7DEFF]' : 'bg-[#8BD5A8]'
                    }`}
                  />

                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/[0.08] px-6 py-10 sm:px-10 lg:flex lg:flex-col lg:justify-center lg:border-l lg:border-t-0 lg:px-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
              Ready when you are
            </p>

            <p className="mt-3 max-w-[300px] text-[14px] leading-6 text-white/65">
              Create your workspace and start bringing your support operation together.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <MotionLink
                href={TRIAL_URL}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex h-[50px] w-full items-center justify-between rounded-full bg-white px-5 text-[11px] font-bold text-black transition-colors duration-200 hover:bg-[#F3F1ED]"
              >
                <span>Start free trial</span>

                <span className="grid h-7 w-7 place-items-center rounded-full bg-black text-white">
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </MotionLink>

              <MotionLink
                href="/contact"
                initial="rest"
                whileHover="hover"
                whileTap={{ scale: 0.97 }}
                className="relative inline-flex h-[50px] w-full items-center justify-center rounded-full border border-white/[0.14] text-[11px] font-semibold text-white/75 transition-colors hover:border-white/25 hover:bg-white/[0.05] hover:text-white"
              >
                Book a personalised demo
                <HandDrawnUnderline
                  trigger="hover"
                  color="#FFE36D"
                  strokeWidth={4}
                  className="pointer-events-none absolute -bottom-0.5 left-10 right-10 h-[6px]"
                />
              </MotionLink>
            </div>

            <p className="mt-5 text-[9px] leading-4 text-white/25">
              No long-term commitment. Talk to our team whenever you need help getting started.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-black/[0.06] bg-[#FCFBF8] transition-colors duration-300 dark:border-white/[0.08] dark:bg-[#0F0F1A]">
      <Reveal className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8" y={18} amount={0.15}>
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-[290px]">
            <BrandMark />
            <p className="mt-4 text-[11px] leading-5 text-black/38 dark:text-white/40">
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
                <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.13em] text-black/45 dark:text-white/45">
                  {column.heading}
                </p>

                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-[10px] font-medium text-black/35 transition hover:text-black dark:text-white/40 dark:hover:text-white"
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

        <div className="mt-12 flex flex-col gap-4 border-t border-black/[0.06] pt-6 text-[9px] text-black/30 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.08] dark:text-white/30">
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
        <div className="min-h-screen bg-[#FCFBF8] text-[#111111] overflow-y-hidden transition-colors duration-300 dark:bg-[#0F0F1A] dark:text-white">
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
