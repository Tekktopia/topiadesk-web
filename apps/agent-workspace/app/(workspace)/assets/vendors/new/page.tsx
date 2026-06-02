'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Loader2, Sparkles, Star } from 'lucide-react';
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
  Textarea,
  cn,
} from '@topiadesk/ui';

const PAYMENT_TERMS = ['Due on receipt', 'NET-15', 'NET-30', 'NET-60', 'Prepaid'];
const SUGGESTED_CATEGORIES = ['Computers', 'Network', 'Peripherals', 'CCTV & Security', 'Printers', 'Software licenses', 'Consumables', 'AV / Meeting rooms'];

export default function NewVendorPage() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [taxId, setTaxId] = useState('');
  const [terms, setTerms] = useState('NET-30');
  const [categories, setCategories] = useState<string[]>([]);
  const [rating, setRating] = useState(0);
  const [preferred, setPreferred] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim().length > 1 && (!email || /.+@.+\..+/.test(email));

  function toggleCategory(c: string) {
    setCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
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
              <Link href="/assets" className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white">
                <ArrowLeft className="h-3 w-3" /> Assets
              </Link>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">New vendor</h1>
              <p className="mt-0.5 text-sm text-white/70">A supplier you procure assets, software, or services from.</p>
            </div>
            <Button form="new-vendor-form" type="submit" size="sm" disabled={!canSubmit || submitting} className="bg-coral text-white hover:bg-coral-dark">
              {submitting && <Loader2 className="h-3 w-3 animate-spin" />} Save vendor
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <form id="new-vendor-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="flex items-center gap-2 text-sm"><Building2 className="h-4 w-4 text-coral" /> Company</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name">Vendor name *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dell Technologies Nigeria" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact person</Label>
                  <Input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="e.g. Ngozi Eze" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="sales@vendor.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 800 000 0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax">Tax ID / TIN</Label>
                  <Input id="tax" value={taxId} onChange={(e) => setTaxId(e.target.value)} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Commercial</CardTitle></CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Payment terms</Label>
                    <select value={terms} onChange={(e) => setTerms(e.target.value)} className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm">
                      {PAYMENT_TERMS.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Rating</Label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <button key={i} type="button" onClick={() => setRating(i === rating ? 0 : i)} aria-label={`${i} star`}>
                          <Star className={cn('h-5 w-5', i <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground')} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Categories supplied</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_CATEGORIES.map((c) => (
                      <button key={c} type="button" onClick={() => toggleCategory(c)}
                        className={cn('rounded-full border px-2.5 py-1 text-[11px] transition-colors',
                          categories.includes(c) ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card hover:bg-muted')}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="flex cursor-pointer items-center justify-between border-t pt-3">
                  <div>
                    <p className="text-sm font-medium">Preferred vendor</p>
                    <p className="text-[11px] text-muted-foreground">Surface first when raising purchase orders.</p>
                  </div>
                  <Switch checked={preferred} onCheckedChange={setPreferred} />
                </label>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Notes</CardTitle></CardHeader>
              <CardContent className="p-6">
                <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Account number, rep notes, SLA terms…" />
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Preview</CardTitle></CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <p className="font-semibold">{name || 'Untitled vendor'}</p>
                {contact && <p className="text-muted-foreground">{contact}{email ? ` · ${email}` : ''}</p>}
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  <Badge variant="outline">{terms}</Badge>
                  {preferred && <Badge className="bg-emerald-100 text-emerald-700">Preferred</Badge>}
                  {rating > 0 && <Badge variant="outline">{'★'.repeat(rating)}</Badge>}
                </div>
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {categories.map((c) => <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>)}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Tips</CardTitle></CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <Tip text="Linked POs, invoices, and purchased assets roll up on the vendor record." />
                <Tip text="Bank details are encrypted at rest — add them after creation." />
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
