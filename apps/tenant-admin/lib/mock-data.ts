/**
 * Mock data for the tenant admin portal. Replace with real admin-api calls
 * when the backend is ready.
 */

export const TENANT = {
  id: 'tnt_consomo',
  name: 'ConsomoAfrica',
  shortName: 'Consomo',
  emoji: '🌍',
  subdomain: 'consomoafrica',
  customDomain: 'support.consomoafrica.com',
  customDomainStatus: 'verified' as 'verified' | 'pending' | 'unverified',
  plan: 'Business',
  region: 'eu-west',
  timezone: 'Africa/Lagos',
  language: 'en-GB',
  currency: 'USD',
  primaryColor: '#1D3A5F',
  accentColor: '#F97316',
  supportEmail: 'support@consomoafrica.com',
  fromName: 'ConsomoAfrica Support',
  seatsUsed: 24,
  seatsTotal: 35,
  createdAt: '2024-08-12T10:00:00Z',
};

export const CURRENT_ADMIN = {
  id: 'a-admin',
  name: 'Adaeze Nwosu',
  email: 'adaeze@consomoafrica.com',
  role: 'Tenant Admin',
};

export interface AdminAgent {
  id: string;
  name: string;
  email: string;
  role: string;
  group: string;
  status: 'active' | 'invited' | 'suspended';
  lastSeen: string | null;
  ticketsResolved: number;
  joinedAt: string;
  mfa: boolean;
}

export const adminAgents: AdminAgent[] = [
  {
    id: 'a1',
    name: 'Tunde Bakare',
    email: 'tunde@consomoafrica.com',
    role: 'Senior Agent',
    group: 'Tier 1 Support',
    status: 'active',
    lastSeen: '2 min ago',
    ticketsResolved: 247,
    joinedAt: '2024-09-01',
    mfa: true,
  },
  {
    id: 'a2',
    name: 'Adaeze Nwosu',
    email: 'adaeze@consomoafrica.com',
    role: 'Tenant Admin',
    group: 'Administration',
    status: 'active',
    lastSeen: 'Now',
    ticketsResolved: 198,
    joinedAt: '2024-08-12',
    mfa: true,
  },
  {
    id: 'a3',
    name: 'Kwame Mensah',
    email: 'kwame@consomoafrica.com',
    role: 'Agent',
    group: 'Tier 2 Support',
    status: 'active',
    lastSeen: '12 min ago',
    ticketsResolved: 178,
    joinedAt: '2024-10-15',
    mfa: true,
  },
  {
    id: 'a4',
    name: 'Fatima Suleiman',
    email: 'fatima@consomoafrica.com',
    role: 'Security Lead',
    group: 'Security Ops',
    status: 'active',
    lastSeen: '1 hr ago',
    ticketsResolved: 132,
    joinedAt: '2024-11-02',
    mfa: true,
  },
  {
    id: 'a5',
    name: 'Chinedu Okafor',
    email: 'chinedu@consomoafrica.com',
    role: 'Agent',
    group: 'IT Operations',
    status: 'active',
    lastSeen: 'Yesterday',
    ticketsResolved: 116,
    joinedAt: '2025-01-08',
    mfa: false,
  },
  {
    id: 'a6',
    name: 'Lola Adebayo',
    email: 'lola@consomoafrica.com',
    role: 'Agent',
    group: 'Tier 1 Support',
    status: 'invited',
    lastSeen: null,
    ticketsResolved: 0,
    joinedAt: '2026-05-20',
    mfa: false,
  },
  {
    id: 'a7',
    name: 'Samuel Bakari',
    email: 'sam@consomoafrica.com',
    role: 'Agent',
    group: 'Field Support',
    status: 'suspended',
    lastSeen: '32 days ago',
    ticketsResolved: 64,
    joinedAt: '2025-03-15',
    mfa: true,
  },
];

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  system: boolean;
  agentCount: number;
  permissionCount: number;
}

export const adminRoles: AdminRole[] = [
  {
    id: 'r1',
    name: 'Tenant Admin',
    description: 'Full control over the tenant, including billing and roles',
    system: true,
    agentCount: 2,
    permissionCount: 84,
  },
  {
    id: 'r2',
    name: 'Senior Agent',
    description: 'Resolve tickets, manage queues, view reports',
    system: true,
    agentCount: 5,
    permissionCount: 41,
  },
  {
    id: 'r3',
    name: 'Agent',
    description: 'Resolve assigned tickets, view team queues',
    system: true,
    agentCount: 12,
    permissionCount: 28,
  },
  {
    id: 'r4',
    name: 'Read-only viewer',
    description: 'View tickets and reports, no edit access',
    system: true,
    agentCount: 3,
    permissionCount: 14,
  },
  {
    id: 'r5',
    name: 'Security Lead',
    description: 'Agent permissions plus security policy management',
    system: false,
    agentCount: 1,
    permissionCount: 52,
  },
  {
    id: 'r6',
    name: 'Field Technician',
    description: 'Mobile-first agent for on-site work orders only',
    system: false,
    agentCount: 4,
    permissionCount: 19,
  },
];

