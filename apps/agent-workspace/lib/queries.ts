'use client';

import { useQuery } from '@tanstack/react-query';
import { useOfflineQuery } from '../app/_hooks/use-offline-query';
import {
  mockTickets,
  mockAssets,
  mockAIConfig,
  mockAISuggestions,
  mockAIActivity,
  mockAIMetrics,
  type AIAgentConfig,
  type AISuggestion,
  type AIActivityEntry,
  type AIMetrics,
  mockMetrics,
  mockLicenses,
  mockAssetDashboard,
  assetCategories,
  warrantyAlerts,
  mockDevices,
  mockMonitoringAlerts,
  mockIncidents,
  mockMaintenanceWindows,
  mockAlertRules,
  mockNOCMetrics,
  mockTopologies,
  uptimeTrend,
  ticketVolumeData,
  agentStats,
  categorySummary,
  channelSummary,
  reportSummary,
  csatSurveys,
  csatMetrics,
  mockContacts,
  kbArticles,
  mockAssetHistory,
  mockAudits,
  mockInventory,
  mockAutomations,
  mockSLAPolicies,
  mockAgentChannels,
  type MockTicket,
  type MockAsset,
  type DashboardMetrics,
  type MockLicense,
  type AssetDashboardMetrics,
  type AssetCategory,
  type WarrantyAlert,
  type MockDevice,
  type MockMonAlert,
  type MockIncident,
  type MaintenanceWindow,
  type AlertRule,
  type NOCMetrics,
  type TopologyData,
  type VolumePoint,
  type AgentStat,
  type CategoryStat,
  type ChannelStat,
  type ReportSummary,
  type CSATSurvey,
  type CSATMetrics,
  type MockContact,
  type KBArticle,
  type AssetHistoryEvent,
  type AssetAudit,
  type InventoryItem,
  type MockAutomation,
  type SLAPolicy,
  type MockAgentChannel,
  orgBranches,
  orgDepartments,
  orgRoleTemplates,
  mockOnboardings,
  mockOrgMetrics,
  type OrgBranch,
  type OrgDepartment,
  type OrgRoleTemplate,
  type OnboardingRequest,
  type OrgMetrics,
} from './mock-data';

/**
 * The current shape of these hooks talks to a local mock layer. When the
 * backend is ready, swap the implementations to use @topiadesk/api-client.
 * Components consuming the hooks do not need to change.
 */

const delay = <T>(value: T, ms = 250): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export function useTickets() {
  return useOfflineQuery<MockTicket>(
    {
      queryKey: ['tickets'],
      queryFn: () => delay(mockTickets),
    },
    { idbStore: 'tickets', cacheKey: 'tickets-list' },
  );
}

export function useTicket(id: string) {
  return useQuery<MockTicket | null>({
    queryKey: ['tickets', id],
    queryFn: () => delay(mockTickets.find((t) => t.id === id) ?? null),
  });
}

export function useAssets() {
  return useOfflineQuery<MockAsset>(
    {
      queryKey: ['assets'],
      queryFn: () => delay(mockAssets),
    },
    { idbStore: 'assets', cacheKey: 'assets-list' },
  );
}

export function useDashboardMetrics() {
  return useQuery<DashboardMetrics>({
    queryKey: ['dashboard', 'metrics'],
    queryFn: () => delay(mockMetrics),
  });
}

export function useLicenses() {
  return useQuery<MockLicense[]>({
    queryKey: ['licenses'],
    queryFn: () => delay(mockLicenses),
  });
}

export function useAssetDashboard() {
  return useQuery<AssetDashboardMetrics>({
    queryKey: ['assets', 'dashboard'],
    queryFn: () => delay(mockAssetDashboard),
  });
}

export function useAssetCategories() {
  return useQuery<AssetCategory[]>({
    queryKey: ['assets', 'categories'],
    queryFn: () => delay(assetCategories),
  });
}

export function useWarrantyAlerts() {
  return useQuery<WarrantyAlert[]>({
    queryKey: ['assets', 'warranty-alerts'],
    queryFn: () => delay(warrantyAlerts),
  });
}

