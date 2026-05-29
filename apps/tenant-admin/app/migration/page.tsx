'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Database,
  Download,
  FileSpreadsheet,
  Globe,
  Headset,
  Layers,
  Link as LinkIcon,
  Loader2,
  Play,
  RefreshCw,
  Tag,
  Ticket,
  Upload,
  Users,
  XCircle,
  Zap,
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

// ─── Sources Topiadesk can migrate from ──────────────────────────────────────

interface MigrationSource {
  id: string;
  name: string;
  /** Short marketing line */
  blurb: string;
  /** Auth fields the connector needs */
  fields: { key: string; label: string; placeholder: string; type?: 'text' | 'password' }[];
  /** Tagline colour for the brand chip */
  color: string;
  /** Approx number of tenants Topiadesk has imported from this source already */
  importsCompleted: number;
  /** What objects this connector ports */
  scope: (
    | 'tickets' | 'categories' | 'contacts' | 'agents' | 'groups' | 'macros' | 'kb' | 'attachments'
    | 'assets'  | 'asset-history' | 'contracts' | 'licences'
    | 'devices' | 'sensors' | 'topology' | 'maintenance'
  )[];
  /** Coarse domain — controls which icon/section the card appears under */
  domain: 'helpdesk' | 'itam' | 'monitoring' | 'unified';
}

const SOURCES: MigrationSource[] = [
  // ── Helpdesk ──────────────────────────────────────────────────────────────
  {
    id: 'freshdesk', name: 'Freshdesk', blurb: 'Tickets, contacts, agents, groups, KB articles',
    color: '#25c16f', importsCompleted: 312, domain: 'helpdesk',
    fields: [
      { key: 'subdomain', label: 'Subdomain',  placeholder: 'acme (from acme.freshdesk.com)' },
      { key: 'apiKey',    label: 'API key',    placeholder: 'xxxxxxxxxxxxxxxx', type: 'password' },
    ],
    scope: ['tickets', 'categories', 'contacts', 'agents', 'groups', 'macros', 'kb', 'attachments'],
  },
  {
    id: 'zendesk', name: 'Zendesk', blurb: 'Tickets, organisations, agents, triggers, Help Center',
    color: '#03363d', importsCompleted: 287, domain: 'helpdesk',
    fields: [
      { key: 'subdomain', label: 'Subdomain', placeholder: 'acme (from acme.zendesk.com)' },
      { key: 'email',     label: 'Admin email', placeholder: 'admin@acme.com' },
      { key: 'apiToken',  label: 'API token', placeholder: 'xxxxxxxxxxxxxxxx', type: 'password' },
    ],
    scope: ['tickets', 'categories', 'contacts', 'agents', 'groups', 'macros', 'kb', 'attachments'],
  },
  {
    id: 'intercom', name: 'Intercom', blurb: 'Conversations, contacts, teammates, Help Center',
    color: '#1f8ded', importsCompleted: 94, domain: 'helpdesk',
    fields: [
      { key: 'accessToken', label: 'Access token', placeholder: 'dG9rOg…', type: 'password' },
    ],
    scope: ['tickets', 'contacts', 'agents', 'kb', 'attachments'],
  },
  {
    id: 'hubspot', name: 'HubSpot Service Hub', blurb: 'Tickets, contacts, conversations, knowledge base',
    color: '#ff7a59', importsCompleted: 68, domain: 'helpdesk',
    fields: [
      { key: 'accessToken', label: 'Private app token', placeholder: 'pat-eu1-…', type: 'password' },
    ],
    scope: ['tickets', 'contacts', 'agents', 'kb'],
  },

  // ── Unified (ITSM = helpdesk + ITAM, often both) ──────────────────────────
  {
    id: 'freshservice', name: 'Freshservice', blurb: 'Tickets, assets, contracts, software, requesters — full ITSM port',
    color: '#08c4b3', importsCompleted: 198, domain: 'unified',
    fields: [
      { key: 'subdomain', label: 'Subdomain', placeholder: 'acme (from acme.freshservice.com)' },
      { key: 'apiKey',    label: 'API key',   placeholder: 'xxxxxxxxxxxxxxxx', type: 'password' },
    ],
    scope: ['tickets', 'categories', 'contacts', 'agents', 'groups', 'kb', 'attachments',
            'assets', 'asset-history', 'contracts', 'licences'],
  },
  {
    id: 'jira', name: 'Jira Service Management', blurb: 'Issues, requests, Insight CMDB assets, KB',
    color: '#2684ff', importsCompleted: 142, domain: 'unified',
    fields: [
      { key: 'site',     label: 'Atlassian site', placeholder: 'acme.atlassian.net' },
      { key: 'email',    label: 'Account email',  placeholder: 'admin@acme.com' },
      { key: 'apiToken', label: 'API token',      placeholder: 'ATATT3…', type: 'password' },
    ],
    scope: ['tickets', 'categories', 'agents', 'groups', 'kb', 'assets', 'asset-history'],
  },
  {
    id: 'servicenow', name: 'ServiceNow', blurb: 'Incidents, requests, CMDB CIs, contracts, software',
    color: '#293e40', importsCompleted: 41, domain: 'unified',
    fields: [
      { key: 'instance', label: 'Instance URL', placeholder: 'acmedev.service-now.com' },
      { key: 'username', label: 'Username',     placeholder: 'integration.user' },
      { key: 'password', label: 'Password',     placeholder: '••••••••', type: 'password' },
    ],
    scope: ['tickets', 'categories', 'agents', 'groups',
            'assets', 'asset-history', 'contracts', 'licences'],
  },
  {
    id: 'manageengine-sdp', name: 'ManageEngine ServiceDesk Plus', blurb: 'Requests, problems, changes, CMDB assets, contracts',
    color: '#0072b8', importsCompleted: 28, domain: 'unified',
    fields: [
      { key: 'url',      label: 'Server URL', placeholder: 'sdp.acme.com:8080' },
      { key: 'apiKey',   label: 'API key',    placeholder: 'xxxxxxxxxxxxxxxx', type: 'password' },
    ],
    scope: ['tickets', 'categories', 'agents', 'groups',
            'assets', 'asset-history', 'contracts', 'licences'],
  },

  // ── Asset & inventory only (ITAM / CMDB) ──────────────────────────────────
  {
    id: 'snipeit', name: 'Snipe-IT', blurb: 'Open-source ITAM — assets, licences, accessories, consumables',
    color: '#f8a91b', importsCompleted: 87, domain: 'itam',
    fields: [
      { key: 'url',         label: 'Snipe-IT URL', placeholder: 'https://snipe.acme.com' },
      { key: 'accessToken', label: 'API token',    placeholder: 'eyJ0eXAi…', type: 'password' },
    ],
    scope: ['assets', 'asset-history', 'licences', 'contracts'],
  },
  {
    id: 'lansweeper', name: 'Lansweeper', blurb: 'Network-discovered assets, software inventory, warranty data',
    color: '#1d3957', importsCompleted: 54, domain: 'itam',
    fields: [
      { key: 'url',         label: 'Site URL', placeholder: 'https://lansweeper.acme.com' },
      { key: 'username',    label: 'Username', placeholder: 'svc-integration' },
      { key: 'password',    label: 'Password', placeholder: '••••••••', type: 'password' },
    ],
    scope: ['assets', 'asset-history', 'licences'],
  },
  {
    id: 'jamf', name: 'Jamf Pro', blurb: 'Apple device inventory, MDM-managed assets, configuration profiles',
    color: '#3c4956', importsCompleted: 36, domain: 'itam',
    fields: [
      { key: 'url',         label: 'Jamf URL',   placeholder: 'https://acme.jamfcloud.com' },
      { key: 'clientId',    label: 'Client ID',  placeholder: 'jamf-client-id' },
      { key: 'clientSecret',label: 'Client secret', placeholder: '••••••••', type: 'password' },
    ],
    scope: ['assets', 'asset-history'],
  },
  {
    id: 'intune', name: 'Microsoft Intune', blurb: 'Endpoint Manager-managed devices, compliance state',
    color: '#0078d4', importsCompleted: 62, domain: 'itam',
    fields: [
      { key: 'tenantId',     label: 'Azure tenant ID', placeholder: '00000000-0000-0000-0000-000000000000' },
      { key: 'clientId',     label: 'App registration client ID', placeholder: '…' },
      { key: 'clientSecret', label: 'Client secret', placeholder: '••••••••', type: 'password' },
    ],
    scope: ['assets', 'asset-history'],
  },

  // ── Network monitoring (devices, sensors, topology) ───────────────────────
  {
    id: 'prtg', name: 'PRTG Network Monitor', blurb: 'Devices, sensors, channels, alarms, topology groups',
    color: '#cd1719', importsCompleted: 73, domain: 'monitoring',
    fields: [
      { key: 'url',      label: 'PRTG URL',  placeholder: 'https://prtg.acme.com' },
      { key: 'username', label: 'Username',  placeholder: 'integration' },
      { key: 'passhash', label: 'Pass-hash', placeholder: '••••••••', type: 'password' },
    ],
    scope: ['devices', 'sensors', 'topology', 'maintenance'],
  },
  {
    id: 'librenms', name: 'LibreNMS', blurb: 'Open-source NMS — devices, ports, alerts, traffic data',
    color: '#11a984', importsCompleted: 41, domain: 'monitoring',
    fields: [
      { key: 'url',     label: 'LibreNMS URL', placeholder: 'https://librenms.acme.com' },
      { key: 'apiToken',label: 'API token',    placeholder: 'eyJ0…', type: 'password' },
    ],
    scope: ['devices', 'sensors', 'topology'],
  },
  {
    id: 'solarwinds', name: 'SolarWinds NPM/Orion', blurb: 'Nodes, interfaces, hardware health, NetPath topology',
    color: '#fe6f1f', importsCompleted: 24, domain: 'monitoring',
    fields: [
      { key: 'url',      label: 'Orion server URL', placeholder: 'https://orion.acme.com' },
      { key: 'username', label: 'Username',         placeholder: 'orion-svc' },
      { key: 'password', label: 'Password',         placeholder: '••••••••', type: 'password' },
    ],
    scope: ['devices', 'sensors', 'topology', 'maintenance'],
  },
  {
    id: 'datadog', name: 'Datadog Infrastructure', blurb: 'Hosts, integrations, monitors, dashboards',
    color: '#632ca6', importsCompleted: 38, domain: 'monitoring',
    fields: [
      { key: 'apiKey', label: 'API key', placeholder: '…', type: 'password' },
      { key: 'appKey', label: 'App key', placeholder: '…', type: 'password' },
    ],
    scope: ['devices', 'sensors'],
  },
  {
    id: 'zabbix', name: 'Zabbix', blurb: 'Hosts, items, triggers, host groups, maintenance windows',
    color: '#dc2727', importsCompleted: 32, domain: 'monitoring',
    fields: [
      { key: 'url',      label: 'API URL',  placeholder: 'https://zabbix.acme.com/api_jsonrpc.php' },
      { key: 'username', label: 'Username', placeholder: 'topiadesk-import' },
      { key: 'password', label: 'Password', placeholder: '••••••••', type: 'password' },
    ],
    scope: ['devices', 'sensors', 'maintenance'],
  },

  // ── Generic CSV/Excel ──────────────────────────────────────────────────────
  {
    id: 'csv', name: 'CSV / Excel upload', blurb: 'Bring tickets, contacts, assets or devices from any system',
    color: '#475569', importsCompleted: 156, domain: 'unified',
    fields: [],
    scope: ['tickets', 'categories', 'contacts', 'agents',
            'assets', 'licences', 'contracts',
            'devices', 'sensors'],
  },
];

