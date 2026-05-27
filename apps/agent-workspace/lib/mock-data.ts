/**
 * Mock data for the agent workspace. Replace with real API calls when the
 * backend is ready. The shape is aligned with PRD Section 8 (Helpdesk) and
 * Section 9 (Asset Management).
 */

export type TicketStatus =
  | 'new'
  | 'open'
  | 'in_progress'
  | 'pending'
  | 'on_hold'
  | 'escalated'
  | 'resolved'
  | 'closed';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type SlaStatus = 'on_track' | 'at_risk' | 'breached';

export type TicketChannel =
  | 'email'
  | 'portal'
  | 'whatsapp'
  | 'voice'
  | 'sms'
  | 'widget'
  | 'api';

export interface Person {
  id: string;
  name: string;
  email: string;
}

export interface ConversationMessage {
  id: string;
  author: Person;
  authorType: 'agent' | 'customer' | 'system';
  body: string;
  isInternal: boolean;
  createdAt: string;
}

export interface MockAsset {
  id: string;
  tag: string;
  name: string;
  category: string;
  status: 'in_use' | 'in_stock' | 'under_repair' | 'lost';
  assignedTo?: Person;
  location: string;
  purchaseDate: string;
  warrantyEnd: string;
  specifications: string;
}

export interface MockTicket {
  id: string;
  number: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  channel: TicketChannel;
  requester: Person;
  assignee?: Person;
  group: string;
  createdAt: string;
  updatedAt: string;
  slaStatus: SlaStatus;
  slaDueAt: string;
  linkedAssetId?: string;
  conversations: ConversationMessage[];
  tags: string[];
}

const agents: Person[] = [
  { id: 'a1', name: 'Tunde Bakare', email: 'tunde@consomoafrica.com' },
  { id: 'a2', name: 'Adaeze Nwosu', email: 'adaeze@consomoafrica.com' },
  { id: 'a3', name: 'Kwame Mensah', email: 'kwame@consomoafrica.com' },
  { id: 'a4', name: 'Fatima Suleiman', email: 'fatima@consomoafrica.com' },
  { id: 'a5', name: 'Chinedu Okafor', email: 'chinedu@consomoafrica.com' },
];

const customers: Person[] = [
  { id: 'c1', name: 'Sarah Okonkwo', email: 'sarah.o@acmebank.ng' },
  { id: 'c2', name: 'Daniel Mwangi', email: 'd.mwangi@safarihold.co.ke' },
  { id: 'c3', name: 'Aisha Ibrahim', email: 'aisha.i@northfield.ng' },
  { id: 'c4', name: 'Marcus Botha', email: 'marcus@kasi-pay.co.za' },
  { id: 'c5', name: 'Lerato Mokoena', email: 'lerato@kasi-pay.co.za' },
  { id: 'c6', name: 'Joshua Adekunle', email: 'josh@flairtech.ng' },
  { id: 'c7', name: 'Grace Maathai', email: 'grace@safarihold.co.ke' },
  { id: 'c8', name: 'Emmanuel Diallo', email: 'emm@dakarlink.sn' },
];

const ago = (mins: number) =>
  new Date(Date.now() - mins * 60 * 1000).toISOString();
const future = (mins: number) =>
  new Date(Date.now() + mins * 60 * 1000).toISOString();

export const mockTickets: MockTicket[] = [
  {
    id: 't-1024',
    number: '#1024',
    subject: 'Cannot connect to office VPN from new laptop',
    description:
      'I received my new MacBook yesterday and cannot connect to the corporate VPN. The Cisco AnyConnect client returns "Login Failed" every time, even after a fresh install. Other devices work fine on the same network.',
    status: 'open',
    priority: 'high',
    category: 'Network / VPN',
    channel: 'email',
    requester: customers[0]!,
    assignee: agents[0]!,
    group: 'Tier 1 Support',
    createdAt: ago(42),
    updatedAt: ago(8),
    slaStatus: 'at_risk',
    slaDueAt: future(18),
    linkedAssetId: 'as-mbp-014',
    tags: ['vpn', 'new-hire'],
    conversations: [
      {
        id: 'm1',
        author: customers[0]!,
        authorType: 'customer',
        body: 'Hi team, my new MacBook cannot connect to the VPN. Tried reinstalling Cisco AnyConnect twice.',
        isInternal: false,
        createdAt: ago(42),
      },
      {
        id: 'm2',
        author: agents[0]!,
        authorType: 'agent',
        body: 'Hi Sarah, thanks for reporting. I can see your laptop in the asset register. Could you share a screenshot of the exact error?',
        isInternal: false,
        createdAt: ago(28),
      },
      {
        id: 'm3',
        author: agents[0]!,
        authorType: 'agent',
        body: 'Note: this is the third VPN issue this week from the new MacBook batch. Need to check if cert provisioning is missing in the imaging script.',
        isInternal: true,
        createdAt: ago(25),
      },
      {
        id: 'm4',
        author: customers[0]!,
        authorType: 'customer',
        body: 'Attached the screenshot. The error is "AnyConnect was unable to establish a connection to the specified secure gateway".',
        isInternal: false,
        createdAt: ago(8),
      },
    ],
  },
  {
    id: 't-1023',
    number: '#1023',
    subject: 'Printer on 3rd floor showing paper jam (no jam visible)',
    description: 'HP printer in marketing area keeps reporting paper jam.',
    status: 'in_progress',
    priority: 'medium',
    category: 'Hardware',
    channel: 'portal',
    requester: customers[2]!,
    assignee: agents[1]!,
    group: 'Field Support',
    createdAt: ago(180),
    updatedAt: ago(45),
    slaStatus: 'on_track',
    slaDueAt: future(120),
    tags: ['printer', 'hardware'],
    conversations: [],
  },
  {
    id: 't-1022',
    number: '#1022',
    subject: 'Need access to the Q3 reporting workspace',
    description: 'Manager approval received yesterday. Please grant access.',
    status: 'pending',
    priority: 'low',
    category: 'Access Request',
    channel: 'portal',
    requester: customers[5]!,
    assignee: agents[2]!,
    group: 'IT Operations',
    createdAt: ago(360),
    updatedAt: ago(180),
    slaStatus: 'on_track',
    slaDueAt: future(480),
    tags: ['access'],
    conversations: [],
  },
  {
    id: 't-1021',
    number: '#1021',
    subject: 'Two CCTV cameras on Ikeja branch are offline',
    description: 'Cameras at entrances 2 and 4 went offline overnight.',
    status: 'escalated',
    priority: 'urgent',
    category: 'Security / CCTV',
    channel: 'voice',
    requester: customers[1]!,
    assignee: agents[3]!,
    group: 'Security Ops',
    createdAt: ago(95),
    updatedAt: ago(10),
    slaStatus: 'breached',
    slaDueAt: ago(15),
    tags: ['cctv', 'security', 'ikeja'],
    conversations: [],
  },
  {
    id: 't-1020',
    number: '#1020',
    subject: 'Outlook keeps asking for password every hour',
    description: 'Reset password yesterday. Still being prompted constantly.',
    status: 'open',
    priority: 'medium',
    category: 'Email',
    channel: 'email',
    requester: customers[3]!,
    assignee: agents[0]!,
    group: 'Tier 1 Support',
    createdAt: ago(60),
    updatedAt: ago(20),
    slaStatus: 'on_track',
    slaDueAt: future(180),
    tags: ['email', 'mfa'],
    conversations: [],
  },
  {
    id: 't-1019',
    number: '#1019',
    subject: 'Request: laptop for new joiner starting Monday',
    description: 'Please provision a MacBook Pro for John Adesanya, starting May 26.',
    status: 'new',
    priority: 'medium',
    category: 'Hardware Request',
    channel: 'portal',
    requester: customers[6]!,
    group: 'IT Operations',
    createdAt: ago(15),
    updatedAt: ago(15),
    slaStatus: 'on_track',
    slaDueAt: future(720),
    tags: ['onboarding', 'hardware'],
    conversations: [],
  },
  {
    id: 't-1018',
    number: '#1018',
    subject: 'Slack notifications muted for #support channel',
    description: 'Cannot un-mute. Tried web and desktop.',
    status: 'resolved',
    priority: 'low',
    category: 'Software',
    channel: 'whatsapp',
    requester: customers[7]!,
    assignee: agents[4]!,
    group: 'Tier 1 Support',
    createdAt: ago(720),
    updatedAt: ago(360),
    slaStatus: 'on_track',
    slaDueAt: ago(300),
    tags: ['slack'],
    conversations: [],
  },
  {
    id: 't-1017',
    number: '#1017',
    subject: 'Conference room AV system not detecting laptop HDMI',
    description: 'Room 4B. Issue started this morning.',
    status: 'open',
    priority: 'high',
    category: 'AV / Meeting Rooms',
    channel: 'voice',
    requester: customers[4]!,
    assignee: agents[1]!,
    group: 'Field Support',
    createdAt: ago(120),
    updatedAt: ago(50),
    slaStatus: 'at_risk',
    slaDueAt: future(45),
    tags: ['av', 'meeting-room'],
    conversations: [],
  },
  {
    id: 't-1016',
    number: '#1016',
    subject: 'Cannot install Adobe Creative Cloud — license check fails',
    description: 'Need licence assignment for marketing seat.',
    status: 'pending',
    priority: 'medium',
    category: 'Software',
    channel: 'portal',
    requester: customers[2]!,
    assignee: agents[0]!,
    group: 'Tier 1 Support',
    createdAt: ago(220),
    updatedAt: ago(130),
    slaStatus: 'on_track',
    slaDueAt: future(300),
    tags: ['adobe', 'licence'],
    conversations: [],
  },
  {
    id: 't-1015',
    number: '#1015',
    subject: 'New starter — laptop, monitor, badge for Joshua A.',
    description: 'Onboarding for Joshua starting Mon 26 May.',
    status: 'in_progress',
    priority: 'medium',
    category: 'Onboarding',
    channel: 'api',
    requester: customers[5]!,
    assignee: agents[0]!,
    group: 'IT Operations',
    createdAt: ago(1440),
    updatedAt: ago(60),
    slaStatus: 'on_track',
    slaDueAt: future(960),
    tags: ['onboarding'],
    conversations: [],
  },
  {
    id: 't-1014',
    number: '#1014',
    subject: 'WhatsApp delivery receipts not appearing for outbound replies',
    description: 'Reps say they cannot tell if customers received WA messages.',
    status: 'open',
    priority: 'high',
    category: 'Helpdesk Channels',
    channel: 'whatsapp',
    requester: customers[3]!,
    assignee: agents[2]!,
    group: 'Tier 2 Support',
    createdAt: ago(85),
    updatedAt: ago(25),
    slaStatus: 'at_risk',
    slaDueAt: future(55),
    tags: ['whatsapp', 'channel'],
    conversations: [],
  },
  {
    id: 't-1013',
    number: '#1013',
    subject: 'Door access card not working for floor 5',
    description: 'Lost-and-found returned the card; reader still rejects.',
    status: 'open',
    priority: 'low',
    category: 'Security / Access',
    channel: 'portal',
    requester: customers[6]!,
    assignee: agents[3]!,
    group: 'Security Ops',
    createdAt: ago(310),
    updatedAt: ago(180),
    slaStatus: 'on_track',
    slaDueAt: future(900),
    tags: ['access', 'badge'],
    conversations: [],
  },
  {
    id: 't-1012',
    number: '#1012',
    subject: 'Salesforce integration is timing out on contact sync',
    description: 'Sync runs but errors after 30s.',
    status: 'new',
    priority: 'medium',
    category: 'Integrations',
    channel: 'api',
    requester: customers[0]!,
    group: 'Tier 2 Support',
    createdAt: ago(30),
    updatedAt: ago(30),
    slaStatus: 'on_track',
    slaDueAt: future(450),
    tags: ['integration', 'salesforce'],
    conversations: [],
  },
  {
    id: 't-1011',
    number: '#1011',
    subject: 'Phishing email reported by 14 staff this morning',
    description: 'Subject "URGENT — Payroll update". Blocked at gateway after first report.',
    status: 'escalated',
    priority: 'urgent',
    category: 'Security / Phishing',
    channel: 'email',
    requester: customers[1]!,
    assignee: agents[3]!,
    group: 'Security Ops',
    createdAt: ago(150),
    updatedAt: ago(5),
    slaStatus: 'at_risk',
    slaDueAt: future(30),
    tags: ['security', 'phishing'],
    conversations: [],
  },
  {
    id: 't-1010',
    number: '#1010',
    subject: 'Need shared mailbox for accounts-payable team',
    description: 'Five users need send-as access.',
    status: 'pending',
    priority: 'low',
    category: 'Email',
    channel: 'portal',
    requester: customers[7]!,
    assignee: agents[4]!,
    group: 'IT Operations',
    createdAt: ago(900),
    updatedAt: ago(400),
    slaStatus: 'on_track',
    slaDueAt: future(1200),
    tags: ['email', 'access'],
    conversations: [],
  },
  {
    id: 't-1009',
    number: '#1009',
    subject: 'Zoom Phone audio cuts in and out',
    description: 'Affecting customer success team in Nairobi.',
    status: 'in_progress',
    priority: 'high',
    category: 'Telephony',
    channel: 'voice',
    requester: customers[6]!,
    assignee: agents[1]!,
    group: 'Tier 2 Support',
    createdAt: ago(200),
    updatedAt: ago(40),
    slaStatus: 'at_risk',
    slaDueAt: future(70),
    tags: ['zoom', 'voip'],
    conversations: [],
  },
  {
    id: 't-1008',
    number: '#1008',
    subject: 'Two-factor reset for departing contractor',
    description: 'Contractor handed in laptop, need to revoke 2FA.',
    status: 'open',
    priority: 'medium',
    category: 'Identity',
    channel: 'sms',
    requester: customers[4]!,
    assignee: agents[2]!,
    group: 'Identity & Access',
    createdAt: ago(110),
    updatedAt: ago(35),
    slaStatus: 'on_track',
    slaDueAt: future(220),
    tags: ['mfa', 'offboarding'],
    conversations: [],
  },
  {
    id: 't-1007',
    number: '#1007',
    subject: 'Mobile app stuck on splash screen',
    description: 'Reported by 3 customers via in-app widget.',
    status: 'new',
    priority: 'high',
    category: 'Mobile',
    channel: 'widget',
    requester: customers[3]!,
    group: 'Tier 2 Support',
    createdAt: ago(20),
    updatedAt: ago(20),
    slaStatus: 'on_track',
    slaDueAt: future(160),
    tags: ['mobile', 'splash'],
    conversations: [],
  },
  {
    id: 't-1006',
    number: '#1006',
    subject: 'New laptop request for Lagos office expansion (×6)',
    description: 'Procurement needed for 6 desks by end of month.',
    status: 'pending',
    priority: 'low',
    category: 'Procurement',
    channel: 'email',
    requester: customers[5]!,
    assignee: agents[4]!,
    group: 'IT Operations',
    createdAt: ago(2880),
    updatedAt: ago(1000),
    slaStatus: 'on_track',
    slaDueAt: future(7200),
    tags: ['procurement', 'lagos'],
    conversations: [],
  },
  {
    id: 't-1005',
    number: '#1005',
    subject: 'Customer cannot pay invoice via Paystack',
    description: 'Card declined repeatedly. Customer is high-tier.',
    status: 'open',
    priority: 'urgent',
    category: 'Billing',
    channel: 'whatsapp',
    requester: customers[7]!,
    assignee: agents[0]!,
    group: 'Billing',
    createdAt: ago(55),
    updatedAt: ago(12),
    slaStatus: 'at_risk',
    slaDueAt: future(20),
    tags: ['billing', 'vip'],
    conversations: [],
  },
];