export interface AdminSla {
  id: string;
  name: string;
  appliesTo: string;
  firstResponse: Record<'urgent' | 'high' | 'medium' | 'low', string>;
  resolution: Record<'urgent' | 'high' | 'medium' | 'low', string>;
  active: boolean;
  ticketsThisMonth: number;
  complianceRate: number;
}

export const adminSlas: AdminSla[] = [
  {
    id: 's1',
    name: 'Standard policy',
    appliesTo: 'All tickets',
    firstResponse: {
      urgent: '15 min',
      high: '1 hour',
      medium: '4 hours',
      low: '1 business day',
    },
    resolution: {
      urgent: '4 hours',
      high: '1 business day',
      medium: '3 business days',
      low: '5 business days',
    },
    active: true,
    ticketsThisMonth: 312,
    complianceRate: 94,
  },
  {
    id: 's2',
    name: 'VIP fast-track',
    appliesTo: 'Tickets tagged #vip or from premium contacts',
    firstResponse: {
      urgent: '5 min',
      high: '15 min',
      medium: '1 hour',
      low: '4 hours',
    },
    resolution: {
      urgent: '1 hour',
      high: '4 hours',
      medium: '1 business day',
      low: '2 business days',
    },
    active: true,
    ticketsThisMonth: 41,
    complianceRate: 98,
  },
  {
    id: 's3',
    name: 'After-hours holding',
    appliesTo: 'Tickets opened outside business hours',
    firstResponse: {
      urgent: '30 min',
      high: '2 hours',
      medium: 'Next business day',
      low: 'Next business day',
    },
    resolution: {
      urgent: '4 hours',
      high: '1 business day',
      medium: '3 business days',
      low: '5 business days',
    },
    active: true,
    ticketsThisMonth: 89,
    complianceRate: 91,
  },
];

export interface AdminAutomation {
  id: string;
  name: string;
  description: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  active: boolean;
  dryRun: boolean;
  runs7d: number;
  lastRun: string;
}

export const adminAutomations: AdminAutomation[] = [
  {
    id: 'aut-1',
    name: 'VIP fast-track',
    description: 'Mark tickets from VIP contacts as urgent and assign to senior agents',
    trigger: 'Ticket created',
    conditions: ['Requester tag includes "vip"', 'Status is "new"'],
    actions: [
      'Set priority to Urgent',
      'Assign to group "Tier 1 Support — VIP"',
      'Send Slack notification to #vip-alerts',
    ],
    active: true,
    dryRun: false,
    runs7d: 47,
    lastRun: '8 min ago',
  },
  {
    id: 'aut-2',
    name: 'Out-of-hours holding reply',
    description: 'Auto-reply confirming receipt when tickets land outside business hours',
    trigger: 'Ticket created',
    conditions: ['Outside business hours'],
    actions: [
      'Send canned reply "We have received your request"',
      'Set status to Open',
    ],
    active: true,
    dryRun: false,
    runs7d: 89,
    lastRun: '2 hr ago',
  },
  {
    id: 'aut-3',
    name: 'SLA escalation — 80% mark',
    description: 'Notify ticket assignee and group lead when SLA hits 80% of due time',
    trigger: 'SLA timer at 80%',
    conditions: ['Status is not "resolved"'],
    actions: [
      'Notify assignee',
      'Notify group lead',
      'Add tag "sla-warning"',
    ],
    active: true,
    dryRun: false,
    runs7d: 23,
    lastRun: '14 min ago',
  },
  {
    id: 'aut-4',
    name: 'Asset offboarding cascade',
    description: 'When a contact is offboarded, raise a child ticket per assigned asset',
    trigger: 'Contact status changed to "offboarded"',
    conditions: ['Contact has 1+ assigned assets'],
    actions: [
      'Create child ticket per asset in IT Operations',
      'Set parent ticket due date to +7 days',
    ],
    active: true,
    dryRun: false,
    runs7d: 6,
    lastRun: '1 day ago',
  },
  {
    id: 'aut-5',
    name: 'Warranty expiry watcher',
    description: 'Flag assets whose warranty expires within the next 60 days',
    trigger: 'Daily schedule',
    conditions: ['Asset warranty ends within 60 days'],
    actions: [
      'Tag asset with "warranty-expiring"',
      'Open task for IT Operations',
    ],
    active: false,
    dryRun: true,
    runs7d: 14,
    lastRun: '12 hr ago',
  },
];

