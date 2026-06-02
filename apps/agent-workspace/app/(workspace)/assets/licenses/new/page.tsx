'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, KeyRound, Loader2, Sparkles } from 'lucide-react';
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
import type { LicenseVendorCategory } from '@/lib/mock-data';

const CATEGORIES: { id: LicenseVendorCategory; label: string }[] = [
  { id: 'productivity', label: 'Productivity' },
  { id: 'security', label: 'Security' },
  { id: 'network', label: 'Network' },
  { id: 'finance', label: 'Finance' },
  { id: 'communication', label: 'Communication' },
  { id: 'design', label: 'Design' },
  { id: 'crm', label: 'CRM' },
];

const LICENSE_TYPES = ['Subscription', 'Perpetual', 'Freemium'];

export default function NewLicensePage() {
  const [name, setName] = useState('');
  const [vendor, setVendor] = useState('');
  const [category, setCategory] = useState<LicenseVendorCategory>('productivity');
  const [licenseType, setLicenseType] = useState('Subscription');
  const [deviceBased, setDeviceBased] = useState(false);
  const [seats, setSeats] = useState('50');
  const [seatsUsed, setSeatsUsed] = useState('0');
  const [cost, setCost] = useState('');
  const [renewalDate, setRenewalDate] = useState('');
  const [owner, setOwner] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim().length > 1 && vendor.trim().length > 1;
  const overAllocated = !deviceBased && Number(seatsUsed) > Number(seats);

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
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">New software license</h1>
              <p className="mt-0.5 text-sm text-white/70">Track seats, renewal, and cost. Renewal alerts auto-create procurement tickets.</p>
            </div>
            <Button form="new-license-form" type="submit" size="sm" disabled={!canSubmit || submitting} className="bg-coral text-white hover:bg-coral-dark">
              {submitting && <Loader2 className="h-3 w-3 animate-spin" />} Save license
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <form id="new-license-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="flex items-center gap-2 text-sm"><KeyRound className="h-4 w-4 text-coral" /> Software</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Product name *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Microsoft 365 Business Premium" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor *</Label>
                  <Input id="vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="e.g. Microsoft" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Category</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((c) => (
                      <button key={c.id} type="button" onClick={() => setCategory(c.id)}
                        className={cn('rounded-full border px-2.5 py-1 text-[11px] transition-colors',
                          category === c.id ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card hover:bg-muted')}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>License type</Label>
                  <div className="flex gap-1.5">
                    {LICENSE_TYPES.map((t) => (
                      <button key={t} type="button" onClick={() => setLicenseType(t)}
                        className={cn('flex-1 rounded-md border py-2 text-[11px] transition-colors',
                          licenseType === t ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card hover:bg-muted')}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Seats &amp; cost</CardTitle></CardHeader>
              <CardContent className="space-y-4 p-6">
                <label className="flex cursor-pointer items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="text-sm font-medium">Device-based / infrastructure</p>
                    <p className="text-[11px] text-muted-foreground">No per-seat count (e.g. a server or appliance license).</p>
                  </div>
                  <Switch checked={deviceBased} onCheckedChange={setDeviceBased} />
                </label>
                <div className={cn('grid gap-4 sm:grid-cols-2', deviceBased && 'opacity-50 pointer-events-none')}>
                  <div className="space-y-2">
                    <Label htmlFor="seats">Seats purchased</Label>
                    <Input id="seats" type="number" min={0} value={seats} onChange={(e) => setSeats(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="used">Seats used</Label>
                    <Input id="used" type="number" min={0} value={seatsUsed} onChange={(e) => setSeatsUsed(e.target.value)} />
                  </div>
                </div>
                {overAllocated && <p className="text-[11px] text-red-600">Seats used exceeds seats purchased — review allocation.</p>}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost / year (USD)</Label>
                    <Input id="cost" type="number" min={0} value={cost} onChange={(e) => setCost(e.target.value)} placeholder="22800" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="renewal">Renewal date</Label>
                    <Input id="renewal" type="date" value={renewalDate} onChange={(e) => setRenewalDate(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner">Owner</Label>
                  <Input id="owner" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="e.g. Tunde Bakare" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="License key location, contract reference…" />
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Preview</CardTitle></CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <p className="font-semibold">{name || 'Untitled license'}</p>
                <p className="text-muted-foreground">{vendor || 'Vendor'}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  <Badge variant="outline" className="capitalize">{category}</Badge>
                  <Badge variant="outline">{licenseType}</Badge>
                  {deviceBased
                    ? <Badge variant="outline">Device-based</Badge>
                    : <Badge variant="outline">{seatsUsed}/{seats} seats</Badge>}
                </div>
                {cost && <p className="pt-1 font-medium">${Number(cost).toLocaleString()}/yr</p>}
                {renewalDate && <p className="text-muted-foreground">Renews {renewalDate}</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="border-b py-3"><CardTitle className="text-sm">Tips</CardTitle></CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <Tip text="Renewal alerts fire at 90/60/30 days and open a procurement ticket." />
                <Tip text="Over-allocation flags help you stay compliant in audits." />
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