export const mockAssets: MockAsset[] = [
  {
    id: 'as-mbp-014',
    tag: 'CON-LT-014',
    name: 'MacBook Pro 14" (M3 Pro)',
    category: 'Laptop',
    status: 'in_use',
    assignedTo: customers[0]!,
    location: 'Lagos HQ - Floor 4',
    purchaseDate: '2026-05-12',
    warrantyEnd: '2029-05-12',
    specifications: 'M3 Pro / 18GB RAM / 512GB SSD / Space Black',
  },
  {
    id: 'as-mbp-013',
    tag: 'CON-LT-013',
    name: 'MacBook Pro 14" (M3 Pro)',
    category: 'Laptop',
    status: 'in_stock',
    location: 'Lagos HQ - IT Store',
    purchaseDate: '2026-05-12',
    warrantyEnd: '2029-05-12',
    specifications: 'M3 Pro / 18GB RAM / 512GB SSD / Space Black',
  },
  {
    id: 'as-dsk-022',
    tag: 'CON-DT-022',
    name: 'Dell OptiPlex 7010',
    category: 'Desktop',
    status: 'in_use',
    assignedTo: customers[2]!,
    location: 'Lagos HQ - Floor 3',
    purchaseDate: '2025-03-04',
    warrantyEnd: '2028-03-04',
    specifications: 'i7-13700 / 32GB RAM / 1TB NVMe',
  },
  {
    id: 'as-cct-041',
    tag: 'CON-CCTV-041',
    name: 'Hikvision DS-2CD2363G2',
    category: 'CCTV Camera',
    status: 'in_use',
    location: 'Ikeja Branch - Entrance 2',
    purchaseDate: '2024-11-20',
    warrantyEnd: '2027-11-20',
    specifications: '6MP / IP67 / 30m IR / PoE',
  },
  {
    id: 'as-cct-042',
    tag: 'CON-CCTV-042',
    name: 'Hikvision DS-2CD2363G2',
    category: 'CCTV Camera',
    status: 'under_repair',
    location: 'Ikeja Branch - Entrance 4',
    purchaseDate: '2024-11-20',
    warrantyEnd: '2027-11-20',
    specifications: '6MP / IP67 / 30m IR / PoE',
  },
  {
    id: 'as-prn-009',
    tag: 'CON-PR-009',
    name: 'HP LaserJet Pro M404dn',
    category: 'Printer',
    status: 'in_use',
    location: 'Lagos HQ - Floor 3 (Marketing)',
    purchaseDate: '2024-08-15',
    warrantyEnd: '2027-08-15',
    specifications: 'Mono / 38ppm / Duplex / Network',
  },
  {
    id: 'as-mon-031',
    tag: 'CON-MN-031',
    name: 'Dell UltraSharp U2723QE',
    category: 'Monitor',
    status: 'in_use',
    assignedTo: customers[0]!,
    location: 'Lagos HQ - Floor 4',
    purchaseDate: '2026-05-12',
    warrantyEnd: '2029-05-12',
    specifications: '27" / 4K UHD / USB-C 90W / IPS Black',
  },
  {
    id: 'as-phn-018',
    tag: 'CON-PH-018',
    name: 'iPhone 15 Pro',
    category: 'Mobile Device',
    status: 'in_use',
    assignedTo: customers[1]!,
    location: 'Nairobi - Field',
    purchaseDate: '2024-11-02',
    warrantyEnd: '2025-11-02',
    specifications: '256GB / Natural Titanium',
  },
];

export interface DashboardMetrics {
  openTickets: number;
  unassignedTickets: number;
  slaAtRisk: number;
  slaBreached: number;
  resolvedToday: number;
  avgFirstResponseMinutes: number;
  csatScore: number;
  csatSampleSize: number;
}

export const mockMetrics: DashboardMetrics = {
  openTickets: 47,
  unassignedTickets: 6,
  slaAtRisk: 4,
  slaBreached: 1,
  resolvedToday: 18,
  avgFirstResponseMinutes: 12,
  csatScore: 4.6,
  csatSampleSize: 213,
};

export const agentDirectory = agents;

// ─────────────────────────────────────────────────────────────────────────────
// Monitoring & NOC — Phase 3
// ─────────────────────────────────────────────────────────────────────────────

// ── Types ─────────────────────────────────────────────────────────────────────

export type DeviceStatus = 'up' | 'down' | 'warning' | 'paused' | 'unknown';
export type DeviceType =
  | 'server'
  | 'switch'
  | 'router'
  | 'firewall'
  | 'access_point'
  | 'nvr'
  | 'printer'
  | 'ups';
export type SensorType =
  | 'ping'
  | 'cpu'
  | 'memory'
  | 'disk'
  | 'interface'
  | 'http'
  | 'service'
  | 'battery'
  | 'temperature'
  | 'clients'
  | 'sessions';
export type MonAlertSeverity = 'critical' | 'error' | 'warning' | 'info';
export type MonAlertState = 'active' | 'acknowledged' | 'resolved';

export interface MockSensor {
  id: string;
  name: string;
  type: SensorType;
  status: DeviceStatus;
  value: number;
  unit: string;
  uptime: number; // 0–100 %
  lastCheck: string;
  sparkline: readonly number[];
}

export interface MockDevice {
  id: string;
  name: string;
  ip: string;
  fqdn?: string;
  type: DeviceType;
  site: string;
  location: string;
  group: string;
  status: DeviceStatus;
  lastCheck: string;
  uptimePct: number; // 30-day rolling
  sensors: MockSensor[];
  vendor: string;
  model: string;
  os?: string;
  tags: string[];
}

export interface MockMonAlert {
  id: string;
  deviceId: string;
  deviceName: string;
  site: string;
  sensorName: string;
  title: string;
  message: string;
  severity: MonAlertSeverity;
  state: MonAlertState;
  triggeredAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
}

export interface IncidentTimelineEvent {
  id: string;
  time: string;
  actor: string;
  actorType: 'system' | 'agent';
  message: string;
  type: 'detection' | 'alert' | 'acknowledge' | 'update' | 'resolve' | 'escalate';
}

export interface MockIncident {
  id: string;
  title: string;
  severity: MonAlertSeverity;
  state: 'open' | 'investigating' | 'resolved';
  affectedDevices: string[];
  affectedSites: string[];
  startedAt: string;
  resolvedAt?: string;
  timeline: IncidentTimelineEvent[];
}

export interface MaintenanceWindow {
  id: string;
  name: string;
  deviceIds: string[];
  deviceNames: string[];
  sites: string[];
  startAt: string;
  endAt: string;
  status: 'active' | 'scheduled' | 'completed';
  createdBy: string;
  notes?: string;
  recurrence: 'none' | 'weekly' | 'monthly';
}

export interface AlertRule {
  id: string;
  name: string;
  target: string;
  metric: string;
  condition: string;
  threshold: string;
  severity: MonAlertSeverity;
  channels: string[];
  enabled: boolean;
  triggeredCount: number;
  lastTriggered?: string;
}

export interface NOCMetrics {
  totalDevices: number;
  upDevices: number;
  downDevices: number;
  warningDevices: number;
  pausedDevices: number;
  totalSensors: number;
  upSensors: number;
  downSensors: number;
  warningSensors: number;
  activeAlerts: number;
  criticalAlerts: number;
  openIncidents: number;
  avgUptime30d: number;
}

export interface TopologyNode {
  id: string;
  deviceId?: string;
  label: string;
  sublabel?: string;
  type: DeviceType | 'cloud' | 'cluster';
  x: number;
  y: number;
  status: DeviceStatus;
}

export interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  utilization: number; // 0–100
  bandwidth: string;
}

export interface TopologyData {
  site: string;
  nodes: TopologyNode[];
  edges: TopologyEdge[];
}

// ── Devices ───────────────────────────────────────────────────────────────────

const spk = (arr: number[]): readonly number[] => arr;

