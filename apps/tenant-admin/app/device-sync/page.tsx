'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Cpu,
  Globe,
  Inbox,
  KeyRound,
  Loader2,
  Mail,
  Plus,
  RefreshCw,
  Server,
  Shield,
  ShieldCheck,
  Smartphone,
  Trash2,
  UserCircle2,
  XCircle,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Switch,
  cn,
} from '@topiadesk/ui';

// ─── Identity providers / MDMs Topiadesk can sync from ──────────────────────

type ProviderId = 'entra' | 'google' | 'intune' | 'jamf' | 'kandji';

interface ProviderDef {
  id: ProviderId;
  name: string;
  category: 'identity' | 'mdm';
  blurb: string;
  color: string;
  /** What signals this connector produces about device → user binding */
  signals: string[];
  fields: { key: string; label: string; placeholder: string; type?: 'text' | 'password' }[];
}

const PROVIDERS: ProviderDef[] = [
  {
    id: 'entra', name: 'Microsoft Entra ID (Azure AD)', category: 'identity',
    blurb: 'Detect device sign-ins, registered devices and primary-user changes via Microsoft Graph change notifications.',
    color: '#0078d4',
    signals: ['User sign-in to new device', 'Device registered / joined', 'Primary user changed', 'Device deleted'],
    fields: [
      { key: 'tenantId', label: 'Directory (tenant) ID', placeholder: '00000000-0000-0000-0000-000000000000' },
      { key: 'clientId', label: 'App registration client ID', placeholder: '00000000-0000-0000-0000-000000000000' },
      { key: 'clientSecret', label: 'Client secret', placeholder: '••••••••', type: 'password' },
    ],
  },
  {
    id: 'google', name: 'Google Workspace', category: 'identity',
    blurb: 'Detect device assignments and last-sign-in events via the Admin SDK Directory API and ChromeOS / mobile management APIs.',
    color: '#34a853',
    signals: ['Mobile device assignment changed', 'ChromeOS device user changed', 'Endpoint Verification new device'],
    fields: [
      { key: 'customerId',     label: 'Customer ID',               placeholder: 'C0xxxxxxx' },
      { key: 'serviceAccount', label: 'Service-account JSON path', placeholder: '/secrets/google-sa.json' },
      { key: 'impersonate',    label: 'Admin to impersonate',      placeholder: 'admin@yourcompany.com' },
    ],
  },
  {
    id: 'intune', name: 'Microsoft Intune', category: 'mdm',
    blurb: 'Pull enrolled devices, primary user, ownership and compliance state from the Intune endpoints of Microsoft Graph.',
    color: '#0078d4',
    signals: ['Device enrolled', 'Primary user assigned', 'Compliance state changed', 'Wipe / retire issued'],
    fields: [
      { key: 'tenantId',     label: 'Tenant ID',     placeholder: '00000000-0000-0000-0000-000000000000' },
      { key: 'clientId',     label: 'Client ID',     placeholder: '00000000-0000-0000-0000-000000000000' },
      { key: 'clientSecret', label: 'Client secret', placeholder: '••••••••', type: 'password' },
    ],
  },
  {
    id: 'jamf', name: 'Jamf Pro', category: 'mdm',
    blurb: 'Detect computer assignment changes from Jamf Pro for macOS / iOS fleets.',
    color: '#ff5300',
    signals: ['Computer record updated', 'Assignment changed', 'New enrolment'],
    fields: [
      { key: 'host',     label: 'Jamf Pro URL', placeholder: 'https://yourorg.jamfcloud.com' },
      { key: 'username', label: 'API username', placeholder: 'topiadesk-svc' },
      { key: 'password', label: 'API password', placeholder: '••••••••', type: 'password' },
    ],
  },
  {
    id: 'kandji', name: 'Kandji', category: 'mdm',
    blurb: 'Detect device assignment changes from Kandji for Apple fleets via the Kandji API.',
    color: '#5f50e8',
    signals: ['Device assigned to user', 'Device renamed / replaced', 'Blueprint reassigned'],
    fields: [
      { key: 'subdomain', label: 'Tenant subdomain', placeholder: 'yourorg (yourorg.api.kandji.io)' },
      { key: 'apiToken',  label: 'API token', placeholder: 'kdj_…', type: 'password' },
    ],
  },
];

type Policy = 'auto-approve' | 'require-approval' | 'ignore';

interface Connection {
  providerId: ProviderId;
  status: 'connected' | 'error' | 'paused';
  connectedAt: string;
  lastSync?: string;
  policy: Policy;
  syncSignals: Record<string, boolean>;
}

