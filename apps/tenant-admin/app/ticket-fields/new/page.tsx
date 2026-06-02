'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, GripVertical, Loader2, Plus, Sparkles, X } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Switch,
  cn,
} from '@topiadesk/ui';

type FieldType = 'text' | 'number' | 'dropdown' | 'multiselect' | 'date' | 'checkbox' | 'url' | 'currency';

const TYPES: { id: FieldType; label: string }[] = [
  { id: 'text', label: 'Text' },
  { id: 'number', label: 'Number' },
  { id: 'dropdown', label: 'Dropdown' },
  { id: 'multiselect', label: 'Multi-select' },
  { id: 'date', label: 'Date' },
  { id: 'checkbox', label: 'Checkbox' },
  { id: 'url', label: 'URL' },
  { id: 'currency', label: 'Currency' },
];

const HAS_OPTIONS: FieldType[] = ['dropdown', 'multiselect'];

function keyify(v: string) {
  return v.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

export default function NewTicketFieldPage() {
  const [label, setLabel] = useState('');
  const [keyTouched, setKeyTouched] = useState(false);
  const [key, setKey] = useState('');
  const [type, setType] = useState<FieldType>('text');
  const [required, setRequired] = useState(false);
  const [customerVisible, setCustomerVisible] = useState(false);
  const [helpText, setHelpText] = useState('');
  const [options, setOptions] = useState<string[]>(['Option 1', 'Option 2']);
  const [optionInput, setOptionInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const effectiveKey = keyTouched ? key : keyify(label);
  const canSubmit = label.trim().length > 1 && !!effectiveKey && (!HAS_OPTIONS.includes(type) || options.length > 0);

  function addOption(v: string) {
    const t = v.trim();
    if (!t || options.includes(t)) return;
    setOptions([...options, t]);
    setOptionInput('');
  }
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    window.setTimeout(() => setSubmitting(false), 800);
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
        <div className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link href="/ticket-fields" className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white">
                <ArrowLeft className="h-3 w-3" /> Ticket fields
              </Link>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">New custom field</h1>
              <p className="mt-0.5 text-sm text-white/70">Capture extra structured data on every ticket. Used by automations and reports.</p>
            </div>
            <Button form="new-field-form" type="submit" size="sm" disabled={!canSubmit || submitting} className="bg-coral text-white hover:bg-coral-dark">
              {submitting && <Loader2 className="h-3 w-3 animate-spin" />} Save field
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <form id="new-field-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Definition</CardTitle></CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label htmlFor="label">Field label *</Label>
                  <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Branch office" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="key">API key</Label>
                  <Input id="key" value={effectiveKey} onChange={(e) => { setKeyTouched(true); setKey(keyify(e.target.value)); }}
                    className="font-mono text-sm" placeholder="branch_office" />
                  <p className="text-[11px] text-muted-foreground">Used in the API and automation references.</p>
                </div>
                <div className="space-y-2">
                  <Label>Field type</Label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {TYPES.map((t) => (
                      <button key={t.id} type="button" onClick={() => setType(t.id)}
                        className={cn('rounded-md border py-2 text-[11px] transition-colors',
                          type === t.id ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card hover:bg-muted')}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="help">Help text</Label>
                  <Input id="help" value={helpText} onChange={(e) => setHelpText(e.target.value)} placeholder="Shown beneath the field" />
                </div>
              </CardContent>
            </Card>

            {HAS_OPTIONS.includes(type) && (
              <Card>
                <CardHeader className="border-b py-3"><CardTitle className="text-sm">Options</CardTitle></CardHeader>
                <CardContent className="space-y-3 p-6">
                  <ul className="space-y-1.5">
                    {options.map((o) => (
                      <li key={o} className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-xs">
                        <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="flex-1">{o}</span>
                        <button type="button" onClick={() => setOptions(options.filter((x) => x !== o))} aria-label={`Remove ${o}`}>
                          <X className="h-3 w-3 text-muted-foreground hover:text-red-600" />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <Input value={optionInput} onChange={(e) => setOptionInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addOption(optionInput); } }}
                      placeholder="Add an option, press Enter" className="h-8 text-xs" />
                    <Button type="button" variant="outline" size="sm" onClick={() => addOption(optionInput)}><Plus className="h-3 w-3" /></Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Behaviour</CardTitle></CardHeader>
              <CardContent className="space-y-1 p-6">
                <label className="flex cursor-pointer items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">Required</p>
                    <p className="text-[11px] text-muted-foreground">Agents must fill this before saving.</p>
                  </div>
                  <Switch checked={required} onCheckedChange={setRequired} />
                </label>
                <label className="flex cursor-pointer items-center justify-between border-t py-2">
                  <div>
                    <p className="text-sm font-medium">Visible to customers</p>
                    <p className="text-[11px] text-muted-foreground">Shown on the portal form and ticket view.</p>
                  </div>
                  <Switch checked={customerVisible} onCheckedChange={setCustomerVisible} />
                </label>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Preview</CardTitle></CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <Label>{label || 'Field label'} {required && <span className="text-red-500">*</span>}</Label>
                <div className="rounded-md border bg-muted/30 px-3 py-2 text-muted-foreground">
                  {type === 'checkbox' ? '☐ ' : ''}{TYPES.find((t) => t.id === type)!.label} input
                </div>
                {helpText && <p className="text-[10px] text-muted-foreground">{helpText}</p>}
                <div className="flex flex-wrap gap-1 pt-1">
                  <Badge variant="outline" className="capitalize">{type}</Badge>
                  {required && <Badge variant="outline">Required</Badge>}
                  <Badge variant="outline">{customerVisible ? 'Customer-visible' : 'Agent-only'}</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Tips</CardTitle></CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <Tip text="Up to 50 custom fields per tenant. Keep labels short and specific." />
                <Tip text="Dropdown fields make great automation conditions." />
              </CardContent>
            </Card>
          </aside>
        </form>
      </div>
    </div>
  );
}

function Tip({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-md bg-muted/40 p-2">
      <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-coral" />
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}