export const mockDevices: MockDevice[] = [
  // ── Lagos HQ — Servers ──────────────────────────────────────────────────────
  {
    id: 'dev-srv-001',
    name: 'LAGOS-DC01',
    ip: '10.10.1.1',
    fqdn: 'lagos-dc01.consomoafrica.local',
    type: 'server',
    site: 'Lagos HQ',
    location: 'Server Room B2',
    group: 'Domain Controllers',
    status: 'up',
    lastCheck: ago(2),
    uptimePct: 99.8,
    vendor: 'Dell',
    model: 'PowerEdge R750',
    os: 'Windows Server 2022',
    tags: ['critical', 'dc', 'active-directory'],
    sensors: [
      { id: 's001-ping', name: 'Ping', type: 'ping', status: 'up', value: 1, unit: 'ms', uptime: 100, lastCheck: ago(2), sparkline: spk([1,1,2,1,1,1,2,1,1,1,1,1]) },
      { id: 's001-cpu', name: 'CPU Load', type: 'cpu', status: 'up', value: 38, unit: '%', uptime: 99.8, lastCheck: ago(2), sparkline: spk([32,35,41,38,36,40,38,42,37,35,38,38]) },
      { id: 's001-mem', name: 'Memory', type: 'memory', status: 'up', value: 54, unit: '%', uptime: 100, lastCheck: ago(2), sparkline: spk([50,51,52,53,54,53,54,55,53,52,54,54]) },
      { id: 's001-disk', name: 'Disk C:', type: 'disk', status: 'up', value: 42, unit: '%', uptime: 100, lastCheck: ago(2), sparkline: spk([40,40,41,41,41,42,42,42,42,42,42,42]) },
      { id: 's001-svc', name: 'ADDS Service', type: 'service', status: 'up', value: 1, unit: '', uptime: 100, lastCheck: ago(2), sparkline: spk([1,1,1,1,1,1,1,1,1,1,1,1]) },
    ],
  },
  {
    id: 'dev-srv-002',
    name: 'LAGOS-MAIL01',
    ip: '10.10.1.2',
    fqdn: 'lagos-mail01.consomoafrica.local',
    type: 'server',
    site: 'Lagos HQ',
    location: 'Server Room B2',
    group: 'Mail Servers',
    status: 'warning',
    lastCheck: ago(2),
    uptimePct: 99.1,
    vendor: 'HP',
    model: 'ProLiant DL380 Gen10',
    os: 'Windows Server 2019',
    tags: ['critical', 'email', 'exchange'],
    sensors: [
      { id: 's002-ping', name: 'Ping', type: 'ping', status: 'up', value: 1, unit: 'ms', uptime: 100, lastCheck: ago(2), sparkline: spk([1,1,1,2,1,1,1,1,1,1,2,1]) },
      { id: 's002-cpu', name: 'CPU Load', type: 'cpu', status: 'up', value: 52, unit: '%', uptime: 99.2, lastCheck: ago(2), sparkline: spk([45,48,52,55,51,54,58,53,50,52,54,52]) },
      { id: 's002-mem', name: 'Memory', type: 'memory', status: 'up', value: 71, unit: '%', uptime: 99.5, lastCheck: ago(2), sparkline: spk([68,70,71,72,71,73,72,71,70,71,72,71]) },
      { id: 's002-disk', name: 'Disk D: (Exchange DB)', type: 'disk', status: 'warning', value: 87, unit: '%', uptime: 99.1, lastCheck: ago(2), sparkline: spk([78,80,81,82,83,84,84,85,86,86,87,87]) },
      { id: 's002-smtp', name: 'SMTP Port 25', type: 'service', status: 'up', value: 1, unit: '', uptime: 100, lastCheck: ago(2), sparkline: spk([1,1,1,1,1,1,1,1,1,1,1,1]) },
    ],
  },
  {
    id: 'dev-srv-003',
    name: 'LAGOS-BACKUP01',
    ip: '10.10.1.3',
    fqdn: 'lagos-backup01.consomoafrica.local',
    type: 'server',
    site: 'Lagos HQ',
    location: 'Server Room B2',
    group: 'Backup Servers',
    status: 'up',
    lastCheck: ago(2),
    uptimePct: 99.9,
    vendor: 'Dell',
    model: 'PowerEdge R550',
    os: 'Windows Server 2022',
    tags: ['backup', 'veeam'],
    sensors: [
      { id: 's003-ping', name: 'Ping', type: 'ping', status: 'up', value: 1, unit: 'ms', uptime: 100, lastCheck: ago(2), sparkline: spk([1,1,1,1,1,1,1,1,1,1,1,1]) },
      { id: 's003-cpu', name: 'CPU Load', type: 'cpu', status: 'up', value: 18, unit: '%', uptime: 100, lastCheck: ago(2), sparkline: spk([15,12,18,22,45,48,20,15,12,14,18,18]) },
      { id: 's003-disk', name: 'Disk E: (Backup Vol)', type: 'disk', status: 'up', value: 62, unit: '%', uptime: 100, lastCheck: ago(2), sparkline: spk([58,59,60,60,61,61,62,62,62,62,62,62]) },
    ],
  },
  {
    id: 'dev-srv-004',
    name: 'LAGOS-VMH01',
    ip: '10.10.1.4',
    fqdn: 'lagos-vmh01.consomoafrica.local',
    type: 'server',
    site: 'Lagos HQ',
    location: 'Server Room B2',
    group: 'Virtualisation Hosts',
    status: 'up',
    lastCheck: ago(2),
    uptimePct: 100,
    vendor: 'Lenovo',
    model: 'ThinkSystem SR860 V2',
    os: 'VMware ESXi 8.0',
    tags: ['vmware', 'esxi', 'critical'],
    sensors: [
      { id: 's004-ping', name: 'Ping', type: 'ping', status: 'up', value: 1, unit: 'ms', uptime: 100, lastCheck: ago(2), sparkline: spk([1,1,1,1,1,1,1,1,1,1,1,1]) },
      { id: 's004-cpu', name: 'CPU Load', type: 'cpu', status: 'up', value: 61, unit: '%', uptime: 100, lastCheck: ago(2), sparkline: spk([55,58,62,60,61,63,60,59,61,62,61,61]) },
      { id: 's004-mem', name: 'Memory', type: 'memory', status: 'up', value: 79, unit: '%', uptime: 100, lastCheck: ago(2), sparkline: spk([75,76,77,78,79,79,78,79,80,79,79,79]) },
    ],
  },
  // ── Lagos HQ — Network ──────────────────────────────────────────────────────
  {
    id: 'dev-sw-001',
    name: 'SW-CORE-LG01',
    ip: '10.10.1.10',
    type: 'switch',
    site: 'Lagos HQ',
    location: 'Server Room B2',
    group: 'Core Switches',
    status: 'up',
    lastCheck: ago(2),
    uptimePct: 100,
    vendor: 'Cisco',
    model: 'Catalyst 9300-48P',
    tags: ['core', 'critical'],
    sensors: [
      { id: 's010-ping', name: 'Ping', type: 'ping', status: 'up', value: 1, unit: 'ms', uptime: 100, lastCheck: ago(2), sparkline: spk([1,1,1,1,1,1,1,1,1,1,1,1]) },
      { id: 's010-cpu', name: 'CPU', type: 'cpu', status: 'up', value: 22, unit: '%', uptime: 100, lastCheck: ago(2), sparkline: spk([18,20,22,21,23,22,21,22,23,22,22,22]) },
      { id: 's010-if', name: 'GigE0/1 (Uplink)', type: 'interface', status: 'up', value: 142, unit: 'Mbps', uptime: 100, lastCheck: ago(2), sparkline: spk([98,112,132,145,142,158,162,178,168,155,142,142]) },
    ],
  },
  {
    id: 'dev-fw-001',
    name: 'FG-200F-LG01',
    ip: '10.10.1.254',
    fqdn: 'fg-lghq.consomoafrica.local',
    type: 'firewall',
    site: 'Lagos HQ',
    location: 'Server Room B2',
    group: 'Firewalls',
    status: 'up',
    lastCheck: ago(2),
    uptimePct: 100,
    vendor: 'Fortinet',
    model: 'FortiGate 200F',
    os: 'FortiOS 7.4.3',
    tags: ['firewall', 'critical', 'wan'],
    sensors: [
      { id: 's020-ping', name: 'Ping', type: 'ping', status: 'up', value: 1, unit: 'ms', uptime: 100, lastCheck: ago(2), sparkline: spk([1,1,1,1,1,1,1,1,1,1,1,1]) },
      { id: 's020-cpu', name: 'CPU', type: 'cpu', status: 'up', value: 31, unit: '%', uptime: 100, lastCheck: ago(2), sparkline: spk([28,30,32,31,30,33,31,30,32,31,30,31]) },
      { id: 's020-sess', name: 'Active Sessions', type: 'sessions', status: 'up', value: 14832, unit: '', uptime: 100, lastCheck: ago(2), sparkline: spk([12000,13500,14200,14832,15100,14500,13800,14200,14832,14500,14200,14832]) },
      { id: 's020-wan', name: 'WAN (in+out)', type: 'interface', status: 'up', value: 287, unit: 'Mbps', uptime: 100, lastCheck: ago(2), sparkline: spk([210,240,265,280,287,295,278,265,287,292,280,287]) },
    ],
  },
  {
    id: 'dev-ap-001',
    name: 'AP-FL1-LG01',
    ip: '10.10.1.20',
    type: 'access_point',
    site: 'Lagos HQ',
    location: 'Floor 1 (Reception)',
    group: 'Access Points',
    status: 'up',
    lastCheck: ago(2),
    uptimePct: 99.5,
    vendor: 'Ubiquiti',
    model: 'UniFi U6-Pro',
    tags: ['wireless'],
    sensors: [
      { id: 's021-ping', name: 'Ping', type: 'ping', status: 'up', value: 1, unit: 'ms', uptime: 100, lastCheck: ago(2), sparkline: spk([1,1,1,1,1,1,1,1,1,1,1,1]) },
      { id: 's021-clients', name: 'Associated Clients', type: 'clients', status: 'up', value: 24, unit: '', uptime: 99.5, lastCheck: ago(2), sparkline: spk([12,15,18,22,24,28,32,30,24,22,24,24]) },
      { id: 's021-tx', name: 'Traffic Throughput', type: 'interface', status: 'up', value: 38, unit: 'Mbps', uptime: 99.5, lastCheck: ago(2), sparkline: spk([22,28,32,36,38,42,40,36,38,35,38,38]) },
    ],
  },
  {
    id: 'dev-ap-002',
    name: 'AP-FL2-LG01',
    ip: '10.10.1.21',
    type: 'access_point',
    site: 'Lagos HQ',
    location: 'Floor 2 (Open Plan)',
    group: 'Access Points',
    status: 'up',
    lastCheck: ago(2),
    uptimePct: 99.8,
    vendor: 'Ubiquiti',
    model: 'UniFi U6-Pro',
    tags: ['wireless'],
    sensors: [
      { id: 's022-ping', name: 'Ping', type: 'ping', status: 'up', value: 1, unit: 'ms', uptime: 100, lastCheck: ago(2), sparkline: spk([1,1,1,1,1,1,1,1,1,1,1,1]) },
      { id: 's022-clients', name: 'Associated Clients', type: 'clients', status: 'up', value: 41, unit: '', uptime: 99.8, lastCheck: ago(2), sparkline: spk([28,32,38,42,41,48,52,46,42,40,41,41]) },
      { id: 's022-tx', name: 'Traffic Throughput', type: 'interface', status: 'up', value: 62, unit: 'Mbps', uptime: 99.8, lastCheck: ago(2), sparkline: spk([42,48,56,60,62,68,65,62,60,58,62,62]) },
    ],
  },
  {
    id: 'dev-ups-001',
    name: 'UPS-DC-LG01',
    ip: '10.10.1.30',
    type: 'ups',
    site: 'Lagos HQ',
    location: 'Server Room B2',
    group: 'Power',
    status: 'warning',
    lastCheck: ago(2),
    uptimePct: 99.9,
    vendor: 'APC',
    model: 'Smart-UPS 3000VA',
    tags: ['power', 'ups'],
    sensors: [
      { id: 's030-ping', name: 'Ping', type: 'ping', status: 'up', value: 2, unit: 'ms', uptime: 100, lastCheck: ago(2), sparkline: spk([1,1,2,1,2,1,1,2,1,1,2,2]) },
      { id: 's030-bat', name: 'Battery Level', type: 'battery', status: 'warning', value: 62, unit: '%', uptime: 99.9, lastCheck: ago(2), sparkline: spk([95,90,85,82,78,74,70,66,63,62,62,62]) },
      { id: 's030-load', name: 'Load', type: 'cpu', status: 'up', value: 68, unit: '%', uptime: 100, lastCheck: ago(2), sparkline: spk([65,66,67,68,68,69,68,67,68,68,68,68]) },
      { id: 's030-temp', name: 'Temperature', type: 'temperature', status: 'up', value: 32, unit: '°C', uptime: 100, lastCheck: ago(2), sparkline: spk([30,30,31,31,32,32,32,31,32,32,32,32]) },
    ],
  },
  // ── Ikeja Branch ────────────────────────────────────────────────────────────
  {
    id: 'dev-sw-003',
    name: 'SW-CORE-IK01',
    ip: '10.20.1.10',
    type: 'switch',
    site: 'Ikeja Branch',
    location: 'Comms Room',
    group: 'Core Switches',
    status: 'down',
    lastCheck: ago(42),
    uptimePct: 72.4,
    vendor: 'Cisco',
    model: 'Catalyst 9200-24P',
    tags: ['core'],
    sensors: [
      { id: 's031-ping', name: 'Ping', type: 'ping', status: 'down', value: 0, unit: 'ms', uptime: 72.4, lastCheck: ago(42), sparkline: spk([1,1,1,1,1,1,1,0,0,0,0,0]) },
      { id: 's031-cpu', name: 'CPU', type: 'cpu', status: 'unknown', value: 0, unit: '%', uptime: 72.4, lastCheck: ago(42), sparkline: spk([18,22,20,19,21,20,0,0,0,0,0,0]) },
    ],
  },
  {
    id: 'dev-fw-002',
    name: 'FG-60F-IK01',
    ip: '10.20.1.254',
    type: 'firewall',
    site: 'Ikeja Branch',
    location: 'Comms Room',
    group: 'Firewalls',
    status: 'warning',
    lastCheck: ago(2),
    uptimePct: 98.2,
    vendor: 'Fortinet',
    model: 'FortiGate 60F',
    os: 'FortiOS 7.4.1',
    tags: ['firewall', 'wan'],
    sensors: [
      { id: 's032-ping', name: 'Ping', type: 'ping', status: 'up', value: 18, unit: 'ms', uptime: 98.5, lastCheck: ago(2), sparkline: spk([2,3,5,8,12,18,22,18,16,15,18,18]) },
      { id: 's032-cpu', name: 'CPU', type: 'cpu', status: 'warning', value: 78, unit: '%', uptime: 98.2, lastCheck: ago(2), sparkline: spk([45,52,58,62,68,72,75,78,78,78,78,78]) },
      { id: 's032-mem', name: 'Memory', type: 'memory', status: 'warning', value: 81, unit: '%', uptime: 98.2, lastCheck: ago(2), sparkline: spk([65,68,70,72,75,77,78,79,80,81,81,81]) },
    ],
  },
  {
    id: 'dev-ap-003',
    name: 'AP-IK01',
    ip: '10.20.1.20',
    type: 'access_point',
    site: 'Ikeja Branch',
    location: 'Main Office Floor',
    group: 'Access Points',
    status: 'down',
    lastCheck: ago(42),
    uptimePct: 85.3,
    vendor: 'Ubiquiti',
    model: 'UniFi U6-Pro',
    tags: ['wireless'],
    sensors: [
      { id: 's033-ping', name: 'Ping', type: 'ping', status: 'down', value: 0, unit: 'ms', uptime: 85.3, lastCheck: ago(42), sparkline: spk([1,1,1,1,1,1,0,0,0,0,0,0]) },
      { id: 's033-clients', name: 'Associated Clients', type: 'clients', status: 'unknown', value: 0, unit: '', uptime: 85.3, lastCheck: ago(42), sparkline: spk([12,14,18,22,19,0,0,0,0,0,0,0]) },
    ],
  },
  {
    id: 'dev-nvr-001',
    name: 'NVR-IK01',
    ip: '10.20.1.50',
    type: 'nvr',
    site: 'Ikeja Branch',
    location: 'Security Room',
    group: 'CCTV / Security',
    status: 'down',
    lastCheck: ago(42),
    uptimePct: 88.1,
    vendor: 'Hikvision',
    model: 'DS-7716NXI-I4',
    tags: ['cctv', 'security'],
    sensors: [
      { id: 's034-ping', name: 'Ping', type: 'ping', status: 'down', value: 0, unit: 'ms', uptime: 88.1, lastCheck: ago(42), sparkline: spk([1,1,1,1,1,1,1,0,0,0,0,0]) },
      { id: 's034-disk', name: 'Recording Storage', type: 'disk', status: 'unknown', value: 0, unit: '%', uptime: 88.1, lastCheck: ago(42), sparkline: spk([72,74,75,76,77,0,0,0,0,0,0,0]) },
    ],
  },
  // ── Nairobi Office ──────────────────────────────────────────────────────────
  {
    id: 'dev-srv-005',
    name: 'NRB-APP01',
    ip: '10.30.1.1',
    fqdn: 'nrb-app01.consomoafrica.local',
    type: 'server',
    site: 'Nairobi Office',
    location: 'Server Closet',
    group: 'Application Servers',
    status: 'up',
    lastCheck: ago(2),
    uptimePct: 99.6,
    vendor: 'Dell',
    model: 'PowerEdge R450',
    os: 'Ubuntu 22.04 LTS',
    tags: ['application', 'linux'],
    sensors: [
      { id: 's040-ping', name: 'Ping', type: 'ping', status: 'up', value: 24, unit: 'ms', uptime: 99.6, lastCheck: ago(2), sparkline: spk([20,22,24,23,25,24,22,24,25,23,24,24]) },
      { id: 's040-cpu', name: 'CPU Load', type: 'cpu', status: 'up', value: 44, unit: '%', uptime: 99.8, lastCheck: ago(2), sparkline: spk([38,40,42,44,45,44,43,44,45,44,44,44]) },
      { id: 's040-mem', name: 'Memory', type: 'memory', status: 'up', value: 58, unit: '%', uptime: 100, lastCheck: ago(2), sparkline: spk([55,56,57,58,58,58,58,58,58,58,58,58]) },
      { id: 's040-http', name: 'HTTP Response', type: 'http', status: 'up', value: 285, unit: 'ms', uptime: 99.6, lastCheck: ago(2), sparkline: spk([210,225,240,265,285,280,285,290,282,285,285,285]) },
    ],
  },
  {
    id: 'dev-sw-004',
    name: 'SW-CORE-NRB01',
    ip: '10.30.1.10',
    type: 'switch',
    site: 'Nairobi Office',
    location: 'Server Closet',
    group: 'Core Switches',
    status: 'up',
    lastCheck: ago(2),
    uptimePct: 99.9,
    vendor: 'HP',
    model: 'Aruba 2930M-24G',
    tags: ['core'],
    sensors: [
      { id: 's041-ping', name: 'Ping', type: 'ping', status: 'up', value: 24, unit: 'ms', uptime: 100, lastCheck: ago(2), sparkline: spk([22,23,24,23,24,25,24,23,24,24,24,24]) },
      { id: 's041-cpu', name: 'CPU', type: 'cpu', status: 'up', value: 15, unit: '%', uptime: 100, lastCheck: ago(2), sparkline: spk([12,14,15,14,15,16,14,15,15,15,15,15]) },
    ],
  },
];

