'use client';

import { use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Send,
  RotateCcw,
  Receipt,
  Building2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  CreditCard,
  FileText,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  cn,
} from '@topiadesk/ui';
import { useInvoice } from '@/lib/queries';
import type { InvoiceStatus } from '@/lib/mock-data';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function statusInfo(status: InvoiceStatus) {
  switch (status) {
    case 'paid':    return { label: 'Paid',    icon: CheckCircle2, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
    case 'pending': return { label: 'Pending', icon: Clock,        cls: 'bg-blue-50 text-blue-700 border-blue-200',          dot: 'bg-blue-400'   };
    case 'overdue': return { label: 'Overdue', icon: AlertTriangle,cls: 'bg-red-50 text-red-700 border-red-200',             dot: 'bg-red-500 animate-pulse' };
    case 'voided':  return { label: 'Voided',  icon: XCircle,      cls: 'bg-muted text-muted-foreground border-border',      dot: 'bg-muted-foreground' };
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BillingDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const { data: invoice, isPending } = useInvoice(id);

  const st = invoice ? statusInfo(invoice.status) : null;
  const StatusIcon = st?.icon ?? Clock;

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
      {/* ── Fixed header ── */}
      <div className="shrink-0 p-5 pb-0">
      <header className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative">
          <Link href="/billing" className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white/90 transition-colors">
            <ArrowLeft className="h-3 w-3" /> Billing
          </Link>
          {isPending ? (
            <div className="mt-2 space-y-1.5">
              <Skeleton className="h-7 w-48 bg-white/20" />
              <Skeleton className="h-4 w-32 bg-white/10" />
            </div>
          ) : invoice ? (
            <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-white">{invoice.number}</h1>
                  <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold', st?.cls)}>
                    <span className={cn('h-1.5 w-1.5 rounded-full', st?.dot)} />
                    {st?.label}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-white/70">
                  {invoice.tenantName} · {fmtDate(invoice.periodStart)} – {fmtDate(invoice.periodEnd)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {invoice.status === 'overdue' && (
                  <Button size="sm" className="border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" variant="outline">
                    <Send className="mr-1.5 h-3.5 w-3.5" /> Send reminder
                  </Button>
                )}
                {invoice.status === 'voided' || invoice.status === 'paid' ? null : (
                  <Button size="sm" className="border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" variant="outline">
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Mark paid
                  </Button>
                )}
                <Button size="sm" className="bg-coral text-white hover:bg-coral-dark">
                  <Download className="mr-1.5 h-3.5 w-3.5" /> Download PDF
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-white/70">Invoice not found.</p>
          )}
        </div>
      </header>
      </div>

      {/* ── Scrollable content area ── */}
      <div className="flex-1 min-h-0 overflow-hidden">

      {!invoice && !isPending && (
        <div className="h-full overflow-y-auto p-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Receipt className="mb-2 h-8 w-8 text-muted-foreground/30" />
              <p className="font-medium text-foreground">Invoice not found</p>
              <p className="text-sm text-muted-foreground">The invoice ID does not exist.</p>
              <Link href="/billing" className="mt-3"><Button size="sm" variant="outline">Back to billing</Button></Link>
            </CardContent>
          </Card>
        </div>
      )}

      {(isPending || invoice) && (
        <div className="grid h-full gap-5 p-6 lg:grid-cols-3 lg:gap-0 lg:p-0">
          {/* ── Main column ── */}
          <div className="space-y-5 lg:col-span-2 lg:overflow-y-auto lg:p-6">
            {/* Line items */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Line items</CardTitle></CardHeader>
              <CardContent className="p-0">
                {isPending ? (
                  <div className="space-y-3 p-5">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="flex justify-between gap-4">
                        <Skeleton className="h-4 w-64" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                ) : invoice && (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="border-b border-border bg-muted/20">
                          <tr>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Description</th>
                            <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">Qty</th>
                            <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">Unit price</th>
                            <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {invoice.lineItems.map((li) => (
                            <tr key={li.id}>
                              <td className="px-5 py-3 text-foreground">{li.description}</td>
                              <td className="px-5 py-3 text-right text-muted-foreground">{li.quantity}</td>
                              <td className="px-5 py-3 text-right text-muted-foreground">{li.unitPrice > 0 ? fmt(li.unitPrice) : '—'}</td>
                              <td className="px-5 py-3 text-right font-medium text-foreground">{li.total > 0 ? fmt(li.total) : 'Included'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Totals */}
                    <div className="border-t border-border bg-muted/10 px-5 py-4">
                      <div className="ml-auto max-w-xs space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-medium text-foreground">{fmt(invoice.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">VAT / Tax ({invoice.taxRate}%)</span>
                          <span className="font-medium text-foreground">{fmt(invoice.tax)}</span>
                        </div>
                        <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                          <span className="text-foreground">Total</span>
                          <span className="text-foreground">{fmt(invoice.total)}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Payment history */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Payment history</CardTitle></CardHeader>
              <CardContent className="pt-0">
                {isPending ? (
                  <Skeleton className="h-12 w-full" />
                ) : invoice && (
                  invoice.payments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <CreditCard className="mb-2 h-7 w-7 text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground">No payments recorded.</p>
                      {invoice.status === 'overdue' && (
                        <Badge variant="danger" className="mt-2 text-[10px]">Payment overdue</Badge>
                      )}
                    </div>
                  ) : (
                    <div className="divide-y divide-border/60">
                      {invoice.payments.map((pay) => (
                        <div key={pay.id} className="flex items-center justify-between py-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            </span>
                            <div>
                              <p className="text-sm font-medium text-foreground">{pay.method}</p>
                              <p className="text-xs text-muted-foreground font-mono">{pay.reference}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-foreground">{fmt(pay.amount)}</p>
                            <p className="text-xs text-muted-foreground">{fmtDate(pay.paidAt)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            {invoice?.notes && (
              <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>{invoice.notes}</span>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4 lg:overflow-y-auto lg:border-l lg:border-border/60 lg:bg-card/40 lg:p-6">
            {/* Invoice info */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Invoice details</CardTitle></CardHeader>
              <CardContent className="space-y-3 pt-0">
                {isPending ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i}><Skeleton className="mb-1 h-3 w-20" /><Skeleton className="h-4 w-32" /></div>
                  ))
                ) : invoice && (
                  <>
                    {[
                      { icon: FileText,   label: 'Invoice #',    value: invoice.number           },
                      { icon: Calendar,   label: 'Issued',       value: fmtDate(invoice.issuedAt) },
                      { icon: Clock,      label: 'Due date',     value: fmtDate(invoice.dueAt)   },
                      ...(invoice.paidAt ? [{ icon: CheckCircle2, label: 'Paid on', value: fmtDate(invoice.paidAt) }] : []),
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-2.5">
                        <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                          <p className="text-sm text-foreground">{value}</p>
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-border/60 pt-3">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={cn('h-4 w-4', st?.cls.split(' ').find(c => c.startsWith('text-')))} />
                        <span className={cn('text-sm font-semibold', st?.cls.split(' ').find(c => c.startsWith('text-')))}>{st?.label}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Tenant */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Tenant</CardTitle></CardHeader>
              <CardContent className="pt-0">
                {isPending ? (
                  <div className="space-y-2"><Skeleton className="h-4 w-40" /><Skeleton className="h-3 w-28" /></div>
                ) : invoice && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                      <Building2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{invoice.tenantName}</p>
                      <p className="text-xs text-muted-foreground">{invoice.tenantSubdomain}.topiadesk.com</p>
                      <Link
                        href={`/tenants/${invoice.tenantId}`}
                        className="mt-1 text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
                      >
                        View tenant →
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Actions</CardTitle></CardHeader>
              <CardContent className="space-y-2 pt-0">
                <Button variant="outline" className="w-full justify-start text-sm" size="sm">
                  <Download className="mr-2 h-3.5 w-3.5" /> Download PDF
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm" size="sm">
                  <Send className="mr-2 h-3.5 w-3.5" /> Email to tenant
                </Button>
                {(invoice?.status === 'pending' || invoice?.status === 'overdue') && (
                  <Button variant="outline" className="w-full justify-start text-sm" size="sm">
                    <RotateCcw className="mr-2 h-3.5 w-3.5" /> Retry payment
                  </Button>
                )}
                {invoice?.status !== 'voided' && invoice?.status !== 'paid' && (
                  <Button variant="outline" className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:border-red-200 hover:bg-red-50" size="sm">
                    <XCircle className="mr-2 h-3.5 w-3.5" /> Void invoice
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
