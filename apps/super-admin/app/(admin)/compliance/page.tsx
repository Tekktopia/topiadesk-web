'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Filter,
  Globe2,
  Inbox,
  Lock,
  MoreHorizontal,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  UserX,
  XCircle,
} from 'lucide-react';
import {
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
  cn,
} from '@topiadesk/ui';

type RequestType = 'data_export' | 'deletion' | 'access' | 'rectification' | 'portability';
type RequestStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';

interface DataRequest {
  id: string;
  type: RequestType;
  tenantId: string;
  tenantName: string;
  requesterName: string;
  requesterEmail: string;
  status: RequestStatus;
  region: 'EU' | 'UK' | 'NG' | 'KE' | 'ZA' | 'US';
  jurisdiction: string;
  receivedAt: string;
  dueAt: string;
  notes?: string;
}

const REQUESTS: DataRequest[] = [
  {
    id: 'dr-1024', type: 'deletion', tenantId: 't-acme', tenantName: 'AcmeBank Nigeria',
    requesterName: 'Sarah Okonkwo', requesterEmail: 'sarah.o@acmebank.ng',
    status: 'in_progress', region: 'NG', jurisdiction: 'NDPR Article 23',
    receivedAt: new Date(Date.now() - 4 * 86_400_000).toISOString(),
    dueAt: new Date(Date.now() + 26 * 86_400_000).toISOString(),
    notes: 'Awaiting compliance review before purge',
  },
  {
    id: 'dr-1023', type: 'data_export', tenantId: 't-safari', tenantName: 'SafariHold',
    requesterName: 'Daniel Mwangi', requesterEmail: 'd.mwangi@safarihold.co.ke',
    status: 'pending', region: 'KE', jurisdiction: 'Data Protection Act',
    receivedAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
    dueAt: new Date(Date.now() + 4 * 86_400_000).toISOString(),
  },
  {
    id: 'dr-1022', type: 'access', tenantId: 't-flair', tenantName: 'FlairTech Solutions',
    requesterName: 'Joshua Adekunle', requesterEmail: 'josh@flairtech.ng',
    status: 'completed', region: 'NG', jurisdiction: 'NDPR Article 22',
    receivedAt: new Date(Date.now() - 10 * 86_400_000).toISOString(),
    dueAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
  },
  {
    id: 'dr-1021', type: 'portability', tenantId: 't-kasi', tenantName: 'KasiPay',
    requesterName: 'Tunde A.', requesterEmail: 'tunde@kasi-pay.co.za',
    status: 'completed', region: 'ZA', jurisdiction: 'POPIA Section 27',
    receivedAt: new Date(Date.now() - 18 * 86_400_000).toISOString(),
    dueAt: new Date(Date.now() - 12 * 86_400_000).toISOString(),
  },
  {
    id: 'dr-1020', type: 'rectification', tenantId: 't-darport', tenantName: 'Dar Port Authority',
    requesterName: 'Emmanuel Diallo', requesterEmail: 'emm@dakarlink.sn',
    status: 'pending', region: 'EU', jurisdiction: 'GDPR Article 16',
    receivedAt: new Date(Date.now() - 1 * 86_400_000).toISOString(),
    dueAt: new Date(Date.now() + 29 * 86_400_000).toISOString(),
  },
];

const TYPE_META: Record<RequestType, { label: string; icon: typeof FileText; color: string; bg: string }> = {
  data_export:   { label: 'Data export',   icon: Download,  color: 'text-blue-600',   bg: 'bg-blue-50' },
  deletion:      { label: 'Erasure',       icon: Trash2,    color: 'text-red-600',    bg: 'bg-red-50' },
  access:        { label: 'Access',        icon: FileText,  color: 'text-violet-600', bg: 'bg-violet-50' },
  rectification: { label: 'Rectification', icon: ShieldCheck,color: 'text-amber-600', bg: 'bg-amber-50' },
  portability:   { label: 'Portability',   icon: Archive,   color: 'text-emerald-600',bg: 'bg-emerald-50' },
};