// ── Alerts ────────────────────────────────────────────────────────────────────

export const mockMonitoringAlerts: MockMonAlert[] = [
  {
    id: 'alt-001', deviceId: 'dev-sw-003', deviceName: 'SW-CORE-IK01', site: 'Ikeja Branch',
    sensorName: 'Ping',
    title: 'Device unreachable — network outage',
    message: 'Ping failed after 5 consecutive retries. All downstream devices (AP-IK01, NVR-IK01) also offline. Likely power failure in comms room.',
    severity: 'critical', state: 'active', triggeredAt: ago(42),
  },
  {
    id: 'alt-002', deviceId: 'dev-nvr-001', deviceName: 'NVR-IK01', site: 'Ikeja Branch',
    sensorName: 'Ping',
    title: 'CCTV NVR offline — recording stopped',
    message: 'Hikvision NVR is unreachable. CCTV recording has ceased. Downstream of SW-CORE-IK01 outage.',
    severity: 'critical', state: 'acknowledged', triggeredAt: ago(42),
    acknowledgedAt: ago(35), acknowledgedBy: 'Kwame Mensah',
  },
  {
    id: 'alt-003', deviceId: 'dev-fw-002', deviceName: 'FG-60F-IK01', site: 'Ikeja Branch',
    sensorName: 'CPU',
    title: 'FortiGate CPU sustained at 78%',
    message: 'FortiGate 60F CPU has been above 75% for 20+ minutes. May indicate policy loop or DDoS. WAN latency also elevated to 18ms.',
    severity: 'error', state: 'acknowledged', triggeredAt: ago(48),
    acknowledgedAt: ago(38), acknowledgedBy: 'Kwame Mensah',
  },
  {
    id: 'alt-004', deviceId: 'dev-ap-003', deviceName: 'AP-IK01', site: 'Ikeja Branch',
    sensorName: 'Ping',
    title: 'Access point offline — wireless down',
    message: 'AP-IK01 is unreachable. All wireless users in Ikeja Branch are disconnected.',
    severity: 'error', state: 'active', triggeredAt: ago(42),
  },
  {
    id: 'alt-005', deviceId: 'dev-srv-002', deviceName: 'LAGOS-MAIL01', site: 'Lagos HQ',
    sensorName: 'Disk D: (Exchange DB)',
    title: 'Exchange DB volume at 87% — action required',
    message: 'Exchange database volume (D:) is at 87% capacity. At current growth rate, estimated full in 6–8 days. Increase allocation or archive mailboxes.',
    severity: 'warning', state: 'active', triggeredAt: ago(95),
  },
  {
    id: 'alt-006', deviceId: 'dev-ups-001', deviceName: 'UPS-DC-LG01', site: 'Lagos HQ',
    sensorName: 'Battery Level',
    title: 'UPS battery degraded to 62%',
    message: 'APC Smart-UPS battery capacity at 62%. Battery replacement recommended within 30 days. At full load, estimated runtime ~8 minutes.',
    severity: 'warning', state: 'active', triggeredAt: ago(180),
  },
  {
    id: 'alt-007', deviceId: 'dev-fw-002', deviceName: 'FG-60F-IK01', site: 'Ikeja Branch',
    sensorName: 'Memory',
    title: 'FortiGate memory pressure — 81%',
    message: 'FortiGate 60F memory at 81%. UTM features may be throttling to manage memory.',
    severity: 'warning', state: 'acknowledged', triggeredAt: ago(50),
    acknowledgedAt: ago(35), acknowledgedBy: 'Kwame Mensah',
  },
  {
    id: 'alt-008', deviceId: 'dev-srv-005', deviceName: 'NRB-APP01', site: 'Nairobi Office',
    sensorName: 'HTTP Response',
    title: 'Application response elevated — 285ms',
    message: 'HTTP response time up from baseline 120ms to 285ms. Possible DB slowdown or traffic spike.',
    severity: 'info', state: 'active', triggeredAt: ago(25),
  },
  {
    id: 'alt-009', deviceId: 'dev-sw-001', deviceName: 'SW-CORE-LG01', site: 'Lagos HQ',
    sensorName: 'GigE0/1 (Uplink)',
    title: 'Core uplink utilisation high — 142 Mbps',
    message: 'Uplink approaching capacity (200 Mbps circuit) during morning peak. Review QoS policies.',
    severity: 'info', state: 'active', triggeredAt: ago(15),
  },
  {
    id: 'alt-010', deviceId: 'dev-srv-001', deviceName: 'LAGOS-DC01', site: 'Lagos HQ',
    sensorName: 'DNS Service',
    title: 'DNS resolution failures (resolved)',
    message: 'Primary DNS was reporting SERVFAIL for ~4 minutes after group policy update. Auto-resolved.',
    severity: 'critical', state: 'resolved', triggeredAt: ago(480), resolvedAt: ago(476),
  },
];

// ── Incidents ─────────────────────────────────────────────────────────────────

export const mockIncidents: MockIncident[] = [
  {
    id: 'inc-001',
    title: 'Ikeja Branch Network Outage',
    severity: 'critical',
    state: 'investigating',
    affectedDevices: ['SW-CORE-IK01', 'AP-IK01', 'NVR-IK01', 'FG-60F-IK01'],
    affectedSites: ['Ikeja Branch'],
    startedAt: ago(42),
    timeline: [
      { id: 'ie-1', time: ago(42), actor: 'Monitoring System', actorType: 'system', message: 'SW-CORE-IK01 ping failed — unreachable after 5 retries.', type: 'detection' },
      { id: 'ie-2', time: ago(41), actor: 'Monitoring System', actorType: 'system', message: 'Cascade: AP-IK01 and NVR-IK01 also offline. Incident auto-created.', type: 'alert' },
      { id: 'ie-3', time: ago(38), actor: 'Kwame Mensah', actorType: 'agent', message: 'Acknowledged. Contacting Ikeja branch coordinator. High CPU on FG-60F before outage noted.', type: 'acknowledge' },
      { id: 'ie-4', time: ago(30), actor: 'Kwame Mensah', actorType: 'agent', message: 'Branch reports power fluctuation in comms room. Switch shows no indicator lights. No UPS in comms room.', type: 'update' },
      { id: 'ie-5', time: ago(20), actor: 'Kwame Mensah', actorType: 'agent', message: 'Escalated to Tunde Bakare. Procurement request raised for comms room UPS. Field engineer dispatched.', type: 'escalate' },
      { id: 'ie-6', time: ago(5), actor: 'Monitoring System', actorType: 'system', message: 'FG-60F-IK01 CPU remains elevated at 78%. Separate alert maintained.', type: 'update' },
    ],
  },
  {
    id: 'inc-002',
    title: 'Mail Server Disk Capacity Warning',
    severity: 'error',
    state: 'open',
    affectedDevices: ['LAGOS-MAIL01'],
    affectedSites: ['Lagos HQ'],
    startedAt: ago(95),
    timeline: [
      { id: 'ie-7', time: ago(95), actor: 'Monitoring System', actorType: 'system', message: 'LAGOS-MAIL01 disk D: crossed 85% threshold.', type: 'detection' },
      { id: 'ie-8', time: ago(90), actor: 'Monitoring System', actorType: 'system', message: 'Disk now at 87%. Growth rate ~0.5%/day. Estimated full in 6 days.', type: 'alert' },
    ],
  },
  {
    id: 'inc-003',
    title: 'Lagos Core Network Packet Loss',
    severity: 'error',
    state: 'resolved',
    affectedDevices: ['SW-CORE-LG01', 'FG-200F-LG01'],
    affectedSites: ['Lagos HQ'],
    startedAt: ago(2880),
    resolvedAt: ago(2820),
    timeline: [
      { id: 'ie-9', time: ago(2880), actor: 'Monitoring System', actorType: 'system', message: 'Elevated packet loss on SW-CORE-LG01 uplink — 8–12% loss.', type: 'detection' },
      { id: 'ie-10', time: ago(2875), actor: 'Adaeze Nwosu', actorType: 'agent', message: 'Acknowledged. ISP (Spectranet) notified. Checking ARP tables.', type: 'acknowledge' },
      { id: 'ie-11', time: ago(2850), actor: 'Adaeze Nwosu', actorType: 'agent', message: 'ISP confirmed routing issue on their end. Fix in progress.', type: 'update' },
      { id: 'ie-12', time: ago(2820), actor: 'Monitoring System', actorType: 'system', message: 'Packet loss resolved. All sensors nominal. Incident closed.', type: 'resolve' },
    ],
  },
];

// ── Maintenance Windows ───────────────────────────────────────────────────────

export const mockMaintenanceWindows: MaintenanceWindow[] = [
  {
    id: 'mw-001',
    name: 'Ikeja Switch — Firmware Upgrade',
    deviceIds: ['dev-sw-003'],
    deviceNames: ['SW-CORE-IK01'],
    sites: ['Ikeja Branch'],
    startAt: ago(60),
    endAt: future(120),
    status: 'active',
    createdBy: 'Kwame Mensah',
    notes: 'Upgrading to Cisco IOS XE 17.12.1. ~15 min downtime during reboot.',
    recurrence: 'none',
  },
  {
    id: 'mw-002',
    name: 'Lagos DC — Monthly Patch Tuesday',
    deviceIds: ['dev-srv-001', 'dev-srv-002', 'dev-srv-003'],
    deviceNames: ['LAGOS-DC01', 'LAGOS-MAIL01', 'LAGOS-BACKUP01'],
    sites: ['Lagos HQ'],
    startAt: future(7 * 24 * 60),
    endAt: future(7 * 24 * 60 + 240),
    status: 'scheduled',
    createdBy: 'Tunde Bakare',
    notes: 'Second Tuesday of the month. Windows security updates. DC01 rebooted last.',
    recurrence: 'monthly',
  },
  {
    id: 'mw-003',
    name: 'FortiGate 200F — Firmware Upgrade',
    deviceIds: ['dev-fw-001'],
    deviceNames: ['FG-200F-LG01'],
    sites: ['Lagos HQ'],
    startAt: ago(7 * 24 * 60 + 30),
    endAt: ago(7 * 24 * 60 - 30),
    status: 'completed',
    createdBy: 'Kwame Mensah',
    notes: 'Upgraded FortiOS 7.4.1 → 7.4.3. No issues encountered.',
    recurrence: 'none',
  },
  {
    id: 'mw-004',
    name: 'VMware Host — ESXi Upgrade',
    deviceIds: ['dev-srv-004'],
    deviceNames: ['LAGOS-VMH01'],
    sites: ['Lagos HQ'],
    startAt: future(14 * 24 * 60),
    endAt: future(14 * 24 * 60 + 180),
    status: 'scheduled',
    createdBy: 'Tunde Bakare',
    notes: 'Upgrading ESXi 8.0 → 8.0U2. VMs will live-migrate to standby host.',
    recurrence: 'none',
  },
];

// ── Alert Rules ───────────────────────────────────────────────────────────────

export const mockAlertRules: AlertRule[] = [
  { id: 'rule-001', name: 'Device Unreachable', target: 'All Devices', metric: 'Ping', condition: 'No response', threshold: '5 retries', severity: 'critical', channels: ['Email', 'SMS', 'Helpdesk ticket'], enabled: true, triggeredCount: 8, lastTriggered: ago(42) },
  { id: 'rule-002', name: 'CPU Critical', target: 'All Devices', metric: 'CPU Load', condition: '>', threshold: '90%', severity: 'error', channels: ['Email', 'Helpdesk ticket'], enabled: true, triggeredCount: 3, lastTriggered: ago(200) },
  { id: 'rule-003', name: 'CPU Warning', target: 'All Devices', metric: 'CPU Load', condition: '>', threshold: '75%', severity: 'warning', channels: ['Email'], enabled: true, triggeredCount: 14, lastTriggered: ago(48) },
  { id: 'rule-004', name: 'Memory Pressure', target: 'Servers', metric: 'Memory', condition: '>', threshold: '85%', severity: 'warning', channels: ['Email'], enabled: true, triggeredCount: 7, lastTriggered: ago(300) },
  { id: 'rule-005', name: 'Disk Critical', target: 'Servers', metric: 'Disk Usage', condition: '>', threshold: '90%', severity: 'critical', channels: ['Email', 'SMS', 'Helpdesk ticket'], enabled: true, triggeredCount: 2, lastTriggered: ago(720) },
  { id: 'rule-006', name: 'Disk Warning', target: 'Servers', metric: 'Disk Usage', condition: '>', threshold: '80%', severity: 'warning', channels: ['Email'], enabled: true, triggeredCount: 5, lastTriggered: ago(95) },
  { id: 'rule-007', name: 'UPS Battery Low', target: 'UPS Devices', metric: 'Battery Level', condition: '<', threshold: '70%', severity: 'warning', channels: ['Email', 'SMS'], enabled: true, triggeredCount: 1, lastTriggered: ago(180) },
  { id: 'rule-008', name: 'UPS Battery Critical', target: 'UPS Devices', metric: 'Battery Level', condition: '<', threshold: '30%', severity: 'critical', channels: ['Email', 'SMS', 'Helpdesk ticket'], enabled: true, triggeredCount: 0 },
  { id: 'rule-009', name: 'High Temperature', target: 'Network Devices', metric: 'Temperature', condition: '>', threshold: '65°C', severity: 'error', channels: ['Email', 'SMS'], enabled: true, triggeredCount: 0 },
  { id: 'rule-010', name: 'HTTP Slow Response', target: 'Web Servers', metric: 'HTTP Response', condition: '>', threshold: '2000ms', severity: 'warning', channels: ['Email'], enabled: false, triggeredCount: 2, lastTriggered: ago(1440) },
];

