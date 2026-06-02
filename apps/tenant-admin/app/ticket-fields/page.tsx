'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertOctagon,
  Boxes,
  Building2,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Edit3,
  FileSignature,
  Flag,
  GripVertical,
  Hash,
  Inbox,
  Key,
  Layers,
  Plus,
  Save,
  ShieldCheck,
  Sliders,
  Tag,
  Trash2,
  Users,
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

// ─── Types ───────────────────────────────────────────────────────────────────

interface Subcategory {
  id: string;
  name: string;
  default?: boolean;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  active: boolean;
  requireSubcategory: boolean;
  subcategories: Subcategory[];
}

interface CustomerIdField {
  id: string;
  label: string;
  placeholder: string;
  /** Regex the agent's input must match. Empty = any value. */
  pattern?: string;
  required: boolean;
  active: boolean;
  example?: string;
}

const CAT_COLORS = [
  '#2563eb',
  '#7c3aed',
  '#0891b2',
  '#059669',
  '#d97706',
  '#dc2626',
  '#475569',
  '#9333ea',
];

// ─── Default seed ────────────────────────────────────────────────────────────

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-support',
    name: 'Support',
    description: 'General troubleshooting & how-to questions',
    color: '#2563eb',
    active: true,
    requireSubcategory: true,
    subcategories: [
      { id: 'sub-support-acct', name: 'Account access', default: true },
      { id: 'sub-support-pwd', name: 'Password reset' },
      { id: 'sub-support-perm', name: 'Permissions' },
      { id: 'sub-support-bug', name: 'Software bug / defect' },
    ],
  },
  {
    id: 'cat-maint',
    name: 'Maintenance',
    description: 'Scheduled or preventive maintenance work',
    color: '#0891b2',
    active: true,
    requireSubcategory: true,
    subcategories: [
      { id: 'sub-maint-server', name: 'Server maintenance' },
      { id: 'sub-maint-network', name: 'Network maintenance' },
      { id: 'sub-maint-patch', name: 'OS / patching' },
      { id: 'sub-maint-printer', name: 'Printer / device' },
    ],
  },
  {
    id: 'cat-inquiry',
    name: 'Inquiry',
    description: 'General customer questions',
    color: '#059669',
    active: true,
    requireSubcategory: false,
    subcategories: [],
  },
  {
    id: 'cat-rfi',
    name: 'Request for information',
    description: 'Customer requesting documentation or details',
    color: '#7c3aed',
    active: true,
    requireSubcategory: true,
    subcategories: [
      { id: 'sub-rfi-pricing', name: 'Pricing / quote' },
      { id: 'sub-rfi-docs', name: 'Documentation' },
      { id: 'sub-rfi-cert', name: 'Certifications / compliance' },
    ],
  },
  {
    id: 'cat-new-item',
    name: 'New item request',
    description: 'Provision a new device, account or license',
    color: '#d97706',
    active: true,
    requireSubcategory: true,
    subcategories: [
      { id: 'sub-new-laptop', name: 'Laptop / workstation' },
      { id: 'sub-new-mobile', name: 'Mobile / SIM' },
      { id: 'sub-new-licence', name: 'Software licence' },
      { id: 'sub-new-account', name: 'User account' },
    ],
  },
  {
    id: 'cat-new-solution',
    name: 'New solution request',
    description: 'Customer wants a new feature or integration',
    color: '#9333ea',
    active: true,
    requireSubcategory: false,
    subcategories: [
      { id: 'sub-sol-integration', name: 'Integration' },
      { id: 'sub-sol-feature', name: 'Feature request' },
      { id: 'sub-sol-customisation', name: 'Customisation' },
    ],
  },
  {
    id: 'cat-incident',
    name: 'Incident',
    description: 'Outage or production-impacting event',
    color: '#dc2626',
    active: true,
    requireSubcategory: true,
    subcategories: [
      { id: 'sub-inc-outage', name: 'Service outage' },
      { id: 'sub-inc-degraded', name: 'Degraded performance' },
      { id: 'sub-inc-security', name: 'Security incident' },
    ],
  },
];

const DEFAULT_CUSTOMER_IDS: CustomerIdField[] = [
  {
    id: 'cust-org',
    label: 'Company / Account ID',
    placeholder: 'ACME-001',
    pattern: '^[A-Z]{2,5}-[0-9]{3,6}$',
    required: true,
    active: true,
    example: 'ACME-001, ZB-1024',
  },
  {
    id: 'cust-contract',
    label: 'Contract number',
    placeholder: 'CT-2026-00123',
    pattern: '^CT-\\d{4}-\\d{5}$',
    required: false,
    active: true,
    example: 'CT-2026-00123',
  },
  {
    id: 'cust-asset',
    label: 'Asset tag',
    placeholder: 'AT-00000',
    pattern: '^AT-\\d{5,8}$',
    required: false,
    active: true,
    example: 'AT-00042',
  },
  {
    id: 'cust-site',
    label: 'Site / branch code',
    placeholder: 'LOS-HQ',
    required: false,
    active: false,
    example: 'LOS-HQ, IKJ-BR, NBO-OFC',
  },
];

// ─── Status / Priority / Group / Resolution-reason picklists ────────────────

interface PicklistItem {
  id: string;
  name: string;
  color: string;
  description?: string;
  active: boolean;
  /** For statuses, this controls SLA pause / closure semantics */
  semantics?: 'open' | 'pending' | 'resolved' | 'closed';
  /** For priorities, this is the sort weight (1 = lowest, higher = more urgent) */
  weight?: number;
  /** For groups, the agent IDs assigned (display only) */
  memberCount?: number;
  isDefault?: boolean;
}

const DEFAULT_STATUSES: PicklistItem[] = [
  {
    id: 'st-new',
    name: 'New',
    color: '#2563eb',
    semantics: 'open',
    active: true,
    isDefault: true,
    description: 'Just created, awaiting triage',
  },
  {
    id: 'st-open',
    name: 'Open',
    color: '#0891b2',
    semantics: 'open',
    active: true,
    description: 'Being actively worked on',
  },
  {
    id: 'st-in-progress',
    name: 'In progress',
    color: '#7c3aed',
    semantics: 'open',
    active: true,
    description: 'Agent is investigating / fixing',
  },
  {
    id: 'st-pending',
    name: 'Pending',
    color: '#d97706',
    semantics: 'pending',
    active: true,
    description: 'Waiting on customer or third party — pauses SLA',
  },
  {
    id: 'st-resolved',
    name: 'Resolved',
    color: '#059669',
    semantics: 'resolved',
    active: true,
    description: 'Fix delivered, awaiting customer confirmation',
  },
  {
    id: 'st-closed',
    name: 'Closed',
    color: '#64748b',
    semantics: 'closed',
    active: true,
    description: 'Confirmed closed — no further action',
  },
];

const DEFAULT_PRIORITIES: PicklistItem[] = [
  {
    id: 'pr-low',
    name: 'Low',
    color: '#64748b',
    weight: 1,
    active: true,
    description: 'Cosmetic / nice-to-have',
  },
  {
    id: 'pr-medium',
    name: 'Medium',
    color: '#2563eb',
    weight: 2,
    active: true,
    isDefault: true,
    description: 'Standard issue',
  },
  {
    id: 'pr-high',
    name: 'High',
    color: '#d97706',
    weight: 3,
    active: true,
    description: 'Significant impact on user',
  },
  {
    id: 'pr-urgent',
    name: 'Urgent',
    color: '#dc2626',
    weight: 4,
    active: true,
    description: 'Production-impacting / VIP',
  },
];

const DEFAULT_GROUPS: PicklistItem[] = [
  {
    id: 'gr-t1',
    name: 'Tier 1 Support',
    color: '#2563eb',
    memberCount: 12,
    active: true,
    isDefault: true,
  },
  { id: 'gr-t2', name: 'Tier 2 Support', color: '#7c3aed', memberCount: 6, active: true },
  { id: 'gr-field', name: 'Field Support', color: '#0891b2', memberCount: 4, active: true },
  { id: 'gr-itops', name: 'IT Operations', color: '#059669', memberCount: 8, active: true },
  { id: 'gr-security', name: 'Security Ops', color: '#dc2626', memberCount: 3, active: true },
  { id: 'gr-billing', name: 'Billing', color: '#d97706', memberCount: 2, active: true },
  { id: 'gr-iam', name: 'Identity & Access', color: '#9333ea', memberCount: 3, active: true },
];

const DEFAULT_RESOLUTIONS: PicklistItem[] = [
  {
    id: 'rr-fixed',
    name: 'Fixed',
    color: '#059669',
    active: true,
    isDefault: true,
    description: 'Issue resolved by an agent',
  },
  {
    id: 'rr-workaround',
    name: 'Workaround provided',
    color: '#0891b2',
    active: true,
    description: 'Temporary fix while a permanent solution is built',
  },
  {
    id: 'rr-self-resolved',
    name: 'Self-resolved',
    color: '#2563eb',
    active: true,
    description: 'Customer found the answer themselves',
  },
  {
    id: 'rr-duplicate',
    name: 'Duplicate',
    color: '#64748b',
    active: true,
    description: 'Merged into another ticket',
  },
  {
    id: 'rr-no-response',
    name: 'Closed — no response',
    color: '#94a3b8',
    active: true,
    description: 'Customer never replied after follow-up',
  },
  {
    id: 'rr-not-an-issue',
    name: 'Not an issue',
    color: '#475569',
    active: true,
    description: 'Working as designed',
  },
  {
    id: 'rr-wont-fix',
    name: "Won't fix",
    color: '#7c3aed',
    active: true,
    description: 'Out of scope or by design',
  },
];

// ─── Cascading taxonomy (Asset type → Brand → Model) ─────────────────────────
// Same pattern works for any 3-level dropdown the tenant admin wants to model.

interface CascadeLeaf {
  id: string;
  name: string;
  /** Optional metadata — for asset models you might keep specs here */
  meta?: string;
}

interface CascadeMid {
  id: string;
  name: string;
  children: CascadeLeaf[];
}