export interface AdminIntegration {
  id: string;
  name: string;
  description: string;
  category: 'sso' | 'channel' | 'productivity' | 'payment' | 'monitoring';
  status: 'connected' | 'available';
  connectedAt?: string;
}

export const adminIntegrations: AdminIntegration[] = [
  {
    id: 'okta',
    name: 'Okta',
    description: 'SSO via SAML 2.0 — auto-provision agents from your IdP',
    category: 'sso',
    status: 'connected',
    connectedAt: '2024-08-14',
  },
  {
    id: 'microsoft',
    name: 'Microsoft Entra ID',
    description: 'SSO + SCIM provisioning',
    category: 'sso',
    status: 'available',
  },
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    description: 'OIDC SSO for Google-hosted agents',
    category: 'sso',
    status: 'available',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Receive and send WhatsApp messages as tickets',
    category: 'channel',
    status: 'connected',
    connectedAt: '2025-01-04',
  },
  {
    id: 'twilio-sms',
    name: 'Twilio SMS',
    description: 'Two-way SMS conversations',
    category: 'channel',
    status: 'connected',
    connectedAt: '2025-02-18',
  },
  {
    id: 'zoom-phone',
    name: 'Zoom Phone',
    description: 'Voice calls and voicemail',
    category: 'channel',
    status: 'available',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Ticket events and approvals in Slack channels',
    category: 'productivity',
    status: 'connected',
    connectedAt: '2024-09-22',
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    description: 'Mirror Slack capability in Teams',
    category: 'productivity',
    status: 'available',
  },
  {
    id: 'paystack',
    name: 'Paystack',
    description: 'Process invoice payments in NGN, GHS, ZAR',
    category: 'payment',
    status: 'connected',
    connectedAt: '2025-04-01',
  },
  {
    id: 'datadog',
    name: 'Datadog',
    description: 'Forward alerts as tickets',
    category: 'monitoring',
    status: 'available',
  },
];

export interface AdminWebhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  lastDelivery: string;
  successRate: number;
}

export const adminWebhooks: AdminWebhook[] = [
  {
    id: 'wh-1',
    name: 'Slack alerts',
    url: 'https://hooks.slack.com/services/T0000/B0000/SECRET',
    events: ['ticket.created', 'ticket.escalated', 'sla.breached'],
    active: true,
    lastDelivery: '12 min ago',
    successRate: 99.4,
  },
  {
    id: 'wh-2',
    name: 'Datadog event hook',
    url: 'https://api.datadoghq.com/api/v1/events?api_key=••••',
    events: ['ticket.resolved', 'sla.breached'],
    active: true,
    lastDelivery: '34 min ago',
    successRate: 100,
  },
  {
    id: 'wh-3',
    name: 'Customer billing exporter',
    url: 'https://billing.consomoafrica.com/webhooks/topiadesk',
    events: ['ticket.resolved'],
    active: false,
    lastDelivery: '4 days ago',
    successRate: 87.1,
  },
];

export interface AuditEvent {
  id: string;
  actor: string;
  actorEmail: string;
  action: string;
  target: string;
  category: 'auth' | 'config' | 'data' | 'security';
  ip: string;
  occurredAt: string;
}

export const auditEvents: AuditEvent[] = [
  {
    id: 'ae-1',
    actor: 'Adaeze Nwosu',
    actorEmail: 'adaeze@consomoafrica.com',
    action: 'updated SLA policy',
    target: 'VIP fast-track',
    category: 'config',
    ip: '102.89.34.21',
    occurredAt: '12 min ago',
  },
  {
    id: 'ae-2',
    actor: 'Adaeze Nwosu',
    actorEmail: 'adaeze@consomoafrica.com',
    action: 'invited agent',
    target: 'lola@consomoafrica.com',
    category: 'auth',
    ip: '102.89.34.21',
    occurredAt: '38 min ago',
  },
  {
    id: 'ae-3',
    actor: 'System',
    actorEmail: 'system@topiadesk.com',
    action: 'rotated webhook secret',
    target: 'Slack alerts',
    category: 'security',
    ip: '—',
    occurredAt: '1 hr ago',
  },
  {
    id: 'ae-4',
    actor: 'Fatima Suleiman',
    actorEmail: 'fatima@consomoafrica.com',
    action: 'created automation rule',
    target: 'SLA escalation — 80% mark',
    category: 'config',
    ip: '102.89.30.15',
    occurredAt: '4 hr ago',
  },
  {
    id: 'ae-5',
    actor: 'Tunde Bakare',
    actorEmail: 'tunde@consomoafrica.com',
    action: 'exported tickets CSV',
    target: '423 rows · "Resolved this week"',
    category: 'data',
    ip: '102.89.34.21',
    occurredAt: 'Yesterday 16:42',
  },
  {
    id: 'ae-6',
    actor: 'Adaeze Nwosu',
    actorEmail: 'adaeze@consomoafrica.com',
    action: 'connected integration',
    target: 'Paystack',
    category: 'config',
    ip: '102.89.34.21',
    occurredAt: '2 days ago',
  },
  {
    id: 'ae-7',
    actor: 'System',
    actorEmail: 'system@topiadesk.com',
    action: 'failed login (rate-limited)',
    target: 'kwame@consomoafrica.com',
    category: 'security',
    ip: '41.218.4.92',
    occurredAt: '3 days ago',
  },
];