// ── NOC Summary Metrics ───────────────────────────────────────────────────────

export const mockNOCMetrics: NOCMetrics = {
  totalDevices: 15,
  upDevices: 10,
  downDevices: 3,
  warningDevices: 2,
  pausedDevices: 0,
  totalSensors: 48,
  upSensors: 38,
  downSensors: 5,
  warningSensors: 5,
  activeAlerts: 6,
  criticalAlerts: 2,
  openIncidents: 2,
  avgUptime30d: 97.8,
};

// ── Topology ──────────────────────────────────────────────────────────────────

export const mockTopologies: TopologyData[] = [
  {
    site: 'Lagos HQ',
    nodes: [
      { id: 'n-inet',    label: 'Internet / ISP',   sublabel: 'Spectranet 500 Mbps', type: 'cloud',        x: 450, y: 48,  status: 'up' },
      { id: 'n-fw-001',  label: 'FG-200F-LG01',     sublabel: 'FortiGate 200F',      type: 'firewall',     x: 450, y: 148, status: 'up',     deviceId: 'dev-fw-001' },
      { id: 'n-sw-001',  label: 'SW-CORE-LG01',     sublabel: 'Cisco C9300-48P',     type: 'switch',       x: 450, y: 268, status: 'up',     deviceId: 'dev-sw-001' },
      { id: 'n-srvclus', label: 'Server VLAN',      sublabel: '4 hosts · all UP',    type: 'cluster',      x: 160, y: 388, status: 'up' },
      { id: 'n-srv-001', label: 'LAGOS-DC01',        sublabel: '10.10.1.1',           type: 'server',       x: 60,  y: 488, status: 'up',     deviceId: 'dev-srv-001' },
      { id: 'n-srv-002', label: 'LAGOS-MAIL01',      sublabel: '10.10.1.2',           type: 'server',       x: 175, y: 488, status: 'warning',deviceId: 'dev-srv-002' },
      { id: 'n-srv-003', label: 'LAGOS-BACKUP01',    sublabel: '10.10.1.3',           type: 'server',       x: 290, y: 488, status: 'up',     deviceId: 'dev-srv-003' },
      { id: 'n-ups-001', label: 'UPS-DC-LG01',       sublabel: 'APC 3000VA',          type: 'ups',          x: 450, y: 388, status: 'warning',deviceId: 'dev-ups-001' },
      { id: 'n-apclus',  label: 'Wireless / User',  sublabel: '2 APs · all UP',      type: 'cluster',      x: 730, y: 388, status: 'up' },
      { id: 'n-ap-001',  label: 'AP-FL1-LG01',       sublabel: '10.10.1.20',          type: 'access_point', x: 650, y: 488, status: 'up',     deviceId: 'dev-ap-001' },
      { id: 'n-ap-002',  label: 'AP-FL2-LG01',       sublabel: '10.10.1.21',          type: 'access_point', x: 800, y: 488, status: 'up',     deviceId: 'dev-ap-002' },
    ],
    edges: [
      { id: 'e-1',  source: 'n-inet',    target: 'n-fw-001',  utilization: 57, bandwidth: '500M' },
      { id: 'e-2',  source: 'n-fw-001',  target: 'n-sw-001',  utilization: 45, bandwidth: '1G' },
      { id: 'e-3',  source: 'n-sw-001',  target: 'n-srvclus', utilization: 30, bandwidth: '10G' },
      { id: 'e-4',  source: 'n-sw-001',  target: 'n-ups-001', utilization: 5,  bandwidth: '100M' },
      { id: 'e-5',  source: 'n-sw-001',  target: 'n-apclus',  utilization: 18, bandwidth: '1G' },
      { id: 'e-6',  source: 'n-srvclus', target: 'n-srv-001', utilization: 25, bandwidth: '10G' },
      { id: 'e-7',  source: 'n-srvclus', target: 'n-srv-002', utilization: 35, bandwidth: '10G' },
      { id: 'e-8',  source: 'n-srvclus', target: 'n-srv-003', utilization: 15, bandwidth: '10G' },
      { id: 'e-9',  source: 'n-apclus',  target: 'n-ap-001',  utilization: 22, bandwidth: '1G' },
      { id: 'e-10', source: 'n-apclus',  target: 'n-ap-002',  utilization: 18, bandwidth: '1G' },
    ],
  },
  {
    site: 'Ikeja Branch',
    nodes: [
      { id: 'ik-inet',   label: 'Internet / ISP', sublabel: 'Airtel 100 Mbps', type: 'cloud',        x: 450, y: 48,  status: 'up' },
      { id: 'ik-fw',     label: 'FG-60F-IK01',    sublabel: 'FortiGate 60F',   type: 'firewall',     x: 450, y: 148, status: 'warning', deviceId: 'dev-fw-002' },
      { id: 'ik-sw',     label: 'SW-CORE-IK01',   sublabel: 'Cisco C9200',     type: 'switch',       x: 450, y: 288, status: 'down',    deviceId: 'dev-sw-003' },
      { id: 'ik-ap',     label: 'AP-IK01',         sublabel: '10.20.1.20',      type: 'access_point', x: 280, y: 408, status: 'down',    deviceId: 'dev-ap-003' },
      { id: 'ik-nvr',    label: 'NVR-IK01',        sublabel: '10.20.1.50',      type: 'nvr',          x: 620, y: 408, status: 'down',    deviceId: 'dev-nvr-001' },
    ],
    edges: [
      { id: 'ik-e1', source: 'ik-inet', target: 'ik-fw',  utilization: 25, bandwidth: '100M' },
      { id: 'ik-e2', source: 'ik-fw',   target: 'ik-sw',  utilization: 0,  bandwidth: '1G' },
      { id: 'ik-e3', source: 'ik-sw',   target: 'ik-ap',  utilization: 0,  bandwidth: '1G' },
      { id: 'ik-e4', source: 'ik-sw',   target: 'ik-nvr', utilization: 0,  bandwidth: '100M' },
    ],
  },
  {
    site: 'Nairobi Office',
    nodes: [
      { id: 'nrb-inet',  label: 'Internet / ISP', sublabel: 'Safaricom 50 Mbps', type: 'cloud',    x: 450, y: 48,  status: 'up' },
      { id: 'nrb-sw',    label: 'SW-CORE-NRB01',  sublabel: 'HP Aruba 2930M',    type: 'switch',   x: 450, y: 188, status: 'up', deviceId: 'dev-sw-004' },
      { id: 'nrb-srv',   label: 'NRB-APP01',       sublabel: '10.30.1.1',         type: 'server',   x: 450, y: 348, status: 'up', deviceId: 'dev-srv-005' },
    ],
    edges: [
      { id: 'nrb-e1', source: 'nrb-inet', target: 'nrb-sw',  utilization: 22, bandwidth: '50M' },
      { id: 'nrb-e2', source: 'nrb-sw',   target: 'nrb-srv', utilization: 18, bandwidth: '1G' },
    ],
  },
];

// ── Uptime trend (last 7 days + today) ────────────────────────────────────────

export const uptimeTrend = [
  { day: 'Mon', upPct: 99.8, events: 0 },
  { day: 'Tue', upPct: 98.9, events: 1 },
  { day: 'Wed', upPct: 99.5, events: 0 },
  { day: 'Thu', upPct: 97.2, events: 3 },
  { day: 'Fri', upPct: 98.7, events: 1 },
  { day: 'Sat', upPct: 99.9, events: 0 },
  { day: 'Sun', upPct: 99.6, events: 0 },
  { day: 'Today', upPct: 97.8, events: 2 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Asset Management — Phase 3
// ─────────────────────────────────────────────────────────────────────────────

/** Returns an ISO date string N days from today. */
const inDays = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0]!;
};

// ── License Manager ──────────────────────────────────────────────────────────

export type LicenseVendorCategory =
  | 'productivity'
  | 'security'
  | 'network'
  | 'finance'
  | 'communication'
  | 'design'
  | 'crm';

export interface MockLicense {
  id: string;
  name: string;
  vendor: string;
  category: LicenseVendorCategory;
  /** null = device-based / infrastructure (no per-seat count) */
  seats: number | null;
  seatsUsed: number | null;
  costPerYear: number; // USD
  renewalDate: string; // ISO date
  owner: string;
  notes?: string;
}

export const mockLicenses: MockLicense[] = [
  {
    id: 'lic-001',
    name: 'Microsoft 365 Business Premium',
    vendor: 'Microsoft',
    category: 'productivity',
    seats: 100,
    seatsUsed: 87,
    costPerYear: 22800,
    renewalDate: inDays(15),
    owner: 'Tunde Bakare',
  },
  {
    id: 'lic-002',
    name: 'Adobe Creative Cloud for Teams',
    vendor: 'Adobe',
    category: 'design',
    seats: 5,
    seatsUsed: 5,
    costPerYear: 2760,
    renewalDate: inDays(5),
    owner: 'Adaeze Nwosu',
    notes: 'All seats in use — confirm renewal or reduce seat count',
  },
  {
    id: 'lic-003',
    name: 'Sophos Endpoint Protection Advanced',
    vendor: 'Sophos',
    category: 'security',
    seats: 50,
    seatsUsed: 48,
    costPerYear: 4200,
    renewalDate: inDays(28),
    owner: 'Kwame Mensah',
  },
  {
    id: 'lic-004',
    name: 'FortiGate UTM Support',
    vendor: 'Fortinet',
    category: 'network',
    seats: null,
    seatsUsed: null,
    costPerYear: 1800,
    renewalDate: inDays(7),
    owner: 'Kwame Mensah',
    notes: 'Covers 3 FortiGate 60F appliances',
  },
  {
    id: 'lic-005',
    name: 'QuickBooks Online Plus',
    vendor: 'Intuit',
    category: 'finance',
    seats: 10,
    seatsUsed: 6,
    costPerYear: 1980,
    renewalDate: inDays(92),
    owner: 'Fatima Suleiman',
  },
  {
    id: 'lic-006',
    name: 'Zoom Business',
    vendor: 'Zoom',
    category: 'communication',
    seats: 75,
    seatsUsed: 62,
    costPerYear: 14400,
    renewalDate: inDays(180),
    owner: 'Chinedu Okafor',
  },
  {
    id: 'lic-007',
    name: 'Slack Pro',
    vendor: 'Slack Technologies',
    category: 'communication',
    seats: 100,
    seatsUsed: 94,
    costPerYear: 10800,
    renewalDate: inDays(22),
    owner: 'Tunde Bakare',
  },
  {
    id: 'lic-008',
    name: 'Kaspersky Endpoint Security Cloud',
    vendor: 'Kaspersky',
    category: 'security',
    seats: 25,
    seatsUsed: 21,
    costPerYear: 1125,
    renewalDate: inDays(3),
    owner: 'Kwame Mensah',
    notes: 'Pending vendor review — renew or migrate to Sophos',
  },
  {
    id: 'lic-009',
    name: 'Cisco AnyConnect Apex',
    vendor: 'Cisco',
    category: 'network',
    seats: 500,
    seatsUsed: 312,
    costPerYear: 9500,
    renewalDate: inDays(300),
    owner: 'Tunde Bakare',
  },
  {
    id: 'lic-010',
    name: 'Salesforce Sales Cloud',
    vendor: 'Salesforce',
    category: 'crm',
    seats: 20,
    seatsUsed: 18,
    costPerYear: 36000,
    renewalDate: inDays(130),
    owner: 'Fatima Suleiman',
  },
];

// ── Asset Dashboard Metrics ──────────────────────────────────────────────────

export interface AssetDashboardMetrics {
  totalAssets: number;
  inUse: number;
  inStock: number;
  underRepair: number;
  lost: number;
  warrantyExpiringIn30Days: number;
  warrantyExpiringIn90Days: number;
  warrantyExpired: number;
  auditsCompleted: number;
  auditsTotal: number;
}

export const mockAssetDashboard: AssetDashboardMetrics = {
  totalAssets: 247,
  inUse: 198,
  inStock: 32,
  underRepair: 11,
  lost: 6,
  warrantyExpiringIn30Days: 4,
  warrantyExpiringIn90Days: 12,
  warrantyExpired: 7,
  auditsCompleted: 189,
  auditsTotal: 247,
};

// ── Category Breakdown ───────────────────────────────────────────────────────

export type AssetIconKey =
  | 'laptop'
  | 'desktop'
  | 'mobile'
  | 'cctv'
  | 'printer'
  | 'network'
  | 'monitor'
  | 'other';

export interface AssetCategory {
  category: string;
  total: number;
  inUse: number;
  iconKey: AssetIconKey;
}

