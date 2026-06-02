'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Users,
  Plug,
  ShieldCheck,
  Rocket,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Globe,
  Plus,
  X,
  Clock,
} from 'lucide-react';
import { Button, Card, CardContent, Input, Label, Switch, cn } from '@topiadesk/ui';

// ─── Types & Steps ────────────────────────────────────────────────────────────

type Step = 'workspace' | 'team' | 'channels' | 'sla' | 'launch';

const STEPS: { key: Step; label: string; icon: React.ElementType; desc: string }[] = [
  { key: 'workspace', label: 'Workspace',  icon: Building2,   desc: 'Name & branding'       },
  { key: 'team',      label: 'Invite team',icon: Users,       desc: 'Add your first agents'  },
  { key: 'channels',  label: 'Channels',   icon: Plug,        desc: 'Connect support inboxes' },
  { key: 'sla',       label: 'SLA',        icon: ShieldCheck, desc: 'Set response targets'   },
  { key: 'launch',    label: 'Launch',     icon: Rocket,      desc: 'Go live'                },
];

interface InviteRow { email: string; role: string }

interface ChannelToggle { email: boolean; portal: boolean; whatsapp: boolean; voice: boolean }

interface SLATarget { priority: string; firstResponse: string; resolution: string }

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep]       = useState<Step>('workspace');
  const [launching, setLaunching] = useState(false);
  const [done, setDone]       = useState(false);

  // Workspace
  const [orgName, setOrgName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [timezone, setTimezone] = useState('Africa/Lagos');
  const [supportEmail, setSupportEmail] = useState('');

  // Team
  const [invites, setInvites] = useState<InviteRow[]>([{ email: '', role: 'Agent' }]);

  // Channels
  const [channels, setChannels] = useState<ChannelToggle>({ email: true, portal: true, whatsapp: false, voice: false });

  // SLA
  const [slaTargets] = useState<SLATarget[]>([
    { priority: 'Urgent', firstResponse: '15 min',  resolution: '2 hrs'  },
    { priority: 'High',   firstResponse: '1 hr',    resolution: '8 hrs'  },
    { priority: 'Medium', firstResponse: '4 hrs',   resolution: '24 hrs' },
    { priority: 'Low',    firstResponse: '8 hrs',   resolution: '72 hrs' },
  ]);
  const [businessHoursOnly, setBusinessHoursOnly] = useState(true);

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  function advance() {
    const next = STEPS[stepIndex + 1];
    if (next) setStep(next.key);
  }
  function back() {
    const prev = STEPS[stepIndex - 1];
    if (prev) setStep(prev.key);
  }

  function canAdvance() {
    if (step === 'workspace') return orgName.trim().length > 0 && supportEmail.includes('@');
    return true;
  }

  function addInvite() {
    setInvites((r) => [...r, { email: '', role: 'Agent' }]);
  }
  function removeInvite(i: number) {
    setInvites((r) => r.filter((_, idx) => idx !== i));
  }
  function updateInvite(i: number, key: keyof InviteRow, val: string) {
    setInvites((r) => r.map((row, idx) => idx === i ? { ...row, [key]: val } : row));
  }

  async function launch() {
    setLaunching(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLaunching(false);
    setDone(true);
  }

  // ── Done ─────────────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="flex justify-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-navy shadow-xl shadow-orange-200">
              <Rocket className="h-9 w-9 text-white" />
              <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              {orgName || 'Your workspace'} is live! 🎉
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your helpdesk is configured and ready. Invites have been sent and channels are connected.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 text-center">
              <p className="font-display text-2xl font-bold text-foreground">{invites.filter((i) => i.email).length}</p>
              <p className="text-xs text-muted-foreground">Agents invited</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="font-display text-2xl font-bold text-foreground">{Object.values(channels).filter(Boolean).length}</p>
              <p className="text-xs text-muted-foreground">Channels active</p>
            </Card>
          </div>
          <Button className="w-full bg-orange-500 text-white hover:bg-orange-600" onClick={() => router.push('/')}>
            Open admin dashboard <ChevronRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // ── Main layout ───────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-navy">
            <span className="font-display text-sm font-black text-white">T</span>
          </div>
          <span className="font-display text-base font-bold tracking-tight text-foreground">Topiadesk Setup</span>
        </div>
        <span className="text-xs text-muted-foreground">Step {stepIndex + 1} of {STEPS.length}</span>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* ── Sidebar ── */}
        <nav className="flex shrink-0 gap-2 overflow-x-auto border-b border-border bg-muted/20 px-4 py-3 lg:w-64 lg:flex-col lg:gap-1 lg:border-b-0 lg:border-r lg:px-4 lg:py-6">
          {STEPS.map((s, i) => {
            const _Icon = s.icon;
            const done = i < stepIndex;
            const active = i === stepIndex;
            return (
              <div
                key={s.key}
                className={cn(
                  'flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 transition-colors lg:w-full',
                  active ? 'bg-orange-50 text-orange-700' : done ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                <span className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  done   ? 'bg-emerald-100 text-emerald-700' : '',
                  active ? 'bg-orange-500 text-white'        : '',
                  !done && !active ? 'bg-muted text-muted-foreground' : '',
                )}>
                  {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium leading-tight">{s.label}</p>
                  <p className="text-[10px] opacity-70">{s.desc}</p>
                </div>
                <span className="lg:hidden text-xs font-medium">{s.label}</span>
              </div>
            );
          })}
        </nav>

        {/* ── Content ── */}
        <main className="flex flex-1 flex-col">
          <div className="flex-1 p-6 lg:p-10">
            {/* STEP 1 — Workspace */}
            {step === 'workspace' && (
              <div className="max-w-lg space-y-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">Set up your workspace</h2>
                  <p className="mt-1 text-sm text-muted-foreground">This is how your team and customers will identify your helpdesk.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="org">Organisation name <span className="text-red-500">*</span></Label>
                    <Input id="org" placeholder="e.g. ConsomoAfrica" value={orgName} onChange={(e) => { setOrgName(e.target.value); setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')); }} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="sub">Subdomain</Label>
                    <div className="flex items-center gap-0 rounded-md border border-input overflow-hidden focus-within:ring-2 focus-within:ring-ring">
                      <input
                        id="sub"
                        className="flex-1 bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                        placeholder="yourteam"
                        value={subdomain}
                        onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      />
                      <span className="border-l border-input bg-muted px-3 py-2 text-xs text-muted-foreground">.topiadesk.com</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="tz">Default timezone</Label>
                    <select
                      id="tz"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                    >
                      {['Africa/Lagos', 'Africa/Accra', 'Africa/Nairobi', 'Africa/Johannesburg', 'Europe/London', 'UTC'].map((tz) => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Support email <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="email" type="email" className="pl-9" placeholder="support@yourcompany.com" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
                    </div>
                    <p className="text-[11px] text-muted-foreground">Tickets submitted by email will arrive here.</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 — Team */}
            {step === 'team' && (
              <div className="max-w-lg space-y-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">Invite your team</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Add agents now — you can always invite more later from the Agents page.</p>
                </div>
                <div className="space-y-3">
                  {invites.map((row, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input
                        placeholder="agent@yourcompany.com"
                        type="email"
                        className="flex-1"
                        value={row.email}
                        onChange={(e) => updateInvite(i, 'email', e.target.value)}
                      />
                      <select
                        className="rounded-md border border-input bg-background px-2 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        value={row.role}
                        onChange={(e) => updateInvite(i, 'role', e.target.value)}
                      >
                        {['Agent', 'Senior Agent', 'Tenant Admin'].map((r) => <option key={r}>{r}</option>)}
                      </select>
                      {invites.length > 1 && (
                        <button onClick={() => removeInvite(i)} className="text-muted-foreground hover:text-foreground">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full" onClick={addInvite}>
                    <Plus className="mr-1.5 h-3.5 w-3.5" /> Add another
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Skip this step and add agents later from <strong>Admin → Agents</strong>.
                </p>
              </div>
            )}

            {/* STEP 3 — Channels */}
            {step === 'channels' && (
              <div className="max-w-lg space-y-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">Connect support channels</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Choose where customers can reach you. You can configure each channel in detail afterwards.</p>
                </div>
                <div className="space-y-3">
                  {[
                    { key: 'email'    as keyof ChannelToggle, icon: Mail,           label: 'Email inbox',     desc: 'Receive tickets via email'         },
                    { key: 'portal'   as keyof ChannelToggle, icon: Globe,          label: 'Customer portal', desc: 'Self-service web portal'            },
                    { key: 'whatsapp' as keyof ChannelToggle, icon: MessageCircle,  label: 'WhatsApp',        desc: 'Connect your WhatsApp Business API' },
                    { key: 'voice'    as keyof ChannelToggle, icon: Phone,          label: 'Voice / VOIP',    desc: 'Route calls into the helpdesk'      },
                  ].map(({ key, icon: Icon, label, desc }) => (
                    <Card key={key} className={cn('transition-colors', channels[key] ? 'border-orange-200 bg-orange-50/30' : '')}>
                      <CardContent className="flex items-center gap-4 p-4">
                        <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', channels[key] ? 'bg-orange-100 text-orange-600' : 'bg-muted text-muted-foreground')}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">{label}</p>
                          <p className="text-xs text-muted-foreground">{desc}</p>
                        </div>
                        <Switch
                          checked={channels[key]}
                          onCheckedChange={(v) => setChannels((c) => ({ ...c, [key]: v }))}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4 — SLA */}
            {step === 'sla' && (
              <div className="max-w-lg space-y-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">Configure SLA targets</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Default response and resolution times by ticket priority. You can fine-tune these in <strong>Admin → SLA</strong>.</p>
                </div>
                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-border">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Priority</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">First response</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Resolution</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {slaTargets.map((t) => {
                          const color = t.priority === 'Urgent' ? 'bg-red-100 text-red-700'
                            : t.priority === 'High'   ? 'bg-orange-100 text-orange-700'
                            : t.priority === 'Medium' ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700';
                          return (
                            <tr key={t.priority}>
                              <td className="px-4 py-3">
                                <span className={cn('inline-block rounded-full px-2 py-0.5 text-[10px] font-bold', color)}>{t.priority}</span>
                              </td>
                              <td className="px-4 py-3 text-foreground font-medium">
                                <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-muted-foreground" />{t.firstResponse}</div>
                              </td>
                              <td className="px-4 py-3 text-foreground font-medium">{t.resolution}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
                <Card>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Business hours only</p>
                      <p className="text-xs text-muted-foreground">SLA timers pause outside Mon–Fri 08:00–18:00 {timezone}</p>
                    </div>
                    <Switch checked={businessHoursOnly} onCheckedChange={setBusinessHoursOnly} />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* STEP 5 — Launch */}
            {step === 'launch' && (
              <div className="max-w-lg space-y-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">Ready to launch!</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Here&apos;s a summary of your setup. Hit launch to go live.</p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Organisation',     value: orgName || '—'         },
                    { label: 'Subdomain',         value: subdomain ? `${subdomain}.topiadesk.com` : '—' },
                    { label: 'Support email',     value: supportEmail || '—'   },
                    { label: 'Timezone',          value: timezone              },
                    { label: 'Agents to invite',  value: `${invites.filter((i) => i.email).length} invited` },
                    { label: 'Channels enabled',  value: Object.entries(channels).filter(([, v]) => v).map(([k]) => k).join(', ') || 'None' },
                    { label: 'SLA type',          value: businessHoursOnly ? 'Business hours' : '24/7' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-start gap-4 rounded-lg border border-border bg-background px-4 py-3">
                      <span className="w-36 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
                      <span className="text-sm text-foreground capitalize">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
                  <Rocket className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                  <span>Launching will provision your workspace, send invite emails, and activate selected channels.</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Navigation footer ── */}
          <div className="flex items-center justify-between border-t border-border bg-background px-6 py-4 lg:px-10">
            <Button variant="outline" onClick={back} disabled={stepIndex === 0}>
              <ChevronLeft className="mr-1.5 h-4 w-4" /> Back
            </Button>
            {step !== 'launch' ? (
              <Button className="bg-orange-500 text-white hover:bg-orange-600" disabled={!canAdvance()} onClick={advance}>
                Continue <ChevronRight className="ml-1.5 h-4 w-4" />
              </Button>
            ) : (
              <Button className="min-w-[140px] bg-orange-500 text-white hover:bg-orange-600" disabled={launching} onClick={launch}>
                {launching
                  ? <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Launching…</>
                  : <><Rocket className="mr-1.5 h-4 w-4" /> Launch workspace</>
                }
              </Button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