// ─── Email Inboxes ─────────────────────────────────────────────────────────────

export interface EmailInbox {
  id: string;
  /** Friendly display name shown to agents, e.g. "General Support" */
  name: string;
  /** The email address customers write to, e.g. "support@company.com" */
  email: string;
  /** Topiadesk inbound forwarding address, e.g. "company-abc123@in.topiadesk.com" */
  forwardingAddress: string;
  status: 'active' | 'pending' | 'paused';
  defaultPriority: 'low' | 'medium' | 'high' | 'urgent';
  defaultTeam: string | null;
  autoReply: boolean;
  autoReplyMessage: string;
  ticketCount: number;
  lastReceivedAt: string | null;
  createdAt: string;
}

export const adminEmailInboxes: EmailInbox[] = [
  {
    id: 'inbox-1',
    name: 'General Support',
    email: 'support@consomoafrica.com',
    forwardingAddress: 'consomoafrica-a1b2c3@in.topiadesk.com',
    status: 'active',
    defaultPriority: 'medium',
    defaultTeam: 'Support',
    autoReply: true,
    autoReplyMessage:
      "Thanks for reaching out! We've received your request and will respond within 1 business hour.",
    ticketCount: 247,
    lastReceivedAt: '12 minutes ago',
    createdAt: '4 months ago',
  },
  {
    id: 'inbox-2',
    name: 'Billing Queries',
    email: 'billing@consomoafrica.com',
    forwardingAddress: 'consomoafrica-d4e5f6@in.topiadesk.com',
    status: 'active',
    defaultPriority: 'high',
    defaultTeam: 'Finance',
    autoReply: false,
    autoReplyMessage: '',
    ticketCount: 83,
    lastReceivedAt: '2 hours ago',
    createdAt: '4 months ago',
  },
  {
    id: 'inbox-3',
    name: 'Technical Escalations',
    email: 'techsupport@consomoafrica.com',
    forwardingAddress: 'consomoafrica-g7h8i9@in.topiadesk.com',
    status: 'pending',
    defaultPriority: 'urgent',
    defaultTeam: 'Engineering',
    autoReply: false,
    autoReplyMessage: '',
    ticketCount: 0,
    lastReceivedAt: null,
    createdAt: '2 days ago',
  },
  {
    id: 'inbox-4',
    name: 'Customer Feedback',
    email: 'feedback@consomoafrica.com',
    forwardingAddress: 'consomoafrica-j0k1l2@in.topiadesk.com',
    status: 'paused',
    defaultPriority: 'low',
    defaultTeam: null,
    autoReply: false,
    autoReplyMessage: '',
    ticketCount: 19,
    lastReceivedAt: '3 weeks ago',
    createdAt: '6 months ago',
  },
];

export const BUSINESS_HOURS = {
  timezone: 'Africa/Lagos',
  schedule: [
    { day: 'Monday', open: true, start: '08:00', end: '18:00' },
    { day: 'Tuesday', open: true, start: '08:00', end: '18:00' },
    { day: 'Wednesday', open: true, start: '08:00', end: '18:00' },
    { day: 'Thursday', open: true, start: '08:00', end: '18:00' },
    { day: 'Friday', open: true, start: '08:00', end: '17:00' },
    { day: 'Saturday', open: false, start: '', end: '' },
    { day: 'Sunday', open: false, start: '', end: '' },
  ],
  holidays: [
    { date: '2026-01-01', name: 'New Year' },
    { date: '2026-04-03', name: 'Good Friday' },
    { date: '2026-05-01', name: "Workers' Day" },
    { date: '2026-06-12', name: 'Democracy Day' },
    { date: '2026-10-01', name: 'Independence Day' },
    { date: '2026-12-25', name: 'Christmas Day' },
    { date: '2026-12-26', name: 'Boxing Day' },
  ],
};