const STATUS_META: Record<RequestStatus, { label: string; cls: string; dot: string }> = {
  pending:     { label: 'Pending',     cls: 'bg-amber-50 text-amber-700 border-amber-200',       dot: 'bg-amber-500' },
  in_progress: { label: 'In progress', cls: 'bg-blue-50 text-blue-700 border-blue-200',          dot: 'bg-blue-500' },
  completed:   { label: 'Completed',   cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  rejected:    { label: 'Rejected',    cls: 'bg-red-50 text-red-700 border-red-200',             dot: 'bg-red-500' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
function daysLeft(iso: string) {
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
  return days;
}

export default function CompliancePage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | RequestType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | RequestStatus>('all');

  const filtered = REQUESTS.filter((r) => {
    if (typeFilter !== 'all' && r.type !== typeFilter) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (search && !r.requesterName.toLowerCase().includes(search.toLowerCase())
              && !r.tenantName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    total:     REQUESTS.length,
    pending:   REQUESTS.filter((r) => r.status === 'pending').length,
    overdue:   REQUESTS.filter((r) => r.status !== 'completed' && daysLeft(r.dueAt) < 0).length,
    completed: REQUESTS.filter((r) => r.status === 'completed').length,
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">
      {/* Hero */}
      <div className="shrink-0 p-5 pb-0">
        <header className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Super Admin</p>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">Compliance &amp; Privacy</h1>
              <p className="mt-0.5 text-sm text-white/70">
                Data subject requests, retention policies and regulatory reporting (GDPR · NDPR · POPIA).
              </p>
            </div>
            <Button size="sm" className="bg-coral text-white hover:bg-coral-dark">
              <FileText className="h-3 w-3" />New DSR
            </Button>
          </div>
        </header>
      </div>

      <div className="flex-1 min-h-0 space-y-5 overflow-y-auto p-5 pt-5">
        {/* Compliance status cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: 'GDPR (EU)',       status: 'Compliant',   icon: ShieldCheck, color: 'text-emerald-600', detail: 'DPO assigned · Article 30 register up to date' },
            { label: 'NDPR (Nigeria)',  status: 'Compliant',   icon: ShieldCheck, color: 'text-emerald-600', detail: 'NITDA certificate valid through Aug 2026' },
            { label: 'POPIA (South Africa)', status: 'Action needed', icon: AlertTriangle, color: 'text-amber-600', detail: 'Annual filing due in 18 days' },
          ].map((r) => (
            <Card key={r.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <span className={cn('grid h-9 w-9 place-items-center rounded-lg', r.color === 'text-emerald-600' ? 'bg-emerald-50' : 'bg-amber-50')}>
                    <r.icon className={cn('h-4 w-4', r.color)} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{r.label}</p>
                    <p className={cn('text-xs font-medium', r.color)}>{r.status}</p>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">{r.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Total DSRs', value: counts.total, icon: FileText, color: 'text-foreground' },
            { label: 'Pending',   value: counts.pending, icon: Clock,   color: counts.pending > 0 ? 'text-amber-600' : 'text-foreground' },
            { label: 'Overdue',   value: counts.overdue, icon: AlertTriangle, color: counts.overdue > 0 ? 'text-red-600' : 'text-foreground' },
            { label: 'Completed', value: counts.completed, icon: CheckCircle2, color: 'text-emerald-600' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border bg-card px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</p>
                <s.icon className={cn('h-3.5 w-3.5 opacity-40', s.color)} />
              </div>
              <p className={cn('mt-1 text-xl font-bold tabular-nums', s.color)}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Requests table */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b py-3 pb-3">
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle className="text-sm font-semibold">Data subject requests</CardTitle>
              <div className="flex flex-wrap rounded-lg border p-0.5 text-xs">
                {(['all', 'pending', 'in_progress', 'completed'] as const).map((s) => (
                  <button key={s} onClick={() => setStatusFilter(s as typeof statusFilter)}
                    className={cn('rounded-md px-2.5 py-1 font-medium capitalize transition-colors',
                      statusFilter === s ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground')}>
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
                  className="h-8 rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring">
                  <option value="all">All types</option>
                  {Object.entries(TYPE_META).map(([k, m]) => <option key={k} value={k}>{m.label}</option>)}
                </select>
              </div>
              <div className="relative ml-auto">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search requester, tenant…" className="h-8 w-60 pl-8 text-xs" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead className="sticky top-0 z-10 bg-[#F4EFE6] shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
                <tr className="border-b text-left text-muted-foreground">
                  <th className="px-4 py-2.5 font-semibold">Request</th>
                  <th className="px-3 py-2.5 font-semibold">Tenant</th>
                  <th className="px-3 py-2.5 font-semibold">Type</th>
                  <th className="px-3 py-2.5 font-semibold">Status</th>
                  <th className="px-3 py-2.5 font-semibold">Region</th>
                  <th className="px-3 py-2.5 font-semibold">Received</th>
                  <th className="px-3 py-2.5 font-semibold">Due</th>
                  <th className="px-3 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((r) => {
                  const tm = TYPE_META[r.type];
                  const st = STATUS_META[r.status];
                  const TypeIcon = tm.icon;
                  const daysToDue = daysLeft(r.dueAt);
                  const overdue = r.status !== 'completed' && daysToDue < 0;
                  return (
                    <tr key={r.id} className={cn('hover:bg-muted/30', overdue && 'bg-red-50/20')}>
                      <td className="px-4 py-3">
                        <p className="font-mono text-[10px] text-muted-foreground">{r.id.toUpperCase()}</p>
                        <p className="font-semibold">{r.requesterName}</p>
                        <p className="text-[10px] text-muted-foreground">{r.requesterEmail}</p>
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-medium">{r.tenantName}</p>
                        <p className="text-[10px] text-muted-foreground">{r.jurisdiction}</p>
                      </td>
                      <td className="px-3 py-3">
                        <span className={cn('inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold', tm.bg, tm.color)}>
                          <TypeIcon className="h-3 w-3" />{tm.label}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={cn('inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold', st.cls)}>
                          <span className={cn('h-1 w-1 rounded-full', st.dot)} />{st.label}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full border bg-muted/40 px-1.5 py-0.5 text-[10px] font-semibold text-foreground">
                          <Globe2 className="h-2.5 w-2.5" />{r.region}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">{formatDate(r.receivedAt)}</td>
                      <td className="px-3 py-3">
                        {overdue
                          ? <span className="font-semibold text-red-600">{Math.abs(daysToDue)}d overdue</span>
                          : r.status === 'completed'
                            ? <span className="text-emerald-600">Resolved {formatDate(r.dueAt)}</span>
                            : <span className={cn(daysToDue < 7 ? 'text-amber-600 font-semibold' : 'text-muted-foreground')}>{daysToDue}d left</span>}
                      </td>
                      <td className="px-3 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View request</DropdownMenuItem>
                            <DropdownMenuItem>Generate response packet</DropdownMenuItem>
                            <DropdownMenuItem>Mark as completed</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Reject request</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Quick links */}
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { label: 'Data retention policies', icon: Archive,    color: 'text-blue-600' },
            { label: 'Data Processing Agreements',  icon: FileText,   color: 'text-emerald-600' },
            { label: 'Sub-processor list',     icon: Inbox,      color: 'text-amber-600' },
            { label: 'Right to be forgotten',  icon: UserX,      color: 'text-red-600' },
          ].map((q) => (
            <button key={q.label} className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3 transition-all hover:border-coral/30 hover:bg-coral/5">
              <span className="flex items-center gap-2">
                <q.icon className={cn('h-4 w-4', q.color)} />
                <span className="text-xs font-medium text-foreground">{q.label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
