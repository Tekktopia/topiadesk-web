'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  ArrowLeft,
  Building2,
  Calendar,
  ChevronDown,
  DollarSign,
  Info,
  Loader2,
  MapPin,
  QrCode,
  Sparkles,
  Tag as TagIcon,
  User,
  X,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Label,
  Textarea,
  cn,
} from '@topiadesk/ui';
import { agentDirectory } from '@/lib/mock-data';
import { initials } from '@/lib/format';

const CATEGORIES = [
  'Laptop',
  'Desktop',
  'Monitor',
  'Printer',
  'CCTV Camera',
  'Mobile Device',
  'Server',
  'Network Equipment',
  'Audio / Video',
  'Furniture',
  'Peripheral',
  'Other',
];

const STATUSES = [
  { id: 'in_stock', label: 'In stock' },
  { id: 'in_use', label: 'In use (assigned)' },
  { id: 'under_repair', label: 'Under repair' },
  { id: 'archived', label: 'Archived' },
];

const LOCATIONS = [
  'Lagos HQ - IT Store',
  'Lagos HQ - Floor 1',
  'Lagos HQ - Floor 2',
  'Lagos HQ - Floor 3',
  'Lagos HQ - Floor 4',
  'Lagos HQ - Floor 5',
  'Ikeja Branch',
  'Nairobi Office',
  'Accra Office',
  'Field / Remote',
];

const TAG_PRESETS = ['critical', 'spare', 'leased', 'loaner', 'finance', 'restricted'];

