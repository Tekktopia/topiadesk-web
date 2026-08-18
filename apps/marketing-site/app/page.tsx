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
  ArrowLeftRight,
  Banknote,
  Building2,
  ClipboardCheck,
  Gauge,
  History,
  Lock,
  MapPin,
  Plug,
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
    value: '4.9/5',
    label: 'Customer satisfaction',
  },
];

// Operational, everyday-use features. Product-differentiating capabilities
// (multitenant, insurance model, access control, etc.) live in the
// Capabilities section — kept distinct so nothing is duplicated across the two.
const features = [
  {
    icon: Inbox,
    title: 'One intelligent inbox',
    description:
      'Email, WhatsApp, portal requests and voice conversations arrive in one organized workspace.',
    accent: 'bg-[#FDE7CE]',
  },
  {
    icon: Workflow,
    title: 'Automate the repetitive',
    description:
      'Route requests, trigger workflows and keep every support process moving without manual follow-up.',
    accent: 'bg-[#D7E9F7]',
  },
  {
    icon: Activity,
    title: 'SLA monitoring',
    description:
      'Watch response and resolution targets in real time before important customer requests fall behind.',
    accent: 'bg-[#FDE7CE]',
  },
  {
    icon: PackageCheck,
    title: 'IT asset management',
    description:
      'Connect incidents to devices, ownership and asset history from the same support platform.',
    accent: 'bg-[#D7E9F7]',
  },
  {
    icon: BarChart3,
    title: 'Clear operational reports',
    description:
      'Understand workload, response quality, team performance and service trends without spreadsheet work.',
    accent: 'bg-[#FDE7CE]',
  },
];

