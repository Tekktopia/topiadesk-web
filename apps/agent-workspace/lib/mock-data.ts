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