interface CascadeNode {
  id: string;
  name: string;
  description?: string;
  color: string;
  active: boolean;
  /** Whether agents must pick a level-2 value */
  requireMid: boolean;
  /** Whether agents must pick a level-3 value */
  requireLeaf: boolean;
  children: CascadeMid[];
}

const ASSET_TAXONOMY: CascadeNode[] = [
  {
    id: 'at-laptop',
    name: 'Laptop',
    description: 'Portable computer',
    color: '#2563eb',
    active: true,
    requireMid: true,
    requireLeaf: false,
    children: [
      {
        id: 'b-dell',
        name: 'Dell',
        children: [
          { id: 'm-latitude-5420', name: 'Latitude 5420', meta: 'i7 / 16 GB / 512 GB' },
          { id: 'm-latitude-7440', name: 'Latitude 7440', meta: 'i7 / 32 GB / 1 TB' },
          { id: 'm-xps-13', name: 'XPS 13' },
        ],
      },
      {
        id: 'b-hp',
        name: 'HP',
        children: [
          { id: 'm-elitebook-840', name: 'EliteBook 840 G10' },
          { id: 'm-probook-450', name: 'ProBook 450 G9' },
        ],
      },
      {
        id: 'b-lenovo',
        name: 'Lenovo',
        children: [
          { id: 'm-thinkpad-x1', name: 'ThinkPad X1 Carbon' },
          { id: 'm-thinkpad-t14', name: 'ThinkPad T14' },
        ],
      },
      {
        id: 'b-apple-mb',
        name: 'Apple',
        children: [
          { id: 'm-mbp-14', name: 'MacBook Pro 14" M3' },
          { id: 'm-mba-15', name: 'MacBook Air 15" M2' },
        ],
      },
    ],
  },
  {
    id: 'at-desktop',
    name: 'Desktop',
    color: '#7c3aed',
    active: true,
    requireMid: true,
    requireLeaf: false,
    children: [
      {
        id: 'b-dell-d',
        name: 'Dell',
        children: [
          { id: 'm-optiplex-7000', name: 'OptiPlex 7000' },
          { id: 'm-precision-3680', name: 'Precision 3680 Tower' },
        ],
      },
      {
        id: 'b-hp-d',
        name: 'HP',
        children: [{ id: 'm-elite-tower-800', name: 'Elite Tower 800 G9' }],
      },
    ],
  },
  {
    id: 'at-phone',
    name: 'Mobile phone',
    color: '#0891b2',
    active: true,
    requireMid: true,
    requireLeaf: false,
    children: [
      {
        id: 'b-iphone',
        name: 'Apple iPhone',
        children: [
          { id: 'm-ip-15-pro', name: 'iPhone 15 Pro' },
          { id: 'm-ip-14', name: 'iPhone 14' },
        ],
      },
      {
        id: 'b-samsung',
        name: 'Samsung Galaxy',
        children: [
          { id: 'm-s24', name: 'Galaxy S24' },
          { id: 'm-s23', name: 'Galaxy S23' },
          { id: 'm-a54', name: 'Galaxy A54' },
        ],
      },
    ],
  },
  {
    id: 'at-cctv',
    name: 'CCTV camera',
    color: '#059669',
    active: true,
    requireMid: true,
    requireLeaf: true,
    children: [
      {
        id: 'b-hik',
        name: 'Hikvision',
        children: [
          { id: 'm-ds-2cd2143', name: 'DS-2CD2143G2 (4 MP dome)' },
          { id: 'm-ds-2cd2683', name: 'DS-2CD2683G2 (8 MP bullet)' },
        ],
      },
      { id: 'b-dahua', name: 'Dahua', children: [{ id: 'm-ipc-hfw-4439', name: 'IPC-HFW4439T1' }] },
      { id: 'b-axis', name: 'Axis', children: [{ id: 'm-m3215', name: 'M3215-LVE' }] },
    ],
  },
  {
    id: 'at-server',
    name: 'Server',
    color: '#dc2626',
    active: true,
    requireMid: true,
    requireLeaf: true,
    children: [
      {
        id: 'b-dell-s',
        name: 'Dell PowerEdge',
        children: [
          { id: 'm-r750', name: 'R750xs (2U rack)' },
          { id: 'm-r650', name: 'R650 (1U rack)' },
        ],
      },
      { id: 'b-hpe', name: 'HPE ProLiant', children: [{ id: 'm-dl380-g11', name: 'DL380 Gen11' }] },
    ],
  },
  {
    id: 'at-switch',
    name: 'Network switch',
    color: '#9333ea',
    active: true,
    requireMid: true,
    requireLeaf: false,
    children: [
      {
        id: 'b-cisco',
        name: 'Cisco Catalyst',
        children: [
          { id: 'm-9300-48', name: 'C9300-48P' },
          { id: 'm-9200l', name: 'C9200L-48T' },
        ],
      },
      { id: 'b-aruba', name: 'Aruba', children: [{ id: 'm-cx-6300', name: 'CX 6300M-48G' }] },
      {
        id: 'b-mikrotik',
        name: 'MikroTik',
        children: [{ id: 'm-crs328', name: 'CRS328-24P-4S+RM' }],
      },
    ],
  },
  {
    id: 'at-printer',
    name: 'Printer',
    color: '#d97706',
    active: true,
    requireMid: false,
    requireLeaf: false,
    children: [
      { id: 'b-canon', name: 'Canon', children: [] },
      { id: 'b-hp-p', name: 'HP', children: [] },
      { id: 'b-epson', name: 'Epson', children: [] },
    ],
  },
  {
    id: 'at-other',
    name: 'Other / Accessory',
    color: '#64748b',
    active: true,
    requireMid: false,
    requireLeaf: false,
    children: [],
  },
];

// ─── Channels / sources (where tickets come from) ────────────────────────────
const DEFAULT_CHANNELS: PicklistItem[] = [
  {
    id: 'ch-email',
    name: 'Email',
    color: '#2563eb',
    active: true,
    isDefault: true,
    description: 'Inbound mailbox',
  },
  {
    id: 'ch-portal',
    name: 'Web portal',
    color: '#7c3aed',
    active: true,
    description: 'Customer self-service portal',
  },
  {
    id: 'ch-chat',
    name: 'Live chat',
    color: '#059669',
    active: true,
    description: 'Widget on your website',
  },
  {
    id: 'ch-whatsapp',
    name: 'WhatsApp',
    color: '#25d366',
    active: true,
    description: 'WhatsApp Business API',
  },
  {
    id: 'ch-phone',
    name: 'Phone',
    color: '#d97706',
    active: true,
    description: 'Inbound voice call',
  },
  {
    id: 'ch-walk-in',
    name: 'Walk-in',
    color: '#64748b',
    active: true,
    description: 'Customer visited a branch',
  },
  {
    id: 'ch-sms',
    name: 'SMS',
    color: '#0891b2',
    active: false,
    description: 'SMS gateway (off by default)',
  },
];

// ─── Asset lifecycle picklists ───────────────────────────────────────────────
const DEFAULT_ASSET_STATUSES: PicklistItem[] = [
  {
    id: 'as-in-stock',
    name: 'In stock',
    color: '#2563eb',
    active: true,
    isDefault: true,
    description: 'Held in IT store, not yet deployed',
  },
  {
    id: 'as-deployed',
    name: 'Deployed',
    color: '#059669',
    active: true,
    description: 'Assigned to a user / site',
  },
  {
    id: 'as-repair',
    name: 'In repair',
    color: '#d97706',
    active: true,
    description: 'Out for service or RMA',
  },
  {
    id: 'as-retired',
    name: 'Retired',
    color: '#64748b',
    active: true,
    description: 'End-of-life, decommissioned',
  },
  {
    id: 'as-lost',
    name: 'Lost / stolen',
    color: '#dc2626',
    active: true,
    description: 'Reported missing — security flag',
  },
  {
    id: 'as-disposed',
    name: 'Disposed',
    color: '#475569',
    active: true,
    description: 'Wiped and recycled / sold',
  },
];

const DEFAULT_ASSET_CONDITIONS: PicklistItem[] = [
  {
    id: 'co-new',
    name: 'New',
    color: '#059669',
    active: true,
    isDefault: true,
    description: 'Sealed / first deployment',
  },
  {
    id: 'co-good',
    name: 'Good',
    color: '#2563eb',
    active: true,
    description: 'Minor wear, fully functional',
  },
  {
    id: 'co-fair',
    name: 'Fair',
    color: '#d97706',
    active: true,
    description: 'Visible wear, all functions working',
  },
  {
    id: 'co-poor',
    name: 'Poor',
    color: '#dc2626',
    active: true,
    description: 'Major wear, degraded performance',
  },
  {
    id: 'co-damaged',
    name: 'Damaged',
    color: '#7f1d1d',
    active: true,
    description: 'Hardware damage — needs repair before reuse',
  },
];

const DEFAULT_DEPARTMENTS: PicklistItem[] = [
  {
    id: 'dep-it',
    name: 'IT',
    color: '#2563eb',
    active: true,
    isDefault: true,
    description: 'Information Technology',
  },
  { id: 'dep-fin', name: 'Finance', color: '#059669', active: true },
  { id: 'dep-hr', name: 'HR', color: '#7c3aed', active: true },
  { id: 'dep-ops', name: 'Operations', color: '#0891b2', active: true },
  { id: 'dep-sales', name: 'Sales', color: '#d97706', active: true },
  { id: 'dep-mkt', name: 'Marketing', color: '#dc2626', active: true },
  { id: 'dep-eng', name: 'Engineering', color: '#9333ea', active: true },
];