interface Recipient {
  id: string;
  name: string;
  email: string;
  role: 'IT Engineer' | 'IT Manager' | 'Service desk' | 'Custom';
  notifyOn: ('reassignment' | 'new-device' | 'device-removed' | 'compliance-fail')[];
  channel: ('email' | 'in-app' | 'slack' | 'teams')[];
}

const DEFAULT_CONNECTIONS: Connection[] = [
  {
    providerId: 'entra', status: 'connected',
    connectedAt: '2026-05-12T09:14:00Z', lastSync: '2026-05-30T06:42:00Z',
    policy: 'require-approval',
    syncSignals: { 'User sign-in to new device': true, 'Device registered / joined': true, 'Primary user changed': true, 'Device deleted': false },
  },
];

const DEFAULT_RECIPIENTS: Recipient[] = [
  { id: 'r-tunde', name: 'Tunde Bakare',  email: 'tunde@consomoafrica.com', role: 'IT Engineer',
    notifyOn: ['reassignment', 'new-device'], channel: ['email', 'in-app'] },
  { id: 'r-amara', name: 'Amara Diallo',  email: 'amara@consomoafrica.com', role: 'IT Manager',
    notifyOn: ['reassignment', 'new-device', 'compliance-fail'], channel: ['email', 'in-app', 'slack'] },
];