// ── Monitoring ────────────────────────────────────────────────────────────────

export function useNOCMetrics() {
  return useQuery<NOCMetrics>({
    queryKey: ['monitoring', 'metrics'],
    queryFn: () => delay(mockNOCMetrics, 150),
  });
}

export function useDevices() {
  return useQuery<MockDevice[]>({
    queryKey: ['monitoring', 'devices'],
    queryFn: () => delay(mockDevices),
  });
}

export function useDevice(id: string) {
  return useQuery<MockDevice | null>({
    queryKey: ['monitoring', 'devices', id],
    queryFn: () => delay(mockDevices.find((d) => d.id === id) ?? null),
  });
}

export function useMonitoringAlerts() {
  return useQuery<MockMonAlert[]>({
    queryKey: ['monitoring', 'alerts'],
    queryFn: () => delay(mockMonitoringAlerts),
  });
}

export function useIncidents() {
  return useQuery<MockIncident[]>({
    queryKey: ['monitoring', 'incidents'],
    queryFn: () => delay(mockIncidents),
  });
}

export function useMaintenanceWindows() {
  return useQuery<MaintenanceWindow[]>({
    queryKey: ['monitoring', 'maintenance'],
    queryFn: () => delay(mockMaintenanceWindows),
  });
}

export function useAlertRules() {
  return useQuery<AlertRule[]>({
    queryKey: ['monitoring', 'alert-rules'],
    queryFn: () => delay(mockAlertRules),
  });
}

export function useTopology(site: string) {
  return useQuery<TopologyData | null>({
    queryKey: ['monitoring', 'topology', site],
    queryFn: () => delay(mockTopologies.find((t) => t.site === site) ?? null),
  });
}

export function useUptimeTrend() {
  return useQuery({
    queryKey: ['monitoring', 'uptime-trend'],
    queryFn: () => delay(uptimeTrend, 100),
  });
}

// ── Reports ───────────────────────────────────────────────────────────────────

export function useTicketVolume() {
  return useQuery<VolumePoint[]>({
    queryKey: ['reports', 'volume'],
    queryFn: () => delay(ticketVolumeData, 200),
  });
}

export function useAgentStats() {
  return useQuery<AgentStat[]>({
    queryKey: ['reports', 'agents'],
    queryFn: () => delay(agentStats, 200),
  });
}

export function useCategorySummary() {
  return useQuery<CategoryStat[]>({
    queryKey: ['reports', 'categories'],
    queryFn: () => delay(categorySummary, 150),
  });
}

export function useChannelSummary() {
  return useQuery<ChannelStat[]>({
    queryKey: ['reports', 'channels'],
    queryFn: () => delay(channelSummary, 150),
  });
}

export function useReportSummary() {
  return useQuery<ReportSummary>({
    queryKey: ['reports', 'summary'],
    queryFn: () => delay(reportSummary, 100),
  });
}

// ── CSAT ─────────────────────────────────────────────────────────────────────

export function useCSATSurveys() {
  return useQuery<CSATSurvey[]>({
    queryKey: ['csat', 'surveys'],
    queryFn: () => delay(csatSurveys, 200),
  });
}

export function useCSATMetrics() {
  return useQuery<CSATMetrics>({
    queryKey: ['csat', 'metrics'],
    queryFn: () => delay(csatMetrics, 100),
  });
}

// ── Contacts ─────────────────────────────────────────────────────────────────

export function useContacts() {
  return useQuery<MockContact[]>({
    queryKey: ['contacts'],
    queryFn: () => delay(mockContacts, 200),
  });
}

export function useContact(id: string) {
  return useQuery<MockContact | null>({
    queryKey: ['contacts', id],
    queryFn: () => delay(mockContacts.find((c) => c.id === id) ?? null),
  });
}

// ── Knowledge Base ────────────────────────────────────────────────────────────

export function useKBArticles() {
  return useQuery<KBArticle[]>({
    queryKey: ['kb', 'articles'],
    queryFn: () => delay(kbArticles, 200),
  });
}