// Product-differentiating capabilities — surfaced in the interactive
// Capabilities section. Kept distinct from `features` (no duplicates).
const capabilities = [
  {
    tab: 'Multitenant software',
    icon: Building2,
    title: 'One platform, isolated tenants',
    description:
      'Onboard unlimited brokers on a single, secure platform — every tenant fully isolated, no new infrastructure to stand up. Add a new broker in minutes, not weeks, and manage every tenant from one central console without juggling separate deployments or duplicating support overhead.',
    points: ['Per-tenant isolation', 'Central administration', 'Scales with your book'],
  },
  {
    tab: 'Seamless integration',
    icon: Plug,
    title: 'Plug into the tools you already run',
    description:
      'Connect your existing systems and workflows in minutes, not sprints — data flows where it needs to, automatically. Prebuilt connectors handle the heavy lifting for the tools you already run, and open APIs and webhooks mean anything custom is never off the table.',
    points: ['Prebuilt connectors', 'Open API & webhooks', 'Minutes to connect'],
  },
  {
    tab: 'Procedural migration',
    icon: ArrowLeftRight,
    title: 'A guided path for your whole book',
    description:
      'Bring everything across with a structured, step-by-step migration — nothing left behind, no surprises on go-live day. Every stage is validated before the next one begins, so your team always knows exactly where the migration stands and what happens next.',
    points: ['Step-by-step flow', 'Validated at every stage', 'Zero data loss'],
  },
  {
    tab: 'Insurance model',
    icon: ShieldCheck,
    title: '80+ native insurance objects',
    description:
      'Policies, claims, producers and commissions are first-class data — not bolted onto a generic CRM. That means reporting, automation and search all understand your business the way an insurer actually thinks about it, not the way a generic sales tool does.',
    points: ['Policies & claims', 'Producers & commissions', 'First-class data model'],
  },
  {
    tab: 'Access control',
    icon: Lock,
    title: 'Row-level security at the database',
    description:
      'Access is enforced at the data layer, so every broker sees only their own book — never anyone else’s. Role-based permissions layer on top of that isolation, so admins, agents and producers each see exactly what their job requires and nothing more.',
    points: ['Database-enforced', 'Per-broker visibility', 'Role-based access'],
  },
  {
    tab: 'Audit trail',
    icon: History,
    title: 'A tamper-evident audit trail',
    description:
      'A hash-chained log captures every compliance-relevant change — provably intact and ready for any review. If a regulator or auditor ever asks what happened and when, the answer is already there, timestamped and impossible to quietly edit after the fact.',
    points: ['Hash-chained log', 'Tamper-evident', 'Audit-ready'],
  },
  {
    tab: 'Claims',
    icon: ClipboardCheck,
    title: 'Full FNOL-to-payment flow',
    description:
      'A dedicated claims engine that carries each claim from first notice of loss all the way through to payment. Every step along the way is tracked as its own record, so nothing quietly stalls between intake, assessment and settlement.',
    points: ['Distinct claim entity', 'FNOL to payment', 'Nothing falls through'],
  },
  {
    tab: 'AI cost control',
    icon: Gauge,
    title: 'A hard cap on AI spend',
    description:
      'Every AI call is checked against a hard spend cap before it runs — powerful automation with no runaway bills. You set the ceiling once, and the platform enforces it automatically, call by call, with no manual monitoring or month-end surprises.',
    points: ['Hard spend cap', 'Checked per call', 'No bill surprises'],
  },
  {
    tab: 'Billing',
    icon: Banknote,
    title: 'Naira-native pricing',
    description:
      'Fixed pricing in Naira with zero exposure to exchange-rate movements — budget with confidence. What you’re quoted is what you pay, month after month, regardless of what happens to the exchange rate in between.',
    points: ['Fixed Naira pricing', 'No FX exposure', 'Predictable costs'],
  },
  {
    tab: 'Data residency',
    icon: MapPin,
    title: 'In-country data residency',
    description:
      'Hosted in Nigeria and aligned with the Nigeria Data Protection Act (NDPA) — your data stays home. No cross-border transfer to worry about, and no ambiguity about which jurisdiction’s rules apply to your customers’ data.',
    points: ['In-country hosting', 'NDPA-aligned', 'Data sovereignty'],
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

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/tekktopia/', icon: LinkedInIcon },
  { label: 'X', href: 'https://x.com/tekktopialtd/', icon: XIcon },
  { label: 'Instagram', href: 'https://www.instagram.com/tekktopia/', icon: InstagramIcon },
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
      // Near the top: always show the bar.
      setHidden(false);
    } else if (delta > 4) {
      // Scrolling down: dissolve the bar away.
      setHidden(true);
    } else if (delta < -4) {
      // Scrolling up: reveal the bar.
      setHidden(false);
    }

    lastScrollY.current = latest;
  });

  return (
    <motion.header
      className="sticky top-0 z-50 px-3 pt-3 sm:px-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: hidden ? -120 : 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
    >
      <div className="mx-auto flex h-[58px] max-w-[980px] items-center justify-between rounded-full border border-black/[0.08] bg-white/95 pl-5 pr-3 shadow-[0_10px_35px_rgba(0,0,0,0.14)] backdrop-blur-md transition-colors duration-300 dark:border-white/[0.12] dark:bg-[#1B1B29]/95">
        <BrandMark />

        <nav className="hidden items-center gap-6 lg:flex">
          {/* Product dropdown (hover) → Features / Capabilities */}
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 text-[13px] font-medium text-black/65 transition hover:text-black dark:text-white/60 dark:hover:text-white"
            >
              Product
              <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
            </button>

            <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <div className="rounded-2xl border border-black/[0.07] bg-white p-2 shadow-[0_16px_44px_rgba(0,0,0,0.14)] dark:border-white/[0.1] dark:bg-[#1B1B29]">
                <Link
                  href="#features"
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--brand-orange-soft)] dark:hover:bg-white/[0.06]"
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#FDE7CE] text-[#B96A0A]">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-[13px] font-semibold text-black dark:text-white">
                      Features
                    </span>
                    <span className="block text-[11px] text-black/45 dark:text-white/45">
                      Everyday tools your team uses
                    </span>
                  </span>
                </Link>

                <Link
                  href="#capabilities"
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--brand-blue-soft)] dark:hover:bg-white/[0.06]"
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#D7E9F7] text-[#0F63A0]">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-[13px] font-semibold text-black dark:text-white">
                      Capabilities
                    </span>
                    <span className="block text-[11px] text-black/45 dark:text-white/45">
                      What makes the platform different
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>

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
              color="#F5901F"
              strokeWidth={4}
              className="pointer-events-none absolute -bottom-1.5 left-0 h-[6px] w-full"
            />
          </MotionLink>

          <MotionLink
            href={TRIAL_URL}
            whileTap={{ scale: 0.96 }}
            className="rounded-full bg-[var(--brand-orange)] px-5 py-2.5 text-[12px] font-semibold text-[#111111] shadow-[0_5px_15px_rgba(245,144,31,0.35)] transition-colors duration-200 hover:bg-[var(--brand-orange-hover)]"
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

          <span className="rounded-full bg-[#FDE7CE] px-2 py-1 text-[6px] font-bold text-[#9A5A0A]">
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
                      ? 'bg-[#FDE7CE] text-[#9A5A0A]'
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
              <span className="h-2.5 w-2.5 rounded-full bg-[#F5901F] cursor-pointer" />
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
                color="#F5901F"
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
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--brand-orange)] px-6 text-[12px] font-semibold text-[#111111] shadow-[0_8px_25px_rgba(245,144,31,0.35)] transition-colors duration-200 hover:bg-[var(--brand-orange-hover)]"
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
                color="#F5901F"
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
                  <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5901F] opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#F5901F]" />
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
              className="rounded-[16px] border border-black/[0.06] bg-[#F5901F] p-4 shadow-[0_15px_40px_rgba(0,0,0,0.09)]"
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