// ─── Default field mappings — what we ship out of the box ────────────────────

interface FieldMapping {
  topiadeskField: string;
  sourceField: string;
  transform?: 'lowercase' | 'priority-map' | 'status-map' | 'date-iso';
  required?: boolean;
}

const DEFAULT_MAPPINGS: Record<string, FieldMapping[]> = {
  freshdesk: [
    { topiadeskField: 'number',       sourceField: 'id',           required: true },
    { topiadeskField: 'subject',      sourceField: 'subject',      required: true },
    { topiadeskField: 'description',  sourceField: 'description_text', required: true },
    { topiadeskField: 'status',       sourceField: 'status',       transform: 'status-map',   required: true },
    { topiadeskField: 'priority',     sourceField: 'priority',     transform: 'priority-map', required: true },
    { topiadeskField: 'category',     sourceField: 'type',                                        required: true },
    { topiadeskField: 'subcategory',  sourceField: 'custom_fields.sub_category' },
    { topiadeskField: 'requester',    sourceField: 'requester.email', required: true },
    { topiadeskField: 'assignee',     sourceField: 'responder.email' },
    { topiadeskField: 'group',        sourceField: 'group.name' },
    { topiadeskField: 'createdAt',    sourceField: 'created_at',   transform: 'date-iso', required: true },
    { topiadeskField: 'updatedAt',    sourceField: 'updated_at',   transform: 'date-iso' },
    { topiadeskField: 'tags',         sourceField: 'tags' },
    { topiadeskField: 'attachments',  sourceField: 'attachments' },
  ],
  zendesk: [
    { topiadeskField: 'number',       sourceField: 'id',                       required: true },
    { topiadeskField: 'subject',      sourceField: 'subject',                  required: true },
    { topiadeskField: 'description',  sourceField: 'description',              required: true },
    { topiadeskField: 'status',       sourceField: 'status', transform: 'status-map', required: true },
    { topiadeskField: 'priority',     sourceField: 'priority', transform: 'priority-map' },
    { topiadeskField: 'category',     sourceField: 'type' },
    { topiadeskField: 'requester',    sourceField: 'requester.email',          required: true },
    { topiadeskField: 'assignee',     sourceField: 'assignee.email' },
    { topiadeskField: 'group',        sourceField: 'group.name' },
    { topiadeskField: 'createdAt',    sourceField: 'created_at', transform: 'date-iso', required: true },
    { topiadeskField: 'tags',         sourceField: 'tags' },
  ],
  intercom: [
    { topiadeskField: 'number',      sourceField: 'id',                required: true },
    { topiadeskField: 'subject',     sourceField: 'source.subject',    required: true },
    { topiadeskField: 'description', sourceField: 'source.body',       required: true },
    { topiadeskField: 'status',      sourceField: 'state', transform: 'status-map', required: true },
    { topiadeskField: 'requester',   sourceField: 'contacts.contacts.0.email', required: true },
    { topiadeskField: 'assignee',    sourceField: 'admin_assignee_id' },
    { topiadeskField: 'createdAt',   sourceField: 'created_at', transform: 'date-iso', required: true },
  ],
  jira: [
    { topiadeskField: 'number',      sourceField: 'key',                       required: true },
    { topiadeskField: 'subject',     sourceField: 'fields.summary',            required: true },
    { topiadeskField: 'description', sourceField: 'fields.description',        required: true },
    { topiadeskField: 'status',      sourceField: 'fields.status.name', transform: 'status-map' },
    { topiadeskField: 'priority',    sourceField: 'fields.priority.name', transform: 'priority-map' },
    { topiadeskField: 'requester',   sourceField: 'fields.reporter.emailAddress', required: true },
    { topiadeskField: 'assignee',    sourceField: 'fields.assignee.emailAddress' },
    { topiadeskField: 'createdAt',   sourceField: 'fields.created', transform: 'date-iso', required: true },
    { topiadeskField: 'tags',        sourceField: 'fields.labels' },
  ],
  hubspot: [
    { topiadeskField: 'number',      sourceField: 'hs_ticket_id',         required: true },
    { topiadeskField: 'subject',     sourceField: 'subject',              required: true },
    { topiadeskField: 'description', sourceField: 'content',              required: true },
    { topiadeskField: 'status',      sourceField: 'hs_pipeline_stage', transform: 'status-map' },
    { topiadeskField: 'priority',    sourceField: 'hs_ticket_priority', transform: 'priority-map' },
    { topiadeskField: 'category',    sourceField: 'hs_ticket_category' },
    { topiadeskField: 'createdAt',   sourceField: 'createdate', transform: 'date-iso', required: true },
  ],
  servicenow: [
    { topiadeskField: 'number',      sourceField: 'number',          required: true },
    { topiadeskField: 'subject',     sourceField: 'short_description', required: true },
    { topiadeskField: 'description', sourceField: 'description',     required: true },
    { topiadeskField: 'status',      sourceField: 'state', transform: 'status-map' },
    { topiadeskField: 'priority',    sourceField: 'priority', transform: 'priority-map' },
    { topiadeskField: 'category',    sourceField: 'category' },
    { topiadeskField: 'subcategory', sourceField: 'subcategory' },
    { topiadeskField: 'requester',   sourceField: 'caller_id.email', required: true },
    { topiadeskField: 'assignee',    sourceField: 'assigned_to.email' },
    { topiadeskField: 'createdAt',   sourceField: 'sys_created_on', transform: 'date-iso', required: true },
  ],
  csv: [
    { topiadeskField: 'number',      sourceField: 'ticket_number', required: true },
    { topiadeskField: 'subject',     sourceField: 'subject',       required: true },
    { topiadeskField: 'description', sourceField: 'body',          required: true },
    { topiadeskField: 'status',      sourceField: 'status' },
    { topiadeskField: 'priority',    sourceField: 'priority' },
    { topiadeskField: 'category',    sourceField: 'category' },
    { topiadeskField: 'requester',   sourceField: 'requester_email', required: true },
    { topiadeskField: 'createdAt',   sourceField: 'created_at', transform: 'date-iso', required: true },
  ],
};

