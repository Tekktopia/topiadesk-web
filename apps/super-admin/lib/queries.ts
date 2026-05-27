'use client';

import { useQuery } from '@tanstack/react-query';
import {
  mockAdminMetrics,
  mockAnnouncements,
  mockAuditLogs,
  mockFeatureFlags,
  mockPlatformUsers,
  mockPlans,
  mockRevenueTrend,
  mockSecurityEvents,
  mockSystemComponents,
  mockSystemIncidents,
  mockTenants,
  type AdminMetrics,
  type Announcement,
  type AuditLog,
  type FeatureFlag,
  type PlatformUser,
  type Plan,
  type RevenuePoint,
  type SecurityEvent,
  type SystemComponent,
  type SystemIncident,
  type Tenant,
} from './mock-data';

const delay = <T>(value: T, ms = 200): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export function useAdminMetrics() {
  return useQuery<AdminMetrics>({
    queryKey: ['admin', 'metrics'],
    queryFn: () => delay(mockAdminMetrics, 150),
  });
}

export function useTenants() {
  return useQuery<Tenant[]>({
    queryKey: ['admin', 'tenants'],
    queryFn: () => delay(mockTenants),
  });
}

export function useTenant(id: string) {
  return useQuery<Tenant | undefined>({
    queryKey: ['admin', 'tenants', id],
    queryFn: () => delay(mockTenants.find((t) => t.id === id)),
  });
}

export function usePlans() {
  return useQuery<Plan[]>({
    queryKey: ['admin', 'plans'],
    queryFn: () => delay(mockPlans),
  });
}

export function usePlatformUsers() {
  return useQuery<PlatformUser[]>({
    queryKey: ['admin', 'users'],
    queryFn: () => delay(mockPlatformUsers),
  });
}

export function useFeatureFlags() {
  return useQuery<FeatureFlag[]>({
    queryKey: ['admin', 'feature-flags'],
    queryFn: () => delay(mockFeatureFlags),
  });
}

export function useSystemComponents() {
  return useQuery<SystemComponent[]>({
    queryKey: ['admin', 'system', 'components'],
    queryFn: () => delay(mockSystemComponents, 150),
  });
}

export function useSystemIncidents() {
  return useQuery<SystemIncident[]>({
    queryKey: ['admin', 'system', 'incidents'],
    queryFn: () => delay(mockSystemIncidents, 150),
  });
}

export function useAuditLogs() {
  return useQuery<AuditLog[]>({
    queryKey: ['admin', 'audit-logs'],
    queryFn: () => delay(mockAuditLogs),
  });
}

export function useAnnouncements() {
  return useQuery<Announcement[]>({
    queryKey: ['admin', 'announcements'],
    queryFn: () => delay(mockAnnouncements),
  });
}

export function useSecurityEvents() {
  return useQuery<SecurityEvent[]>({
    queryKey: ['admin', 'security'],
    queryFn: () => delay(mockSecurityEvents),
  });
}

export function useRevenueTrend() {
  return useQuery<RevenuePoint[]>({
    queryKey: ['admin', 'revenue', 'trend'],
    queryFn: () => delay(mockRevenueTrend, 150),
  });
}