// ─── Licence picklists ───────────────────────────────────────────────────────
const DEFAULT_LICENCE_TYPES: PicklistItem[] = [
  {
    id: 'lc-perpetual',
    name: 'Perpetual',
    color: '#059669',
    active: true,
    description: 'One-time purchase, owned forever',
  },
  {
    id: 'lc-subscription',
    name: 'Subscription',
    color: '#2563eb',
    active: true,
    isDefault: true,
    description: 'Renews on cadence',
  },
  {
    id: 'lc-per-seat',
    name: 'Per-seat',
    color: '#7c3aed',
    active: true,
    description: 'Counted per user',
  },
  {
    id: 'lc-per-device',
    name: 'Per-device',
    color: '#0891b2',
    active: true,
    description: 'Counted per installed device',
  },
  {
    id: 'lc-concurrent',
    name: 'Concurrent users',
    color: '#d97706',
    active: true,
    description: 'Floating — N can use at once',
  },
  {
    id: 'lc-site',
    name: 'Site licence',
    color: '#dc2626',
    active: true,
    description: 'Unlimited within one location',
  },
  {
    id: 'lc-oss',
    name: 'Open-source',
    color: '#64748b',
    active: true,
    description: 'Free, attribution rules apply',
  },
];

// ─── Contract picklists ─────────────────────────────────────────────────────
const DEFAULT_CONTRACT_TYPES: PicklistItem[] = [
  {
    id: 'ct-maint',
    name: 'Maintenance',
    color: '#2563eb',
    active: true,
    isDefault: true,
    description: 'Hardware / software maintenance',
  },
  { id: 'ct-lease', name: 'Lease', color: '#7c3aed', active: true, description: 'Equipment lease' },
  {
    id: 'ct-support',
    name: 'Support',
    color: '#059669',
    active: true,
    description: 'Vendor support / TAM',
  },
  {
    id: 'ct-sla',
    name: 'SLA',
    color: '#d97706',
    active: true,
    description: 'Service-level agreement',
  },
  {
    id: 'ct-msa',
    name: 'MSA',
    color: '#dc2626',
    active: true,
    description: 'Master services agreement',
  },
  {
    id: 'ct-nda',
    name: 'NDA',
    color: '#64748b',
    active: true,
    description: 'Non-disclosure agreement',
  },
  {
    id: 'ct-warranty',
    name: 'Warranty',
    color: '#0891b2',
    active: true,
    description: 'Manufacturer warranty',
  },
];

// ─── Generic custom-field builder ───────────────────────────────────────────

type CustomFieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'select'
  | 'multiselect'
  | 'boolean'
  | 'url'
  | 'email'
  | 'currency';
type CustomFieldEntity = 'ticket' | 'asset' | 'contact' | 'device' | 'licence' | 'contract';

interface CustomField {
  id: string;
  label: string;
  entity: CustomFieldEntity;
  type: CustomFieldType;
  required: boolean;
  active: boolean;
  options?: string[]; // for select / multiselect
  description?: string;
  defaultValue?: string;
}

const DEFAULT_CUSTOM_FIELDS: CustomField[] = [
  {
    id: 'cf-cost-centre',
    label: 'Cost centre',
    entity: 'asset',
    type: 'select',
    options: ['LAG-IT-001', 'LAG-OPS-002', 'IKJ-IT-003', 'NBO-IT-004'],
    required: true,
    active: true,
    description: 'Account code the asset is billed to',
  },
  {
    id: 'cf-warranty-provider',
    label: 'Warranty provider',
    entity: 'asset',
    type: 'text',
    required: false,
    active: true,
    description: 'Who honours the warranty (vendor, reseller, in-house)',
  },
  {
    id: 'cf-purchase-currency',
    label: 'Purchase currency',
    entity: 'asset',
    type: 'select',
    options: ['NGN', 'USD', 'ZAR', 'KES', 'GHS', 'EUR'],
    required: false,
    active: true,
  },
  {
    id: 'cf-environment',
    label: 'Environment',
    entity: 'device',
    type: 'select',
    options: ['Production', 'Staging', 'Disaster recovery', 'Lab'],
    required: true,
    active: true,
  },
  {
    id: 'cf-criticality',
    label: 'Business criticality',
    entity: 'device',
    type: 'select',
    options: ['Mission critical', 'Business critical', 'Important', 'Standard'],
    required: true,
    active: true,
    description: 'Drives monitoring alert routing',
  },
  {
    id: 'cf-customer-tier',
    label: 'Customer tier',
    entity: 'contact',
    type: 'select',
    options: ['VIP', 'Enterprise', 'Standard', 'Trial'],
    required: false,
    active: true,
  },
  {
    id: 'cf-vat-id',
    label: 'VAT / Tax ID',
    entity: 'contact',
    type: 'text',
    required: false,
    active: true,
  },
  {
    id: 'cf-impact',
    label: 'Business impact',
    entity: 'ticket',
    type: 'select',
    options: ['No impact', 'Single user', 'Department', 'Site-wide', 'Company-wide'],
    required: false,
    active: true,
  },
];

const STORAGE_KEY_CAT = 'topiadesk.ticket-fields.categories';
const STORAGE_KEY_CUST = 'topiadesk.ticket-fields.customer-ids';
const STORAGE_KEY_STA = 'topiadesk.ticket-fields.statuses';
const STORAGE_KEY_PRI = 'topiadesk.ticket-fields.priorities';
const STORAGE_KEY_GRP = 'topiadesk.ticket-fields.groups';
const STORAGE_KEY_RES = 'topiadesk.ticket-fields.resolutions';
const STORAGE_KEY_CHN = 'topiadesk.ticket-fields.channels';
const STORAGE_KEY_AST = 'topiadesk.ticket-fields.asset-taxonomy';
const STORAGE_KEY_ASS = 'topiadesk.ticket-fields.asset-statuses';
const STORAGE_KEY_ASC = 'topiadesk.ticket-fields.asset-conditions';
const STORAGE_KEY_DEP = 'topiadesk.ticket-fields.departments';
const STORAGE_KEY_LIC = 'topiadesk.ticket-fields.licence-types';
const STORAGE_KEY_CON = 'topiadesk.ticket-fields.contract-types';
const STORAGE_KEY_CF = 'topiadesk.ticket-fields.custom-fields';

// ─── Page ────────────────────────────────────────────────────────────────────

type TabKey =
  | 'categories'
  | 'statuses'
  | 'priorities'
  | 'groups'
  | 'resolutions'
  | 'channels'
  | 'customer-ids'
  | 'asset-taxonomy'
  | 'asset-statuses'
  | 'asset-conditions'
  | 'departments'
  | 'licence-types'
  | 'contract-types'
  | 'custom-fields';