const STORAGE_CONN = 'topiadesk.device-sync.connections';
const STORAGE_REC  = 'topiadesk.device-sync.recipients';

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DeviceSyncPage() {
  const [connections, setConnections] = useState<Connection[]>(DEFAULT_CONNECTIONS);
  const [recipients,  setRecipients]  = useState<Recipient[]>(DEFAULT_RECIPIENTS);
  const [connectingProvider, setConnectingProvider] = useState<ProviderDef | null>(null);
  const [editingRecipient,   setEditingRecipient]   = useState<Recipient | null>(null);
  const [showNewRecipient,   setShowNewRecipient]   = useState(false);

  // Hydrate
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const c = JSON.parse(window.localStorage.getItem(STORAGE_CONN) ?? 'null');
      const r = JSON.parse(window.localStorage.getItem(STORAGE_REC)  ?? 'null');
      if (Array.isArray(c)) setConnections(c);
      if (Array.isArray(r)) setRecipients(r);
    } catch { /* ignore */ }
  }, []);

  const persistConnections = (next: Connection[]) => {
    setConnections(next);
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_CONN, JSON.stringify(next));
  };
  const persistRecipients = (next: Recipient[]) => {
    setRecipients(next);
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_REC, JSON.stringify(next));
  };

  const connectedIds = new Set(connections.map((c) => c.providerId));

  const upsertConnection = (c: Connection) => {
    const exists = connections.some((x) => x.providerId === c.providerId);
    persistConnections(exists ? connections.map((x) => (x.providerId === c.providerId ? c : x)) : [...connections, c]);
  };
  const disconnect = (id: ProviderId) => {
    if (!confirm('Disconnect this provider? Topiadesk will stop receiving device-change events from it.')) return;
    persistConnections(connections.filter((c) => c.providerId !== id));
  };
  const setPolicy = (id: ProviderId, policy: Policy) =>
    persistConnections(connections.map((c) => (c.providerId === id ? { ...c, policy } : c)));
  const toggleSignal = (id: ProviderId, signal: string) =>
    persistConnections(connections.map((c) =>
      c.providerId === id ? { ...c, syncSignals: { ...c.syncSignals, [signal]: !c.syncSignals[signal] } } : c));

  const upsertRecipient = (r: Recipient) => {
    const exists = recipients.some((x) => x.id === r.id);
    persistRecipients(exists ? recipients.map((x) => (x.id === r.id ? r : x)) : [...recipients, r]);
    setEditingRecipient(null);
    setShowNewRecipient(false);
  };
  const removeRecipient = (id: string) => {
    if (!confirm('Remove this recipient from device-sync notifications?')) return;
    persistRecipients(recipients.filter((r) => r.id !== id));
  };

  const stats = useMemo(() => ({
    connected:    connections.filter((c) => c.status === 'connected').length,
    autoApprove:  connections.filter((c) => c.policy === 'auto-approve').length,
    recipients:   recipients.length,
    inAppOnly:    recipients.filter((r) => r.channel.length === 1 && r.channel[0] === 'in-app').length,
  }), [connections, recipients]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
        <header className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Asset management</p>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">Device sync &amp; auto-reconciliation</h1>
              <p className="mt-0.5 text-sm text-white/70">
                Keep Topiadesk asset assignments in sync with your identity provider and MDM. When a user signs into a new device, Topiadesk asks an IT engineer whether to update the asset.
              </p>
            </div>
            <Badge variant="outline" className="border-white/20 bg-white/10 text-white">
              {stats.connected} provider{stats.connected === 1 ? '' : 's'} · {stats.recipients} recipient{stats.recipients === 1 ? '' : 's'}
            </Badge>
          </div>
        </header>
      </div>

      <div className="flex-1 min-h-0 space-y-5 overflow-y-auto p-5">
        {/* KPI tiles */}
        <div className="grid gap-3 sm:grid-cols-4">
          <StatTile icon={Cloud}        label="Providers connected" value={stats.connected} />
          <StatTile icon={ShieldCheck}  label="Auto-approving"      value={stats.autoApprove} sub="Skip the engineer prompt" />
          <StatTile icon={Bell}         label="Notification recipients" value={stats.recipients} />
          <StatTile icon={Inbox}        label="Pending events"      value={3} sub="Awaiting engineer review" />
        </div>

        {/* Providers */}
        <Card>
          <CardHeader className="border-b py-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">Identity providers &amp; MDMs</CardTitle>
                <p className="text-[11px] text-muted-foreground">
                  Connect the systems that already know what device a user is on. Topiadesk listens to their change events.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y">
              {PROVIDERS.map((p) => {
                const conn = connections.find((c) => c.providerId === p.id);
                return (
                  <li key={p.id} className="px-4 py-4">
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-base font-black text-white"
                        style={{ background: p.color }}>
                        {p.category === 'identity' ? <UserCircle2 className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-bold">{p.name}</p>
                          <Badge variant="outline" className="text-[9px] capitalize">{p.category === 'identity' ? 'Identity' : 'MDM'}</Badge>
                          {conn?.status === 'connected' && (
                            <Badge variant="success" className="text-[9px]"><CheckCircle2 className="h-2.5 w-2.5" />Connected</Badge>
                          )}
                          {conn?.status === 'error' && (
                            <Badge variant="danger" className="text-[9px]"><XCircle className="h-2.5 w-2.5" />Auth error</Badge>
                          )}
                          {conn?.status === 'paused' && (
                            <Badge variant="warning" className="text-[9px]">Paused</Badge>
                          )}
                        </div>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">{p.blurb}</p>

                        {conn ? (
                          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_220px]">
                            <div className="rounded-md border bg-muted/20 p-3">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                Events Topiadesk listens to
                              </p>
                              <ul className="mt-2 space-y-1.5">
                                {p.signals.map((sig) => (
                                  <li key={sig} className="flex items-center justify-between gap-3 text-[11px]">
                                    <span>{sig}</span>
                                    <Switch
                                      checked={!!conn.syncSignals[sig]}
                                      onCheckedChange={() => toggleSignal(p.id, sig)}
                                    />
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                  When a change is detected
                                </Label>
                                <select
                                  value={conn.policy}
                                  onChange={(e) => setPolicy(p.id, e.target.value as Policy)}
                                  className="mt-1 h-8 w-full rounded-md border bg-background px-2 text-xs"
                                >
                                  <option value="require-approval">Ask an engineer to confirm</option>
                                  <option value="auto-approve">Auto-approve (no prompt)</option>
                                  <option value="ignore">Log only — do nothing</option>
                                </select>
                              </div>
                              <div className="rounded-md border bg-background p-2 text-[10px] text-muted-foreground">
                                <p>Connected {new Date(conn.connectedAt).toLocaleDateString()}</p>
                                {conn.lastSync && <p>Last sync {new Date(conn.lastSync).toLocaleString()}</p>}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" className="h-7 flex-1 text-[11px]">
                                  <RefreshCw className="h-3 w-3" />Sync now
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7 text-red-600"
                                  onClick={() => disconnect(p.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            className="mt-3 bg-coral text-white hover:bg-coral-dark"
                            onClick={() => setConnectingProvider(p)}
                          >
                            <KeyRound className="h-3 w-3" />Connect {p.name}
                          </Button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        {/* Recipients */}
        <Card>
          <CardHeader className="border-b py-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">Who gets the device-sync prompts?</CardTitle>
                <p className="text-[11px] text-muted-foreground">
                  These addresses receive the "Did Daniel switch laptops?" notifications. Add anyone — they don't have to be Topiadesk agents.
                </p>
              </div>
              <Button size="sm" className="bg-coral text-white hover:bg-coral-dark" onClick={() => setShowNewRecipient(true)}>
                <Plus className="h-3 w-3" />Add recipient
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y">
              {recipients.map((r) => (
                <li key={r.id} className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-coral/15 text-coral">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold">{r.name}</p>
                        <Badge variant="secondary" className="text-[9px]">{r.role}</Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{r.email}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {r.notifyOn.map((n) => (
                          <span key={n} className="rounded-full border bg-background px-1.5 py-0.5 text-[9px] font-medium">
                            {n.replace('-', ' ')}
                          </span>
                        ))}
                        <span className="text-[9px] text-muted-foreground">via</span>
                        {r.channel.map((c) => (
                          <span key={c} className="rounded-full border border-coral/30 bg-coral/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-coral-dark">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-[11px]" onClick={() => setEditingRecipient(r)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600" onClick={() => removeRecipient(r.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </li>
              ))}
              {recipients.length === 0 && (
                <li className="p-6 text-center text-xs text-muted-foreground">
                  No recipients yet. Add the IT engineer(s) who should be notified.
                </li>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* How it works */}
        <Card>
          <CardHeader className="border-b py-3">
            <CardTitle className="text-sm">How the reassignment prompt works</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <ol className="space-y-3">
              {[
                { i: 1, t: 'A signed-in change is detected', d: "User signs into a new laptop, or the identity provider records a different primary device for them." },
                { i: 2, t: 'Topiadesk reconciles', d: "Asset register is checked. If the user's assigned device differs from the new one, it's flagged." },
                { i: 3, t: 'The recipient(s) above get a prompt', d: '"Did <user> switch devices? Old: X · New: Y. Options: Yes / Yes & open ticket / No, ignore / Open ticket instead."' },
                { i: 4, t: 'Action is applied to the asset register', d: 'Old asset moves to "Returned/Pending pickup", new device is registered to the user, an audit trail entry is written. If a ticket was requested, it links back to the audit entry.' },
              ].map((s) => (
                <li key={s.i} className="flex items-start gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-coral text-[11px] font-bold text-white">{s.i}</span>
                  <div>
                    <p className="text-sm font-semibold">{s.t}</p>
                    <p className="text-[11px] text-muted-foreground">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      <ConnectProviderDialog
        provider={connectingProvider}
        onClose={() => setConnectingProvider(null)}
        onConnect={(creds) => {
          if (!connectingProvider) return;
          const newConn: Connection = {
            providerId: connectingProvider.id, status: 'connected',
            connectedAt: new Date().toISOString(),
            policy: 'require-approval',
            syncSignals: Object.fromEntries(connectingProvider.signals.map((s) => [s, true])),
          };
          upsertConnection(newConn);
          setConnectingProvider(null);
        }}
      />

      <RecipientDialog
        open={showNewRecipient || !!editingRecipient}
        recipient={editingRecipient}
        onClose={() => { setShowNewRecipient(false); setEditingRecipient(null); }}
        onSave={upsertRecipient}
      />
    </div>
  );
}

// ─── Connect-provider dialog ────────────────────────────────────────────────

function ConnectProviderDialog({
  provider, onClose, onConnect,
}: {
  provider: ProviderDef | null;
  onClose: () => void;
  onConnect: (creds: Record<string, string>) => void;
}) {
  const [creds, setCreds] = useState<Record<string, string>>({});
  const [tested, setTested] = useState<'idle' | 'testing' | 'ok' | 'fail'>('idle');

  useEffect(() => {
    if (provider) { setCreds({}); setTested('idle'); }
  }, [provider]);

  if (!provider) return null;

  const allFilled = provider.fields.every((f) => (creds[f.key] ?? '').trim());

  return (
    <Dialog open={!!provider} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect {provider.name}</DialogTitle>
          <DialogDescription>
            Topiadesk needs read-only credentials to subscribe to device events from your {provider.category === 'identity' ? 'identity provider' : 'MDM'}.
            We never write to the source system.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {provider.fields.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label htmlFor={`p-${f.key}`} className="text-xs">{f.label}</Label>
              <Input
                id={`p-${f.key}`}
                type={f.type ?? 'text'}
                value={creds[f.key] ?? ''}
                onChange={(e) => setCreds({ ...creds, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className={cn('h-9 text-xs', f.type === 'password' && 'font-mono')}
              />
            </div>
          ))}
          {tested === 'ok' && (
            <div className="flex items-center gap-2 rounded-md border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-900">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Connection successful. Topiadesk can read device + user data.
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            variant="outline" size="sm"
            disabled={!allFilled || tested === 'testing'}
            onClick={() => { setTested('testing'); setTimeout(() => setTested('ok'), 900); }}
          >
            {tested === 'testing'
              ? <><Loader2 className="h-3 w-3 animate-spin" />Testing…</>
              : <><RefreshCw className="h-3 w-3" />Test</>}
          </Button>
          <Button
            size="sm" className="bg-coral text-white hover:bg-coral-dark"
            disabled={tested !== 'ok'}
            onClick={() => onConnect(creds)}
          >
            <KeyRound className="h-3 w-3" />Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Recipient dialog ───────────────────────────────────────────────────────

function RecipientDialog({
  open, recipient, onClose, onSave,
}: {
  open: boolean;
  recipient: Recipient | null;
  onClose: () => void;
  onSave: (r: Recipient) => void;
}) {
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole]   = useState<Recipient['role']>('IT Engineer');
  const [notifyOn, setNotifyOn] = useState<Recipient['notifyOn']>(['reassignment']);
  const [channel,  setChannel]  = useState<Recipient['channel']>(['email', 'in-app']);

  useEffect(() => {
    if (!open) return;
    setName(recipient?.name ?? '');
    setEmail(recipient?.email ?? '');
    setRole(recipient?.role ?? 'IT Engineer');
    setNotifyOn(recipient?.notifyOn ?? ['reassignment']);
    setChannel(recipient?.channel ?? ['email', 'in-app']);
  }, [open, recipient]);

  const toggle = <T,>(arr: T[], v: T) => arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const handleSave = () => {
    if (!email.trim()) return;
    onSave({
      id: recipient?.id ?? `r-${Date.now()}`,
      name: name.trim() || email.split('@')[0]!,
      email: email.trim(),
      role,
      notifyOn: notifyOn.length ? notifyOn : ['reassignment'],
      channel: channel.length ? channel : ['email'],
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{recipient ? 'Edit recipient' : 'Add a recipient'}</DialogTitle>
          <DialogDescription>
            Who should Topiadesk ask when a user appears to have switched devices? You can add anyone — they don't need a Topiadesk agent licence.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rcp-name" className="text-xs">Name</Label>
              <Input id="rcp-name" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Tunde Bakare" className="h-9 text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Role</Label>
              <select value={role} onChange={(e) => setRole(e.target.value as Recipient['role'])}
                className="h-9 w-full rounded-md border bg-background px-2 text-xs">
                <option>IT Engineer</option>
                <option>IT Manager</option>
                <option>Service desk</option>
                <option>Custom</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rcp-email" className="text-xs">Email address *</Label>
            <Input id="rcp-email" type="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="tunde@yourcompany.com" className="h-9 text-xs" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Notify on</Label>
            <div className="grid grid-cols-2 gap-1.5">
              {([
                { k: 'reassignment',     label: 'Device reassignment' },
                { k: 'new-device',       label: 'New device enrolled' },
                { k: 'device-removed',   label: 'Device removed' },
                { k: 'compliance-fail',  label: 'Compliance failure' },
              ] as { k: Recipient['notifyOn'][number]; label: string }[]).map((o) => (
                <button key={o.k} type="button"
                  onClick={() => setNotifyOn(toggle(notifyOn, o.k))}
                  className={cn('flex items-center justify-between gap-2 rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition-colors',
                    notifyOn.includes(o.k) ? 'border-coral bg-coral/10 text-coral-dark' : 'border-border bg-background text-foreground hover:bg-muted/40')}>
                  {o.label}
                  {notifyOn.includes(o.k) && <Check className="h-3 w-3" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Delivery channels</Label>
            <div className="flex flex-wrap gap-1.5">
              {([
                { k: 'email',  label: 'Email' },
                { k: 'in-app', label: 'In-app' },
                { k: 'slack',  label: 'Slack' },
                { k: 'teams',  label: 'Teams' },
              ] as { k: Recipient['channel'][number]; label: string }[]).map((c) => (
                <button key={c.k} type="button"
                  onClick={() => setChannel(toggle(channel, c.k))}
                  className={cn('rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors',
                    channel.includes(c.k) ? 'border-coral bg-coral/10 text-coral-dark' : 'border-border bg-background hover:bg-muted/40')}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" className="bg-coral text-white hover:bg-coral-dark"
            disabled={!email.trim()} onClick={handleSave}>
            <Mail className="h-3 w-3" />Save recipient
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Stat tile ──────────────────────────────────────────────────────────────

function StatTile({
  icon: Icon, label, value, sub,
}: { icon: typeof Cloud; label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <Icon className="h-3.5 w-3.5 text-coral" />
      </div>
      <p className="mt-1.5 font-display text-2xl font-bold tabular-nums">{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
    </div>
  );
}