// ── Asset history ─────────────────────────────────────────────────────────────

export function useAssetHistory(_assetId: string) {
  return useQuery<AssetHistoryEvent[]>({
    queryKey: ['assets', 'history', _assetId],
    queryFn: () => delay(mockAssetHistory, 150),
  });
}

// ── Audits ────────────────────────────────────────────────────────────────────

export function useAudits() {
  return useQuery<AssetAudit[]>({
    queryKey: ['audits'],
    queryFn: () => delay(mockAudits, 200),
  });
}

// ── Inventory ─────────────────────────────────────────────────────────────────

export function useInventory() {
  return useQuery<InventoryItem[]>({
    queryKey: ['inventory'],
    queryFn: () => delay(mockInventory, 200),
  });
}

// ── Automations ───────────────────────────────────────────────────────────────

export function useAutomations() {
  return useQuery<MockAutomation[]>({
    queryKey: ['automations'],
    queryFn: () => delay(mockAutomations, 200),
  });
}

// ── SLA Policies ──────────────────────────────────────────────────────────────

export function useSLAPolicies() {
  return useQuery<SLAPolicy[]>({
    queryKey: ['sla', 'policies'],
    queryFn: () => delay(mockSLAPolicies, 150),
  });
}

// ── Agent Channels ────────────────────────────────────────────────────────────

export function useAgentChannels() {
  return useQuery<MockAgentChannel[]>({
    queryKey: ['channels'],
    queryFn: () => delay(mockAgentChannels, 150),
  });
}

// ── AI First-Response Agent ───────────────────────────────────────────────────

export function useAIConfig() {
  return useQuery<AIAgentConfig>({
    queryKey: ['ai', 'config'],
    queryFn: () => delay(mockAIConfig, 150),
  });
}

export function useAISuggestion(ticketId: string) {
  return useQuery<AISuggestion | null>({
    queryKey: ['ai', 'suggestion', ticketId],
    queryFn: () => delay(mockAISuggestions.find((s) => s.ticketId === ticketId) ?? null),
    staleTime: 30_000,
  });
}

export function useAIActivity() {
  return useQuery<AIActivityEntry[]>({
    queryKey: ['ai', 'activity'],
    queryFn: () => delay(mockAIActivity, 200),
  });
}

export function useAIMetrics() {
  return useQuery<AIMetrics>({
    queryKey: ['ai', 'metrics'],
    queryFn: () => delay(mockAIMetrics, 150),
  });
}

// ── Smart Org Awareness / Onboarding ─────────────────────────────────────────

export function useOrgBranches() {
  return useQuery<OrgBranch[]>({
    queryKey: ['org', 'branches'],
    queryFn: () => delay(orgBranches, 100),
  });
}

export function useOrgDepartments() {
  return useQuery<OrgDepartment[]>({
    queryKey: ['org', 'departments'],
    queryFn: () => delay(orgDepartments, 100),
  });
}

export function useOrgRoleTemplates() {
  return useQuery<OrgRoleTemplate[]>({
    queryKey: ['org', 'role-templates'],
    queryFn: () => delay(orgRoleTemplates, 150),
  });
}

export function useOrgRoleTemplate(id: string) {
  return useQuery<OrgRoleTemplate | null>({
    queryKey: ['org', 'role-templates', id],
    queryFn: () => delay(orgRoleTemplates.find((r) => r.id === id) ?? null),
  });
}

export function useOnboardings() {
  return useQuery<OnboardingRequest[]>({
    queryKey: ['onboarding'],
    queryFn: () => delay(mockOnboardings, 200),
  });
}

export function useOnboarding(id: string) {
  return useQuery<OnboardingRequest | null>({
    queryKey: ['onboarding', id],
    queryFn: () => delay(mockOnboardings.find((o) => o.id === id) ?? null),
  });
}

export function useOrgMetrics() {
  return useQuery<OrgMetrics>({
    queryKey: ['org', 'metrics'],
    queryFn: () => delay(mockOrgMetrics, 100),
  });
}