const TOPIADESK_FIELDS = [
  // ticket fields
  'number', 'subject', 'description',
  'status', 'priority', 'category', 'subcategory',
  'requester', 'assignee', 'group',
  'createdAt', 'updatedAt', 'tags', 'attachments',
  // asset fields
  'asset.tag', 'asset.name', 'asset.category', 'asset.vendor', 'asset.model',
  'asset.serial', 'asset.location', 'asset.owner', 'asset.status',
  'asset.purchaseDate', 'asset.warrantyExpiry', 'asset.cost',
  // device fields (monitoring)
  'device.name', 'device.ip', 'device.type', 'device.site',
  'device.group', 'device.vendor', 'device.model', 'device.os',
  'device.uptimePct', 'device.sensors',
];

// ─── Default ASSET mappings ─────────────────────────────────────────────────

const ASSET_MAPPINGS: Record<string, FieldMapping[]> = {
  freshservice: [
    { topiadeskField: 'asset.tag',            sourceField: 'asset_tag',      required: true },
    { topiadeskField: 'asset.name',           sourceField: 'name',           required: true },
    { topiadeskField: 'asset.category',       sourceField: 'asset_type.name' },
    { topiadeskField: 'asset.vendor',         sourceField: 'vendor.name' },
    { topiadeskField: 'asset.model',          sourceField: 'product.name' },
    { topiadeskField: 'asset.serial',         sourceField: 'serial_number' },
    { topiadeskField: 'asset.location',       sourceField: 'location.name' },
    { topiadeskField: 'asset.owner',          sourceField: 'user.email' },
    { topiadeskField: 'asset.status',         sourceField: 'asset_state' },
    { topiadeskField: 'asset.purchaseDate',   sourceField: 'acquisition_date', transform: 'date-iso' },
    { topiadeskField: 'asset.warrantyExpiry', sourceField: 'warranty_expiry_date', transform: 'date-iso' },
    { topiadeskField: 'asset.cost',           sourceField: 'cost' },
  ],
  servicenow: [
    { topiadeskField: 'asset.tag',            sourceField: 'asset_tag',         required: true },
    { topiadeskField: 'asset.name',           sourceField: 'display_name',      required: true },
    { topiadeskField: 'asset.category',       sourceField: 'sys_class_name' },
    { topiadeskField: 'asset.vendor',         sourceField: 'manufacturer.name' },
    { topiadeskField: 'asset.model',          sourceField: 'model_id.display_value' },
    { topiadeskField: 'asset.serial',         sourceField: 'serial_number' },
    { topiadeskField: 'asset.location',       sourceField: 'location.display_value' },
    { topiadeskField: 'asset.owner',          sourceField: 'assigned_to.email' },
    { topiadeskField: 'asset.status',         sourceField: 'install_status' },
    { topiadeskField: 'asset.purchaseDate',   sourceField: 'purchase_date', transform: 'date-iso' },
    { topiadeskField: 'asset.warrantyExpiry', sourceField: 'warranty_expiration', transform: 'date-iso' },
  ],
  snipeit: [
    { topiadeskField: 'asset.tag',            sourceField: 'asset_tag',           required: true },
    { topiadeskField: 'asset.name',           sourceField: 'name',                required: true },
    { topiadeskField: 'asset.category',       sourceField: 'category.name' },
    { topiadeskField: 'asset.vendor',         sourceField: 'manufacturer.name' },
    { topiadeskField: 'asset.model',          sourceField: 'model.name' },
    { topiadeskField: 'asset.serial',         sourceField: 'serial' },
    { topiadeskField: 'asset.location',       sourceField: 'location.name' },
    { topiadeskField: 'asset.owner',          sourceField: 'assigned_to.email' },
    { topiadeskField: 'asset.status',         sourceField: 'status_label.name' },
    { topiadeskField: 'asset.purchaseDate',   sourceField: 'purchase_date', transform: 'date-iso' },
    { topiadeskField: 'asset.warrantyExpiry', sourceField: 'warranty_expires', transform: 'date-iso' },
    { topiadeskField: 'asset.cost',           sourceField: 'purchase_cost' },
  ],
  lansweeper: [
    { topiadeskField: 'asset.tag',      sourceField: 'AssetID',     required: true },
    { topiadeskField: 'asset.name',     sourceField: 'AssetName',   required: true },
    { topiadeskField: 'asset.category', sourceField: 'AssetType' },
    { topiadeskField: 'asset.vendor',   sourceField: 'Manufacturer' },
    { topiadeskField: 'asset.model',    sourceField: 'Model' },
    { topiadeskField: 'asset.serial',   sourceField: 'SerialNumber' },
    { topiadeskField: 'asset.location', sourceField: 'Location' },
    { topiadeskField: 'asset.warrantyExpiry', sourceField: 'WarrantyEnd', transform: 'date-iso' },
  ],
  jamf: [
    { topiadeskField: 'asset.tag',    sourceField: 'general.asset_tag',     required: true },
    { topiadeskField: 'asset.name',   sourceField: 'general.name',          required: true },
    { topiadeskField: 'asset.vendor', sourceField: '__literal:Apple' },
    { topiadeskField: 'asset.model',  sourceField: 'hardware.model' },
    { topiadeskField: 'asset.serial', sourceField: 'general.serial_number' },
    { topiadeskField: 'asset.owner',  sourceField: 'location.email_address' },
    { topiadeskField: 'asset.purchaseDate', sourceField: 'purchasing.po_date', transform: 'date-iso' },
  ],
  intune: [
    { topiadeskField: 'asset.tag',    sourceField: 'azureADDeviceId', required: true },
    { topiadeskField: 'asset.name',   sourceField: 'deviceName',      required: true },
    { topiadeskField: 'asset.vendor', sourceField: 'manufacturer' },
    { topiadeskField: 'asset.model',  sourceField: 'model' },
    { topiadeskField: 'asset.serial', sourceField: 'serialNumber' },
    { topiadeskField: 'asset.owner',  sourceField: 'userPrincipalName' },
    { topiadeskField: 'asset.status', sourceField: 'complianceState' },
  ],
};

