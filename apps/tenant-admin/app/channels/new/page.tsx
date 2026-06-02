'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Globe,
  Loader2,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  cn,
} from '@topiadesk/ui';

type ChannelType = 'email' | 'widget' | 'whatsapp' | 'sms' | 'chat' | 'voice';

const TYPES: { id: ChannelType; label: string; icon: typeof Mail; desc: string }[] = [
  { id: 'email', label: 'Email', icon: Mail, desc: 'Inbound address or forwarding' },
  { id: 'widget', label: 'Web form', icon: Globe, desc: 'Embeddable form widget' },
  { id: 'chat', label: 'Web chat', icon: MessageSquare, desc: 'Live chat bubble' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, desc: 'Meta Cloud API' },
  { id: 'sms', label: 'SMS', icon: Smartphone, desc: 'Twilio / Termii' },
  { id: 'voice', label: 'Voice', icon: Phone, desc: 'Call logging' },
];

export default function NewChannelPage() {
  const [type, setType] = useState<ChannelType>('email');
  const [name, setName] = useState('');
  const [field1, setField1] = useState('');
  const [group, setGroup] = useState('Tier 1 Support');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim().length > 1;
  const cfg = FIELD_CONFIG[type];

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    window.setTimeout(() => setSubmitting(false), 800);
  }

  const TypeIcon = TYPES.find((t) => t.id === type)!.icon;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
        <div className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link href="/channels" className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white">
                <ArrowLeft className="h-3 w-3" /> Channels
              </Link>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">Connect a channel</h1>
              <p className="mt-0.5 text-sm text-white/70">Bring a new source of conversations into your shared inbox.</p>
            </div>
            <Button form="new-channel-form" type="submit" size="sm" disabled={!canSubmit || submitting} className="bg-coral text-white hover:bg-coral-dark">
              {submitting && <Loader2 className="h-3 w-3 animate-spin" />} Connect channel
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <form id="new-channel-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Channel type</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 p-6 sm:grid-cols-3">
                {TYPES.map((t) => {
                  const Icon = t.icon;
                  const selected = type === t.id;
                  return (
                    <button key={t.id} type="button" onClick={() => { setType(t.id); setField1(''); }}
                      className={cn('rounded-lg border p-3 text-left transition-all',
                        selected ? 'border-coral/40 bg-coral/5 ring-2 ring-coral/20' : 'border-border bg-card hover:border-coral/20')}>
                      <Icon className={cn('h-4 w-4', selected ? 'text-coral' : 'text-muted-foreground')} />
                      <p className="mt-1.5 text-sm font-semibold">{t.label}</p>
                      <p className="text-[10px] text-muted-foreground">{t.desc}</p>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="flex items-center gap-2 text-sm"><TypeIcon className="h-4 w-4 text-coral" /> Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Channel name *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Support inbox" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="f1">{cfg.label}</Label>
                  <Input id="f1" value={field1} onChange={(e) => setField1(e.target.value)} placeholder={cfg.placeholder} />
                  <p className="text-[11px] text-muted-foreground">{cfg.hint}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="group">Route new tickets to group</Label>
                  <select id="group" value={group} onChange={(e) => setGroup(e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm">
                    {['Tier 1 Support', 'Tier 2 Support', 'Billing', 'Security Ops', 'IT Operations'].map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Preview</CardTitle></CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <p className="font-semibold">{name || 'Untitled channel'}</p>
                <Badge variant="outline" className="capitalize">{TYPES.find((t) => t.id === type)!.label}</Badge>
                <p className="text-muted-foreground">→ {group}</p>
                <Badge variant="outline" className="text-[10px]">Pending setup</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Tips</CardTitle></CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <Tip text="You can change routing later with automation rules." />
                <Tip text="WhatsApp & SMS may require add-on activation on Starter/Growth plans." />
              </CardContent>
            </Card>
          </aside>
        </form>
      </div>
    </div>
  );
}

const FIELD_CONFIG: Record<ChannelType, { label: string; placeholder: string; hint: string }> = {
  email:    { label: 'Inbound address',  placeholder: 'support@yourco.topiadesk.com', hint: 'Or forward from a custom domain address.' },
  widget:   { label: 'Allowed origin',   placeholder: 'https://www.yourco.com',        hint: 'Where the embed script will run.' },
  chat:     { label: 'Allowed origin',   placeholder: 'https://www.yourco.com',        hint: 'Domain that loads the chat bubble.' },
  whatsapp: { label: 'WhatsApp number',  placeholder: '+234 800 000 0000',             hint: 'Connected via Meta Cloud API.' },
  sms:      { label: 'Sender number / ID', placeholder: 'TOPIA or +234…',              hint: 'Twilio / Termii sender.' },
  voice:    { label: 'Phone number',     placeholder: '+234 1 000 0000',               hint: 'Calls are logged as tickets.' },
};

function Tip({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-md bg-muted/40 p-2">
      <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-coral" />
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}
