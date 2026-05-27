'use client';

import { useQuery } from '@tanstack/react-query';
import {
  mockTickets,
  mockAssets,
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
} from './mock-data';

/**
 * The current shape of these hooks talks to a local mock layer. When the
 * backend is ready, swap the implementations to use @topiadesk/api-client.
 * Components consuming the hooks do not need to change.
 */

const delay = <T>(value: T, ms = 250): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export function useTickets() {
  return useQuery<MockTicket[]>({
    queryKey: ['tickets'],
    queryFn: () => delay(mockTickets),
  });
}

export function useTicket(id: string) {
  return useQuery<MockTicket | undefined>({
    queryKey: ['tickets', id],
    queryFn: () => delay(mockTickets.find((t) => t.id === id)),
  });
}

export function useAssets() {
  return useQuery<MockAsset[]>({
    queryKey: ['assets'],
    queryFn: () => delay(mockAssets),
  });
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
  return useQuery<MockDevice | undefined>({
    queryKey: ['monitoring', 'devices', id],
    queryFn: () => delay(mockDevices.find((d) => d.id === id)),
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
  return useQuery<TopologyData | undefined>({
    queryKey: ['monitoring', 'topology', site],
    queryFn: () => delay(mockTopologies.find((t) => t.site === site)),
  });
}

export function useUptimeTrend() {
  return useQuery({
    queryKey: ['monitoring', 'uptime-trend'],
    queryFn: () => delay(uptimeTrend, 100),
  });
}
