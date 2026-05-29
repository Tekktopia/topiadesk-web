'use client';

import { use } from 'react';
import Link from 'next/link';
import { Boxes, Laptop, Monitor, Printer, Smartphone, Camera, Server, HardDrive, Tag, MapPin, Calendar, ShieldCheck, User, Ticket, ClipboardCheck, Edit3, AlertTriangle, CheckCircle2, Clock, PlusCircle } from 'lucide-react';
import { Avatar, AvatarFallback, Badge, Button, Card, CardContent, CardHeader, CardTitle, Skeleton, cn } from '@topiadesk/ui';
import { useAssets, useAssetHistory } from '@/lib/queries';
import type { MockAsset, AssetEventType } from '@/lib/mock-data';

function categoryIcon(cat: string) {
  if (cat.includes('Laptop')) return Laptop;
  if (cat.includes('Desktop')) return Monitor;
  if (cat.includes('Printer')) return Printer;
  if (cat.includes('Mobile')) return Smartphone;
  if (cat.includes('CCTV')) return Camera;
  if (cat.includes('Server')) return Server;
  if (cat.includes('Monitor')) return Monitor;
  return HardDrive;
}

function statusInfo(status: MockAsset['status']) {
  switch (status) {
    case 'in_use':       return { label: 'In use',       cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'in_stock':     return { label: 'In stock',     cls: 'bg-blue-50 text-blue-700 border-blue-200' };
    case 'under_repair': return { label: 'Under repair', cls: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 'lost':         return { label: 'Lost',         cls: 'bg-red-50 text-red-700 border-red-200' };
  }
}

function warrantyStatus(end: string) {
  const days = Math.round((new Date(end).getTime() - Date.now()) / 86_400_000);
  if (days < 0) return { label: 'Expired', cls: 'text-red-600', icon: AlertTriangle };
  if (days <= 30) return { label: `${days}d left`, cls: 'text-amber-600', icon: AlertTriangle };
  if (days <= 90) return { label: `${days}d left`, cls: 'text-amber-500', icon: Clock };
  return { label: `${days}d left`, cls: 'text-emerald-600', icon: CheckCircle2 };
}

function eventIcon(type: AssetEventType) {
  switch (type) {
    case 'added':         return <PlusCircle className="h-3.5 w-3.5 text-blue-500" />;
    case 'assigned':      return <User className="h-3.5 w-3.5 text-emerald-500" />;
    case 'unassigned':    return <User className="h-3.5 w-3.5 text-muted-foreground" />;
    case 'repaired':      return <CheckCircle2 className="h-3.5 w-3.5 text-amber-500" />;
    case 'audited':       return <ClipboardCheck className="h-3.5 w-3.5 text-blue-500" />;
    case 'ticket_linked': return <Ticket className="h-3.5 w-3.5 text-coral" />;
    case 'warranty_noted': return <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />;
  }
}

function timeAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AssetDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const assets = useAssets();
  const history = useAssetHistory(id);
  const asset = assets.data?.find((a) => a.id === id) ?? assets.data?.[0];
  const CategoryIcon = asset ? categoryIcon(asset.category) : Boxes;
  const st = asset ? statusInfo(asset.status) : null;
  const wst = asset ? warrantyStatus(asset.warrantyEnd) : null;
  const WarIcon = wst?.icon ?? CheckCircle2;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
      <header className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="relative">
          <Link href="/assets" className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white/90 transition-colors">
            Infrastructure · Assets
          </Link>
          {assets.isPending ? (
            <div className="mt-2 space-y-1.5">
              <Skeleton className="h-7 w-56 bg-white/20" />
              <Skeleton className="h-4 w-32 bg-white/10" />
            </div>
          ) : asset ? (
            <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <CategoryIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold tracking-tight text-white">{asset.name}</h1>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-sm text-white/70">{asset.tag}</span>
                    <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/80">{asset.category}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" variant="outline">
                  <Ticket className="mr-1.5 h-3.5 w-3.5" /> Link ticket
                </Button>
                <Button size="sm" className="bg-coral text-white hover:bg-white/90">
                  <Edit3 className="mr-1.5 h-3.5 w-3.5" /> Edit asset
                </Button>
              </div>
            </div>
          ) : <p className="mt-2 text-white/70">Asset not found</p>}
        </div>
      </header>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">

      {!asset && !assets.isPending && (
        <div className="h-full overflow-y-auto p-5">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Boxes className="mb-2 h-8 w-8 text-muted-foreground/30" />
              <p className="font-medium text-foreground">Asset not found</p>
              <p className="text-sm text-muted-foreground">The asset ID does not exist in the register.</p>
              <Link href="/assets" className="mt-3"><Button size="sm" variant="outline">Back to inventory</Button></Link>
            </CardContent>
          </Card>
        </div>
      )}

      {(assets.isPending || asset) && (
        <div className="grid h-full gap-5 p-5 lg:grid-cols-3 lg:gap-0 lg:p-0">
          <div className="space-y-5 lg:col-span-2 lg:overflow-y-auto lg:p-5">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Asset details</CardTitle></CardHeader>
              <CardContent className="pt-0">
                {assets.isPending ? (
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i}><Skeleton className="mb-1 h-3 w-20" /><Skeleton className="h-4 w-32" /></div>
                    ))}
                  </div>
                ) : asset && (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Status</p>
                      <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold', st?.cls)}>{st?.label}</span>
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Category</p>
                      <p className="text-sm text-foreground">{asset.category}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Location</p>
                      <span className="flex items-center gap-1.5 text-sm text-foreground"><MapPin className="h-3.5 w-3.5 text-muted-foreground" />{asset.location}</span>
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Assigned to</p>
                      {asset.assignedTo ? (
                        <div className="flex items-center gap-1.5">
                          <Avatar className="h-5 w-5"><AvatarFallback className="bg-blue-100 text-[9px] font-bold text-blue-700">{asset.assignedTo.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback></Avatar>
                          <span className="text-sm text-foreground">{asset.assignedTo.name}</span>
                        </div>
                      ) : <span className="text-sm text-muted-foreground">Unassigned</span>}
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Purchase date</p>
                      <span className="flex items-center gap-1.5 text-sm text-foreground"><Calendar className="h-3.5 w-3.5 text-muted-foreground" />{asset.purchaseDate}</span>
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Warranty end</p>
                      <span className={cn('flex items-center gap-1.5 text-sm font-medium', wst?.cls)}>
                        <WarIcon className="h-3.5 w-3.5" />{asset.warrantyEnd} ({wst?.label})
                      </span>
                    </div>
                    <div className="col-span-2">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Specifications</p>
                      <p className="text-sm text-foreground">{asset.specifications}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Activity history</CardTitle></CardHeader>
              <CardContent className="pt-0">
                {history.isPending ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
                        <div className="flex-1 space-y-1"><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-24" /></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative space-y-4">
                    <div className="absolute left-[11px] top-0 h-full w-px bg-border/60" />
                    {history.data?.map((ev) => (
                      <div key={ev.id} className="relative flex gap-3">
                        <div className="z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background ring-2 ring-border/60">
                          {eventIcon(ev.type)}
                        </div>
                        <div className="min-w-0 flex-1 pb-1">
                          <p className="text-xs font-medium text-foreground leading-snug">{ev.description}</p>
                          <p className="mt-0.5 text-[10px] text-muted-foreground">{ev.actor} · {timeAgo(ev.at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 lg:overflow-y-auto lg:border-l lg:border-border/60 lg:bg-card/40 lg:p-5">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Quick actions</CardTitle></CardHeader>
              <CardContent className="space-y-2 pt-0">
                <Button variant="outline" className="w-full justify-start text-sm" size="sm"><User className="mr-2 h-3.5 w-3.5" /> Reassign asset</Button>
                <Button variant="outline" className="w-full justify-start text-sm" size="sm"><ClipboardCheck className="mr-2 h-3.5 w-3.5" /> Mark as audited</Button>
                <Button variant="outline" className="w-full justify-start text-sm" size="sm"><Ticket className="mr-2 h-3.5 w-3.5" /> Create repair ticket</Button>
                <Button variant="outline" className="w-full justify-start text-sm" size="sm"><Tag className="mr-2 h-3.5 w-3.5" /> Print asset tag</Button>
              </CardContent>
            </Card>
            {asset?.assignedTo && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Assigned user</CardTitle></CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10"><AvatarFallback className="bg-blue-100 font-bold text-blue-700">{asset.assignedTo.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback></Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{asset.assignedTo.name}</p>
                      <p className="text-xs text-muted-foreground">{asset.assignedTo.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Related tickets</CardTitle></CardHeader>
              <CardContent className="pt-0">
                {asset?.linkedAssetId ? (
                  <Link href="/tickets/t-1024" className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2.5 hover:bg-muted/60 transition-colors">
                    <Ticket className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium text-foreground">#1024 — VPN issue</p>
                      <Badge variant="warning" className="text-[9px]">at risk</Badge>
                    </div>
                  </Link>
                ) : <p className="text-xs text-muted-foreground">No linked tickets.</p>}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}