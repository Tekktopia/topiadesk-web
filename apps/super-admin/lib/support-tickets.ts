/**
 * Mock CSR (Customer Service Rep) ticket data for Topiadesk's super-admin
 * portal. These are tickets opened by *tenants* asking Topiadesk for help —
 * distinct from agent-workspace tickets (which are tenant ↔ end-user).
 */

export type CsrStatus    = 'new' | 'in_progress' | 'awaiting_tenant' | 'resolved' | 'closed';
export type CsrPriority  = 'urgent' | 'high' | 'medium' | 'low';
export type CsrCategory  = 'billing' | 'auth' | 'integration' | 'data' | 'feature_request' | 'bug' | 'general';
export type SlaState     = 'on_track' | 'at_risk' | 'breached';

export interface CsrReply {
  id: string;
  authorType: 'tenant' | 'csr' | 'system';
  authorName: string;
  authorEmail?: string;
  body: string;
  createdAt: string;
  internal?: boolean;
}

export interface CsrTicket {
  id: string;
  number: string;
  subject: string;
  body: string;
  tenantId: string;
  tenantName: string;
  tenantPlan: 'starter' | 'business' | 'enterprise';
  requesterName: string;
  requesterEmail: string;
  category: CsrCategory;
  status: CsrStatus;
  priority: CsrPriority;
  sla: SlaState;
  slaDueAt: string;
  assignee?: { name: string; initials: string };
  channel: 'email' | 'chat' | 'phone' | 'portal';
  createdAt: string;
  updatedAt: string;
  replies: number;
  vipTenant?: boolean;
  /** Full conversation thread */
  thread?: CsrReply[];
  /** Tags for filtering */
  tags?: string[];
}

export const CSR_TEAM = [
  { name: 'Tunde Bakare',     initials: 'TB', email: 'tunde@topiadesk.com' },
  { name: 'Amara Diallo',     initials: 'AD', email: 'amara@topiadesk.com' },
  { name: 'Daniel Oshinubi',  initials: 'DO', email: 'daniel@topiadesk.com' },
  { name: 'Fatima Suleiman',  initials: 'FS', email: 'fatima@topiadesk.com' },
];

const ago = (mins: number) => new Date(Date.now() - mins * 60_000).toISOString();
const inMins = (mins: number) => new Date(Date.now() + mins * 60_000).toISOString();