// Commented out of the page (see HomePage). Kept for easy restore.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      <div className="mx-auto max-w-[820px] px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-3">
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
      id="features"
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
              <HandDrawnUnderline color="#137CC6" delay={0.15} />
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

// Commented out of the page (see HomePage). Kept for easy restore.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
              <HandDrawnUnderline color="#137CC6" delay={0.15} />
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
                <HandDrawnUnderline color="#F5901F" delay={0.15} />
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
                className="group inline-flex h-[50px] w-full items-center justify-between rounded-full bg-[var(--brand-orange)] px-5 text-[11px] font-bold text-[#111111] transition-colors duration-200 hover:bg-[var(--brand-orange-hover)]"
              >
                <span>Start free trial</span>

                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#111111] text-white">
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
                  color="#137CC6"
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

function Capabilities() {
  const [active, setActive] = useState(0);
  const current = capabilities[active] ?? capabilities[0]!;
  const Icon = current.icon;

  return (
    <section
      id="capabilities"
      className="relative overflow-hidden bg-white py-24 transition-colors duration-300 sm:py-28 dark:bg-[#0F0F1A]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-120px] top-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(245,144,31,0.10)_0%,rgba(245,144,31,0)_70%)]" />
      </div>

      <div className="relative mx-auto max-w-[1120px] px-5 sm:px-8">
        <Reveal className="mx-auto max-w-[650px] text-center" y={24} amount={0.3}>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/35 dark:text-white/35">
            Capabilities
          </p>

          <h2 className="mt-4 text-balance text-[38px] font-semibold leading-[1.02] tracking-[-0.055em] text-[#111111] sm:text-[50px] dark:text-white">
            Built for the way insurance{' '}
            <span className="relative inline-block whitespace-nowrap">
              actually works
              <HandDrawnUnderline color="#F5901F" delay={0.15} />
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-[520px] text-[14px] leading-6 text-black/45 dark:text-white/45">
            The platform advantages that make Topiadesk different — explore what&rsquo;s built in.
          </p>
        </Reveal>

        <Reveal className="mt-14 grid gap-4 lg:grid-cols-[300px_1fr]" y={28} amount={0.2}>
          {/* Tab rail */}
          <div
            role="tablist"
            aria-label="Platform capabilities"
            className="relative flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0"
          >
            {/* Connecting rail line — desktop only */}
            <div className="pointer-events-none absolute bottom-3 left-[27px] top-3 hidden w-px bg-black/[0.06] lg:block dark:bg-white/[0.08]" />

            {capabilities.map((cap, i) => {
              const selected = i === active;
              const TabIcon = cap.icon;
              return (
                <button
                  key={cap.tab}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActive(i)}
                  className={`group relative flex shrink-0 cursor-pointer items-center gap-3 rounded-[14px] border px-3.5 py-2.5 text-left text-[13px] font-medium transition-all lg:shrink ${
                    selected
                      ? 'border-[var(--brand-orange)] bg-[var(--brand-orange-soft)] text-[#111111] dark:text-white'
                      : 'border-transparent text-black/55 hover:bg-black/[0.03] hover:text-black dark:text-white/55 dark:hover:bg-white/[0.05] dark:hover:text-white'
                  }`}
                >
                  <span
                    className={`relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-colors ${
                      selected
                        ? 'border-[var(--brand-orange)] bg-[var(--brand-orange)] text-white'
                        : 'border-black/[0.09] bg-white text-black/35 group-hover:text-black/60 dark:border-white/[0.12] dark:bg-[#1B1B29] dark:text-white/40'
                    }`}
                  >
                    <TabIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="whitespace-nowrap lg:whitespace-normal">{cap.tab}</span>
                </button>
              );
            })}
          </div>

          {/* Preview panel — same dark card treatment as the closing CTA */}
          <div className="relative flex min-h-[440px] flex-col overflow-hidden rounded-[24px] border border-black/[0.08] bg-[#111111] p-7 sm:p-10 dark:border-white/[0.1]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-16 -top-20 h-52 w-52 rounded-full bg-[#E7DEFF]/10" />
              <div className="absolute -bottom-20 -right-14 h-52 w-52 rounded-full bg-[var(--brand-orange)]/12 blur-[80px]" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: EASE_OUT }}
                className="relative flex h-full flex-col gap-6"
              >
                <TiltCard
                  className="inline-block w-fit rounded-[16px]"
                  floatDistance={4}
                  floatDuration={4.6}
                >
                  <div className="grid h-14 w-14 place-items-center rounded-[16px] bg-[#FDE7CE] text-[#B96A0A]">
                    <Icon className="h-7 w-7 stroke-[1.7]" />
                  </div>
                </TiltCard>

                <div>
                  <h3 className="relative inline-block text-[24px] font-semibold tracking-[-0.04em] text-white sm:text-[28px]">
                    {current.title}
                    <HandDrawnUnderline
                      trigger="scroll"
                      color="#F5901F"
                      strokeWidth={4}
                      delay={0.25}
                      className="pointer-events-none absolute -bottom-1 left-0 h-[6px] w-full"
                    />
                  </h3>
                  <p className="mt-4 max-w-[640px] text-[14px] leading-6 text-white/50">
                    {current.description}
                  </p>
                </div>

                <ul className="flex flex-wrap gap-2.5">
                  {current.points.map((point) => (
                    <li
                      key={point}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.06] px-3 py-1.5 text-[11px] font-medium text-white/70"
                    >
                      <Check className="h-3.5 w-3.5 text-[var(--brand-orange)]" />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-col gap-3 pt-1 sm:flex-row">
                  <MotionLink
                    href={TRIAL_URL}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--brand-orange)] px-5 text-[12px] font-semibold text-[#111111] transition-colors hover:bg-[var(--brand-orange-hover)]"
                  >
                    Start free trial
                    <ArrowRight className="h-3.5 w-3.5" />
                  </MotionLink>

                  <MotionLink
                    href="/contact"
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-white/[0.14] px-5 text-[12px] font-semibold text-white/75 transition-colors hover:border-white/25 hover:bg-white/[0.05] hover:text-white"
                  >
                    Request a demo
                  </MotionLink>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
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

            {/* Social links */}
            <div className="mt-6 flex items-center gap-2.5">
              {SOCIALS.map(({ label, href, icon: SocialIcon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-black/[0.08] bg-white text-black/45 transition-colors hover:border-[var(--brand-orange)] hover:text-[var(--brand-orange-active)] dark:border-white/[0.12] dark:bg-[#1B1B29] dark:text-white/50 dark:hover:text-[var(--brand-orange)]"
                >
                  <SocialIcon className="h-4 w-4" />
                </a>
              ))}
            </div>

            {/* Powered by Tekktopia */}
            <a
              href="https://www.tekktopia.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Powered by Tekktopia"
              className="mt-6 inline-flex items-center gap-2 opacity-90 transition-opacity hover:opacity-100"
            >
              <span className="text-[10px] font-medium text-black/35 dark:text-white/40">
                Powered by
              </span>
              <span className="inline-flex rounded-md dark:bg-white/95 dark:px-1.5 dark:py-1">
                <Image
                  src="/tekktopia-logo.png"
                  alt="Tekktopia"
                  width={90}
                  height={35}
                  className="h-10 w-auto"
                />
              </span>
            </a>
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
        <div className="min-h-screen bg-[#FCFBF8] text-[#111111] transition-colors duration-300 dark:bg-[#0F0F1A] dark:text-white">
          <Navigation />
          <main>
            <Hero />
            {/* <CustomerStrip /> */}
            <Stats />
            <Features />
            <Capabilities />
            <Channels />
            {/* <Testimonials /> */}
            <FinalCta />
          </main>
          <Footer />
        </div>
      </MotionConfig>
    </>
  );
}
