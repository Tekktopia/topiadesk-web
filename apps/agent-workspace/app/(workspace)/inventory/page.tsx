'use client';

import { useState, useMemo } from 'react';
import {
  Server,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Package,
  ShoppingCart,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Skeleton,
  cn,
} from '@topiadesk/ui';
import { useInventory } from '@/lib/queries';
import type { InventoryStatus } from '@/lib/mock-data';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function statusInfo(status: InventoryStatus) {
  switch (status) {
    case 'in_stock':     return { label: 'In stock',     cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'low_stock':    return { label: 'Low stock',    cls: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 'out_of_stock': return { label: 'Out of stock', cls: 'bg-red-50 text-red-700 border-red-200' };
    case 'on_order':     return { label: 'On order',     cls: 'bg-blue-50 text-blue-700 border-blue-200' };
  }
}

function stockBar(qty: number, threshold: number) {
  const max = Math.max(qty, threshold * 3);
  const pct = max > 0 ? (qty / max) * 100 : 0;
  const color =
    qty === 0 ? 'bg-red-400' :
    qty <= threshold ? 'bg-amber-400' :
    'bg-emerald-400';
  return (
    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted/50">
      <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InventoryStatus | 'needs_attention'>('all');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const inventory = useInventory();

  const categories = useMemo(() => {
    const cats = new Set(['All', ...(inventory.data?.map((i) => i.category) ?? [])]);
    return [...cats];
  }, [inventory.data]);

  const counts = useMemo(() => ({
    all: inventory.data?.length ?? 0,
    in_stock: inventory.data?.filter((i) => i.status === 'in_stock').length ?? 0,
    low_stock: inventory.data?.filter((i) => i.status === 'low_stock').length ?? 0,
    out_of_stock: inventory.data?.filter((i) => i.status === 'out_of_stock').length ?? 0,
    on_order: inventory.data?.filter((i) => i.status === 'on_order').length ?? 0,
    needs_attention: inventory.data?.filter((i) => i.status === 'low_stock' || i.status === 'out_of_stock').length ?? 0,
  }), [inventory.data]);

  const totalValue = useMemo(
    () => (inventory.data ?? []).reduce((s, i) => s + i.quantity * i.unitCost, 0),
    [inventory.data],
  );

  const filtered = useMemo(() => {
    return (inventory.data ?? []).filter((item) => {
      const q = search.toLowerCase();
      const matchSearch = !q || item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      const matchStatus =
        statusFilter === 'all' ? true :
        statusFilter === 'needs_attention' ? (item.status === 'low_stock' || item.status === 'out_of_stock') :
        item.status === statusFilter;
      const matchCat = categoryFilter === 'All' || item.category === categoryFilter;
      return matchSearch && matchStatus && matchCat;
    });
  }, [inventory.data, search, statusFilter, categoryFilter]);

  return (
    <div className="space-y-5 p-5">
      {/* ── Gradient header ── */}
      <div
        className="relative -mx-5 -mt-5 mb-1 overflow-hidden px-5 py-6"
        style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
              Infrastructure
            </p>
            <h1 className="font-display mt-0.5 text-2xl font-bold tracking-tight text-white">
              Inventory
            </h1>
            <p className="mt-0.5 text-sm text-white/70">
              {counts.all} SKUs · {counts.needs_attention} need attention · {formatCurrency(totalValue)} total value
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" variant="outline">
              <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
              Create order
            </Button>
            <Button size="sm" className="bg-coral text-white hover:bg-white/90">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add item
            </Button>
          </div>
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'In stock',    value: counts.in_stock,     icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Low stock',   value: counts.low_stock,    icon: AlertTriangle, color: 'text-amber-600 bg-amber-50' },
          { label: 'Out of stock',value: counts.out_of_stock, icon: Package, color: 'text-red-600 bg-red-50' },
          { label: 'On order',    value: counts.on_order,     icon: ShoppingCart, color: 'text-blue-600 bg-blue-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
                <span className={cn('flex h-7 w-7 items-center justify-center rounded-lg', color)}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search items, SKUs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/30 p-0.5">
          {([
            { key: 'all',             label: 'All' },
            { key: 'needs_attention', label: 'Needs attention' },
            { key: 'in_stock',        label: 'In stock' },
            { key: 'on_order',        label: 'On order' },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={cn(
                'rounded-md px-3 py-1 text-xs font-medium transition-all',
                statusFilter === key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {label}
              {key !== 'all' && <span className="ml-1 text-muted-foreground/60">{counts[key]}</span>}
            </button>
          ))}
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-9 rounded-md border border-border/60 bg-background px-3 text-xs text-foreground"
        >
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* ── Table ── */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/20">
                <th className="px-5 py-2.5 text-left text-xs font-semibold text-muted-foreground">Item</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">SKU</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Category</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Location</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-muted-foreground">
                  <span className="flex items-center justify-center gap-1"><ArrowUpDown className="h-3 w-3" />Qty</span>
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Stock level</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground">Unit cost</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Supplier</th>
                <th className="px-3 pr-5 py-2.5 text-left text-xs font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.isPending
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/40">
                      <td className="px-5 py-3"><Skeleton className="h-4 w-40" /></td>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-3 py-3"><Skeleton className="h-4 w-16" /></td>
                      ))}
                    </tr>
                  ))
                : filtered.map((item) => {
                    const st = statusInfo(item.status);
                    return (
                      <tr key={item.id} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors group">
                        <td className="px-5 py-3">
                          <p className="text-xs font-medium text-foreground">{item.name}</p>
                          {item.onOrderQty && (
                            <p className="text-[10px] text-blue-600">{item.onOrderQty} on order</p>
                          )}
                        </td>
                        <td className="px-3 py-3 text-xs font-mono text-muted-foreground">{item.sku}</td>
                        <td className="px-3 py-3 text-xs text-muted-foreground">{item.category}</td>
                        <td className="px-3 py-3 text-xs text-muted-foreground">{item.location}</td>
                        <td className="px-3 py-3 text-center">
                          <span className={cn(
                            'text-sm font-bold',
                            item.quantity === 0 ? 'text-red-600' :
                            item.quantity <= item.reorderThreshold ? 'text-amber-600' :
                            'text-foreground',
                          )}>
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex flex-col gap-1">
                            {stockBar(item.quantity, item.reorderThreshold)}
                            <span className="text-[10px] text-muted-foreground">
                              Reorder at {item.reorderThreshold} · qty {item.reorderQty}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right text-xs font-semibold text-foreground">
                          {formatCurrency(item.unitCost)}
                        </td>
                        <td className="px-3 py-3 text-xs text-muted-foreground">{item.supplier}</td>
                        <td className="px-3 pr-5 py-3">
                          <div className="flex items-center gap-2">
                            <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap', st.cls)}>
                              {st.label}
                            </span>
                            {(item.status === 'low_stock' || item.status === 'out_of_stock') && (
                              <Button size="sm" variant="outline" className="h-6 px-2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                                Order
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
          {!inventory.isPending && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="mb-2 h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm font-medium text-foreground">No inventory items found</p>
              <p className="text-xs text-muted-foreground">Adjust your search or filters.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