export const MOCK_CSR_TICKETS: CsrTicket[] = [
  {
    id: 'csr-1042', number: 'CSR-1042',
    subject: 'Cannot disable MFA after admin left company',
    body: 'Our previous IT admin left and we no longer have access to the MFA device. We need help disabling MFA on our super-admin account so we can re-onboard.',
    tenantId: 't-kasi', tenantName: 'KasiPay', tenantPlan: 'enterprise',
    requesterName: 'Tunde A.', requesterEmail: 'tunde@kasi-pay.co.za',
    category: 'auth', status: 'new', priority: 'urgent', sla: 'at_risk',
    slaDueAt: inMins(24),
    channel: 'email', createdAt: ago(60), updatedAt: ago(12),
    replies: 1, vipTenant: true,
    tags: ['mfa', 'account-recovery', 'enterprise-vip'],
    thread: [
      {
        id: 'r-1042-1', authorType: 'tenant',
        authorName: 'Tunde A.', authorEmail: 'tunde@kasi-pay.co.za',
        body: 'Hi Topiadesk team, our previous IT admin (Kayode) left abruptly. He set up MFA on the super-admin account and we no longer have access to the authenticator device. Could you please disable MFA so we can regain access?\n\nThis is blocking our entire IT team.',
        createdAt: ago(60),
      },
      {
        id: 'r-1042-2', authorType: 'system',
        authorName: 'System',
        body: 'Ticket automatically tagged as `urgent` due to mention of "blocking" and customer plan = Enterprise.',
        createdAt: ago(59), internal: true,
      },
    ],
  },
  {
    id: 'csr-1041', number: 'CSR-1041',
    subject: 'Stripe webhook not firing for canceled subscriptions',
    body: "We're seeing tenants on our portal still showing as 'active' even after Stripe says they've canceled. Our webhook URL is correct.",
    tenantId: 't-flair', tenantName: 'FlairTech Solutions', tenantPlan: 'business',
    requesterName: 'Joshua Adekunle', requesterEmail: 'josh@flairtech.ng',
    category: 'integration', status: 'in_progress', priority: 'high', sla: 'on_track',
    slaDueAt: inMins(180),
    assignee: CSR_TEAM[0], channel: 'portal',
    createdAt: ago(240), updatedAt: ago(40),
    replies: 4, tags: ['webhook', 'stripe', 'integration'],
    thread: [
      {
        id: 'r-1041-1', authorType: 'tenant',
        authorName: 'Joshua Adekunle', authorEmail: 'josh@flairtech.ng',
        body: 'Hey,\n\nNoticed our customer-cancellation events from Stripe aren\'t triggering the cancel flow in Topiadesk. URL https://flairtech.topiadesk.com/api/webhooks/stripe is verified in Stripe dashboard but seeing 0 events delivered in the last 48h.',
        createdAt: ago(240),
      },
      {
        id: 'r-1041-2', authorType: 'csr',
        authorName: 'Tunde Bakare', authorEmail: 'tunde@topiadesk.com',
        body: 'Hi Joshua, thanks for the detailed report. Pulling logs on our end. Quick question — did you rotate the webhook signing secret recently?',
        createdAt: ago(180),
      },
      {
        id: 'r-1041-3', authorType: 'tenant',
        authorName: 'Joshua Adekunle', authorEmail: 'josh@flairtech.ng',
        body: 'Yes, last week. Could that be it?',
        createdAt: ago(120),
      },
      {
        id: 'r-1041-4', authorType: 'csr',
        authorName: 'Tunde Bakare', authorEmail: 'tunde@topiadesk.com',
        body: 'That\'s almost certainly the cause. Could you re-share the current signing secret with us (via the secure share link below) so I can verify config? We\'ll get this fixed within the hour.',
        createdAt: ago(40),
      },
    ],
  },
  {
    id: 'csr-1040', number: 'CSR-1040',
    subject: 'Refund request for unused seats',
    body: 'We were billed $499 for 12 seats but only activated 7. Can we get a prorated refund?',
    tenantId: 't-acme', tenantName: 'AcmeBank Nigeria', tenantPlan: 'enterprise',
    requesterName: 'Sarah Okonkwo', requesterEmail: 'sarah.o@acmebank.ng',
    category: 'billing', status: 'awaiting_tenant', priority: 'medium', sla: 'on_track',
    slaDueAt: inMins(18 * 60),
    assignee: CSR_TEAM[1], channel: 'email',
    createdAt: ago(2 * 24 * 60), updatedAt: ago(4 * 60),
    replies: 6, vipTenant: true, tags: ['refund', 'billing'],
  },
  {
    id: 'csr-1039', number: 'CSR-1039',
    subject: 'Data export taking >24 hours',
    body: 'I requested a full tenant data export 2 days ago and still no download link.',
    tenantId: 't-safari', tenantName: 'SafariHold', tenantPlan: 'business',
    requesterName: 'Daniel Mwangi', requesterEmail: 'd.mwangi@safarihold.co.ke',
    category: 'data', status: 'in_progress', priority: 'high', sla: 'breached',
    slaDueAt: ago(30),
    assignee: CSR_TEAM[2], channel: 'email',
    createdAt: ago(3 * 24 * 60), updatedAt: ago(6 * 60),
    replies: 3, tags: ['gdpr-export', 'sla-breached'],
  },
  {
    id: 'csr-1038', number: 'CSR-1038',
    subject: 'Feature request: SAML SSO with Okta',
    body: "We're rolling out Okta org-wide and need SAML SSO support. Currently you only offer Google Workspace.",
    tenantId: 't-darport', tenantName: 'Dar Port Authority', tenantPlan: 'enterprise',
    requesterName: 'Emmanuel Diallo', requesterEmail: 'emm@dakarlink.sn',
    category: 'feature_request', status: 'in_progress', priority: 'medium', sla: 'on_track',
    slaDueAt: inMins(5 * 24 * 60),
    assignee: CSR_TEAM[0], channel: 'portal',
    createdAt: ago(5 * 24 * 60), updatedAt: ago(24 * 60),
    replies: 8, vipTenant: true, tags: ['sso', 'okta', 'enterprise-fr'],
  },
  {
    id: 'csr-1037', number: 'CSR-1037',
    subject: 'WhatsApp channel disconnects every 6 hours',
    body: 'Our WA Business connection keeps dropping. We have to re-authenticate twice a day. Tenants are complaining.',
    tenantId: 't-nairobi', tenantName: 'Nairobi Motors', tenantPlan: 'business',
    requesterName: 'Grace Maathai', requesterEmail: 'grace@safarihold.co.ke',
    category: 'bug', status: 'new', priority: 'high', sla: 'on_track',
    slaDueAt: inMins(6 * 60),
    channel: 'chat',
    createdAt: ago(30), updatedAt: ago(30),
    replies: 0, tags: ['whatsapp', 'channel-bug'],
  },
  {
    id: 'csr-1036', number: 'CSR-1036',
    subject: 'How do I bulk-import 200 agents?',
    body: 'We onboarded a large team and need to bulk-create 200 agent accounts. Is there a CSV upload?',
    tenantId: 't-kampala', tenantName: 'Kampala Digital Agency', tenantPlan: 'starter',
    requesterName: 'Aisha Ibrahim', requesterEmail: 'aisha.i@northfield.ng',
    category: 'general', status: 'resolved', priority: 'low', sla: 'on_track',
    slaDueAt: ago(24 * 60),
    assignee: CSR_TEAM[3], channel: 'email',
    createdAt: ago(4 * 24 * 60), updatedAt: ago(2 * 24 * 60),
    replies: 5, tags: ['bulk-import', 'how-to'],
  },
  {
    id: 'csr-1035', number: 'CSR-1035',
    subject: 'Custom domain SSL certificate expired',
    body: 'support.flairtech.com is showing SSL warning. Last renewed 13 months ago.',
    tenantId: 't-flair', tenantName: 'FlairTech Solutions', tenantPlan: 'business',
    requesterName: 'Joshua Adekunle', requesterEmail: 'josh@flairtech.ng',
    category: 'bug', status: 'closed', priority: 'high', sla: 'on_track',
    slaDueAt: ago(5 * 24 * 60),
    assignee: CSR_TEAM[2], channel: 'email',
    createdAt: ago(7 * 24 * 60), updatedAt: ago(5 * 24 * 60),
    replies: 9, tags: ['ssl', 'custom-domain'],
  },
];