export default function NewAssetPage() {
  const [category, setCategory] = useState('Laptop');
  const [tag, setTag] = useState('CON-LT-');
  const [name, setName] = useState('');
  const [specs, setSpecs] = useState('');
  const [serial, setSerial] = useState('');
  const [status, setStatus] = useState('in_stock');
  const [assignedTo, setAssignedTo] = useState<string | null>(null);
  const [location, setLocation] = useState('Lagos HQ - IT Store');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [warrantyEnd, setWarrantyEnd] = useState('');
  const [cost, setCost] = useState('');
  const [vendor, setVendor] = useState('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = tag.length > 6 && name && category;

  const autoTagPreview = useMemo(() => {
    const prefix = category === 'Laptop' ? 'LT' : category === 'Desktop' ? 'DT' : category === 'CCTV Camera' ? 'CCTV' : category === 'Mobile Device' ? 'PH' : category === 'Monitor' ? 'MN' : category === 'Printer' ? 'PR' : 'AS';
    return `CON-${prefix}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;
  }, [category]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    window.setTimeout(() => setSubmitting(false), 800);
  }

  function toggleTag(t: string) {
    if (tags.includes(t)) setTags(tags.filter((x) => x !== t));
    else setTags([...tags, t]);
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
        <div className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link
                href="/assets"
                className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white"
              >
                <ArrowLeft className="h-3 w-3" />
                Assets
              </Link>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">
                Add asset
              </h1>
              <p className="mt-0.5 text-sm text-white/70">
                Register a new physical asset and (optionally) assign it to a person.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link href="/assets">Cancel</Link>
              </Button>
              <Button
                form="new-asset-form"
                type="submit"
                size="sm"
                disabled={!canSubmit || submitting}
                className="bg-coral text-white hover:bg-coral-dark"
              >
                {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
                Save asset
              </Button>
              <Button
                form="new-asset-form"
                type="submit"
                size="sm"
                disabled={!canSubmit || submitting}
                className="bg-white text-foreground hover:bg-white/90"
              >
                Save & print label
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <form
          id="new-asset-form"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]"
        >
          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Identity</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Category *</Label>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCategory(c)}
                        className={cn(
                          'rounded-md border px-2.5 py-1.5 text-xs transition-colors',
                          category === c
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border bg-card hover:bg-muted',
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tag">Asset tag *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="tag"
                      value={tag}
                      onChange={(e) => setTag(e.target.value.toUpperCase())}
                      placeholder="CON-LT-015"
                      className="font-mono"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setTag(autoTagPreview)}
                      className="shrink-0"
                    >
                      <Sparkles className="h-3 w-3" />
                      Auto
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Suggested: <span className="font-mono">{autoTagPreview}</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serial">Serial number</Label>
                  <Input
                    id="serial"
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                    placeholder="Manufacturer serial"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name">Asset name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='e.g. MacBook Pro 14" (M3 Pro)'
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="specs">Specifications</Label>
                  <Input
                    id="specs"
                    value={specs}
                    onChange={(e) => setSpecs(e.target.value)}
                    placeholder='e.g. M3 Pro / 18GB RAM / 512GB SSD / Space Black'
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Lifecycle & ownership</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <SelectField
                    value={status}
                    onChange={setStatus}
                    options={STATUSES.map((s) => s.id)}
                    formatLabel={(v) => STATUSES.find((s) => s.id === v)?.label ?? v}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Assigned to</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-md border border-input bg-card px-3 py-2 text-sm hover:bg-muted"
                      >
                        {assignedTo ? (
                          <span className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback>
                                {initials(agentDirectory.find((a) => a.id === assignedTo)?.name ?? '')}
                              </AvatarFallback>
                            </Avatar>
                            {agentDirectory.find((a) => a.id === assignedTo)?.name}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">No one</span>
                        )}
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64">
                      <DropdownMenuItem onSelect={() => setAssignedTo(null)}>
                        — Unassigned —
                      </DropdownMenuItem>
                      {agentDirectory.map((a) => (
                        <DropdownMenuItem key={a.id} onSelect={() => setAssignedTo(a.id)}>
                          <Avatar className="h-5 w-5">
                            <AvatarFallback>{initials(a.name)}</AvatarFallback>
                          </Avatar>
                          {a.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Location</Label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex w-full items-center justify-between rounded-md border border-input bg-card pl-8 pr-3 py-2 text-sm hover:bg-muted"
                        >
                          {location}
                          <ChevronDown className="h-3 w-3 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-64">
                        {LOCATIONS.map((l) => (
                          <DropdownMenuItem key={l} onSelect={() => setLocation(l)}>
                            {l}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Procurement</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor</Label>
                  <div className="relative">
                    <Building2 className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="vendor"
                      value={vendor}
                      onChange={(e) => setVendor(e.target.value)}
                      placeholder="Apple, Dell, Hikvision…"
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Purchase cost (USD)</Label>
                  <div className="relative">
                    <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="cost"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      placeholder="2,499.00"
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchase">Purchase date</Label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="purchase"
                      type="date"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warranty">Warranty end</Label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="warranty"
                      type="date"
                      value={warrantyEnd}
                      onChange={(e) => setWarrantyEnd(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Notes & tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any context other agents should know"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {TAG_PRESETS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleTag(t)}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
                          tags.includes(t)
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-input bg-card text-muted-foreground hover:bg-muted',
                        )}
                      >
                        {tags.includes(t) ? <X className="h-3 w-3" /> : <TagIcon className="h-3 w-3" />}
                        #{t}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <QrCode className="h-4 w-4" />
                  QR label preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-center">
                <div className="mx-auto grid h-24 w-24 place-items-center rounded-md border bg-muted/40">
                  <QrCode className="h-12 w-12 text-muted-foreground" />
                </div>
                <p className="mt-3 font-mono text-xs font-semibold">{tag || autoTagPreview}</p>
                <p className="text-[10px] text-muted-foreground line-clamp-2">{name || 'Asset name'}</p>
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  Print sample label
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <Tip text="Asset tags are immutable once saved — use the auto-generator unless you have a strict numbering scheme." />
                <Tip text="Serial numbers help match warranty claims and vendor support." />
                <Tip text="Assigning the asset to an agent triggers an acknowledgement email." />
                <Tip text="Tag rare items #leased or #loaner to surface them in audits." />
              </CardContent>
            </Card>

            <Badge variant="outline" className="mx-auto block w-fit text-[10px]">
              <Info className="h-3 w-3" />
              Bulk imports are also supported via CSV
            </Badge>
          </aside>
        </form>
      </div>
    </div>
  );
}

function SelectField({
  value,
  onChange,
  options,
  formatLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  formatLabel?: (v: string) => string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-md border border-input bg-card px-3 py-2 text-sm hover:bg-muted"
        >
          {formatLabel ? formatLabel(value) : value}
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {options.map((o) => (
          <DropdownMenuItem key={o} onSelect={() => onChange(o)}>
            {formatLabel ? formatLabel(o) : o}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
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

// Keep some imports referenced
const _icons = User;
void _icons;
