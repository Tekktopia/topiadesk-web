/**
 * Super-Admin mock data.
 * Replace with real API calls (admin service) when the backend is ready.
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ago  = (mins: number) => new Date(Date.now() - mins * 60_000).toISOString();
const future = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString();
const past   = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString();

// ─── Types ────────────────────────────────────────────────────────────────────

export type TenantPlan   = 'starter' | 'business' | 'enterprise';
export type TenantStatus = 'active' | 'trialing' | 'suspended' | 'churned';

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  plan: TenantPlan;
  status: TenantStatus;
  mrr: number;
  agentCount: number;
  agentLimit: number | null; // null = unlimited
  ticketsThisMonth: number;
  storageUsedGb: number;
  storageLimitGb: number;
  createdAt: string;
  trialEndsAt?: string;
  lastActiveAt: string;
  owner: { name: string; email: string };
  country: string;
  industry: string;
  channels: string[];
  notes?: string;
}

export interface Plan {
  id: string;
  name: string;
  slug: TenantPlan;
  priceMonthly: number;
  agentLimit: number | null;
  storageLimitGb: number;
  features: string[];
  tenantCount: number;
  mrr: number;
}

export type PlatformUserRole   = 'agent' | 'admin' | 'super_admin';
export type PlatformUserStatus = 'active' | 'inactive' | 'invited';

export interface PlatformUser {
  id: string;
  tenantId: string;
  tenantName: string;
  tenantPlan: TenantPlan;
  name: string;
  email: string;
  role: PlatformUserRole;
  status: PlatformUserStatus;
  lastLoginAt?: string;
  createdAt: string;
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  enabledGlobally: boolean;
  enabledForPlans: TenantPlan[];
  tenantOverrides: { id: string; name: string; enabled: boolean }[];
  rolloutPct: number;
  createdAt: string;
  updatedAt: string;
}

export type ComponentStatus = 'operational' | 'degraded' | 'outage' | 'maintenance';

export interface SystemComponent {
  id: string;
  name: string;
  category: 'api' | 'database' | 'queue' | 'storage' | 'email' | 'cdn' | 'workers';
  status: ComponentStatus;
  uptime30d: number;
  latencyMs?: number;
  lastChecked: string;
  sparkline: number[];
}

export interface SystemIncident {
  id: string;
  title: string;
  component: string;
  severity: 'critical' | 'major' | 'minor';
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  startedAt: string;
  resolvedAt?: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  actorEmail: string;
  action: string;
  targetType: 'tenant' | 'user' | 'plan' | 'feature_flag' | 'system' | 'announcement' | 'security';
  target: string;
  ip: string;
  createdAt: string;
  meta?: Record<string, string>;
}

export type AnnouncementType   = 'info' | 'warning' | 'maintenance' | 'feature';
export type AnnouncementStatus = 'draft' | 'scheduled' | 'published' | 'expired';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  type: AnnouncementType;
  status: AnnouncementStatus;
  targetPlans: TenantPlan[] | 'all';
  createdBy: string;
  createdAt: string;
  scheduledAt?: string;
  publishedAt?: string;
  expiresAt?: string;
}

export type SecuritySeverity = 'critical' | 'high' | 'medium' | 'low';

export interface SecurityEvent {
  id: string;
  type: string;
  severity: SecuritySeverity;
  description: string;
  ip: string;
  actor?: string;
  tenantId?: string;
  tenantName?: string;
  resolved: boolean;
  createdAt: string;
}

export interface RevenuePoint {
  month: string;
  mrr: number;
  newMrr: number;
  churnedMrr: number;
  tenants: number;
}

export interface AdminMetrics {
  totalTenants: number;
  activeTenants: number;
  trialingTenants: number;
  suspendedTenants: number;
  churnedTenants: number;
  totalMrr: number;
  totalArr: number;
  totalUsers: number;
  totalTicketsThisMonth: number;
  newTenantsThisMonth: number;
  churnedThisMonth: number;
  avgRevenuePerAccount: number;
  systemUptime: number;
}

// ─── Tenants ──────────────────────────────────────────────────────────────────

export const mockTenants: Tenant[] = [
  {
    id: 'ten-001', name: 'AcmeBank Nigeria', subdomain: 'acmebank',
    plan: 'enterprise', status: 'active', mrr: 999,
    agentCount: 42, agentLimit: null, ticketsThisMonth: 1840,
    storageUsedGb: 28.4, storageLimitGb: 100,
    createdAt: past(410), lastActiveAt: ago(5),
    owner: { name: 'Emeka Okonkwo', email: 'emeka@acmebank.ng' },
    country: 'Nigeria', industry: 'Banking & Finance',
    channels: ['email', 'whatsapp', 'portal', 'voice'],
    notes: 'Key enterprise account. Quarterly business review scheduled.',
  },
  {
    id: 'ten-002', name: 'KasiPay', subdomain: 'kasipay',
    plan: 'enterprise', status: 'active', mrr: 999,
    agentCount: 38, agentLimit: null, ticketsThisMonth: 1420,
    storageUsedGb: 19.7, storageLimitGb: 100,
    createdAt: past(320), lastActiveAt: ago(12),
    owner: { name: 'Marcus Botha', email: 'marcus@kasi-pay.co.za' },
    country: 'South Africa', industry: 'Fintech',
    channels: ['email', 'whatsapp', 'sms', 'portal'],
  },
  {
    id: 'ten-003', name: 'SafariHold Group', subdomain: 'safarihold',
    plan: 'enterprise', status: 'active', mrr: 999,
    agentCount: 29, agentLimit: null, ticketsThisMonth: 980,
    storageUsedGb: 14.2, storageLimitGb: 100,
    createdAt: past(280), lastActiveAt: ago(8),
    owner: { name: 'Grace Maathai', email: 'grace@safarihold.co.ke' },
    country: 'Kenya', industry: 'Hospitality & Travel',
    channels: ['email', 'portal', 'whatsapp'],
  },
  {
    id: 'ten-004', name: 'NorthField Corporation', subdomain: 'northfield',
    plan: 'business', status: 'active', mrr: 499,
    agentCount: 14, agentLimit: 20, ticketsThisMonth: 542,
    storageUsedGb: 8.1, storageLimitGb: 30,
    createdAt: past(190), lastActiveAt: ago(22),
    owner: { name: 'Aisha Ibrahim', email: 'aisha@northfield.ng' },
    country: 'Nigeria', industry: 'Manufacturing',
    channels: ['email', 'portal'],
  },
  {
    id: 'ten-005', name: 'Zenith Capital Partners', subdomain: 'zenithcap',
    plan: 'business', status: 'active', mrr: 499,
    agentCount: 11, agentLimit: 20, ticketsThisMonth: 389,
    storageUsedGb: 5.9, storageLimitGb: 30,
    createdAt: past(155), lastActiveAt: ago(30),
    owner: { name: 'Kwame Asante', email: 'kwame@zenithcap.gh' },
    country: 'Ghana', industry: 'Asset Management',
    channels: ['email', 'portal'],
  },
  {
    id: 'ten-006', name: 'Cape Commerce Group', subdomain: 'capecommerce',
    plan: 'business', status: 'active', mrr: 499,
    agentCount: 9, agentLimit: 20, ticketsThisMonth: 291,
    storageUsedGb: 4.3, storageLimitGb: 30,
    createdAt: past(120), lastActiveAt: ago(18),
    owner: { name: 'Lerato Dlamini', email: 'lerato@capecommerce.co.za' },
    country: 'South Africa', industry: 'Retail',
    channels: ['email', 'whatsapp', 'portal'],
  },
  {
    id: 'ten-007', name: 'Lagos Electric Distribution', subdomain: 'lagoselectric',
    plan: 'business', status: 'active', mrr: 499,
    agentCount: 16, agentLimit: 20, ticketsThisMonth: 714,
    storageUsedGb: 11.2, storageLimitGb: 30,
    createdAt: past(210), lastActiveAt: ago(6),
    owner: { name: 'Tunde Adeyemi', email: 'tunde@lagoselectric.ng' },
    country: 'Nigeria', industry: 'Utilities',
    channels: ['email', 'sms', 'portal'],
  },
  {
    id: 'ten-008', name: 'Dar Port Authority', subdomain: 'darport',
    plan: 'business', status: 'active', mrr: 499,
    agentCount: 12, agentLimit: 20, ticketsThisMonth: 445,
    storageUsedGb: 7.4, storageLimitGb: 30,
    createdAt: past(98), lastActiveAt: ago(45),
    owner: { name: 'Farida Hassan', email: 'farida@darport.co.tz' },
    country: 'Tanzania', industry: 'Logistics & Ports',
    channels: ['email', 'portal'],
  },
  {
    id: 'ten-009', name: 'FlairTech Solutions', subdomain: 'flairtech',
    plan: 'starter', status: 'active', mrr: 149,
    agentCount: 4, agentLimit: 5, ticketsThisMonth: 128,
    storageUsedGb: 1.8, storageLimitGb: 10,
    createdAt: past(88), lastActiveAt: ago(15),
    owner: { name: 'Joshua Adekunle', email: 'josh@flairtech.ng' },
    country: 'Nigeria', industry: 'Technology',
    channels: ['email', 'portal'],
  },
  {
    id: 'ten-010', name: 'Nairobi Motors', subdomain: 'nairobimotors',
    plan: 'starter', status: 'active', mrr: 149,
    agentCount: 3, agentLimit: 5, ticketsThisMonth: 87,
    storageUsedGb: 0.9, storageLimitGb: 10,
    createdAt: past(65), lastActiveAt: ago(40),
    owner: { name: 'David Mwangi', email: 'david@nairobimotors.co.ke' },
    country: 'Kenya', industry: 'Automotive',
    channels: ['email', 'portal'],
  },
  {
    id: 'ten-011', name: 'AbujaTech Hub', subdomain: 'abujatech',
    plan: 'starter', status: 'active', mrr: 149,
    agentCount: 2, agentLimit: 5, ticketsThisMonth: 54,
    storageUsedGb: 0.6, storageLimitGb: 10,
    createdAt: past(42), lastActiveAt: ago(20),
    owner: { name: 'Blessing Okafor', email: 'blessing@abujatech.ng' },
    country: 'Nigeria', industry: 'Technology',
    channels: ['email'],
  },
  {
    id: 'ten-012', name: 'Kampala Digital Agency', subdomain: 'kampaladigital',
    plan: 'starter', status: 'active', mrr: 149,
    agentCount: 3, agentLimit: 5, ticketsThisMonth: 72,
    storageUsedGb: 0.4, storageLimitGb: 10,
    createdAt: past(55), lastActiveAt: ago(28),
    owner: { name: 'Amina Nakato', email: 'amina@kampaladigital.ug' },
    country: 'Uganda', industry: 'Marketing & Media',
    channels: ['email', 'portal'],
  },
  {
    id: 'ten-013', name: 'DakarLink', subdomain: 'dakarlink',
    plan: 'starter', status: 'trialing', mrr: 0,
    agentCount: 2, agentLimit: 5, ticketsThisMonth: 31,
    storageUsedGb: 0.2, storageLimitGb: 10,
    createdAt: past(10), trialEndsAt: future(4),
    lastActiveAt: ago(120),
    owner: { name: 'Emmanuel Diallo', email: 'emm@dakarlink.sn' },
    country: 'Senegal', industry: 'Telecommunications',
    channels: ['email'],
  },
  {
    id: 'ten-014', name: 'Kumasi Foods Ltd', subdomain: 'kumasifoods',
    plan: 'starter', status: 'churned', mrr: 0,
    agentCount: 0, agentLimit: 5, ticketsThisMonth: 0,
    storageUsedGb: 0, storageLimitGb: 10,
    createdAt: past(180), lastActiveAt: past(30),
    owner: { name: 'Kofi Antwi', email: 'kofi@kumasifoods.gh' },
    country: 'Ghana', industry: 'Food & Beverage',
    channels: [],
  },
  {
    id: 'ten-015', name: 'RedShift Africa', subdomain: 'redshift',
    plan: 'starter', status: 'suspended', mrr: 149,
    agentCount: 0, agentLimit: 5, ticketsThisMonth: 0,
    storageUsedGb: 1.1, storageLimitGb: 10,
    createdAt: past(75), lastActiveAt: past(8),
    owner: { name: 'Olu Martins', email: 'olu@redshift.ng' },
    country: 'Nigeria', industry: 'SaaS',
    channels: ['email'],
    notes: 'Suspended for non-payment. Owner contacted 2025-05-18.',
  },
];

// ─── Plans ────────────────────────────────────────────────────────────────────

export const mockPlans: Plan[] = [
  {
    id: 'plan-starter', name: 'Starter', slug: 'starter', priceMonthly: 149,
    agentLimit: 5, storageLimitGb: 10,
    features: ['Email channel', 'Portal channel', 'Basic reports', 'Knowledge base', '1 automation', '5 GB storage'],
    tenantCount: 7, mrr: 149 * 5, // 5 paying (1 trial, 1 churned)
  },
  {
    id: 'plan-business', name: 'Business', slug: 'business', priceMonthly: 499,
    agentLimit: 20, storageLimitGb: 30,
    features: ['All Starter features', 'WhatsApp & SMS channels', 'Voice channel', 'SLA policies', 'Advanced reports', 'Custom automations', 'Asset management', 'Monitoring & NOC (basic)'],
    tenantCount: 5, mrr: 499 * 5,
  },
  {
    id: 'plan-enterprise', name: 'Enterprise', slug: 'enterprise', priceMonthly: 999,
    agentLimit: null, storageLimitGb: 100,
    features: ['All Business features', 'Unlimited agents', 'Full monitoring & NOC', 'Custom integrations', 'Dedicated support SLA', 'SSO / SAML', 'Audit logs export', 'Custom branding', 'SLA: 99.9% uptime guarantee'],
    tenantCount: 3, mrr: 999 * 3,
  },
];

// ─── Platform Users ───────────────────────────────────────────────────────────

export const mockPlatformUsers: PlatformUser[] = [
  { id: 'pu-001', tenantId: 'ten-001', tenantName: 'AcmeBank Nigeria',     tenantPlan: 'enterprise', name: 'Emeka Okonkwo',    email: 'emeka@acmebank.ng',       role: 'admin',  status: 'active',   lastLoginAt: ago(5),   createdAt: past(410) },
  { id: 'pu-002', tenantId: 'ten-001', tenantName: 'AcmeBank Nigeria',     tenantPlan: 'enterprise', name: 'Sarah Okonkwo',   email: 'sarah.o@acmebank.ng',     role: 'agent',  status: 'active',   lastLoginAt: ago(30),  createdAt: past(400) },
  { id: 'pu-003', tenantId: 'ten-001', tenantName: 'AcmeBank Nigeria',     tenantPlan: 'enterprise', name: 'James Eze',       email: 'james@acmebank.ng',       role: 'agent',  status: 'active',   lastLoginAt: ago(60),  createdAt: past(390) },
  { id: 'pu-004', tenantId: 'ten-002', tenantName: 'KasiPay',              tenantPlan: 'enterprise', name: 'Marcus Botha',    email: 'marcus@kasi-pay.co.za',   role: 'admin',  status: 'active',   lastLoginAt: ago(12),  createdAt: past(320) },
  { id: 'pu-005', tenantId: 'ten-002', tenantName: 'KasiPay',              tenantPlan: 'enterprise', name: 'Lerato Mokoena',  email: 'lerato@kasi-pay.co.za',   role: 'agent',  status: 'active',   lastLoginAt: ago(90),  createdAt: past(310) },
  { id: 'pu-006', tenantId: 'ten-003', tenantName: 'SafariHold Group',     tenantPlan: 'enterprise', name: 'Grace Maathai',   email: 'grace@safarihold.co.ke',  role: 'admin',  status: 'active',   lastLoginAt: ago(8),   createdAt: past(280) },
  { id: 'pu-007', tenantId: 'ten-004', tenantName: 'NorthField Corporation',tenantPlan: 'business',  name: 'Aisha Ibrahim',   email: 'aisha@northfield.ng',     role: 'admin',  status: 'active',   lastLoginAt: ago(22),  createdAt: past(190) },
  { id: 'pu-008', tenantId: 'ten-004', tenantName: 'NorthField Corporation',tenantPlan: 'business',  name: 'Chidi Nwosu',     email: 'chidi@northfield.ng',     role: 'agent',  status: 'active',   lastLoginAt: ago(120), createdAt: past(180) },
  { id: 'pu-009', tenantId: 'ten-005', tenantName: 'Zenith Capital Partners',tenantPlan: 'business', name: 'Kwame Asante',    email: 'kwame@zenithcap.gh',      role: 'admin',  status: 'active',   lastLoginAt: ago(30),  createdAt: past(155) },
  { id: 'pu-010', tenantId: 'ten-009', tenantName: 'FlairTech Solutions',  tenantPlan: 'starter',   name: 'Joshua Adekunle', email: 'josh@flairtech.ng',       role: 'admin',  status: 'active',   lastLoginAt: ago(15),  createdAt: past(88) },
  { id: 'pu-011', tenantId: 'ten-013', tenantName: 'DakarLink',            tenantPlan: 'starter',   name: 'Emmanuel Diallo', email: 'emm@dakarlink.sn',        role: 'admin',  status: 'active',   lastLoginAt: ago(120), createdAt: past(10) },
  { id: 'pu-012', tenantId: 'ten-013', tenantName: 'DakarLink',            tenantPlan: 'starter',   name: 'Fatou Sow',       email: 'fatou@dakarlink.sn',      role: 'agent',  status: 'invited',  createdAt: past(10) },
  { id: 'sa-001', tenantId: '',        tenantName: '—',                    tenantPlan: 'enterprise', name: 'Daniel Oshinubi', email: 'daniel@topiadesk.com',    role: 'super_admin', status: 'active', lastLoginAt: ago(2), createdAt: past(500) },
  { id: 'sa-002', tenantId: '',        tenantName: '—',                    tenantPlan: 'enterprise', name: 'Admin Ops',       email: 'ops@topiadesk.com',       role: 'super_admin', status: 'active', lastLoginAt: ago(300), createdAt: past(480) },
];

// ─── Feature Flags ────────────────────────────────────────────────────────────

export const mockFeatureFlags: FeatureFlag[] = [
  {
    id: 'ff-001', key: 'whatsapp_channel', name: 'WhatsApp Channel',
    description: 'Enables WhatsApp as an inbound/outbound channel via the WhatsApp Business API.',
    enabledGlobally: false, enabledForPlans: ['business', 'enterprise'],
    tenantOverrides: [{ id: 'ten-009', name: 'FlairTech Solutions', enabled: true }],
    rolloutPct: 100, createdAt: past(180), updatedAt: past(30),
  },
  {
    id: 'ff-002', key: 'monitoring_noc', name: 'Monitoring & NOC',
    description: 'Full NOC dashboard, device monitoring, topology view and alert rules.',
    enabledGlobally: false, enabledForPlans: ['enterprise'],
    tenantOverrides: [{ id: 'ten-004', name: 'NorthField Corporation', enabled: true }],
    rolloutPct: 100, createdAt: past(160), updatedAt: past(14),
  },
  {
    id: 'ff-003', key: 'ai_suggestions', name: 'AI Reply Suggestions',
    description: 'GPT-powered suggested replies and ticket summaries in the agent workspace.',
    enabledGlobally: false, enabledForPlans: [],
    tenantOverrides: [
      { id: 'ten-001', name: 'AcmeBank Nigeria', enabled: true },
      { id: 'ten-002', name: 'KasiPay', enabled: true },
    ],
    rolloutPct: 20, createdAt: past(45), updatedAt: past(7),
  },
  {
    id: 'ff-004', key: 'custom_branding', name: 'Custom Branding',
    description: 'Allows tenants to upload a logo, set brand colours, and customise the portal domain.',
    enabledGlobally: false, enabledForPlans: ['enterprise'],
    tenantOverrides: [],
    rolloutPct: 100, createdAt: past(200), updatedAt: past(60),
  },
  {
    id: 'ff-005', key: 'sso_saml', name: 'SSO / SAML',
    description: 'Single Sign-On via SAML 2.0 or OIDC. Requires enterprise configuration.',
    enabledGlobally: false, enabledForPlans: ['enterprise'],
    tenantOverrides: [],
    rolloutPct: 100, createdAt: past(150), updatedAt: past(45),
  },
  {
    id: 'ff-006', key: 'voice_channel', name: 'Voice Channel',
    description: 'Softphone integration for inbound/outbound voice via Twilio.',
    enabledGlobally: false, enabledForPlans: ['business', 'enterprise'],
    tenantOverrides: [],
    rolloutPct: 100, createdAt: past(130), updatedAt: past(20),
  },
  {
    id: 'ff-007', key: 'asset_management', name: 'Asset Management',
    description: 'Full ITAM module: asset inventory, lifecycle, warranty alerts, audits.',
    enabledGlobally: false, enabledForPlans: ['business', 'enterprise'],
    tenantOverrides: [],
    rolloutPct: 100, createdAt: past(120), updatedAt: past(10),
  },
  {
    id: 'ff-008', key: 'audit_log_export', name: 'Audit Log Export',
    description: 'Allows tenant admins to export full audit logs as CSV.',
    enabledGlobally: false, enabledForPlans: ['enterprise'],
    tenantOverrides: [],
    rolloutPct: 100, createdAt: past(90), updatedAt: past(5),
  },
  {
    id: 'ff-009', key: 'new_ticket_ui', name: 'New Ticket UI (Beta)',
    description: 'Redesigned ticket detail view with split-panel layout and inline editing.',
    enabledGlobally: false, enabledForPlans: [],
    tenantOverrides: [
      { id: 'ten-001', name: 'AcmeBank Nigeria', enabled: true },
      { id: 'ten-009', name: 'FlairTech Solutions', enabled: true },
    ],
    rolloutPct: 0, createdAt: past(14), updatedAt: past(2),
  },
  {
    id: 'ff-010', key: 'customer_portal', name: 'Customer Self-Service Portal',
    description: 'Public-facing portal where customers can submit tickets and track status.',
    enabledGlobally: true, enabledForPlans: ['starter', 'business', 'enterprise'],
    tenantOverrides: [],
    rolloutPct: 100, createdAt: past(300), updatedAt: past(60),
  },
];

// ─── System Health ────────────────────────────────────────────────────────────

const spk = (arr: number[]) => arr;

export const mockSystemComponents: SystemComponent[] = [
  { id: 'sc-001', name: 'REST API',              category: 'api',      status: 'operational', uptime30d: 99.98, latencyMs: 48,  lastChecked: ago(1),  sparkline: spk([45,42,48,50,47,49,48,51,46,48,48,48]) },
  { id: 'sc-002', name: 'WebSocket Gateway',     category: 'api',      status: 'operational', uptime30d: 99.95, latencyMs: 12,  lastChecked: ago(1),  sparkline: spk([10,11,12,12,13,11,12,12,12,11,12,12]) },
  { id: 'sc-003', name: 'Primary Database (PG)', category: 'database', status: 'operational', uptime30d: 99.99, latencyMs: 4,   lastChecked: ago(1),  sparkline: spk([3,4,4,5,4,4,4,4,3,4,4,4]) },
  { id: 'sc-004', name: 'Read Replica (PG)',     category: 'database', status: 'operational', uptime30d: 99.97, latencyMs: 6,   lastChecked: ago(1),  sparkline: spk([5,5,6,6,7,6,6,6,5,6,6,6]) },
  { id: 'sc-005', name: 'Redis Cache',           category: 'database', status: 'operational', uptime30d: 100,   latencyMs: 1,   lastChecked: ago(1),  sparkline: spk([1,1,1,1,1,1,1,1,1,1,1,1]) },
  { id: 'sc-006', name: 'Job Queue (BullMQ)',    category: 'queue',    status: 'degraded',    uptime30d: 99.3,  latencyMs: 820, lastChecked: ago(3),  sparkline: spk([120,140,160,200,380,550,700,820,820,820,820,820]) },
  { id: 'sc-007', name: 'Object Storage (S3)',   category: 'storage',  status: 'operational', uptime30d: 99.99,                 lastChecked: ago(2),  sparkline: spk([]) },
  { id: 'sc-008', name: 'Email Delivery (SES)',  category: 'email',    status: 'operational', uptime30d: 99.85, lastChecked: ago(2),  sparkline: spk([]) },
  { id: 'sc-009', name: 'CDN / Edge (CloudFront)',category:'cdn',      status: 'operational', uptime30d: 100,   latencyMs: 18,  lastChecked: ago(1),  sparkline: spk([16,17,18,18,19,18,17,18,18,18,18,18]) },
  { id: 'sc-010', name: 'Background Workers',   category: 'workers',  status: 'degraded',    uptime30d: 99.4,  lastChecked: ago(3),  sparkline: spk([]) },
  { id: 'sc-011', name: 'WhatsApp Gateway',      category: 'api',      status: 'operational', uptime30d: 99.7,  latencyMs: 95,  lastChecked: ago(2),  sparkline: spk([80,85,90,95,100,95,90,95,95,95,95,95]) },
  { id: 'sc-012', name: 'Auth Service (JWT)',    category: 'api',      status: 'operational', uptime30d: 100,   latencyMs: 22,  lastChecked: ago(1),  sparkline: spk([20,21,22,23,22,22,21,22,22,22,22,22]) },
];

export const mockSystemIncidents: SystemIncident[] = [
  {
    id: 'si-001', title: 'BullMQ job queue elevated latency',
    component: 'Job Queue (BullMQ)', severity: 'major', status: 'investigating',
    startedAt: ago(45),
  },
  {
    id: 'si-002', title: 'Background workers processing delay',
    component: 'Background Workers', severity: 'major', status: 'identified',
    startedAt: ago(45),
  },
  {
    id: 'si-003', title: 'Email delivery rate dip — SES throttling',
    component: 'Email Delivery (SES)', severity: 'minor', status: 'resolved',
    startedAt: past(3), resolvedAt: past(2),
  },
];

// ─── Audit Logs ───────────────────────────────────────────────────────────────

export const mockAuditLogs: AuditLog[] = [
  { id: 'al-001', actor: 'Daniel Oshinubi', actorEmail: 'daniel@topiadesk.com', action: 'tenant.suspended',       targetType: 'tenant',       target: 'RedShift Africa',            ip: '41.58.20.14',  createdAt: past(8),   meta: { reason: 'Non-payment after 14-day grace period' } },
  { id: 'al-002', actor: 'Daniel Oshinubi', actorEmail: 'daniel@topiadesk.com', action: 'feature_flag.updated',   targetType: 'feature_flag', target: 'AI Reply Suggestions',        ip: '41.58.20.14',  createdAt: past(7) },
  { id: 'al-003', actor: 'Daniel Oshinubi', actorEmail: 'daniel@topiadesk.com', action: 'tenant.created',         targetType: 'tenant',       target: 'DakarLink',                   ip: '41.58.20.14',  createdAt: past(10) },
  { id: 'al-004', actor: 'Admin Ops',       actorEmail: 'ops@topiadesk.com',    action: 'announcement.published', targetType: 'announcement', target: 'Scheduled Maintenance May 30',ip: '197.149.80.22', createdAt: past(4) },
  { id: 'al-005', actor: 'Daniel Oshinubi', actorEmail: 'daniel@topiadesk.com', action: 'plan.updated',           targetType: 'plan',         target: 'Business plan — agent limit', ip: '41.58.20.14',  createdAt: past(14) },
  { id: 'al-006', actor: 'Daniel Oshinubi', actorEmail: 'daniel@topiadesk.com', action: 'tenant.impersonated',    targetType: 'tenant',       target: 'NorthField Corporation',      ip: '41.58.20.14',  createdAt: past(6),  meta: { reason: 'Support request #2041' } },
  { id: 'al-007', actor: 'Admin Ops',       actorEmail: 'ops@topiadesk.com',    action: 'user.deactivated',       targetType: 'user',         target: 'kofi@kumasifoods.gh',         ip: '197.149.80.22', createdAt: past(30) },
  { id: 'al-008', actor: 'Daniel Oshinubi', actorEmail: 'daniel@topiadesk.com', action: 'feature_flag.created',   targetType: 'feature_flag', target: 'New Ticket UI (Beta)',         ip: '41.58.20.14',  createdAt: past(14) },
  { id: 'al-009', actor: 'Daniel Oshinubi', actorEmail: 'daniel@topiadesk.com', action: 'tenant.plan_changed',    targetType: 'tenant',       target: 'NorthField → Business',       ip: '41.58.20.14',  createdAt: past(20) },
  { id: 'al-010', actor: 'Admin Ops',       actorEmail: 'ops@topiadesk.com',    action: 'security.ip_blocked',    targetType: 'security',     target: '102.89.45.200',               ip: '197.149.80.22', createdAt: past(2) },
  { id: 'al-011', actor: 'Daniel Oshinubi', actorEmail: 'daniel@topiadesk.com', action: 'announcement.created',   targetType: 'announcement', target: 'Q2 Platform Update',          ip: '41.58.20.14',  createdAt: ago(180) },
  { id: 'al-012', actor: 'Admin Ops',       actorEmail: 'ops@topiadesk.com',    action: 'tenant.notes_updated',   targetType: 'tenant',       target: 'RedShift Africa',             ip: '197.149.80.22', createdAt: past(8) },
];

// ─── Announcements ────────────────────────────────────────────────────────────

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-001', title: 'Scheduled Maintenance — May 30, 02:00–04:00 WAT',
    body: 'We will be performing database maintenance on May 30 between 02:00 and 04:00 WAT. The platform will be in read-only mode during this window. Ticket submission will be temporarily unavailable.',
    type: 'maintenance', status: 'published',
    targetPlans: 'all', createdBy: 'Admin Ops',
    createdAt: past(4), publishedAt: past(4), expiresAt: future(4),
  },
  {
    id: 'ann-002', title: 'New Feature: AI Reply Suggestions (Early Access)',
    body: 'We\'re rolling out AI-powered reply suggestions to select Enterprise accounts. Agents will see suggested replies based on ticket context and your knowledge base. Reach out to your CSM to join the early access programme.',
    type: 'feature', status: 'published',
    targetPlans: ['enterprise'], createdBy: 'Daniel Oshinubi',
    createdAt: past(14), publishedAt: past(14), expiresAt: future(30),
  },
  {
    id: 'ann-003', title: 'Q2 Platform Update — What\'s New',
    body: 'Q2 2025 brings the full Monitoring & NOC module, WhatsApp Business API v3 support, bulk ticket actions, and a redesigned asset dashboard. Full release notes are available in the help centre.',
    type: 'info', status: 'published',
    targetPlans: 'all', createdBy: 'Daniel Oshinubi',
    createdAt: ago(180), publishedAt: ago(180), expiresAt: future(60),
  },
  {
    id: 'ann-004', title: 'Critical Security Patch — Action Required',
    body: 'We have released a critical security patch (v3.8.1). All tenant admins using SSO/SAML must rotate their signing certificates before June 1. Detailed instructions have been emailed to account owners.',
    type: 'warning', status: 'scheduled',
    targetPlans: ['enterprise'], createdBy: 'Daniel Oshinubi',
    createdAt: ago(60), scheduledAt: future(2),
  },
  {
    id: 'ann-005', title: 'Legacy SMS Gateway Deprecation',
    body: 'The legacy Twilio SMS gateway integration will be deprecated on July 1, 2025. All tenants using SMS should migrate to the new gateway via Settings > Channels before this date.',
    type: 'warning', status: 'draft',
    targetPlans: ['business', 'enterprise'], createdBy: 'Admin Ops',
    createdAt: ago(30),
  },
];

// ─── Security Events ──────────────────────────────────────────────────────────

export const mockSecurityEvents: SecurityEvent[] = [
  { id: 'se-001', type: 'brute_force',       severity: 'high',     description: '47 failed login attempts from single IP against acmebank tenant.',         ip: '102.89.45.200', tenantId: 'ten-001', tenantName: 'AcmeBank Nigeria',      resolved: false, createdAt: past(2) },
  { id: 'se-002', type: 'ip_blocked',        severity: 'medium',   description: 'IP 102.89.45.200 automatically blocked after exceeding threshold.',          ip: '102.89.45.200', resolved: true,  createdAt: past(2) },
  { id: 'se-003', type: 'suspicious_login',  severity: 'medium',   description: 'Login from new country (France) for emeka@acmebank.ng.',                    ip: '185.220.101.45',actor: 'emeka@acmebank.ng', tenantId: 'ten-001', tenantName: 'AcmeBank Nigeria', resolved: false, createdAt: past(3) },
  { id: 'se-004', type: 'api_abuse',         severity: 'high',     description: '8,200 API requests in 60 seconds from tenant ten-015 (suspended).',         ip: '197.210.65.88',  tenantId: 'ten-015', tenantName: 'RedShift Africa',       resolved: true,  createdAt: past(8) },
  { id: 'se-005', type: 'failed_login',      severity: 'low',      description: '12 consecutive failed login attempts for ops@topiadesk.com (super admin).',  ip: '41.58.99.12',   actor: 'ops@topiadesk.com', resolved: true, createdAt: past(12) },
  { id: 'se-006', type: 'data_export',       severity: 'medium',   description: 'Large data export (42,000 records) by admin user at KasiPay.',              ip: '196.201.214.30', actor: 'marcus@kasi-pay.co.za', tenantId: 'ten-002', tenantName: 'KasiPay', resolved: false, createdAt: past(1) },
  { id: 'se-007', type: 'token_reuse',       severity: 'critical', description: 'Expired JWT reuse attempt detected — possible token theft.',                 ip: '154.68.20.5',   resolved: true,  createdAt: past(5) },
  { id: 'se-008', type: 'mfa_bypass',        severity: 'critical', description: 'MFA bypass attempt on super admin account daniel@topiadesk.com.',            ip: '45.33.90.120',  actor: 'daniel@topiadesk.com', resolved: true, createdAt: past(6) },
];

// ─── Revenue Trend ────────────────────────────────────────────────────────────

export const mockRevenueTrend: RevenuePoint[] = [
  { month: 'Nov', mrr: 2480,  newMrr: 499,  churnedMrr: 0,   tenants: 7 },
  { month: 'Dec', mrr: 3120,  newMrr: 999,  churnedMrr: 149, tenants: 9 },
  { month: 'Jan', mrr: 3820,  newMrr: 849,  churnedMrr: 0,   tenants: 11 },
  { month: 'Feb', mrr: 4480,  newMrr: 998,  churnedMrr: 149, tenants: 12 },
  { month: 'Mar', mrr: 5140,  newMrr: 999,  churnedMrr: 0,   tenants: 13 },
  { month: 'Apr', mrr: 5788,  newMrr: 648,  churnedMrr: 0,   tenants: 14 },
  { month: 'May', mrr: 6386,  newMrr: 747,  churnedMrr: 149, tenants: 15 },
];

// ─── Admin Metrics ────────────────────────────────────────────────────────────

export const mockAdminMetrics: AdminMetrics = {
  totalTenants: 15,
  activeTenants: 12,
  trialingTenants: 1,
  suspendedTenants: 1,
  churnedTenants: 1,
  totalMrr: 6386,
  totalArr: 6386 * 12,
  totalUsers: 234,
  totalTicketsThisMonth: 6573,
  newTenantsThisMonth: 2,
  churnedThisMonth: 1,
  avgRevenuePerAccount: Math.round(6386 / 13),
  systemUptime: 99.82,
};