// ─── Default DEVICE / SENSOR mappings (monitoring) ──────────────────────────

const DEVICE_MAPPINGS: Record<string, FieldMapping[]> = {
  prtg: [
    { topiadeskField: 'device.name',    sourceField: 'device',      required: true },
    { topiadeskField: 'device.ip',      sourceField: 'host',        required: true },
    { topiadeskField: 'device.type',    sourceField: 'devicetype' },
    { topiadeskField: 'device.site',    sourceField: 'group',       required: true },
    { topiadeskField: 'device.group',   sourceField: 'tags' },
    { topiadeskField: 'device.uptimePct', sourceField: 'uptime' },
    { topiadeskField: 'device.sensors', sourceField: 'sensors' },
  ],
  librenms: [
    { topiadeskField: 'device.name',  sourceField: 'hostname',     required: true },
    { topiadeskField: 'device.ip',    sourceField: 'ip',           required: true },
    { topiadeskField: 'device.type',  sourceField: 'type' },
    { topiadeskField: 'device.site',  sourceField: 'location' },
    { topiadeskField: 'device.vendor',sourceField: 'sysVendor' },
    { topiadeskField: 'device.model', sourceField: 'hardware' },
    { topiadeskField: 'device.os',    sourceField: 'os' },
  ],
  solarwinds: [
    { topiadeskField: 'device.name',  sourceField: 'NodeName',     required: true },
    { topiadeskField: 'device.ip',    sourceField: 'IPAddress',    required: true },
    { topiadeskField: 'device.vendor',sourceField: 'Vendor' },
    { topiadeskField: 'device.model', sourceField: 'MachineType' },
    { topiadeskField: 'device.uptimePct', sourceField: 'PercentMemoryUsed' },
  ],
  datadog: [
    { topiadeskField: 'device.name', sourceField: 'host_name', required: true },
    { topiadeskField: 'device.ip',   sourceField: 'aws.private_ip' },
    { topiadeskField: 'device.os',   sourceField: 'platform' },
  ],
  zabbix: [
    { topiadeskField: 'device.name',  sourceField: 'host',     required: true },
    { topiadeskField: 'device.ip',    sourceField: 'interfaces.0.ip', required: true },
    { topiadeskField: 'device.group', sourceField: 'groups.0.name' },
  ],
};

// ─── Page ────────────────────────────────────────────────────────────────────

type Step = 'pick-source' | 'connect' | 'map' | 'preview' | 'run' | 'done';

interface RunningJob {
  startedAt: string;
  source: string;
  total: number;
  processed: number;
  failed: number;
  current?: string;
}