export const assetCategories: AssetCategory[] = [
  { category: 'Laptops', total: 78, inUse: 71, iconKey: 'laptop' },
  { category: 'Desktops', total: 42, inUse: 38, iconKey: 'desktop' },
  { category: 'Mobile Devices', total: 36, inUse: 34, iconKey: 'mobile' },
  { category: 'CCTV Cameras', total: 29, inUse: 27, iconKey: 'cctv' },
  { category: 'Network Equipment', total: 24, inUse: 24, iconKey: 'network' },
  { category: 'Monitors', total: 20, inUse: 16, iconKey: 'monitor' },
  { category: 'Printers', total: 18, inUse: 14, iconKey: 'printer' },
];

// ── Warranty Alerts ──────────────────────────────────────────────────────────

export interface WarrantyAlert {
  id: string;
  tag: string;
  name: string;
  category: string;
  location: string;
  warrantyEnd: string; // ISO date
  assignedTo?: string;
}

export const warrantyAlerts: WarrantyAlert[] = [
  {
    id: 'wa-1',
    tag: 'CON-PH-018',
    name: 'iPhone 15 Pro',
    category: 'Mobile Device',
    location: 'Nairobi - Field',
    warrantyEnd: inDays(-176),
    assignedTo: 'Daniel Mwangi',
  },
  {
    id: 'wa-2',
    tag: 'CON-MN-022',
    name: 'LG 27UK850-W',
    category: 'Monitor',
    location: 'Lagos HQ - Floor 3',
    warrantyEnd: inDays(-45),
    assignedTo: 'Marcus Botha',
  },
  {
    id: 'wa-3',
    tag: 'CON-SW-004',
    name: 'Cisco SG350X Switch',
    category: 'Network Equipment',
    location: 'Lagos HQ - Server Room',
    warrantyEnd: inDays(12),
  },
  {
    id: 'wa-4',
    tag: 'CON-CCTV-038',
    name: 'Hikvision DS-2CD2143G2',
    category: 'CCTV Camera',
    location: 'Ikeja Branch - Parking',
    warrantyEnd: inDays(24),
  },
  {
    id: 'wa-5',
    tag: 'CON-LT-009',
    name: 'Dell XPS 15 9530',
    category: 'Laptop',
    location: 'Lagos HQ - Floor 2',
    warrantyEnd: inDays(28),
    assignedTo: 'Aisha Ibrahim',
  },
  {
    id: 'wa-6',
    tag: 'CON-DT-018',
    name: 'HP EliteDesk 800 G9',
    category: 'Desktop',
    location: 'Lagos HQ - Floor 1',
    warrantyEnd: inDays(58),
    assignedTo: 'Joshua Adekunle',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Reports & Analytics
// ─────────────────────────────────────────────────────────────────────────────

export interface VolumePoint {
  label: string; // "May 1"
  created: number;
  resolved: number;
}

export interface AgentStat {
  id: string;
  name: string;
  avatar: string; // initials
  resolved: number;
  avgFirstResponseMin: number;
  avgResolutionHours: number;
  csatScore: number;
  slaBreached: number;
}

export interface CategoryStat {
  category: string;
  count: number;
  pct: number;
}

export interface ChannelStat {
  channel: string;
  count: number;
  pct: number;
}

export interface ReportSummary {
  totalCreated: number;
  totalResolved: number;
  resolutionRate: number; // 0–100
  avgFirstResponseMin: number;
  avgResolutionHours: number;
  csatScore: number;
  slaComplianceRate: number; // 0–100
  periodLabel: string;
}

const days = ['May 1','May 2','May 3','May 4','May 5','May 6','May 7','May 8',
  'May 9','May 10','May 11','May 12','May 13','May 14','May 15','May 16',
  'May 17','May 18','May 19','May 20','May 21','May 22','May 23','May 24',
  'May 25','May 26','May 27'];

export const ticketVolumeData: VolumePoint[] = days.map((label, i) => ({
  label,
  created:  [12,9,15,11,8,4,3,14,18,16,13,10,7,5,2,20,17,15,12,9,6,3,19,22,18,14,16][i]!,
  resolved: [10,8,12,9,7,3,2,11,16,14,11,9,6,4,2,17,15,13,10,8,5,2,17,20,16,12,14][i]!,
}));

export const agentStats: AgentStat[] = [
  { id: 'a1', name: 'Tunde Bakare',    avatar: 'TB', resolved: 82, avgFirstResponseMin: 8,  avgResolutionHours: 3.2, csatScore: 4.8, slaBreached: 1 },
  { id: 'a2', name: 'Adaeze Nwosu',   avatar: 'AN', resolved: 74, avgFirstResponseMin: 11, avgResolutionHours: 4.1, csatScore: 4.6, slaBreached: 2 },
  { id: 'a3', name: 'Kwame Mensah',   avatar: 'KM', resolved: 68, avgFirstResponseMin: 14, avgResolutionHours: 5.0, csatScore: 4.4, slaBreached: 3 },
  { id: 'a4', name: 'Fatima Suleiman',avatar: 'FS', resolved: 55, avgFirstResponseMin: 18, avgResolutionHours: 6.2, csatScore: 4.2, slaBreached: 4 },
  { id: 'a5', name: 'Chinedu Okafor', avatar: 'CO', resolved: 49, avgFirstResponseMin: 22, avgResolutionHours: 7.5, csatScore: 4.0, slaBreached: 5 },
];

export const categorySummary: CategoryStat[] = [
  { category: 'Network / VPN',   count: 58, pct: 22 },
  { category: 'Hardware',        count: 42, pct: 16 },
  { category: 'Software',        count: 39, pct: 15 },
  { category: 'Access Request',  count: 34, pct: 13 },
  { category: 'Security',        count: 28, pct: 11 },
  { category: 'Email',           count: 22, pct: 8  },
  { category: 'Other',           count: 39, pct: 15 },
];

export const channelSummary: ChannelStat[] = [
  { channel: 'Email',    count: 98,  pct: 37 },
  { channel: 'Portal',   count: 78,  pct: 30 },
  { channel: 'WhatsApp', count: 42,  pct: 16 },
  { channel: 'Voice',    count: 26,  pct: 10 },
  { channel: 'Widget',   count: 13,  pct: 5  },
  { channel: 'Other',    count: 5,   pct: 2  },
];

export const reportSummary: ReportSummary = {
  totalCreated: 262,
  totalResolved: 231,
  resolutionRate: 88,
  avgFirstResponseMin: 12,
  avgResolutionHours: 4.8,
  csatScore: 4.6,
  slaComplianceRate: 94,
  periodLabel: 'May 1 – 27, 2026',
};

// ─────────────────────────────────────────────────────────────────────────────
// CSAT & Quality
// ─────────────────────────────────────────────────────────────────────────────

export type CSATRating = 1 | 2 | 3 | 4 | 5;

export interface CSATSurvey {
  id: string;
  ticketNumber: string;
  subject: string;
  rating: CSATRating;
  comment?: string;
  customer: string;
  agent: string;
  submittedAt: string;
  category: string;
}

export interface CSATMetrics {
  avgScore: number;
  totalResponses: number;
  responsePct: number; // % of resolved tickets that got a response
  dist: { rating: CSATRating; count: number; pct: number }[];
  trend: { label: string; score: number }[];
}

export const csatSurveys: CSATSurvey[] = [
  { id: 'cs-001', ticketNumber: '#1024', subject: 'VPN issue on new MacBook', rating: 5, comment: 'Tunde was super fast and solved the issue in one call. Very professional!', customer: 'Sarah Okonkwo', agent: 'Tunde Bakare', submittedAt: ago(5), category: 'Network / VPN' },
  { id: 'cs-002', ticketNumber: '#1017', subject: 'AV system in room 4B', rating: 4, comment: 'Fixed quickly, though I had to follow up once.', customer: 'Lerato Mokoena', agent: 'Adaeze Nwosu', submittedAt: ago(55), category: 'AV / Meeting Rooms' },
  { id: 'cs-003', ticketNumber: '#1009', subject: 'Zoom Phone audio cuts', rating: 5, comment: 'Excellent support. Issue is gone.', customer: 'Grace Maathai', agent: 'Adaeze Nwosu', submittedAt: ago(90), category: 'Telephony' },
  { id: 'cs-004', ticketNumber: '#1011', subject: 'Phishing email response', rating: 5, comment: 'Handled the incident very professionally. Fast response saved us.', customer: 'Daniel Mwangi', agent: 'Fatima Suleiman', submittedAt: ago(140), category: 'Security' },
  { id: 'cs-005', ticketNumber: '#1022', subject: 'Q3 reporting workspace access', rating: 3, comment: 'Took 3 days for a simple access request. Process needs improvement.', customer: 'Joshua Adekunle', agent: 'Kwame Mensah', submittedAt: ago(200), category: 'Access Request' },
  { id: 'cs-006', ticketNumber: '#1010', subject: 'Shared mailbox for AP team', rating: 4, comment: '', customer: 'Emmanuel Diallo', agent: 'Chinedu Okafor', submittedAt: ago(410), category: 'Email' },
  { id: 'cs-007', ticketNumber: '#1018', subject: 'Slack notifications muted', rating: 5, comment: 'Super fast. One message and it was done!', customer: 'Emmanuel Diallo', agent: 'Chinedu Okafor', submittedAt: ago(370), category: 'Software' },
  { id: 'cs-008', ticketNumber: '#1015', subject: 'New starter onboarding', rating: 2, comment: 'The laptop was not ready on day 1. New joiner had to wait until 3pm. Needs improvement.', customer: 'Joshua Adekunle', agent: 'Tunde Bakare', submittedAt: ago(70), category: 'Onboarding' },
  { id: 'cs-009', ticketNumber: '#1007', subject: 'Mobile app splash screen', rating: 4, comment: 'Resolved quickly once assigned.', customer: 'Marcus Botha', agent: 'Kwame Mensah', submittedAt: ago(25), category: 'Mobile' },
  { id: 'cs-010', ticketNumber: '#1008', subject: 'Two-factor reset', rating: 5, comment: 'Handled securely and quickly. No complaints.', customer: 'Lerato Mokoena', agent: 'Kwame Mensah', submittedAt: ago(38), category: 'Identity' },
];

export const csatMetrics: CSATMetrics = {
  avgScore: 4.6,
  totalResponses: 213,
  responsePct: 68,
  dist: [
    { rating: 5, count: 128, pct: 60 },
    { rating: 4, count: 51,  pct: 24 },
    { rating: 3, count: 21,  pct: 10 },
    { rating: 2, count: 9,   pct: 4  },
    { rating: 1, count: 4,   pct: 2  },
  ],
  trend: [
    { label: 'Jan', score: 4.2 },
    { label: 'Feb', score: 4.3 },
    { label: 'Mar', score: 4.5 },
    { label: 'Apr', score: 4.4 },
    { label: 'May', score: 4.6 },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Contacts / CRM-lite
// ─────────────────────────────────────────────────────────────────────────────

export type ContactStatus = 'active' | 'inactive' | 'vip';

export interface MockContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  department?: string;
  title?: string;
  status: ContactStatus;
  totalTickets: number;
  openTickets: number;
  lastTicketAt?: string;
  createdAt: string;
  location: string;
  tags: string[];
}

export const mockContacts: MockContact[] = [
  { id: 'con-001', name: 'Sarah Okonkwo',    email: 'sarah.o@acmebank.ng',           phone: '+234 801 234 5678', company: 'AcmeBank',        department: 'Technology',    title: 'IT Manager',          status: 'vip',      totalTickets: 14, openTickets: 1, lastTicketAt: ago(8),   createdAt: ago(365 * 24 * 60), location: 'Lagos, NG',   tags: ['vip', 'banking'] },
  { id: 'con-002', name: 'Daniel Mwangi',    email: 'd.mwangi@safarihold.co.ke',     phone: '+254 712 345 678',  company: 'SafariHold',      department: 'Operations',    title: 'Operations Lead',     status: 'active',   totalTickets: 9,  openTickets: 0, lastTicketAt: ago(140), createdAt: ago(280 * 24 * 60), location: 'Nairobi, KE', tags: ['operations'] },
  { id: 'con-003', name: 'Aisha Ibrahim',    email: 'aisha.i@northfield.ng',         phone: '+234 802 345 6789', company: 'Northfield Ltd',  department: 'Finance',       title: 'Finance Director',    status: 'active',   totalTickets: 7,  openTickets: 1, lastTicketAt: ago(180), createdAt: ago(200 * 24 * 60), location: 'Abuja, NG',   tags: ['finance'] },
  { id: 'con-004', name: 'Marcus Botha',     email: 'marcus@kasi-pay.co.za',         phone: '+27 82 345 6789',   company: 'KasiPay',         department: 'Engineering',   title: 'CTO',                 status: 'vip',      totalTickets: 11, openTickets: 1, lastTicketAt: ago(12),  createdAt: ago(320 * 24 * 60), location: 'Cape Town, ZA', tags: ['vip', 'fintech'] },
  { id: 'con-005', name: 'Lerato Mokoena',   email: 'lerato@kasi-pay.co.za',         phone: '+27 83 456 7890',   company: 'KasiPay',         department: 'Customer Success', title: 'CS Lead',            status: 'active',   totalTickets: 6,  openTickets: 0, lastTicketAt: ago(55),  createdAt: ago(260 * 24 * 60), location: 'Johannesburg, ZA', tags: ['fintech'] },
  { id: 'con-006', name: 'Joshua Adekunle',  email: 'josh@flairtech.ng',             phone: '+234 803 456 7890', company: 'FlairTech',       department: 'HR',            title: 'HR Manager',          status: 'active',   totalTickets: 8,  openTickets: 2, lastTicketAt: ago(15),  createdAt: ago(180 * 24 * 60), location: 'Lagos, NG',   tags: ['hr'] },
  { id: 'con-007', name: 'Grace Maathai',    email: 'grace@safarihold.co.ke',        phone: '+254 723 456 789',  company: 'SafariHold',      department: 'IT',            title: 'IT Support',          status: 'active',   totalTickets: 5,  openTickets: 1, lastTicketAt: ago(90),  createdAt: ago(150 * 24 * 60), location: 'Nairobi, KE', tags: [] },
  { id: 'con-008', name: 'Emmanuel Diallo',  email: 'emm@dakarlink.sn',              phone: '+221 77 123 4567',  company: 'DakarLink',       department: 'Administration',title: 'Admin Manager',       status: 'active',   totalTickets: 4,  openTickets: 0, lastTicketAt: ago(410), createdAt: ago(100 * 24 * 60), location: 'Dakar, SN',   tags: [] },
  { id: 'con-009', name: 'Nkechi Obi',       email: 'nkechi.obi@safenest.ng',        phone: '+234 804 567 8901', company: 'SafeNest',        department: 'Operations',    title: 'Operations Manager',  status: 'inactive', totalTickets: 2,  openTickets: 0, lastTicketAt: ago(3600),createdAt: ago(400 * 24 * 60), location: 'Port Harcourt, NG', tags: [] },
  { id: 'con-010', name: 'Amara Sesay',      email: 'amara@westlink.sl',             phone: '+232 79 123 456',   company: 'WestLink',        department: 'Technology',    title: 'Tech Lead',           status: 'active',   totalTickets: 3,  openTickets: 1, lastTicketAt: ago(48 * 60), createdAt: ago(90 * 24 * 60), location: 'Freetown, SL', tags: ['new'] },
  { id: 'con-011', name: 'Kofi Asante',      email: 'kofi@goldcoasttrade.gh',        phone: '+233 24 123 4567',  company: 'Gold Coast Trade',department: 'Finance',       title: 'CFO',                 status: 'active',   totalTickets: 6,  openTickets: 0, lastTicketAt: ago(72 * 60), createdAt: ago(220 * 24 * 60), location: 'Accra, GH',  tags: ['finance'] },
  { id: 'con-012', name: 'Zainab Kamara',    email: 'zainab@afritrust.com',          phone: '+231 88 123 456',   company: 'AfriTrust Bank',  department: 'Compliance',    title: 'Compliance Officer',  status: 'vip',      totalTickets: 5,  openTickets: 0, lastTicketAt: ago(20 * 60), createdAt: ago(300 * 24 * 60), location: 'Monrovia, LR', tags: ['vip', 'banking'] },
];

// ─────────────────────────────────────────────────────────────────────────────
// Knowledge Base (agent authoring)
// ─────────────────────────────────────────────────────────────────────────────

export type KBStatus = 'published' | 'draft' | 'archived';

export interface KBArticle {
  id: string;
  title: string;
  category: string;
  status: KBStatus;
  views: number;
  helpfulVotes: number;
  totalVotes: number;
  author: string;
  updatedAt: string;
  createdAt: string;
  excerpt: string;
}

export const kbArticles: KBArticle[] = [
  { id: 'kb-001', title: 'How to connect to the corporate VPN (Cisco AnyConnect)', category: 'Network & VPN', status: 'published', views: 1840, helpfulVotes: 142, totalVotes: 158, author: 'Tunde Bakare', updatedAt: ago(3 * 24 * 60), createdAt: ago(90 * 24 * 60), excerpt: 'Step-by-step guide for connecting to the corporate VPN on Windows and macOS using Cisco AnyConnect.' },
  { id: 'kb-002', title: 'Resetting your Microsoft 365 password', category: 'Identity & Access', status: 'published', views: 1320, helpfulVotes: 98, totalVotes: 112, author: 'Adaeze Nwosu', updatedAt: ago(7 * 24 * 60), createdAt: ago(120 * 24 * 60), excerpt: 'How to self-service reset your Microsoft 365 password via the SSPR portal.' },
  { id: 'kb-003', title: 'Setting up email on iPhone and Android', category: 'Email', status: 'published', views: 985, helpfulVotes: 87, totalVotes: 95, author: 'Chinedu Okafor', updatedAt: ago(14 * 24 * 60), createdAt: ago(150 * 24 * 60), excerpt: 'Configure corporate email on your mobile device using Exchange ActiveSync or Outlook app.' },
  { id: 'kb-004', title: 'Requesting new software or a licence seat', category: 'Software & Licences', status: 'published', views: 742, helpfulVotes: 64, totalVotes: 71, author: 'Fatima Suleiman', updatedAt: ago(21 * 24 * 60), createdAt: ago(200 * 24 * 60), excerpt: 'Submit a software request through the portal. Approval typically takes 1–2 business days.' },
  { id: 'kb-005', title: 'Printer troubleshooting: paper jam and driver issues', category: 'Hardware', status: 'published', views: 620, helpfulVotes: 51, totalVotes: 62, author: 'Adaeze Nwosu', updatedAt: ago(5 * 24 * 60), createdAt: ago(180 * 24 * 60), excerpt: 'Common printer issues and how to resolve them without raising a ticket.' },
  { id: 'kb-006', title: 'How to onboard a new staff member (IT checklist)', category: 'Onboarding', status: 'published', views: 580, helpfulVotes: 52, totalVotes: 58, author: 'Tunde Bakare', updatedAt: ago(2 * 24 * 60), createdAt: ago(60 * 24 * 60), excerpt: 'Full IT onboarding checklist: account creation, device provisioning, and access setup.' },
  { id: 'kb-007', title: 'Using the Zoom Phone system', category: 'Telephony', status: 'published', views: 440, helpfulVotes: 38, totalVotes: 44, author: 'Chinedu Okafor', updatedAt: ago(10 * 24 * 60), createdAt: ago(100 * 24 * 60), excerpt: 'Make and receive calls, set your status, and configure voicemail with Zoom Phone.' },
  { id: 'kb-008', title: 'Reporting a phishing or suspicious email', category: 'Security', status: 'published', views: 912, helpfulVotes: 80, totalVotes: 88, author: 'Kwame Mensah', updatedAt: ago(1 * 24 * 60), createdAt: ago(45 * 24 * 60), excerpt: 'How to report a phishing email and what to do if you accidentally clicked a link.' },
  { id: 'kb-009', title: 'Conference room AV: connecting your laptop', category: 'AV & Meeting Rooms', status: 'draft', views: 0, helpfulVotes: 0, totalVotes: 0, author: 'Adaeze Nwosu', updatedAt: ago(60), createdAt: ago(60), excerpt: 'Draft guide for using HDMI, USB-C, and wireless display in meeting rooms.' },
  { id: 'kb-010', title: 'Multi-factor authentication setup guide', category: 'Identity & Access', status: 'published', views: 1120, helpfulVotes: 103, totalVotes: 115, author: 'Kwame Mensah', updatedAt: ago(30 * 24 * 60), createdAt: ago(250 * 24 * 60), excerpt: 'Enable and configure MFA on your corporate account using the Authenticator app.' },
  { id: 'kb-011', title: 'IT hardware request and procurement process', category: 'Hardware', status: 'published', views: 334, helpfulVotes: 29, totalVotes: 36, author: 'Tunde Bakare', updatedAt: ago(28 * 24 * 60), createdAt: ago(170 * 24 * 60), excerpt: 'How to submit a hardware request and what to expect during the procurement process.' },
  { id: 'kb-012', title: 'WhatsApp Business: known channel issues', category: 'Channels', status: 'draft', views: 0, helpfulVotes: 0, totalVotes: 0, author: 'Kwame Mensah', updatedAt: ago(30), createdAt: ago(30), excerpt: 'Documenting current known issues with the WhatsApp Business channel integration.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Asset detail — history events
// ─────────────────────────────────────────────────────────────────────────────

export type AssetEventType =
  | 'assigned'
  | 'unassigned'
  | 'repaired'
  | 'audited'
  | 'added'
  | 'warranty_noted'
  | 'ticket_linked';

export interface AssetHistoryEvent {
  id: string;
  type: AssetEventType;
  description: string;
  actor: string;
  at: string;
}

export const mockAssetHistory: AssetHistoryEvent[] = [
  { id: 'ah-001', type: 'added',          description: 'Asset registered in inventory',                        actor: 'Tunde Bakare',  at: ago(365 * 24 * 60) },
  { id: 'ah-002', type: 'assigned',        description: 'Assigned to Sarah Okonkwo (Lagos HQ — Floor 4)',      actor: 'Tunde Bakare',  at: ago(14 * 24 * 60)  },
  { id: 'ah-003', type: 'ticket_linked',   description: 'Linked to ticket #1024 (VPN issue)',                   actor: 'System',        at: ago(42)            },
  { id: 'ah-004', type: 'audited',         description: 'Asset physically verified — condition: Excellent',     actor: 'Adaeze Nwosu',  at: ago(7 * 24 * 60)   },
  { id: 'ah-005', type: 'warranty_noted',  description: 'Warranty end date confirmed: 12 May 2029',            actor: 'System',        at: ago(365 * 24 * 60) },
];

// ─────────────────────────────────────────────────────────────────────────────
// Audits
// ─────────────────────────────────────────────────────────────────────────────

export type AuditStatus = 'completed' | 'in_progress' | 'scheduled' | 'overdue';

export interface AssetAudit {
  id: string;
  name: string;
  location: string;
  status: AuditStatus;
  totalAssets: number;
  verified: number;
  missing: number;
  assignedTo: string;
  scheduledDate: string;
  completedDate?: string;
  notes?: string;
}

export const mockAudits: AssetAudit[] = [
  { id: 'aud-001', name: 'Lagos HQ — Q2 Full Audit',         location: 'Lagos HQ',          status: 'in_progress', totalAssets: 142, verified: 118, missing: 2, assignedTo: 'Tunde Bakare',   scheduledDate: inDays(-5),  notes: 'Floor 4 and server room pending.' },
  { id: 'aud-002', name: 'Ikeja Branch — May Spot Check',    location: 'Ikeja Branch',      status: 'overdue',     totalAssets: 38,  verified: 21,  missing: 3, assignedTo: 'Kwame Mensah',   scheduledDate: inDays(-10), notes: 'Delayed due to network outage. Reschedule required.' },
  { id: 'aud-003', name: 'Nairobi Office — Annual Audit',    location: 'Nairobi Office',    status: 'scheduled',   totalAssets: 27,  verified: 0,   missing: 0, assignedTo: 'Adaeze Nwosu',   scheduledDate: inDays(14)  },
  { id: 'aud-004', name: 'Lagos HQ — Q1 Full Audit',         location: 'Lagos HQ',          status: 'completed',   totalAssets: 138, verified: 136, missing: 2, assignedTo: 'Tunde Bakare',   scheduledDate: inDays(-90), completedDate: inDays(-88), notes: '2 laptops unaccounted — reported as lost.' },
  { id: 'aud-005', name: 'Cape Town — New Office Baseline',  location: 'Cape Town',         status: 'scheduled',   totalAssets: 18,  verified: 0,   missing: 0, assignedTo: 'Fatima Suleiman',scheduledDate: inDays(21)  },
  { id: 'aud-006', name: 'Dakar Office — Spot Check',        location: 'Dakar Office',      status: 'completed',   totalAssets: 22,  verified: 22,  missing: 0, assignedTo: 'Chinedu Okafor', scheduledDate: inDays(-30), completedDate: inDays(-28) },
];

// ─────────────────────────────────────────────────────────────────────────────
// Inventory (consumables / stock)
// ─────────────────────────────────────────────────────────────────────────────

export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'on_order';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  location: string;
  quantity: number;
  reorderThreshold: number;
  reorderQty: number;
  unitCost: number; // USD
  status: InventoryStatus;
  supplier: string;
  lastRestockedAt?: string;
  onOrderQty?: number;
}

export const mockInventory: InventoryItem[] = [
  { id: 'inv-001', sku: 'LT-MBP14-M3P',   name: 'MacBook Pro 14" M3 Pro',          category: 'Laptops',         location: 'Lagos HQ - IT Store',    quantity: 3,  reorderThreshold: 2,  reorderQty: 5,  unitCost: 2499, status: 'in_stock',    supplier: 'Apple EMEA',       lastRestockedAt: inDays(-12) },
  { id: 'inv-002', sku: 'LT-DELLXPS15',   name: 'Dell XPS 15 9530',                category: 'Laptops',         location: 'Lagos HQ - IT Store',    quantity: 1,  reorderThreshold: 2,  reorderQty: 4,  unitCost: 1899, status: 'low_stock',   supplier: 'Dell Nigeria',     lastRestockedAt: inDays(-45) },
  { id: 'inv-003', sku: 'MON-DELLU27',    name: 'Dell UltraSharp U2723QE 27"',     category: 'Monitors',        location: 'Lagos HQ - IT Store',    quantity: 4,  reorderThreshold: 3,  reorderQty: 6,  unitCost: 649,  status: 'in_stock',    supplier: 'Dell Nigeria',     lastRestockedAt: inDays(-8)  },
  { id: 'inv-004', sku: 'PHN-IP15PRO',    name: 'iPhone 15 Pro 256GB',             category: 'Mobile Devices',  location: 'Lagos HQ - IT Store',    quantity: 0,  reorderThreshold: 2,  reorderQty: 4,  unitCost: 1199, status: 'out_of_stock',supplier: 'Apple EMEA',       lastRestockedAt: inDays(-90), onOrderQty: 4 },
  { id: 'inv-005', sku: 'CBL-USBC-1M',   name: 'USB-C Cable 1m (braided)',         category: 'Accessories',     location: 'Lagos HQ - IT Store',    quantity: 22, reorderThreshold: 10, reorderQty: 25, unitCost: 18,   status: 'in_stock',    supplier: 'Anker Distributors',lastRestockedAt: inDays(-20) },
  { id: 'inv-006', sku: 'CBL-HDMI-2M',   name: 'HDMI 2.1 Cable 2m',              category: 'Accessories',     location: 'Lagos HQ - IT Store',    quantity: 8,  reorderThreshold: 5,  reorderQty: 15, unitCost: 22,   status: 'in_stock',    supplier: 'Anker Distributors',lastRestockedAt: inDays(-20) },
  { id: 'inv-007', sku: 'NET-UBAP-U6PRO', name: 'Ubiquiti UniFi U6-Pro AP',        category: 'Network Equip.',  location: 'Lagos HQ - IT Store',    quantity: 2,  reorderThreshold: 1,  reorderQty: 3,  unitCost: 199,  status: 'in_stock',    supplier: 'Ubiquiti West Africa',lastRestockedAt: inDays(-60) },
  { id: 'inv-008', sku: 'INK-HP404A',    name: 'HP 404A Toner Cartridge (Blk)',   category: 'Consumables',     location: 'Lagos HQ - IT Store',    quantity: 1,  reorderThreshold: 3,  reorderQty: 6,  unitCost: 85,   status: 'low_stock',   supplier: 'HP Nigeria',       lastRestockedAt: inDays(-30) },
  { id: 'inv-009', sku: 'KBD-APPLE-MK',  name: 'Apple Magic Keyboard (TouchID)',  category: 'Accessories',     location: 'Lagos HQ - IT Store',    quantity: 5,  reorderThreshold: 3,  reorderQty: 8,  unitCost: 129,  status: 'in_stock',    supplier: 'Apple EMEA',       lastRestockedAt: inDays(-15) },
  { id: 'inv-010', sku: 'DT-OPTIPLEX7010',name: 'Dell OptiPlex 7010 SFF',          category: 'Desktops',        location: 'Ikeja Branch - Store',   quantity: 0,  reorderThreshold: 1,  reorderQty: 2,  unitCost: 899,  status: 'on_order',    supplier: 'Dell Nigeria',     onOrderQty: 2 },
  { id: 'inv-011', sku: 'UPS-APC-750',   name: 'APC Back-UPS 750VA',              category: 'Power',           location: 'Lagos HQ - IT Store',    quantity: 2,  reorderThreshold: 1,  reorderQty: 4,  unitCost: 195,  status: 'in_stock',    supplier: 'APC / Schneider',  lastRestockedAt: inDays(-90) },
  { id: 'inv-012', sku: 'NET-CISCO-9200', name: 'Cisco Catalyst 9200-24P Switch',  category: 'Network Equip.',  location: 'Lagos HQ - IT Store',    quantity: 0,  reorderThreshold: 1,  reorderQty: 1,  unitCost: 3200, status: 'on_order',    supplier: 'Cisco West Africa',onOrderQty: 1 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Automations
// ─────────────────────────────────────────────────────────────────────────────

export type AutomationTrigger =
  | 'ticket_created'
  | 'ticket_updated'
  | 'sla_warning'
  | 'sla_breached'
  | 'ticket_idle'
  | 'customer_replied'
  | 'agent_assigned';

export type AutomationAction =
  | 'assign_agent'
  | 'assign_group'
  | 'set_priority'
  | 'set_status'
  | 'add_tag'
  | 'send_email'
  | 'add_note'
  | 'escalate';

export interface MockAutomation {
  id: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  triggerLabel: string;
  actions: { action: AutomationAction; label: string }[];
  conditions: string[];
  enabled: boolean;
  runCount: number;
  lastRunAt?: string;
  createdBy: string;
}

export const mockAutomations: MockAutomation[] = [
  {
    id: 'auto-001',
    name: 'Auto-assign VPN tickets',
    description: 'When a ticket is created with category "Network / VPN", assign it to Tunde Bakare and tag it as vpn.',
    trigger: 'ticket_created',
    triggerLabel: 'Ticket created',
    actions: [
      { action: 'assign_agent', label: 'Assign to: Tunde Bakare' },
      { action: 'add_tag', label: 'Add tag: vpn' },
    ],
    conditions: ['Category = "Network / VPN"'],
    enabled: true,
    runCount: 34,
    lastRunAt: ago(42),
    createdBy: 'Tunde Bakare',
  },
  {
    id: 'auto-002',
    name: 'Urgent ticket escalation',
    description: 'When an urgent ticket has had no response within 15 minutes, escalate to Tier 2 Support group.',
    trigger: 'ticket_idle',
    triggerLabel: 'Ticket idle (15 min)',
    actions: [
      { action: 'assign_group', label: 'Assign to group: Tier 2 Support' },
      { action: 'escalate', label: 'Escalate ticket' },
      { action: 'add_note', label: 'Add note: Auto-escalated due to no response' },
    ],
    conditions: ['Priority = Urgent', 'Status = New OR Open', 'No agent response in 15 min'],
    enabled: true,
    runCount: 8,
    lastRunAt: ago(95),
    createdBy: 'Tunde Bakare',
  },
  {
    id: 'auto-003',
    name: 'SLA warning notification',
    description: 'When a ticket is 30 minutes from SLA breach, send an email to the assigned agent.',
    trigger: 'sla_warning',
    triggerLabel: 'SLA warning (30 min before breach)',
    actions: [
      { action: 'send_email', label: 'Email: assigned agent' },
      { action: 'add_tag', label: 'Add tag: sla-at-risk' },
    ],
    conditions: ['SLA due in ≤ 30 min', 'Status ≠ Resolved'],
    enabled: true,
    runCount: 52,
    lastRunAt: ago(20),
    createdBy: 'Adaeze Nwosu',
  },
  {
    id: 'auto-004',
    name: 'Auto-close resolved tickets (72h)',
    description: 'Automatically close tickets that have been in Resolved status for more than 72 hours.',
    trigger: 'ticket_idle',
    triggerLabel: 'Ticket idle (72h)',
    actions: [
      { action: 'set_status', label: 'Set status: Closed' },
      { action: 'send_email', label: 'Email: customer (closure notice)' },
    ],
    conditions: ['Status = Resolved', 'Idle > 72 hours'],
    enabled: true,
    runCount: 189,
    lastRunAt: ago(6 * 60),
    createdBy: 'Tunde Bakare',
  },
  {
    id: 'auto-005',
    name: 'Security ticket priority bump',
    description: 'Tickets categorised as Security are automatically set to High priority and assigned to Security Ops.',
    trigger: 'ticket_created',
    triggerLabel: 'Ticket created',
    actions: [
      { action: 'set_priority', label: 'Set priority: High' },
      { action: 'assign_group', label: 'Assign to group: Security Ops' },
    ],
    conditions: ['Category contains "Security"'],
    enabled: true,
    runCount: 28,
    lastRunAt: ago(150),
    createdBy: 'Kwame Mensah',
  },
  {
    id: 'auto-006',
    name: 'Customer reply re-open',
    description: 'When a customer replies on a Resolved or Closed ticket, set it back to Open.',
    trigger: 'customer_replied',
    triggerLabel: 'Customer replied',
    actions: [
      { action: 'set_status', label: 'Set status: Open' },
      { action: 'assign_agent', label: 'Re-assign to: original agent' },
    ],
    conditions: ['Status = Resolved OR Closed', 'Reply from: Customer'],
    enabled: true,
    runCount: 14,
    lastRunAt: ago(300),
    createdBy: 'Adaeze Nwosu',
  },
  {
    id: 'auto-007',
    name: 'Onboarding ticket checklist note',
    description: 'When an onboarding ticket is created, add a standard checklist as an internal note.',
    trigger: 'ticket_created',
    triggerLabel: 'Ticket created',
    actions: [
      { action: 'add_note', label: 'Add internal note: onboarding checklist' },
      { action: 'assign_group', label: 'Assign to group: IT Operations' },
    ],
    conditions: ['Category = "Onboarding"'],
    enabled: false,
    runCount: 7,
    lastRunAt: ago(7 * 24 * 60),
    createdBy: 'Fatima Suleiman',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SLA Policies
// ─────────────────────────────────────────────────────────────────────────────

export interface SLATarget {
  priority: TicketPriority;
  firstResponseMin: number;
  resolutionHours: number;
}

export interface SLAPolicy {
  id: string;
  name: string;
  description: string;
  targets: SLATarget[];
  conditions: string[];
  businessHoursOnly: boolean;
  escalationEnabled: boolean;
  activeTickets: number;
  breachedThisMonth: number;
  compliancePct: number;
}

export const mockSLAPolicies: SLAPolicy[] = [
  {
    id: 'sla-001',
    name: 'Default SLA',
    description: 'Applies to all tickets not matched by a more specific policy.',
    targets: [
      { priority: 'urgent', firstResponseMin: 15,  resolutionHours: 4   },
      { priority: 'high',   firstResponseMin: 30,  resolutionHours: 8   },
      { priority: 'medium', firstResponseMin: 120, resolutionHours: 24  },
      { priority: 'low',    firstResponseMin: 480, resolutionHours: 72  },
    ],
    conditions: ['All tickets (fallback)'],
    businessHoursOnly: true,
    escalationEnabled: true,
    activeTickets: 32,
    breachedThisMonth: 3,
    compliancePct: 94,
  },
  {
    id: 'sla-002',
    name: 'VIP Customer SLA',
    description: 'Stricter targets for customers tagged as VIP.',
    targets: [
      { priority: 'urgent', firstResponseMin: 5,   resolutionHours: 2   },
      { priority: 'high',   firstResponseMin: 15,  resolutionHours: 4   },
      { priority: 'medium', firstResponseMin: 60,  resolutionHours: 12  },
      { priority: 'low',    firstResponseMin: 240, resolutionHours: 48  },
    ],
    conditions: ['Customer tag = vip'],
    businessHoursOnly: false,
    escalationEnabled: true,
    activeTickets: 5,
    breachedThisMonth: 0,
    compliancePct: 100,
  },
  {
    id: 'sla-003',
    name: 'Security Incidents SLA',
    description: '24/7 coverage for all security-related tickets.',
    targets: [
      { priority: 'urgent', firstResponseMin: 5,   resolutionHours: 1   },
      { priority: 'high',   firstResponseMin: 10,  resolutionHours: 4   },
      { priority: 'medium', firstResponseMin: 30,  resolutionHours: 8   },
      { priority: 'low',    firstResponseMin: 120, resolutionHours: 24  },
    ],
    conditions: ['Category contains "Security"'],
    businessHoursOnly: false,
    escalationEnabled: true,
    activeTickets: 4,
    breachedThisMonth: 1,
    compliancePct: 97,
  },
  {
    id: 'sla-004',
    name: 'Hardware Request SLA',
    description: 'Relaxed targets for non-urgent hardware procurement requests.',
    targets: [
      { priority: 'urgent', firstResponseMin: 60,  resolutionHours: 24  },
      { priority: 'high',   firstResponseMin: 120, resolutionHours: 48  },
      { priority: 'medium', firstResponseMin: 480, resolutionHours: 120 },
      { priority: 'low',    firstResponseMin: 1440,resolutionHours: 336 },
    ],
    conditions: ['Category = "Hardware Request" OR Category = "Procurement"'],
    businessHoursOnly: true,
    escalationEnabled: false,
    activeTickets: 3,
    breachedThisMonth: 0,
    compliancePct: 100,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Channels (agent inbox view)
// ─────────────────────────────────────────────────────────────────────────────

export type ChannelType = 'email' | 'whatsapp' | 'widget' | 'voice' | 'sms' | 'api';
export type ChannelStatus = 'connected' | 'warning' | 'disconnected';

export interface MockAgentChannel {
  id: string;
  name: string;
  type: ChannelType;
  address: string; // email address, phone number, or URL
  status: ChannelStatus;
  openTickets: number;
  pendingTickets: number;
  avgResponseMin: number;
  lastActivityAt?: string;
  team: string;
  notes?: string;
}

export const mockAgentChannels: MockAgentChannel[] = [
  { id: 'ch-001', name: 'Main Support Inbox',    type: 'email',    address: 'support@consomoafrica.com',     status: 'connected',    openTickets: 18, pendingTickets: 4, avgResponseMin: 12, lastActivityAt: ago(5),    team: 'Tier 1 Support' },
  { id: 'ch-002', name: 'Billing Support',        type: 'email',    address: 'billing@consomoafrica.com',     status: 'connected',    openTickets: 5,  pendingTickets: 1, avgResponseMin: 28, lastActivityAt: ago(32),   team: 'Billing' },
  { id: 'ch-003', name: 'WhatsApp Business',      type: 'whatsapp', address: '+234 900 000 1234',             status: 'warning',      openTickets: 9,  pendingTickets: 3, avgResponseMin: 8,  lastActivityAt: ago(2),    team: 'Tier 1 Support', notes: 'Delivery receipt issue under investigation (ticket #1014).' },
  { id: 'ch-004', name: 'Help Centre Widget',     type: 'widget',   address: 'https://help.consomoafrica.com',status: 'connected',    openTickets: 4,  pendingTickets: 0, avgResponseMin: 18, lastActivityAt: ago(20),   team: 'Tier 2 Support' },
  { id: 'ch-005', name: 'Voice / Call Centre',    type: 'voice',    address: '+234 1 888 0000',               status: 'connected',    openTickets: 7,  pendingTickets: 2, avgResponseMin: 6,  lastActivityAt: ago(15),   team: 'Field Support' },
  { id: 'ch-006', name: 'SMS Alerts Line',        type: 'sms',      address: '+234 900 000 5678',             status: 'connected',    openTickets: 2,  pendingTickets: 0, avgResponseMin: 45, lastActivityAt: ago(110),  team: 'IT Operations' },
  { id: 'ch-007', name: 'API Integration',        type: 'api',      address: 'api.consomoafrica.com/tickets', status: 'connected',    openTickets: 2,  pendingTickets: 0, avgResponseMin: 0,  lastActivityAt: ago(30),   team: 'Tier 2 Support', notes: 'Automated ticket creation from monitoring system.' },
  { id: 'ch-008', name: 'Security Ops Inbox',     type: 'email',    address: 'security@consomoafrica.com',    status: 'disconnected', openTickets: 0,  pendingTickets: 0, avgResponseMin: 0,  lastActivityAt: undefined, team: 'Security Ops',   notes: 'Inbox disconnected. Re-authentication required.' },
];
