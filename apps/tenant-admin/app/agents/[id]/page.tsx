'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  ShieldCheck,
  ShieldOff,
  Ticket,
  Clock,
  MoreHorizontal,
  Edit3,
  UserX,
  UserCheck,
  Send,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Users,
  BarChart3,
  Key,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  cn,
} from '@topiadesk/ui';
import { adminAgents } from '@/lib/mock-data';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function statusBadge(status: 'active' | 'invited' | 'suspended') {
  switch (status) {
    case 'active':    return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Active</span>;
    case 'invited':   return <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200"><span className="h-1.5 w-1.5 rounded-full bg-blue-400" />Invited</span>;
    case 'suspended': return <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 border border-red-200"><span className="h-1.5 w-1.5 rounded-full bg-red-500" />Suspended</span>;
  }
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

// Mock recent ticket activity for this agent
const recentActivity = [
  { id: 't-1', number: '#1042', subject: 'VPN not connecting after password reset', status: 'resolved',  priority: 'high',   resolvedAt: '2h ago'  },
  { id: 't-2', number: '#1039', subject: 'Laptop screen flickering on Dell XPS',    status: 'resolved',  priority: 'medium', resolvedAt: '5h ago'  },
  { id: 't-3', number: '#1036', subject: 'New joiner needs M365 license',           status: 'open',      priority: 'low',    resolvedAt: null       },
  { id: 't-4', number: '#1031', subject: 'Printer offline — Finance floor',         status: 'resolved',  priority: 'urgent', resolvedAt: '1d ago'  },
  { id: 't-5', number: '#1028', subject: 'Teams call quality degraded',             status: 'resolved',  priority: 'high',   resolvedAt: '2d ago'  },
];

const priorityColor: Record<string, string> = {
  urgent: 'text-red-600 bg-red-50 border-red-200',
  high:   'text-orange-600 bg-orange-50 border-orange-200',
  medium: 'text-amber-600 bg-amber-50 border-amber-200',
  low:    'text-blue-600 bg-blue-50 border-blue-200',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AgentDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const agent = adminAgents.find((a) => a.id === id) ?? adminAgents[0];
  const [status, setStatus] = useState(agent.status);
  const [actionMsg, setActionMsg] = useState('');

  function confirmAction(msg: string) {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(''), 3000);
  }

  const statCards = [
    { label: 'Tickets resolved',  value: agent.ticketsResolved, icon: Ticket,    color: 'bg-blue-50 text-blue-600'    },
    { label: 'This month',         value: 18,                    icon: BarChart3,  color: 'bg-coral/8 text-coral' },
    { label: 'Avg CSAT',           value: '4.6 / 5',             icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Avg response time',  value: '38 min',              icon: Clock,      color: 'bg-amber-50 text-amber-600'  },
  ];

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      {/* ── Fixed header ── */}
      <div className="shrink-0 p-5 pb-0">
      <header className="relative overflow-hidden rounded-2xl bg-navy px-6 py-5 shadow-lg shadow-navy/15">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
        <div className="relative">
          <Link href="/agents" className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white/90 transition-colors">
            <ArrowLeft className="h-3 w-3" /> Agents
          </Link>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 ring-2 ring-white/30">
                <AvatarFallback className="bg-white/20 text-xl font-bold text-white">
                  {initials(agent.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl font-bold text-white">{agent.name}</h1>
                  {statusBadge(status)}
                </div>
                <p className="mt-0.5 text-sm text-white/70">{agent.role} · {agent.group}</p>
                <p className="text-xs text-white/50">{agent.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" className="border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" variant="outline">
                <Edit3 className="mr-1.5 h-3.5 w-3.5" /> Edit
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" variant="outline">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => confirmAction('Invite email re-sent.')}>
                    <Send className="mr-2 h-3.5 w-3.5" /> Resend invite
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => confirmAction('Password reset link sent.')}>
                    <Key className="mr-2 h-3.5 w-3.5" /> Send password reset
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {status === 'suspended' ? (
                    <DropdownMenuItem onClick={() => { setStatus('active'); confirmAction('Agent reactivated.'); }}>
                      <UserCheck className="mr-2 h-3.5 w-3.5 text-emerald-600" /> Reactivate agent
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => { setStatus('suspended'); confirmAction('Agent suspended.'); }}>
                      <UserX className="mr-2 h-3.5 w-3.5" /> Suspend agent
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 min-h-0 space-y-5 overflow-y-auto px-5 pb-5 pt-5 lg:px-6 lg:pb-6">
        {actionMsg && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" /> {actionMsg}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="flex items-center gap-3 p-4">
                <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', color)}>
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-display text-xl font-bold text-foreground leading-tight">{value}</p>
                  <p className="text-[11px] text-muted-foreground">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* Main — activity */}
          <div className="space-y-5 lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Recent ticket activity</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/60">
                  {recentActivity.map((t) => (
                    <div key={t.id} className="flex items-start gap-3 px-5 py-3">
                      <span className={cn('mt-0.5 inline-flex shrink-0 items-center rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide', priorityColor[t.priority])}>
                        {t.priority}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{t.subject}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">{t.number}</span>
                          {t.status === 'resolved'
                            ? <span className="flex items-center gap-1 text-[10px] text-emerald-600"><CheckCircle2 className="h-2.5 w-2.5" />Resolved {t.resolvedAt}</span>
                            : <span className="flex items-center gap-1 text-[10px] text-blue-600"><Clock className="h-2.5 w-2.5" />Open</span>
                          }
                        </div>
                      </div>
                      <Link href={`/tickets/${t.id}`} className="shrink-0 text-[10px] text-muted-foreground hover:text-foreground hover:underline">
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Profile */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Profile</CardTitle></CardHeader>
              <CardContent className="space-y-3 pt-0">
                {[
                  { icon: Mail,     label: 'Email',    value: agent.email      },
                  { icon: Users,    label: 'Group',    value: agent.group      },
                  { icon: Calendar, label: 'Joined',   value: agent.joinedAt   },
                  { icon: Clock,    label: 'Last seen', value: agent.lastSeen ?? 'Never' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                      <p className="text-sm text-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Security</CardTitle></CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {agent.mfa
                      ? <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      : <ShieldOff className="h-4 w-4 text-amber-500" />
                    }
                    <p className="text-sm font-medium text-foreground">
                      MFA {agent.mfa ? 'enabled' : 'not set up'}
                    </p>
                  </div>
                  {agent.mfa
                    ? <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px]">Active</Badge>
                    : <Badge variant="warning" className="text-[10px]">At risk</Badge>
                  }
                </div>
                {!agent.mfa && (
                  <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    MFA is not enabled. Remind this agent to set it up.
                  </div>
                )}
                <Button variant="outline" size="sm" className="w-full text-xs justify-start" onClick={() => confirmAction('Password reset link sent.')}>
                  <Key className="mr-2 h-3.5 w-3.5" /> Send password reset
                </Button>
              </CardContent>
            </Card>

            {/* Role */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Access</CardTitle></CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{agent.role}</p>
                    <p className="text-xs text-muted-foreground">{agent.group}</p>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 px-2.5 text-xs">Change</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
