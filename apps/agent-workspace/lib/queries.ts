'use client';

import { useQuery } from '@tanstack/react-query';
import {
  mockTickets,
  mockAssets,
  mockMetrics,
  type MockTicket,
  type MockAsset,
  type DashboardMetrics,
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