export function findCsrTicket(id: string): CsrTicket | undefined {
  return MOCK_CSR_TICKETS.find((t) => t.id === id || t.id === `csr-${id}` || t.number === id);
}

/**
 * Aggregate CSR tickets per tenant — used by the CSR-side tenant view.
 */
export function csrTicketsForTenant(tenantId: string) {
  return MOCK_CSR_TICKETS.filter((t) => t.tenantId === tenantId);
}

// ─── Tenant analytics (mock) ─────────────────────────────────────────────────
// Per-tenant data not in the global mockTenants list — these are CSR-specific
// metrics (transactions, support usage, contacts).

export interface TenantSupportProfile {
  tenantId: string;
  name: string;
  plan: 'starter' | 'business' | 'enterprise';
  subdomain: string;
  country: string;
  city: string;
  primaryEmail: string;
  primaryPhone: string;
  billingEmail: string;
  signupDate: string;
  /** Last 30 days */
  metrics: {
    ticketsOpened30d:    number;
    ticketsResolved30d:  number;
    avgResolutionHours:  number;
    csatScore:           number; // 0..5
    totalSpendUsd:       number;
    activeAgents:        number;
    seatLimit:           number;
    apiCallsThisMonth:   number;
    storageUsedGb:       number;
    storageLimitGb:      number;
  };
  /** Health flags */
  health: {
    paymentStatus:    'current' | 'past_due' | 'failed';
    accountStatus:    'active' | 'trialing' | 'suspended' | 'churned';
    healthScore:      number; // 0..100 retention prediction
    riskLevel:        'low' | 'medium' | 'high';
    csm?:             string; // assigned customer success manager
  };
  /** Recent activity timeline (mock) */
  timeline: {
    id:        string;
    type:      'login' | 'plan_change' | 'ticket' | 'invoice' | 'incident';
    title:     string;
    when:      string;
  }[];
  vip?: boolean;
}

