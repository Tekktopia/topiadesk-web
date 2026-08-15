// apps/marketing-site/app/contact/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { DemoRequestForm } from '../_components/demo-request-form';
import { HandDrawnUnderline } from '../_components/hand-drawn-underline';

export const metadata: Metadata = {
  title: 'Request a demo — Topiadesk',
  description:
    'Book a personalised Topiadesk demo and see how your team can manage support, operations and infrastructure from one workspace.',
};

const HIGHLIGHTS = [
  {
    icon: Sparkles,
    title: 'Tailored to your workflow',
    body: 'We focus the walkthrough on how your support and operations teams actually work.',
    className: 'bg-[#FFE36D]',
  },
  {
    icon: MapPin,
    title: 'Built for the region',
    body: 'Regional infrastructure, Naira-native billing and operational requirements designed around African teams.',
    className: 'bg-[#E7DEFF]',
  },
  {
    icon: Clock3,
    title: 'Get running quickly',
    body: 'Guided onboarding and migration helps your team move from evaluation to production faster.',
    className: 'bg-[#DFF4E8]',
  },
];

const EXPECTATIONS = [
  'A personalised product walkthrough',
  'Answers specific to your use case',
  'Migration and implementation guidance',
];

function BrandMark() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5"
      aria-label="Topiadesk home"
    >
      <Image
        src="/icons/icon.png"
        alt=""
        width={32}
        height={32}
        priority
        className="h-8 w-8 object-contain"
      />

      <span className="text-[15px] font-bold tracking-[-0.03em] text-[#111111]">
        Topiadesk
      </span>
    </Link>
  );
}

function Header() {
  return (
    <header className="relative z-50 border-b border-black/[0.06] bg-[#FCFBF8]">
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5 sm:px-8">
        <BrandMark />

        <Link
          href="/"
          className="group inline-flex h-10 items-center gap-2 rounded-full border border-black/[0.1] bg-white px-4 text-[11px] font-semibold text-black/60 transition-colors hover:border-black/20 hover:text-black"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to home
        </Link>
      </div>
    </header>
  );
}

