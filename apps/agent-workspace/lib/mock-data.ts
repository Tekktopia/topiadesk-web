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