const SUPPORT_PROFILES: TenantSupportProfile[] = [
  {
    tenantId: 't-kasi', name: 'KasiPay', plan: 'enterprise',
    subdomain: 'kasipay', country: 'South Africa', city: 'Cape Town',
    primaryEmail: 'tunde@kasi-pay.co.za', primaryPhone: '+27 21 555 0140',
    billingEmail: 'accounts@kasi-pay.co.za',
    signupDate: '2024-03-14',
    metrics: {
      ticketsOpened30d: 4, ticketsResolved30d: 2, avgResolutionHours: 3.4,
      csatScore: 4.7, totalSpendUsd: 14_388, activeAgents: 42, seatLimit: 50,
      apiCallsThisMonth: 1_842_117, storageUsedGb: 124, storageLimitGb: 200,
    },
    health: { paymentStatus: 'current', accountStatus: 'active', healthScore: 87, riskLevel: 'low', csm: 'Amara Diallo' },
    timeline: [
      { id: 'tl1', type: 'ticket',   title: 'Opened ticket CSR-1042 — MFA recovery', when: ago(60) },
      { id: 'tl2', type: 'login',    title: 'Owner Tunde A. logged in from Cape Town', when: ago(2*60) },
      { id: 'tl3', type: 'invoice',  title: 'Invoice #INV-2026-04 paid ($1,199)', when: ago(14*24*60) },
      { id: 'tl4', type: 'plan_change', title: 'Upgraded from Business to Enterprise', when: ago(180*24*60) },
    ],
    vip: true,
  },
  {
    tenantId: 't-flair', name: 'FlairTech Solutions', plan: 'business',
    subdomain: 'flairtech', country: 'Nigeria', city: 'Lagos',
    primaryEmail: 'josh@flairtech.ng', primaryPhone: '+234 803 412 6201',
    billingEmail: 'billing@flairtech.ng',
    signupDate: '2024-08-22',
    metrics: {
      ticketsOpened30d: 6, ticketsResolved30d: 4, avgResolutionHours: 5.1,
      csatScore: 4.2, totalSpendUsd: 5_988, activeAgents: 18, seatLimit: 25,
      apiCallsThisMonth: 412_443, storageUsedGb: 38, storageLimitGb: 100,
    },
    health: { paymentStatus: 'current', accountStatus: 'active', healthScore: 73, riskLevel: 'medium', csm: 'Tunde Bakare' },
    timeline: [
      { id: 'tl1', type: 'ticket', title: 'Opened ticket CSR-1041 — Stripe webhook', when: ago(240) },
      { id: 'tl2', type: 'ticket', title: 'Resolved CSR-1035 — SSL renewal', when: ago(5*24*60) },
      { id: 'tl3', type: 'invoice',title: 'Invoice #INV-2026-04 paid ($499)', when: ago(14*24*60) },
    ],
  },
  {
    tenantId: 't-acme', name: 'AcmeBank Nigeria', plan: 'enterprise',
    subdomain: 'acmebank', country: 'Nigeria', city: 'Abuja',
    primaryEmail: 'sarah.o@acmebank.ng', primaryPhone: '+234 802 998 7104',
    billingEmail: 'finance@acmebank.ng',
    signupDate: '2023-11-05',
    metrics: {
      ticketsOpened30d: 2, ticketsResolved30d: 2, avgResolutionHours: 8.2,
      csatScore: 4.9, totalSpendUsd: 28_776, activeAgents: 67, seatLimit: 100,
      apiCallsThisMonth: 2_891_209, storageUsedGb: 312, storageLimitGb: 500,
    },
    health: { paymentStatus: 'current', accountStatus: 'active', healthScore: 92, riskLevel: 'low', csm: 'Amara Diallo' },
    timeline: [
      { id: 'tl1', type: 'ticket', title: 'Opened ticket CSR-1040 — Seat refund', when: ago(2*24*60) },
      { id: 'tl2', type: 'plan_change', title: 'Renewed annual contract — $24,000', when: ago(90*24*60) },
      { id: 'tl3', type: 'incident', title: 'Brief outage acknowledged (10m)', when: ago(20*24*60) },
    ],
    vip: true,
  },
  {
    tenantId: 't-safari', name: 'SafariHold', plan: 'business',
    subdomain: 'safarihold', country: 'Kenya', city: 'Nairobi',
    primaryEmail: 'd.mwangi@safarihold.co.ke', primaryPhone: '+254 712 458 901',
    billingEmail: 'admin@safarihold.co.ke',
    signupDate: '2025-01-18',
    metrics: {
      ticketsOpened30d: 8, ticketsResolved30d: 5, avgResolutionHours: 12.3,
      csatScore: 3.6, totalSpendUsd: 4_491, activeAgents: 12, seatLimit: 25,
      apiCallsThisMonth: 287_115, storageUsedGb: 24, storageLimitGb: 100,
    },
    health: { paymentStatus: 'current', accountStatus: 'active', healthScore: 54, riskLevel: 'high', csm: 'Daniel Oshinubi' },
    timeline: [
      { id: 'tl1', type: 'ticket', title: 'Opened ticket CSR-1039 — Data export slow', when: ago(3*24*60) },
      { id: 'tl2', type: 'ticket', title: 'CSAT 2/5 received on CSR-1031', when: ago(8*24*60) },
      { id: 'tl3', type: 'login',  title: 'Admin login from unusual IP', when: ago(11*24*60) },
    ],
  },
  {
    tenantId: 't-darport', name: 'Dar Port Authority', plan: 'enterprise',
    subdomain: 'darport', country: 'Tanzania', city: 'Dar es Salaam',
    primaryEmail: 'emm@dakarlink.sn', primaryPhone: '+255 22 211 8400',
    billingEmail: 'finance@darport.tz',
    signupDate: '2024-06-09',
    metrics: {
      ticketsOpened30d: 3, ticketsResolved30d: 3, avgResolutionHours: 6.0,
      csatScore: 4.5, totalSpendUsd: 12_999, activeAgents: 28, seatLimit: 50,
      apiCallsThisMonth: 1_138_002, storageUsedGb: 89, storageLimitGb: 200,
    },
    health: { paymentStatus: 'current', accountStatus: 'active', healthScore: 81, riskLevel: 'low', csm: 'Tunde Bakare' },
    timeline: [
      { id: 'tl1', type: 'ticket', title: 'Opened ticket CSR-1038 — SAML SSO request', when: ago(5*24*60) },
    ],
    vip: true,
  },
  {
    tenantId: 't-nairobi', name: 'Nairobi Motors', plan: 'business',
    subdomain: 'nairobimotors', country: 'Kenya', city: 'Nairobi',
    primaryEmail: 'grace@safarihold.co.ke', primaryPhone: '+254 720 882 014',
    billingEmail: 'accounts@nairobimotors.co.ke',
    signupDate: '2025-09-12',
    metrics: {
      ticketsOpened30d: 1, ticketsResolved30d: 0, avgResolutionHours: 0,
      csatScore: 0, totalSpendUsd: 1_788, activeAgents: 9, seatLimit: 15,
      apiCallsThisMonth: 89_414, storageUsedGb: 11, storageLimitGb: 50,
    },
    health: { paymentStatus: 'current', accountStatus: 'active', healthScore: 68, riskLevel: 'medium' },
    timeline: [
      { id: 'tl1', type: 'ticket', title: 'Opened ticket CSR-1037 — WhatsApp drops', when: ago(30) },
    ],
  },
  {
    tenantId: 't-kampala', name: 'Kampala Digital Agency', plan: 'starter',
    subdomain: 'kampaladigital', country: 'Uganda', city: 'Kampala',
    primaryEmail: 'aisha.i@northfield.ng', primaryPhone: '+256 414 290 887',
    billingEmail: 'aisha.i@northfield.ng',
    signupDate: '2026-03-12',
    metrics: {
      ticketsOpened30d: 1, ticketsResolved30d: 1, avgResolutionHours: 2.0,
      csatScore: 5.0, totalSpendUsd: 149, activeAgents: 3, seatLimit: 5,
      apiCallsThisMonth: 24_911, storageUsedGb: 2, storageLimitGb: 10,
    },
    health: { paymentStatus: 'current', accountStatus: 'active', healthScore: 88, riskLevel: 'low' },
    timeline: [
      { id: 'tl1', type: 'ticket', title: 'Resolved CSR-1036 — Bulk import help', when: ago(2*24*60) },
    ],
  },
];

export function getTenantSupportProfile(tenantId: string) {
  return SUPPORT_PROFILES.find((t) => t.tenantId === tenantId);
}