function HighlightCard({
  icon: Icon,
  title,
  body,
  className,
}: (typeof HIGHLIGHTS)[number]) {
  return (
    <li className="flex gap-4 rounded-[18px] border border-black/[0.055] bg-[#F7F5F1] p-4 transition-colors hover:bg-[#F3F1ED]">
      <div
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-[12px] ${className}`}
      >
        <Icon className="h-[18px] w-[18px] stroke-[1.7] text-black/70" />
      </div>

      <div className="pt-0.5">
        <p className="text-[13px] font-semibold tracking-[-0.02em] text-[#111111]">
          {title}
        </p>

        <p className="mt-1.5 max-w-[390px] text-[11px] leading-[1.7] text-black/42">
          {body}
        </p>
      </div>
    </li>
  );
}

function Pitch() {
  return (
    <div className="lg:pt-5">
      <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.07] bg-white px-3 py-1.5">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-[#E7DEFF]">
          <Sparkles className="h-3 w-3 text-black/65" />
        </span>

        <span className="text-[9px] font-bold cursor-pointer uppercase tracking-[0.13em] text-black/45">
          Request a demo
        </span>
      </div>

      <h1 className="mt-6 max-w-[580px] text-[45px] font-semibold leading-[0.98] tracking-[-0.065em] text-[#111111] sm:text-[44px] lg:text-[48px]">
        See how{' '}
        <span className="relative inline-block whitespace-nowrap">
          simple
          <HandDrawnUnderline color="#FF7965" delay={0.4} />
        </span>
        <br />
        support can feel.
      </h1>

      <p className="mt-6 max-w-[510px] text-[14px] leading-6 text-black/48 sm:text-[15px]">
        Tell us a little about your team and we&rsquo;ll prepare a personalised
        walkthrough of Topiadesk around the problems you actually need to solve.
      </p>

      <ul className="mt-9 max-w-[530px] space-y-3">
        {HIGHLIGHTS.map((highlight) => (
          <HighlightCard key={highlight.title} {...highlight} />
        ))}
      </ul>

      <a
        href="mailto:sales@tekktopia.com"
        className="group mt-4 flex max-w-[530px] items-center gap-3 rounded-[18px] border border-black/[0.06] bg-[#FFF3B6] p-4 transition-colors hover:bg-[#FFEF9C]"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-white/60">
          <Mail className="h-[18px] w-[18px] text-black/65" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-[9px] font-semibold uppercase tracking-[0.08em] text-black/40">
            Prefer email?
          </span>

          <span className="mt-0.5 block truncate text-[12px] font-bold text-black/70">
            sales@tekktopia.com
          </span>
        </span>

        <ArrowRight className="h-4 w-4 shrink-0 text-black/45 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

function DemoFormPanel() {
  return (
    <div id="demo" className="lg:pl-4">
      <div className="overflow-hidden rounded-[26px] border border-black/[0.08] bg-white">
        <div className="px-6 pb-5 pt-6 sm:px-8 sm:pt-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#8BD5A8]" />

                <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-black/35">
                  Demo request
                </span>
              </div>

              <h2 className="mt-4 text-[26px] font-semibold tracking-[-0.05em] text-[#111111] sm:text-[29px]">
                Tell us about your team
              </h2>

              <p className="mt-2 max-w-[430px] text-[12px] leading-5 text-black/40">
                A few details help us prepare a walkthrough around how your
                team actually works.
              </p>
            </div>

            <div className="hidden shrink-0 items-center gap-2 rounded-full bg-[#F5F3EF] px-3 py-2 sm:flex">
              <Clock3 className="h-3.5 w-3.5 text-black/30" />

              <span className="text-[9px] font-semibold text-black/40">
                ~2 min
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-7 pt-3 sm:px-8 sm:pb-8">
          <div
            className="
              [&_*]:shadow-none

              [&>div]:border-0
              [&>div]:bg-transparent
              [&>div]:p-0
              [&>div]:shadow-none

              [&_form]:m-0
              [&_form]:space-y-5
              [&_form]:rounded-none
              [&_form]:border-0
              [&_form]:bg-transparent
              [&_form]:p-0
              [&_form]:shadow-none
              [&_form]:ring-0

              [&_label]:mb-2
              [&_label]:block
              [&_label]:text-[11px]
              [&_label]:font-semibold
              [&_label]:tracking-[-0.01em]
              [&_label]:text-black/65

              [&_input:not([type='checkbox']):not([type='radio'])]:h-[50px]
              [&_input:not([type='checkbox']):not([type='radio'])]:w-full
              [&_input:not([type='checkbox']):not([type='radio'])]:rounded-[12px]
              [&_input:not([type='checkbox']):not([type='radio'])]:border
              [&_input:not([type='checkbox']):not([type='radio'])]:border-black/[0.09]
              [&_input:not([type='checkbox']):not([type='radio'])]:bg-[#F8F7F4]
              [&_input:not([type='checkbox']):not([type='radio'])]:px-4
              [&_input:not([type='checkbox']):not([type='radio'])]:text-[13px]
              [&_input:not([type='checkbox']):not([type='radio'])]:font-medium
              [&_input:not([type='checkbox']):not([type='radio'])]:text-[#111111]
              [&_input:not([type='checkbox']):not([type='radio'])]:outline-none
              [&_input:not([type='checkbox']):not([type='radio'])]:ring-0
              [&_input:not([type='checkbox']):not([type='radio'])]:transition-colors
              [&_input:not([type='checkbox']):not([type='radio'])]:duration-200

              [&_input:not([type='checkbox']):not([type='radio'])::placeholder]:font-normal
              [&_input:not([type='checkbox']):not([type='radio'])::placeholder]:text-black/28

              [&_input:not([type='checkbox']):not([type='radio']):hover]:border-black/[0.16]

              [&_input:not([type='checkbox']):not([type='radio']):focus]:border-black/40
              [&_input:not([type='checkbox']):not([type='radio']):focus]:bg-white
              [&_input:not([type='checkbox']):not([type='radio']):focus]:outline-none
              [&_input:not([type='checkbox']):not([type='radio']):focus]:ring-0

              [&_input:not([type='checkbox']):not([type='radio']):focus-visible]:outline-none
              [&_input:not([type='checkbox']):not([type='radio']):focus-visible]:ring-0

              [&_select]:h-[50px]
              [&_select]:w-full
              [&_select]:appearance-none
              [&_select]:rounded-[12px]
              [&_select]:border
              [&_select]:border-black/[0.09]
              [&_select]:bg-[#F8F7F4]
              [&_select]:px-4
              [&_select]:text-[13px]
              [&_select]:font-medium
              [&_select]:text-[#111111]
              [&_select]:outline-none
              [&_select]:ring-0
              [&_select]:transition-colors
              [&_select]:duration-200

              [&_select:hover]:border-black/[0.16]

              [&_select:focus]:border-black/40
              [&_select:focus]:bg-white
              [&_select:focus]:outline-none
              [&_select:focus]:ring-0

              [&_select:focus-visible]:outline-none
              [&_select:focus-visible]:ring-0

              [&_textarea]:min-h-[120px]
              [&_textarea]:w-full
              [&_textarea]:resize-none
              [&_textarea]:rounded-[12px]
              [&_textarea]:border
              [&_textarea]:border-black/[0.09]
              [&_textarea]:bg-[#F8F7F4]
              [&_textarea]:px-4
              [&_textarea]:py-3.5
              [&_textarea]:text-[13px]
              [&_textarea]:font-medium
              [&_textarea]:leading-6
              [&_textarea]:text-[#111111]
              [&_textarea]:outline-none
              [&_textarea]:ring-0
              [&_textarea]:transition-colors
              [&_textarea]:duration-200

              [&_textarea::placeholder]:font-normal
              [&_textarea::placeholder]:text-black/28

              [&_textarea:hover]:border-black/[0.16]

              [&_textarea:focus]:border-black/40
              [&_textarea:focus]:bg-white
              [&_textarea:focus]:outline-none
              [&_textarea:focus]:ring-0

              [&_textarea:focus-visible]:outline-none
              [&_textarea:focus-visible]:ring-0

              [&_input[type='checkbox']]:h-4
              [&_input[type='checkbox']]:w-4
              [&_input[type='checkbox']]:rounded
              [&_input[type='checkbox']]:border-black/15
              [&_input[type='checkbox']]:accent-black
              [&_input[type='checkbox']]:ring-0

              [&_input[type='radio']]:h-4
              [&_input[type='radio']]:w-4
              [&_input[type='radio']]:accent-black
              [&_input[type='radio']]:ring-0

              [&_button[type='submit']]:mt-1
              [&_button[type='submit']]:flex
              [&_button[type='submit']]:h-[52px]
              [&_button[type='submit']]:w-full
              [&_button[type='submit']]:items-center
              [&_button[type='submit']]:justify-center
              [&_button[type='submit']]:rounded-full
              [&_button[type='submit']]:border-0
              [&_button[type='submit']]:bg-[#111111]
              [&_button[type='submit']]:px-6
              [&_button[type='submit']]:text-[12px]
              [&_button[type='submit']]:font-semibold
              [&_button[type='submit']]:text-white
              [&_button[type='submit']]:ring-0
              [&_button[type='submit']]:transition-colors
              [&_button[type='submit']]:duration-200

              [&_button[type='submit']:hover]:bg-black/85
              [&_button[type='submit']:focus]:outline-none
              [&_button[type='submit']:focus]:ring-0
              [&_button[type='submit']:focus-visible]:outline-none
              [&_button[type='submit']:focus-visible]:ring-0

              [&_button[type='submit']:disabled]:cursor-not-allowed
              [&_button[type='submit']:disabled]:opacity-40

              [&_[role='alert']]:mt-1.5
              [&_[role='alert']]:text-[10px]
              [&_[role='alert']]:font-medium
              [&_[role='alert']]:text-[#C94E3D]
            "
          >
            <DemoRequestForm />
          </div>

          <div className="mt-6 flex items-start gap-2.5 border-t border-black/[0.055] pt-5">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#DFF4E8]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#39734D]" />
            </span>

            <div>
              <p className="text-[10px] font-semibold text-black/50">
                Your information stays private
              </p>

              <p className="mt-0.5 text-[9px] leading-4 text-black/30">
                We only use these details to arrange and personalise your
                Topiadesk demo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Expectations() {
  return (
    <section className="border-t border-black/[0.055] bg-white">
      <div className="mx-auto max-w-[1160px] px-5 py-10 sm:px-8 sm:py-12">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-black/30">
              What happens next
            </p>

            <h2 className="mt-2 text-[21px] font-semibold tracking-[-0.04em] text-black">
              A useful conversation,
              <br />
              not a sales presentation.
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {EXPECTATIONS.map((expectation, index) => (
              <div
                key={expectation}
                className="flex items-start gap-3 rounded-[16px] border border-black/[0.045] bg-[#F7F5F1] p-4"
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[9px] font-bold ${
                    index === 0
                      ? 'bg-[#FFE36D]'
                      : index === 1
                        ? 'bg-[#E7DEFF]'
                        : 'bg-[#DFF4E8]'
                  }`}
                >
                  {index + 1}
                </span>

                <p className="pt-1 text-[10px] font-semibold leading-4 text-black/55">
                  {expectation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-black/[0.055] bg-[#FCFBF8]">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <BrandMark />

        <div className="flex flex-col gap-3 text-[9px] text-black/30 sm:items-end">
          <p>
            &copy; {new Date().getFullYear()} Tekktopia Ltd. All rights reserved.
          </p>

          <Link
            href="/"
            className="font-semibold text-black/45 transition-colors hover:text-black"
          >
            Back to topiadesk.com
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#111111]">
      <Header />

      <main>
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage:
                'radial-gradient(rgba(0,0,0,0.12) 0.6px, transparent 0.6px)',
              backgroundSize: '24px 24px',
              maskImage: 'linear-gradient(to bottom, black, transparent 72%)',
            }}
          />

          <div className="relative mx-auto grid max-w-[1160px] gap-14 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:py-24">
            <Pitch />
            <DemoFormPanel />
          </div>
        </section>

        <Expectations />
      </main>

      <Footer />
    </div>
  );
}