export default function TicketFieldsPage() {
  const [tab, setTab] = useState<TabKey>('categories');
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [customerIds, setCustomerIds] = useState<CustomerIdField[]>(DEFAULT_CUSTOMER_IDS);
  const [statuses, setStatuses] = useState<PicklistItem[]>(DEFAULT_STATUSES);
  const [priorities, setPriorities] = useState<PicklistItem[]>(DEFAULT_PRIORITIES);
  const [groups, setGroups] = useState<PicklistItem[]>(DEFAULT_GROUPS);
  const [resolutions, setResolutions] = useState<PicklistItem[]>(DEFAULT_RESOLUTIONS);
  const [channels, setChannels] = useState<PicklistItem[]>(DEFAULT_CHANNELS);
  const [assetTaxonomy, setAssetTaxonomy] = useState<CascadeNode[]>(ASSET_TAXONOMY);
  const [assetStatuses, setAssetStatuses] = useState<PicklistItem[]>(DEFAULT_ASSET_STATUSES);
  const [assetConditions, setAssetConditions] = useState<PicklistItem[]>(DEFAULT_ASSET_CONDITIONS);
  const [departments, setDepartments] = useState<PicklistItem[]>(DEFAULT_DEPARTMENTS);
  const [licenceTypes, setLicenceTypes] = useState<PicklistItem[]>(DEFAULT_LICENCE_TYPES);
  const [contractTypes, setContractTypes] = useState<PicklistItem[]>(DEFAULT_CONTRACT_TYPES);
  const [customFields, setCustomFields] = useState<CustomField[]>(DEFAULT_CUSTOM_FIELDS);

  // Hydrate from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const read = <T,>(k: string, fallback: T): T => {
      try {
        const v = JSON.parse(window.localStorage.getItem(k) ?? 'null');
        return Array.isArray(v) ? (v as T) : fallback;
      } catch {
        return fallback;
      }
    };
    setCategories(read(STORAGE_KEY_CAT, DEFAULT_CATEGORIES));
    setCustomerIds(read(STORAGE_KEY_CUST, DEFAULT_CUSTOMER_IDS));
    setStatuses(read(STORAGE_KEY_STA, DEFAULT_STATUSES));
    setPriorities(read(STORAGE_KEY_PRI, DEFAULT_PRIORITIES));
    setGroups(read(STORAGE_KEY_GRP, DEFAULT_GROUPS));
    setResolutions(read(STORAGE_KEY_RES, DEFAULT_RESOLUTIONS));
    setChannels(read(STORAGE_KEY_CHN, DEFAULT_CHANNELS));
    setAssetTaxonomy(read(STORAGE_KEY_AST, ASSET_TAXONOMY));
    setAssetStatuses(read(STORAGE_KEY_ASS, DEFAULT_ASSET_STATUSES));
    setAssetConditions(read(STORAGE_KEY_ASC, DEFAULT_ASSET_CONDITIONS));
    setDepartments(read(STORAGE_KEY_DEP, DEFAULT_DEPARTMENTS));
    setLicenceTypes(read(STORAGE_KEY_LIC, DEFAULT_LICENCE_TYPES));
    setContractTypes(read(STORAGE_KEY_CON, DEFAULT_CONTRACT_TYPES));
    setCustomFields(read(STORAGE_KEY_CF, DEFAULT_CUSTOM_FIELDS));
  }, []);

  const persist =
    <T,>(key: string, setter: (v: T) => void) =>
    (next: T) => {
      setter(next);
      if (typeof window !== 'undefined') window.localStorage.setItem(key, JSON.stringify(next));
    };
  const persistCategories = persist<Category[]>(STORAGE_KEY_CAT, setCategories);
  const persistCustomerIds = persist<CustomerIdField[]>(STORAGE_KEY_CUST, setCustomerIds);
  const persistStatuses = persist<PicklistItem[]>(STORAGE_KEY_STA, setStatuses);
  const persistPriorities = persist<PicklistItem[]>(STORAGE_KEY_PRI, setPriorities);
  const persistGroups = persist<PicklistItem[]>(STORAGE_KEY_GRP, setGroups);
  const persistResolutions = persist<PicklistItem[]>(STORAGE_KEY_RES, setResolutions);
  const persistChannels = persist<PicklistItem[]>(STORAGE_KEY_CHN, setChannels);
  const persistAssetTaxonomy = persist<CascadeNode[]>(STORAGE_KEY_AST, setAssetTaxonomy);
  const persistAssetStatuses = persist<PicklistItem[]>(STORAGE_KEY_ASS, setAssetStatuses);
  const persistAssetConditions = persist<PicklistItem[]>(STORAGE_KEY_ASC, setAssetConditions);
  const persistDepartments = persist<PicklistItem[]>(STORAGE_KEY_DEP, setDepartments);
  const persistLicenceTypes = persist<PicklistItem[]>(STORAGE_KEY_LIC, setLicenceTypes);
  const persistContractTypes = persist<PicklistItem[]>(STORAGE_KEY_CON, setContractTypes);
  const persistCustomFields = persist<CustomField[]>(STORAGE_KEY_CF, setCustomFields);

  const counts = useMemo(
    () => ({
      activeCategories: categories.filter((c) => c.active).length,
      totalSubcategories: categories.reduce((s, c) => s + c.subcategories.length, 0),
      activeCustomerIds: customerIds.filter((c) => c.active).length,
      activeStatuses: statuses.filter((s) => s.active).length,
      activePriorities: priorities.filter((p) => p.active).length,
      activeGroups: groups.filter((g) => g.active).length,
      activeResolutions: resolutions.filter((r) => r.active).length,
      activeAssetTypes: assetTaxonomy.filter((n) => n.active).length,
      totalBrands: assetTaxonomy.reduce((s, n) => s + n.children.length, 0),
      totalModels: assetTaxonomy.reduce(
        (s, n) => s + n.children.reduce((s2, b) => s2 + b.children.length, 0),
        0,
      ),
      activeCustomFields: customFields.filter((c) => c.active).length,
    }),
    [
      categories,
      customerIds,
      statuses,
      priorities,
      groups,
      resolutions,
      assetTaxonomy,
      customFields,
    ],
  );

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
        <header className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
                Ticketing
              </p>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">
                Picklists &amp; fields
              </h1>
              <p className="mt-0.5 text-sm text-white/70">
                Every dropdown agents see across tickets, assets, licences, contracts &amp; devices
                — fully configurable per tenant.
              </p>
            </div>
            <Badge variant="outline" className="border-white/20 bg-white/10 text-white">
              {counts.activeAssetTypes} asset types · {counts.totalBrands} brands ·{' '}
              {counts.totalModels} models · {counts.activeCustomFields} custom fields
            </Badge>
          </div>
        </header>
      </div>

      <div className="shrink-0 px-5 pt-5">
        <div className="rounded-xl border border-border/70 bg-card px-4 py-3">
          {[
            {
              section: 'Tickets',
              items: [
                { k: 'categories' as const, label: 'Categories', icon: Layers },
                { k: 'statuses' as const, label: 'Statuses', icon: CircleDot },
                { k: 'priorities' as const, label: 'Priorities', icon: AlertOctagon },
                { k: 'groups' as const, label: 'Groups / Teams', icon: Users },
                { k: 'resolutions' as const, label: 'Resolution reasons', icon: Flag },
                { k: 'channels' as const, label: 'Channels', icon: Inbox },
                { k: 'customer-ids' as const, label: 'Customer IDs', icon: Hash },
              ],
            },
            {
              section: 'Assets & devices',
              items: [
                { k: 'asset-taxonomy' as const, label: 'Asset type → Brand → Model', icon: Boxes },
                { k: 'asset-statuses' as const, label: 'Asset statuses', icon: ShieldCheck },
                { k: 'asset-conditions' as const, label: 'Asset conditions', icon: CircleDot },
                { k: 'departments' as const, label: 'Departments / cost centres', icon: Building2 },
              ],
            },
            {
              section: 'Licences & contracts',
              items: [
                { k: 'licence-types' as const, label: 'Licence types', icon: Key },
                { k: 'contract-types' as const, label: 'Contract types', icon: FileSignature },
              ],
            },
            {
              section: 'Universal',
              items: [{ k: 'custom-fields' as const, label: 'Custom fields', icon: Sliders }],
            },
          ].map((group, gi) => (
            <div key={group.section} className={cn(gi > 0 && 'mt-2 border-t pt-2')}>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {group.section}
              </p>
              <div className="flex flex-wrap items-center gap-1 text-xs">
                {group.items.map(({ k, label, icon: Icon }) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setTab(k)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-md px-3 py-1 font-medium transition-colors',
                      tab === k
                        ? 'bg-primary text-white'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5 pt-5">
        {tab === 'categories' && (
          <CategoriesTab categories={categories} onChange={persistCategories} />
        )}
        {tab === 'customer-ids' && (
          <CustomerIdsTab fields={customerIds} onChange={persistCustomerIds} />
        )}
        {tab === 'statuses' && (
          <PicklistTab
            kind="status"
            title="Ticket statuses"
            description="The lifecycle states agents move tickets through. Each status carries a semantic — open / pending (pauses SLA) / resolved / closed."
            items={statuses}
            onChange={persistStatuses}
            includeSemantics
          />
        )}
        {tab === 'priorities' && (
          <PicklistTab
            kind="priority"
            title="Priority levels"
            description="Tiers used by SLA policy + routing rules. Higher weight = more urgent."
            items={priorities}
            onChange={persistPriorities}
            includeWeight
          />
        )}
        {tab === 'groups' && (
          <PicklistTab
            kind="group"
            title="Groups / Teams"
            description="Teams that own tickets. Each group can have its own SLA policy, business hours and queue dashboard."
            items={groups}
            onChange={persistGroups}
          />
        )}
        {tab === 'resolutions' && (
          <PicklistTab
            kind="resolution"
            title="Resolution reasons"
            description="The picklist agents choose from when resolving a ticket. Feeds the resolution-quality report."
            items={resolutions}
            onChange={persistResolutions}
          />
        )}
        {tab === 'channels' && (
          <PicklistTab
            kind="channel"
            title="Channels / sources"
            description="Inbound channels that can create a ticket. Each one shows up in the channel filter and feeds the channel-mix report."
            items={channels}
            onChange={persistChannels}
          />
        )}
        {tab === 'asset-taxonomy' && (
          <CascadeTab
            title="Asset taxonomy"
            description="Three-level cascade an agent walks when registering an asset: Asset type → Brand → Model. Configure exactly the hierarchy your fleet uses."
            level1Label="Asset type"
            level2Label="Brand"
            level3Label="Model"
            nodes={assetTaxonomy}
            onChange={persistAssetTaxonomy}
          />
        )}
        {tab === 'asset-statuses' && (
          <PicklistTab
            kind="asset-status"
            title="Asset lifecycle statuses"
            description="States an asset moves through (In stock → Deployed → In repair → Retired → Disposed)."
            items={assetStatuses}
            onChange={persistAssetStatuses}
          />
        )}
        {tab === 'asset-conditions' && (
          <PicklistTab
            kind="asset-condition"
            title="Asset condition grades"
            description="Physical condition agents record at intake / audit time."
            items={assetConditions}
            onChange={persistAssetConditions}
          />
        )}
        {tab === 'departments' && (
          <PicklistTab
            kind="department"
            title="Departments / cost centres"
            description="Used on asset assignment, agent profile and the cost-centre custom field."
            items={departments}
            onChange={persistDepartments}
          />
        )}
        {tab === 'licence-types' && (
          <PicklistTab
            kind="licence-type"
            title="Licence types"
            description="How software licences are counted (Perpetual / Subscription / Per-seat / Per-device / Concurrent / Site / Open-source)."
            items={licenceTypes}
            onChange={persistLicenceTypes}
          />
        )}
        {tab === 'contract-types' && (
          <PicklistTab
            kind="contract-type"
            title="Contract types"
            description="Categorise vendor contracts so agents can filter renewals and expiries."
            items={contractTypes}
            onChange={persistContractTypes}
          />
        )}
        {tab === 'custom-fields' && (
          <CustomFieldsTab fields={customFields} onChange={persistCustomFields} />
        )}
      </div>
    </div>
  );
}

// ─── Categories tab ──────────────────────────────────────────────────────────

function CategoriesTab({
  categories,
  onChange,
}: {
  categories: Category[];
  onChange: (next: Category[]) => void;
}) {
  const [editing, setEditing] = useState<Category | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const upsert = (c: Category) => {
    const exists = categories.some((x) => x.id === c.id);
    onChange(exists ? categories.map((x) => (x.id === c.id ? c : x)) : [...categories, c]);
    setEditing(null);
    setShowNew(false);
  };

  const remove = (id: string) => {
    if (
      !confirm(
        "Remove this category? Tickets that currently use it will keep the label, but agents won't be able to pick it for new tickets.",
      )
    )
      return;
    onChange(categories.filter((c) => c.id !== id));
  };

  const toggleActive = (id: string) => {
    onChange(categories.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="border-b py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm">Ticket categories</CardTitle>
              <p className="text-[11px] text-muted-foreground">
                Top-level taxonomy agents pick from when classifying a ticket.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/ticket-fields/new">
                  <Plus className="h-3 w-3" />
                  New custom field
                </Link>
              </Button>
              <Button
                size="sm"
                className="bg-coral text-white hover:bg-coral-dark"
                onClick={() => setShowNew(true)}
              >
                <Plus className="h-3 w-3" />
                New category
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {categories.map((c) => (
              <li key={c.id} className={cn('px-4 py-3', !c.active && 'opacity-60')}>
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                  <button
                    type="button"
                    onClick={() => toggleExpand(c.id)}
                    className="grid h-6 w-6 shrink-0 place-items-center rounded text-muted-foreground hover:bg-muted"
                  >
                    {expanded[c.id] ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: c.color }} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{c.name}</p>
                      {c.requireSubcategory && (
                        <Badge variant="secondary" className="text-[9px]">
                          Subcategory required
                        </Badge>
                      )}
                      {!c.active && (
                        <Badge variant="outline" className="text-[9px]">
                          Hidden
                        </Badge>
                      )}
                    </div>
                    {c.description && (
                      <p className="truncate text-[11px] text-muted-foreground">{c.description}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {c.subcategories.length} subcategor{c.subcategories.length === 1 ? 'y' : 'ies'}
                  </span>
                  <Switch checked={c.active} onCheckedChange={() => toggleActive(c.id)} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setEditing(c)}
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-600"
                    onClick={() => remove(c.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Subcategories */}
                {expanded[c.id] && (
                  <div className="mt-3 ml-12 space-y-1.5">
                    {c.subcategories.length === 0 ? (
                      <p className="text-[11px] text-muted-foreground">No subcategories yet.</p>
                    ) : (
                      c.subcategories.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-xs"
                        >
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          <span className="flex-1 font-medium">{s.name}</span>
                          {s.default && (
                            <Badge variant="secondary" className="text-[9px]">
                              Default
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-600"
                            onClick={() =>
                              upsert({
                                ...c,
                                subcategories: c.subcategories.filter((x) => x.id !== s.id),
                              })
                            }
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))
                    )}
                    <QuickAddSubcategory
                      onAdd={(name) =>
                        upsert({
                          ...c,
                          subcategories: [...c.subcategories, { id: `sub-${Date.now()}`, name }],
                        })
                      }
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <CategoryDialog
        open={showNew || !!editing}
        category={editing}
        onClose={() => {
          setShowNew(false);
          setEditing(null);
        }}
        onSave={upsert}
      />

      {/* Live preview — what agents see */}
      <Card>
        <CardHeader className="border-b py-3">
          <CardTitle className="text-sm">Agent preview</CardTitle>
          <p className="text-[11px] text-muted-foreground">
            This is how the category picker appears to agents in the new-ticket form.
          </p>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-[11px] text-muted-foreground">Category</Label>
              <select className="mt-1 h-9 w-full rounded-md border bg-background px-2 text-xs">
                <option>Pick a category…</option>
                {categories
                  .filter((c) => c.active)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <Label className="text-[11px] text-muted-foreground">Subcategory</Label>
              <select className="mt-1 h-9 w-full rounded-md border bg-background px-2 text-xs">
                <option>(depends on category)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function QuickAddSubcategory({ onAdd }: { onAdd: (name: string) => void }) {
  const [name, setName] = useState('');
  return (
    <div className="flex items-center gap-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && name.trim()) {
            onAdd(name.trim());
            setName('');
          }
        }}
        placeholder="Add a subcategory…"
        className="h-7 text-xs"
      />
      <Button
        size="sm"
        variant="outline"
        className="h-7 px-2 text-[11px]"
        disabled={!name.trim()}
        onClick={() => {
          onAdd(name.trim());
          setName('');
        }}
      >
        <Plus className="h-3 w-3" />
        Add
      </Button>
    </div>
  );
}

function CategoryDialog({
  open,
  category,
  onClose,
  onSave,
}: {
  open: boolean;
  category: Category | null;
  onClose: () => void;
  onSave: (c: Category) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(CAT_COLORS[0]!);
  const [requireSubcategory, setRequireSubcategory] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!open) return;
    setName(category?.name ?? '');
    setDescription(category?.description ?? '');
    setColor(category?.color ?? CAT_COLORS[0]!);
    setRequireSubcategory(category?.requireSubcategory ?? false);
    setActive(category?.active ?? true);
  }, [open, category]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: category?.id ?? `cat-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || undefined,
      color,
      active,
      requireSubcategory,
      subcategories: category?.subcategories ?? [],
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit category' : 'New category'}</DialogTitle>
          <DialogDescription>
            Categories are the top-level classification agents apply to each ticket. Subcategories
            let you drill down further.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="cat-name" className="text-xs">
              Name *
            </Label>
            <Input
              id="cat-name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maintenance"
              className="h-9 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cat-desc" className="text-xs">
              Description
            </Label>
            <Input
              id="cat-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What kinds of tickets belong here?"
              className="h-9 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Colour</Label>
            <div className="flex flex-wrap gap-1.5">
              {CAT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    'h-7 w-7 rounded-md border-2 transition-all',
                    color === c ? 'border-foreground scale-110' : 'border-transparent',
                  )}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between rounded-md border bg-muted/30 p-3">
            <div className="pr-3">
              <p className="text-xs font-semibold">Require a subcategory</p>
              <p className="text-[10px] text-muted-foreground">
                Agent must pick a subcategory before saving the ticket.
              </p>
            </div>
            <Switch checked={requireSubcategory} onCheckedChange={setRequireSubcategory} />
          </div>
          <div className="flex items-center justify-between rounded-md border bg-muted/30 p-3">
            <div className="pr-3">
              <p className="text-xs font-semibold">Visible to agents</p>
              <p className="text-[10px] text-muted-foreground">
                Disable to hide this category from the picker without deleting it.
              </p>
            </div>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-coral text-white hover:bg-coral-dark"
            disabled={!name.trim()}
            onClick={handleSave}
          >
            <Save className="h-3 w-3" />
            Save category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Customer ID fields tab ──────────────────────────────────────────────────

function CustomerIdsTab({
  fields,
  onChange,
}: {
  fields: CustomerIdField[];
  onChange: (next: CustomerIdField[]) => void;
}) {
  const [editing, setEditing] = useState<CustomerIdField | null>(null);
  const [showNew, setShowNew] = useState(false);

  const upsert = (f: CustomerIdField) => {
    const exists = fields.some((x) => x.id === f.id);
    onChange(exists ? fields.map((x) => (x.id === f.id ? f : x)) : [...fields, f]);
    setEditing(null);
    setShowNew(false);
  };

  const remove = (id: string) => {
    if (
      !confirm(
        "Remove this customer ID field? Existing tickets keep their value but agents won't see this field on new tickets.",
      )
    )
      return;
    onChange(fields.filter((c) => c.id !== id));
  };

  const toggleActive = (id: string) => {
    onChange(fields.map((f) => (f.id === id ? { ...f, active: !f.active } : f)));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="border-b py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm">Customer ID fields</CardTitle>
              <p className="text-[11px] text-muted-foreground">
                Custom identifiers (account ID, contract number, asset tag…) attached to every
                ticket. Agents fill these in on the new-ticket form.
              </p>
            </div>
            <Button
              size="sm"
              className="bg-coral text-white hover:bg-coral-dark"
              onClick={() => setShowNew(true)}
            >
              <Plus className="h-3 w-3" />
              New field
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {fields.map((f) => (
              <li key={f.id} className={cn('px-4 py-3', !f.active && 'opacity-60')}>
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                  <Hash className="h-4 w-4 shrink-0 text-coral" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{f.label}</p>
                      {f.required && (
                        <Badge variant="warning" className="text-[9px]">
                          Required
                        </Badge>
                      )}
                      {!f.active && (
                        <Badge variant="outline" className="text-[9px]">
                          Hidden
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Placeholder: <span className="font-mono">{f.placeholder}</span>
                      {f.pattern && (
                        <span className="ml-2">
                          Pattern: <span className="font-mono">{f.pattern}</span>
                        </span>
                      )}
                      {f.example && (
                        <span className="ml-2">
                          e.g. <span className="font-mono">{f.example}</span>
                        </span>
                      )}
                    </p>
                  </div>
                  <Switch checked={f.active} onCheckedChange={() => toggleActive(f.id)} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setEditing(f)}
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-600"
                    onClick={() => remove(f.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <CustomerIdDialog
        open={showNew || !!editing}
        field={editing}
        onClose={() => {
          setShowNew(false);
          setEditing(null);
        }}
        onSave={upsert}
      />

      {/* Agent preview */}
      <Card>
        <CardHeader className="border-b py-3">
          <CardTitle className="text-sm">Agent preview</CardTitle>
          <p className="text-[11px] text-muted-foreground">
            This is how the customer-ID fields appear to agents in the new-ticket form.
          </p>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {fields
              .filter((f) => f.active)
              .map((f) => (
                <div key={f.id}>
                  <Label className="text-[11px] text-muted-foreground">
                    {f.label}
                    {f.required && <span className="ml-0.5 text-red-600">*</span>}
                  </Label>
                  <Input
                    className="mt-1 h-9 font-mono text-xs"
                    placeholder={f.placeholder}
                    disabled
                  />
                  {f.example && (
                    <p className="mt-0.5 text-[10px] text-muted-foreground">Example: {f.example}</p>
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Generic picklist tab (statuses / priorities / groups / resolutions) ────

type PicklistKind =
  | 'status'
  | 'priority'
  | 'group'
  | 'resolution'
  | 'channel'
  | 'asset-status'
  | 'asset-condition'
  | 'department'
  | 'licence-type'
  | 'contract-type';

function PicklistTab({
  kind,
  title,
  description,
  items,
  onChange,
  includeSemantics,
  includeWeight,
}: {
  kind: PicklistKind;
  title: string;
  description: string;
  items: PicklistItem[];
  onChange: (next: PicklistItem[]) => void;
  includeSemantics?: boolean;
  includeWeight?: boolean;
}) {
  const [editing, setEditing] = useState<PicklistItem | null>(null);
  const [showNew, setShowNew] = useState(false);

  const upsert = (item: PicklistItem) => {
    const exists = items.some((i) => i.id === item.id);
    let next = exists ? items.map((i) => (i.id === item.id ? item : i)) : [...items, item];
    if (item.isDefault) next = next.map((i) => (i.id === item.id ? i : { ...i, isDefault: false }));
    if (includeWeight) next = [...next].sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0));
    onChange(next);
    setEditing(null);
    setShowNew(false);
  };

  const remove = (id: string) => {
    if (
      !confirm(
        `Remove this ${kind}? Existing tickets keep the value but agents won't see it on new tickets.`,
      )
    )
      return;
    onChange(items.filter((i) => i.id !== id));
  };

  const toggleActive = (id: string) =>
    onChange(items.map((i) => (i.id === id ? { ...i, active: !i.active } : i)));

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...items];
    [next[idx - 1], next[idx]] = [next[idx]!, next[idx - 1]!];
    onChange(next);
  };
  const moveDown = (idx: number) => {
    if (idx === items.length - 1) return;
    const next = [...items];
    [next[idx], next[idx + 1]] = [next[idx + 1]!, next[idx]!];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="border-b py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm">{title}</CardTitle>
              <p className="text-[11px] text-muted-foreground">{description}</p>
            </div>
            <Button
              size="sm"
              className="bg-coral text-white hover:bg-coral-dark"
              onClick={() => setShowNew(true)}
            >
              <Plus className="h-3 w-3" />
              New {kind}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {items.map((item, idx) => (
              <li key={item.id} className={cn('px-4 py-2.5', !item.active && 'opacity-60')}>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="grid h-3 w-4 place-items-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                    >
                      <ChevronDown className="h-3 w-3 rotate-180" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(idx)}
                      disabled={idx === items.length - 1}
                      className="grid h-3 w-4 place-items-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </div>
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ background: item.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{item.name}</p>
                      {item.isDefault && (
                        <Badge variant="secondary" className="text-[9px]">
                          Default
                        </Badge>
                      )}
                      {item.semantics && (
                        <Badge variant="outline" className="text-[9px] capitalize">
                          {item.semantics === 'pending' ? 'pending · SLA paused' : item.semantics}
                        </Badge>
                      )}
                      {includeWeight && item.weight !== undefined && (
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-bold tabular-nums">
                          w{item.weight}
                        </span>
                      )}
                      {item.memberCount !== undefined && (
                        <span className="text-[10px] text-muted-foreground">
                          · {item.memberCount} agents
                        </span>
                      )}
                      {!item.active && (
                        <Badge variant="outline" className="text-[9px]">
                          Hidden
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <p className="truncate text-[11px] text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <Switch checked={item.active} onCheckedChange={() => toggleActive(item.id)} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setEditing(item)}
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-600"
                    onClick={() => remove(item.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <PicklistDialog
        open={showNew || !!editing}
        kind={kind}
        item={editing}
        includeSemantics={includeSemantics}
        includeWeight={includeWeight}
        onClose={() => {
          setShowNew(false);
          setEditing(null);
        }}
        onSave={upsert}
      />

      {/* Agent preview */}
      <Card>
        <CardHeader className="border-b py-3">
          <CardTitle className="text-sm">Agent preview</CardTitle>
          <p className="text-[11px] text-muted-foreground">
            This is the exact dropdown agents see in the ticket workspace.
          </p>
        </CardHeader>
        <CardContent className="p-5">
          <Label className="text-[11px] capitalize text-muted-foreground">{kind}</Label>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {items
              .filter((i) => i.active)
              .map((i) => (
                <span
                  key={i.id}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 text-xs"
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: i.color }} />
                  {i.name}
                </span>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PicklistDialog({
  open,
  kind,
  item,
  includeSemantics,
  includeWeight,
  onClose,
  onSave,
}: {
  open: boolean;
  kind: PicklistKind;
  item: PicklistItem | null;
  includeSemantics?: boolean;
  includeWeight?: boolean;
  onClose: () => void;
  onSave: (item: PicklistItem) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(CAT_COLORS[0]!);
  const [active, setActive] = useState(true);
  const [isDefault, setIsDefault] = useState(false);
  const [semantics, setSemantics] = useState<PicklistItem['semantics']>('open');
  const [weight, setWeight] = useState(1);

  useEffect(() => {
    if (!open) return;
    setName(item?.name ?? '');
    setDescription(item?.description ?? '');
    setColor(item?.color ?? CAT_COLORS[0]!);
    setActive(item?.active ?? true);
    setIsDefault(item?.isDefault ?? false);
    setSemantics(item?.semantics ?? 'open');
    setWeight(item?.weight ?? 1);
  }, [open, item]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: item?.id ?? `${kind.charAt(0)}-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || undefined,
      color,
      active,
      isDefault,
      semantics: includeSemantics ? semantics : item?.semantics,
      weight: includeWeight ? weight : item?.weight,
      memberCount: item?.memberCount,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{item ? `Edit ${kind}` : `New ${kind}`}</DialogTitle>
          <DialogDescription>
            Configure how this {kind} appears in the agent dropdown and what semantics it carries.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="pl-name" className="text-xs">
              Name *
            </Label>
            <Input
              id="pl-name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                kind === 'status'
                  ? 'e.g. Waiting on vendor'
                  : kind === 'priority'
                    ? 'e.g. Critical'
                    : 'Name'
              }
              className="h-9 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pl-desc" className="text-xs">
              Description
            </Label>
            <Input
              id="pl-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="When should agents use this?"
              className="h-9 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Colour</Label>
            <div className="flex flex-wrap gap-1.5">
              {CAT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    'h-7 w-7 rounded-full border-2 transition-all',
                    color === c ? 'border-foreground scale-110' : 'border-transparent',
                  )}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
          {includeSemantics && (
            <div className="space-y-1.5">
              <Label className="text-xs">Lifecycle semantics</Label>
              <select
                value={semantics}
                onChange={(e) => setSemantics(e.target.value as PicklistItem['semantics'])}
                className="h-9 w-full rounded-md border bg-background px-2 text-xs"
              >
                <option value="open">Open — SLA running</option>
                <option value="pending">
                  Pending — SLA paused (waiting on customer/3rd party)
                </option>
                <option value="resolved">Resolved — fix delivered, awaiting confirmation</option>
                <option value="closed">Closed — ticket finalised</option>
              </select>
              <p className="text-[10px] text-muted-foreground">
                Used by SLA engine, reports and automations.
              </p>
            </div>
          )}
          {includeWeight && (
            <div className="space-y-1.5">
              <Label className="text-xs">Sort weight (higher = more urgent)</Label>
              <Input
                type="number"
                min={1}
                max={10}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="h-9 text-xs"
              />
            </div>
          )}
          <div className="flex items-center justify-between rounded-md border bg-muted/30 p-3">
            <div className="pr-3">
              <p className="text-xs font-semibold">Default selection</p>
              <p className="text-[10px] text-muted-foreground">
                Pre-selected when an agent creates a new ticket.
              </p>
            </div>
            <Switch checked={isDefault} onCheckedChange={setIsDefault} />
          </div>
          <div className="flex items-center justify-between rounded-md border bg-muted/30 p-3">
            <div className="pr-3">
              <p className="text-xs font-semibold">Visible to agents</p>
              <p className="text-[10px] text-muted-foreground">
                Disable to hide from the picker without losing the definition.
              </p>
            </div>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-coral text-white hover:bg-coral-dark"
            disabled={!name.trim()}
            onClick={handleSave}
          >
            <Save className="h-3 w-3" />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CustomerIdDialog({
  open,
  field,
  onClose,
  onSave,
}: {
  open: boolean;
  field: CustomerIdField | null;
  onClose: () => void;
  onSave: (f: CustomerIdField) => void;
}) {
  const [label, setLabel] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [pattern, setPattern] = useState('');
  const [example, setExample] = useState('');
  const [required, setRequired] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!open) return;
    setLabel(field?.label ?? '');
    setPlaceholder(field?.placeholder ?? '');
    setPattern(field?.pattern ?? '');
    setExample(field?.example ?? '');
    setRequired(field?.required ?? false);
    setActive(field?.active ?? true);
  }, [open, field]);

  const handleSave = () => {
    if (!label.trim()) return;
    onSave({
      id: field?.id ?? `cust-${Date.now()}`,
      label: label.trim(),
      placeholder: placeholder.trim(),
      pattern: pattern.trim() || undefined,
      example: example.trim() || undefined,
      required,
      active,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{field ? 'Edit customer ID field' : 'New customer ID field'}</DialogTitle>
          <DialogDescription>
            Customer ID fields are identifiers attached to every ticket — like account numbers,
            asset tags or contract IDs.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="cust-label" className="text-xs">
              Field label *
            </Label>
            <Input
              id="cust-label"
              autoFocus
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Asset tag"
              className="h-9 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cust-placeholder" className="text-xs">
              Placeholder
            </Label>
            <Input
              id="cust-placeholder"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              placeholder="AT-00000"
              className="h-9 font-mono text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cust-pattern" className="text-xs">
              Validation pattern (regex)
            </Label>
            <Input
              id="cust-pattern"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="^AT-\d{5,8}$"
              className="h-9 font-mono text-xs"
            />
            <p className="text-[10px] text-muted-foreground">Leave blank to accept any value.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cust-example" className="text-xs">
              Example values (shown to agents)
            </Label>
            <Input
              id="cust-example"
              value={example}
              onChange={(e) => setExample(e.target.value)}
              placeholder="AT-00042, AT-19324"
              className="h-9 text-xs"
            />
          </div>
          <div className="flex items-center justify-between rounded-md border bg-muted/30 p-3">
            <div className="pr-3">
              <p className="text-xs font-semibold">Required</p>
              <p className="text-[10px] text-muted-foreground">
                Agent can't save the ticket without filling this in.
              </p>
            </div>
            <Switch checked={required} onCheckedChange={setRequired} />
          </div>
          <div className="flex items-center justify-between rounded-md border bg-muted/30 p-3">
            <div className="pr-3">
              <p className="text-xs font-semibold">Visible to agents</p>
              <p className="text-[10px] text-muted-foreground">
                Disable to hide this field without losing its definition.
              </p>
            </div>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-coral text-white hover:bg-coral-dark"
            disabled={!label.trim()}
            onClick={handleSave}
          >
            <Save className="h-3 w-3" />
            Save field
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Cascade tab (3-level: Asset type → Brand → Model) ──────────────────────

function CascadeTab({
  title, description, level1Label, level2Label, level3Label,
  nodes, onChange,
}: {
  title: string;
  description: string;
  level1Label: string;
  level2Label: string;
  level3Label: string;
  nodes: CascadeNode[];
  onChange: (next: CascadeNode[]) => void;
}) {
  const [expanded1, setExpanded1] = useState<Record<string, boolean>>({});
  const [expanded2, setExpanded2] = useState<Record<string, boolean>>({});
  const [editingNode, setEditingNode] = useState<CascadeNode | null>(null);
  const [showNewNode, setShowNewNode] = useState(false);

  const toggle1 = (id: string) => setExpanded1((p) => ({ ...p, [id]: !p[id] }));
  const toggle2 = (id: string) => setExpanded2((p) => ({ ...p, [id]: !p[id] }));

  const upsertNode = (n: CascadeNode) => {
    const exists = nodes.some((x) => x.id === n.id);
    onChange(exists ? nodes.map((x) => (x.id === n.id ? n : x)) : [...nodes, n]);
    setEditingNode(null);
    setShowNewNode(false);
  };
  const removeNode = (id: string) => {
    if (!confirm(`Remove this ${level1Label.toLowerCase()} and all of its children?`)) return;
    onChange(nodes.filter((n) => n.id !== id));
  };
  const toggleActive = (id: string) =>
    onChange(nodes.map((n) => (n.id === id ? { ...n, active: !n.active } : n)));

  const addBrand = (nodeId: string, name: string) =>
    onChange(nodes.map((n) => n.id === nodeId
      ? { ...n, children: [...n.children, { id: `b-${Date.now()}`, name, children: [] }] }
      : n));
  const removeBrand = (nodeId: string, brandId: string) =>
    onChange(nodes.map((n) => n.id === nodeId
      ? { ...n, children: n.children.filter((b) => b.id !== brandId) }
      : n));
  const addModel = (nodeId: string, brandId: string, name: string) =>
    onChange(nodes.map((n) => n.id === nodeId
      ? { ...n, children: n.children.map((b) => b.id === brandId
          ? { ...b, children: [...b.children, { id: `m-${Date.now()}`, name }] }
          : b) }
      : n));
  const removeModel = (nodeId: string, brandId: string, modelId: string) =>
    onChange(nodes.map((n) => n.id === nodeId
      ? { ...n, children: n.children.map((b) => b.id === brandId
          ? { ...b, children: b.children.filter((m) => m.id !== modelId) }
          : b) }
      : n));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="border-b py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm">{title}</CardTitle>
              <p className="text-[11px] text-muted-foreground">{description}</p>
            </div>
            <Button size="sm" className="bg-coral text-white hover:bg-coral-dark" onClick={() => setShowNewNode(true)}>
              <Plus className="h-3 w-3" />New {level1Label.toLowerCase()}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {nodes.map((n) => {
              const open1 = expanded1[n.id];
              return (
                <li key={n.id} className={cn('px-4 py-3', !n.active && 'opacity-60')}>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => toggle1(n.id)}
                      className="grid h-6 w-6 shrink-0 place-items-center rounded text-muted-foreground hover:bg-muted">
                      {open1 ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                    </button>
                    <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: n.color }} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{n.name}</p>
                        {n.requireMid && <Badge variant="secondary" className="text-[9px]">{level2Label} required</Badge>}
                        {n.requireLeaf && <Badge variant="secondary" className="text-[9px]">{level3Label} required</Badge>}
                        {!n.active && <Badge variant="outline" className="text-[9px]">Hidden</Badge>}
                      </div>
                      {n.description && <p className="truncate text-[11px] text-muted-foreground">{n.description}</p>}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {n.children.length} {level2Label.toLowerCase()}{n.children.length === 1 ? '' : 's'}{' · '}
                      {n.children.reduce((s, b) => s + b.children.length, 0)} {level3Label.toLowerCase()}s
                    </span>
                    <Switch checked={n.active} onCheckedChange={() => toggleActive(n.id)} />
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingNode(n)}>
                      <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600" onClick={() => removeNode(n.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {open1 && (
                    <div className="mt-3 ml-9 space-y-2 border-l-2 pl-4" style={{ borderColor: n.color + '40' }}>
                      {n.children.length === 0 ? (
                        <p className="text-[11px] text-muted-foreground">No {level2Label.toLowerCase()}s yet.</p>
                      ) : n.children.map((b) => {
                        const open2 = expanded2[b.id];
                        return (
                          <div key={b.id}>
                            <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-xs">
                              <button type="button" onClick={() => toggle2(b.id)}
                                className="grid h-5 w-5 place-items-center text-muted-foreground hover:text-foreground">
                                {open2 ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                              </button>
                              <Tag className="h-3 w-3 text-muted-foreground" />
                              <span className="flex-1 font-semibold">{b.name}</span>
                              <span className="text-[10px] text-muted-foreground">{b.children.length} {level3Label.toLowerCase()}s</span>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-red-600"
                                onClick={() => removeBrand(n.id, b.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>

                            {open2 && (
                              <div className="mt-1.5 ml-6 space-y-1 border-l-2 pl-3" style={{ borderColor: n.color + '20' }}>
                                {b.children.length === 0 ? (
                                  <p className="text-[10px] text-muted-foreground">No {level3Label.toLowerCase()}s yet.</p>
                                ) : b.children.map((m) => (
                                  <div key={m.id} className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-1 text-[11px]">
                                    <span className="flex-1 font-medium">{m.name}</span>
                                    {m.meta && <span className="font-mono text-[10px] text-muted-foreground">{m.meta}</span>}
                                    <Button variant="ghost" size="icon" className="h-5 w-5 text-red-600"
                                      onClick={() => removeModel(n.id, b.id, m.id)}>
                                      <Trash2 className="h-2.5 w-2.5" />
                                    </Button>
                                  </div>
                                ))}
                                <QuickAdd placeholder={`Add a ${level3Label.toLowerCase()}…`}
                                  onAdd={(name) => addModel(n.id, b.id, name)} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                      <QuickAdd placeholder={`Add a ${level2Label.toLowerCase()}…`}
                        onAdd={(name) => addBrand(n.id, name)} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <CascadeNodeDialog
        open={showNewNode || !!editingNode}
        node={editingNode}
        level1Label={level1Label}
        level2Label={level2Label}
        level3Label={level3Label}
        onClose={() => { setShowNewNode(false); setEditingNode(null); }}
        onSave={upsertNode}
      />

      <Card>
        <CardHeader className="border-b py-3">
          <CardTitle className="text-sm">Agent preview — cascading picker</CardTitle>
          <p className="text-[11px] text-muted-foreground">
            Picking {level1Label.toLowerCase()} populates {level2Label.toLowerCase()}, which populates {level3Label.toLowerCase()}.
          </p>
        </CardHeader>
        <CardContent className="p-5">
          <CascadePreview nodes={nodes.filter((n) => n.active)}
            level1Label={level1Label} level2Label={level2Label} level3Label={level3Label} />
        </CardContent>
      </Card>
    </div>
  );
}

function QuickAdd({ onAdd, placeholder }: { onAdd: (name: string) => void; placeholder: string }) {
  const [name, setName] = useState('');
  return (
    <div className="flex items-center gap-1.5">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) { onAdd(name.trim()); setName(''); } }}
        placeholder={placeholder}
        className="h-7 text-[11px]"
      />
      <Button size="sm" variant="outline" className="h-7 px-2 text-[10px]"
        disabled={!name.trim()} onClick={() => { onAdd(name.trim()); setName(''); }}>
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}

function CascadePreview({
  nodes, level1Label, level2Label, level3Label,
}: { nodes: CascadeNode[]; level1Label: string; level2Label: string; level3Label: string }) {
  const [n, setN] = useState(nodes[0]?.id ?? '');
  const node = nodes.find((x) => x.id === n);
  const [b, setB] = useState(node?.children[0]?.id ?? '');
  const brand = node?.children.find((x) => x.id === b);
  const [m, setM] = useState(brand?.children[0]?.id ?? '');

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div>
        <Label className="text-[11px] text-muted-foreground">{level1Label}</Label>
        <select value={n} onChange={(e) => { setN(e.target.value); setB(''); setM(''); }}
          className="mt-1 h-9 w-full rounded-md border bg-background px-2 text-xs">
          <option value="">Pick…</option>
          {nodes.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
        </select>
      </div>
      <div>
        <Label className="text-[11px] text-muted-foreground">
          {level2Label}{node?.requireMid && <span className="ml-0.5 text-red-600">*</span>}
        </Label>
        <select value={b} onChange={(e) => { setB(e.target.value); setM(''); }} disabled={!node}
          className="mt-1 h-9 w-full rounded-md border bg-background px-2 text-xs disabled:opacity-50">
          <option value="">{node ? 'Pick…' : `(pick ${level1Label.toLowerCase()} first)`}</option>
          {node?.children.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
        </select>
      </div>
      <div>
        <Label className="text-[11px] text-muted-foreground">
          {level3Label}{node?.requireLeaf && <span className="ml-0.5 text-red-600">*</span>}
        </Label>
        <select value={m} onChange={(e) => setM(e.target.value)} disabled={!brand}
          className="mt-1 h-9 w-full rounded-md border bg-background px-2 text-xs disabled:opacity-50">
          <option value="">{brand ? 'Pick…' : `(pick ${level2Label.toLowerCase()} first)`}</option>
          {brand?.children.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
        </select>
      </div>
    </div>
  );
}

function CascadeNodeDialog({
  open, node, level1Label, level2Label, level3Label, onClose, onSave,
}: {
  open: boolean;
  node: CascadeNode | null;
  level1Label: string;
  level2Label: string;
  level3Label: string;
  onClose: () => void;
  onSave: (n: CascadeNode) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(CAT_COLORS[0]!);
  const [active, setActive] = useState(true);
  const [requireMid, setRequireMid] = useState(true);
  const [requireLeaf, setRequireLeaf] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(node?.name ?? '');
    setDescription(node?.description ?? '');
    setColor(node?.color ?? CAT_COLORS[0]!);
    setActive(node?.active ?? true);
    setRequireMid(node?.requireMid ?? true);
    setRequireLeaf(node?.requireLeaf ?? false);
  }, [open, node]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: node?.id ?? `at-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || undefined,
      color, active, requireMid, requireLeaf,
      children: node?.children ?? [],
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{node ? `Edit ${level1Label.toLowerCase()}` : `New ${level1Label.toLowerCase()}`}</DialogTitle>
          <DialogDescription>
            Add {level2Label.toLowerCase()}s and {level3Label.toLowerCase()}s from the row expand arrow once saved.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="cas-name" className="text-xs">Name *</Label>
            <Input id="cas-name" autoFocus value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tablet" className="h-9 text-xs" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cas-desc" className="text-xs">Description</Label>
            <Input id="cas-desc" value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional" className="h-9 text-xs" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Colour</Label>
            <div className="flex flex-wrap gap-1.5">
              {CAT_COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className={cn('h-7 w-7 rounded-md border-2 transition-all',
                    color === c ? 'border-foreground scale-110' : 'border-transparent')}
                  style={{ background: c }} />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between rounded-md border bg-muted/30 p-3">
            <div className="pr-3">
              <p className="text-xs font-semibold">Require {level2Label.toLowerCase()}</p>
              <p className="text-[10px] text-muted-foreground">Agent must pick a {level2Label.toLowerCase()} before saving.</p>
            </div>
            <Switch checked={requireMid} onCheckedChange={setRequireMid} />
          </div>
          <div className="flex items-center justify-between rounded-md border bg-muted/30 p-3">
            <div className="pr-3">
              <p className="text-xs font-semibold">Require {level3Label.toLowerCase()}</p>
              <p className="text-[10px] text-muted-foreground">Agent must pick a {level3Label.toLowerCase()} before saving.</p>
            </div>
            <Switch checked={requireLeaf} onCheckedChange={setRequireLeaf} />
          </div>
          <div className="flex items-center justify-between rounded-md border bg-muted/30 p-3">
            <div className="pr-3"><p className="text-xs font-semibold">Visible to agents</p></div>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" className="bg-coral text-white hover:bg-coral-dark"
            disabled={!name.trim()} onClick={handleSave}>
            <Save className="h-3 w-3" />Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Custom fields tab (generic field builder, any entity) ──────────────────

function CustomFieldsTab({
  fields, onChange,
}: { fields: CustomField[]; onChange: (next: CustomField[]) => void }) {
  const [editing, setEditing] = useState<CustomField | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [filter, setFilter] = useState<'all' | CustomFieldEntity>('all');

  const upsert = (f: CustomField) => {
    const exists = fields.some((x) => x.id === f.id);
    onChange(exists ? fields.map((x) => (x.id === f.id ? f : x)) : [...fields, f]);
    setEditing(null);
    setShowNew(false);
  };
  const remove = (id: string) => {
    if (!confirm('Remove this custom field?')) return;
    onChange(fields.filter((f) => f.id !== id));
  };
  const toggleActive = (id: string) =>
    onChange(fields.map((f) => (f.id === id ? { ...f, active: !f.active } : f)));

  const shown = filter === 'all' ? fields : fields.filter((f) => f.entity === filter);

  const entityColors: Record<CustomFieldEntity, string> = {
    ticket: 'bg-blue-100 text-blue-700',  asset: 'bg-violet-100 text-violet-700',
    contact: 'bg-emerald-100 text-emerald-700', device: 'bg-amber-100 text-amber-700',
    licence: 'bg-pink-100 text-pink-700', contract: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="border-b py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm">Custom fields</CardTitle>
              <p className="text-[11px] text-muted-foreground">
                Build any field you need on any object — tickets, assets, contacts, monitored devices, licences, contracts.
                Supports text, number, date, select, multi-select, boolean, URL, email and currency.
              </p>
            </div>
            <Button size="sm" className="bg-coral text-white hover:bg-coral-dark" onClick={() => setShowNew(true)}>
              <Plus className="h-3 w-3" />New custom field
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center gap-1 border-b px-4 py-2 text-xs">
            <span className="mr-1 text-[10px] uppercase tracking-wide text-muted-foreground">Show fields on</span>
            {(['all', 'ticket', 'asset', 'contact', 'device', 'licence', 'contract'] as const).map((e) => (
              <button key={e} type="button" onClick={() => setFilter(e)}
                className={cn('rounded-md px-2.5 py-0.5 font-medium capitalize transition-colors',
                  filter === e ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground')}>
                {e}
              </button>
            ))}
          </div>
          <ul className="divide-y">
            {shown.map((f) => (
              <li key={f.id} className={cn('px-4 py-3', !f.active && 'opacity-60')}>
                <div className="flex items-center gap-3">
                  <Sliders className="h-4 w-4 shrink-0 text-coral" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">{f.label}</p>
                      <span className={cn('rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide', entityColors[f.entity])}>
                        on {f.entity}
                      </span>
                      <Badge variant="outline" className="text-[9px] capitalize">{f.type}</Badge>
                      {f.required && <Badge variant="warning" className="text-[9px]">Required</Badge>}
                      {!f.active && <Badge variant="outline" className="text-[9px]">Hidden</Badge>}
                    </div>
                    {f.description && <p className="truncate text-[11px] text-muted-foreground">{f.description}</p>}
                    {f.options && f.options.length > 0 && (
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        Options: {f.options.slice(0, 6).join(' · ')}{f.options.length > 6 && ` (+${f.options.length - 6} more)`}
                      </p>
                    )}
                  </div>
                  <Switch checked={f.active} onCheckedChange={() => toggleActive(f.id)} />
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(f)}>
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600" onClick={() => remove(f.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            ))}
            {shown.length === 0 && (
              <li className="p-6 text-center text-xs text-muted-foreground">No custom fields yet for this entity.</li>
            )}
          </ul>
        </CardContent>
      </Card>

      <CustomFieldDialog
        open={showNew || !!editing}
        field={editing}
        onClose={() => { setShowNew(false); setEditing(null); }}
        onSave={upsert}
      />
    </div>
  );
}

function CustomFieldDialog({
  open, field, onClose, onSave,
}: {
  open: boolean;
  field: CustomField | null;
  onClose: () => void;
  onSave: (f: CustomField) => void;
}) {
  const [label, setLabel] = useState('');
  const [entity, setEntity] = useState<CustomFieldEntity>('ticket');
  const [type, setType] = useState<CustomFieldType>('text');
  const [description, setDescription] = useState('');
  const [required, setRequired] = useState(false);
  const [active, setActive] = useState(true);
  const [optionsText, setOptionsText] = useState('');

  useEffect(() => {
    if (!open) return;
    setLabel(field?.label ?? '');
    setEntity(field?.entity ?? 'ticket');
    setType(field?.type ?? 'text');
    setDescription(field?.description ?? '');
    setRequired(field?.required ?? false);
    setActive(field?.active ?? true);
    setOptionsText((field?.options ?? []).join('\n'));
  }, [open, field]);

  const handleSave = () => {
    if (!label.trim()) return;
    const opts = (type === 'select' || type === 'multiselect')
      ? optionsText.split('\n').map((s) => s.trim()).filter(Boolean)
      : undefined;
    onSave({
      id: field?.id ?? `cf-${Date.now()}`,
      label: label.trim(),
      entity, type, required, active,
      description: description.trim() || undefined,
      options: opts,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{field ? 'Edit custom field' : 'New custom field'}</DialogTitle>
          <DialogDescription>
            Define a custom field on any object in Topiadesk. Appears automatically in agent forms and the import field-mapping screen.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="cf-label" className="text-xs">Field label *</Label>
            <Input id="cf-label" autoFocus value={label} onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Floor number" className="h-9 text-xs" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Attach to</Label>
              <select value={entity} onChange={(e) => setEntity(e.target.value as CustomFieldEntity)}
                className="h-9 w-full rounded-md border bg-background px-2 text-xs">
                <option value="ticket">Tickets</option>
                <option value="asset">Assets</option>
                <option value="contact">Contacts</option>
                <option value="device">Monitored devices</option>
                <option value="licence">Licences</option>
                <option value="contract">Contracts</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Field type</Label>
              <select value={type} onChange={(e) => setType(e.target.value as CustomFieldType)}
                className="h-9 w-full rounded-md border bg-background px-2 text-xs">
                <option value="text">Single-line text</option>
                <option value="number">Number</option>
                <option value="currency">Currency amount</option>
                <option value="date">Date</option>
                <option value="select">Select (single)</option>
                <option value="multiselect">Multi-select</option>
                <option value="boolean">Yes / No toggle</option>
                <option value="url">URL</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>
          {(type === 'select' || type === 'multiselect') && (
            <div className="space-y-1.5">
              <Label htmlFor="cf-opts" className="text-xs">Options (one per line)</Label>
              <textarea id="cf-opts" value={optionsText} onChange={(e) => setOptionsText(e.target.value)}
                rows={5}
                placeholder={'Option A\nOption B\nOption C'}
                className="w-full rounded-md border bg-background px-2 py-1.5 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="cf-desc" className="text-xs">Help text</Label>
            <Input id="cf-desc" value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Shown under the field to guide the agent" className="h-9 text-xs" />
          </div>
          <div className="flex items-center justify-between rounded-md border bg-muted/30 p-3">
            <div className="pr-3">
              <p className="text-xs font-semibold">Required</p>
              <p className="text-[10px] text-muted-foreground">Block save until filled in.</p>
            </div>
            <Switch checked={required} onCheckedChange={setRequired} />
          </div>
          <div className="flex items-center justify-between rounded-md border bg-muted/30 p-3">
            <div className="pr-3"><p className="text-xs font-semibold">Visible to agents</p></div>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" className="bg-coral text-white hover:bg-coral-dark"
            disabled={!label.trim()} onClick={handleSave}>
            <Save className="h-3 w-3" />Save field
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