export default function MigrationPage() {
  const [step, setStep] = useState<Step>('pick-source');
  const [source, setSource] = useState<MigrationSource | null>(null);
  const [creds, setCreds] = useState<Record<string, string>>({});
  const [tested, setTested] = useState<'idle' | 'testing' | 'ok' | 'fail'>('idle');
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const [opts, setOpts] = useState({
    includeAttachments: true,
    includeClosed: true,
    preserveDates: true,
    notifyRequesters: false,
    importKB: true,
    importMacros: false,
  });
  const [job, setJob] = useState<RunningJob | null>(null);

  // When the user picks a source, seed mappings — ticket + asset + device defaults combined
  useEffect(() => {
    if (!source) return;
    const ticketMap = DEFAULT_MAPPINGS[source.id] ?? [];
    const assetMap  = ASSET_MAPPINGS[source.id]  ?? [];
    const devMap    = DEVICE_MAPPINGS[source.id] ?? [];
    setMappings([...ticketMap, ...assetMap, ...devMap]);
    setCreds({});
    setTested('idle');
  }, [source]);

  // Animate the dry-run progress while step === 'run'
  useEffect(() => {
    if (step !== 'run') return;
    const total = 1284;
    let processed = 0;
    let failed = 0;
    setJob({ startedAt: new Date().toISOString(), source: source?.name ?? '', total, processed: 0, failed: 0 });
    const tick = setInterval(() => {
      processed = Math.min(total, processed + Math.floor(Math.random() * 28) + 12);
      if (Math.random() < 0.05) failed += 1;
      setJob((j) => j && ({ ...j, processed, failed, current: SAMPLE_SUBJECTS[Math.floor(Math.random() * SAMPLE_SUBJECTS.length)] }));
      if (processed >= total) {
        clearInterval(tick);
        setTimeout(() => setStep('done'), 400);
      }
    }, 220);
    return () => clearInterval(tick);
  }, [step, source]);

  const reset = () => {
    setStep('pick-source');
    setSource(null);
    setCreds({});
    setMappings([]);
    setJob(null);
    setTested('idle');
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      <div className="shrink-0 p-5 pb-0">
        <header className="topiadesk-hero relative overflow-hidden rounded-2xl px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Workspace</p>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">Migrate to Topiadesk</h1>
              <p className="mt-0.5 text-sm text-white/70">
                Bring your tickets, contacts, agents and knowledge base across from your old helpdesk in one guided flow.
              </p>
            </div>
            {step !== 'pick-source' && step !== 'done' && (
              <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20" onClick={reset}>
                Start over
              </Button>
            )}
          </div>
        </header>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        {/* Stepper */}
        <Stepper step={step} />

        <div className="mt-5">
          {step === 'pick-source' && (
            <PickSourceStep onPick={(s) => { setSource(s); setStep('connect'); }} />
          )}
          {step === 'connect' && source && (
            <ConnectStep
              source={source}
              creds={creds}
              setCreds={setCreds}
              tested={tested}
              setTested={setTested}
              onBack={() => setStep('pick-source')}
              onNext={() => setStep('map')}
            />
          )}
          {step === 'map' && source && (
            <MapStep
              source={source}
              mappings={mappings}
              setMappings={setMappings}
              opts={opts}
              setOpts={setOpts}
              onBack={() => setStep('connect')}
              onNext={() => setStep('preview')}
            />
          )}
          {step === 'preview' && source && (
            <PreviewStep
              source={source}
              mappings={mappings}
              opts={opts}
              onBack={() => setStep('map')}
              onRun={() => setStep('run')}
            />
          )}
          {step === 'run' && job && (
            <RunStep job={job} />
          )}
          {step === 'done' && job && (
            <DoneStep job={job} onMigrateAnother={reset} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step bar ────────────────────────────────────────────────────────────────

const STEPS: { k: Step; label: string }[] = [
  { k: 'pick-source', label: 'Pick source' },
  { k: 'connect',     label: 'Connect' },
  { k: 'map',         label: 'Map fields' },
  { k: 'preview',     label: 'Preview' },
  { k: 'run',         label: 'Run import' },
  { k: 'done',        label: 'Done' },
];

function Stepper({ step }: { step: Step }) {
  const idx = STEPS.findIndex((s) => s.k === step);
  return (
    <ol className="flex flex-wrap items-center gap-1 rounded-xl border border-border/70 bg-card px-4 py-2.5">
      {STEPS.map((s, i) => {
        const done   = i < idx;
        const active = i === idx;
        return (
          <li key={s.k} className="flex items-center gap-1">
            <span className={cn(
              'inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
              done   ? 'bg-emerald-500 text-white' :
              active ? 'bg-coral text-white' :
                       'bg-muted text-muted-foreground',
            )}>
              {done ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            <span className={cn('text-[11px] font-medium',
              active ? 'text-foreground' : 'text-muted-foreground')}>
              {s.label}
            </span>
            {i < STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground/40" />}
          </li>
        );
      })}
    </ol>
  );
}

// ─── Step 1: pick source ─────────────────────────────────────────────────────

const DOMAIN_META: Record<MigrationSource['domain'], { label: string; tag: string; desc: string }> = {
  helpdesk:   { label: 'Helpdesk only',                 tag: 'Tickets / contacts / KB',          desc: 'Tickets, contacts, agents, groups, macros, knowledge base, attachments' },
  unified:    { label: 'Unified ITSM (tickets + assets)', tag: 'Tickets + CMDB',                desc: 'Full ITSM port — helpdesk plus assets, contracts, licences' },
  itam:       { label: 'IT asset management',           tag: 'Assets / CMDB',                    desc: 'Asset inventory, lifecycle, contracts, licences, accessories' },
  monitoring: { label: 'Network monitoring',            tag: 'Devices / sensors / topology',     desc: 'Monitored devices, sensors, topology, alerts, maintenance windows' },
};

function PickSourceStep({ onPick }: { onPick: (s: MigrationSource) => void }) {
  const grouped = useMemo(() => {
    const m: Record<MigrationSource['domain'], MigrationSource[]> = { helpdesk: [], unified: [], itam: [], monitoring: [] };
    for (const s of SOURCES) m[s.domain].push(s);
    return m;
  }, []);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-blue-50/40 p-4 dark:bg-blue-950/20">
        <div className="flex items-start gap-3">
          <Zap className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
          <div className="text-xs">
            <p className="font-semibold text-blue-900 dark:text-blue-100">Lossless 1:1 migration — helpdesk, assets & monitoring</p>
            <p className="mt-0.5 text-blue-800/80 dark:text-blue-200/80">
              Topiadesk preserves IDs, timestamps, conversation order, attachments, requester &amp; agent identity, asset history,
              warranty &amp; contract data, and monitoring topology. Email threads keep working, asset tags survive, and device
              sensors keep ticking — no downtime.
            </p>
          </div>
        </div>
      </div>

      {(['unified', 'helpdesk', 'itam', 'monitoring'] as const).map((domain) => {
        const list = grouped[domain];
        if (list.length === 0) return null;
        const meta = DOMAIN_META[domain];
        return (
          <section key={domain} className="space-y-2">
            <div className="flex flex-wrap items-baseline gap-2">
              <h3 className="font-display text-sm font-bold">{meta.label}</h3>
              <Badge variant="secondary" className="text-[10px]">{meta.tag}</Badge>
              <span className="text-[11px] text-muted-foreground">— {meta.desc}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onPick(s)}
                  className="group rounded-xl border bg-card p-4 text-left transition-all hover:border-coral hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-lg text-base font-black text-white"
                      style={{ background: s.color }}>
                      {s.name.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold">{s.name}</p>
                      <p className="text-[10px] text-muted-foreground">{s.importsCompleted} imports completed</p>
                    </div>
                    <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="mt-3 text-[11px] text-muted-foreground">{s.blurb}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {s.scope.map((sc) => (
                      <Badge key={sc} variant="outline" className="text-[9px] capitalize">{sc.replace('-', ' ')}</Badge>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

// ─── Step 2: connect ─────────────────────────────────────────────────────────

function ConnectStep({
  source, creds, setCreds, tested, setTested, onBack, onNext,
}: {
  source: MigrationSource;
  creds: Record<string, string>;
  setCreds: (c: Record<string, string>) => void;
  tested: 'idle' | 'testing' | 'ok' | 'fail';
  setTested: (s: 'idle' | 'testing' | 'ok' | 'fail') => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const allFilled = source.fields.length === 0 || source.fields.every((f) => (creds[f.key] ?? '').trim());

  const test = () => {
    setTested('testing');
    setTimeout(() => setTested('ok'), 1100);
  };

  if (source.id === 'csv') {
    return (
      <Card>
        <CardHeader className="border-b py-3">
          <CardTitle className="text-sm">Upload your CSV exports</CardTitle>
          <p className="text-[11px] text-muted-foreground">
            Export from your old system as CSV. Topiadesk parses the columns and lets you map them on the next step.
          </p>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { name: 'Tickets',     filename: 'tickets.csv',     required: false, desc: 'One row per ticket. Subject, description, status, requester email, created date.' },
              { name: 'Contacts',    filename: 'contacts.csv',    required: false, desc: 'One row per customer. Name, email, phone, company.' },
              { name: 'Agents',      filename: 'agents.csv',      required: false, desc: 'One row per agent. Name, email, group.' },
              { name: 'Assets',      filename: 'assets.csv',      required: false, desc: 'Asset tag, name, category, vendor, model, serial, location, owner, warranty.' },
              { name: 'Licences',    filename: 'licences.csv',    required: false, desc: 'Software licences — name, key, seats, vendor, expiry, assigned assets.' },
              { name: 'Contracts',   filename: 'contracts.csv',   required: false, desc: 'Vendor contracts — number, vendor, start, end, value, linked assets.' },
              { name: 'Devices',     filename: 'devices.csv',     required: false, desc: 'Monitored devices — name, IP, type, site, group, vendor, model, OS.' },
              { name: 'Attachments', filename: 'attachments.zip', required: false, desc: 'Zip archive of attachments referenced by filename in the ticket/asset CSV.' },
            ].map((f) => (
              <div key={f.name} className="rounded-md border border-dashed bg-background p-4">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-coral" />
                  <span className="text-sm font-semibold">{f.name}</span>
                  {f.required && <Badge variant="warning" className="text-[9px]">Required</Badge>}
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">{f.desc}</p>
                <Button variant="outline" size="sm" className="mt-2 h-7 text-[11px]">
                  <Upload className="h-3 w-3" />Choose {f.filename}
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between">
            <Button variant="outline" size="sm" onClick={onBack}>Back</Button>
            <Button size="sm" className="bg-coral text-white hover:bg-coral-dark" onClick={onNext}>
              Continue
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b py-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm">Connect to {source.name}</CardTitle>
            <p className="text-[11px] text-muted-foreground">We use this only to read tickets — no data is modified on your old system.</p>
          </div>
          <span className="grid h-9 w-9 place-items-center rounded-lg text-sm font-black text-white"
            style={{ background: source.color }}>
            {source.name.charAt(0)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-5">
        {source.fields.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <Label htmlFor={f.key} className="text-xs">{f.label}</Label>
            <Input
              id={f.key}
              type={f.type ?? 'text'}
              value={creds[f.key] ?? ''}
              onChange={(e) => setCreds({ ...creds, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              className={cn('h-9 text-xs', f.type === 'password' && 'font-mono')}
            />
          </div>
        ))}

        <div className="flex items-center gap-2 rounded-md border bg-muted/30 p-3">
          <LinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="flex-1 text-[11px] text-muted-foreground">
            Need help finding your API key?
            <a href="#" className="ml-1 text-primary hover:underline">View {source.name} guide</a>
          </span>
        </div>

        {tested === 'ok' && (
          <div className="flex items-center gap-2 rounded-md border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>
              Connection successful. Found{' '}
              {source.scope.includes('tickets')  && <><strong>1,284 tickets</strong>, </>}
              {source.scope.includes('contacts') && <><strong>317 contacts</strong>, </>}
              {source.scope.includes('agents')   && <><strong>12 agents</strong>, </>}
              {source.scope.includes('assets')   && <><strong>2,841 assets</strong>, </>}
              {source.scope.includes('contracts')&& <><strong>54 contracts</strong>, </>}
              {source.scope.includes('licences') && <><strong>187 licences</strong>, </>}
              {source.scope.includes('devices')  && <><strong>421 monitored devices</strong>, </>}
              {source.scope.includes('sensors')  && <><strong>3,612 sensors</strong>, </>}
              {source.scope.includes('kb')       && <><strong>84 KB articles</strong>.</>}
            </span>
          </div>
        )}
        {tested === 'fail' && (
          <div className="flex items-center gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-xs text-red-900">
            <XCircle className="h-3.5 w-3.5" />Connection failed — check your credentials.
          </div>
        )}
        <div className="flex justify-between gap-2 pt-1">
          <Button variant="outline" size="sm" onClick={onBack}>Back</Button>
          <div className="flex gap-2">
            <Button
              variant="outline" size="sm"
              disabled={!allFilled || tested === 'testing'}
              onClick={test}
            >
              {tested === 'testing'
                ? <><Loader2 className="h-3 w-3 animate-spin" />Testing…</>
                : <><RefreshCw className="h-3 w-3" />Test connection</>}
            </Button>
            <Button
              size="sm"
              className="bg-coral text-white hover:bg-coral-dark"
              disabled={tested !== 'ok'}
              onClick={onNext}
            >
              Continue<ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Step 3: map fields ──────────────────────────────────────────────────────

function MapStep({
  source, mappings, setMappings, opts, setOpts, onBack, onNext,
}: {
  source: MigrationSource;
  mappings: FieldMapping[];
  setMappings: (m: FieldMapping[]) => void;
  opts: {
    includeAttachments: boolean; includeClosed: boolean; preserveDates: boolean;
    notifyRequesters: boolean; importKB: boolean; importMacros: boolean;
  };
  setOpts: (next: typeof opts) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const updateMapping = (i: number, patch: Partial<FieldMapping>) =>
    setMappings(mappings.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="border-b py-3">
          <CardTitle className="text-sm">Field mapping</CardTitle>
          <p className="text-[11px] text-muted-foreground">
            Defaults are based on Topiadesk's verified mapping for {source.name}. Tweak anything you've customised on your side.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 text-left text-muted-foreground">
              <tr className="border-b">
                <th className="px-4 py-2 font-semibold">Topiadesk field</th>
                <th className="px-3 py-2 font-semibold">{source.name} field</th>
                <th className="px-3 py-2 font-semibold">Transform</th>
                <th className="px-3 py-2 font-semibold text-center">Required</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mappings.map((m, i) => (
                <tr key={m.topiadeskField} className="hover:bg-muted/20">
                  <td className="px-4 py-2">
                    <code className="font-mono text-[11px] font-semibold">{m.topiadeskField}</code>
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      value={m.sourceField}
                      onChange={(e) => updateMapping(i, { sourceField: e.target.value })}
                      className="h-7 font-mono text-[11px]"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={m.transform ?? ''}
                      onChange={(e) => updateMapping(i, { transform: (e.target.value || undefined) as FieldMapping['transform'] })}
                      className="h-7 w-full rounded-md border bg-background px-1.5 text-[11px]"
                    >
                      <option value="">None (pass-through)</option>
                      <option value="status-map">Map → Topiadesk status</option>
                      <option value="priority-map">Map → Topiadesk priority</option>
                      <option value="date-iso">Parse → ISO date</option>
                      <option value="lowercase">Lowercase</option>
                    </select>
                  </td>
                  <td className="px-3 py-2 text-center">
                    {m.required ? <CheckCircle2 className="mx-auto h-3.5 w-3.5 text-emerald-600" /> :
                                   <span className="text-muted-foreground/40">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t bg-muted/20 px-4 py-2.5">
            <Button variant="outline" size="sm" className="h-7 text-[11px]"
              onClick={() => setMappings([...mappings, { topiadeskField: TOPIADESK_FIELDS[0]!, sourceField: '' }])}>
              + Add custom mapping
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b py-3">
          <CardTitle className="text-sm">Migration options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-5">
          {([
            { k: 'includeAttachments' as const, label: 'Import attachments',      desc: 'Copy attachments to Topiadesk object storage. Disable for a faster ticket-only run.' },
            { k: 'includeClosed' as const,      label: 'Include closed tickets',  desc: 'Bring in historical closed tickets so your reports stay accurate.' },
            { k: 'preserveDates' as const,      label: 'Preserve original dates', desc: 'Created/updated timestamps come from the source instead of the import time.' },
            { k: 'notifyRequesters' as const,   label: 'Email requesters',       desc: 'Send each customer a "your ticket has moved" notification. Off by default.' },
            { k: 'importKB' as const,           label: 'Import knowledge base',   desc: 'Bring across help articles, sections and categories.', show: source.scope.includes('kb') },
            { k: 'importMacros' as const,       label: 'Import macros / canned',  desc: 'Bring across saved replies.',                          show: source.scope.includes('macros') },
          ] as { k: keyof typeof opts; label: string; desc: string; show?: boolean }[]).map((o) => {
            if (o.show === false) return null;
            return (
              <div key={o.k} className="flex items-center justify-between rounded-md border bg-background p-3">
                <div className="pr-3">
                  <p className="text-xs font-semibold">{o.label}</p>
                  <p className="text-[10px] text-muted-foreground">{o.desc}</p>
                </div>
                <Switch checked={opts[o.k]} onCheckedChange={(v) => setOpts({ ...opts, [o.k]: v })} />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onBack}>Back</Button>
        <Button size="sm" className="bg-coral text-white hover:bg-coral-dark" onClick={onNext}>
          Preview run<ArrowRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

// ─── Step 4: preview / dry-run ───────────────────────────────────────────────

function PreviewStep({
  source, mappings, opts, onBack, onRun,
}: {
  source: MigrationSource;
  mappings: FieldMapping[];
  opts: { includeAttachments: boolean; includeClosed: boolean; preserveDates: boolean; notifyRequesters: boolean; importKB: boolean; importMacros: boolean };
  onBack: () => void;
  onRun: () => void;
}) {
  const sample = useMemo(() => SAMPLE_PREVIEW.slice(0, 5), []);
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {source.scope.includes('tickets')  && <StatTile icon={Ticket}         label="Tickets"            value="1,284" />}
        {source.scope.includes('contacts') && <StatTile icon={Users}          label="Contacts"           value="317" />}
        {source.scope.includes('agents')   && <StatTile icon={Headset}        label="Agents"             value="12" />}
        {source.scope.includes('assets')   && <StatTile icon={Layers}         label="Assets"             value="2,841" />}
        {source.scope.includes('contracts')&& <StatTile icon={FileSpreadsheet} label="Contracts"          value="54" />}
        {source.scope.includes('licences') && <StatTile icon={Tag}            label="Licences"           value="187" />}
        {source.scope.includes('devices')  && <StatTile icon={Globe}          label="Monitored devices"  value="421" />}
        {source.scope.includes('sensors')  && <StatTile icon={Database}       label="Sensors"            value="3,612" />}
        {source.scope.includes('kb')       && <StatTile icon={Database}       label="KB articles"        value="84" />}
        {opts.includeAttachments && source.scope.includes('attachments') && <StatTile icon={Database} label="Attachments" value="2,418" />}
      </div>

      <Card>
        <CardHeader className="border-b py-3">
          <CardTitle className="text-sm">First 5 tickets — preview</CardTitle>
          <p className="text-[11px] text-muted-foreground">Spot-check the transformations before committing.</p>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 text-left text-muted-foreground">
              <tr className="border-b">
                <th className="px-3 py-2 font-semibold">Source ID</th>
                <th className="px-3 py-2 font-semibold">Subject</th>
                <th className="px-3 py-2 font-semibold">Status (mapped)</th>
                <th className="px-3 py-2 font-semibold">Priority (mapped)</th>
                <th className="px-3 py-2 font-semibold">Requester</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sample.map((t) => (
                <tr key={t.id}>
                  <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{t.id}</td>
                  <td className="px-3 py-2 font-medium">{t.subject}</td>
                  <td className="px-3 py-2">
                    <Badge variant="secondary" className="text-[10px]">{t.status}</Badge>
                  </td>
                  <td className="px-3 py-2">
                    <Badge variant={t.priority === 'urgent' ? 'danger' : t.priority === 'high' ? 'warning' : 'secondary'} className="text-[10px] capitalize">
                      {t.priority}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{t.requester}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="rounded-xl border border-amber-300 bg-amber-50/60 p-4 dark:border-amber-900 dark:bg-amber-950/20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div className="text-xs">
            <p className="font-semibold text-amber-900 dark:text-amber-100">
              Estimated import time: ~28 minutes
            </p>
            <p className="mt-0.5 text-amber-800/80 dark:text-amber-200/80">
              The import runs in the background — you can keep using Topiadesk while it works. Tickets become available as they finish processing. You'll get an email when the whole batch completes.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onBack}>Back</Button>
        <Button size="sm" className="bg-coral text-white hover:bg-coral-dark" onClick={onRun}>
          <Play className="h-3 w-3" />Run migration
        </Button>
      </div>
    </div>
  );
}

// ─── Step 5: running ─────────────────────────────────────────────────────────

function RunStep({ job }: { job: RunningJob }) {
  const pct = (job.processed / job.total) * 100;
  return (
    <Card>
      <CardHeader className="border-b py-3">
        <CardTitle className="text-sm">Importing from {job.source}</CardTitle>
        <p className="text-[11px] text-muted-foreground">
          Started {new Date(job.startedAt).toLocaleTimeString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-3xl font-bold tabular-nums">
              {job.processed.toLocaleString()} <span className="text-base text-muted-foreground">/ {job.total.toLocaleString()}</span>
            </p>
            <p className="text-[11px] text-muted-foreground">tickets processed · {job.failed} failures</p>
          </div>
          <div className="text-right">
            <p className="font-display text-3xl font-bold tabular-nums text-coral">{pct.toFixed(1)}%</p>
            <p className="text-[11px] text-muted-foreground">ETA {Math.max(1, Math.round((job.total - job.processed) / 80))} min</p>
          </div>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-coral transition-all duration-200" style={{ width: `${pct}%` }} />
        </div>

        {job.current && (
          <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-coral" />
            <span className="truncate text-[11px] text-muted-foreground">Importing: {job.current}</span>
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
          <MiniLog icon={Ticket}  label="Tickets"  n={job.processed} />
          <MiniLog icon={Users}   label="Contacts" n={Math.min(317, Math.floor(job.processed / 4))} />
          <MiniLog icon={Headset} label="Agents"   n={Math.min(12,  Math.floor(job.processed / 100))} />
          <MiniLog icon={Layers}  label="Assets"   n={Math.min(2841, Math.floor(job.processed * 2.2))} />
          <MiniLog icon={Globe}   label="Devices"  n={Math.min(421,  Math.floor(job.processed / 3))} />
          <MiniLog icon={Tag}     label="Tags"     n={Math.min(48,   Math.floor(job.processed / 27))} />
        </div>
      </CardContent>
    </Card>
  );
}

function MiniLog({ icon: Icon, label, n }: { icon: typeof Ticket; label: string; n: number }) {
  return (
    <div className="rounded-md border bg-card p-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <Icon className="h-3 w-3 text-coral" />
      </div>
      <p className="mt-1 font-display text-lg font-bold tabular-nums">{n.toLocaleString()}</p>
    </div>
  );
}

// ─── Step 6: done ────────────────────────────────────────────────────────────

function DoneStep({ job, onMigrateAnother }: { job: RunningJob; onMigrateAnother: () => void }) {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="mt-4 font-display text-xl font-bold">Migration complete</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {(job.total - job.failed).toLocaleString()} of {job.total.toLocaleString()} tickets imported from {job.source}.
          {job.failed > 0 && <span className="text-red-600"> {job.failed} failures — download the error log below.</span>}
        </p>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 sm:gap-3">
          {[
            { label: 'View imported tickets', href: '/' },
            { label: 'Review asset inventory', href: '/' },
            { label: 'Open monitoring NOC',    href: '/' },
            { label: 'Configure routing',      href: '/automations' },
            { label: 'Review SLA policies',    href: '/sla' },
            { label: 'Edit ticket fields',     href: '/ticket-fields' },
          ].map((a) => (
            <Button key={a.label} variant="outline" size="sm" className="h-9 text-xs" asChild>
              <a href={a.href}>{a.label}<ChevronRight className="h-3 w-3" /></a>
            </Button>
          ))}
        </div>

        <div className="mt-5 flex justify-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-3 w-3" />Download import report
          </Button>
          <Button size="sm" className="bg-coral text-white hover:bg-coral-dark" onClick={onMigrateAnother}>
            Migrate another source
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Mini helpers ────────────────────────────────────────────────────────────

function StatTile({ icon: Icon, label, value }: { icon: typeof Ticket; label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <Icon className="h-3.5 w-3.5 text-coral" />
      </div>
      <p className="mt-1.5 font-display text-2xl font-bold tabular-nums">{value}</p>
    </div>
  );
}

const SAMPLE_PREVIEW = [
  { id: '#48211', subject: 'VPN keeps disconnecting',            status: 'Open',     priority: 'high',   requester: 'sarah@acmebank.ng' },
  { id: '#48210', subject: 'Need access to S3 audit bucket',    status: 'Pending',  priority: 'medium', requester: 'daniel@safari.co.ke' },
  { id: '#48209', subject: 'Cannot install Adobe CC',           status: 'Open',     priority: 'low',    requester: 'aisha@northfield.ng' },
  { id: '#48208', subject: 'Conference room AV broken',         status: 'Open',     priority: 'high',   requester: 'marcus@kasi-pay.co.za' },
  { id: '#48207', subject: 'Phishing email — payroll update',   status: 'Open',     priority: 'urgent', requester: 'lerato@kasi-pay.co.za' },
];

const SAMPLE_SUBJECTS = [
  'VPN cert provisioning fails',
  'New laptop request for Lagos office',
  'Conference room AV broken',
  'Cannot pay invoice via Paystack',
  'Phishing email — payroll update',
  'Outlook keeps asking for password',
  'Zoom Phone audio cuts in and out',
  'Two-factor reset for departing contractor',
];
